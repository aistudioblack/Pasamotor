import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { dbClient } from './db-client';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/webmasters.readonly');
provider.addScope('https://www.googleapis.com/auth/analytics.readonly');
provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline' // though we don't necessarily need refresh token right now, it helps
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // Try loading from Supabase if cache is empty
        const storedToken = await loadTokenFromSupabase();
        if (storedToken) {
          cachedAccessToken = storedToken;
          if (onAuthSuccess) onAuthSuccess(user, storedToken);
        } else if (!isSigningIn) {
          cachedAccessToken = null;
          if (onAuthFailure) onAuthFailure();
        }
      }
    } else {
      // Even if user is not authenticated in Firebase, we can check if there's a token stored in Supabase
      const storedToken = await loadTokenFromSupabase();
      if (storedToken) {
        cachedAccessToken = storedToken;
        const mockUser = { email: 'planzerotbt@gmail.com', displayName: 'Pasa Motor SEO Admin' } as any;
        if (onAuthSuccess) onAuthSuccess(mockUser, storedToken);
      } else {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    }
  });
};

export const saveTokenToSupabase = async (token: string, email: string): Promise<boolean> => {
  try {
    const { error } = await dbClient.from('site_content').upsert({
      page_key: 'google_oauth_settings',
      title: 'Google OAuth Settings',
      sections: {
        accessToken: token,
        email: email,
        updated_at: new Date().toISOString()
      }
    });

    if (error) {
      console.error('Failed to save Google token to Supabase:', error);
      return false;
    }
    console.log('Google Access Token successfully persisted to Supabase.');
    return true;
  } catch (err) {
    console.error('Error saving Google token to Supabase:', err);
    return false;
  }
};

export const loadTokenFromSupabase = async (): Promise<string | null> => {
  try {
    const { data, error } = await dbClient
      .from('site_content')
      .select('sections')
      .eq('page_key', 'google_oauth_settings')
      .maybeSingle();

    if (!error && data && data.sections) {
      const sections = data.sections as any;
      if (sections.accessToken) {
        return sections.accessToken;
      }
    }
  } catch (err) {
    console.error('Error loading Google token from Supabase:', err);
  }
  return null;
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    await saveTokenToSupabase(cachedAccessToken, result.user.email || 'planzerotbt@gmail.com');
    
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (error?.code !== 'auth/popup-closed-by-user') {
      console.error('Sign in error:', error);
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken) return cachedAccessToken;
  return await loadTokenFromSupabase();
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  try {
    // Delete stored credentials on logout
    await dbClient.from('site_content').delete().eq('page_key', 'google_oauth_settings');
  } catch (err) {
    console.error('Error removing Google token from Supabase during logout:', err);
  }
};
