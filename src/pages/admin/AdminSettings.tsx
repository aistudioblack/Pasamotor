import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/firebase-client";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Loader2 } from "lucide-react";

const AdminSettings = () => {
  const { toast } = useToast();
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = (): string | null => {
    if (newPwd.length < 8) return "Yeni şifre en az 8 karakter olmalı.";
    if (!/[A-Z]/.test(newPwd)) return "Yeni şifre en az bir büyük harf içermeli.";
    if (!/[a-z]/.test(newPwd)) return "Yeni şifre en az bir küçük harf içermeli.";
    if (!/[0-9]/.test(newPwd)) return "Yeni şifre en az bir rakam içermeli.";
    if (newPwd !== confirmPwd) return "Yeni şifreler birbiriyle eşleşmiyor.";
    return null;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast({ title: "Geçersiz şifre", description: err, variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      // Re-authenticate with current password
      const { data: userData } = await dbClient.auth.getUser();
      const email = userData.user?.email;
      if (!email) throw new Error("Oturum bulunamadı");

      const { error: signInErr } = await dbClient.auth.signInWithPassword({
        email,
        password: currentPwd,
      });
      if (signInErr) {
        toast({ title: "Mevcut şifre hatalı", variant: "destructive" });
        setLoading(false);
        return;
      }

      const { error: updErr } = await dbClient.auth.updateUser({ password: newPwd });
      if (updErr) throw updErr;

      toast({ title: "Şifre güncellendi", description: "Yeni şifrenizle giriş yapabilirsiniz." });
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    } catch (e: any) {
      toast({
        title: "Güncellenemedi",
        description: e?.message ?? "Bilinmeyen hata",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <KeyRound className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Ayarlar</h1>
            <p className="text-sm text-muted-foreground">Hesap ve güvenlik ayarları</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h2 className="font-heading font-semibold text-foreground mb-4">Şifre Değiştir</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Mevcut Şifre</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Yeni Şifre</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground mt-1">
                En az 8 karakter, büyük harf, küçük harf ve rakam içermeli.
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Yeni Şifre (Tekrar)</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Şifreyi Güncelle
            </button>
          </form>
        </div>



      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
