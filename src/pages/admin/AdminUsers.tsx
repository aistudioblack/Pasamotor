import { adminFetch } from "@/lib/api-client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/hooks/use-toast";
import { 
  ShieldAlert, 
  Users, 
  Plus, 
  Trash2, 
  Key, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Lock, 
  ShieldCheck, 
  Info 
} from "lucide-react";

const AdminUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'admin' });

  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

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

  // Role states
  const roleOptions = [
    { value: 'admin', label: 'Admin (Tam Yetki)' },
    { value: 'senior_manager', label: 'Senior Manager (Kıdemli Yönetici)' },
    { value: 'manager', label: 'Yönetici (Servis Kapatma vb.)' },
    { value: 'mechanic', label: 'Mekanik Ustası (Saha / Mobil Erişim)' },
    { value: 'editor', label: 'İçerik Editörü' },
    { value: 'user', label: 'Normal Kullanıcı (Sınırlı Yetki)' }
  ];

  const mapAppRoleToDbRole = (appRole: string): 'admin' | 'moderator' | 'user' => {
    if (appRole === 'admin' || appRole === 'senior_manager') return 'admin';
    if (appRole === 'manager' || appRole === 'editor') return 'moderator';
    return 'user';
  };

  const handleCreateUser = async (e: any) => {
    e.preventDefault();
    try {
       const { data, error } = await supabase.auth.signUp({
         email: form.email,
         password: form.password
       });
       if (error) throw error;
       
       if (data?.user) {
         const dbRole = mapAppRoleToDbRole(form.role);
         // Create or update user row with correct safe type for 'role' and specialized name representing exact application role
         const { error: upsertError } = await supabase.from('users').upsert({ 
           id: data.user.id, 
           email: form.email, 
           role: dbRole,
           name: form.role // Here we store the exact, fine-grained application role
         });
         if (upsertError) throw upsertError;
       }
       
       toast({ title: "Başarılı", description: "Kullanıcı oluşturuldu!" });
       setShowModal(false);
       setForm({ email: '', password: '', role: 'admin' });
       loadUsers();
    } catch (error: any) {
       toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdateRole = async (id: string, newRole: string) => {
    try {
      const dbRole = mapAppRoleToDbRole(newRole);
      const { error } = await supabase.from('users').update({ 
        role: dbRole,
        name: newRole // Save exact role to name column
      }).eq('id', id);
      if (error) throw error;
      toast({ title: "Başarılı", description: "Kullanıcı rolü güncellendi." });
      loadUsers();
    } catch (error: any) {
      toast({ title: "Hata", description: `Rol güncellenirken hata oluştu: ${error.message}`, variant: "destructive" });
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
    
    if (!confirm(`${email} kullanıcısını silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await supabase.from('users').delete().eq('id', id);
      toast({ title: "Kullanıcı silindi" });
      loadUsers();
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    }
  };

  const handleUpdatePassword = async (e: any) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;

    if (newPassword.length < 6) {
      toast({
        title: "Şifre Hatası",
        description: "Şifre en az 6 karakter olmalıdır.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Şifre Uyuşmazlığı",
        description: "Yeni şifre ile şifre doğrulaması uyuşmuyor.",
        variant: "destructive"
      });
      return;
    }

    setChangingPassword(true);
    try {
      const response = await adminFetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, newPassword })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Şifre güncellenirken bir hata oldu.");

      toast({
        title: "Başarılı",
        description: `${selectedUser.email} kullanıcısının şifresi başarıyla değiştirildi.`,
      });
      setShowPasswordModal(false);
      setNewPassword("");
      setConfirmPassword("");
      setShowPassword(false);
      setSelectedUser(null);
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setChangingPassword(false);
    }
  };

  // Safe checks for password requirements
  const hasMinLength = newPassword.length >= 6;
  const hasLetterAndNumber = /[A-Za-z]/.test(newPassword) && /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  // Compute overall score (0 to 3)
  const strengthScore = 
    (hasMinLength ? 1 : 0) + 
    (hasLetterAndNumber ? 1 : 0) + 
    (newPassword.length >= 10 ? 1 : 0);

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { label: "Girilmedi", color: "text-muted-foreground", bg: "bg-muted" };
    if (strengthScore === 1) return { label: "Zayıf", color: "text-red-500", bg: "bg-red-500" };
    if (strengthScore === 2) return { label: "Orta", color: "text-amber-500", bg: "bg-amber-500" };
    return { label: "Çok Güçlü", color: "text-emerald-500", bg: "bg-emerald-500" };
  };

  const strength = getStrengthLabel();

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
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/95 transition-colors">
           <Plus className="w-4 h-4" />
           Yeni Kullanıcı Ekle
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
               {users.map((u) => {
                  const userRole = (u.name && ['admin', 'senior_manager', 'manager', 'mechanic', 'editor', 'user'].includes(u.name)) 
                    ? u.name 
                    : (u.role || 'user');
                    
                  return (
                     <tr key={u.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium">{u.email}</td>
                        <td className="p-4">
                           {u.email !== "ahmetcafoglu@hotmail.com" ? (
                              <select 
                                value={userRole}
                                onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                className="px-2.5 py-1 rounded bg-muted text-foreground text-xs font-semibold uppercase tracking-wider outline-none border border-border"
                              >
                                <option value="admin">Admin</option>
                                <option value="senior_manager">Senior Manager</option>
                                <option value="manager">Yönetici</option>
                                <option value="mechanic">Mekanik Ustası</option>
                                <option value="editor">Editör</option>
                                <option value="user">Kullanıcı</option>
                              </select>
                           ) : (
                              <span className="px-2.5 py-1 rounded bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">Super Admin</span>
                           )}
                        </td>
                        <td className="p-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                             {u.email !== "ahmetcafoglu@hotmail.com" ? (
                               <>
                                 <button 
                                   onClick={() => {
                                     setSelectedUser(u);
                                     setNewPassword("");
                                     setConfirmPassword("");
                                     setShowPassword(false);
                                     setShowPasswordModal(true);
                                   }}
                                   className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors duration-200" 
                                   title="Şifre Değiştir"
                                 >
                                   <Key className="w-4 h-4" />
                                 </button>
                                 <button 
                                   onClick={() => handleDelete(u.id, u.email)} 
                                   className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors duration-200" 
                                   title="Kullanıcıyı Sil"
                                 >
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               </>
                             ) : (
                               <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded border border-border">Süper Yetkili (Dokunulamaz)</span>
                             )}
                           </div>
                        </td>
                     </tr>
                  );
               })}
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
           <div className="glass-card w-full max-w-md p-6 rounded-2xl shadow-2xl border border-border">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <Lock className="w-6 h-6 text-primary" />
                Yeni Kullanıcı Ekle
              </h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" required className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Rol / Yetki</label>
                    <select 
                      className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none" 
                      value={form.role} 
                      onChange={e => setForm({...form, role: e.target.value})}
                    >
                       {roleOptions.map(opt => (
                         <option key={opt.value} value={opt.value}>{opt.label}</option>
                       ))}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Şifre</label>
                    <input type="password" required className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
                 </div>
                 <div className="flex gap-2 justify-end pt-4">
                    <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-muted rounded-lg transition-colors">İptal</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">Oluştur</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
           <div className="glass-card w-full max-w-md p-6 rounded-2xl shadow-2xl border border-border/80">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                  <Key className="w-6 h-6 text-amber-500 animate-pulse" />
                  Şifre Değiştir
                </h2>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword("");
                    setConfirmPassword("");
                    setSelectedUser(null);
                  }}
                  className="p-1 px-2 text-muted-foreground hover:bg-muted rounded-md text-xs"
                >
                  Kapat
                </button>
              </div>
              
              <div className="flex gap-2 items-start bg-muted/60 border border-border rounded-lg p-3 mb-6">
                <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-normal">
                  <strong className="text-foreground">{selectedUser.email}</strong> yöneticisi için yeni bir şifre tanımlıyorsunuz. Güvenlik kurallarına uyulması önerilir.
                </p>
              </div>
              
              <form onSubmit={handleUpdatePassword} className="space-y-5">
                 {/* New Password Input with Eye Icon */}
                 <div className="relative">
                    <label className="block text-sm font-semibold mb-1.5 text-foreground flex justify-between items-center">
                      <span>Yeni Şifre</span>
                      <span className={`text-xs font-semibold ${strength.color}`}>{strength.label}</span>
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required 
                        placeholder="Güçlü bir şifre girin" 
                        className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-background border border-border focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all" 
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Progress Bar Strength */}
                    {newPassword.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${strength.bg}`}
                            style={{ width: `${(strengthScore / 3) * 100}%` }}
                          />
                        </div>

                        {/* Interactive Requirements Checklist */}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
                          <div className="flex items-center gap-1.5 text-[11px]">
                            {hasMinLength ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-500/80" />
                            )}
                            <span className={hasMinLength ? "text-emerald-500" : "text-muted-foreground"}>En az 6 Karakter</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px]">
                            {hasLetterAndNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-red-500/80" />
                            )}
                            <span className={hasLetterAndNumber ? "text-emerald-500" : "text-muted-foreground"}>Harf ve Rakam</span>
                          </div>
                        </div>
                      </div>
                    )}
                 </div>

                 {/* Confirm Password Input */}
                 <div>
                    <label className="block text-sm font-semibold mb-1.5 text-foreground">
                      Yeni Şifre (Tekrar)
                    </label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        required 
                        disabled={newPassword.length === 0}
                        placeholder="Yeni şifreyi tekrar girin" 
                        className={`w-full px-4 py-2.5 rounded-lg bg-background border transition-all outline-none ${
                          confirmPassword.length > 0
                            ? passwordsMatch
                              ? "border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                              : "border-rose-400 focus:ring-2 focus:ring-rose-400/20"
                            : "border-border focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        }`}
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                      />
                      {confirmPassword.length > 0 && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {passwordsMatch ? (
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <X className="w-4 h-4 text-rose-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {confirmPassword.length > 0 && !passwordsMatch && (
                      <p className="text-[11px] text-rose-400 mt-1">Girdiğiniz şifreler uyuşmuyor.</p>
                    )}
                 </div>

                 {/* Actions */}
                 <div className="flex gap-2.5 justify-end pt-4 border-t border-border">
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowPasswordModal(false);
                        setNewPassword("");
                        setConfirmPassword("");
                        setSelectedUser(null);
                      }} 
                      className="px-4 py-2 border border-border hover:bg-muted text-foreground rounded-lg transition-colors duration-150"
                      disabled={changingPassword}
                    >
                      İptal
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 active:scale-[0.98] transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/10 disabled:opacity-50 disabled:pointer-events-none"
                      disabled={changingPassword || !hasMinLength || !passwordsMatch}
                    >
                      {changingPassword ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                          Güncelleniyor...
                        </>
                      ) : (
                        "Şifreyi Güncelle"
                      )}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminUsers;
