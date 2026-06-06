import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
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
  Image
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
  useEffect(() => {
    // Tercih edilen servis sağlayıcısı kontrolü
    const provider = localStorage.getItem("ai_provider") || "system";
    localStorage.setItem("ai_provider", provider);

    // Varsayılan together api key'ini otomatik kaydet
    const savedTg = localStorage.getItem("tg_api_key");
    if (!savedTg) {
      localStorage.setItem("tg_api_key", btoa(encodeURIComponent(import.meta.env.VITE_DEFAULT_TG_KEY || "")));
    }

    // Varsayılan Groq api key'ini otomatik kaydet
    const savedGroq = localStorage.getItem("groq_api_key");
    if (!savedGroq) {
      localStorage.setItem("groq_api_key", btoa(encodeURIComponent(import.meta.env.VITE_DEFAULT_GROQ_KEY || "")));
    }

    const savedOr = localStorage.getItem("or_api_key");

    if (provider === "system") {
      setApiKey("system_key");
    } else if (provider === "together") {
      const currentTgKey = localStorage.getItem("tg_api_key") || "";
      setApiKey(currentTgKey ? decryptKey(currentTgKey) : (import.meta.env.VITE_DEFAULT_TG_KEY || ""));
    } else if (provider === "groq") {
      const currentGroqKey = localStorage.getItem("groq_api_key") || "";
      setApiKey(currentGroqKey ? decryptKey(currentGroqKey) : (import.meta.env.VITE_DEFAULT_GROQ_KEY || ""));
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

  // OpenRouter & Together AI & Yerleşik Sunucu Destekli Servis Çağrıcısı (Hata Toleranslı Çoklu Hat Entegrasyonu)
  const callOpenRouter = async (promptText: string, isJson: boolean = false) => {
    const provider = localStorage.getItem("ai_provider") || "system";

    // 1. SISTEM (GOOGLE GEMINI & POLLINATIONS) HATTI COZUCUSU
    const trySystem = async (): Promise<string> => {
      addLog(`🤖 Yerleşik Sistem Yapay Zekası sorgulanıyor (Google Gemini & Sınırsız Yedek)...`, "info");
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: `SİSTEM TALİMATI: ${systemInstruction}\n\nKULLANICI TALEBİ: ${promptText}`,
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

    // 2. TOGETHER AI HATTI COZUCUSU
    const tryTogether = async (): Promise<string> => {
      const savedKeyEncrypted = localStorage.getItem("tg_api_key");
      let realKey = "";
      if (savedKeyEncrypted) {
        realKey = decryptKey(savedKeyEncrypted).trim();
      }

      if (!realKey || realKey.startsWith("sk-or-v1")) {
        realKey = import.meta.env.VITE_DEFAULT_TG_KEY || "";
      }

      const togetherModels = [
        "meta-llama/Llama-3.3-70B-Instruct-Turbo",
        "Qwen/Qwen2.5-72B-Instruct-Turbo",
        "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        "deepseek-ai/DeepSeek-V3"
      ];

      let togetherError: Error | null = null;

      for (const currentModel of togetherModels) {
        const body: any = {
          model: currentModel,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: promptText }
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

        addLog(`🤖 Together AI sorgulanıyor: "${currentModel}"...`, "info");

        while (attempt < MAX_RETRIES) {
          try {
            const response = await fetch("https://api.together.xyz/v1/chat/completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${realKey}`
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
            togetherError = err;
            if (attempt < MAX_RETRIES) {
              const waitTime = attempt * 1200;
              addLog(`⚠️ Together AI "${currentModel}" geçici hatası: ${err.message}. ${waitTime/1000}s sonra tekrar deneniyor...`, "warning");
              await new Promise(res => setTimeout(res, waitTime));
            } else {
              addLog(`❌ Together AI "${currentModel}" başarısız oldu. Sonraki Together AI modeline geçiliyor...`, "warning");
            }
          }
        }

        if (success) {
          return modelResult;
        }
      }

      throw togetherError || new Error("Together AI üzerinden sonuç alınamadı.");
    };

    // 3. OPENROUTER HATTI COZUCUSU
    const tryOpenRouter = async (): Promise<string> => {
      const savedKeyEncrypted = localStorage.getItem("or_api_key");
      if (!savedKeyEncrypted) {
        throw new Error("⚠️ OpenRouter API Key eksik!");
      }
      const realKey = decryptKey(savedKeyEncrypted);

      const modelsToTry = [
        "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
        "deepseek/deepseek-r1:free",
        "mistralai/mistral-small-24b-instruct-2501:free",
        "google/gemini-2.0-flash-lite-preview-02-05:free",
        "nvidia/llama-3.1-nemotron-70b-instruct:free"
      ];

      let orError: Error | null = null;

      for (const currentModel of modelsToTry) {
        const body: any = {
          model: currentModel,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: promptText }
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
    const tryGroq = async (): Promise<string> => {
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
              { role: "user", content: promptText }
            ]
          };
          // JSON modu sadece uyumlu modeller veya genel fallback için
          if (isJson && groqModel !== "openai/gpt-oss-20b") {
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
      
      const qwenModel = selectedModel.includes("Qwen") ? selectedModel.split(" ")[0] : "qwen-turbo";
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

    // ÇOKLU HAT FALLBACK KADEMELİ ÇAĞRI MANTIĞI
    const callProvidersInOrder = async (providersOrder: string[]) => {
      let finalError: Error | null = null;
      for (const currentProvider of providersOrder) {
        try {
          if (currentProvider === "system") return await trySystem();
          if (currentProvider === "together") return await tryTogether();
          if (currentProvider === "openrouter") return await tryOpenRouter();
          if (currentProvider === "groq") return await tryGroq();
          if (currentProvider === "gemini") return await tryGemini();
          if (currentProvider === "huggingface") return await tryHuggingFace();
          if (currentProvider === "qwen") return await tryQwen();
        } catch (err: any) {
          addLog(`⚠️ ${currentProvider} başarısız oldu: ${err.message}. Diğer sağlayıcıya geçiliyor...`, "warning");
          finalError = err;
        }
      }
      throw new Error(`Kademeli yapay zeka havuzundaki tüm sağlayıcılar denendi fakat yanıt alınamadı. Son hata: ${finalError?.message || "Bilinmiyor"}`);
    };

    const fbSystem = ["system", "qwen", "together", "openrouter", "groq", "gemini", "huggingface"];
    const fallbackMap: Record<string, string[]> = {
      system: ["system", "qwen", "together", "openrouter", "groq", "gemini", "huggingface"],
      together: ["together", "qwen", "system", "openrouter", "groq", "gemini", "huggingface"],
      openrouter: ["openrouter", "together", "qwen", "system", "groq", "gemini", "huggingface"],
      groq: ["groq", "qwen", "system", "together", "openrouter", "gemini", "huggingface"],
      gemini: ["gemini", "qwen", "system", "groq", "together", "openrouter", "huggingface"],
      huggingface: ["huggingface", "qwen", "system", "groq", "together", "openrouter", "gemini"],
      qwen: ["qwen", "system", "groq", "together", "openrouter", "gemini", "huggingface"]
    };

    return await callProvidersInOrder(fallbackMap[provider] || fbSystem);
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
      
      const qwenPrompt = `I need an image generation prompt for a blog post titled "${title}". 
The prompt MUST BE IN ENGLISH ONLY, separated by commas, and strictly describe a visual scene. Include the style: ${styleText}.
Do NOT output any conversational text, just the raw prompt. Remove any newlines or quotes.`;
      
      // Geçici olarak sağlayıcıyı Qwen yapıp çağırıyoruz
      const oldProvider = localStorage.getItem("ai_provider");
      localStorage.setItem("ai_provider", "qwen");
      
      const res = await callOpenRouter(qwenPrompt);
      
      if (oldProvider) localStorage.setItem("ai_provider", oldProvider);
      else localStorage.removeItem("ai_provider");
      
      return res.replace(/[^a-zA-Z0-9, ]/g, "").trim().substring(0, 500);
    } catch (e) {
      addLog("Qwen Görsel Promptu Üretemedi, yerel yedeğe geçiliyor...", "warning");
      const base = translateTitleToEnglishPrompt(title);
      return base.replace(/[^a-zA-Z0-9, ]/g, "").trim().substring(0, 500);
    }
  };

  // Senior Manager Otomatik Keyword Önerisi
  const suggestTargetKeyword = async () => {
    const savedKey = localStorage.getItem("or_api_key");
    if (!savedKey) {
      toast({
        title: "API Key Eksik",
        description: "Lütfen Admin Settings sayfasından önce OpenRouter API Key giriniz.",
        variant: "destructive"
      });
      return;
    }

    setSuggestingKeyword(true);
    addLog(`🧠 Senior SEO Manager Google arama trendlerini analiz ediyor...`, "info");
    
    const prompt = blogPrompts.keywordSuggestion();

    try {
      const res = await callOpenRouter(prompt, true);
      if (!res) throw new Error("Ajan boş yanıt döndürdü. Lütfen tekrar deneyin.");
      
      const parsed = extractJsonFromText(res);
      if (parsed && parsed.keyword) {
        setKeyword(parsed.keyword);
        addLog(`🎯 Senior Manager'in tavsiye ettiği arama hacmi yüksek kelime: "${parsed.keyword}"`, "success");
        toast({ title: "Trend Tespit Edildi", description: `Yeni anahtar kelime: ${parsed.keyword}`, variant: "default" });
      } else {
        throw new Error("Beklenen formatta kelime bulunamadı.");
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

    const savedKey = localStorage.getItem("or_api_key");
    if (!savedKey) {
      toast({
        title: "API Key Eksik",
        description: "Lütfen Admin Settings sayfasından önce OpenRouter API Key giriniz.",
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
          const rawPredictText = await callOpenRouter(promptPredict, true);
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
      const aiAnalysisRaw = await callOpenRouter(analysisPrompt, true);
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
      const aiOutlineRaw = await callOpenRouter(outlinePrompt, true);
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
      const aiArticleRaw = await callOpenRouter(articlePrompt, true);
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
      const autoCoverUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(seoImagePrompt)}?width=1024&height=576&model=flux&nologo=true&enhance=false&seed=${Math.floor(Math.random() * 100000)}`;
      
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

    const savedKey = localStorage.getItem("or_api_key");
    if (!savedKey) {
      toast({
        title: "API Key Eksik",
        description: "Lütfen Admin Settings sayfasından önce OpenRouter API Key giriniz.",
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
          const rawPredictText = await callOpenRouter(promptPredict, true);
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
      const aiAnalysisRaw = await callOpenRouter(analysisPrompt, true);
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
      const aiOutlineRaw = await callOpenRouter(outlinePrompt, true);
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
      const aiArticleRaw = await callOpenRouter(articlePrompt, true);
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
      
      const finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptSeed)}?width=1024&height=576&model=flux&nologo=true&enhance=false&seed=${Math.floor(Math.random() * 100000)}`;
      
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
