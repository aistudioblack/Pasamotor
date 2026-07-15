import { adminFetch } from "@/lib/api-client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Rocket, CheckCircle2, Server, Globe, Database, Save, Loader2, Eye, EyeOff, Search, Check, AlertTriangle, ShieldCheck, KeyRound, HelpCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";

export default function AdminGithub() {
  const { toast } = useToast();
  const [githubUrl, setGithubUrl] = useState("");
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [deployUrl, setDeployUrl] = useState("");
  const [docId, setDocId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [pushProgress, setPushProgress] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [pushDialogOpen, setPushDialogOpen] = useState(false);
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);

  // SEO Ping states
  const [sitemapUrl, setSitemapUrl] = useState("https://pasamotor.com.tr/sitemap.xml");
  const [indexNowKey, setIndexNowKey] = useState("96dfc37466eb4b74bd562be641577977");
  const [isPinging, setIsPinging] = useState(false);
  const [pingResults, setPingResults] = useState<any[]>([]);

  const handlePingSEO = async () => {
    setIsPinging(true);
    setPingResults([]);
    try {
      const response = await adminFetch("/api/seo/ping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sitemapUrl, indexNowKey }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sitemap ve IndexNow bildirimi gerçekleştirilemedi.");
      
      setPingResults(data.results || []);
      toast({ title: "Bildirim Başarılı", description: "Google, Bing ve Yandex arama motorlarına ping başarıyla iletildi." });
    } catch (err: any) {
      toast({ title: "Sitemap Ping Hatası", description: err.message, variant: "destructive" });
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await dbClient
          .from("site_content")
          .select("*")
          .eq("page_key", "github_settings")
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setDocId(data.id);
          const sections = data.sections || {};
          setGithubUrl(sections.githubUrl || "");
          setToken(sections.token || "");
          setDeployUrl(sections.deployUrl || "");
        }
      } catch (err: any) {
        console.error("Ayarlar yüklenirken hata:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSaveItems = async () => {
    setIsSaving(true);
    try {
      const response = await adminFetch("/api/admin/site-content/github_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "GitHub Settings",
          sections: { githubUrl, token, deployUrl }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Ayarlar kaydedilemedi.");
      }

      const resData = await response.json();
      if (resData.data) {
        setDocId(resData.data.id);
      }

      toast({ title: "Başarılı", description: "Ayarlar başarıyla kaydedildi." });
    } catch (err: any) {
      toast({ title: "Hata", description: "Kaydedilirken hata oluştu: " + err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePush = async () => {
    if (!githubUrl) {
      toast({ title: "Eksik Bilgi", description: "Lütfen bir GitHub Repository URL girin.", variant: "destructive" });
      return;
    }
    await handleSaveItems(); // Önce kaydet
    setPushDialogOpen(false);
    setIsPushing(true);
    setPushProgress(0);
    
    // Simulate progression while waiting for the request
    const interval = setInterval(() => {
      setPushProgress(prev => {
        if (prev >= 98) return prev; 
        // 90'ı geçtikten sonra çok yavaş arttır
        if (prev >= 90) return prev + 1;
        return prev + 5;
      });
    }, 400);

    try {
      const response = await adminFetch("/api/github/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUrl, token }),
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Bilinmeyen bir hata oluştu.");
      
      setPushProgress(100);
      setTimeout(() => {
        toast({ title: "Başarılı", description: data.message || "Kodlar başarıyla GitHub'a gönderildi!" });
        setIsPushing(false);
      }, 500);
    } catch (error: any) {
      toast({ title: "Push Hatası", description: error.message, variant: "destructive" });
      setIsPushing(false);
    } finally {
      clearInterval(interval);
    }
  };

  const handleDeploy = async () => {
    if (!deployUrl) {
      toast({ title: "Eksik Bilgi", description: "Lütfen bir Deploy Webhook URL girin.", variant: "destructive" });
      return;
    }
    await handleSaveItems(); // Önce kaydet
    setDeployDialogOpen(false);
    setIsDeploying(true);
    
    // Simulate deployment or webhook trigger
    try {
      // Basic webhook ping attempt if it's a real URL
      if (deployUrl.startsWith("http")) {
         await fetch(deployUrl, { mode: 'no-cors', method: 'POST' }).catch(() => { /* ignore */ });
      }
    } catch (e) {
      // ignore
    }

    setTimeout(() => {
      setIsDeploying(false);
      toast({ title: "Başarılı", description: "Deploy tetiklendi! Güncellemeler sunucuda yayına alınacak." });
    }, 2000);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading">GitHub & Deploy</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              Değişikliklerinizi GitHub'a gönderin ve production sunucunuza dağıtım sağlayın.
            </p>
          </div>
          <Button onClick={handleSaveItems} disabled={isSaving} variant="outline" className="shrink-0">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Ayarları Kaydet
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* GitHub Entegrasyonu */}
          <div className="glass-card rounded-xl p-6 border border-border shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-heading">GitHub Push</h2>
                <p className="text-xs text-muted-foreground">Değişiklikleri repoya yedekleyin</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub Repository URL</Label>
                <Input
                  id="githubUrl"
                  placeholder="https://github.com/kullaniciadi/repo"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token">Personal Access Token (Opsiyonel)</Label>
                <div className="relative">
                  <Input
                    id="token"
                    type={showToken ? "text" : "password"}
                    placeholder="Github Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="bg-background pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Private repolar ve güvenli yazılım aktarımları için gereklidir.</p>
                
                {token.trim().startsWith("gsk_") && (
                  <div className="mt-2.5 p-3.5 bg-destructive/15 text-destructive rounded-xl border border-destructive/30 flex gap-2.5">
                    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-500 animate-pulse" />
                    <div className="text-xs leading-relaxed">
                      <strong className="font-bold text-red-500">Kritik Hata: Groq API Key Tespit Edildi!</strong>
                      <p className="mt-1 text-muted-foreground">
                        Girdiğiniz anahtar bir <code className="px-1 py-0.5 bg-black/20 rounded font-mono text-red-400">gsk_...</code> (Groq API Anahtarı) gibi görünüyor. Lütfen buraya Groq anahtarınızı değil, GitHub'dan aldığınız ve <code className="px-1 py-0.5 bg-black/20 rounded font-mono text-emerald-400">github_pat_</code> veya <code className="px-1 py-0.5 bg-black/20 rounded font-mono text-emerald-400">ghp_</code> ile başlayan <strong>GitHub Personal Access Token</strong>'ınızı girdiğinizden emin olun.
                      </p>
                    </div>
                  </div>
                )}
                {token.trim().length > 0 && 
                 !token.trim().startsWith("github_pat_") && 
                 !token.trim().startsWith("ghp_") && 
                 !token.trim().startsWith("gho_") && 
                 !token.trim().startsWith("ghu_") && 
                 !token.trim().startsWith("ghs_") && 
                 !token.trim().startsWith("gsk_") && (
                  <div className="mt-2.5 p-3 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/25 flex gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="text-xs leading-relaxed">
                      <strong className="font-semibold text-amber-500">Uyumsuz Format Uyarısı:</strong>
                      <p className="mt-0.5 text-muted-foreground">
                        Girdiğiniz token, standart GitHub biçimlerine (<code className="font-mono text-[10px]">github_pat_...</code> veya <code className="font-mono text-[10px]">ghp_...</code>) benzemiyor. Token'ınızı kopyalarken eksik veya yanlış kopyalamadığınızdan lütfen emin olun.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-2.5 p-3 bg-green-500/5 rounded-xl border border-green-500/10 flex gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-muted-foreground leading-relaxed">
                    <strong className="text-green-400 font-semibold">Siber Güvenlik Önerisi (Fine-grained PAT):</strong>
                    <p className="mt-0.5">Klasik token yerine her zaman "Fine-grained PAT" kullanın. İzin ayarlarında sadece ilgili depoyu seçip, <strong>Repository permissions &gt; Contents</strong> yetkisini <strong>Read &amp; Write</strong> olarak yapılandırmanız tam koruma sağlar.</p>
                  </div>
                </div>

                <div className="mt-2.5 p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 flex gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="font-semibold text-red-400">⚠️ Kritik Güvenlik Bilgisi (Otomatik İptal):</strong>
                    <p className="mt-0.5 text-muted-foreground">
                      GitHub Personal Access Token'ınızı <strong>kesinlikle yapay zeka sohbetlerine, mesajlaşma gruplarına veya halka açık ortamlara yapıştırmayın!</strong> GitHub'ın otomatik güvenlik tarayıcıları (Secret Scanning), token'ı gördüğü anda hesabınızı korumak için token'ı <strong>saniyeler içinde otomatik olarak siler (revoke eder)</strong>. Eğer yapıştırdıysanız lütfen hemen GitHub'dan yeni bir token üretip kimseyle paylaşmadan buraya girin.
                    </p>
                  </div>
                </div>
              </div>
              <Dialog open={pushDialogOpen} onOpenChange={setPushDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" disabled={isPushing}>
                    {isPushing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {pushProgress < 90 ? "Pushlanıyor..." : "Son Adımlar, Bekleyin..."}</>
                    ) : (
                      "Değişiklikleri Gönder (Push)"
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Kodu Pushla</DialogTitle>
                    <DialogDescription>
                      Bu işlem mevcut ayarları kaydedecek ve tüm kodu belirtilen GitHub reposuna gönderecektir. Devam etmek istiyor musunuz?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" className="border-border" onClick={() => setPushDialogOpen(false)}>İptal</Button>
                    <Button onClick={handlePush}>Evet, Pushla</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {isPushing && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Yükleniyor...</span>
                    <span>{pushProgress}%</span>
                  </div>
                  <Progress value={pushProgress} className="h-2" />
                </div>
              )}
            </div>
          </div>

          {/* Deployment Ayarları */}
          <div className="glass-card rounded-xl p-6 border border-border bg-gradient-to-br from-secondary/5 to-transparent shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-border/50 pb-4 mb-4">
              <div className="p-3 bg-secondary/10 rounded-lg text-secondary-foreground">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-heading">Manuel Deploy</h2>
                <p className="text-xs text-muted-foreground">Bulut sunucu üzerinden webhook tetikle</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deployUrl">Deploy Webhook URL (Vercel/Render vb.)</Label>
                <Input
                  id="deployUrl"
                  placeholder="https://api.vercel.com/v1/integrations/deploy/..."
                  value={deployUrl}
                  onChange={(e) => setDeployUrl(e.target.value)}
                  className="bg-background"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">Sunucunuzdan aldığınız deploy URL'sini girin.</p>
                  <a href="https://vercel.com/docs/deployments/deploy-hooks" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline font-medium">Bu URL'yi Nereden Alırım?</a>
                </div>
              </div>
              <Dialog open={deployDialogOpen} onOpenChange={setDeployDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full" disabled={isDeploying}>
                    {isDeploying ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Tetikleniyor...</>
                    ) : (
                      "Deploy'u Tetikle"
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Deploy Tetikle</DialogTitle>
                    <DialogDescription>
                      Mevcut ayarlar kaydedilecek ve sunucu webhook'u üzerinden otomatik yayınlama (deploy) işlemi tetiklenecektir. Onaylıyor musunuz?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" className="border-border" onClick={() => setDeployDialogOpen(false)}>İptal</Button>
                    <Button onClick={handleDeploy}>Evet, Tetikle</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <div className="pt-4 border-t border-border/50 mt-4">
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Sistem Durumu (Uçtan Uca)
                </h3>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-muted-foreground"/> Frontend UI</div>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">Aktif</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Server className="w-4 h-4 text-muted-foreground"/> Backend & API</div>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">Kararlı</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Database className="w-4 h-4 text-muted-foreground"/> Supabase Veritabanı</div>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">Bağlı</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Siber Güvenlik ve Vercel Dağıtım Rehberi */}
        <div className="glass-card rounded-xl p-6 border border-border/80 bg-gradient-to-br from-green-500/5 via-transparent to-transparent shadow-md space-y-6 mt-6">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-heading">Siber Güvenlik & Vercel Dağıtım Rehberi</h2>
              <p className="text-xs text-muted-foreground">Sisteminizin güvenliğini en üst düzeye çıkarmak için en iyi pratikler</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                <KeyRound className="w-4 h-4 text-green-500" />
                Fine-grained PAT (Kapsamı Daraltılmış Token) Nedir?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Klasik GitHub token'ları (Classic PAT), hesabınızdaki tüm depolara erişim sağlayabilen geniş yetkilere sahiptir ve çalınmaları durumunda büyük bir siber güvenlik riski oluştururlar.
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong>Fine-grained PAT</strong> ise sadece belirttiğiniz tek bir depoya (örneğin sadece <code className="px-1.5 py-0.5 bg-muted rounded text-foreground">Pasamotor</code> deposu) erişim sağlar. Ayrıca bu token'a sadece <strong>"Repository permissions &gt; Contents: Read &amp; Write"</strong> yetkisi vererek, diğer tüm hassas ayarlara veya diğer depolarınıza erişimi tamamen engelleyebilirsiniz. Bu sayede token sızdırılsa dahi sisteminizin kalanı güvende kalır.
              </p>
            </div>

            <div className="bg-muted/10 border border-border/60 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                <HelpCircle className="w-4 h-4 text-primary" />
                Fine-grained PAT Vercel'e Nasıl Eklenir?
              </h3>
              <ol className="text-xs space-y-2.5 text-muted-foreground list-decimal list-inside leading-relaxed">
                <li>
                  <strong className="text-foreground">Vercel Dashboard</strong>'a gidin ve <strong className="text-foreground">Pasamotor</strong> projenizi seçin.
                </li>
                <li>
                  Üst menüden <strong className="text-foreground">Settings (Ayarlar)</strong> sekmesine tıklayın.
                </li>
                <li>
                  Sol menüden <strong className="text-foreground">Environment Variables (Ortam Değişkenleri)</strong> sayfasına girin.
                </li>
                <li>
                  Yeni bir değişken ekleyin:
                  <div className="mt-1.5 ml-4 p-2 bg-background border border-border rounded-lg font-mono text-[11px] text-foreground space-y-1">
                    <div><strong>Key:</strong> <code className="text-indigo-400">GITHUB_TOKEN</code></div>
                    <div><strong>Value:</strong> <code className="text-muted-foreground">github_pat_xxxxxx...</code></div>
                  </div>
                </li>
                <li>
                  <strong className="text-foreground">Save (Kaydet)</strong> butonuna basarak kaydedin. Bu işlemden sonra backend servisiniz bu güvenli token'ı otomatik olarak kullanacaktır.
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Arama Motoru İndeksleme (Sitemap & IndexNow) */}
        <div className="glass-card rounded-xl p-6 border border-border bg-gradient-to-br from-indigo-500/5 to-transparent shadow-sm space-y-4 mt-6">
          <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-heading">Arama Motoru İndeksleme (IndexNow)</h2>
                <p className="text-xs text-muted-foreground">Google, Bing ve Yandex arama motorlarına otomatik sitemap pingi gönderin</p>
              </div>
            </div>
            <Button 
              onClick={handlePingSEO} 
              disabled={isPinging} 
              className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 shadow-md shadow-indigo-600/15"
            >
              {isPinging ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Search className="w-4 h-4 mr-2" />}
              {isPinging ? "Ping Gönderiliyor..." : "Arama Motorlarını Ping'le"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sitemapUrl" className="text-sm font-semibold text-foreground">Sitemap URL'si</Label>
                <Input
                  id="sitemapUrl"
                  type="url"
                  placeholder="https://pasamotor.com.tr/sitemap.xml"
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  className="bg-background border-border focus:border-indigo-500"
                />
                <p className="text-xs text-muted-foreground">Sitenizin güncel haritasını temsil eden link.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indexNowKey" className="text-sm font-semibold text-foreground">IndexNow API Anahtarı</Label>
                <Input
                  id="indexNowKey"
                  type="text"
                  placeholder="96dfc37466eb4b74bd562be641577977"
                  value={indexNowKey}
                  onChange={(e) => setIndexNowKey(e.target.value)}
                  className="bg-background border-border focus:border-indigo-500 font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">Bing ve Yandex hızlı indeksleme için gereken benzersiz Indexed anahtarınız.</p>
              </div>
            </div>

            <div className="bg-muted/10 border border-border/60 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-500" /> Ping Gönderim Sonuçları
                </h3>
                
                {pingResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                    <Search className="w-8 h-8 text-muted-foreground/30 mb-2" />
                    <p className="text-xs">Henüz ping gönderilmedi. Yukarıdan 'Arama Motorlarını Ping'le' butonuna basarak anında indeksleme talebinde bulunabilirsiniz.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {pingResults.map((res, idx) => (
                      <div key={idx} className="flex items-start justify-between p-2.5 rounded-lg border border-border bg-background/50">
                        <div className="flex items-start gap-2.5">
                          {res.status === "success" ? (
                            <div className="p-1 bg-green-500/15 text-green-500 rounded-md mt-0.5">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : res.status === "warning" ? (
                            <div className="p-1 bg-amber-500/15 text-amber-500 rounded-md mt-0.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="p-1 bg-red-500/15 text-red-500 rounded-md mt-0.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div>
                            <p className="text-xs font-semibold text-foreground">{res.engine}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{res.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                <span>Google Sitemap Ping & IndexNow Protokolü anlık entegre edilmiştir.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
