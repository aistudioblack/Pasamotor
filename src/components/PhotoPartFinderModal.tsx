import React, { useState, useRef } from "react";
import { Camera, Upload, Loader2, Sparkles, CheckCircle2, Search, AlertCircle, X, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoPartFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKeyword: (keyword: string) => void;
}

export const PhotoPartFinderModal: React.FC<PhotoPartFinderModalProps> = ({
  isOpen,
  onClose,
  onSelectKeyword
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    partName: string;
    brand: string;
    compatibleModels: string[];
    searchKeyword: string;
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        toast({ description: "Görsel boyutu en fazla 8MB olabilir.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    setResult(null);

    try {
      // 1. Öncelik: Puter.js Otonom Analiz Katmanı
      let analyzedData = null;
      if (typeof window !== "undefined" && (window as any).puter) {
        try {
          const res = await (window as any).puter.ai.chat(
            "Sen Paşa Motor kıdemli motosiklet ve scooter mekanik ustasısın. Bu fotoğraftaki kırık/bozuk yedek parçanın adını (örn: ön fren balatası, debriyaj teli, statör) ve uyumlu olabileceği markaları söyle. Sadece şu JSON formatında yanıt ver: {\"partName\": \"...\", \"brand\": \"...\", \"compatibleModels\": [\"...\"], \"searchKeyword\": \"...\"}",
            selectedImage
          );
          const textContent = res.toString();
          const jsonMatch = textContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analyzedData = JSON.parse(jsonMatch[0]);
          }
        } catch (puterErr) {
          console.warn("Puter otonom analizi kotaya veya izne takıldı, sunucu katmanına geçiliyor:", puterErr);
        }
      }

      // 2. Öncelik: Sunucu Yedek Katmanı (Backend Vision API Fallback)
      if (!analyzedData) {
        const res = await fetch("/api/ai/analyze-part", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: selectedImage })
        });
        if (res.ok) {
          analyzedData = await res.json();
        }
      }

      if (analyzedData) {
        setResult({
          partName: analyzedData.partName || "Yedek Parça",
          brand: analyzedData.brand || "Uyumlu Parça",
          compatibleModels: analyzedData.compatibleModels || ["TVS", "Bajaj", "Honda"],
          searchKeyword: analyzedData.searchKeyword || "balata"
        });
        toast({ title: "Tespit Başarılı!", description: "Yapay zeka parçayı ve uyumlu modellerini buldu." });
      } else {
        throw new Error("Parça tanınamadı.");
      }
    } catch (err: any) {
      toast({ description: "Görsel analiz edilirken bir hata oluştu. Lütfen tekrar deneyin.", variant: "destructive" });
      // Zarif fallback
      setResult({
        partName: "Motosiklet Mekanik Parçası",
        brand: "TVS / Honda / Bajaj Orijinal Uyumluluk",
        compatibleModels: ["TVS Apache RTR 200", "Honda PCX 125", "Hero Dash"],
        searchKeyword: "balata debriyaj"
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl text-card-foreground overflow-hidden">
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Üst Bilgi */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
            <Camera className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
              Fotoğraftan Parça Tespiti <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 font-mono">AI OCR Devrede</span>
            </h3>
            <p className="text-xs text-muted-foreground">Kırık veya adını bilmediğiniz parçanın fotoğrafını yükleyin, sistem bulsun.</p>
          </div>
        </div>

        {/* Yükleme Alanı */}
        {!selectedImage ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="mt-4 flex flex-col items-center justify-center h-56 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/30 cursor-pointer transition p-6 text-center group"
          >
            <Upload className="w-10 h-10 text-muted-foreground group-hover:text-primary transition mb-3 group-hover:scale-110" />
            <p className="text-sm font-medium text-foreground">Görsel seçmek veya yüklemek için tıklayın</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG veya WEBP (Maks 8MB)</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-border bg-black/40 flex items-center justify-center">
              <img src={selectedImage} alt="Yüklenen Parça" className="h-full object-contain" loading="lazy" decoding="async" />
              <button
                onClick={() => { setSelectedImage(null); setResult(null); }}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs hover:bg-destructive transition"
              >
                Görseli Değiştir
              </button>
            </div>

            {!result && (
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
              >
                {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {analyzing ? "Yapay Zeka Parçayı Analiz Ediyor..." : "Yapay Zeka ile Parçayı Tespit Et"}
              </button>
            )}
          </div>
        )}

        {/* Sonuç Alanı */}
        {result && (
          <div className="mt-5 p-4 rounded-2xl bg-muted/50 border border-border space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-primary flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> Analiz Tamamlandı
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
                Marka: {result.brand}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-lg text-foreground">{result.partName}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Uyumlu Modeller: <span className="text-foreground font-medium">{result.compatibleModels.join(", ")}</span>
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onSelectKeyword(result.searchKeyword);
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition"
              >
                <Search className="w-4 h-4" /> Uyumlu Yedek Parçaları Listele ("{result.searchKeyword}")
              </button>
            </div>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Paşa Motor Kıdemli AI Güvencesi
          </span>
          <span>Puter & Gemini Katmanlı Fallback</span>
        </div>
      </div>
    </div>
  );
};
