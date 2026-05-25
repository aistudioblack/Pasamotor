import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, Users, Plus, Trash2, Key } from "lucide-react";

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'admin' });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e: any) => {
    e.preventDefault();
    try {
       const { error } = await supabase.auth.signUp({
         email: form.email,
         password: form.password
       });
       if (error) throw error;
       toast({ title: "Başarılı", description: "Admin oluşturuldu!" });
       setShowModal(false);
       loadUsers();
    } catch (error: any) {
       toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, email: string) => {
    if (email === "ahmetcafoglu@hotmail.com") {
      toast({ 
        title: "Hata", 
        description: "Süper Admin (ahmetcafoglu@hotmail.com) yetkisi ve hesabı silinemez ya da değiştirilemez!", 
        variant: "destructive" 
      });
      return;
    }
    await supabase.from('users').delete().eq('id', id);
    toast({ title: "Kullanıcı silindi" });
    loadUsers();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Yönetici ve Kullanıcılar
          </h1>
          <p className="text-muted-foreground mt-2">Sisteme erişebilecek admin yetkilerini yönetin.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90">
           <Plus className="w-4 h-4" />
           Yeni Yönetici Ekle
        </button>
      </div>

      <div className="glass-card rounded-xl border border-border overflow-hidden overflow-x-auto">
         <table className="w-full text-left text-sm whitespace-nowrap min-w-[500px]">
            <thead className="bg-muted text-muted-foreground">
               <tr>
                  <th className="p-4 font-semibold">Email</th>
                  <th className="p-4 font-semibold">Rol</th>
                  <th className="p-4 font-semibold text-right">İşlemler</th>
               </tr>
            </thead>
            <tbody>
               {users.map((u) => (
                  <tr key={u.id} className="border-t border-border">
                     <td className="p-4 font-medium">{u.email}</td>
                     <td className="p-4">
                        <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">{u.role || 'user'}</span>
                     </td>
                     <td className="p-4 text-right">
                        {u.email !== "ahmetcafoglu@hotmail.com" ? (
                           <button onClick={() => handleDelete(u.id, u.email)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg" title="Kullanıcıyı Sil">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        ) : (
                           <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded border border-border">Süper Yetkili (Dokunulamaz)</span>
                        )}
                     </td>
                  </tr>
               ))}
               {users.length === 0 && (
                  <tr>
                     <td colSpan={3} className="p-8 text-center text-muted-foreground">Henüz kayıtlı kullanıcı yok. Sistemi varsayılan verilerle test ediyorsunuz.</td>
                  </tr>
               )}
            </tbody>
         </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
           <div className="glass-card w-full max-w-md p-6 rounded-2xl shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">Yeni Yönetici</h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" required className="w-full px-4 py-2 rounded-lg bg-background border border-border" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Şifre</label>
                    <input type="password" required className="w-full px-4 py-2 rounded-lg bg-background border border-border" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                 </div>
                 <div className="flex gap-2 justify-end pt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-muted rounded-lg">İptal</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90">Oluştur</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
