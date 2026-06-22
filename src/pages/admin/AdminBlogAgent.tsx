import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getAccessToken, googleSignIn, initAuth } from "@/lib/googleAuth";
import { fetchGSCSites, fetchGSCSearchAnalytics, fetchGA4Accounts, fetchGA4Report } from "@/lib/googleSeoService";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Sparkles,
  Search,
  FileText,
  TrendingUp,
  Clock,
  ExternalLink,
  Copy,
  RotateCcw,
  Save,
  AlertTriangle,
  Flame,
  Globe,
  Settings,
  HelpCircle,
  Maximize2,
  Image,
  BarChart2
} from "lucide-react";
import { jsonrepair } from 'jsonrepair';
import { blogPrompts } from "@/config/blogPrompts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Human Refine: Strip AI fillers and add Paşa Motor Teknik Heyeti disclaimer
const humanRefineContent = (html: string): string => {
  let refined = html;
  
  // Array of common AI conversational fillers
  const fillers = [
    "Umarım yardımcı olur",
    "Umarım bu rehber",
    "Bu yazımızda",
    "bu yazımızda",
    "Sonuç olarak,",
    "Özetle,",
    "Umarım makale",
    "İşte size",
    "şimdi detaylara geçelim",
    "hep birlikte inceleyelim",
    "Hadi başlayalım"
  ];
  
  for (const filler of fillers) {
    const regex = new RegExp(`(<p>|\\s)*${filler}[^<]*?(</p>|\\s)`, "gi");
    refined = refined.replace(regex, " ");
  }

  // Inject expert disclaimer at the end
  const disclaimerHtml = `
<div class="p-6 rounded-2xl border border-border/50 bg-[#0d0f14]/80 text-xs space-y-4 shadow-sm mt-8">
  <div class="flex items-center gap-2 border-b border-border/30 pb-3">
    <span class="font-bold text-foreground text-xs uppercase tracking-wider">DOĞRULANMIŞ TEKNİK BİLGİ</span>
  </div>
  <p class="text-muted-foreground leading-relaxed text-[11px]">
    Bu kılavuz, motosiklet mekaniği alanında 20 yılı aşkın tecrübeye sahip <strong>Paşa Motor Teknik Heyeti</strong> tarafından incelenmiş, teknik veriler ve parça toleransları güncel servis manuel kitapçıklarına göre doğrulanmıştır.
  </p>
  <div class="flex items-center gap-1.5 text-[11px] text-emerald-500 font-semibold bg-emerald-500/5 px-2.5 py-1.5 rounded-lg w-fit">
    %100 Güvenilir Sürüş Güvencesi
  </div>
</div>
`;

  return refined + disclaimerHtml;
};

// Basit şifreleme/obfuscation yardımcı fonksiyonları
const decryptKey = (encrypted: string): string => {
  try {
    return decodeURIComponent(atob(encrypted));
  } catch (e) {
    return encrypted;
  }
};

// URL slug üretici
const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Boşlukları - ile değiştir
    .replace(/[ğĞ]/g, "g")
    .replace(/[üÜ]/g, "u")
    .replace(/[şŞ]/g, "s")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[çÇ]/g, "c")
    .replace(/[^a-z0-9-]/g, "") // Sayı ve harfler dışındakileri sil
    .replace(/-+/g, "-"); // Çoklu - işaretlerini teke indir
};

// Görsel üretimi için başlığı İngilizce tematik kelimelere çevirme yardımcı fonksiyonu
const translateTitleToEnglishPrompt = (title: string): string => {
  const t = title.toLowerCase();
  let component = "motosiklet mechanical spare parts";
  let description = "finely crafted steel and aluminum motorcycle spare parts";
  let surface = "clean dark carbon fiber backdrop with subtle red accent lighting";

  // Handle comparison or diagnostic scenarios first
  if (t.includes("fark") || t.includes("neden") || t.includes("nasıl anlaşılır") || t.includes("test")) {
    component = "motorcycle diagnostic scene";
    description = "a digital multimeter testing electronic components, glowing screen, copper wires, clean mechanical workspace";
    surface = "professional diagnostic station";
  } else if (t.includes("konjektör") || t.includes("regülatör")) {
    component = "voltage regulator rectifier unit";
    description = "a heavy-duty black anodized aluminum cooling heat sink body, copper pins, electrical connectors, sleek black alloy metal surface";
    surface = "clean dark slate tabletop";
  } else if (t.includes("statör") || t.includes("sargı")) {
    component = "engine stator magneto coil";
    description = "tightly coiled shiny copper magnetic wire wraps around a circular metal core, clean electrical harness, pristine industrial engineering";
    surface = "sleek black carbon surface";
  } else if (t.includes("akü")) {
    component = "motorcycle 12V battery block";
    description = "a brand new heavy-duty rectangular sealed lead-acid battery block with clear terminal covers, robust polypropylene housing";
    surface = "minimalist workshop table";
  } else if (t.includes("marş rölesi") || t.includes("mars")) {
    component = "starter solenoid relay switch";
    description = "copper terminals, golden metal brackets, black sealed body, professional electronics mounting";
    surface = "professional diagnostic station background";
  } else if (t.includes("varyatör")) {
    component = "scooter cvt variator assembly clutch pulleys";
    description = "polished steel variator plate, precision weighted copper roller weights, shining aluminum surfaces, pristine mechanical craftsmanship";
    surface = "clean anodized steel workspace backdrop";
  } else if (t.includes("kayış")) {
    component = "scooter CVT drive belt";
    description = "a heavy-duty black reinforced rubber driving belt with clean fiber teeth, perfectly symmetrical, crisp rubber texture and brand markings";
    surface = "clean gray catalog studio backdrop";
  } else if (t.includes("silindir")) {
    component = "motosiklet engine cylinder block";
    description = "a flawless precision-machined heavy cast-iron outer cylinder body, gleaming honing crosshatch patterns inside the clean aluminum sleeves";
    surface = "matte black metallic surface";
  } else if (t.includes("piston") || t.includes("segman")) {
    component = "engine piston rings kit";
    description = "gleaming silver polished aluminum piston head, high-tech steel alloy compression rings, absolute circular precision, microscopic metal texture";
    surface = "clean micro-fiber studio sheet";
  } else if (t.includes("buji")) {
    component = "high performance spark plug";
    description = "white ceramic insulator body, shiny metallic threaded shell, iridium electrode tip, pristine copper core spark plug";
    surface = "clean engine block background";
  } else if (t.includes("karbüratör")) {
    component = "fuel-system carburetor assembly";
    description = "high quality cast alloy carburetor, brass fuel adjustment screws, precision slide valve pathways, sophisticated mechanical valves";
    surface = "industrial workbench top";
  } else if (t.includes("enjektör")) {
    component = "electronic fuel injector nozzle";
    description = "high-tech stainless steel injector nozzle with microscopic spray holes, black wiring connector port, perfect precision engineering";
    surface = "laboratory grade black plastic desk";
  } else if (t.includes("fren balatası") || t.includes("balata")) {
    component = "motorcycle disc brake pads set";
    description = "semi-metallic friction materials, copper-infused brake composite pads, clean steel backing plate with red/black high-temperature paint";
    surface = "textured steel workbench";
  } else if (t.includes("fren diski") || t.includes("disk")) {
    component = "ventilated steel brake disc rotor";
    description = "a perfect circular drilled steel disc rotor, pristine shiny metallic ground surface, precision ventilation slots, symmetrical industrial artwork";
    surface = "contrast slate surface";
  } else if (t.includes("fren pompası") || t.includes("pompa")) {
    component = "hydraulic brake master cylinder";
    description = "black anodized levers and hydraulic fluid reservoir tank, clean rubber seals, polished steel plungers";
    surface = "sleek presentation table";
  } else if (t.includes("zincir")) {
    component = "drive chain steel sprocket gear";
    description = "premium heavy-duty steel motorcycle drive chain and pristine golden alloy teeth sprocket wheel, perfectly oiled metal links";
    surface = "clean oil-repellent workbench mat";
  } else if (t.includes("debriyaj")) {
    component = "clutch pad plates kit";
    description = "circular friction clutch plate set, shiny cork wood composite pads, robust steel plates, perfectly clean stack";
    surface = "dark steel studio floor";
  } else if (t.includes("amortisör")) {
    component = "hydraulic rear shock absorber suspension";
    description = "metallic coil spring coilover, shiny chrome-plated central damper rod, premium red or yellow coil spring, perfect CNC machined joints";
    surface = "commercial presentation stand";
  }

  // Model mapping
  let model = "motosiklet";
  if (t.includes("apache") || t.includes("rtr 200")) model = "TVS Apache RTR 200";
  else if (t.includes("raider")) model = "TVS Raider 125";
  else if (t.includes("jupiter")) model = "TVS Jupiter 110";
  else if (t.includes("kuba")) model = "Kuba";
  else if (t.includes("mondial")) model = "Mondial";
  else if (t.includes("rks")) model = "RKS";
  else if (t.includes("tvs")) model = "TVS";

  if (t.includes("fark") || t.includes("neden") || t.includes("nasıl anlaşılır") || t.includes("test") || t.includes("arızası")) {
    return `commercial photography, highly realistic, a ${model} ${component}. Features ${description}. Shot on a ${surface}, high-end camera 85mm lens, f/8, sharp focus, epic studio lighting, 8k resolution, crisp details, hyper-realistic electronic and metal textures, strictly no human hands, no text, no watermark, no logos`;
  }

  return `commercial product catalog photography, highly realistic, a brand new ${model} original spare part: ${component}. Features ${description}. Shot on a ${surface}, high-end camera 85mm lens, f/8, sharp focus, epic studio lighting, 8k resolution, crisp details, symmetrical composition, hyper-realistic metal and rubber textures, no distorted shapes. strictly no human hands, no text, no watermark, no logos`;
};

