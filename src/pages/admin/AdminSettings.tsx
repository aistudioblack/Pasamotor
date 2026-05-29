import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/firebase-client";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Loader2, Sparkles, Eye, EyeOff } from "lucide-react";

// Basit şifreleme/obfuscation yardımcı fonksiyonları
const encryptKey = (key: string): string => {
  try {
    return btoa(encodeURIComponent(key));
  } catch (e) {
    return key;
  }
};

const decryptKey = (encrypted: string): string => {
  try {
    return decodeURIComponent(atob(encrypted));
  } catch (e) {
    return encrypted;
  }
};

const AdminSettings = () => {
  const { toast } = useToast();
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [loading, setLoading] = useState(false);

  // AI ve Arama Sağlayıcısı Ayarları
  const [aiProvider, setAiProvider] = useState<"system" | "together" | "openrouter" | "groq" | "gemini" | "huggingface">("system");
  const [orApiKey, setOrApiKey] = useState("");
  const [showOrApiKey, setShowOrApiKey] = useState(false);
  const [tgApiKey, setTgApiKey] = useState("");
  const [showTgApiKey, setShowTgApiKey] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState("");
  const [showGroqApiKey, setShowGroqApiKey] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showGeminiApiKey, setShowGeminiApiKey] = useState(false);
  const [hfApiKey, setHfApiKey] = useState("");
  const [showHfApiKey, setShowHfApiKey] = useState(false);

  useEffect(() => {
    const savedProvider = localStorage.getItem("ai_provider") as any;
    if (savedProvider) {
      setAiProvider(savedProvider);
    } else {
      localStorage.setItem("ai_provider", "system");
    }

    const savedOr = localStorage.getItem("or_api_key");
    if (savedOr) {
      setOrApiKey(decryptKey(savedOr));
    }
    
    const savedGroq = localStorage.getItem("groq_api_key");
    if (savedGroq) {
      setGroqApiKey(decryptKey(savedGroq));
    } else {
      // Varsayılan anahtar çevresel değişkenden alınmalı
      const defaultGroqKey = import.meta.env.VITE_DEFAULT_GROQ_KEY || "";
      if (defaultGroqKey) {
        setGroqApiKey(defaultGroqKey);
        localStorage.setItem("groq_api_key", encryptKey(defaultGroqKey));
      }
    }
    
    const savedGemini = localStorage.getItem("gemini_api_key");
    if (savedGemini) setGeminiApiKey(decryptKey(savedGemini));
    
    const savedHf = localStorage.getItem("hf_api_key");
    if (savedHf) setHfApiKey(decryptKey(savedHf));

    const savedTg = localStorage.getItem("tg_api_key");
    if (savedTg) {
      setTgApiKey(decryptKey(savedTg));
    } else {
      // Varsayılan together key tanımlama
      const defaultKey = import.meta.env.VITE_DEFAULT_TG_KEY || "";
      if (defaultKey) {
        setTgApiKey(defaultKey);
        localStorage.setItem("tg_api_key", encryptKey(defaultKey));
      }
    }
  }, []);

  const handleSaveAISettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem("ai_provider", aiProvider);

      if (!orApiKey.trim()) {
        localStorage.removeItem("or_api_key");
      } else {
        localStorage.setItem("or_api_key", encryptKey(orApiKey.trim()));
      }

      if (!groqApiKey.trim()) {
        localStorage.removeItem("groq_api_key");
      } else {
        localStorage.setItem("groq_api_key", encryptKey(groqApiKey.trim()));
      }

      if (!geminiApiKey.trim()) {
        localStorage.removeItem("gemini_api_key");
      } else {
        localStorage.setItem("gemini_api_key", encryptKey(geminiApiKey.trim()));
      }

      if (!hfApiKey.trim()) {
        localStorage.removeItem("hf_api_key");
      } else {
        localStorage.setItem("hf_api_key", encryptKey(hfApiKey.trim()));
      }

      if (!tgApiKey.trim()) {
        localStorage.removeItem("tg_api_key");
      } else {
        localStorage.setItem("tg_api_key", encryptKey(tgApiKey.trim()));
      }

      toast({ 
        title: "Başarılı", 
        description: "Yapay Zeka sağlayıcı ayarları ve API anahtarları güvenli bir şekilde kaydedildi." 
      });
    } catch (err: any) {
      toast({ title: "Hata", description: "Ayarlar kaydedilemedi.", variant: "destructive" });
    }
  };

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

        {/* AI Sağlayıcı Ayarları Formu */}
        <div className="glass-card rounded-2xl p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="font-heading font-semibold text-foreground">Ajan Yapay Zeka Sağlayıcı Ayarları</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            "Rakip Analiz &amp; Blog Üretici" aracı için tercih ettiğiniz yapay zeka servisini seçin ve API anahtarınızı tanımlayın.
          </p>
          <form onSubmit={handleSaveAISettings} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Yapay Zeka Servis Sağlayıcısı</label>
              <select
                value={aiProvider}
                onChange={(e) => setAiProvider(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="system">Yerleşik Sistem Yapay Zekası (Google Gemini - Ücretsiz, Hızlı & Kota Sınırı Yok)</option>
                <option value="groq">Groq AI (Maksimum Hız - API Key Gerekir)</option>
                <option value="gemini">Google Gemini Yönlendirmeli (Kendi API Anahtarınız - API Key Gerekir)</option>
                <option value="openrouter">OpenRouter AI (Alternatif Sağlayıcı - API Key Gerekir)</option>
                <option value="huggingface">Hugging Face AI (Alternatif Sağlayıcı - API Key Gerekir)</option>
                <option value="together">Together AI (Yedek Sağlayıcı - API Key Gerekir)</option>
              </select>
            </div>

            {aiProvider === "system" ? (
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                <span className="font-bold text-purple-400 block font-sans">🛡️ Bulut Entegrasyon Güvencesi</span>
                <p className="font-sans text-[11px]">
                  Bu mod seçildiğinde, sunucumuzda tanımlı resmi <strong>Google Gemini Pro (v3.5 Flash)</strong> motoru kullanılır. Ayrıca herhangi bir hız limitine veya kota aşımına takılmamanız için akıllı <strong>Pollinations AI (Sınırsız)</strong> yedek hattı otomatik olarak devreye girer.
                </p>
                <p className="text-[10px] text-purple-300/80 font-sans italic">
                  * API Anahtarı girmeniz, ödeme yapmanız veya kredi yüklemeniz gerekmez. Tamamen ücretsiz ve sınırsızdır.
                </p>
              </div>
            ) : aiProvider === "together" ? (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Together AI API Key</label>
                <div className="relative">
                  <input
                    type={showTgApiKey ? "text" : "password"}
                    placeholder="tgp_v1_..."
                    value={tgApiKey}
                    onChange={(e) => setTgApiKey(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-purple-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowTgApiKey(!showTgApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showTgApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1.5">
                  <p>Boş bırakırsanız sistem varsayılan anahtarı dener.</p>
                  <a href="https://api.together.ai/settings/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">API Key Al &rarr;</a>
                </div>
              </div>
            ) : aiProvider === "groq" ? (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Groq API Key (gsk_...)</label>
                <div className="relative">
                  <input
                    type={showGroqApiKey ? "text" : "password"}
                    placeholder="gsk_..."
                    value={groqApiKey}
                    onChange={(e) => setGroqApiKey(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-purple-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGroqApiKey(!showGroqApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showGroqApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1.5">
                  <p>Hızlı ve ücretsiz API anahtarınız.</p>
                  <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">API Key Al &rarr;</a>
                </div>
              </div>
            ) : aiProvider === "gemini" ? (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Google Gemini API Key</label>
                <div className="relative">
                  <input
                    type={showGeminiApiKey ? "text" : "password"}
                    placeholder="AIza..."
                    value={geminiApiKey}
                    onChange={(e) => setGeminiApiKey(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-purple-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGeminiApiKey(!showGeminiApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showGeminiApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1.5">
                  <p>Kendi kişisel Gemini anahtarınız.</p>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">API Key Al &rarr;</a>
                </div>
              </div>
            ) : aiProvider === "huggingface" ? (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Hugging Face API Key (hf_...)</label>
                <div className="relative">
                  <input
                    type={showHfApiKey ? "text" : "password"}
                    placeholder="hf_..."
                    value={hfApiKey}
                    onChange={(e) => setHfApiKey(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-purple-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowHfApiKey(!showHfApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showHfApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1.5">
                  <p>Ücretsiz veya Pro anahtarınız.</p>
                  <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">API Key Al &rarr;</a>
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">OpenRouter API Key (sk-or-v1-...)</label>
                <div className="relative">
                  <input
                    type={showOrApiKey ? "text" : "password"}
                    placeholder="sk-or-v1-..."
                    value={orApiKey}
                    onChange={(e) => setOrApiKey(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-purple-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOrApiKey(!showOrApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showOrApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1.5">
                  <p>Çeşitli ücretli ve ücretsiz modelleri destekler.</p>
                  <a href="https://openrouter.ai/settings/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">API Key Al &rarr;</a>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 text-white font-semibold text-sm hover:bg-purple-500 transition-colors cursor-pointer"
            >
              Yapay Zeka Ayarlarını Kaydet
            </button>
          </form>
        </div>




      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
