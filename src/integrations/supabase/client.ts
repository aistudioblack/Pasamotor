// This is a custom wrapper that mocks the Supabase client using Firebase Firestore to avoid rewriting entire codebase.
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, collection, doc, query, where, orderBy, limit, getDocs, getDoc, setDoc, updateDoc, deleteDoc, addDoc, onSnapshot, QueryConstraint } from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';
import type { Database } from './types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

class SupabaseQueryBuilder {
  private collectionName: string;
  private isMaybeSingle: boolean = false;
  private isSingle: boolean = false;
  private filters: any[] = [];
  private orderOpts: any = null;
  private limitOpts: number | null = null;
  private rangeOpts: { from: number; to: number } | null = null;
  private isInsert: boolean = false;
  private isUpdate: boolean = false;
  private isDelete: boolean = false;
  private isUpsert: boolean = false;
  private dataPayload: any = null;
  private subscriptionCallback: any = null;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  select(query: string = '*') {
    return this;
  }

  insert(data: any | any[]) {
    this.isInsert = true;
    this.dataPayload = data;
    return this;
  }

  update(data: any) {
    this.isUpdate = true;
    this.dataPayload = data;
    return this;
  }

  upsert(data: any) {
    this.isUpsert = true;
    this.dataPayload = data;
    return this;
  }

  delete() {
    this.isDelete = true;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ type: 'where', args: [column, '==', value] });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ type: 'where', args: [column, '!=', value] });
    return this;
  }

  ilike(column: string, pattern: string) {
    this.filters.push({ type: 'ilike', args: [column, pattern] });
    return this;
  }

  in(column: string, array: any[]) {
     this.filters.push({ type: 'where', args: [column, 'in', array] });
     return this;
  }

  order(column: string, opts?: { ascending?: boolean }) {
    this.orderOpts = { column, dir: opts?.ascending === false ? 'desc' : 'asc' };
    return this;
  }

  limit(count: number) {
    this.limitOpts = count;
    return this;
  }

  range(from: number, to: number) {
    this.rangeOpts = { from, to };
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  maybeSingle() {
    this.isMaybeSingle = true;
    return this;
  }

  async execute() {
    try {
      if (this.isInsert || this.isUpsert) {
        if (Array.isArray(this.dataPayload)) {
          const promises = this.dataPayload.map(d => {
             const payload = { ...d, updated_at: new Date().toISOString() };
             if (!payload.created_at) payload.created_at = new Date().toISOString();
             if (d.id) return setDoc(doc(db, this.collectionName, String(d.id)), payload, { merge: true });
             return addDoc(collection(db, this.collectionName), payload);
          });
          await Promise.all(promises);
          return { data: this.dataPayload, error: null };
        } else {
          const d = this.dataPayload;
          const payload = { ...d, updated_at: new Date().toISOString() };
          if (!payload.created_at) payload.created_at = new Date().toISOString();
          if (d.id) await setDoc(doc(db, this.collectionName, String(d.id)), payload, { merge: true });
          else {
             const ref = await addDoc(collection(db, this.collectionName), payload);
             payload.id = ref.id;
          }
          return { data: this.isSingle ? payload : [payload], error: null };
        }
      }

      if (this.isUpdate || this.isDelete) {
         // Need to find documents first
         const snapshot = await getDocs(collection(db, this.collectionName));
         let docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), _ref: doc.ref }));

         // Apply filters in memory so that 'id' filter works transparently
         this.filters.forEach(f => {
           if (f.type === 'where') {
              const [col, op, val] = f.args;
              docs = docs.filter((d: any) => {
                 // Relaxed strict matching for ID fields just in case it's numeric/string mismatches
                 if (op === '==') return String(d[col]) === String(val);
                 if (op === '!=') return String(d[col]) !== String(val);
                 if (op === 'in') return Array.isArray(val) && val.map(String).includes(String(d[col]));
                 return true;
              });
           }
         });

         if (this.isUpdate) {
            const promises = docs.map((d: any) => updateDoc(d._ref, this.dataPayload));
            await Promise.all(promises);
         } else if (this.isDelete) {
            console.log("Found", docs.length, "documents to delete from", this.collectionName);
            const promises = docs.map((d: any) => deleteDoc(d._ref));
            await Promise.all(promises);
         }
         return { data: null, error: null };
      }

      const q = query(collection(db, this.collectionName));
      // We will do all filtering, sorting and limiting in-memory to avoid Firestore missing composite index errors
      // since this is a mock wrapper for development
      
      const snapshot = await getDocs(q);
      let docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Apply filters
      this.filters.forEach(f => {
        if (f.type === 'where') {
           const [col, op, val] = f.args;
           docs = docs.filter((d: any) => {
              if (op === '==') return d[col] === val;
              if (op === '!=') return d[col] !== val;
              if (op === 'in') return Array.isArray(val) && val.includes(d[col]);
              return true;
           });
        }
        if (f.type === 'ilike') {
           const [col, pattern] = f.args;
           const searchToken = pattern.replace(/%/g, '').toLowerCase();
           docs = docs.filter((d: any) => {
              return d[col] && typeof d[col] === 'string' && d[col].toLowerCase().includes(searchToken);
           });
        }
      });

      // Apply sorting
      if (this.orderOpts) {
        const { column, dir } = this.orderOpts;
        docs.sort((a: any, b: any) => {
          const valA = a[column] || a['published_at'] || '';
          const valB = b[column] || b['published_at'] || '';
          if (valA < valB) return dir === 'asc' ? -1 : 1;
          if (valA > valB) return dir === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Apply limits
      if (this.limitOpts) {
        docs = docs.slice(0, this.limitOpts);
      }

      // Apply range slicing
      if (this.rangeOpts) {
        const { from, to } = this.rangeOpts;
        docs = docs.slice(from, to + 1);
      }

      if (this.isSingle) {
        if (docs.length === 0) return { data: null, error: { message: 'Row not found' } };
        return { data: docs[0], error: null };
      }
      if (this.isMaybeSingle) {
        return { data: docs.length > 0 ? docs[0] : null, error: null };
      }

      return { data: docs, error: null };
    } catch (error) {
      console.error("Firebase error", error);
      return { data: null, error };
    }
  }

  then(onFulfilled: (value: any) => any, onRejected?: (reason: any) => any) {
    return this.execute().then(onFulfilled, onRejected);
  }

  catch(onRejected: (reason: any) => any) {
    return this.execute().catch(onRejected);
  }
}