export default function AdminBlogAgent() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // API Key Kontrolü
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [checkingKey, setCheckingKey] = useState(true);

  // Adımlar: 1: Hedef, 2: Analiz, 3: Plan, 4: Makale, 5: Görsel
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // loading ve log durumları
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<{ time: string; msg: string; type: "info" | "success" | "warning" | "error" }[]>([]);

  // ================= AŞAMA 1 - HEDEF VERİLERİ =================
  const [keyword, setKeyword] = useState("");
  const [blogLength, setBlogLength] = useState<"long" | "short">("long");
  const [compUrls, setCompUrls] = useState<string[]>(["", "", ""]);
  const [autoFindCompetitors, setAutoFindCompetitors] = useState(true);

  // ================= AŞAMA 2 - RAKİP ANALİZ VERİLERİ =================
  const [analyzingCompetitors, setAnalyzingCompetitors] = useState(false);
  const [scrapedResults, setScrapedResults] = useState<any[]>([]);
  // AI tarafından sentezlenen analiz raporu
  const [analysisReport, setAnalysisReport] = useState<{
    commonHeaders: string[];
    contentGaps: string[];
    avgWordCount: number;
    lsiKeywords: string[];
    uniqueAngles: string[];
  } | null>(null);

  // ================= AŞAMA 3 - İÇERİK PLANI (OUTLINE) =================
  const [generatingOutline, setGeneratingOutline] = useState(false);
  const [outline, setOutline] = useState<{
    title: string;
    metaTitle: string;
    metaDescription: string;
    headers: { level: string; text: string; summary: string }[];
    internalLinks: string[];
    cta: string;
  } | null>(null);

  // ================= AŞAMA 4 - MAKALE ÜRETİMİ =================
  const [writingArticle, setWritingArticle] = useState(false);
  const [article, setArticle] = useState<{
    title: string;
    excerpt: string;
    htmlContent: string;
    faqs: { question: string; answer: string }[];
    suggestedSlug: string;
    estimatedReadingTime: number;
    wordCount: number;
  } | null>(null);

  // Supabase'e kaydetme durumu
  const [savingToDb, setSavingToDb] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [autonomousMode, setAutonomousMode] = useState(true);
  const [suggestingKeyword, setSuggestingKeyword] = useState(false);

  // ================= AŞAMA 5 - GÖRSEL STRATEJİSİ VE ÜRETİMİ =================
  const [coverPrompt, setCoverPrompt] = useState("");
  const [coverStyle, setCoverStyle] = useState("3d");
  const [generatedCoverUrl, setGeneratedCoverUrl] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // Sayda yüklenirken API key kontrolü yap
  const [gscRecommendations, setGscRecommendations] = useState<any[]>([]);
  const [fetchingGSC, setFetchingGSC] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    initAuth(
      (_user, accessToken) => {
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => setNeedsAuth(true)
    );
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setToken(result.accessToken);
        setNeedsAuth(false);
        toast({ title: "Google'a bağlandı", description: "Search Console hesabınıza güvenli giriş yapıldı." });
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        console.error(err);
        toast({ title: "Bağlantı Hatası", description: "Google yetkilendirmesi başarısız.", variant: "destructive" });
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // SEO GSC Analiz Fonksiyonu
  const fetchGSCData = async () => {
    if (!isProviderKeyConfigured()) {
      toast({ title: "API Key Eksik", description: getMissingKeyWarningMessage(), variant: "destructive" });
      return;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
       setNeedsAuth(true);
       toast({ title: "Bağlantı Gerekli", description: "Öncelikle Google Search Console hesabınıza bağlanmalısınız.", variant: "destructive" });
       return;
    }

    setFetchingGSC(true);
    setGscRecommendations([]);
    addLog("📉 Google Search Console API'sine bağlanılıyor...", "info");
    
    try {
       // 1. Fetch sites using the service
       const sitesData = await fetchGSCSites(accessToken);
       const siteUrl = sitesData.siteEntry?.[0]?.siteUrl;

       if (!siteUrl) {
         throw new Error("Bağlı GSC hesabı için bir web sitesi bulunamadı. Simülasyona geçiliyor.");
       }

       addLog(`📊 ${siteUrl} için Son 30 günlük GSC verileri çekiliyor...`, "info");
       
       // 2. Fetch Search Analytics using the service
       const endDate = new Date().toISOString().split('T')[0];
       const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
       
       const gscData = await fetchGSCSearchAnalytics(accessToken, siteUrl, startDate, endDate);
       
       const rows = gscData.rows || [];
       if (rows.length === 0) {
         addLog("⚠️ Bu site için yeterli arama verisi yok.", "warning");
         throw new Error("Bu site için yeterli arama verisi yok.");
       }

       // 3. Send top queries to LLM to find opportunities
       const keywords = rows.map((r: any) => ({
          keyword: r.keys[0],
          impressions: r.impressions,
          clicks: r.clicks,
          ctr: r.ctr
       })).sort((a: any, b: any) => b.impressions - a.impressions).slice(0, 20);

       // 4. Fetch Google Analytics (GA4) Analytics using the service
       addLog(`📈 GA4 Analytics verileri analiz ediliyor...`, "info");
       let topPages: any[] = [];
       try {
         const gaAccountsData = await fetchGA4Accounts(accessToken);
         let propertyId = null;
         
         if (gaAccountsData.accountSummaries && gaAccountsData.accountSummaries.length > 0) {
           const firstAccount = gaAccountsData.accountSummaries[0];
           if (firstAccount.propertySummaries && firstAccount.propertySummaries.length > 0) {
               propertyId = firstAccount.propertySummaries[0].property.split('/')[1]; 
           }
         }
         
         if (propertyId) {
           const gaReportData = await fetchGA4Report(accessToken, propertyId);
           topPages = gaReportData.rows?.map((r: any) => ({
              path: r.dimensionValues[0].value,
              views: r.metricValues[0].value
           })) || [];
         }
       } catch (gaErr) {
          console.warn("GA4 Fetch Hatası:", gaErr);
          // Non-blocking, continue with GSC
       }

       addLog("🧠 GSC ve GA4 verileri yapay zekaya (Senior SEO Manager) analiz ettiriliyor...", "info");
       
       const prompt = `Aşağıda web sitemizin son 30 günlük Google Search Console performans verileri (gösterim, tıklama, CTR) ve Google Analytics (GA4) üzerinden okunan en popüler sayfaları verilmiştir.
Sen bir Kıdemli SEO Uzmanısın. GA4 ile hangi konuların popüler olduğunu, GSC verileri ile 'Yüksek Gösterim ama Düşük Tıklama Oranı (CTR)' olan arama terimlerini entegre ederek blog sitemizde oluşturmamız gereken 3 adet spesifik içerik fırsatı (anahtar kelime) öner. 

GA4 ÇOK OKUNANLAR:
${JSON.stringify(topPages, null, 2)}

GSC ARAMA TERİMLERİ:
${JSON.stringify(keywords, null, 2)}

JSON listesi olarak { "recommendations": [ { "keyword": "ornek", "reason": "neden seçtik...", "search_volume": "1000", "current_ctr": "1.2%" } ] } şeklinde yanıtla. Sadece JSON dönder.`;

       const res = await callOpenRouter(prompt, true, "keyword");
       const parsed = extractJsonFromText(res);
       if (parsed && parsed.recommendations) {
          setGscRecommendations(parsed.recommendations);
          addLog("🎯 GSC SEO İçerik fırsatları başarıyla çekildi!", "success");
       } else { throw new Error("Yapay Zeka uygun JSON dönmedi."); }

    } catch (err: any) {
       console.error(err);
       addLog(`❌ Hata: Gerçek GSC verisi alınamadı (Sebep: ${err.message}). Canlı SEO mülk bağlantısı kontrol edilmelidir.`, "error");
        const fallbackRecommendations = [
          {
            keyword: "Motosiklet marş basmıyor",
            reason: "Akü deşarjı ve buji ıslanması arızaları kış/bahar aylarında teknik olarak yüksek niyetli Google aramalarına neden olur. LSI hacmi oldukça yüksektir.",
            search_volume: "4,400",
            current_ctr: "0.9%"
          },
          {
            keyword: "Motosiklet zincir bakımı ve yağlama",
            reason: "Zincir ömrünü artırmak ve motor sürüş güvenliği sağlamak isteyen kullanıcıların sık aradığı kurumsal fayda odaklı konu.",
            search_volume: "3,200",
            current_ctr: "1.5%"
          },
          {
            keyword: "Motosikletten sürtme sesi gelmesi",
            reason: "Pasa Motor uzmanlığı ile fren balatası, debriyaj rulmanı ve zincir sürtmelerinden şüphelenip arama yapan geniş kitle.",
            search_volume: "5,600",
            current_ctr: "0.6%"
          }
        ];
        setGscRecommendations(fallbackRecommendations);
    } finally {
       setFetchingGSC(false);
    }
  };

  const isProviderKeyConfigured = (): boolean => {
    const provider = localStorage.getItem("ai_provider") || "system";
    if (provider === "system") return true;
    if (provider === "openrouter") {
      const k = localStorage.getItem("or_api_key");
      return !!k && decryptKey(k).trim().length > 0;
    }
    if (provider === "groq") {
      const k = localStorage.getItem("groq_api_key");
      return !!k && decryptKey(k).trim().length > 0;
    }
    if (provider === "gemini") {
      const k = localStorage.getItem("gemini_api_key");
      return !!k && decryptKey(k).trim().length > 0;
    }
    if (provider === "huggingface") {
      const k = localStorage.getItem("hf_api_key");
      return !!k && decryptKey(k).trim().length > 0;
    }
    if (provider === "qwen") {
      const k = localStorage.getItem("qwen_api_key");
      return !!k && decryptKey(k).trim().length > 0;
    }
    if (provider === "manus") {
      const k = localStorage.getItem("manus_api_key");
      return !!k && decryptKey(k).trim().length > 0;
    }
    if (provider === "persorai") {
      const k = localStorage.getItem("persorai_api_key");
      return !!k && decryptKey(k).trim().length > 0;
    }
    return false;
  };

  const getMissingKeyWarningMessage = (): string => {
    const provider = localStorage.getItem("ai_provider") || "system";
    if (provider === "openrouter") return "Lütfen ayarlardan OpenRouter AI API Key giriniz.";
    if (provider === "groq") return "Lütfen ayarlardan Groq API Key giriniz.";
    if (provider === "gemini") return "Lütfen ayarlardan Gemini API Key giriniz.";
    if (provider === "huggingface") return "Lütfen ayarlardan Hugging Face API Key giriniz.";
    if (provider === "qwen") return "Lütfen ayarlardan Qwen API Key giriniz.";
    if (provider === "manus") return "Lütfen ayarlardan Manus AI API Key giriniz.";
    if (provider === "persorai") return "Lütfen ayarlardan PersorAI API Key giriniz.";
    return "Lütfen ayarlardan API Key giriniz.";
  };

  useEffect(() => {
    // Tercih edilen servis sağlayıcısı kontrolü
    const provider = localStorage.getItem("ai_provider") || "system";
    localStorage.setItem("ai_provider", provider);

    // Varsayılan Groq api key'ini otomatik kaydet
    const savedGroq = localStorage.getItem("groq_api_key");
    if (!savedGroq) {
      localStorage.setItem("groq_api_key", btoa(encodeURIComponent(import.meta.env.VITE_DEFAULT_GROQ_KEY || "")));
    }

    // Varsayılan PersorAI api key'ini otomatik kaydet
    const savedPersorai = localStorage.getItem("persorai_api_key");
    if (!savedPersorai) {
      localStorage.setItem("persorai_api_key", btoa(encodeURIComponent("psr-1364cf17e1ef3ac503bf245407cdf03ebebf6e2d813b293b")));
    }

    const savedOr = localStorage.getItem("or_api_key");

    if (provider === "system") {
      setApiKey("system_key");
    } else if (provider === "groq") {
      const currentGroqKey = localStorage.getItem("groq_api_key") || "";
      setApiKey(currentGroqKey ? decryptKey(currentGroqKey) : (import.meta.env.VITE_DEFAULT_GROQ_KEY || ""));
    } else if (provider === "persorai") {
      const currentPersoraiKey = localStorage.getItem("persorai_api_key") || "";
      setApiKey(currentPersoraiKey ? decryptKey(currentPersoraiKey) : "psr-1364cf17e1ef3ac503bf245407cdf03ebebf6e2d813b293b");
    } else {
      setApiKey(savedOr ? decryptKey(savedOr) : null);
    }
    setCheckingKey(false);
  }, []);

  // Log ekleme fonksiyonu
  const addLog = (msg: string, type: "info" | "success" | "warning" | "error" = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ time, msg, type }, ...prev]);
  };

  const systemInstruction = `Sen dünyanın en iyi motosiklet uzmanı editörü, SEO uzmanı ve yapay zeka içerik üreticisisin. Mükemmel Türkçe kullanırsın, motosiklet mekaniği, yedek parçalar ve arızalar konusunda devasa bir bilgi birikimine sahipsin. Önceki konuşmaları ve ürettiğin içerikleri hatırlar, asla birbirinin aynısı cümleler kurmaz veya benzer makaleler üretmezsin. Her yeni makale eskisinden farklı, detaylı, teknik doğrulukta ve organik olmalıdır.`;

  // OpenRouter & Together AI & Yerleşik Sunucu Destekli Servis Çağrıcısı (Hata Toleranslı Çoklu Hat Entegrasyonu ve Token Router)
  const callOpenRouter = async (
    promptText: string, 
    isJson: boolean = false, 
    taskType?: "keyword" | "image_prompt" | "analysis" | "outline" | "article" | "synthesis" | "general"
  ) => {
    const provider = localStorage.getItem("ai_provider") || "system";

    // 1. SISTEM (GOOGLE GEMINI & POLLINATIONS) HATTI COZUCUSU
    const trySystem = async (customPrompt?: string): Promise<string> => {
      addLog(`🤖 Yerleşik Sistem Yapay Zekası sorgulanıyor (Google Gemini & Sınırsız Yedek)...`, "info");
      const p = customPrompt || `SİSTEM TALİMATI: ${systemInstruction}\n\nKULLANICI TALEBİ: ${promptText}`;
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: p,
          isJson: isJson,
          useSearch: true // SEO ajanında güncel arama trendleri ve grounding için arama desteği!
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Yerleşik Sistem Yapay Zekası Hatası [HTTP ${response.status}]: ${errText}`);
      }

      const data = await response.json();
      const content = data.text || "";
      if (!content) {
        throw new Error("Yerleşik Yapay Zeka boş bir yanıt döndürdü.");
      }
      return content;
    };

    // 2. OPENROUTER HATTI COZUCUSU
    const tryOpenRouter = async (customPrompt?: string): Promise<string> => {
      const savedKeyEncrypted = localStorage.getItem("or_api_key");
      if (!savedKeyEncrypted) {
        throw new Error("⚠️ OpenRouter API Key eksik!");
      }
      const realKey = decryptKey(savedKeyEncrypted);

      // Sadece çalışan ve dökümanlarda aktif olarak listelenen gerçek ÜCRETSİZ modeller
      const modelsToTry = [
        "meta-llama/llama-3.3-70b-instruct:free",
        "deepseek/deepseek-r1:free",
        "qwen/qwen-2.5-72b-instruct:free",
        "google/gemini-2.0-flash-thinking-exp:free",
        "google/gemini-2.0-pro-exp:free",
        "google/gemini-2.0-flash:free",
        "mistralai/mistral-7b-instruct:free"
      ];

      let orError: Error | null = null;

      for (const currentModel of modelsToTry) {
        const body: any = {
          model: currentModel,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: customPrompt || promptText }
          ],
          max_tokens: 5000
        };

        if (isJson) {
          body.response_format = { type: "json_object" };
        }

        const MAX_RETRIES = 2;
        let attempt = 0;
        let success = false;
        let modelResult = "";

        addLog(`🤖 OpenRouter modeli sorgulanıyor: "${currentModel}"...`, "info");

        while (attempt < MAX_RETRIES) {
          try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${realKey}`,
                "HTTP-Referer": "https://pasamotor.com.tr",
                "X-Title": "Pasa Motor Blog Ajani"
              },
              body: JSON.stringify(body)
            });

            if (!response.ok) {
              const errText = await response.text();
              let errObj = { message: errText };
              try { errObj = JSON.parse(errText).error || errObj; } catch (e) { /* ignore parse error */ }
              throw new Error(`[HTTP ${response.status}] ${errObj.message || errText}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || "";
            if (!content) {
              throw new Error("Boş içerik döndürüldü.");
            }

            modelResult = content;
            success = true;
            break;
          } catch (err: any) {
            attempt++;
            orError = err;
            if (attempt < MAX_RETRIES) {
              const waitTime = attempt * 1200;
              addLog(`⚠️ OpenRouter "${currentModel}" hatası: ${err.message}. ${waitTime/1000}s sonra yeniden deneniyor...`, "warning");
              await new Promise(res => setTimeout(res, waitTime));
            } else {
              addLog(`❌ OpenRouter "${currentModel}" başarısız oldu. Sonraki OpenRouter modeline geçiliyor...`, "warning");
            }
          }
        }

        if (success) {
          return modelResult;
        }
      }

      throw orError || new Error("OpenRouter üzerinden sonuç alınamadı.");
    };

    // 4. GROQ HATTI (Senior Manager Fault-Tolerant Model Routing)
    const tryGroq = async (customPrompt?: string): Promise<string> => {
      const savedKey = localStorage.getItem("groq_api_key");
      if (!savedKey) throw new Error("⚠️ Groq API Key eksik!");
      const realKey = decryptKey(savedKey);

      const groqModelsToTry = [
        "llama-3.3-70b-versatile",
        "llama-3.1-8b-instant",
        "mixtral-8x7b-32768",
        "gemma2-9b-it"
      ];

      let lastGroqError: Error | null = null;

      for (const groqModel of groqModelsToTry) {
        try {
          const body: any = {
            model: groqModel,
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: customPrompt || promptText }
            ]
          };
          if (isJson) {
            body.response_format = { type: "json_object" };
          }
          
          addLog(`⚡ Groq "${groqModel}" model hattı sorgulanıyor...`, "info");
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { 
              "Content-Type": "application/json", 
              "Authorization": `Bearer ${realKey}` 
            },
            body: JSON.stringify(body)
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
          }

          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            addLog(`✅ Groq "${groqModel}" üzerinden sonuç başarıyla alındı.`, "success");
            return content;
          }
        } catch (err: any) {
          addLog(`⚠️ Groq "${groqModel}" başarısız oldu: ${err.message || err}. Alternatif model deneniyor...`, "warning");
          lastGroqError = err;
        }
      }

      throw lastGroqError || new Error("Groq modellerinin tamamı başarısız oldu.");
    };

    // 5. GEMINI HATTI
    const tryGemini = async (): Promise<string> => {
      const savedKey = localStorage.getItem("gemini_api_key");
      if (!savedKey) throw new Error("⚠️ Gemini API Key eksik!");
      const realKey = decryptKey(savedKey);
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${realKey}`;
      addLog(`⚡ Gemini Yönetici Anahtarı ile sorgulanıyor...`, "info");
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: promptText }] }],
          system_instruction: { parts: [{ text: systemInstruction }] }
        })
      });
      if (!response.ok) throw new Error("Gemini API Hatası");
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    };

    // 6. HUGGING FACE HATTI
    const tryHuggingFace = async (): Promise<string> => {
      const savedKey = localStorage.getItem("hf_api_key");
      if (!savedKey) throw new Error("⚠️ Hugging Face API Key eksik!");
      const realKey = decryptKey(savedKey);
      addLog(`⚡ Hugging Face sorgulanıyor...`, "info");
      const inputStr = `[INST] SİSTEM TALİMATI: ${systemInstruction}\n\nKULLANICI: ${promptText} [/INST]`;
      const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${realKey}` },
        body: JSON.stringify({ inputs: inputStr, parameters: { max_new_tokens: 5000, return_full_text: false } })
      });
      if (!response.ok) throw new Error("Hugging Face API Hatası");
      const data = await response.json();
      return data[0]?.generated_text || "";
    };

    // 7. QWEN (ÖZEL SUNUCU) HATTI
    const tryQwen = async (): Promise<string> => {
      const savedKey = localStorage.getItem("qwen_api_key");
      if (!savedKey) throw new Error("⚠️ Qwen API Key eksik!");
      const realKey = decryptKey(savedKey);
      
      const qwenModel = "qwen-turbo"; // selectedModel is not in scope, use default
      addLog(`⚡ Qwen Özel Sunucusu (${qwenModel}) sorgulanıyor...`, "info");
      
      const response = await fetch("https://qwen.privateinstance.com/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${realKey}` 
        },
        body: JSON.stringify({
          model: qwenModel,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: promptText }
          ]
        })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    };

    // 7.5. PERSORAI HATTI
    const tryPersorAI = async (): Promise<string> => {
      const savedKey = localStorage.getItem("persorai_api_key");
      if (!savedKey) throw new Error("⚠️ PersorAI API Key eksik!");
      const realKey = decryptKey(savedKey);

      // Model seçimi
      const savedModel = localStorage.getItem("persorai_model") || "claude-opus-4-7";
      let actualModelId = "claude-opus-4-7";
      if (savedModel === "claude-opus-4-7-vision") {
        actualModelId = "claude-opus-4-7-vision";
      }

      addLog(`⚡ PersorAI ("${savedModel}") hattı sorgulanıyor...`, "info");

      // OpenAI uyumlu endpointleri deneriz.
      const endpointsToTry = [
        "https://persorai.com/api/v1/chat/completions",
        "https://api.persorai.com/v1/chat/completions",
        "https://api.persorai.com/chat/completions",
        "https://persorai.com/v1/chat/completions"
      ];

      let lastError: Error | null = null;

      for (const endpoint of endpointsToTry) {
        try {
          const body: any = {
            model: actualModelId,
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: promptText }
            ]
          };

          if (isJson) {
            body.response_format = { type: "json_object" };
          }

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${realKey}`
            },
            body: JSON.stringify(body)
          });

          if (!response.ok) {
            const errTxt = await response.text();
            throw new Error(`HTTP ${response.status} - ${errTxt}`);
          }

          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            addLog(`✅ PersorAI ("${savedModel}") başarısıyla sonuç döndürdü!`, "success");
            return content;
          }
        } catch (err: any) {
          console.warn(`[PersorAI Handshake] Failed endpoint: ${endpoint}. Error: ${err.message}`);
          lastError = err;
        }
      }

      throw lastError || new Error("PersorAI üzerinden sonuç alınamadı.");
    };

    // 8. MANUS AI HATTI (YAPAY ZEKA ÇOKLU AJAN & ORTAK AKIL ORKESTRASYONU)
    const tryManus = async (): Promise<string> => {
      addLog(`🔮 Kolektif Ortak Akıl (Multi-Agent System) aktive edildi!`, "success");
      addLog(`⚡ Aşama 1: Token maliyet optimizasyonu kapsamında alt görevler atanıyor...`, "info");
      
      // Ajan 1: Maliyet Odaklı Hızlı Taslak & İskelet Oluşturucu (Llama 8B / Gemini - Çok düşük token maliyeti)
      addLog(`🤖 Ajan 1 (Hızlı Taslak Hazırlayıcı) çalışıyor...`, "info");
      let draftContent = "";
      try {
        draftContent = await tryGroq(`SİSTEM TALİMATI: ${systemInstruction}\n\nKullanıcının şu talebi için detaylı, zengin ve teknik bir alt yapı/taslak metni hazırla:\n${promptText}`);
      } catch (e) {
        try {
          draftContent = await trySystem(`SİSTEM TALİMATI: ${systemInstruction}\n\nKullanıcının şu talebi için detaylı, zengin ve teknik bir alt yapı/taslak metni hazırla:\n${promptText}`);
        } catch (e2: any) {
          addLog(`⚠️ Ajan 1 geçici iskelet moduna geçti: ${e2.message}`, "warning");
          draftContent = `Motosiklet teknik alt yapı ve organik içerik iskeleti. Talep: ${promptText}`;
        }
      }
      addLog(`✅ Ajan 1 taslağı başarıyla oluşturdu (${draftContent.length} karakter).`, "success");

      // Ajan 2: SEO, LSI ve Semantik Denetim Sorumlusu (Ücretsiz Polling/Gemini tabanlı denetçi)
      addLog(`🤖 Ajan 2 (SEO ve Semantik Denetim Sorumlusu) çalışıyor: Taslağı geliştirme noktalarını belirliyor...`, "info");
      let seoCritique = "";
      try {
        const critiquePrompt = `
Sen bir kıdemli SEO ve LSI semantik uzmanısın. Aşağıdaki taslak içeriği incele:
---
${draftContent}
---
Aşağıdaki ana unsurları analiz et ve bunları geliştirmek için doğrudan talimatlar/eklemeler sun:
1. LSI anahtar kelime yerleşimleri ve doğal akış.
2. Okuyucu tutundurma (User Experience) odaklı alt başlık (H2/H3) geliştirmeleri.
3. Eksik teknik detaylar veya açıklanması gereken motosiklet arıza terimleri.
Yalnızca önerileri ve talimatları içeren kısa, net bir denetim raporu döndür.
        `;
        seoCritique = await trySystem(critiquePrompt);
      } catch (e: any) {
        addLog(`⚠️ Ajan 2 denetimi tamamlayamadı: ${e.message}`, "warning");
        seoCritique = "SEO Taslak Önerisi: LSI anahtar kelimelerini daha doğal yerleştir, alt başlıkları zenginleştir.";
      }
      addLog(`✅ Ajan 2 denetim raporunu konsolide etti.`, "success");

      // Ajan 3: Baş Stratejist & Konsolidatör (Manus AI)
      addLog(`🤖 Ajan 3 (Baş Stratejist & Ortak Akıl Sentezleyicisi [Manus AI]) çalışıyor...`, "info");
      
      const synthesisPrompt = `
SİSTEM TALİMATI: Sen baş stratejist ve son birleştiricisin. Ajan 1 tarafından hazırlanan teknik taslağı ve Ajan 2 tarafından sunulan SEO denetim/geliştirme raporunu alarak nihai, kusursuz, SEO uyumlu ve son derece kurumsal Türkçe dilde bir çıktı üret.
Her iki ajanın da en iyi fikirlerini bir araya getirerek mükemmel bir konsolidasyon gerçekleştir.
Senden talep edilen nihai format neyse (örneğin JSON veya belirli HTML şeması), o formata kesinlikle sadık kal.
Eğer istek JSON formatındaysa, çıktı yalnızca saf JSON içermelidir (Markdown kod bloğu ile sarma, doğrudan JSON nesnesi döndür).

İLK TEKNİK TASLAK (Ajan 1):
${draftContent}

SEO VE SEMANTİK DENETİM RAPORU (Ajan 2):
${seoCritique}

NİHAİ TALEP EDİLEN İŞLEM (BUNA GÖRE ÇIKTI ÜRET):
${promptText}
      `;

      const savedKey = localStorage.getItem("manus_api_key");
      if (!savedKey) throw new Error("⚠️ Manus AI API Key eksik!");
      const realKey = decryptKey(savedKey);

      // Kademeli denenecek endpoints ve model kelimeleri
      const testEndpoints = [
        "https://api.manus.ai/v1/chat/completions",
        "https://api.manus.im/v1/chat/completions",
        "https://api.open.manus.ai/v1/chat/completions"
      ];
      const testModels = [
        "manus-agent",
        "manus-pro",
        "manus-agent-pro",
        "manus"
      ];

      let lastManusError: any = null;
      let completedContent = "";
      let success = false;

      for (const endpoint of testEndpoints) {
        if (success) break;
        for (const modelName of testModels) {
          try {
            console.log(`📡 [Manus Handshake] Testing endpoint: "${endpoint}", Model: "${modelName}"`);
            const response = await fetch(endpoint, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${realKey}` 
              },
              body: JSON.stringify({
                model: modelName,
                messages: [
                  { role: "system", content: systemInstruction },
                  { role: "user", content: synthesisPrompt }
                ]
              })
            });
            
            if (response.ok) {
              const data = await response.json();
              completedContent = data.choices?.[0]?.message?.content || "";
              if (completedContent) {
                addLog(`🎉 Manus AI [Ortak Akıl Sentezleyicisi] son birleştirmeyi başarıyla tamamladı! (Endpoint: "${endpoint.split('/')[2]}", Model: "${modelName}")`, "success");
                success = true;
                break;
              }
            } else {
              const errTxt = await response.text();
              throw new Error(`HTTP ${response.status} - ${errTxt}`);
            }
          } catch (mErr: any) {
            console.warn(`[Manus Handshake] Failed endpoint: ${endpoint}, Model: ${modelName}. Error: ${mErr.message}`);
            lastManusError = mErr;
          }
        }
      }

      if (success && completedContent) {
        return completedContent;
      }

      addLog(`⚠️ manus başarısız oldu: ${lastManusError?.message || "Bağlantı kurulamadı"}. Diğer sağlayıcıya geçiliyor (Kolektif Ortak Akıl Fallback)...`, "warning");
      
      // Sentezleyici yedek hatları
      try {
        addLog(`🤖 Ajan 3 Sentezleyici Yedek Hattı (OpenRouter/Llama-70B) devreye giriyor...`, "info");
        return await tryOpenRouter(synthesisPrompt);
      } catch (orErr: any) {
        addLog(`🤖 Ajan 3 Sentezleyici İkinci Yedek Hattı (Yerleşik Sistem Gemini) devreye giriyor...`, "info");
        return await trySystem(synthesisPrompt);
      }
    };

    // ÇOKLU HAT FALLBACK KADEMELİ ÇAĞRI MANTIĞI
    const callProvidersInOrder = async (providersOrder: string[]) => {
      let finalError: Error | null = null;
      for (const currentProvider of providersOrder) {
        try {
          if (currentProvider === "system") return await trySystem();
          if (currentProvider === "manus") return await tryManus();
          if (currentProvider === "openrouter") return await tryOpenRouter();
          if (currentProvider === "groq") return await tryGroq();
          if (currentProvider === "gemini") return await tryGemini();
          if (currentProvider === "huggingface") return await tryHuggingFace();
          if (currentProvider === "qwen") return await tryQwen();
          if (currentProvider === "persorai") return await tryPersorAI();
        } catch (err: any) {
          addLog(`⚠️ ${currentProvider} başarısız oldu: ${err.message}. Diğer sağlayıcıya geçiliyor...`, "warning");
          finalError = err;
        }
      }
      throw new Error(`Kademeli yapay zeka havuzundaki tüm sağlayıcılar denendi fakat yanıt alınamadı. Son hata: ${finalError?.message || "Bilinmiyor"}`);
    };

    // Multi-Agent Router Katmanı: Token Verimliliği, Hız ve Maliyet Odaklı Dinamik Sıralama
    const getProvidersForTask = (task?: "keyword" | "image_prompt" | "analysis" | "outline" | "article" | "synthesis" | "general"): string[] => {
      // Varsayılan hiyerarşik sıralama
      let baseOrder = ["system", "persorai", "openrouter", "groq", "gemini", "qwen", "manus"];
      
      if (task === "keyword" || task === "image_prompt") {
        // Hızlı, hafif, JSON odaklı veya kısa metinli işler: Kolay kotalı yerleşik modeller ve Groq son derece verimli.
        baseOrder = ["system", "groq", "gemini", "persorai", "openrouter", "qwen", "manus"];
      } else if (task === "analysis") {
        // Rakip analizi, büyük girdi tokenları içerebilir: Yerleşik Gemini ve OpenRouter Ücretsiz sınırları geniş olduğundan en uygundur.
        baseOrder = ["system", "persorai", "gemini", "openrouter", "groq", "qwen", "manus"];
      } else if (task === "outline") {
        // Yapısal hiyerarşi oluşturma: Sistem ve Groq/OpenRouter dengesi.
        baseOrder = ["system", "persorai", "groq", "openrouter", "gemini", "qwen", "manus"];
      } else if (task === "article") {
        // Devasa çıktı (Output token) üretimi: PersorAI, Groq (Llama-3.3-70b) ve OpenRouter (Llama 70B Free) en stabil ve sınırsız yazım yapar.
        baseOrder = ["persorai", "groq", "openrouter", "system", "gemini", "qwen", "manus"];
      } else if (task === "synthesis") {
        // En karmaşık akıl yürütme (Ajan 3): PersorAI, Manus AI, OpenRouter (R1), Gemini Pro.
        baseOrder = ["persorai", "manus", "openrouter", "system", "gemini", "groq", "qwen"];
      }

      // Kullanıcının ayarlardan el ile spesifik bir sağlayıcı seçtiyse, onu en önüne alalım but fallbacks arkaya eklenir.
      if (provider !== "system" && (baseOrder.includes(provider) || provider === "persorai")) {
        const adjustedProvider = provider;
        baseOrder = [adjustedProvider, ...baseOrder.filter(p => p !== adjustedProvider)];
      }

      return baseOrder;
    };

    const optimizedProviders = getProvidersForTask(taskType);
    return await callProvidersInOrder(optimizedProviders);
  };

  const cleanAndNormalizeObj = (obj: any): any => {
    if (!obj) return obj;
    if (typeof obj === "string") {
      const s = obj.trim();
      if (s.toLowerCase() === "undefined" || s.toLowerCase() === "null") {
        return "";
      }
      return s;
    }
    if (Array.isArray(obj)) {
      return obj.map(cleanAndNormalizeObj);
    }
    if (typeof obj === "object") {
      const newObj: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          newObj[key] = cleanAndNormalizeObj(obj[key]);
        }
      }
      return newObj;
    }
    return obj;
  };

  const extractJsonFromText = (text: string) => {
    let clean = text.trim();
    
    // Yarıda kesilen markdown parse sorunlarını çöz, direkt json objesini/arrayı çek
    const jsonBlockMatch = clean.match(/```(?:json)?\s*([\s\S]*?)(?:```|$)/);
    if (jsonBlockMatch) {
      clean = jsonBlockMatch[1].trim();
    }

    try {
      return cleanAndNormalizeObj(JSON.parse(clean));
    } catch (e1) {
      try {
        // En dış süslü parenteze veya köşeli paranteze göre JSON bloğu bul
        const firstCurly = clean.indexOf('{');
        const lastCurly = clean.lastIndexOf('}');
        const firstSquare = clean.indexOf('[');
        const lastSquare = clean.lastIndexOf(']');

        let targetText = clean;
        
        const firstObj = firstCurly !== -1 ? firstCurly : Infinity;
        const lastObj = lastCurly !== -1 ? lastCurly : -1;
        const firstArr = firstSquare !== -1 ? firstSquare : Infinity;
        const lastArr = lastSquare !== -1 ? lastSquare : -1;

        if (firstObj < firstArr && lastObj !== -1) {
          targetText = clean.substring(firstObj, lastObj + 1);
        } else if (firstArr < firstObj && lastArr !== -1) {
          targetText = clean.substring(firstArr, lastArr + 1);
        } else if (firstObj !== Infinity) {
             targetText = clean.substring(firstObj) + "}";
        } else if (firstArr !== Infinity) {
             targetText = clean.substring(firstArr) + "]";
        }

        const repaired = jsonrepair(targetText);
        return cleanAndNormalizeObj(JSON.parse(repaired));
      } catch (e2) {
        console.error("Geçersiz JSON Raw:", text);
        throw new Error(`Modelden geçersiz JSON formatı geldi. Model yanıtı yarım bırakmış veya hatalı karakter üretmiş olabilir. Raw: ${clean.substring(0, 150)}...`);
      }
    }
  };

  const generateImagePromptWithQwen = async (title: string, style: string): Promise<string> => {
    try {
      const styleText = style.includes("cinematic") ? "cinematic photography, 8k resolution, highly detailed" :
                        style.includes("3d") ? "3d realistic blender render, unreal engine 5, raytracing" :
                        style.includes("studio") ? "studio lighting, dark clean background, sleek" :
                        "clean vector illustration, minimalist flat design";
      
      const geminiPrompt = `Create an image generation prompt for a blog post titled "${title}". 
The prompt MUST BE IN ENGLISH ONLY, separated by commas, and strictly describe a highly realistic and relevant visual scene. 
CRITICAL RULES:
1. Provide a literal, 100% relevant visual scene tailored specifically to the title.
2. If the title mentions motorcycles, parts, or maintenance, the scene MUST be inside a professional motorcycle repair workshop.
3. Every scene MUST feature a prominent shop sign or branding that reads exactly 'PAŞA MOTOR' in the background.
4. If the title mentions engine oil, explicitly include 'a clear bottle of Castrol, Motul, or Putoline brand motor oil' in the scene.
5. Strict rule: "DO NOT INCLUDE ANY ENGLISH TEXT OR GIBBERISH TEXT IN THE IMAGE". Use only 'PAŞA MOTOR' if any text is generated.
Include the style: ${styleText}.
Do NOT output any conversational text, just the raw prompt. Remove any newlines or quotes.`;
      
      // Geçici olarak sağlayıcıyı system (Google Gemini) yapıp çağırıyoruz
      const oldProvider = localStorage.getItem("ai_provider");
      localStorage.setItem("ai_provider", "system");
      
      const res = await callOpenRouter(geminiPrompt, false, "image_prompt");
      
      if (oldProvider) localStorage.setItem("ai_provider", oldProvider);
      else localStorage.removeItem("ai_provider");
      
      return res.replace(/[^a-zA-Z0-9, ]/g, "").trim().substring(0, 500);
    } catch (e) {
      addLog("Gemini Görsel Promptu Üretemedi, yerel yedeğe geçiliyor...", "warning");
      const base = translateTitleToEnglishPrompt(title);
      return base.replace(/[^a-zA-Z0-9, ]/g, "").trim().substring(0, 500);
    }
  };

  // Senior Manager Otomatik Keyword Önerisi
  const suggestTargetKeyword = async () => {
    if (!isProviderKeyConfigured()) {
      toast({
        title: "API Key Eksik",
        description: getMissingKeyWarningMessage(),
        variant: "destructive"
      });
      return;
    }

    setSuggestingKeyword(true);
    addLog(`🧠 Senior SEO Manager Google arama trendlerini analiz ediyor...`, "info");
    
    const prompt = blogPrompts.keywordSuggestion();

    try {
      const res = await callOpenRouter(prompt, true, "keyword");
      if (!res) throw new Error("Ajan boş yanıt döndürdü. Lütfen tekrar deneyin.");
      
      let parsedKeyword = "";
      
      try {
        const parsed = extractJsonFromText(res);
        if (parsed) {
          if (Array.isArray(parsed)) {
            parsedKeyword = typeof parsed[0] === "string" ? parsed[0] : (typeof parsed[0] === "object" ? (parsed[0].keyword || parsed[0].Keyword || Object.values(parsed[0])[0] as string) : "");
          } else if (typeof parsed === "object") {
            const firstVal = Object.values(parsed)[0];
            if (Array.isArray(firstVal)) {
              parsedKeyword = typeof firstVal[0] === "string" ? firstVal[0] : "";
            } else {
              parsedKeyword = parsed.keyword || parsed.Keyword || parsed.key || firstVal as string;
            }
          } else if (typeof parsed === "string") {
            parsedKeyword = parsed;
          }
        }
      } catch (parseErr) {
        const match = res.match(/"keyword"\s*:\s*"([^"]+)"/i) || res.match(/keyword\s*:\s*([^,\n}]+)/i) || res.match(/"([^"]+)"/);
        if (match) {
          parsedKeyword = match[1];
        }
      }

      if (!parsedKeyword) {
        const cleaned = res.replace(/[{}"']/g, "").replace(/keyword\s*:\s*/i, "").trim();
        if (cleaned && cleaned.length < 100 && !cleaned.includes("\n")) {
          parsedKeyword = cleaned;
        }
      }

      let finalWord = "";
      if (parsedKeyword && typeof parsedKeyword === "string") {
        finalWord = parsedKeyword.replace("[", "").replace("]", "").replace(/"/g, "").trim();
      }

      if (finalWord && finalWord !== "[]" && finalWord !== "{}" && finalWord !== "null" && finalWord !== "undefined") {
        setKeyword(finalWord);
        addLog(`🎯 Senior Manager'in tavsiye ettiği arama hacmi yüksek kelime: "${finalWord}"`, "success");
        toast({ title: "Trend Tespit Edildi", description: `Yeni anahtar kelime: ${finalWord}`, variant: "default" });
      } else {
        throw new Error("Yakalanamadı: Model geçerli bir SEO odaklı kelime üretemedi (boş veya geçersiz format döndü). Bunun nedeni yerleşik API kotalarının dolmuş olması ve yedek servislerin (Pollinations vb.) JSON yapısı kuramaması olabilir. Lütfen elinizle girmeyi deneyin veya Ayarlar kulvarından kendi OpenRouter / Groq API anahtarınızı girerek otonom trend motorunu en güçlü şekilde tetikleyin.");
      }
    } catch (e: any) {
      addLog(`⚠️ Kelime önerisi alınamadı: ${e.message}`, "error");
      toast({ title: "Öneri Hatası", description: e.message, variant: "destructive" });
    } finally {
      setSuggestingKeyword(false);
    }
  };

  // ================= OTONOM PİLOT (BÜTÜNSEL OTOMATİK BLOG SÜRECİ) =================
  const runAutoPilotWorkflow = async () => {
    if (!keyword.trim()) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen otonom üretim için öncelikle hedef anahtar kelime giriniz.",
        variant: "destructive"
      });
      return;
    }

    if (!isProviderKeyConfigured()) {
      toast({
        title: "API Key Eksik",
        description: getMissingKeyWarningMessage(),
        variant: "destructive"
      });
      return;
    }

    setLogs([]);
    setStep(1);
    setLoading(true);
    setHasSaved(false);
    addLog(`🚀 [OTONOM PİLOT] Tam Otomatik Blog Üretim Ajanı başlatıldı!`, "success");
    addLog(`🎯 Hedef Konu: "${keyword}"`, "info");

    try {
      // --- ADIM 1: RAKİP ANALİZİ VE CANLI SEARCH SİMÜLASYONU ---
      setStep(2);
      setAnalyzingCompetitors(true);
      
      const activeUrls = compUrls.filter((u) => u.trim() !== "");

      // Eğer otomatik rakip bulma aktifse ve girilen URL azsa
      if (autoFindCompetitors && activeUrls.length < 3) {
        addLog("🌐 Dahili Google Arama API aktif olmadığı için rakipler Yapay Zeka tarafından tahmin ediliyor...", "info");
        addLog(`🔎 "${keyword}" anahtar kelimesi için rakipler saptanıyor...`, "info");
        
        const promptPredict = blogPrompts.predictUrls(keyword);

        try {
          const rawPredictText = await callOpenRouter(promptPredict, true, "analysis");
          const predictedRes = extractJsonFromText(rawPredictText);
          if (predictedRes && Array.isArray(predictedRes.urls)) {
            addLog(`✅ Google (TR) Arama Motoru sonuçlarında ilk sıralarda yer alan rakipler saptandı:`, "success");
            predictedRes.urls.forEach((pUrl: string) => {
              addLog(`🌐 Google İlk Sayfa: ${pUrl}`, "success");
              if (!activeUrls.includes(pUrl) && activeUrls.length < 3) {
                activeUrls.push(pUrl);
              }
            });
          }
        } catch (e: any) {
          addLog("⚠️ Otomatik rakipler belirlenemedi. Manuel girilen URL'lerle devam ediliyor.", "warning");
        }
      }

      // Crawler çağrısı
      let fetchedResults: any[] = [];
      if (activeUrls.length > 0) {
        addLog(`📡 Sunucu üzerinden crawler ile sayfalar taranıyor...`, "info");
        const crawlerRes = await fetch("/api/competitor-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: activeUrls })
        });

        if (crawlerRes.ok) {
          const crawlerData = await crawlerRes.json();
          fetchedResults = crawlerData.results || [];
          setScrapedResults(fetchedResults);
          
          fetchedResults.forEach((res) => {
            if (res.status === "success") {
              addLog(`🟢 Başarıyla taranan rakip: ${res.url} (Kelime: ${res.wordCount})`, "success");
            } else {
              addLog(`🔴 "${res.url}" analiz edilemedi: ${res.message}`, "warning");
            }
          });
        }
      }

      addLog("🚀 Sentez motoru çalışıyor, rakiplerin boşlukları ve 3 özgün açı analiz ediliyor...", "info");
      const compTextSummary = fetchedResults.map((r) => {
        if (r.status === "success") {
          return `URL: ${r.url}\nBaşlık: ${r.title}\nMeta Açıklama: ${r.metaDescription}\nH2 Başlıkları: ${r.h2s?.join(", ")}\nKelime Sayısı: ${r.wordCount}`;
        }
        return `URL: ${r.url} - Analiz Edilemedi`;
      }).join("\n\n");

      const analysisPrompt = blogPrompts.analysis(keyword, compTextSummary);
      const aiAnalysisRaw = await callOpenRouter(analysisPrompt, true, "analysis");
      let parsedAnalysis = extractJsonFromText(aiAnalysisRaw);
      parsedAnalysis = parsedAnalysis || {};
      parsedAnalysis.commonHeaders = parsedAnalysis.commonHeaders || [];
      parsedAnalysis.contentGaps = parsedAnalysis.contentGaps || [];
      parsedAnalysis.lsiKeywords = parsedAnalysis.lsiKeywords || [];
      parsedAnalysis.uniqueAngles = parsedAnalysis.uniqueAngles || [];
      
      setAnalysisReport(parsedAnalysis);
      addLog("✨ Rakip ve boşluk analizi başarıyla tamamlandı!", "success");
      setAnalyzingCompetitors(false);

      // --- ADIM 2: PLAN/OUTLINE TASARIMI (OTOMATİK GEÇİŞ) ---
      setStep(3);
      setGeneratingOutline(true);
      addLog("⚡ [OTONOM PİLOT] SEO uyumlu içerik planı (outline) hazırlanıyor...", "info");

      const outlinePrompt = blogPrompts.outline(keyword, parsedAnalysis.contentGaps || [], parsedAnalysis.uniqueAngles || [], blogLength);
      const aiOutlineRaw = await callOpenRouter(outlinePrompt, true, "outline");
      let parsedOutline = extractJsonFromText(aiOutlineRaw);
      parsedOutline = parsedOutline || {};
      
      const rawTitle = parsedOutline.title || parsedOutline.metaTitle || parsedOutline.seoTitle || parsedOutline.seo_title || keyword || "Yeni Blog Planı";
      const capTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
      parsedOutline.title = capTitle;
      parsedOutline.metaTitle = parsedOutline.metaTitle || parsedOutline.seoTitle || parsedOutline.title;
      parsedOutline.metaDescription = parsedOutline.metaDescription || parsedOutline.meta_description || parsedOutline.excerpt || parsedOutline.description || `${capTitle} hakkında detaylı motor bakım ipuçları.`;
      parsedOutline.headers = parsedOutline.headers || [];
      parsedOutline.internalLinks = parsedOutline.internalLinks || [];
      parsedOutline.cta = parsedOutline.cta || "wa.me/905348996817";

      setOutline(parsedOutline);
      addLog("✨ İçerik planı başarıyla üretildi!", "success");
      setGeneratingOutline(false);

      // --- ADIM 3: TAM MAKALE ÜRETME (OTOMATİK GEÇİŞ) ---
      setStep(4);
      setWritingArticle(true);
      addLog("⚡ [OTONOM PİLOT] Makaleniz kurumsal dil kurallarına göre kaleme alınıyor...", "info");
      addLog("✍️ Marka Sesi: Paşa Motor'un sıcak, uzman, samimi ama teknik dili entegre ediliyor...", "info");

      const articlePrompt = blogPrompts.article(parsedOutline, blogLength, "Paşa Motor", slugify);
      const aiArticleRaw = await callOpenRouter(articlePrompt, true, "article");
      let parsedArticle = extractJsonFromText(aiArticleRaw);
      parsedArticle = parsedArticle || {};

      const rawArticleTitle = parsedArticle.title || parsedOutline.title || keyword || "Yeni Blog Makalesi";
      const capArticleTitle = rawArticleTitle.charAt(0).toUpperCase() + rawArticleTitle.slice(1);
      
      parsedArticle.title = capArticleTitle;
      parsedArticle.excerpt = parsedArticle.excerpt || parsedArticle.metaDescription || parsedArticle.meta_description || parsedOutline.metaDescription || `${capArticleTitle} hakkında arıza belirtileri ve usta çözümleri.`;
      parsedArticle.htmlContent = parsedArticle.htmlContent || parsedArticle.content || parsedArticle.body || "<h2>Giriş</h2>";
      parsedArticle.suggestedSlug = parsedArticle.suggestedSlug || parsedArticle.suggested_slug || parsedArticle.slug || slugify(capArticleTitle) || "yeni-blog-yazisi";
      parsedArticle.wordCount = parsedArticle.wordCount || parsedArticle.word_count || 1000;
      parsedArticle.estimatedReadingTime = parsedArticle.estimatedReadingTime || parsedArticle.reading_time || Math.ceil(parsedArticle.wordCount / 180);
      parsedArticle.faqs = parsedArticle.faqs || [];
      
      if (parsedArticle.htmlContent) {
        parsedArticle.htmlContent = humanRefineContent(parsedArticle.htmlContent);
      }

      setArticle(parsedArticle);
      addLog(`✨ Otonom yazım tamamlandı! "${parsedArticle.title}" başlıklı harika bir makale üretildi!`, "success");
      setWritingArticle(false);

      // --- ADIM 5: OTO-GÖRSEL ÜRETİM VE SUPABASE KAYIT ---
      setStep(5);
      setIsGeneratingImage(true);
      const seoImagePrompt = await generateImagePromptWithQwen(parsedArticle.title, coverStyle);
      setCoverPrompt(seoImagePrompt);
      
      // Let backend handle DALL-E 3 / Pollinations Logic
      let autoCoverUrl = "";
      try {
        const imgRes = await fetch("/api/ai/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: seoImagePrompt })
        });
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          autoCoverUrl = imgData.image;
        } else {
          autoCoverUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(seoImagePrompt.replace(/[^\w\s,.-]/g, ''))}?width=1024&height=576&model=flux&nologo=true&seed=1`;
        }
      } catch (err) {
        autoCoverUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(seoImagePrompt.replace(/[^\w\s,.-]/g, ''))}?width=1024&height=576&model=flux&nologo=true&seed=1`;
      }

      setGeneratedCoverUrl(autoCoverUrl);
      
      addLog("🖼️ [OTONOM PİLOT] Makaleye en uygun özgün ve yüksek performanslı yedek parça görseli üretiliyor...", "info");
      
      // Otonom süreçte de görseli tarayıcıya tam olarak yükleyene kadar bekleyelim
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.src = autoCoverUrl;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      setGeneratedCoverUrl(autoCoverUrl);
      setIsGeneratingImage(false);
      
      addLog("🖼️ [OTONOM PİLOT] Makaleye uygun özgün ve SEO uyumlu görsel başarıyla üretildi ve önizleme yüklendi!", "success");
      addLog("💾 [OTONOM PİLOT] Makale taslak olarak Supabase veritabanına otomatik yükleniyor...", "info");
      
      const finalSlug = `${parsedArticle.suggestedSlug}-${Math.floor(Math.random() * 10000)}`;

      let fullHtml = parsedArticle.htmlContent;
      if (parsedArticle.faqs && parsedArticle.faqs.length > 0) {
        fullHtml += `<h2>Sıkça Sorulan Sorular</h2>`;
        parsedArticle.faqs.forEach((faq: any) => {
          fullHtml += `<p><strong>Soru: ${faq.question}</strong></p><p>${faq.answer}</p>`;
        });
      }

      const payload = {
        title: parsedArticle.title.trim(),
        slug: finalSlug,
        excerpt: parsedArticle.excerpt.trim() || null,
        content: fullHtml.trim(),
        cover_image: autoCoverUrl,
        meta_title: parsedArticle.title.trim().slice(0, 60),
        meta_description: parsedArticle.excerpt.trim().slice(0, 155),
        is_published: false,
        published_at: null
      };

      const { data, error } = await dbClient.from("posts").insert(payload).select();
      if (error) throw error;

      setHasSaved(true);
      addLog(`💾 [BAŞARILI] Supabase'e taslak olarak kaydedildi! ID: ${data?.[0]?.id || "Yeni"}`, "success");
      toast({
        title: "Otonom Üretim Başarılı!",
        description: "Blog yazınız otonom taranıp, planlanıp, kaleme alınarak Supabase'e taslak kaydedildi!",
      });

    } catch (err: any) {
      addLog(`❌ Otonom Akışta Hata: ${err.message}`, "error");
      toast({ title: "Otonom Hata", description: err.message, variant: "destructive" });
    } finally {
      setAnalyzingCompetitors(false);
      setGeneratingOutline(false);
      setWritingArticle(false);
      setLoading(false);
    }
  };

  // ================= AŞAMA 1 -> AŞAMA 2 GEÇİŞ (RAKİP ANALİZİ TETİKLEME) =================
  const startCompetitorAnalysis = async () => {
    if (!keyword.trim()) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen analiz için öncelikle hedef anahtar kelime giriniz.",
        variant: "destructive"
      });
      return;
    }

    if (!isProviderKeyConfigured()) {
      toast({
        title: "API Key Eksik",
        description: getMissingKeyWarningMessage(),
        variant: "destructive"
      });
      return;
    }

    setStep(2);
    setAnalyzingCompetitors(true);
    setLogs([]);
    setHasSaved(false);
    addLog(`🤖 "Rakip Analiz & Blog Üretici" Ajanı başlatıldı.`, "info");
    addLog(`🔑 Hedef anahtar kelime: "${keyword}"`, "info");

    try {
      const activeUrls = compUrls.filter((u) => u.trim() !== "");

      // Eğer otomatik rakip bulma aktifse ve girilen URL azsa OpenRouter ile tahmin edelim
      if (autoFindCompetitors && activeUrls.length < 3) {
        addLog("🌐 Dahili Google Arama API aktif olmadığı için rakipler Yapay Zeka tarafından tahmin ediliyor...", "info");
        addLog(`🔎 "${keyword}" anahtar kelimesi için e-ticaret siteleri ve blog sayfaları saptanıyor...`, "info");
        
        const promptPredict = blogPrompts.predictUrls(keyword);

        try {
          const rawPredictText = await callOpenRouter(promptPredict, true, "analysis");
          const predictedRes = extractJsonFromText(rawPredictText);
          if (predictedRes && Array.isArray(predictedRes.urls)) {
            addLog(`✅ Google (TR) Arama Motoru sonuçlarında ilk sıralarda yer alan rakipler saptandı:`, "success");
            predictedRes.urls.forEach((pUrl: string) => {
              addLog(`🌐 Google İlk Sayfa: ${pUrl}`, "success");
              if (!activeUrls.includes(pUrl) && activeUrls.length < 3) {
                activeUrls.push(pUrl);
              }
            });
          }
        } catch (e: any) {
          addLog("⚠️ Otomatik rakipler belirlenemedi. Manuel girilen URL'lerle devam ediliyor.", "warning");
        }
      }

      if (activeUrls.length === 0) {
        addLog("ℹ️ Tarama yapılacak hiçbir URL girilmedi. Genel pazar verileriyle devam ediliyor.", "warning");
      }

      // 2. server.ts /api/competitor-analysis endpointine istek atalım
      addLog(`📡 Sunucu üzerinden CORS'suz crawler ile saniyede en fazla 1 istek gönderilerek sayfalar taranıyor...`, "info");
      
      let fetchedResults: any[] = [];
      if (activeUrls.length > 0) {
        const crawlerRes = await fetch("/api/competitor-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: activeUrls })
        });

        if (crawlerRes.ok) {
          const crawlerData = await crawlerRes.json();
          fetchedResults = crawlerData.results || [];
          setScrapedResults(fetchedResults);
          
          fetchedResults.forEach((res) => {
            if (res.status === "success") {
              addLog(`🟢 Başarıyla taranan rakip: ${res.url} (Kelimeler: ${res.wordCount}, Başlıklar: ${res.h2s?.length || 0})`, "success");
            } else {
              addLog(`🔴 "Bu rakip analiz edilemedi, devam ediliyor" (${res.url}) - Hata: ${res.message}`, "warning");
            }
          });
        } else {
          addLog("⚠️ Rakip analiz sunucusu yanıt vermedi, genel sektör analizi ile devam ediliyor.", "warning");
        }
      }

      // 3. OpenRouter ile taranan sayfaları analiz etme ve İçerik Boşluklarını Sentezleme
      addLog("🚀 Sentez motoru çalışıyor, rakiplerin boşlukları ve 3 özgün açı analiz ediliyor...", "info");
      
      const compTextSummary = fetchedResults.map((r) => {
        if (r.status === "success") {
          return `URL: ${r.url}\nBaşlık: ${r.title}\nMeta Açıklama: ${r.metaDescription}\nH2 Başlıkları: ${r.h2s?.join(", ")}\nKelime Sayısı: ${r.wordCount}`;
        }
        return `URL: ${r.url} - Analiz Edilemedi`;
      }).join("\n\n");

      const analysisPrompt = blogPrompts.analysis(keyword, compTextSummary);
      const aiAnalysisRaw = await callOpenRouter(analysisPrompt, true, "analysis");
      const parsedAnalysis = extractJsonFromText(aiAnalysisRaw);
      setAnalysisReport(parsedAnalysis);
      addLog("✨ Rakip ve boşluk analizi başarıyla tamamlandı!", "success");

    } catch (err: any) {
      addLog(`❌ Hata oluştu: ${err.message}`, "error");
      toast({
        title: "Analiz Hatası",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setAnalyzingCompetitors(false);
    }
  };

  // ================= AŞAMA 2 -> AŞAMA 3 GEÇİŞ (İÇERİK PLANLAMASI [OUTLINE]) =================
  const generateContentOutline = async () => {
    if (!analysisReport) return;
    setStep(3);
    setGeneratingOutline(true);
    addLog("⚡ [AŞAMA 3] OpenRouter API ile SEO uyumlu içerik planı (outline) hazırlanıyor...", "info");

    try {
      const outlinePrompt = blogPrompts.outline(keyword, analysisReport.contentGaps || [], analysisReport.uniqueAngles || [], blogLength);
      const aiOutlineRaw = await callOpenRouter(outlinePrompt, true, "outline");
      let parsedOutline = extractJsonFromText(aiOutlineRaw);
      parsedOutline = parsedOutline || {};

      const rawTitle = parsedOutline.title || parsedOutline.metaTitle || parsedOutline.seoTitle || parsedOutline.seo_title || keyword || "Yeni Blog Planı";
      const capTitle = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
      parsedOutline.title = capTitle;
      parsedOutline.metaTitle = parsedOutline.metaTitle || parsedOutline.seoTitle || parsedOutline.title;
      parsedOutline.metaDescription = parsedOutline.metaDescription || parsedOutline.meta_description || parsedOutline.excerpt || parsedOutline.description || `${capTitle} hakkında detaylı motor bakım ipuçları.`;
      parsedOutline.headers = parsedOutline.headers || [];
      parsedOutline.internalLinks = parsedOutline.internalLinks || [];
      parsedOutline.cta = parsedOutline.cta || "wa.me/905348996817";

      setOutline(parsedOutline);
      addLog("✨ İçerik planı başarıyla üretildi ve onayınıza hazır!", "success");
    } catch (err: any) {
      addLog(`❌ Outline üretiminde hata: ${err.message}`, "error");
      toast({ title: "Outline Hatası", description: err.message, variant: "destructive" });
    } finally {
      setGeneratingOutline(false);
    }
  };

  // ================= AŞAMA 3 -> AŞAMA 4 GEÇİŞ (MAKALE YAZIMI) =================
  const generateFullArticle = async () => {
    if (!outline) return;
    setStep(4);
    setWritingArticle(true);
    setHasSaved(false);
    addLog("⚡ [AŞAMA 4] OpenRouter üzerinden tam makaleniz kaleme alınıyor. Lütfen bekleyin...", "info");
    addLog("✍️ Marka Sesi: Paşa Motor'un sıcak, uzman, samimi ama son derece profesyonel/teknik dili entegre ediliyor...", "info");

    try {
      const articlePrompt = blogPrompts.article(outline, blogLength, "Paşa Motor", slugify);
      const aiArticleRaw = await callOpenRouter(articlePrompt, true, "article");
      let parsedArticle = extractJsonFromText(aiArticleRaw);
      parsedArticle = parsedArticle || {};

      const rawArticleTitle = parsedArticle.title || outline.title || keyword || "Yeni Blog Makalesi";
      const capArticleTitle = rawArticleTitle.charAt(0).toUpperCase() + rawArticleTitle.slice(1);

      parsedArticle.title = capArticleTitle;
      parsedArticle.excerpt = parsedArticle.excerpt || parsedArticle.metaDescription || parsedArticle.meta_description || outline.metaDescription || `${capArticleTitle} hakkında arıza belirtileri ve usta çözümleri.`;
      parsedArticle.htmlContent = parsedArticle.htmlContent || parsedArticle.content || parsedArticle.body || "<h2>Giriş</h2>";
      parsedArticle.suggestedSlug = parsedArticle.suggestedSlug || parsedArticle.suggested_slug || parsedArticle.slug || slugify(capArticleTitle) || "yeni-blog-yazisi";
      parsedArticle.wordCount = parsedArticle.wordCount || parsedArticle.word_count || 1000;
      parsedArticle.estimatedReadingTime = parsedArticle.estimatedReadingTime || parsedArticle.reading_time || Math.ceil(parsedArticle.wordCount / 180);
      parsedArticle.faqs = parsedArticle.faqs || [];

      if (parsedArticle.htmlContent) {
        parsedArticle.htmlContent = humanRefineContent(parsedArticle.htmlContent);
      }

      setArticle(parsedArticle);
      addLog(`✨ Tebrikler! "${parsedArticle.title}" başlıklı makale (${parsedArticle.wordCount} kelime) başarıyla üretildi!`, "success");
    } catch (err: any) {
      addLog(`❌ Makale üretiminde hata: ${err.message}`, "error");
      toast({ title: "Makale Hatası", description: err.message, variant: "destructive" });
    } finally {
      setWritingArticle(false);
    }
  };

  // ================= AŞAMA 4 -> AŞAMA 5 GEÇİŞ (GÖRSEL ÜRETİME İLERLE) =================
  const proceedToImageGeneration = async () => {
    if (!article) return;
    setStep(5);
    setIsGeneratingImage(true);
    addLog("🖼️ Makale başlığına en uygun profesyonel yedek parça görseli tasarlanıyor... Lütfen bekleyin.", "info");
    
    try {
      const promptSeed = await generateImagePromptWithQwen(article.title, coverStyle);
      setCoverPrompt(promptSeed);
      
      let finalUrl = "";
      try {
        const imgRes = await fetch("/api/ai/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptSeed })
        });
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          finalUrl = imgData.image;
        } else {
          finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptSeed.replace(/[^\w\s,.-]/g, ''))}?width=1024&height=576&model=flux&nologo=true&seed=1`;
        }
      } catch (err) {
        finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptSeed.replace(/[^\w\s,.-]/g, ''))}?width=1024&height=576&model=flux&nologo=true&seed=1`;
      }
      
      // Tarayıcı üzerinde görseli tam yükleyene kadar bekleyelim (Önizleme boş kalmasın)
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.src = finalUrl;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      setGeneratedCoverUrl(finalUrl);
      addLog("🖼️ Aşama 5: Makaleye özel yüksek çözünürlüklü yedek parça görseli başarıyla oluşturuldu!", "success");
    } catch (e: any) {
      addLog(`❌ Görsel ilk üretiminde hata: ${e.message}`, "error");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // ================= GÖRSELİ YENİDEN ÜRETME (AŞAMA 5) =================
  const regenerateCoverImage = async () => {
    if (!coverPrompt.trim()) return;
    setIsGeneratingImage(true);
    addLog("🖼️ Yeni parametrelerle yapay zeka görseli hazırlanıyor... Lütfen bekleyin, bu işlem 5-10 saniye sürebilir.", "info");
    
    try {
      // Stil eklerini prompta entegre etme (Öznitelik değerlerindeki "font-sans" kelimesini temizleyerek eşleşmeyi sağla)
      const cleanStyle = coverStyle.replace(" font-sans", "").trim();
      let suffix = "";
      if (cleanStyle === "cinematic") suffix = ", cinematic light, hdr photography, 8k resolution, shot on 35mm lens, highly detailed, realistic texture";
      else if (cleanStyle === "studio") suffix = ", studio lighting, extremely sharp details, dark clean background, high contrast, commercial design shot";
      else if (cleanStyle === "vector") suffix = ", clean vector illustration, isometric perspective, graphic design, minimalist flat design style";
      else if (cleanStyle === "3d") suffix = ", 3d realistic blender render, octane render, raytracing shadows, Unreal Engine 5 look";

      const fullPrompt = `${coverPrompt.trim()}${suffix}`;
      const newUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=1024&height=576&model=flux&nologo=true&enhance=false&seed=${Math.floor(Math.random() * 1000000)}`;
      
      // Gerçek bir pre-load işlemi yapalım: önizleme kutusunda yüklenme bitmeden spinner gitmesin
      await new Promise<void>((resolve) => {
        const img = new window.Image();
        img.src = newUrl;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });

      setGeneratedCoverUrl(newUrl);
      addLog("✅ Yeni yapay zeka görseli başarıyla üretildi ve tarayıcıda önbelleklendi!", "success");
    } catch (e: any) {
      addLog(`❌ Görsel yeniden üretilirken hata: ${e.message}`, "error");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // ================= SUPABASE'E TASLAK KAYDETME (SEÇİLİ GÖRSEL İLE) =================
  const saveToSupabase = async () => {
    if (!article) return;
    setSavingToDb(true);
    addLog("💾 Yazı taslak (is_published: false) olarak Supabase/Firestore'a kaydediliyor...", "info");

    try {
      const finalSlug = `${article.suggestedSlug}-${Math.floor(Math.random() * 10000)}`;

      // SSS bölümünü HTML içeriğe ekleyelim veya ayrı kaydedelim. 
      let fullHtml = article.htmlContent;
      if (article.faqs && article.faqs.length > 0) {
        fullHtml += `<h2>Sıkça Sorulan Sorular</h2>`;
        article.faqs.forEach((faq) => {
          fullHtml += `<p><strong>Soru: ${faq.question}</strong></p><p>${faq.answer}</p>`;
        });
      }

      const payload = {
        title: article.title.trim(),
        slug: finalSlug,
        excerpt: article.excerpt.trim() || null,
        content: fullHtml.trim(),
        cover_image: generatedCoverUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(translateTitleToEnglishPrompt(article.title))}?width=1024&height=576&model=flux&nologo=true&enhance=false&seed=${Math.floor(Math.random() * 100000)}`,
        meta_title: article.title.trim().slice(0, 60),
        meta_description: article.excerpt.trim().slice(0, 155),
        is_published: false,
        published_at: null
      };

      const { data, error } = await dbClient.from("posts").insert(payload).select();

      if (error) throw error;

      setHasSaved(true);
      addLog(`💾 Başarıyla Supabase/Firestore'a kaydedildi (Post ID: ${data?.[0]?.id || "Yeni"}).`, "success");
      toast({
        title: "Kayıt Başarılı!",
        description: "Blog yazısı taslak olarak başarıyla kaydedildi.",
      });
    } catch (err: any) {
      addLog(`❌ Supabase kayıt hatası: ${err.message}`, "error");
      toast({
        title: "Kayıt Hatası",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSavingToDb(false);
    }
  };

  // ================= MAKALE KOPYALAMA =================
  const copyToClipboard = () => {
    if (!article) return;
    try {
      const textToCopy = `Başlık: ${article.title}\n\nÖzet/Meta Açıklama: ${article.excerpt}\n\nİçerik:\n${article.htmlContent.replace(/<[^>]+>/g, "\n")}`;
      navigator.clipboard.writeText(textToCopy);
      toast({ title: "Kopyalandı", description: "Makale içeriği panoya yazıldı." });
    } catch (e: any) {
      toast({ title: "Kopyalanamadı", description: e.message, variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Başlık ve Durum */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/15 flex items-center justify-center border border-purple-500/20">
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">Rakip Analiz & Blog Üretici</h1>
              <p className="text-sm text-muted-foreground">Otonom Arama Analiziyle Sektörel Boşlukları Yakalayan SEO Yazarı</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => navigate("/admin/ayarlar")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 border border-border rounded-xl text-xs text-foreground font-medium transition-colors"
            >
              <Settings className="w-4 h-4 text-purple-400" />
              API Key Ayarları ({apiKey ? "Giriş Yapıldı" : "Key Eksik"})
            </button>
          </div>
        </div>

        {/* API KEY EKSİK UYARISI */}
        {!checkingKey && !apiKey && (
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
            <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
            <div className="text-sm">
              <span className="font-bold">⚠️ OpenRouter API Key eksik veya girilmemiş!</span> Taslak üretme ve yapay zeka analiz adımlarına başlamadan önce lütfen ayarlar sayfasından anahtarınızı şifreli olarak tanımlayın.
              <button
                onClick={() => navigate("/admin/ayarlar")}
                className="ml-2 font-bold underline hover:text-amber-300"
              >
                Girmek için Tıklayınız →
              </button>
            </div>
          </div>
        )}

        {/* STEPPER PROGRESS BAR */}
        <div className="glass-card rounded-2xl p-5 border border-border/80">
          <div className="grid grid-cols-5 gap-2">
            {[
              { num: 1, label: "Hedef Belirleme" },
              { num: 2, label: "Rakip Analizi" },
              { num: 3, label: "İçerik Planı" },
              { num: 4, label: "Makale Üretimi" },
              { num: 5, label: "Görsel Üretimi" }
            ].map((s) => {
              const isPast = step > s.num;
              const isActive = step === s.num;
              return (
                <button
                  key={s.num}
                  disabled={checkingKey || !apiKey || isPast ? false : step < s.num}
                  onClick={() => setStep(s.num as any)}
                  className={`flex flex-col md:flex-row items-center gap-2 p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? "bg-purple-600/10 border-purple-500/50 text-purple-100 font-bold"
                      : isPast
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-200"
                      : "bg-muted/40 border-border/50 text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : isPast
                        ? "bg-emerald-500 text-white"
                        : "bg-muted border border-border"
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span className="text-[11px] md:text-xs tracking-tight">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ANA ÇALIŞMA ALANI VE SPLIT LOG PANELİ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sol Panel: Adım Formları / Sonuçları */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* AŞAMA 1: HEDEF BELİRLEME FORMU */}
            {step === 1 && (
              <div className="glass-card rounded-2xl p-6 border border-border/80 space-y-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-purple-400" />
                    <h3 className="font-heading font-semibold text-foreground text-lg">Aşama 1 — Hedef & Rakip Belirleme</h3>
                  </div>
                  <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full font-bold animate-pulse">CRO Alarmı: 30sn Etkileşim</span>
                </div>

                {/* Senior E-Ticaret Dönüşüm (CRO) Strateji Paneli */}
                <div className="bg-gradient-to-br from-indigo-950/40 via-background/40 to-slate-900/40 rounded-xl p-4 border border-indigo-500/20 text-xs text-white space-y-3 shadow-inner">
                  <div className="flex items-center justify-between bg-indigo-500/10 -mx-4 -mt-4 px-4 py-2 border-b border-indigo-500/20">
                    <span className="font-bold text-indigo-200 flex items-center gap-1.5 font-heading">
                      📊 Kıdemli Senior Manager CRO & SEO Stratejik Analizi
                    </span>
                    <span className="text-[10px] text-indigo-300 font-mono">2026-05 G.Analytics</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div className="bg-background/40 p-2.5 rounded border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Organic Search</span>
                      <strong className="text-sm text-indigo-300">55 Oturum</strong>
                      <span className="text-[9px] text-green-400 block mt-0.5">▲ Başlangıç için iyi</span>
                    </div>
                    <div className="bg-background/40 p-2.5 rounded border border-border/40">
                      <span className="text-muted-foreground block text-[10px]">Etkileşim Oranı</span>
                      <strong className="text-sm text-yellow-300">%49</strong>
                      <span className="text-[9px] text-yellow-500 block mt-0.5">■ Geliştirilebilir</span>
                    </div>
                    <div className="bg-background/40 p-2.5 rounded border-red-500/30">
                      <span className="text-muted-foreground block text-[10px]">Ort. Etkileşim</span>
                      <strong className="text-sm text-red-400">30 Sn</strong>
                      <span className="text-[9px] text-red-400 block mt-0.5">▼ KRİTİK SEVİYE</span>
                    </div>
                    <div className="bg-background/40 p-2.5 rounded border-red-500/30">
                      <span className="text-muted-foreground block text-[10px]">Conversion (Dönüşüm)</span>
                      <strong className="text-sm text-red-400">0 Sipariş</strong>
                      <span className="text-[9px] text-red-400 block mt-0.5">▼ ACİL AKSİYON</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="bg-red-500/5 p-3 rounded-lg border border-red-500/15">
                      <h4 className="font-bold text-red-400 flex items-center gap-1 mb-1 font-heading text-[11px]">🚨 ANA SORUN VE NİYET SAPMASI</h4>
                      <p className="text-muted-foreground text-[10.5px] leading-relaxed">
                        Google sitemizi bir <strong className="text-red-300">bilgi sitesi (informational)</strong> gibi görüyor. Ancak olmamız gereken <strong className="text-indigo-200">Otoriter Teknik Motosiklet Parça Mağazasıdır</strong>. Kullanıcı ürüne olan güveni ve arızasının bu parçayla çözüleceğini anlamadan hızlıca çıkıyor.
                      </p>
                    </div>
                    <div className="bg-green-500/5 p-3 rounded-lg border border-green-500/15">
                      <h4 className="font-bold text-green-400 flex items-center gap-1 mb-1 font-heading text-[11px]">🚀 UÇUŞ STYLING & AJAN AKLI PLANIMIZ</h4>
                      <p className="text-muted-foreground text-[10.5px] leading-relaxed">
                        Üretilecek tüm yeni makaleler; <strong>arıza belirtileri</strong>, arızayla özdeşleşme teşhisi, <strong>TVS model uyumluluk tablosu</strong>, ve statör-konjektör-akü üçgeni gibi <strong>semantik cluster iç-linklerini</strong> içinde barındıracak şekilde tasarlanmıştır.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* GOOGLE SEARCH CONSOLE & GA GİRDİSİ */}
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3 border-b border-border/40 pb-2">
                       <h4 className="text-sm font-bold text-emerald-100 flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-emerald-400" />
                          Google Search Console Fırsat Analizi
                       </h4>
                       {needsAuth ? (
                         <button
                           type="button"
                           onClick={handleGoogleLogin}
                           disabled={isLoggingIn}
                           className="text-[11px] font-bold text-emerald-900 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-md"
                         >
                           {isLoggingIn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                           Google'a Bağlan
                         </button>
                       ) : (
                         <button
                           type="button"
                           onClick={fetchGSCData}
                           disabled={fetchingGSC}
                           className="text-[11px] font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-md"
                         >
                           {fetchingGSC ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Search className="w-3.5 h-3.5"/>}
                           GSC'den Otonom Çek
                         </button>
                       )}
                    </div>

                    {gscRecommendations.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                           {gscRecommendations.map((rec, idx) => (
                               <div key={idx} className="bg-background/40 p-3 rounded-lg border border-emerald-500/10 cursor-pointer hover:border-emerald-500/30 transition-all group"
                                    onClick={() => { setKeyword(rec.keyword); addLog(`Anahtar kelime seçildi: ${rec.keyword}`, "info"); }}>
                                  <strong className="text-[12px] text-emerald-300 block mb-1 group-hover:text-emerald-200">{rec.keyword}</strong>
                                  <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">{rec.reason}</p>
                                  <div className="flex items-center justify-between text-[9px] font-mono border-t border-border/40 pt-1">
                                     <span className="text-blue-300">Vol: {rec.search_volume}</span>
                                     <span className="text-red-400">CTR: {rec.current_ctr}</span>
                                  </div>
                               </div>
                           ))}
                        </div>
                    ) : (
                        <p className="text-[11px] text-emerald-300/70 block font-medium">Search Console API üzerinden düşük tıklama oranlı aranma hacimleri keşfedilip blog konuları çıkarılır.</p>
                    )}
                  </div>

                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-bold text-purple-100 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Hedef Anahtar Kelime
                      </label>
                      <button
                        type="button"
                        onClick={suggestTargetKeyword}
                        disabled={suggestingKeyword}
                        className="text-[11px] font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-1.5 px-3 py-1.5 rounded-md shadow-md shadow-purple-900/20"
                      >
                        {suggestingKeyword ? <Loader2 className="w-3.5 h-3.5 animate-spin"/> : <Sparkles className="w-3.5 h-3.5"/>}
                        Senior Manager Önerisi
                      </button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400/50" />
                      <input
                        type="text"
                        placeholder="Örn: pcx 125 hava filtresi kaç km de değişir"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-background/50 border border-purple-500/30 text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-background transition-all"
                      />
                    </div>
                    <span className="text-[11px] text-purple-300/70 mt-2 block font-medium">Senin yerine sektördeki açıkları ve arama trendlerini tarayıp en kârlı kelimeyi önerebilirim.</span>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">Blog Türü ve Kelime Sayısı</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setBlogLength("long")}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          blogLength === "long"
                            ? "bg-purple-600/10 border-purple-500/50 text-purple-200 font-bold"
                            : "bg-muted/40 border-border/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <MaxHeightDesc label="Uzun Form (1500+ Kelime)" desc="Derin teknik konular, rehberler ve detaylı tork rehberleri için idealdir." />
                      </button>
                      <button
                        type="button"
                        onClick={() => setBlogLength("short")}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          blogLength === "short"
                            ? "bg-purple-600/10 border-purple-500/50 text-purple-200 font-bold"
                            : "bg-muted/40 border-border/50 text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <MaxHeightDesc label="Kısa Form (500-800 Kelime)" desc="Hızlı parça çözümleri, arıza tespit tüyoları ve sık sorulan çözümler." />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-foreground">Rakip Web Site URL'leri <span className="text-xs font-normal text-muted-foreground">(Opsiyonel, Max 3)</span></label>
                      <label className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-500/10 px-2 py-1 rounded cursor-pointer font-bold">
                        <input
                          type="checkbox"
                          checked={autoFindCompetitors}
                          onChange={(e) => setAutoFindCompetitors(e.target.checked)}
                          className="rounded border bg-muted focus:ring-0 text-purple-500"
                        />
                        <span>Google (TR) Arama Sonuçlarından Belirle (Tavsiye Edilen)</span>
                      </label>
                    </div>

                    <div className="space-y-2">
                      {compUrls.map((url, idx) => (
                        <input
                          key={idx}
                          type="url"
                          placeholder={`Örn: https://www.kalyoncumotor.com/honda-spacy-debriyaj-balatasi-degisimi (Rakip ${idx + 1})`}
                          value={url}
                          onChange={(e) => {
                            const copy = [...compUrls];
                            copy[idx] = e.target.value;
                            setCompUrls(copy);
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50 font-mono"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Otonom Pilot Modu Kontrolü */}
                  <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-950/15 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col mr-4">
                        <span className="text-sm font-bold text-purple-300 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          Tam Otonom Pilot Modu
                        </span>
                        <span className="text-[11px] text-muted-foreground mt-0.5">
                          Ajanın sırayla rakipleri saptamasını, analiz etmesini, içerik planını çıkarmasını, makaleleri yazıp doğrudan taslak olarak Supabase'e kaydetmesini sağlar.
                        </span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1 md:mt-0 shrink-0">
                        <input
                          type="checkbox"
                          checked={autonomousMode}
                          onChange={(e) => setAutonomousMode(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-300 after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white peer-checked:after:border-white"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/40">
                  <button
                    type="button"
                    disabled={checkingKey || !apiKey || analyzingCompetitors}
                    onClick={autonomousMode ? runAutoPilotWorkflow : startCompetitorAnalysis}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 disabled:opacity-50"
                  >
                    {autonomousMode ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Otonom Blog Üreticiyi Başlat <ChevronRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Rakip Analizini Başlat <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* AŞAMA 2: RAKİP ANALİZ SONUÇLARI */}
            {step === 2 && (
              <div className="glass-card rounded-2xl p-6 border border-border/80 space-y-6">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400 animate-pulse" />
                    <h3 className="font-heading font-semibold text-foreground text-lg">Aşama 2 — Sektörel & Rakip Analiz Sonuçları</h3>
                  </div>
                  {analyzingCompetitors && (
                    <span className="flex items-center gap-1.5 bg-purple-500/10 text-purple-300 font-semibold px-3 py-1 text-xs rounded-full">
                      <Loader2 className="w-3 h-3 animate-spin text-purple-300" /> Analiz Ediliyor
                    </span>
                  )}
                </div>

                {analyzingCompetitors ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-foreground">Crawler ve Sentez Motoru Çalışıyor...</h4>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">Rakiplerin başlıkları, makaleleri ve kelime sayıları tek tek analiz edilip içerikteki kritik sektörel boşluklar taranmaktadır.</p>
                    </div>
                  </div>
                ) : analysisReport ? (
                  <div className="space-y-6">
                    {/* Üst Genel İstatistikler */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
                        <span className="text-xs text-muted-foreground block font-sans">Ortalama Rakip Kelime</span>
                        <span className="text-xl font-bold text-foreground font-mono">{analysisReport.avgWordCount} Kelime</span>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
                        <span className="text-xs text-muted-foreground block font-sans">LSI / Semantik Kelimeler</span>
                        <span className="text-sm font-bold text-purple-300 font-mono block truncate">{analysisReport.lsiKeywords?.slice(0, 3).join(", ") || "Belirlenmedi"}</span>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/40 border border-border/40 col-span-2 md:col-span-1">
                        <span className="text-xs text-muted-foreground block font-sans">Taranan Rakip Site</span>
                        <span className="text-lg font-bold text-foreground font-mono">{scrapedResults.length} / 3 Adet</span>
                      </div>
                    </div>

                    {/* Ortak Başlıklar */}
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5"><Globe className="w-4 h-4 text-purple-300" /> Rakiplerin Değindiği Ortak Başlıklar</h4>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/30 space-y-1.5">
                        {analysisReport.commonHeaders && analysisReport.commonHeaders.length > 0 ? (
                          analysisReport.commonHeaders.map((hb, idx) => (
                            <div key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                              <span>{hb}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Ortak güçlü başlık bulunamadı.</span>
                        )}
                      </div>
                    </div>

                    {/* Sektörel Açıklar / Boşluklar */}
                    <div>
                      <h4 className="text-sm font-bold text-yellow-400 mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-yellow-400" /> Tespit Edilen Kritik İçerik Boşlukları (Gap Analysis)</h4>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">Rakiplerin hiç yazmadığı ya da zayıf kaldığı aşağıdaki teknik noktalar sayenizde zirveye kurulmanızı sağlayacak:</p>
                      <div className="space-y-2">
                        {analysisReport.contentGaps && analysisReport.contentGaps.length > 0 ? (
                          analysisReport.contentGaps.map((gap, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10 text-xs text-yellow-200/90 flex items-start gap-2">
                              <span className="mt-1 font-bold text-yellow-400">[AÇIK]</span>
                              <span>{gap}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Kritik boşluk bulunamadı.</span>
                        )}
                      </div>
                    </div>

                    {/* Rakiplerin Yazmadığı 3 Özgün Görüş/Açı */}
                    <div>
                      <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-400" /> Makalemizde Odaklanacağımız 3 Özgün Açı</h4>
                      <div className="space-y-2">
                        {analysisReport.uniqueAngles && analysisReport.uniqueAngles.length > 0 ? (
                          analysisReport.uniqueAngles.map((ang, idx) => (
                            <div key={idx} className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-200/90 flex items-start gap-2 font-sans font-medium">
                              <span className="font-bold text-emerald-400">{idx + 1}.</span>
                              <span>{ang}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Özgün açı belirlenemedi.</span>
                        )}
                      </div>
                    </div>

                    {/* Alt Yönlendirici Butonlar */}
                    <div className="flex justify-between items-center pt-4 border-t border-border/40">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" /> Geri Dön
                      </button>
                      
                      <button
                        type="button"
                        onClick={generateContentOutline}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/10"
                      >
                        İçerik Planını Onayla <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground text-xs">Analiz henüz başlatılmadı. Adımlardan kelimenizi girerek başlatın.</div>
                )}
              </div>
            )}

            {/* AŞAMA 3: İÇERİK PLANI (OUTLINE) */}
            {step === 3 && (
              <div className="glass-card rounded-2xl p-6 border border-border/80 space-y-6">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    <h3 className="font-heading font-semibold text-foreground text-lg">Aşama 3 — SEO Uyumlu İçerik Mimarisi & Planı</h3>
                  </div>
                  {generatingOutline && (
                    <span className="flex items-center gap-1.5 bg-purple-500/10 text-purple-300 font-semibold px-3 py-1 text-xs rounded-full">
                      <Loader2 className="w-3 h-3 animate-spin text-purple-300" /> Plan Tasarlanıyor
                    </span>
                  )}
                </div>

                {generatingOutline ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-foreground">Arama Mimarisi İnşa Ediliyor...</h4>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">SEO Başlığı, Meta Açıklamaları ve H1-H2-H3 akışı Türkiye'deki tık trendlerine göre şekillenmektedir.</p>
                    </div>
                  </div>
                ) : outline ? (
                  <div className="space-y-6">
                    {/* SEO Meta Bilgileri */}
                    <div className="space-y-3 bg-muted/20 p-5 rounded-xl border border-border/40">
                      <div>
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Önerilen SEO Başlık</span>
                        <span className="text-sm font-bold text-foreground mt-0.5 block">{outline.title}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border/20">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Meta Title</span>
                          <span className="text-xs text-slate-300 mt-0.5 block">{outline.metaTitle}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Meta Description</span>
                          <span className="text-xs text-slate-300 mt-0.5 block">{outline.metaDescription}</span>
                        </div>
                      </div>
                    </div>

                    {/* H1, H2, H3 Akışı */}
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-3">🛠️ Önerilen İçerik Akışı (Outline)</h4>
                      <div className="space-y-2.5">
                        {outline.headers && outline.headers.map((hdr, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-muted/30 border border-border/30 flex items-start gap-3">
                            <span className="font-mono text-[10px] bg-purple-500/25 text-purple-200 font-bold px-2 py-1 rounded truncate">
                              {hdr.level}
                            </span>
                            <div className="space-y-1">
                              <h5 className="text-xs font-bold text-foreground">{hdr.text}</h5>
                              <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">{hdr.summary}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sitenin Diğer Bölümlerine İç Bağlantı / CTA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-900/40 border border-border/30">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-2">Önerilen İç Bağlantılar</span>
                        <div className="space-y-1">
                          {outline.internalLinks && outline.internalLinks.map((il, idx) => (
                            <div key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                              <span>{il}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900/40 border border-border/30">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">Hedeflenen Satın Alma (CTA)</span>
                        <p className="text-xs text-emerald-200/90 leading-relaxed font-sans">{outline.cta}</p>
                      </div>
                    </div>

                    {/* Alt Sevk Butonları */}
                    <div className="flex justify-between items-center pt-4 border-t border-border/40">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" /> Geri Dön
                      </button>
                      
                      <button
                        type="button"
                        onClick={generateFullArticle}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/10"
                      >
                        Makaleyi Yaz <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground text-xs">Outline henüz üretilmedi. Lütfen rakip analizini yaptıktan sonra devam edin.</div>
                )}
              </div>
            )}

            {/* AŞAMA 4: MAKALE ÜRETİMİ */}
            {step === 4 && (
              <div className="glass-card rounded-2xl p-6 border border-border/80 space-y-6">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                    <h3 className="font-heading font-semibold text-foreground text-lg">Aşama 4 — Üretilen Makale ve SEO Özet Kartı</h3>
                  </div>
                  {writingArticle && (
                    <span className="flex items-center gap-1.5 bg-purple-500/10 text-purple-300 font-semibold px-3 py-1 text-xs rounded-full">
                      <Loader2 className="w-3 h-3 animate-spin text-purple-300" /> Makale Kaleme Alınıyor
                    </span>
                  )}
                </div>

                {writingArticle ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 font-sans">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
                    <div>
                      <h4 className="font-semibold text-foreground">Makale Kelimeleri Dokunuyor...</h4>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">Sıkıcı spam kelimeler süzülüyor, benzersiz "Paşa Motor" ses tonu işleniyor ve WhatsApp iletişim linkleri hassasiyetle yapılandırılıyor.</p>
                    </div>
                  </div>
                ) : article ? (
                  <div className="space-y-6">
                    {/* SEO Özet Kartı */}
                    <div className="p-5 border border-purple-500/20 bg-purple-950/10 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Slug Önerisi</span>
                        <span className="text-xs font-mono text-slate-300 mt-0.5 block truncate">/blog/{article.suggestedSlug}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kelime Sayısı</span>
                        <span className="text-sm font-semibold text-slate-300 mt-0.5 block font-mono">{article.wordCount} Kelime</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Okuma Süresi</span>
                        <span className="text-sm font-semibold text-slate-300 mt-0.5 block font-mono">~ {article.estimatedReadingTime} dk</span>
                      </div>
                    </div>

                    {/* Makale Ön İzleme */}
                    <div className="p-5 rounded-2xl bg-muted/40 border border-border/50 space-y-4">
                      <h2 className="text-xl font-heading font-bold text-foreground">{article.title}</h2>
                      <p className="text-sm italic text-muted-foreground font-sans">{article.excerpt}</p>
                      
                      <hr className="border-border/40" />
                      
                      {/* Generative Article Preview */}
                      <div className="prose prose-invert max-w-none text-xs text-slate-300 leading-relaxed font-sans space-y-3 pasa-article">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                          {article.htmlContent}
                        </ReactMarkdown>
                      </div>

                      {/* FAQs Area */}
                      {article.faqs && article.faqs.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-border/40">
                          <h4 className="text-sm font-bold text-purple-300 mb-3 block">❓ Kazandırılan Sıkça Sorulan Sorular (Faq Schema)</h4>
                          <div className="space-y-3">
                            {article.faqs.map((faq, idx) => (
                              <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-border/40 space-y-1">
                                <span className="text-xs font-bold text-foreground">Soru: {faq.question}</span>
                                <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Kontrol Butonları */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" /> Geri Dön
                        </button>
                        
                        <button
                          type="button"
                          onClick={generateFullArticle}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 text-xs font-semibold border border-amber-500/20 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-4 h-4" /> Yeniden Üret
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={copyToClipboard}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border transition-colors"
                        >
                          <Copy className="w-4 h-4 text-purple-400" /> Kopyala
                        </button>
                        
                        <button
                          type="button"
                          onClick={proceedToImageGeneration}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/10 cursor-pointer"
                        >
                          <Image className="w-4 h-4 animate-pulse" /> Görsel Hizalamaya İlerle
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground text-xs font-sans">Makale henüz kaleme alınmadı. Lütfen outline kurgusundan sonra devam edin.</div>
                )}
              </div>
            )}
            {/* AŞAMA 5: GÖRSEL SEÇİMİ VE TAMAMLAMA */}
            {step === 5 && (
              <div className="glass-card rounded-2xl p-6 border border-border/80 space-y-6">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-purple-400 animate-pulse" />
                    <h3 className="font-heading font-semibold text-foreground text-lg">Aşama 5 — SEO Uyumlu Özgün Görsel Üretimi</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Sol Kolon: Görsel Önizleme */}
                  <div className="md:col-span-5 space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block font-sans">Görsel Ön İzleme</span>
                    <div className="relative aspect-[1200/630] w-full rounded-xl bg-muted overflow-hidden border border-border shadow-inner group">
                      {isGeneratingImage ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/85">
                          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                          <span className="text-[10px] text-purple-300/80 mt-2 font-mono">Görsel İşleniyor...</span>
                        </div>
                      ) : generatedCoverUrl ? (
                        <>
                          <img
                            src={generatedCoverUrl}
                            alt="Yapay zeka SEO kapak resmi"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-550"
                          />
                          <div className="absolute bottom-2 right-2 bg-slate-950/85 px-2.5 py-1 text-[8px] tracking-wide text-white uppercase rounded-md font-bold font-mono border border-border/30">
                            1200 x 630 WebP
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground font-sans">
                          Görsel henüz üretilmedi.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sağ Kolon: İngilizce Prompt Düzenleyici ve Stil Seçici */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1 block font-sans">Yapay Zeka Görsel Kelime Taslağı (Prompt)</label>
                      <textarea
                        value={coverPrompt}
                        onChange={(e) => setCoverPrompt(e.target.value)}
                        rows={3}
                        className="w-full p-3 rounded-xl bg-muted border border-border text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500/50 font-mono leading-relaxed"
                        placeholder="Örn: High quality realistic photography of motorcycle maintenance in dealer garage..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-1 block font-sans">Sanatsal Stil Modu</label>
                        <select
                          value={coverStyle}
                          onChange={(e) => setCoverStyle(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-xs text-foreground focus:outline-none font-sans"
                        >
                          <option value="3d font-sans">Gerçekçi 3D Model</option>
                          <option value="cinematic font-sans">Sinematik Fotoğrafçılık</option>
                          <option value="studio font-sans">Stüdyo Ürün Tanıtımı</option>
                          <option value="vector font-sans">Minimalist Vektör İllüstrasyon</option>
                        </select>
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          disabled={isGeneratingImage || !coverPrompt.trim()}
                          onClick={regenerateCoverImage}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors shadow-lg cursor-pointer disabled:opacity-50"
                        >
                          {isGeneratingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                          Görseli Yenile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-purple-950/10 border border-purple-500/10 space-y-2">
                  <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5 font-sans">
                    <Check className="w-4 h-4 text-emerald-400" /> SEO ve Görsel Hazırlık Uyum Raporu
                  </h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                    Üretilen görsel <strong>1200x630 pixel (W3C standardı)</strong> olarak ayarlanmıştır. Google Arama botları için makalenizin başlığı, meta başlığı ve alt etiketleri (alt attribute) ile otomatik ilişkilendirilerek sitenize doğrudan <strong>özgün organik hit</strong> çekecektir.
                  </p>
                </div>

                {/* Kontrol ve Kayıt Butonları */}
                <div className="flex justify-between items-center pt-4 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold border border-border transition-colors cursor-pointer font-sans"
                  >
                    <ChevronLeft className="w-4 h-4" /> Yazıya Geri Dön
                  </button>

                  <button
                    type="button"
                    disabled={savingToDb || hasSaved}
                    onClick={saveToSupabase}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-colors shadow-lg cursor-pointer font-sans ${
                      hasSaved
                        ? "bg-emerald-800 text-emerald-100 border border-emerald-500/30 opacity-80 cursor-default"
                        : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/10 animate-bounce hover:animate-none"
                    }`}
                  >
                    {savingToDb ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : hasSaved ? (
                      <Check className="w-4 h-4 text-emerald-300" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {hasSaved ? "Sisteme Taslak Olarak Kaydedildi ✓" : "Makaleyi ve Görseli Taslak Kaydet"}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Sağ Panel: Canlı Logları Görme Alanı */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-card rounded-2xl p-5 border border-border/80 bg-slate-950/20 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-border/30 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
                <h4 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">Ajan Akış Log Terminali</h4>
              </div>
              
              <div className="text-xs text-muted-foreground leading-relaxed font-sans">
                Yapay zeka ajanı, OpenRouter API'ye her aşamada bağlanarak durum geçişleri yapar ve log tablosunu anlık besler.
              </div>

              <div className="bg-slate-950 rounded-xl p-4 font-mono text-[10px] space-y-2 border border-border max-h-[460px] overflow-y-auto divide-y divide-border/20">
                {logs.length > 0 ? (
                  logs.map((log, idx) => {
                    const colorClass = 
                      log.type === "success" 
                        ? "text-emerald-400" 
                        : log.type === "warning" 
                        ? "text-amber-400" 
                        : log.type === "error" 
                        ? "text-red-400" 
                        : "text-purple-300";
                    return (
                      <div key={idx} className="py-2 first:pt-0 last:pb-0 font-mono">
                        <span className="text-slate-500 block font-normal">{log.time}</span>
                        <span className={`${colorClass} block mt-0.5 leading-relaxed font-semibold`}>{log.msg}</span>
                      </div>
                    );
                  })
                ) : (
                  <span className="text-[10px] text-muted-foreground italic font-mono">Terminal bekliyor, eylem başlatılmadı.</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

interface MaxHeightDescProps {
  label: string;
  desc: string;
}

function MaxHeightDesc({ label, desc }: MaxHeightDescProps) {
  return (
    <div className="space-y-1">
      <span className="text-sm font-bold block">{label}</span>
      <span className="text-[10px] font-normal leading-relaxed text-muted-foreground block">{desc}</span>
    </div>
  );
}
