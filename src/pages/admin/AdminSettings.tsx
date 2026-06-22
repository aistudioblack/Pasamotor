import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Loader2, Sparkles, Eye, EyeOff, Server } from "lucide-react";

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
  const [aiProvider, setAiProvider] = useState<"system" | "openrouter" | "groq" | "gemini" | "huggingface" | "qwen" | "manus" | "persorai">("system");
  const [orApiKey, setOrApiKey] = useState("");
  const [showOrApiKey, setShowOrApiKey] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState("");
  const [showGroqApiKey, setShowGroqApiKey] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [showGeminiApiKey, setShowGeminiApiKey] = useState(false);
  const [hfApiKey, setHfApiKey] = useState("");
  const [showHfApiKey, setShowHfApiKey] = useState(false);
  const [qwenApiKey, setQwenApiKey] = useState("");
  const [showQwenApiKey, setShowQwenApiKey] = useState(false);
  const [manusApiKey, setManusApiKey] = useState("");
  const [showManusApiKey, setShowManusApiKey] = useState(false);
  const [persoraiApiKey, setPersoraiApiKey] = useState("");
  const [showPersoraiApiKey, setShowPersoraiApiKey] = useState(false);
  const [persoraiModel, setPersoraiModel] = useState("claude-opus-4-7");

  // Özel API Sağlayıcıları
  const [customProviders, setCustomProviders] = useState<{ id: string, name: string, apiKey: string, baseUrl: string, defaultModel: string }[]>([]);
  const [showAddCustomProvider, setShowAddCustomProvider] = useState(false);
  const [editingCustomProviderId, setEditingCustomProviderId] = useState<string | null>(null);
  const [newCustomProvider, setNewCustomProvider] = useState({ name: "", apiKey: "", baseUrl: "", defaultModel: "" });
  const [showCustomApiKeys, setShowCustomApiKeys] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const savedProvider = localStorage.getItem("ai_provider") as any;
    if (savedProvider) {
      setAiProvider(savedProvider);
    } else {
      localStorage.setItem("ai_provider", "system");
    }

    const savedManus = localStorage.getItem("manus_api_key");
    if (savedManus) {
      setManusApiKey(decryptKey(savedManus));
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

    const savedQwen = localStorage.getItem("qwen_api_key");
    if (savedQwen) {
      setQwenApiKey(decryptKey(savedQwen));
    } else {
      const defaultQwenKey = "d35e835b481f48a6ac2ddae182fe4acef71585c0d4ad474bad70de557fceeebe";
      setQwenApiKey(defaultQwenKey);
      localStorage.setItem("qwen_api_key", encryptKey(defaultQwenKey));
    }

    const savedPersorai = localStorage.getItem("persorai_api_key");
    if (savedPersorai) {
      setPersoraiApiKey(decryptKey(savedPersorai));
    } else {
      const defaultPersoraiKey = "psr-1364cf17e1ef3ac503bf245407cdf03ebebf6e2d813b293b";
      setPersoraiApiKey(defaultPersoraiKey);
      localStorage.setItem("persorai_api_key", encryptKey(defaultPersoraiKey));
    }

    const savedPersoraiModel = localStorage.getItem("persorai_model") || "claude-opus-4-7";
    setPersoraiModel(savedPersoraiModel);

    // Custom providers load
    try {
      const savedCustomProviders = localStorage.getItem("custom_ai_providers");
      if (savedCustomProviders) {
        const parsed = JSON.parse(savedCustomProviders);
        // Decrypt api keys
        const decrypted = parsed.map((p: any) => ({ ...p, apiKey: decryptKey(p.apiKey) }));
        setCustomProviders(decrypted);
      }
    } catch(e) {
      console.warn("Failed to parse custom providers", e);
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

      if (!manusApiKey.trim()) {
        localStorage.removeItem("manus_api_key");
      } else {
        localStorage.setItem("manus_api_key", encryptKey(manusApiKey.trim()));
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

      if (!qwenApiKey.trim()) {
        localStorage.removeItem("qwen_api_key");
      } else {
        localStorage.setItem("qwen_api_key", encryptKey(qwenApiKey.trim()));
      }

      if (!persoraiApiKey.trim()) {
        localStorage.removeItem("persorai_api_key");
      } else {
        localStorage.setItem("persorai_api_key", encryptKey(persoraiApiKey.trim()));
      }
      localStorage.setItem("persorai_model", persoraiModel);

      toast({ 
        title: "Başarılı", 
        description: "Yapay Zeka sağlayıcı ayarları ve API anahtarları güvenli bir şekilde kaydedildi." 
      });
    } catch (err: any) {
      toast({ title: "Hata", description: "Ayarlar kaydedilemedi.", variant: "destructive" });
    }
  };

  const handleDeleteCustomProvider = (id: string) => {
    const updated = customProviders.filter(p => p.id !== id);
    setCustomProviders(updated);
    
    // Save to local storage
    const encryptedForSave = updated.map(p => ({ ...p, apiKey: encryptKey(p.apiKey) }));
    localStorage.setItem("custom_ai_providers", JSON.stringify(encryptedForSave));
    
    // Switch away if active
    if (aiProvider === id) {
      setAiProvider("system");
      localStorage.setItem("ai_provider", "system");
    }
    toast({ title: "Başarılı", description: "Özel sağlayıcı silindi." });
  };

  const handleAddCustomProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomProvider.name || !newCustomProvider.apiKey) {
      toast({ title: "Hata", description: "İsim ve API Key zorunludur.", variant: "destructive" });
      return;
    }
    
    let updated;
    if (editingCustomProviderId) {
      updated = customProviders.map(p => p.id === editingCustomProviderId ? { ...newCustomProvider, id: editingCustomProviderId } : p);
      toast({ title: "Başarılı", description: "Özel sağlayıcı güncellendi." });
    } else {
      const newProvider = {
        ...newCustomProvider,
        id: `custom-${customProviders.length}-${Date.now()}`
      };
      updated = [...customProviders, newProvider];
      toast({ title: "Başarılı", description: "Özel sağlayıcı eklendi." });
    }
    
    setCustomProviders(updated);
    
    // Save
    const encryptedForSave = updated.map(p => ({ ...p, apiKey: encryptKey(p.apiKey) }));
    localStorage.setItem("custom_ai_providers", JSON.stringify(encryptedForSave));
    
    setNewCustomProvider({ name: "", apiKey: "", baseUrl: "", defaultModel: "" });
    setShowAddCustomProvider(false);
    setEditingCustomProviderId(null);
  };

  const handleEditClick = (provider: any) => {
    setNewCustomProvider({ name: provider.name, apiKey: provider.apiKey, baseUrl: provider.baseUrl || "", defaultModel: provider.defaultModel || "" });
    setEditingCustomProviderId(provider.id);
    setShowAddCustomProvider(true);
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
                <option value="persorai">PersorAI (Yeni Premium Yapay Zeka - Claude Opus 4.7 - API Key Gerekir)</option>
                <option value="system">Yerleşik Sistem Yapay Zekası (Google Gemini - Ücretsiz, Hızlı & Kota Sınırı Yok)</option>
                <option value="manus">Manus AI Ajan Platformu (Kolektif Ortak Akıl - API Key Gerekir)</option>
                <option value="groq">Groq AI (Maksimum Hız - API Key Gerekir)</option>
                <option value="gemini">Google Gemini Yönlendirmeli (Kendi API Anahtarınız - API Key Gerekir)</option>
                <option value="qwen">Qwen AI Sunucusu (Özel - API Key Gerekir)</option>
                <option value="openrouter">OpenRouter AI (Alternatif Sağlayıcı - API Key Gerekir)</option>
                <option value="huggingface">Hugging Face AI (Alternatif Sağlayıcı - API Key Gerekir)</option>
                {customProviders.map(p => (
                  <option key={p.id} value={p.id}>✨ Özel Sağlayıcı: {p.name}</option>
                ))}
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
            ) : aiProvider === "qwen" ? (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Qwen API Key</label>
                <div className="relative">
                  <input
                    type={showQwenApiKey ? "text" : "password"}
                    placeholder="Erişim anahtarınız..."
                    value={qwenApiKey}
                    onChange={(e) => setQwenApiKey(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-purple-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowQwenApiKey(!showQwenApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showQwenApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1.5">
                  <p>Qwen.privateinstance.com (Varsayılandır)</p>
                </div>
              </div>
            ) : aiProvider === "manus" ? (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Manus AI API Key (sk_manus_...)</label>
                <div className="relative">
                  <input
                    type={showManusApiKey ? "text" : "password"}
                    placeholder="sk_manus_..."
                    value={manusApiKey}
                    onChange={(e) => setManusApiKey(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-purple-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowManusApiKey(!showManusApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showManusApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1.5">
                  <p>Manus AI Kolektif Ortak Akıl ve Çoklu Ajan Entegrasyonu için.</p>
                  <a href="https://manus.im" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Manus AI &rarr;</a>
                </div>
              </div>
            ) : aiProvider === "persorai" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">PersorAI API Key (psr-...)</label>
                  <div className="relative">
                    <input
                      type={showPersoraiApiKey ? "text" : "password"}
                      placeholder="psr-..."
                      value={persoraiApiKey}
                      onChange={(e) => setPersoraiApiKey(e.target.value)}
                      className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-purple-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPersoraiApiKey(!showPersoraiApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPersoraiApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-muted-foreground mt-1.5">
                    <p>Yeni Nesil Claude Opus 4.7 ve Opus Vision Yapay Zekaları için.</p>
                    <a href="https://persorai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PersorAI &rarr;</a>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Aktif Yapay Zeka Modeli</label>
                  <select
                    value={persoraiModel}
                    onChange={(e) => setPersoraiModel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="claude-opus-4-7">Claude Opus 4.7 (Anthropic - Ultra Gelişmiş Editör)</option>
                    <option value="claude-opus-4-7-vision">Claude Opus 4.7 Vision (Anthropic - Çoklu Modal)</option>
                  </select>
                </div>
              </div>
            ) : customProviders.find(p => p.id === aiProvider) ? (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-2">
                <span className="font-bold text-foreground block font-sans">
                  {customProviders.find(p => p.id === aiProvider)?.name}
                </span>
                <p className="text-xs text-muted-foreground">Bu sağlayıcının yapılandırmasını "Özel API Sağlayıcıları" bölümünden düzenleyebilirsiniz.</p>
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
        
        {/* Özel API Sağlayıcıları Yönetimi */}
        <div className="glass-card rounded-2xl p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              <h2 className="font-heading font-semibold text-foreground">Özel API Sağlayıcıları </h2>
            </div>
            <button 
              onClick={() => setShowAddCustomProvider(!showAddCustomProvider)}
              className="text-xs px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-medium border border-primary/20"
            >
              {showAddCustomProvider ? "İptal" : "+ Yeni Sağlayıcı Tanımla"}
            </button>
          </div>
          
          {showAddCustomProvider && (
            <form onSubmit={handleAddCustomProvider} className="space-y-4 mb-6 p-4 rounded-xl bg-muted/50 border border-border">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Sağlayıcı Adı</label>
                <input 
                  type="text" 
                  required
                  placeholder="Örn: Benim Özel Sunucum"
                  value={newCustomProvider.name}
                  onChange={e => setNewCustomProvider({...newCustomProvider, name: e.target.value})}
                  className="w-full px-3 py-2 text-sm rounded bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Base URL (Opsiyonel)</label>
                <input 
                  type="url" 
                  placeholder="Örn: https://api.my-custom-llm.com/v1"
                  value={newCustomProvider.baseUrl}
                  onChange={e => setNewCustomProvider({...newCustomProvider, baseUrl: e.target.value})}
                  className="w-full px-3 py-2 text-sm rounded bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">API Key</label>
                <input 
                  type="password" 
                  required
                  placeholder="Bearer token veya API anahtarı"
                  value={newCustomProvider.apiKey}
                  onChange={e => setNewCustomProvider({...newCustomProvider, apiKey: e.target.value})}
                  className="w-full px-3 py-2 text-sm font-mono rounded bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Standart Model Adı (Opsiyonel)</label>
                <input 
                  type="text" 
                  placeholder="Örn: llama-3-70b-instruct"
                  value={newCustomProvider.defaultModel}
                  onChange={e => setNewCustomProvider({...newCustomProvider, defaultModel: e.target.value})}
                  className="w-full px-3 py-2 text-sm font-mono rounded bg-background border border-border focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-2 bg-foreground text-background text-sm font-medium rounded hover:bg-foreground/90 transition-colors"
              >
                {editingCustomProviderId ? "Değişiklikleri Kaydet" : "Kaydet ve Listeye Ekle"}
              </button>
            </form>
          )}

          {customProviders.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">Henüz özel bir API sağlayıcı eklemediniz. İsterseniz OpenAI uyumlu (Custom Base URL) veya farklı bir yapay zeka servisini buraya tanımlayabilirsiniz.</p>
          ) : (
            <div className="space-y-3">
              {customProviders.map(p => (
                <div key={p.id} className="p-3 rounded border border-border flex items-center justify-between group">
                  <div className="space-y-0.5 max-w-[70%]">
                    <p className="font-medium text-sm text-foreground">{p.name}</p>
                    {p.baseUrl && <p className="text-[10px] font-mono text-muted-foreground truncate">{p.baseUrl}</p>}
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] font-mono text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded">
                        {showCustomApiKeys[p.id] ? p.apiKey : "••••••••••••••••••••••••"}
                      </p>
                      <button 
                        type="button" 
                        onClick={() => setShowCustomApiKeys(prev => ({...prev, [p.id]: !prev[p.id]}))}
                        className="text-muted-foreground hover:text-foreground p-0.5"
                      >
                        {showCustomApiKeys[p.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditClick(p)}
                      className="text-xs text-primary hover:bg-primary/10 px-2 py-1 rounded"
                    >
                      Düzenle
                    </button>
                    <button 
                      onClick={() => handleDeleteCustomProvider(p.id)}
                      className="text-xs text-destructive hover:bg-destructive/10 px-2 py-1 rounded"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