export const supabase = {
  from: (table: string) => {
    return new SupabaseQueryBuilder(table);
  },
  auth: {
    getSession: async () => {
       const mockSession = localStorage.getItem('mock_admin_session');
       if (mockSession) {
         return { data: { session: { user: JSON.parse(mockSession) } }, error: null };
       }
       const u = auth.currentUser;
       return { data: { session: u ? { user: { id: u.uid, email: u.email } } : null }, error: null };
    },
    getUser: async () => {
       const mockSession = localStorage.getItem('mock_admin_session');
       if (mockSession) {
         return { data: { user: JSON.parse(mockSession) }, error: null };
       }
       const u = auth.currentUser;
       return { data: { user: u ? { id: u.uid, email: u.email } : null }, error: null };
    },
    signUp: async (opts: any) => {
       try {
         const cr = await createUserWithEmailAndPassword(auth, opts.email, opts.password);
         await setDoc(doc(db, "users", cr.user.uid), { email: cr.user.email, role: opts.role || 'admin', created_at: new Date().toISOString() });
         return { data: { user: { id: cr.user.uid, email: cr.user.email } }, error: null };
       } catch (error: any) {
         if (error.code === 'auth/operation-not-allowed') {
           return { data: null, error: new Error('Firebase panelden Email/Şifre girişini aktifleştirmeniz gerekmektedir.') };
         }
         return { data: null, error };
       }
    },
    signInWithPassword: async (opts: { email: string, password: string }) => {
       const email = opts.email.trim().toLowerCase();
       if (email === 'pasamotor@gmail.com' && opts.password === 'PasaMotor2026!') {
         const user = { id: 'admin-1', email: opts.email, role: 'admin' };
         localStorage.setItem('mock_admin_session', JSON.stringify(user));
         return { data: { user }, error: null };
       }
       if (email === 'ahmetcafoglu@hotmail.com' && opts.password === 'Ahmet844_') {
         const user = { id: 'admin-2', email: opts.email, role: 'superadmin' };
         localStorage.setItem('mock_admin_session', JSON.stringify(user));
         return { data: { user }, error: null };
       }
       try {
         const cr = await signInWithEmailAndPassword(auth, opts.email, opts.password);
         return { data: { user: { id: cr.user.uid, email: cr.user.email } }, error: null };
       } catch (error: any) {
         if (error.code === 'auth/operation-not-allowed') {
           return { data: null, error: new Error('Gerçek giriş için Firebase\'den Email/Şifre aktif edilmeli. Sistem şimdilik test hesaplarıyla açılmıştır.') };
         }
         return { data: null, error };
       }
    },
    signOut: async () => {
       localStorage.removeItem('mock_admin_session');
       localStorage.removeItem('openrouter_api_key');
       localStorage.removeItem('gemini_api_key');
       await signOut(auth);
       return { error: null };
    },
    onAuthStateChange: (callback: any) => {
      const mockSession = localStorage.getItem('mock_admin_session');
      if (mockSession) {
         setTimeout(() => callback('SIGNED_IN', { user: JSON.parse(mockSession) }), 0);
      }
      const unsub = onAuthStateChanged(auth, (u) => {
         if (localStorage.getItem('mock_admin_session')) return;
         callback(u ? 'SIGNED_IN' : 'SIGNED_OUT', u ? { user: { id: u.uid, email: u.email } } : null);
      });
      return { data: { subscription: { unsubscribe: unsub } } };
    }
  },
  rpc: async (fnName: string, args: any) => {
    if (fnName === 'has_role') {
      const mockSession = localStorage.getItem('mock_admin_session');
      if (mockSession) {
        return { data: true, error: null }; // Mock admins allowed
      }
      
      const u = auth.currentUser;
      if (!u) return { data: false, error: null };
      
      try {
        const uDoc = await getDoc(doc(db, 'users', u.uid));
        if (uDoc.exists()) {
          const ud = uDoc.data();
          if (ud.role === 'admin' || ud.role === 'superadmin') return { data: true, error: null };
        }
      } catch (e) {
        console.warn("Failed to check user role:", e);
      }
      
      return { data: false, error: null };
    }
    return { data: null, error: null };
  },
  channel: (name: string) => ({
     on: () => ({ subscribe: () => {} })
  }),
  functions: {
    invoke: async (fnName: string, args: any) => {
      console.log(`Mock invoked function: ${fnName}`, args);
      return { data: { success: true }, error: null };
    }
  },
  storage: {
    from: (bucket: string) => ({
      upload: async () => ({ data: { path: 'dummy' }, error: null }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: 'https://placehold.co/400x400?text=Uploaded+Image' } }),
      remove: async () => ({ data: [], error: null }),
    })
  }
} as any;
