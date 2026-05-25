import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState, useRef } from "react";
import { dbClient } from "@/lib/firebase-client";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
  Play,
  FileText,
  Image as ImageIcon,
  Save,
  Check,
  RefreshCw,
  HelpCircle,
  Eye,
  Terminal,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Product {
  id: string;
  title: string;
  brand?: string;
  sku?: string;
  price?: number;
  category?: string;
  slug: string;
  description?: string;
}

const toneOptions = [
  { value: "professional", label: "Profesyonel & Bilgilendirici", icon: "💼" },
  { value: "expert", label: "Teknik Uzman & Usta Görüşü", icon: "🔧" },
  { value: "friendly", label: "Samimi & Çözüm Odaklı", icon: "🤝" },
  { value: "sales", label: "Satış Odaklı & Fırsat Vurgulayan", icon: "💰" }
];

const slugify = (text: string) =>
  text.toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function AdminSEOAgent() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Custom keyword & settings
  const [customKeywords, setCustomKeywords] = useState("");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [minWords, setMinWords] = useState(500);
  const [generateFaq, setGenerateFaq] = useState(true);
  const [generateCover, setGenerateCover] = useState(true);

  // Agent State
  const [status, setStatus] = useState<"idle" | "running" | "completed" | "error">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<{ time: string; msg: string; type: "info" | "success" | "warning" | "error" }[]>([]);
  const [progress, setProgress] = useState(0);
  
  // Agent Outputs
  const [generatedBlog, setGeneratedBlog] = useState<{
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    metaTitle: string;
    metaDescription: string;
    tags: string[];
    faq: { question: string; answer: string }[];
  } | null>(null);

  const [saving, setSaving] = useState(false);
  const [saveAsPublished, setSaveAsPublished] = useState(false);
  const isCancelled = useRef(false);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const { data, error } = await dbClient
        .from("products")
        .select("id, title, brand, sku, price, category, slug, description")
        .limit(100);
      if (error) throw error;
      setProducts(data || []);
    } catch (e: any) {
      toast({ title: "Ürünler Yüklenemedi", description: e.message, variant: "destructive" });
    } finally {
      setProductsLoading(false);
    }
  };

  const addLog = (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
    const time = new Date().toLocaleTimeString("tr-TR");
    setLogs((prev) => [...prev, { time, msg, type }]);
  };

  const handleRandomSelect = () => {
    if (products.length === 0) return;
    const random = products[Math.floor(Math.random() * products.length)];
    setSelectedProduct(random);
    toast({ title: "Katalogdan Rastgele Ürün Seçildi", description: random.title });
  };

  const runSEOAgent = async () => {
    if (!selectedProduct) {
      toast({ title: "Ürün Seçilmedi", description: "Lütfen blog konusu için sitemizden bir ürün seçin.", variant: "destructive" });
      return;
    }

    setStatus("running");
    setCurrentStep(1);
    setProgress(10);
    setLogs([]);
    setGeneratedBlog(null);
    isCancelled.current = false;

    addLog(`🤖 Pasamotor SEO Yapay Zeka Ajanı Başlatıldı.`, "info");
    addLog(`🔍 Analiz Edilen Ürün: "${selectedProduct.title}" (Marka: ${selectedProduct.brand || "Motosiklet"}).`, "info");
    await new Promise((r) => setTimeout(r, 1200));

    try {
      // Step 1: Market & Semantic Keywords Analysis
      if (isCancelled.current) return;
      setCurrentStep(1);
      setProgress(25);
      addLog(`⚡ [AŞAMA 1] Semantik & LSI Anahtar Kelime Analizi Yapılıyor...`, "info");
      addLog(`📊 Ürün kategorisi: ${selectedProduct.category || "Genel"}. OEM/Stok Kodu: ${selectedProduct.sku || "Belirtilmemiş"}.`, "info");
      addLog(`🔍 Google Arama Niyeti (Search Intent) Değerlendiriliyor: Bilgilendirici ve Ticari Niyet dengeleniyor.`, "info");

      const promptAnalyze = `Sen bir motosiklet yedek parça ve motor mekaniği SEO uzmanısın.
Şu ürün için en önemli 5 adet SEO odaklı alt anahtar kelime (LSI) ve her biri için sesteş, yan anlam arama kelimelerini Türkçe olarak analiz et.
Ürün: "${selectedProduct.title}"
Kategori: "${selectedProduct.category || ""}"
Kullanıcı Ek Kelimeleri: "${customKeywords}"

Yanıtı sadece geçerli bir JSON array olarak dön. JSON dışında hiçbir metin yazma.
Şema: 
[
  { "keyword": "kelime", "volume": "Yüksek", "intent": "Açıklama" }
]`;

      const analyzeRes = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptAnalyze, isJson: true })
      });

      if (!analyzeRes.ok) throw new Error("Aşama 1 AI analiz isteği başarısız oldu.");
      const analyzeData = await analyzeRes.json();
      let keywordsList: any[] = [];
      try {
        let cleanText = (analyzeData.text || "").trim();
        if (cleanText.startsWith("```json")) {
          cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleanText.startsWith("```")) {
          cleanText = cleanText.replace(/^```/, "").replace(/```$/, "").trim();
        }
        keywordsList = JSON.parse(cleanText);
      } catch (e) {
        keywordsList = [
          { keyword: `${selectedProduct.brand} ${selectedProduct.title} tamiri`, volume: "Yüksek", intent: "Motosiklet Bakım" },
          { keyword: `orijinal ${selectedProduct.brand} yedek parça`, volume: "Yüksek", intent: "Güvenli Satış" }
        ];
      }

      keywordsList.forEach((k: any) => {
        addLog(`🎯 Bulunan Anahtar Kelime: "${k.keyword}" (Arama Hacmi: ${k.volume}, Arama Amacı: ${k.intent})`, "success");
      });

      // Step 2: Heading & Structure Plan
      if (isCancelled.current) return;
      setCurrentStep(2);
      setProgress(45);
      addLog(`⚡ [AŞAMA 2] SEO Uyumlu İçerik Mimarisi & Başlık Stratejisi Çıkartılıyor...`, "info");
      await new Promise((r) => setTimeout(r, 1000));
      addLog(`📝 Etkileyici SEO Başlığı, Meta Açıklamaları ve URL yapısı tasarlanıyor.`, "info");

      const toneText = toneOptions.find(t => t.value === selectedTone)?.label || "Profesyonel";
      const promptStructure = `Sen bir Türkiye SEO uzmanı blog yazarı ve motosiklet ustasısın.
Şu ürün için SEO dostu, kullanıcıyı tıklamaya teşvik eden Türkçe bir blog başlığı (Title), Kısa Özet (Excerpt), SEO Meta Başlık (max 65 karakter), SEO Meta Açıklama (max 155 karakter) üret.
Ürün: "${selectedProduct.title}"
Marka: "${selectedProduct.brand || "Motosiklet"}"
Yazım Tonu: "${toneText}"

Yalnızca ham geçerli JSON üret. Başka hiçbir şey yazma.
Şema:
{
  "title": "Blog Başlığı",
  "excerpt": "Blog kısa özeti",
  "meta_title": "SEO Başlık",
  "meta_description": "SEO Açıklama",
  "tags": ["etiket1", "etiket2"]
}`;

      const structRes = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptStructure, isJson: true })
      });

      if (!structRes.ok) throw new Error("Aşama 2 Yapı planlaması başarısız oldu.");
      const structData = await structRes.json();
      let seoMeta: any = {};
      try {
        let cleanText = (structData.text || "").trim();
        if (cleanText.startsWith("```json")) {
          cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "").trim();
        } else if (cleanText.startsWith("```")) {
          cleanText = cleanText.replace(/^```/, "").replace(/```$/, "").trim();
        }
        seoMeta = JSON.parse(cleanText);
      } catch (e) {
        seoMeta = {
          title: `${selectedProduct.brand} ${selectedProduct.title} Ne Zaman Değişir ve Nasıl Bakım Yapılır?`,
          excerpt: `Orijinal ${selectedProduct.brand} yedek parça kalitesi, uyumluluk rehberi ve arıza belirtilerini içeren profesyonel rehberimiz.`,
          meta_title: `${selectedProduct.brand} ${selectedProduct.title} Bilgisi ve Değişim Rehberi | Moto Blog`,
          meta_description: `${selectedProduct.brand} marka motorunuz için ${selectedProduct.title} arıza teşhisi, montaj ipuçları ve avantajlarını keşfedin.`,
          tags: ["motosiklet", "bakim", selectedProduct.brand || "motor"]
        };
      }

      addLog(`📝 Başlık: "${seoMeta.title}"`, "success");
      addLog(`🏷️ Meta Title: "${seoMeta.meta_title}"`, "success");
      addLog(`📄 Meta Description: "${seoMeta.meta_description}"`, "success");

      // Step 3: Deep HTML Content Writing
      if (isCancelled.current) return;
      setCurrentStep(3);
      setProgress(70);
      addLog(`⚡ [AŞAMA 3] Detaylı Semantik Blog İçeriği Yazılıyor (${minWords} kelime hedefi)...`, "info");
      addLog(`✍️ LSI anahtar kelimeler ve motor mekanik terimleri metne ustaca yediriliyor.`, "info");
      addLog(`🔗 Sitemizdeki ürün sayfasına (/yedek-parca/${selectedProduct.slug}) doğal CTA bağlantıları kuruluyor.`, "info");

      const promptContent = `Sen Türkiye'nin en iyi motosiklet mekanik blogu yazarı ve kıdemli SEO uzmanısın.
Müşterileri bilgilendirerek satın almaya teşvik eden, tamamen özgün, kopya içermeyen, spam kelimeler barındırmayan profesyonel bir Türkçe blog yazısı yaz.
Giriş, Gelişme, Arıza Belirtileri, Bakım İpuçları ve Satın Alma Tavsiyesi bölümlerini içersin.

KONU: "${seoMeta.title}"
ÜRÜN: "${selectedProduct.title}"
MARKA: "${selectedProduct.brand || "Motosiklet"}"
OEM / SKU: "${selectedProduct.sku || ""}"
ÜRÜNLER SAYFASI LİNKİ: "/yedek-parca/${selectedProduct.slug}"
YAZIM TONU: "${toneText}"
Yalnızca şu HTML etiketlerini kullan ve temiz şekilde biçimlendir: <h2>, <p>, <ul>, <li>, <strong>, <em>.
Yazı içerisinde en az bir kez "/yedek-parca/${selectedProduct.slug}" linkine giden doğal ve güçlü bir buton veya yazı linki yerleştir. (Örnek: <a href="/yedek-parca/${selectedProduct.slug}" className="text-secondary font-bold hover:underline">Orijinal ${selectedProduct.brand} ${selectedProduct.title} sayfasını incele</a>)
Herhangi bir JSON veya kod bloğu kullanma, SADECE saf HTML makale metnini döndür.`;

      const contentRes = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptContent, isJson: false })
      });

      if (!contentRes.ok) throw new Error("Aşama 3 Makale yazımı başarısız oldu.");
      const contentData = await contentRes.json();
      let blogHtml = contentData.text || "";
      
      // Temizleme işlemleri
      if (blogHtml.startsWith("```html")) {
        blogHtml = blogHtml.replace(/^```html/, "").replace(/```$/, "").trim();
      } else if (blogHtml.startsWith("```")) {
        blogHtml = blogHtml.replace(/^```/, "").replace(/```$/, "").trim();
      }

      const wordCount = blogHtml.split(/\s+/).filter(Boolean).length;
      addLog(`✨ Blog İçeriği Yazımı Başarıyla Tamamlandı! Toplam Kelime Sayısı: ${wordCount}`, "success");

      // Step 4: FAQ Generating
      let faqList: { question: string; answer: string }[] = [];
      if (generateFaq && !isCancelled.current) {
        setCurrentStep(4);
        setProgress(85);
        addLog(`⚡ [AŞAMA 4] FAQ Schema Uyumlu Sıkça Sorulan Sorular Hazırlanıyor...`, "info");

        const promptFaq = `Lütfen şu ürün ve konu için kullanıcıların arama motorlarında sıkça aradığı 3 adet soru ve detaylı teknik cevabını Türkçe olarak üret.
Konu: "${seoMeta.title}"
Ürün: "${selectedProduct.title}"

Yalnızca ham geçerli JSON üret. Başka hiçbir şey yazma.
Şema:
[
  { "question": "Soru?", "answer": "Cevap." }
]`;

        const faqRes = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptFaq, isJson: true })
        });

        if (faqRes.ok) {
          const faqData = await faqRes.json();
          try {
            let cleanText = (faqData.text || "").trim();
            if (cleanText.startsWith("```json")) {
              cleanText = cleanText.replace(/^```json/, "").replace(/```$/, "").trim();
            } else if (cleanText.startsWith("```")) {
              cleanText = cleanText.replace(/^```/, "").replace(/```$/, "").trim();
            }
            faqList = JSON.parse(cleanText);
            addLog(`🤝 Sıkça Sorulan 3 Soru ve Cevap (Sitemap FAQ Schema) üretildi.`, "success");
          } catch (e) {
            // default faq
          }
        }
      }

      // Step 5: Professional Banner Image Generation
      let coverImageUrl = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200";
      if (generateCover && !isCancelled.current) {
        setCurrentStep(5);
        setProgress(95);
        addLog(`⚡ [AŞAMA 5] Markaya ve İçeriğe Özel Orijinal Kapak Resmi Tasarlanıyor...`, "info");
        
        const imgPrompt = `Cinematic professional photograph of ${selectedProduct.brand || "motosiklet"} ${selectedProduct.title} spare part, workshop repair station, intense lighting, soft contrast, 8k resolution, award winning photography`;
        addLog(`🎨 Görsel Ajanı promptu aldı: "${imgPrompt}"`, "info");

        try {
          const imgRes = await fetch("/api/ai/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: imgPrompt })
          });
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            coverImageUrl = imgData.image || coverImageUrl;
            addLog(`🖼️ AI Kapak Görseli Başarıyla Üretildi! CDN bağlantısı kuruldu.`, "success");
          } else {
            addLog(`⚠️ Görsel ajansından cevap alınamadı, yedek görsel atanıyor.`, "warning");
          }
        } catch (e) {
          addLog(`⚠️ Görsel üretimi hata verdi, yedek görsel atanıyor.`, "warning");
        }
      }

      // Done
      if (isCancelled.current) return;
      setCurrentStep(6);
      setProgress(100);
      setStatus("completed");
      addLog(`🎉 SEO Karar ve İçerik Ajanı Görevini Başarıyla Tamamladı!`, "success");

      setGeneratedBlog({
        title: seoMeta.title,
        excerpt: seoMeta.excerpt,
        content: blogHtml,
        coverImage: coverImageUrl,
        metaTitle: seoMeta.meta_title,
        metaDescription: seoMeta.meta_description,
        tags: seoMeta.tags || ["motosiklet", "yedek-parca", selectedProduct.brand || "bakim"],
        faq: faqList
      });

      toast({
        title: "SEO Ajanı Çalışmayı Tamamladı!",
        description: "Blog yazınız, SSS alanı ve AI kapak görseliniz hazır. Aşağıdan inceleyebilirsiniz."
      });

    } catch (err: any) {
      setStatus("error");
      addLog(`❌ Hata Oluştu: ${err.message}`, "error");
      toast({ title: "Ajan Durduruldu", description: err.message, variant: "destructive" });
    }
  };

  const saveToDatabase = async () => {
    if (!generatedBlog) return;
    setSaving(true);

    const baseSlug = slugify(generatedBlog.title);
    const finalSlug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

    const tagsWithStatic = Array.from(new Set([...generatedBlog.tags, selectedProduct?.brand || "Motosiklet"]));

    try {
      const { error } = await dbClient.from("posts").insert({
        title: generatedBlog.title,
        slug: finalSlug,
        excerpt: generatedBlog.excerpt,
        content: generatedBlog.content,
        cover_image: generatedBlog.coverImage,
        meta_title: generatedBlog.metaTitle,
        meta_description: generatedBlog.metaDescription,
        is_published: saveAsPublished,
        published_at: saveAsPublished ? new Date().toISOString() : null,
        tags: tagsWithStatic
      });

      if (error) throw error;

      toast({
        title: saveAsPublished ? "Blog Yayında!" : "Taslak Kaydedildi",
        description: `"${generatedBlog.title}" başlıklı yazınız başarıyla posts tablosuna kaydedildi.`
      });
      
      // Reset state or show success
      setSelectedProduct(null);
      setStatus("idle");
      setGeneratedBlog(null);
    } catch (e: any) {
      toast({ title: "Kaydetme Başarısız", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/40 pb-5 gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
              <h1 className="font-heading font-bold text-2xl text-foreground">SEO Uzmanı Yapay Zeka Ajanı</h1>
            </div>
            <p className="text-sm text-muted-foreground mr-2">
              Katalogdaki her bir makine parçası için tam uyumlu, görsel sunumlu ve Google standartlarında Blog makalesi üreten otonom sistem
            </p>
          </div>
          <button
            onClick={handleRandomSelect}
            className="px-4 py-2 border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 rounded-lg text-sm font-medium transition-all"
          >
            🎲 Katalogdan Rastgele Seç
          </button>
        </div>

        {/* Configuration grid */}
        {status !== "running" && !generatedBlog && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Product Select */}
            <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-border/30 flex flex-col h-[520px]">
              <h2 className="font-heading font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                <span className="text-purple-400">1.</span> Blog Konusu Ürünü Seçin
              </h2>
              
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ürün adı, OEM Kodu (SKU) veya Marka arayın..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-muted/60 border border-border/80 rounded-xl text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-purple-400"
                />
              </div>

              {/* Product List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {productsLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-20 text-muted-foreground text-sm">Aranan kriterde ürün bulunamadı.</div>
                ) : (
                  filteredProducts.map((p) => {
                    const isSelected = selectedProduct?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedProduct(p)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          isSelected
                            ? "bg-purple-500/10 border-purple-500/50 hover:bg-purple-500/15"
                            : "bg-muted/30 border-border/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-xs text-foreground truncate max-w-[280px] sm:max-w-[340px] md:max-w-md">{p.title}</h3>
                          {p.sku && <span className="font-mono text-[10px] bg-slate-800 text-purple-300 px-1.5 py-0.5 rounded">{p.sku}</span>}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                          <span>Marka: {p.brand || "Tüm Markalar"}</span>
                          {p.price ? <span className="text-foreground font-semibold font-mono">{p.price} TL</span> : null}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {selectedProduct && (
                <div className="mt-4 p-3 bg-purple-500/5 rounded-xl border border-purple-500/20 flex items-center justify-between gap-3 shrink-0">
                  <div className="truncate flex-1">
                    <p className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">Seçilen Ürün</p>
                    <p className="text-xs font-semibold text-foreground truncate">{selectedProduct.title}</p>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="text-muted-foreground hover:text-red-400 transition-colors shrink-0 text-xs px-2.5 py-1"
                  >
                    Vazgeç
                  </button>
                </div>
              )}
            </div>

            {/* Right: AI Agent Settings */}
            <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-border/30 flex flex-col h-[520px] justify-between">
              <div>
                <h2 className="font-heading font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
                  <span className="text-purple-400">2.</span> Ajan Karakteri & Kuralları
                </h2>

                <div className="space-y-4">
                  {/* Writing Tone */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-2">Makale Yazım Tonu</label>
                    <div className="grid grid-cols-2 gap-2">
                      {toneOptions.map((opt) => {
                        const isSelected = selectedTone === opt.value;
                        return (
                          <div
                            key={opt.value}
                            onClick={() => setSelectedTone(opt.value)}
                            className={`p-2 rounded-xl border text-center cursor-pointer text-xs font-medium transition-all ${
                              isSelected
                                ? "bg-purple-500/10 border-purple-500/50 text-purple-300"
                                : "bg-muted/30 border-border/50 hover:bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            <span className="mr-1">{opt.icon}</span> {opt.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Keywords */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Özel Eklenecek Anahtar Kelimeler (İsteğe Bağlı)
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: motor bakımı, aşınma tespiti, usta önerisi..."
                      value={customKeywords}
                      onChange={(e) => setCustomKeywords(e.target.value)}
                      className="w-full px-3 py-2 bg-muted/60 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-400"
                    />
                  </div>

                  {/* Article length & additional triggers */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground block mb-1">Min. Kelime Sayısı</label>
                      <select
                        value={minWords}
                        onChange={(e) => setMinWords(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-muted/60 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none"
                      >
                        <option value={400}>400 Kelime</option>
                        <option value={600}>600 Kelime (Önerilen)</option>
                        <option value={800}>800 Kelime (Derinlemesine)</option>
                      </select>
                    </div>
                    
                    <div className="flex flex-col justify-end space-y-2">
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generateFaq}
                          onChange={(e) => setGenerateFaq(e.target.checked)}
                          className="rounded border-border bg-muted/60 text-purple-500 focus:ring-0"
                        />
                        <span>FAQ / SSS Üret</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                        <input
                          type="checkbox"
                          checked={generateCover}
                          onChange={(e) => setGenerateCover(e.target.checked)}
                          className="rounded border-border bg-muted/60 text-purple-500 focus:ring-0"
                        />
                        <span>AI Kapak Görseli Üret</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Start CTA */}
              <div className="border-t border-border/30 pt-4 mt-4">
                <button
                  onClick={runSEOAgent}
                  disabled={!selectedProduct}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" /> SEO Blog Ajanını Çalıştır
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Running Screen */}
        {status === "running" && (
          <div className="glass-card rounded-2xl p-6 border border-purple-500/20 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border/30 pb-4">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                <div>
                  <h3 className="font-heading font-semibold text-foreground text-sm">SEO Karar ve Yazım Ajanı Aktif</h3>
                  <p className="text-xs text-muted-foreground">Otonom SEO adımları sırayla icra ediliyor...</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full">
                  İlerleyiş: %{progress}
                </span>
                <button
                  onClick={() => {
                    isCancelled.current = true;
                    setStatus("idle");
                    addLog("🚨 Operasyon kullanıcı tarafından iptal edildi.", "warning");
                  }}
                  className="text-xs font-medium px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  İptal Et
                </button>
              </div>
            </div>

            {/* Stepper tracker */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { step: 1, label: "Anahtar Kelime Analizi" },
                { step: 2, label: "SEO Planı & Başlık" },
                { step: 3, label: "Semantik Makale Yazımı" },
                { step: 4, label: "FAQ / Schema SSS" },
                { step: 5, label: "Kapak Tasarım Ajanı" }
              ].map((item) => {
                const isActive = currentStep === item.step;
                const isCompleted = currentStep > item.step;
                return (
                  <div
                    key={item.step}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isActive
                        ? "bg-purple-500/10 border-purple-500/50 text-purple-300"
                        : isCompleted
                        ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-300"
                        : "bg-muted/20 border-border/30 text-muted-foreground"
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                      ) : (
                        <span className="text-xs font-mono">{item.step}. Adım</span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Interactive Terminal screen */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-2 h-[220px] overflow-y-auto flex flex-col justify-start">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 sticky top-0 bg-slate-950 text-slate-400">
                <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> AGENT_ENGINE_JOURNAL.LOG</span>
                <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-purple-400">v1.2.5 Stable</span>
              </div>
              <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
                {logs.map((log, idx) => {
                  const colorClass =
                    log.type === "success"
                      ? "text-emerald-400"
                      : log.type === "warning"
                      ? "text-yellow-400"
                      : log.type === "error"
                      ? "text-red-400"
                      : "text-slate-300";
                  return (
                    <div key={idx} className="flex gap-2">
                      <span className="text-slate-500 select-none">[{log.time}]</span>
                      <span className={colorClass}>{log.msg}</span>
                    </div>
                  );
                })}
                <div ref={terminalBottomRef} />
              </div>
            </div>
          </div>
        )}

        {/* Finished / Result Preview State */}
        <AnimatePresence>
          {generatedBlog && status !== "running" && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Actions Header */}
              <div className="glass-card rounded-2xl p-4 border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h3 className="font-heading font-semibold text-foreground text-sm">SEO Makalesi Başarıyla Üretildi!</h3>
                    <p className="text-xs text-muted-foreground">Lütfen son kontrolleri yapın ve kaydedin.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveAsPublished}
                      onChange={(e) => setSaveAsPublished(e.target.checked)}
                      className="rounded border-border text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Doğrudan Sitede Yayınla</span>
                  </label>
                  <button
                    onClick={saveToDatabase}
                    disabled={saving}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Makaleyi Sisteme Kaydet
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedBlog(null);
                      setStatus("idle");
                    }}
                    className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold hover:bg-muted/80 transition-colors"
                  >
                    Yeni Makale Üret
                  </button>
                </div>
              </div>

              {/* Layout for preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left side: Preview */}
                <div className="lg:col-span-8 space-y-6 bg-muted/20 border border-border/40 p-6 rounded-2xl">
                  {/* Blog cover */}
                  {generatedBlog.coverImage && (
                    <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border bg-muted/60 relative">
                      <img
                        src={generatedBlog.coverImage}
                        alt="Kapak Resmi"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent flex items-bottom p-6 flex-col justify-end">
                        <span className="bg-purple-600/90 text-white text-[10px] px-2.0 py-0.5 rounded-md font-sans font-bold self-start mb-2 uppercase tracking-wide">
                          Yapay Zeka
                        </span>
                        <h2 className="text-lg md:text-xl font-heading font-bold text-white leading-tight drop-shadow-sm">
                          {generatedBlog.title}
                        </h2>
                      </div>
                    </div>
                  )}

                  {/* Blog HTML Content */}
                  <div className="prose prose-invert max-w-none text-muted-foreground text-sm font-sans space-y-4">
                    <h3 className="font-semibold text-card-foreground text-sm border-b pb-2">Makale Gövdesi (Semantik HTML)</h3>
                    <div
                      className="space-y-4 leading-relaxed tracking-normal"
                      dangerouslySetInnerHTML={{ __html: generatedBlog.content }}
                    />
                  </div>

                  {/* FAQ Accordion preview */}
                  {generatedBlog.faq && generatedBlog.faq.length > 0 && (
                    <div className="space-y-3 pt-6 border-t border-border/30">
                      <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-purple-400" /> Sıkça Sorulan Sorular (Faq Schema)
                      </h3>
                      <div className="space-y-2">
                        {generatedBlog.faq.map((fq, idx) => (
                          <div key={idx} className="bg-muted/40 border border-border/40 p-4 rounded-xl">
                            <p className="font-semibold text-xs text-foreground mb-1">❓ {fq.question}</p>
                            <p className="text-xs text-muted-foreground">{fq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right side: SEO Sidebar Panel */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="glass-card p-5 rounded-2xl border border-border/30 space-y-4">
                    <h3 className="font-heading font-semibold text-sm text-foreground flex items-center gap-1.5 border-b border-border/40 pb-3">
                      <Sparkles className="w-4 h-4 text-purple-400" /> SEO Yapılandırma Verileri
                    </h3>

                    {/* Meta title */}
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">
                        SEO Meta Başlık
                      </span>
                      <textarea
                        value={generatedBlog.metaTitle}
                        onChange={(e) => setGeneratedBlog({ ...generatedBlog, metaTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-muted/60 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-400 custom-scrollbar"
                        rows={2}
                      />
                    </div>

                    {/* Meta description */}
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">
                        SEO Meta Açıklama
                      </span>
                      <textarea
                        value={generatedBlog.metaDescription}
                        onChange={(e) => setGeneratedBlog({ ...generatedBlog, metaDescription: e.target.value })}
                        className="w-full px-3 py-2 bg-muted/60 border border-border/80 rounded-xl text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-400 custom-scrollbar"
                        rows={3}
                      />
                    </div>

                    {/* Tags */}
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground block mb-1">Etiketler</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {generatedBlog.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] px-2.0 py-0.5 rounded-full font-sans font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Product anchor info */}
                    <div className="p-3 bg-purple-500/5 rounded-xl border border-purple-500/10 space-y-1">
                      <p className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">İç Bağlantı Eşleştirildi</p>
                      <p className="text-[11px] text-foreground font-medium truncate">{selectedProduct?.title}</p>
                      <p className="text-[10px] text-muted-foreground truncate font-mono">
                        Hedef: /yedek-parca/{selectedProduct?.slug}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
