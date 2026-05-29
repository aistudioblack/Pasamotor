import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dbClient } from "@/lib/firebase-client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/pasa-motor-logo.webp";

const REMEMBER_KEY = "pm_admin_remember";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dbClient.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin");
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await dbClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0");
      toast({ title: "Giriş başarılı", description: "Yönlendiriliyorsunuz..." });
      navigate("/admin");
    } catch (err: any) {
      toast({
        title: "Giriş başarısız",
        description: err.message || "E-posta veya şifre hatalı.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ background: "var(--gradient-primary)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="Paşa Motor" className="w-24 h-auto mx-auto mb-4" style={{ mixBlendMode: "screen" }} />
          <h1 className="font-heading font-bold text-2xl text-foreground">Yönetim Paneli</h1>
          <p className="text-sm text-muted-foreground mt-1">Paşa Motor admin girişi</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="E-posta adresiniz"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-muted accent-primary"
              />
              Beni hatırla
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition glow-red"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Giriş Yap
            </button>
          </form>

          <p className="mt-4 text-xs text-muted-foreground text-center">
            🔒 Yalnızca yetkili yöneticiler giriş yapabilir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
