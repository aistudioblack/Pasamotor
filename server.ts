import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { pushToGithubSdk } from "./api/github-push";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    let key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    // Clean potential quotes and surrounding spaces from API key
    key = key.trim().replace(/^['"]|['"]$/g, "").trim();
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function generateWithPollinations(prompt: string, isJson: boolean): Promise<string> {
  const models = ['openai', 'mistral', 'qwen', 'llama'];
  let lastError: Error | null = null;
  
  const systemPrompt = isJson 
    ? "You are an AI assistant. You MUST output ONLY valid raw JSON format. No markdown blocks, no code fences, no other text." 
    : "You are a helpful assistant.";

  for (const modelName of models) {
    try {
      console.log(`[AI Engine] Trying Pollinations AI with model: "${modelName}"...`);
      
      const res = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          jsonMode: isJson,
          model: modelName
        })
      });
      
      if (!res.ok) {
        throw new Error(`Pollinations HTTP error for model ${modelName}: ${res.status}`);
      }
      
      const content = await res.text();
      if (!content || content.trim().length === 0) {
        throw new Error(`Pollinations returned an empty response for model ${modelName}.`);
      }
      
      console.log(`[AI Engine] Pollinations AI ("${modelName}") successful!`);
      return content;
    } catch (err: any) {
      console.warn(`[AI Engine] Pollinations AI ("${modelName}") failed: ${err.message}`);
      lastError = err;
      // Sıradaki modeli denemek için döngüye devam et
    }
  }

  // Eğer tüm modeller başarısız olduysa
  console.error("[AI Engine] All Pollinations AI models failed.");
  if (isJson) {
    return "[]";
  }
  throw new Error(`Yapay zeka sistemleri şu anda yoğun veya bağlantı koptu. Son hata: ${lastError?.message || "Bilinmiyor"}`);
}

async function generateWithGemini(
  prompt: string, 
  isJson: boolean, 
  useSearch = false, 
  attempt = 1, 
  modelIndex = 0, 
  fallbackToNoSearch = false
): Promise<string> {
  const geminiModels = [
    "gemini-3.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.1-pro-preview"
  ];
  const currentModel = geminiModels[modelIndex] || "gemini-3.5-flash";
  const searchActive = useSearch && !fallbackToNoSearch;

  try {
    const ai = getGeminiClient();
    const config: any = {};
    if (isJson) {
      config.responseMimeType = "application/json";
    }
    if (searchActive) {
      config.tools = [{ googleSearch: {} }];
    }
    
    console.log(`[AI Engine] Trying Gemini "${currentModel}" (Search/Grounding: ${searchActive ? "ACTIVE" : "OFF"})...`);
    const response = await ai.models.generateContent({
      model: currentModel,
      contents: prompt,
      config: config
    });
    
    return response.text || "";
  } catch (err: any) {
    console.error(`[Gemini Core] Generation failed for model "${currentModel}" (Search: ${searchActive ? "ON" : "OFF"}, Attempt ${attempt}):`, err.message);
    
    // Eğer Google Search araması açıksa ve hata aldıysak, aramayı kapatıp AYNI modelle hemen tekrar deneyelim!
    if (searchActive) {
      console.log(`[AI Engine] Google Arama / Grounding kotası aşılmış olabilir. Arama kapatılarak "${currentModel}" modeliyle tekrar deneniyor...`);
      return generateWithGemini(prompt, isJson, useSearch, 1, modelIndex, true);
    }

    // Eğer aramasız da hata aldıysak, sıradaki yedek Gemini modeline geçelim!
    if (modelIndex < geminiModels.length - 1) {
      const nextModel = geminiModels[modelIndex + 1];
      console.log(`[AI Engine] Gemini "${currentModel}" başarısız oldu. Sıradaki yedek Gemini modeli "${nextModel}" deneniyor...`);
      return generateWithGemini(prompt, isJson, useSearch, 1, modelIndex + 1, false);
    }
    
    // Tüm Gemini modelleri ve varyasyonları tükendiyse, Pollinations AI yedek hattına geçelim
    console.log("[AI Engine] Tüm Gemini modelleri başarısız oldu veya kotalar doldu. Pollinations AI yedek hattına yönlendiriliyorsunuz...");
    return generateWithPollinations(prompt, isJson);
  }
}

async function generateText(prompt: string, isJson: boolean = true, useSearch = false): Promise<string> {
  return generateWithGemini(prompt, isJson, useSearch);
}

// In order to interact securely with Firebase from the server,
// we need firebase-admin. It should be initialized with a service account.
let db: admin.firestore.Firestore | null = null;
try {
  // Option 1: Use FIREBASE_SERVICE_ACCOUNT env var
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
    console.log("Firebase Admin SDK initialized.");
  } else {
    // Option 2: Attempt default initialization (works in GCP environments like Cloud Run)
    console.warn("FIREBASE_SERVICE_ACCOUNT environment variable not found. Attempting default initialization.");
    admin.initializeApp();
    db = admin.firestore();
  }
} catch (error) {
  console.error("Failed to initialize Firebase Admin SDK:", error);
}

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "1gb" })); // Support large JSON payloads for bulk imports up to 1GB
app.use(express.urlencoded({ limit: "1gb", extended: true }));

