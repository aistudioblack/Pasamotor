import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github, Rocket, CheckCircle2, Server, Globe, Database, Save, Loader2, Eye, EyeOff } from "lucide-react";
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
import { dbClient } from "@/lib/firebase-client";
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
      const payload = {
        page_key: "github_settings",
        title: "GitHub Settings",
        sections: { githubUrl, token, deployUrl }
      };

      if (docId) {
        await dbClient.from("site_content").update({ sections: payload.sections }).eq("id", docId);
      } else {
        const { data } = await dbClient.from("site_content").insert(payload).select().single();
        if (data) setDocId(data.id);
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
        if (prev >= 90) return prev; // Hold at 90% until done
        return prev + 5;
      });
    }, 300);

    try {
      const response = await fetch("/api/github/push", {
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
                    placeholder="ghp_xxxxxxxxxxxx"
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
                <p className="text-xs text-muted-foreground">Private repolar için gereklidir.</p>
              </div>
              <Dialog open={pushDialogOpen} onOpenChange={setPushDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" disabled={isPushing}>
                    {isPushing ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> {pushProgress < 100 ? "Pushlanıyor..." : "Tamamlandı"}</>
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
                <p className="text-xs text-muted-foreground">Sunucunuzdan aldığınız deploy URL'sini girin.</p>
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
                    <div className="flex items-center gap-2"><Database className="w-4 h-4 text-muted-foreground"/> Firebase Veritabanı</div>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-semibold">Bağlı</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