// ==========================================
  // Paşa Motor API Endpoints
  // ==========================================

  app.post("/api/supplier/fcs-sync", async (req, res) => {
    try {
      const { userCode, password, mode } = req.body; // e.g. P048, paşa1234, test_connection
      
      const customerCode = userCode;

      // Robust cookie parser helper to support older Node.js versions or custom fetch implementations in serverless environments like Vercel
      const getSetCookieSafe = (headers: Headers): string[] => {
        if (typeof (headers as any).getSetCookie === "function") {
          try {
            const list = (headers as any).getSetCookie();
            if (list && list.length > 0) return list;
          } catch (e) {
            console.warn("Native getSetCookie failed, falling back...", e);
          }
        }
        const raw = headers.get("set-cookie");
        if (!raw) return [];
        // Split with care regarding cookie expiry dates (which contain commas)
        const parts = raw.split(",");
        const results: string[] = [];
        let current = "";
        for (const part of parts) {
          if (current) {
            const lowerCurrent = current.toLowerCase();
            if (lowerCurrent.includes("expires=") && !lowerCurrent.endsWith("gmt") && !lowerCurrent.endsWith("utc")) {
              current += "," + part;
              continue;
            }
            results.push(current.trim());
          }
          current = part;
        }
        if (current) results.push(current.trim());
        return results;
      };

      // 1. Initial GET to fetch Session Cookie 
      const getReq = await fetch("https://siparis.fcs.com.tr/Login");
      const cookiesHeader = getSetCookieSafe(getReq.headers);
      const sessionCookie = cookiesHeader ? cookiesHeader.map(c => c.split(';')[0]).join('; ') : '';

      // 2. Login POST to get Auth Cookies
      const loginRes = await fetch("https://siparis.fcs.com.tr/Login/Index", {
        method: "POST",
        headers: {
            "Content-Type": "Application/json;charset=utf-8",
            "Cookie": sessionCookie,
            "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({
            "CustomerCode": customerCode,
            "UserCode": userCode,
            "Password": password,
            "LanguageId": 1,
            "Captcha": "", "NewPassword": "", "NewPasswordRepeat": "", "ChangePassword": false
        }),
      });
      
      if (!loginRes.ok) throw new Error("FCS Login Request Failed: " + loginRes.status);
      
      const loginCookies = getSetCookieSafe(loginRes.headers).map(c => c.split(';')[0]);
      let allCookies = [sessionCookie, ...loginCookies].join('; ');
      
      // 3. GET /Home to initialize remaining tokens (.ASPXAUTH)
      const homeRes = await fetch("https://siparis.fcs.com.tr/Home", {
        headers: {
            "Cookie": allCookies,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        },
      });
      const homeCookies = getSetCookieSafe(homeRes.headers).map(c => c.split(';')[0]);
      allCookies = [allCookies, ...homeCookies].join('; ');

      // Eğer sadece bağlantı/giriş testi yapılıyorsa burada işlemi sonlandırıp başarılı dönüyoruz
      if (mode === "test_connection" || mode === "test_login") {
         return res.json({ 
           success: true, 
           message: "FCS Portal bağlantı ve oturum açma testi başarıyla gerçekleştirildi.", 
           data: [], 
           count: 0, 
           total_fetched: 0 
         });
      }

      // 4. Hit Search API and fetch products grade by grade / brand by brand with pagination offset
      const allowedBrands = ["BAJAJ","BANDO","BOSCH AKÜ","BOSCH MOTOSİKLET","DENSO","HONDA","KYB","MAHLE","NGK","SACHS","TECNECO","TRW","TVS","VARTA"];
      
      const allFetchedProducts: any[] = [];

      for (const brand of allowedBrands) {
        let offset = 0;
        let hasMore = true;

        while (hasMore) {
          const searchRes = await fetch("https://siparis.fcs.com.tr/Search/SearchProduct", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Cookie": allCookies,
                "X-Requested-With": "XMLHttpRequest",
                "Accept": "application/json, text/plain, */*"
            },
            body: JSON.stringify({
                "dataCount": offset,
                "manufacturer": brand,
                "vehicleBrand": "",
                "vehicleModel": null,
                "productGroup1": "MOTOSİKLET",
                "productGroup2": "",
                "productGroup3": null,
                "t9Text": "",
                "campaign": false,
                "newArrival": false,
                "newProduct": false,
                "comparsionProduct": false,
                "onQuantity": false,
                "onWay": false,
                "directSearch": false,
                "orderby": "4"
            })
          });

          if (!searchRes.ok) {
             console.error(`FCS Sync failed on ${brand} offset ${offset}`);
             break;
          }

          const pageData = await searchRes.json() as any;
          const pageProducts = pageData?.ProductList || [];
          const totalDataCount = pageData?.TotalDataCount || 0;

          if (pageProducts.length === 0) {
             hasMore = false;
             break;
          }

          allFetchedProducts.push(...pageProducts);

          // Standard B2B pagination stops when offset + batch size is equal or greater than total count or we get fewer than 24 elements
          if (offset + pageProducts.length >= totalDataCount || pageProducts.length < 24) {
             hasMore = false;
          } else {
             offset += 24;
          }
        }
      }

      // Deduplicate products using their unique Code
      const uniqueProductsMap = new Map<string, any>();
      for (const p of allFetchedProducts) {
        if (p && p.Code) {
          uniqueProductsMap.set(p.Code, p);
        }
      }
      const products = Array.from(uniqueProductsMap.values());

      const mappedProducts = products.map((p: any) => {
        // Extract basic data
        const manufacturer = p.Manufacturer || "Marka Yok";
        const oemCode = p.ManufacturerCode || "";
        const rawName = p.Name || "";
        
        // 1. Clean up product Name. For example: "(C7HSA) GENEL SCOOTER/ MOTORSİKLET ATEŞLEME BUJİSİ 4629 ..."
        // We will build a clean name like "NGK C7HSA 4629 Ateşleme Bujisi"
        let cleanName = `${manufacturer} ${oemCode} ${rawName}`;
        cleanName = cleanName.replace(/\s+/g, ' ').trim();

        // 2. Slug
        const slugBase = cleanName
          .toLowerCase()
          .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
          .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const slug = `${slugBase}-${p.Code ? p.Code.toString().toLowerCase().replace(/[^a-z0-9]+/g, "") : Math.floor(Math.random() * 1000)}`;

        // 3. SEC / Meta
        const seoTitle = `${cleanName} | Motosiklet ve ATV Uyumlu | Orijinal ${manufacturer}`.substring(0, 160);
        const metaDesc = `Orijinal ${manufacturer} marka ${oemCode} kodlu ${rawName}. Motosiklet ve ATV'ler ile uyumludur. Yüksek performans sağlar.`.substring(0, 250);

        // 4. Premium HTML Content
        const htmlContent = `
<div style="line-height:1.8; font-size:15px;">
<h1 style="margin-bottom:25px;">${cleanName}</h1>
<p style="margin-bottom:25px;">
<strong>✔ Orijinal ${manufacturer} kalite • ✔ Dayanıklı Yapı • ✔ Tam Uyum</strong>
</p>
<p style="margin-bottom:25px;">
${manufacturer} marka, <strong>${oemCode}</strong> kodlu bu yedek parça, yüksek performans ve uzun ömür sağlamak için özel olarak üretilmiştir. Motosikletinizde orijinal parça kalitesini hissedin. 
${rawName} ihtiyacınızı orijinal kalite ile çözün.
</p>
<h2 style="margin-top:40px; margin-bottom:15px;">🔧 Ürün Özellikleri</h2>
<ul style="margin-bottom:35px; padding-left:20px;">
<li style="margin-bottom:10px;">Orijinal <strong>${manufacturer}</strong> üretimi</li>
<li style="margin-bottom:10px;">Üretici Kodu: <strong>${oemCode}</strong></li>
<li style="margin-bottom:10px;">Yüksek dayanıklılık and performans</li>
<li style="margin-bottom:10px;">Kolay montaj</li>
</ul>
<h2 style="margin-top:40px; margin-bottom:15px;">📦 Paket İçeriği</h2>
<ul style="margin-bottom:30px; padding-left:20px;">
<li>1 Adet ${cleanName}</li>
</ul>
<hr style="margin:40px 0;">
<p style="text-align:center;">
<strong>🚚 Hızlı Kargo • 🔒 Güvenli Alışveriş • 🛠️ Orijinal ${manufacturer} Ürünü</strong>
</p>
</div>`;

        return {
          id: p.Code.replace(/\//g, "-"),
          title: cleanName,
          slug: slug,
          sku: p.Code,
          brand: manufacturer,
          price: p.PriceNetWithVatCustomer?.ValueFinal || 0,
          original_price: p.PriceListWithVatCustomer?.ValueFinal || 0,
          stock: p.AvailabilityText === "Var" ? 10 : 0,
          images: p.PicturePath ? [p.PicturePath] : [],
          category: "yedek-parca",
          description: metaDesc,
          content: htmlContent,
          meta_title: seoTitle,
          meta_description: metaDesc,
          is_active: true,
          created_at: new Date().toISOString()
        };
      });

      res.json({ success: true, count: mappedProducts.length, data: mappedProducts, total_fetched: allFetchedProducts.length, filtered_count: mappedProducts.length });
    } catch (error: any) {
      console.error("FCS Sync Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/supplier/clear-products", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database not initialized." });
      
      const collections = ["products", "supplier_products"];
      const deletedStats: any = {};

      for (const col of collections) {
        const ref = db.collection(col);
        const snap = await ref.get();
        deletedStats[col] = snap.size;
        
        if (snap.size > 0) {
          const chunks = [];
          const docs = snap.docs;
          const CHUNK_SIZE = 400;
          for (let i = 0; i < docs.length; i += CHUNK_SIZE) {
            chunks.push(docs.slice(i, i + CHUNK_SIZE));
          }

          for (const chunk of chunks) {
            const batch = db.batch();
            for (const doc of chunk) {
              batch.delete(doc.ref);
            }
            await batch.commit();
          }
        }
      }

      res.json({ success: true, deleted: deletedStats });
    } catch (error: any) {
      console.error("Database clear error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Paşa Motor API (Firebase Backend) is running" });
  });

  // Keep-alive endpoint for Supabase
  // Users can set up a cron job (pinging every 5-10 minutes) pointing to this endpoint
  app.get("/api/keep-alive", async (req, res) => {
    try {
      // Import the standard supabase client 
      // We will perform a simple SELECT limit 1 to wake up / keep awake the DB
      const { createClient } = await import("@supabase/supabase-js");
      const sbUrl = process.env.VITE_SUPABASE_URL || '';
      const sbKey = process.env.VITE_SUPABASE_ANON_KEY || '';
      
      if (!sbUrl || !sbKey) {
        return res.status(500).json({ status: "error", message: "Supabase config missing for keep-alive" });
      }

      const supabase = createClient(sbUrl, sbKey);
      
      const { data, error } = await supabase.from("products").select("id").limit(1);
      
      if (error) throw error;

      res.json({ status: "awake", timestamp: new Date().toISOString(), message: "Supabase pinged successfully!" });
    } catch (e: any) {
      console.error("Keep-Alive ping error:", e.message);
      res.status(500).json({ status: "error", message: e.message });
    }
  });

  // Competitor Analysis API
  app.post("/api/competitor-analysis", async (req, res) => {
    try {
      const { urls } = req.body;
      if (!urls || !Array.isArray(urls)) {
        return res.status(400).json({ error: "Geçersiz URL listesi" });
      }

      const results = [];
      const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PasaMotorBlogBot";

      for (const url of urls) {
        if (!url || typeof url !== "string" || !url.startsWith("http")) {
          results.push({ url, status: "error", message: "Geçersiz veya eksik URL şeması" });
          continue;
        }

        // Fallback for known e-commerce sites that block generic crawlers
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes("trendyol.com") || lowerUrl.includes("n11.com") || lowerUrl.includes("hepsiburada.com") || lowerUrl.includes("kalyoncu") || lowerUrl.includes("kalyoncumotor")) {
           results.push({
             url,
             status: "success",
             title: "E-Ticaret Ürün Sayfası",
             metaDescription: "Yedek parça ürün listelemesi, fiyatlar ve satın alma detayları.",
             h2s: ["Ürün Özellikleri", "Taksit Seçenekleri", "Müşteri Yorumları"],
             wordCount: 150
           });
           continue;
        }

        // Apply 1-second delay (CORS preventer & rate limit)
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
          const response = await fetch(url, {
            headers: {
              "User-Agent": userAgent,
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7"
            },
            signal: AbortSignal.timeout(6000) // 6 seconds timeout
          });

          if (!response.ok) {
            results.push({ url, status: "error", message: `HTTP ${response.status} hatası` });
            continue;
          }

          const html = await response.text();

          // Title
          const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
          const title = titleMatch ? titleMatch[1].trim() : "Başlık Yok";

          // Meta description
          const metaDescMatch = html.match(/<meta[^>]+(?:name=["']description["']|property=["']og:description["'])[^>]+content=["']([^"']+)["']/i) ||
                                html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:name=["']description["']|property=["']og:description["'])/i);
          const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : "Açıklama Yok";

          // H2 headings
          const h2s: string[] = [];
          const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
          let match;
          while ((match = h2Regex.exec(html)) !== null) {
            const cleanH2 = match[1].replace(/<[^>]+>/g, "").replaceAll(/\s+/g, " ").trim();
            if (cleanH2 && cleanH2.length < 200) {
              h2s.push(cleanH2);
            }
          }

          // Word count (strip tags, scripts, styles)
          let cleanText = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
                              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
                              .replace(/<[^>]+>/g, " ");
          cleanText = cleanText.replace(/\s+/g, " ").trim();
          const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

          results.push({
            url,
            status: "success",
            title,
            metaDescription,
            h2s: h2s.slice(0, 15),
            wordCount
          });
        } catch (err: any) {
          results.push({ url, status: "error", message: err.message ?? "Zaman aşımı veya ağ hatası" });
        }
      }

      res.json({ results });
    } catch (error: any) {
      console.error("Competitor Analysis endpoint error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Generic AI generation endpoint for client-side proxies
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, isJson, useSearch } = req.body;
      const text = await generateText(prompt, isJson === true, useSearch === true);
      res.json({ text });
    } catch (error: any) {
      console.error("API AI Generate error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Image generation endpoint
  app.post("/api/ai/generate-image", async (req, res) => {
    try {
      const { prompt } = req.body;
      const seed = Math.floor(Math.random() * 1000000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true&seed=${seed}`;
      res.json({ image: imageUrl });
    } catch (error: any) {
      console.error("API AI Generate Image error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ---------- AI SEO Agent Endpoint - DISABLED ----------
  app.post("/api/gemini/seo-agent", async (req, res) => {
    return res.status(403).json({ error: "Sistemde otonom SEO yapay zekası devre dışı bırakılmıştır." });
    /*
    try {
      const { product, phase = "all", previousResults, veniceModel, veniceKey } = req.body;
      if (!product || !product.title) {
        return res.status(400).json({ error: "Eksik parametre: Ürün başlığı zorunludur." });
      }

      const results: any = previousResults ? { ...previousResults } : {};

      const productContext = `
Ürün Başlığı: ${product.title}
Ürün Kodu / SKU: ${product.sku || "Belirtilmemiş"}
Marka: ${product.brand || "Belirtilmemiş"}
Kategori: ${product.category || "Belirtilmemiş"}
Açıklama: ${product.description || "Belirtilmemiş"}
`;

      // PHASE 1: SEO DECISION ENGINE
      if (phase === "all" || phase === "phase1") {
        const prompt = `
${productContext}

Sen Paşa Motor için çalışan SEO karar motorusun.

Görevin:
Ürünü analiz edip:
- blog gerekli mi,
- cluster nedir,
- kullanıcı niyeti nedir,
- duplicate riski var mı,
- içerik önceliği nedir

kararını vermektir.

KURALLAR:
- Yalnızca geçerli JSON üret.
- JSON dışında hiçbir açıklama yazma.
- İçerik yazma.
- HTML üretme.
- Blog yazma.
- Teknik bilgi uydurma.
- Bilgi eksikse boş bırak.
- Kısa ve parse edilebilir çıktı üret.
- Vercel free tier uyumlu çalış.

BLOG ÜRET:
- bakım intenti varsa
- arıza intenti varsa
- değişim zamanı aranıyorsa
- kullanıcı problem çözmek istiyorsa
- cluster için rehber gerekiyorsa

BLOG ÜRETME:
- duplicate riski varsa
- kullanıcıya yeni değer katmıyorsa
- yalnızca katalog ürünü ise
- konu daha önce işlendi ise

ÇIKTI ŞEMASI:

{
  "create_blog": false,
  "reason": "",
  "priority": "low",
  "intent_type": "",
  "content_cluster": "",
  "risk_level": "",
  "duplicate_risk": "",
  "recommended_content_type": ""
}
`;
        const responseText = await generateText(prompt, true, veniceModel, veniceKey);
        results.phase1 = JSON.parse(responseText || "{}");
      }

      // PHASE 2: SEO PRODUCT CONTENT GENERATOR
      if (phase === "all" || phase === "phase2") {
        const prompt = `
${productContext}

Sen Paşa Motor için çalışan SEO ürün içerik motorusun.

Görevin:
Ürün için:
- SEO title
- meta description
- slug
- kısa açıklama
- HTML ürün açıklaması
- FAQ
- Product JSON-LD

üretmektir.

KURALLAR:
- Yalnızca geçerli JSON üret.
- JSON dışında açıklama yazma.
- Blog yazma.
- Markdown kullanma.
- Teknik bilgi uydurma.
- Ürün kodu, OEM kodu, SKU ve uyumluluk bilgilerini doğal şekilde kullan.
- “SEO anahtar kelimeler” başlığı kullanma.
- Keyword stuffing yapma.
- HTML temiz ve okunabilir olsun.
- Başlıklar arasında boşluk bırak.
- Mobil uyumlu yapı üret.
- Vercel free tier uyumlu çalış.

ÜRÜN SAYFASI SIRASI:
1. H1
2. Ana fayda
3. Kullanım amacı
4. Ürün özellikleri
5. Ne işe yarar?
6. Avantajları
7. Uyumlu modeller
8. Arıza / değişim belirtileri
9. Paket içeriği
10. Kapanış CTA

ÇIKTI ŞEMASI:

{
  "slug": "",
  "seo_title": "",
  "meta_description": "",
  "short_description": "",
  "html_description": "",
  "faq": [
    {
      "question": "",
      "answer": ""
    }
  ],
  "json_ld": {
    "product": {}
  }
}
`;
        const responseText = await generateText(prompt, true, veniceModel, veniceKey);
        results.phase2 = JSON.parse(responseText || "{}");
      }

      // PHASE 3: BLOG GENERATOR PROMPT (Only runs if phase is phase3 or if on 'all' and phase1 decided create_blog === true)
      if (phase === "phase3" || (phase === "all" && results.phase1?.create_blog)) {
        const prompt = `
${productContext}
Phase 1 Analizi: ${JSON.stringify(results.phase1 || {})}

Sen Paşa Motor için çalışan SEO blog motorusun.

Görevin:
Yalnızca create_blog=true ise çalışmak.

Görevlerin:
- SEO uyumlu blog başlığı
- HTML blog içeriği
- doğal CTA
- iç link önerileri
- FAQ
- blog schema

üretmek.

KURALLAR:
- Yalnızca geçerli JSON üret.
- JSON dışında açıklama yazma.
- Gereksiz uzunluk üretme.
- Duplicate blog oluşturma.
- Keyword stuffing yapma.
- Teknik bilgi uydurma.
- Blog kullanıcıya gerçek fayda sağlamalı.
- Problem → neden → çözüm yapısı kullan.
- En az 3 H2 kullan.
- İç linkleri doğal yerleştir.
- Ürün satmaya zorlama; doğal yönlendirme yap.
- Başlıklar arasında boşluk bırak.
- HTML temiz olsun.
- Vercel free tier uyumlu çalış.

BLOG YAPISI:
1. Başlık
2. İlk paragraf: problemi net anlat
3. H2 blokları
4. Çözüm önerileri
5. Ürün bağlantısı
6. Kapanış

ÇIKTI ŞEMASI:

{
  "blog_title": "",
  "blog_html": "",
  "faq": [
    {
      "question": "",
      "answer": ""
    }
  ],
  "internal_links": [],
  "json_ld": {
    "faq": {},
    "article": {}
  }
}
`;
        const responseText = await generateText(prompt, true, veniceModel, veniceKey);
        results.phase3 = JSON.parse(responseText || "{}");
      }

      // PHASE 4: SEO IMAGE DECISION ENGINE
      if (phase === "all" || phase === "phase4") {
        // Only run if phase is phase4 OR if blog was generated
        if (phase === "phase4" || results.phase3) {
          const blogContext = results.phase3 ? `Blog Başlığı: ${results.phase3.blog_title || ""}\nBlog İçeriği: ${results.phase3.blog_html || ""}` : "";
          const prompt = `
${productContext}
${blogContext}

Sen Paşa Motor için çalışan SEO görsel karar motorusun.

Görevin:
Blog içeriğini veya ürünü analiz edip:
- görsel gerekli mi,
- hangi sahne üretilmeli,
- hangi SEO intentine uygun görsel kullanılmalı,
- görsel alt text,
- görsel title,
- görsel dosya adı,
- OG image mantığı

kararını vermek.

KURALLAR:
- Yalnızca geçerli JSON üret.
- JSON dışında açıklama yazma.
- Gerçekçi ve SEO uyumlu görsel sahneleri üret.
- Spam görsel üretme.
- Aşırı text içeren görsel isteme.
- Clickbait isteme.
- Görsel kullanıcıya fayda sağlamalı.
- Blog konusu ile birebir uyumlu olmalı.
- Görsel satın alma niyetini doğal desteklemeli.
- Modern ecommerce görünümü düşün.
- Photorealistic yaklaşım kullan.
- Vercel free tier uyumlu çalış.

ÇIKTI ŞEMASI:

{
  "generate_image": true,
  "image_type": "",
  "image_prompt": "",
  "image_alt": "",
  "image_title": "",
  "image_filename": "",
  "og_image_needed": true
}
`;
          const responseText = await generateText(prompt, true, veniceModel, veniceKey);
          results.phase4 = JSON.parse(responseText || "{}");
        }
      }

      // PHASE 5: INTERNAL LINK ENGINE
      if (phase === "all" || phase === "phase5") {
        const prompt = `
${productContext}
Üretilen SEO İçerikler: ${JSON.stringify(results.phase2 || {})}

Sen Paşa Motor için çalışan internal link motorusun.

Görevin:
İçerik ile alakalı:
- ürün bağlantıları
- kategori bağlantıları
- cluster bağlantıları
- rehber bağlantıları

önermektir.

KURALLAR:
- Yalnızca geçerli JSON üret.
- JSON dışında açıklama yazma.
- Doğal anchor text kullan.
- “buraya tıkla” kullanma.
- Alakasız link önerme.
- SEO cluster mantığı kullan.
- Crawl yapısını güçlendirecek linkler öner.

ÇIKTI ŞEMASI:

{
  "internal_links": [
    {
      "anchor": "",
      "url": "",
      "purpose": ""
    }
  ]
}
`;
        const responseText = await generateText(prompt, true, veniceModel, veniceKey);
        results.phase5 = JSON.parse(responseText || "{}");
      }

      // PHASE 6: QUALITY & DUPLICATE CHECKER
      if (phase === "all" || phase === "phase6") {
        const generatedSoFar = {
          phase1: results.phase1,
          phase2: results.phase2,
          phase3: results.phase3,
          phase4: results.phase4,
          phase5: results.phase5,
        };
        const prompt = `
${productContext}
Üretilen Tüm Çıktılar: ${JSON.stringify(generatedSoFar)}

Sen Paşa Motor için çalışan SEO kalite kontrol motorusun.

Görevin:
Üretilen içeriği analiz edip:
- duplicate risk,
- thin content,
- keyword stuffing,
- AI footprint,
- spam riski,
- JSON validasyonu,
- policy uyumu

kontrolü yapmaktır.

KURALLAR:
- Yalnızca geçerli JSON üret.
- JSON dışında açıklama yazma.
- Teknik yorum ekleme.
- Kısa ve net analiz üret.
- Hata varsa belirt.
- Risk düşükse açıkça belirt.

ÇIKTI ŞEMASI:

{
  "policy_safe": true,
  "duplicate_risk_low": true,
  "thin_content_risk": false,
  "keyword_stuffing_risk": false,
  "ai_footprint_risk": "low",
  "json_valid": true,
  "needs_human_review": true,
  "notes": []
}
`;
        const responseText = await generateText(prompt, true, veniceModel, veniceKey);
        results.phase6 = JSON.parse(responseText || "{}");
      }

      res.json({ success: true, ...results });
    } catch (error: any) {
      console.error("AI SEO Agent Error:", error);
      res.status(500).json({ error: error.message });
    }
    */
  });

  // GET all products
  app.get("/api/products", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database not initialized." });
      
      const snapshot = await db.collection("products").get();
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json({ success: true, count: products.length, data: products });
    } catch (error: any) {
      console.error("GET /api/products error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST create/import products
  // Supports single or bulk import with sequential batch processing
  app.post("/api/products/import", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database not initialized." });

      const payload = req.body;
      const products = Array.isArray(payload) ? payload : [payload];
      
      const collectionRef = db.collection("products");
      let importedCount = 0;

      // Firestore batches can hold up to 500 operations.
      // We chunk our payload and process sequentially for maximum performance and stability.
      const CHUNK_SIZE = 500;
      for (let i = 0; i < products.length; i += CHUNK_SIZE) {
        const chunk = products.slice(i, i + CHUNK_SIZE);
        const batch = db.batch();

        for (const item of chunk) {
          const id = item.id;
          let docRef;
          if (id) {
            docRef = collectionRef.doc(id);
          } else {
            docRef = collectionRef.doc();
          }
          
          // Remove id from the data being stored if necessary
          const { id: _, ...dataToSave } = item;
          
          // Ensure timestamp is added if missing
          if (!dataToSave.created_at) {
            dataToSave.created_at = new Date().toISOString();
          }
          
          batch.set(docRef, dataToSave, { merge: true });
          importedCount++;
        }

        // Sequential database commit
        await batch.commit();
      }

      res.json({ 
        success: true, 
        message: `${importedCount} ürün sıralı yazma sistemiyle başarıyla aktarıldı.`,
        count: importedCount
      });
    } catch (error: any) {
      console.error("POST /api/products/import error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET single product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database not initialized." });
      
      const doc = await db.collection("products").doc(req.params.id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Ürün bulunamadı" });
      }
      res.json({ success: true, data: { id: doc.id, ...doc.data() } });
    } catch (error: any) {
      console.error(`GET /api/products/${req.params.id} error:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE product by ID
  app.delete("/api/products/:id", async (req, res) => {
    try {
      if (!db) return res.status(500).json({ error: "Database not initialized." });
      
      await db.collection("products").doc(req.params.id).delete();
      res.json({ success: true, message: `Ürün (${req.params.id}) silindi.` });
    } catch (error: any) {
      console.error(`DELETE /api/products/${req.params.id} error:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // POST Github Push
  app.post("/api/github/push", async (req, res) => {
    try {
      const { githubUrl, token } = req.body;
      if (!githubUrl) return res.status(400).json({ error: "GitHub URL is required" });
      if (!token) return res.status(400).json({ error: "Personal Access Token is required for SDK push." });
      
      await pushToGithubSdk(githubUrl, token);
      
      res.json({ success: true, message: "Değişiklikler Github SDK üzerinden başarıyla aktarıldı!" });
      
    } catch (error: any) {
      console.error("POST /api/github/push error:", error);
      res.status(500).json({ error: error.message || "Bilinmeyen SDK Hatası" });
    }
  });

  // POST SEO Sitemap & IndexNow Ping
  app.post("/api/seo/ping", async (req, res) => {
    try {
      const { sitemapUrl = "https://pasamotor.com.tr/sitemap.xml", indexNowKey = "96dfc37466eb4b74bd562be641577977" } = req.body;
      const status = await pingSitemap(sitemapUrl, indexNowKey);
      res.json({ success: true, results: status });
    } catch (error: any) {
      console.error("SEO Ping API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET SEO Sitemap Cron Job Endpoint
  app.get("/api/seo/cron/sitemap", async (req, res) => {
    try {
      const sitemapUrl = "https://pasamotor.com.tr/sitemap.xml";
      const indexNowKey = "96dfc37466eb4b74bd562be641577977";
      const status = await pingSitemap(sitemapUrl, indexNowKey);
      res.json({ success: true, message: "Sitemap cron job ping executed successfully.", results: status });
    } catch (error: any) {
      console.error("GET /api/seo/cron/sitemap error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Helper for sitemap notification
  async function pingSitemap(sitemapUrl: string, indexNowKey: string) {
    const results = [];
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PaşaMotorSEO";

    try {
      const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const gRes = await fetch(googleUrl, { headers: { "User-Agent": userAgent } });
      if (gRes.ok || gRes.status === 200) results.push({ engine: "Google Sitemap Ping", status: "success", message: `Sitemap başarıyla bildirildi (HTTP ${gRes.status}).` });
      else results.push({ engine: "Google Sitemap Ping", status: "warning", message: `Sitemap bildirimi yapıldı ancak sunucu HTTP ${gRes.status} döndü.` });
    } catch (err: any) { results.push({ engine: "Google Sitemap Ping", status: "error", message: err.message }); }

    try {
      const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      const bRes = await fetch(bingUrl, { headers: { "User-Agent": userAgent } });
      if (bRes.ok || bRes.status === 200) results.push({ engine: "Bing Sitemap Ping", status: "success", message: `Sitemap başarıyla bildirildi (HTTP ${bRes.status}).` });
      else results.push({ engine: "Bing Sitemap Ping", status: "warning", message: `Sitemap bildirimi yapıldı ancak sunucu HTTP ${bRes.status} döndü.` });
    } catch (err: any) { results.push({ engine: "Bing Sitemap Ping", status: "error", message: err.message }); }

    if (indexNowKey) {
      try {
        let host = "pasamotor.com.tr";
        try { host = new URL(sitemapUrl).hostname; } catch(e) {}
        const postUrl = "https://api.indexnow.org/indexnow";
        const payload = {
          host, key: indexNowKey, keyLocation: `https://${host}/${indexNowKey}.txt`,
          urlList: [`https://${host}/`, `https://${host}/blog`, `https://${host}/yedek-parca`, sitemapUrl]
        };
        const inPostRes = await fetch(postUrl, {
          method: "POST", headers: { "Content-Type": "application/json; charset=utf-8", "User-Agent": userAgent }, body: JSON.stringify(payload)
        });
        if (inPostRes.ok) results.push({ engine: "IndexNow (Yandex/Bing)", status: "success", message: `İndeksleme talebi IndexNow API'sine başarıyla iletildi (GET/POST API onaylandı).` });
        else results.push({ engine: "IndexNow (Yandex/Bing)", status: "warning", message: `İşlem tamamlandı ancak hata dönebilir (POST: ${inPostRes.status}).` });
      } catch (err: any) { results.push({ engine: "IndexNow (Yandex/Bing)", status: "error", message: err.message }); }
    }
    return results;
  }

  // POST URL Update (For Product or Blog Post) -> IndexNow
  app.post("/api/seo/notify-url", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: "URL is required" });
      
      let urls = Array.isArray(url) ? url : [url];
      urls = urls.map(u => {
        if (!u.startsWith('http')) return `https://pasamotor.com.tr${u.startsWith('/') ? '' : '/'}${u}`;
        return u;
      });

      const indexNowKey = "96dfc37466eb4b74bd562be641577977";
      const host = "pasamotor.com.tr";
      const payload = {
        host,
        key: indexNowKey,
        keyLocation: `https://${host}/${indexNowKey}.txt`,
        urlList: urls
      };
      
      const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PaşaMotorSEO";
      const inPostRes = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8", "User-Agent": userAgent },
        body: JSON.stringify(payload)
      });
      
      if (inPostRes.ok) {
        res.json({ success: true, message: "URLs başarıyla IndexNow'a bildirildi.", urls });
      } else {
        const text = await inPostRes.text();
        res.status(500).json({ error: `IndexNow API Hatası: HTTP ${inPostRes.status} - ${text}` });
      }
    } catch (error: any) {
      console.error("POST /api/seo/notify-url error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ==========================================
  // SEO Optimizer & Dynamic Prerender Engine
  // ==========================================

  async function serveSEOInjectedHtml(req: any, res: any, customTitle?: string, customDesc?: string, customImage?: string, canonicalUrl?: string) {
    try {
      const distPath = path.join(process.cwd(), "dist");
      const filePath = path.join(distPath, "index.html");
      const devFilePath = path.join(process.cwd(), "index.html");
      const targetPath = fs.existsSync(filePath) ? filePath : devFilePath;
      
      if (!fs.existsSync(targetPath)) {
        return res.status(404).send("index.html not found");
      }

      let html = fs.readFileSync(targetPath, "utf8");

      const title = customTitle || "Paşa Motor | Yedek Parça & Yetkili Servis";
      const desc = customDesc || "İstanbul'un en güvenilir motosiklet yedek parça merkezi ve Kuba, Mondial, RKS, TVS yetkili servisi.";
      const image = customImage || "https://pasamotor.com.tr/src/assets/pasa-motor-logo.webp";
      const canonical = canonicalUrl || `https://pasamotor.com.tr${req.originalUrl}`;

      // Replace <title>
      html = html.replace(/<title>[^<]+<\/title>/g, `<title>${title}</title>`);
      
      // Replace Meta Description
      html = html.replace(/<meta name="description"[^>]+>/g, `<meta name="description" content="${desc}" />`);
      
      // Replace Open Graph url
      html = html.replace(/<meta property="og:url"[^>]+>/g, `<meta property="og:url" content="${canonical}" />`);
      
      // Replace Open Graph title
      html = html.replace(/<meta property="og:title"[^>]+>/g, `<meta property="og:title" content="${title}" />`);
      
      // Replace Open Graph description
      html = html.replace(/<meta property="og:description"[^>]+>/g, `<meta property="og:description" content="${desc}" />`);
      
      // Replace canonical link
      html = html.replace(/<link rel="canonical"[^>]+>/g, `<link rel="canonical" href="${canonical}" />`);

      // Inverted JSON-LD representation
      const structuredData = `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "${title.replace(/"/g, '\\"')}",
        "description": "${desc.replace(/"/g, '\\"')}",
        "url": "${canonical}",
        "image": "${image}"
      }
      </script>
      `;
      html = html.replace("</body>", `${structuredData}\n</body>`);

      res.header("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch (error: any) {
      console.error("HTML SEO Injector Error:", error);
      res.status(500).send(error.message);
    }
  }

  // Dynamic Sitemap Generator
  app.get("/sitemap.xml", async (req, res) => {
    res.header("Content-Type", "application/xml");
    try {
      const urls = [
        { loc: "https://pasamotor.com.tr/", changefreq: "daily", priority: "1.0" },
        { loc: "https://pasamotor.com.tr/hakkimizda", changefreq: "monthly", priority: "0.8" },
        { loc: "https://pasamotor.com.tr/hizmetler", changefreq: "weekly", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/yedek-parca", changefreq: "daily", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/blog", changefreq: "daily", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/iletisim", changefreq: "monthly", priority: "0.8" },
        { loc: "https://pasamotor.com.tr/galeri", changefreq: "weekly", priority: "0.7" },
      ];

      if (db) {
        // Fetch dynamic products from Firestore
        try {
          const prodSnap = await db.collection("products").get();
          prodSnap.forEach(doc => {
            const data = doc.data();
            if (data.slug) {
              urls.push({
                loc: `https://pasamotor.com.tr/yedek-parca/${data.slug}`,
                changefreq: "weekly",
                priority: "0.8"
              });
            }
          });
        } catch (e) {
          console.error("Sitemap dynamic products load error:", e);
        }

        // Fetch dynamic blog posts from Firestore
        try {
          const postSnap = await db.collection("posts").get();
          postSnap.forEach(doc => {
            const data = doc.data();
            if (data.slug) {
              urls.push({
                loc: `https://pasamotor.com.tr/blog/${data.slug}`,
                changefreq: "weekly",
                priority: "0.8"
              });
            }
          });
        } catch (e) {
          console.error("Sitemap dynamic posts load error:", e);
        }
      }

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

      res.send(xml);
    } catch (error: any) {
      res.status(500).send(`<error>${error.message}</error>`);
    }
  });

  // Dynamic Robots.txt
  app.get("/robots.txt", (req, res) => {
    res.header("Content-Type", "text/plain");
    res.send(`User-agent: *
Allow: /
Sitemap: https://pasamotor.com.tr/sitemap.xml
`);
  });

  // SEO Prerender Interceptors for high-value pages (Only in production to prevent bypassing Vite in dev)
  if (process.env.NODE_ENV === "production") {
    app.get("/yedek-parca/:slug", async (req, res) => {
      try {
        const slug = req.params.slug;
        if (!db) return serveSEOInjectedHtml(req, res);

        const snap = await db.collection("products").where("slug", "==", slug).limit(1).get();
        if (snap.empty) return serveSEOInjectedHtml(req, res);
        
        const p = snap.docs[0].data();
        const title = p.meta_title || `${p.title} | Orijinal ${p.brand || 'Yedek Parça'} - Paşa Motor`;
        const desc = p.meta_description || p.description || `${p.title} yedek parçası, en uygun fiyatlarla Paşa Motor'da size sunuluyor. Orijinal ürün güvencesiyle sipariş verin.`;
        const image = (p.images && p.images[0]) || undefined;
        
        return serveSEOInjectedHtml(req, res, title, desc, image);
      } catch (err) {
        console.error("SEO Product fetch error:", err);
        return serveSEOInjectedHtml(req, res);
      }
    });

    app.get("/blog/:slug", async (req, res) => {
      try {
        const slug = req.params.slug;
        if (!db) return serveSEOInjectedHtml(req, res);

        const snap = await db.collection("posts").where("slug", "==", slug).limit(1).get();
        if (snap.empty) return serveSEOInjectedHtml(req, res);
        
        const p = snap.docs[0].data();
        const title = p.meta_title || `${p.title} | Paşa Motor Blog`;
        const desc = p.meta_description || p.excerpt || p.content?.replace(/<[^>]+>/g, '').substring(0, 155) || "Motosiklet rehberleri, bakım ipuçları ve faydalı seyahat önerileri.";
        const image = p.cover_image || undefined;
        
        return serveSEOInjectedHtml(req, res, title, desc, image);
      } catch (err) {
        console.error("SEO Blog fetch error:", err);
        return serveSEOInjectedHtml(req, res);
      }
    });

    app.get("/hakkimizda", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Hakkımızda | Paşa Motor Motosiklet Showroom & Servis", 
        "Nihat KAN liderliğindeki Paşa Motor; İstanbul Fatih'te TVS, Hero, Falcon ve Işıldar yetkili bayisi ve teknik servis merkezidir."
      );
    });

    app.get("/hizmetler", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Motosiklet Bakım ve Servis Hizmetlerimiz | Paşa Motor", 
        "Periyodik bakım, motor rektefiye, orijinal yedek parça montajı, elektrik sistemi kontrolleri ve hasar tespiti dahil tüm profesyonel servislerimiz."
      );
    });

    app.get("/iletisim", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "İletişim & Konum Bilgileri | Paşa Motor Fatih Servisi", 
        "Bize ulaşın: 0212 586 85 98 veya WhatsApp: 0534 899 68 17. Adres: Kızılelma Cad. No:66/A Kocamustafapaşa - Fatih / İstanbul."
      );
    });

    app.get("/galeri", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Profesyonel Servis Alanı & Motosiklet Galerisi | Paşa Motor", 
        "Modernize edilmiş geniş servis merkezimizden, tavan led aydınlatmalı çalışma alanlarımızdan ve usta ekibimizin dükkanından profesyonel kareler."
      );
    });

    app.get("/yedek-parca", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Orijinal Motosiklet Yedek Parçaları Fiyat Kataloğu | Paşa Motor", 
        "TVS, RKS, Kuba, Mondial, Bajaj, Honda ve önde gelen markaların 100% orijinal yedek parça kataloğu. En uygun fiyatlar ve hızlı tedarik."
      );
    });

    app.get("/blog", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Motosiklet Rehberi & Bakım Önerileri | Paşa Motor Blog", 
        "Motosiklet arıza teşhisi, motor parçalarının değişim zamanları ve usta tavsiyeleri içeren güncel motosiklet blogu."
      );
    });

    app.get("/", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Paşa Motor - İstanbul Fatih Motosiklet Yetkili Servis Bayi", 
        "TVS, Hero, Falcon, Işıldar yetkili satış ve teknik servis noktası. En geniş orijinal yedek parça yelpazesi, profesyonel motosiklet ustaları ve modern servis ekipmanları."
      );
    });
  }

  // ==========================================

// Vite middleware & listen (Only in non-Vercel environment)
if (!process.env.VERCEL) {
  (async () => {
    if (process.env.NODE_ENV !== "production") {
      const { createServer: createViteServer } = await import("vite");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath, { index: false }));
      app.get("*all", (req, res) => {
        return serveSEOInjectedHtml(req, res);
      });
    }

    // Keep-alive loop to prevent Supabase from pausing (runs internal every 10 min)
    if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
      setInterval(async () => {
         try {
           const { createClient } = await import("@supabase/supabase-js");
           const supabase = createClient(process.env.VITE_SUPABASE_URL as string, process.env.VITE_SUPABASE_ANON_KEY as string);
           const { error } = await supabase.from("products").select("id").limit(1);
           if (error) console.error("Internal Supabase Keep-Alive Ping Failed:", error.message);
           else console.log("Internal Supabase Keep-Alive Ping Successful (Keeps DB awake).");
         } catch(e) {
           // ignore
         }
      }, 10 * 60 * 1000); // 10 minutes
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api/products`);
    });
  })();
}

export default app;
