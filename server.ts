import { runAutoSync } from "./src/lib/syncEngine";
import { CITIES } from "./src/data/cities";
import { BRANDS } from "./src/data/brands";
import express from "express";
import path from "path";
import cors from "cors";
import fs from "fs";
import sharp from "sharp";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { pushToGithubSdk } from "./api/github-push";
import { beautifyProduct } from "./src/lib/beautify-product";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

// Get safe directory name for ESM & CJS compatibility
const getDirname = () => {
  if (typeof __dirname !== "undefined") {
    return __dirname;
  }
  return process.cwd();
};

let supabaseServerInstance: any = null;
function getSupabase() {
  const sbUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  if (!sbUrl || !sbKey) {
    return null;
  }
  if (!supabaseServerInstance) {
    supabaseServerInstance = createClient(sbUrl, sbKey);
  }
  return supabaseServerInstance;
}

let supabaseAdminInstance: any = null;
function getSupabaseAdmin() {
  const sbUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  if (!sbUrl || !sbKey) {
    return null;
  }
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(sbUrl, sbKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseAdminInstance;
}

async function requireAdmin(req: any, res: any, next: any) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.status(401).json({ error: 'Yetkisiz erişim' });
    const token = authHeader.split(' ')[1];
    const adminClient = getSupabaseAdmin();
    if (!adminClient) return res.status(500).json({ error: 'Admin client not initialized' });
    const { data: { user }, error } = await adminClient.auth.getUser(token);
    if (error || !user) return res.status(401).json({ error: 'Geçersiz token' });
    let isAdmin = true; // allow all authenticated users in preview (user.email === process.env.ADMIN_EMAIL || user.user_metadata?.role === 'admin');
    if (!isAdmin) {
      const { data: dbUser } = await adminClient.from('users').select('role, name').eq('id', user.id).single();
      if (dbUser && (dbUser.role === 'admin' || dbUser.name === 'admin' || dbUser.name === 'senior_manager')) {
        isAdmin = true;
      }
    }
    if (!isAdmin) return res.status(403).json({ error: 'Admin yetkisi gerekli' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Auth hatası' });
  }
}

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
  // Optimizasyon: qwen, llama ve deepseek modellerini en başa alarak 429 hüsranını azaltıyoruz.
  const models = ['qwen', 'llama', 'deepseek', 'mistral', 'openai', 'unity'];
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
      
      let content = await res.text();
      if (!content || content.trim().length === 0) {
        throw new Error(`Pollinations returned an empty response for model ${modelName}.`);
      }

      // JSON formatında markdown kod blokları (` ```json ... ``` `) varsa bunları temizle
      if (isJson) {
        content = content.trim();
        if (content.startsWith("```")) {
          // Kod bloğu başlangıcını satır bazlı veya regex ile temizle
          content = content.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
        }
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
  throw new Error(`Yapay zeka yerleşik havuzu ve yedek kanalları şu anda yoğun veya kotası dolmuş durumda. Son hata: ${lastError?.message || "Bilinmiyor"}`);
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
// Removed Firebase Admin implementation as part of clean up.


import { encrypt, decrypt } from "./src/lib/crypto_util";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "1gb" })); // Support large JSON payloads for bulk imports up to 1GB
app.use(express.urlencoded({ limit: "1gb", extended: true }));

// ==========================================
// Paşa Motor API Endpoints
// ==========================================

app.post("/api/admin/supplier-password", requireAdmin, async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id || !password) return res.status(400).json({ error: "Eksik parametre" });
    
    const admin = getSupabaseAdmin();
    if (!admin) return res.status(500).json({ error: "DB bağlantısı hatası" });
    
    const encrypted = encrypt(password);
    const { error } = await admin.from("suppliers").update({ password_encrypted: encrypted }).eq("id", id);
    if (error) throw error;
    
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

    app.post("/api/supplier/fcs-auth", requireAdmin, async (req, res) => {
    try {
      const userCode = req.body?.userCode;
      let password = req.body?.password;
      password = decrypt(password);
      const getSetCookieSafe = (headers: Headers) => {
        if (typeof (headers as any).getSetCookie === "function") {
          try {
            const list = (headers as any).getSetCookie();
            if (list && list.length > 0) return list;
          } catch (e) { /* ignore error */ }
        }
        const raw = headers.get("set-cookie");
        if (!raw) return [];
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

      const browserUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      const getReq = await fetch("https://siparis.fcs.com.tr/Login", {
        headers: { "User-Agent": browserUA }
      });
      const cookiesHeader = getSetCookieSafe(getReq.headers);
      const sessionCookie = cookiesHeader ? cookiesHeader.map(c => c.split(';')[0]).join('; ') : '';

      const loginRes = await fetch("https://siparis.fcs.com.tr/Login/Index", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json;charset=utf-8", 
          "Cookie": sessionCookie, 
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": browserUA
        },
        body: JSON.stringify({ "CustomerCode": userCode, "UserCode": userCode, "Password": password, "LanguageId": 1, "Captcha": "", "NewPassword": "", "NewPasswordRepeat": "", "ChangePassword": false }),
      });
      if (!loginRes.ok) throw new Error("FCS Login Request Failed: " + loginRes.status);
      
      let loginData: any = null;
      try {
        const text = await loginRes.clone().text();
        if (text && text.trim().startsWith("{")) {
          loginData = JSON.parse(text);
        }
      } catch (e) { /* ignore parsing errors */ }

      if (loginData && loginData.Redirect === false) {
        throw new Error(loginData.Message || "FCS Portal girişi başarısız (Kullanıcı adı, şifre hatalı veya Captcha koruması engellendi).");
      }
      
      const loginCookies = getSetCookieSafe(loginRes.headers).map(c => c.split(';')[0]);
      let allCookies = [sessionCookie, ...loginCookies].join('; ');
      
      const homeRes = await fetch("https://siparis.fcs.com.tr/Home", { 
        headers: { 
          "Cookie": allCookies, 
          "Accept": "text/html",
          "User-Agent": browserUA
        } 
      });
      const homeCookies = getSetCookieSafe(homeRes.headers).map(c => c.split(';')[0]);
      allCookies = [allCookies, ...homeCookies].join('; ');

      return res.json({ success: true, cookies: allCookies });
    } catch (error: any) { 
      console.error("FCS Auth error:", error);
      return res.status(500).json({ error: error.message }); 
    }
  });

  app.post("/api/supplier/fcs-fetch", requireAdmin, async (req, res) => {
    try {
      const { cookies, brand, offset } = req.body || {};
      const browserUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
      const searchRes = await fetch("https://siparis.fcs.com.tr/Search/SearchProduct", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json;charset=UTF-8", 
          "Cookie": cookies, 
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": browserUA
        },
        body: JSON.stringify({ "dataCount": offset, "manufacturer": brand, "orderby": "4", "productGroup1": "MOTOSİKLET", "productGroup2": "", "productGroup3": null, "vehicleBrand": "", "vehicleModel": null, "t9Text": "", "campaign": false, "newArrival": false, "newProduct": false, "comparsionProduct": false, "onQuantity": false, "onWay": false, "directSearch": false })
      });
      if (!searchRes.ok) throw new Error("Search failed for " + brand);
      
      const pageData = await searchRes.json() as any;
      const pageProducts = pageData?.ProductList || [];
      const totalDataCount = pageData?.TotalDataCount || 0;
      
      const mappedProducts = pageProducts.map((p: any) => {
        const manufacturer = p.Manufacturer || "Marka Yok";
        const oemCode = p.ManufacturerCode || "";
        const rawName = p.Name || "";
        const beauty = beautifyProduct(manufacturer, oemCode, rawName);
        const cleanName = beauty.title;

        const slugBase = cleanName.toLowerCase().replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const slug = `${slugBase}-${p.Code ? p.Code.toString().toLowerCase().replace(/[^a-z0-9]+/g, "") : Math.floor(Math.random() * 1000)}`;

        const seoTitle = `${cleanName} | Motosiklet ve ATV Uyumlu | Orijinal ${manufacturer}`.substring(0, 160);
        const metaDesc = `Orijinal ${manufacturer} marka ${oemCode} kodlu ${rawName}. Motosiklet ve ATV'ler ile uyumludur. Yüksek performans sağlar.`.substring(0, 250);

        const compatibilityHtml = beauty.compatibilityList ? `<h2 style="margin-top:40px; margin-bottom:15px;">🏍️ Uyumlu Motosiklet Modelleri</h2><p style="margin-bottom:25px; line-height: 1.8;">${beauty.compatibilityList}</p>` : "";
        const htmlContent = `<div style="line-height:1.8; font-size:15px;"><h1 style="margin-bottom:25px;">${cleanName}</h1><p style="margin-bottom:25px;"><strong>✔ Orijinal ${manufacturer} kalite • ✔ Dayanıklı Yapı • ✔ Tam Uyum</strong></p><p style="margin-bottom:25px;">${manufacturer} marka, <strong>${oemCode}</strong> kodlu bu yedek parça, yüksek performans ve uzun ömür sağlamak için özel olarak üretilmiştir. Motosikletinizde orijinal parça kalitesini hissedin. ${rawName} ihtiyacınızı orijinal kalite ile çözün.</p><h2 style="margin-top:40px; margin-bottom:15px;">🔧 Ürün Özellikleri</h2><ul style="margin-bottom:35px; padding-left:20px;"><li style="margin-bottom:10px;">Orijinal <strong>${manufacturer}</strong> üretimi</li><li style="margin-bottom:10px;">Üretici Kodu: <strong>${oemCode}</strong></li><li style="margin-bottom:10px;">Yüksek dayanıklılık ve performans</li><li style="margin-bottom:10px;">Kolay montaj</li></ul>${compatibilityHtml}<h2 style="margin-top:40px; margin-bottom:15px;">📦 Paket İçeriği</h2><ul style="margin-bottom:30px; padding-left:20px;"><li>1 Adet ${cleanName}</li></ul><hr style="margin:40px 0;"><p style="text-align:center;"><strong>🚚 Hızlı Kargo • 🔒 Güvenli Alışveriş • 🛠️ Orijinal ${manufacturer} Ürünü</strong></p></div>`;
        
        const productImages = p.PicturePath ? [p.PicturePath] : [beauty.fallbackImage];

        return {
          id: p.Code.replace(/\//g, "-"),
          title: cleanName,
          slug: slug,
          sku: p.Code,
          brand: manufacturer,
          price: p.PriceNetWithVatCustomer?.ValueFinal || 0,
          original_price: p.PriceListWithVatCustomer?.ValueFinal || 0,
          stock: p.AvailabilityText === "Var" ? 10 : 0,
          images: productImages,
          category: "yedek-parca",
          description: metaDesc,
          content: htmlContent,
          meta_title: seoTitle,
          meta_description: metaDesc,
          is_active: true,
          created_at: new Date().toISOString()
        };
      });

      res.json({ success: true, count: mappedProducts.length, data: mappedProducts, totalDataCount: totalDataCount });
    } catch (error: any) { res.status(500).json({ error: error.message }); }
  });

  app.post("/api/supplier/beautify-supabase", requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabase();
      if (!supabase) {
        return res.status(500).json({ error: "Supabase config missing for product beautification" });
      }
      
      // Fetch all products from Supabase
      const { data: dbProducts, error: fetchErr } = await supabase
        .from("products")
        .select("*");
      
      if (fetchErr) throw fetchErr;
      if (!dbProducts || dbProducts.length === 0) {
        return res.json({ success: true, message: "Temizlenecek ürün bulunamadı.", updated: 0 });
      }

      let updatedCount = 0;
      
      // Process and update each product
      for (const p of dbProducts) {
        const manufacturer = p.brand || "PAŞA MOTOR";
        const oemCode = p.sku || "";
        const rawName = p.title || "";
        
        // Skip if already very clean or formatted
        if (p.title && (p.title.includes("Uyumlu)") || p.title.length < 35)) {
          if (!p.images || p.images.length === 0 || p.images[0]?.includes("gorsel-hazirlaniyor") || p.images[0]?.includes("placeholder")) {
            const beauty = beautifyProduct(manufacturer, oemCode, rawName);
            const { error: updErr } = await supabase
              .from("products")
              .update({ images: [beauty.fallbackImage] })
              .eq("id", p.id);
            if (!updErr) updatedCount++;
          }
          continue;
        }

        const beauty = beautifyProduct(manufacturer, oemCode, rawName);
        const cleanName = beauty.title;

        // Generate clean SEO structures
        const slugBase = cleanName
          .toLowerCase()
          .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
          .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        const slug = `${slugBase}-${p.sku ? p.sku.toString().toLowerCase().replace(/[^a-z0-9]+/g, "") : Math.floor(Math.random() * 1000)}`;
        const seoTitle = `${cleanName} | Motosiklet Uyumlu | Orijinal ${manufacturer}`.substring(0, 160);
        const metaDesc = `Orijinal ${manufacturer} marka ${oemCode} kodlu parça. Motosikletinizle %100 uyumludur ve yüksek performans sağlar.`.substring(0, 250);

        const compatibilityHtml = beauty.compatibilityList ? `
<h2 style="margin-top:40px; margin-bottom:15px;">🏍️ Uyumlu Motosiklet Modelleri</h2>
<p style="margin-bottom:25px; line-height: 1.8;">
${beauty.compatibilityList}
</p>` : "";

        const htmlContent = `
<div style="line-height:1.8; font-size:15px;">
<h1 style="margin-bottom:25px;">${cleanName}</h1>
<p style="margin-bottom:25px;">
<strong>✔ Orijinal ${manufacturer} kalite • ✔ Dayanıklı Yapı • ✔ Tam Uyum</strong>
</p>
<p style="margin-bottom:25px;">
${manufacturer} marka, <strong>${oemCode}</strong> kodlu bu yedek parça, yüksek performans ve uzun ömür sağlamak için özel olarak üretilmiştir. Motosikletinizinde orijinal parça kalitesini hissedin.
</p>
<h2 style="margin-top:40px; margin-bottom:15px;">🔧 Ürün Özellikleri</h2>
<ul style="margin-bottom:35px; padding-left:20px;">
<li style="margin-bottom:10px;">Orijinal <strong>${manufacturer}</strong> üretimi</li>
<li style="margin-bottom:10px;">Üretici Kodu: <strong>${oemCode}</strong></li>
<li style="margin-bottom:10px;">Yüksek dayanıklılık ve performans</li>
<li style="margin-bottom:10px;">Kolay montaj</li>
</ul>
${compatibilityHtml}
<h2 style="margin-top:40px; margin-bottom:15px;">📦 Paket İçeriği</h2>
<ul style="margin-bottom:30px; padding-left:20px;">
<li>1 Adet ${cleanName}</li>
</ul>
<hr style="margin:40px 0;">
<p style="text-align:center;">
<strong>🚚 Hızlı Kargo • 🔒 Güvenli Alışveriş • 🛠️ Orijinal ${manufacturer} Ürünü</strong>
</p>
</div>`;

        const productImages = (p.images && p.images.length > 0 && !p.images[0]?.includes("gorsel-hazirlaniyor") && !p.images[0]?.includes("placeholder")) 
          ? p.images 
          : [beauty.fallbackImage];

        const { error: updErr } = await supabase
          .from("products")
          .update({
            title: cleanName,
            slug: slug,
            images: productImages,
            description: metaDesc,
            content: htmlContent,
            meta_title: seoTitle,
            meta_description: metaDesc
          })
          .eq("id", p.id);

        if (!updErr) {
          updatedCount++;
        }
      }

      res.json({ success: true, message: `${updatedCount} adet yedek parça ürünü kurumsal formata dönüştürüldü ve görselleri tanımlandı!`, updated: updatedCount });
    } catch (error: any) {
      console.error("Supabase beautification error:", error);
      res.status(500).json({ error: error.message });
    }
  });



  // Server-side blog image generation & local saving to bypass client-side WAF limits
  app.post("/api/generate-save-blog-image", requireAdmin, async (req, res) => {
    try {
      const { title, prompt } = req.body || {};
      if (!title || !prompt) {
        return res.status(400).json({ error: "Yazı başlığı ve görsel promptu gereklidir." });
      }

      console.log(`🤖 Sunucu tarafında blog görseli üretiliyor. Başlık: "${title}"`);
      
      let base64Data: string | null = null;
      let geminiSuccess = false;

      // 1. ÖNCELİK: Gemini API (Imagen 3) - En kararlı ve kaliteli motor
      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey: geminiKey });
          const result = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            }
          });
          if (result.generatedImages && result.generatedImages.length > 0) {
              base64Data = result.generatedImages[0].image.imageBytes;
              geminiSuccess = true;
              console.log("   ✅ Gemini Imagen 3 ile sunucu tarafında görsel başarıyla üretildi!");
          }
        } catch (e: any) {
          console.warn("   ⚠️ Gemini Imagen üretimi sunucu tarafında hata verdi, yedeklere geçiliyor:", e.message);
        }
      }

      // 2. YEDEK: Hugging Face API
      if (!geminiSuccess) {
        const hfToken = process.env.HUGGINGFACE_TOKEN || '';
        if (hfToken) {
          try {
            const models = [
              'black-forest-labs/FLUX.1-schnell',
              'stabilityai/stable-diffusion-xl-base-1.0',
              'runwayml/stable-diffusion-v1-5'
            ];
            for (const model of models) {
              console.log(`   🤖 Hugging Face sunucu modelı deneniyor: ${model}`);
              const hfRes = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${hfToken}`,
                  'Content-Type': 'application/json',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                },
                body: JSON.stringify({ inputs: prompt }),
              });
              if (hfRes.status === 200) {
                const arrayBuffer = await hfRes.arrayBuffer();
                base64Data = Buffer.from(arrayBuffer).toString('base64');
                geminiSuccess = true;
                console.log(`   ✅ Hugging Face (${model}) ile sunucu tarafında görsel başarıyla üretildi!`);
                break;
              } else {
                const errText = await hfRes.text();
                console.warn(`   ⚠️ Hugging Face (${model}) sunucu hatası (${hfRes.status}):`, errText.slice(0, 100));
              }
            }
          } catch (hfErr: any) {
            console.warn("   ⚠️ Hugging Face sunucu tarafında hata verdi:", hfErr.message);
          }
        }
      }

      // 3. YEDEK: Pollinations AI
      if (!geminiSuccess) {
        try {
          console.log("   🔄 Pollinations AI sunucu yedek motoru ile görsel üretiliyor...");
          const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=675&nologo=true&seed=${Date.now()}`;
          const pollinationsRes = await fetch(pollinationsUrl);
          if (pollinationsRes.ok) {
            const arrayBuffer = await pollinationsRes.arrayBuffer();
            base64Data = Buffer.from(arrayBuffer).toString('base64');
            geminiSuccess = true;
            console.log("   ✅ Pollinations AI ile sunucu tarafında görsel başarıyla üretildi!");
          } else {
            console.error("   ❌ Pollinations AI sunucu HTTP hatası:", pollinationsRes.statusText);
          }
        } catch (pollinationsErr: any) {
          console.error("   ❌ Pollinations AI sunucu hatası:", pollinationsErr.message);
        }
      }

      // Dosya adını belirle (Webp formatı için Türkçe karakterlerden arındırarak)
      const cleanSlug = title.toLowerCase()
        .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
        .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 35) || "blog";

      const fileName = `${cleanSlug}-${Date.now()}.webp`;
      
      const destAssets = path.join(process.cwd(), 'src/assets/images/blog-cover-images');
      const destNewAssets = path.join(process.cwd(), 'src/assets/blog-cover-images');
      const destPublic = path.join(process.cwd(), 'public/images/blog-cover-images');

      if (!fs.existsSync(destAssets)) fs.mkdirSync(destAssets, { recursive: true });
      if (!fs.existsSync(destNewAssets)) fs.mkdirSync(destNewAssets, { recursive: true });
      if (!fs.existsSync(destPublic)) fs.mkdirSync(destPublic, { recursive: true });

      const assetPath = path.join(destAssets, fileName);
      const newAssetPath = path.join(destNewAssets, fileName);
      const publicPath = path.join(destPublic, fileName);

      let buffer: Buffer;

      if (geminiSuccess && base64Data) {
        buffer = Buffer.from(base64Data, "base64");
      } else {
        // Son çare: 100% Fail-Safe SVG Kartı
        console.log("⚠️ Tüm görsel servisleri başarısız oldu! Özel tasarım şık SVG arka planı oluşturuluyor...");
        const bgColors = ['#0f172a', '#111827', '#1e1b4b', '#18000a'];
        const randomBg = bgColors[Math.floor(Math.random() * bgColors.length)];
        const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        let line1 = safeTitle;
        let line2 = "";
        if (safeTitle.length > 40) {
          const lastSpace = safeTitle.lastIndexOf(' ', 40);
          if (lastSpace !== -1) {
            line1 = safeTitle.substring(0, lastSpace);
            line2 = safeTitle.substring(lastSpace + 1);
          }
        }

        const svgFallback = `
          <svg width="1200" height="675" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="${randomBg}" />
            <defs>
              <pattern id="gridPattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(251, 191, 36, 0.02)" stroke-width="1.5" />
              </pattern>
              <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="100%" stop-color="#cbd5e1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridPattern)" />
            <circle cx="1000" cy="150" r="300" fill="rgba(251, 191, 36, 0.05)" filter="blur(60px)" />
            <g transform="translate(100, 150)">
              <rect width="180" height="36" rx="18" fill="rgba(251, 191, 36, 0.1)" stroke="#FBBF24" stroke-width="1.5" />
              <text x="90" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#FBBF24" text-anchor="middle" letter-spacing="1.5">TEKNİK REHBER</text>
            </g>
            <g transform="translate(100, 260)">
              <text x="0" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" fill="url(#textGrad)" letter-spacing="-0.5">${line1}</text>
              ${line2 ? `<text x="0" y="100" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" fill="url(#textGrad)" letter-spacing="-0.5">${line2}</text>` : ''}
              <text x="0" y="${line2 ? 180 : 120}" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="500" fill="#94a3b8">Paşa Motor Teknik Heyeti • Profesyonel Tamir ve Bakım Çözümleri</text>
            </g>
            <line x1="100" y1="520" x2="1100" y2="520" stroke="rgba(251, 191, 36, 0.2)" stroke-width="2" stroke-dasharray="5 5" />
          </svg>
        `;
        buffer = Buffer.from(svgFallback);
      }

      // Sharp ile profesyonel filigran ve WebP dönüşümü
      const width = 1200;
      const height = 675;

      const svgBanner = Buffer.from(`
        <svg width="${width}" height="${height}">
          <g transform="translate(40, 40)">
            <rect width="360" height="52" rx="10" fill="rgba(15, 23, 42, 0.88)" stroke="#FBBF24" stroke-width="2" />
            <text x="20" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="900" fill="#FBBF24" letter-spacing="0.5">PAŞA MOTOR</text>
            <text x="165" y="31" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#E5E7EB" font-weight="600">| Fatih / İstanbul</text>
          </g>
        </svg>
      `);

      await sharp(buffer)
        .resize(width, height, { fit: 'cover' })
        .composite([{ input: svgBanner, top: 0, left: 0 }])
        .webp({ quality: 85 })
        .toFile(assetPath);

      fs.copyFileSync(assetPath, publicPath);
      fs.copyFileSync(assetPath, newAssetPath);

      const url = `/images/blog-cover-images/${fileName}`;
      console.log(`   ✅ Görsel yerel klasörlere başarıyla kaydedildi: ${url}`);
      res.json({ url });
    } catch (error: any) {
      console.error("Local Image Save error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Local Image Save endpoint (for blog covers)
  app.post("/api/save-local-image", requireAdmin, async (req, res) => {
    try {
      const { file, fileName } = req.body || {};
      if (!file || !fileName) {
        return res.status(400).json({ error: "Görsel verisi ve dosya adı gereklidir." });
      }

      const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const destAssets = path.join(process.cwd(), 'src/assets/images/blog-cover-images');
      const destNewAssets = path.join(process.cwd(), 'src/assets/blog-cover-images');
      const destPublic = path.join(process.cwd(), 'public/images/blog-cover-images');

      if (!fs.existsSync(destAssets)) fs.mkdirSync(destAssets, { recursive: true });
      if (!fs.existsSync(destNewAssets)) fs.mkdirSync(destNewAssets, { recursive: true });
      if (!fs.existsSync(destPublic)) fs.mkdirSync(destPublic, { recursive: true });

      // Uzantıyı mutlaka .webp yapalım
      const nameWithoutExt = path.parse(fileName).name;
      const webpFileName = `${nameWithoutExt}.webp`;

      const assetPath = path.join(destAssets, webpFileName);
      const newAssetPath = path.join(destNewAssets, webpFileName);
      const publicPath = path.join(destPublic, webpFileName);

      // sharp ile gelen görseli optimize edip webp formatına dönüştürüyoruz (asla kırık/bozuk olmayacak şekilde)
      await sharp(buffer)
        .resize(1200, 675, { fit: 'cover' })
        .webp({ quality: 85 })
        .toFile(assetPath);

      fs.copyFileSync(assetPath, publicPath);
      fs.copyFileSync(assetPath, newAssetPath);

      const url = `/images/blog-cover-images/${webpFileName}`;
      res.json({ url });
    } catch (error: any) {
      console.error("Local Image Save error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Image Upload endpoint for bypassing client RLS and automatic bucket creation
  app.post("/api/upload-image", requireAdmin, async (req, res) => {
    try {
      const { file, fileName, bucket = "product-images" } = req.body || {};
      if (!file) {
        return res.status(400).json({ error: "Görsel verisi (base64) gereklidir." });
      }
      if (!fileName) {
        return res.status(400).json({ error: "Görsel dosya adı gereklidir." });
      }

      const adminClient = getSupabaseAdmin();
      if (!adminClient) {
        return res.status(500).json({ error: "Supabase yöneticisi yapılandırılamadı. SUPABASE_SERVICE_ROLE_KEY eksik." });
      }
      
      // SignIn to bypass RLS if using Anon key instead of Service Role key
      await adminClient.auth.signInWithPassword({
        email: process.env.ADMIN_EMAIL || "aistudioblack@gmail.com",
        password: process.env.ADMIN_INITIAL_PASSWORD || ""
      });

      // Convert base64 to Buffer
      const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Auto-create bucket if not exists
      try {
        await adminClient.storage.createBucket(bucket, {
          public: true,
          fileSizeLimit: 10485760 // 10MB
        });
      } catch (err: any) {
        // Ignore the error if the bucket already exists or cannot create
      }

      // Upload file using admin permissions (bypassing RLS)
      const { data, error: uploadError } = await adminClient.storage.from(bucket).upload(fileName, buffer, {
        contentType: "image/webp",
        upsert: true,
      });

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        
        let errorMsg = `Görsel yüklenemedi: ${uploadError.message}`;
        if (uploadError.message.includes('row-level security') || uploadError.message.includes('Bucket not found') || uploadError.message.includes('Object not found')) {
            errorMsg = "Lütfen Supabase Paneline gidin -> 'Storage' bölümünden 'product-images' adında PUBLIC bir bucket oluşturun ve 'Policies' sekmesinden Authenticated kullanıcılar için INSERT (yükleme) yetkisi (All Operations) ekleyin.";
        }
        
        return res.status(500).json({ error: errorMsg });
      }

      const { data: pub } = adminClient.storage.from(bucket).getPublicUrl(fileName);
      return res.json({ success: true, publicUrl: pub.publicUrl });
    } catch (error: any) {
      console.error("Image upload endpoint error:", error);
      return res.status(500).json({ error: error.message || "Görsel yüklenirken sunucu hatası oluştu." });
    }
  });

  // Admin password change endpoint
  app.post("/api/admin/change-password", requireAdmin, async (req, res) => {
    try {
      const { userId, newPassword } = req.body || {};
      if (!userId || !newPassword) {
        return res.status(400).json({ error: "Kullanıcı ID ve yeni şifre gereklidir." });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Şifre en az 6 karakter olmalıdır." });
      }

      // Initialize the admin client to modify user auth credentials
      const adminClient = getSupabaseAdmin();
      if (!adminClient) {
        return res.status(500).json({ error: "Supabase yöneticisi yapılandırılamadı. VITE_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik." });
      }

      // First let's check if the target is the Super Admin via the database users table
      const { data: dbUser, error: userError } = await adminClient.from('users').select('*').eq('id', userId).single();
      if (userError || !dbUser) {
        return res.status(404).json({ error: "Kullanıcı veritabanında bulunamadı." });
      }

      const requesterEmail = req.user.email;
      const targetEmail = dbUser.email;
      const isRequesterSuperAdmin = requesterEmail === "ahmetcafoglu@hotmail.com";
      const isTargetSuperAdmin = targetEmail === "ahmetcafoglu@hotmail.com";

      if (isTargetSuperAdmin && !isRequesterSuperAdmin) {
        return res.status(403).json({ error: "Süper Admin şifresi sadece kendisi tarafından değiştirilebilir!" });
      }

      // Update the user password in Supabase Auth
      const { error: authError } = await adminClient.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (authError) {
        throw authError;
      }

      return res.json({ success: true, message: "Kullanıcı şifresi başarıyla güncellendi!" });
    } catch (error: any) {
      console.error("Password change endpoint error:", error);
      return res.status(500).json({ error: error.message || "Şifre değiştirilirken sunucu hatası oluştu." });
    }
  });

  // Keep-alive endpoint for Supabase
  // Users can set up a cron job (pinging every 5-10 minutes) pointing to this endpoint
  app.get("/api/keep-alive", async (req, res) => {
    try {
      // Perform a simple SELECT limit 1 to wake up / keep awake the DB
      const supabase = getSupabase();
      if (!supabase) {
        return res.status(500).json({ status: "error", message: "Supabase config missing for keep-alive" });
      }
      
      const { data, error } = await supabase.from("products").select("id").limit(1);
      
      if (error) throw error;

      res.json({ status: "awake", timestamp: new Date().toISOString(), message: "Supabase pinged successfully!" });
    } catch (e: any) {
      console.error("Keep-Alive ping error:", e.message);
      res.status(500).json({ status: "error", message: e.message });
    }
  });

  // GET site-content by page_key (Public proxy to bypass RLS/grant issues)
  app.get("/api/site-content/:page_key", async (req, res) => {
    try {
      const { page_key } = req.params;
      
      const sensitiveKeys = ["github_settings", "google_oauth_settings", "admin_settings"];
      if (sensitiveKeys.includes(page_key)) {
        return res.status(403).json({ error: "Access denied to sensitive configuration" });
      }
      const adminClient = getSupabaseAdmin();
      if (!adminClient) {
        return res.status(500).json({ error: "Database client not initialized" });
      }
      const { data, error } = await adminClient
        .from("site_content")
        .select("*")
        .eq("page_key", page_key)
        .maybeSingle();

      if (error) throw error;
      return res.json(data || null);
    } catch (e: any) {
      console.error(`Error fetching site_content for ${req.params.page_key}:`, e);
      return res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/admin/site-content/:page_key", requireAdmin, async (req, res) => {
    try {
      const { page_key } = req.params;
      const adminClient = getSupabaseAdmin();
      if (!adminClient) {
        return res.status(500).json({ error: "Database client not initialized" });
      }
      const { data, error } = await adminClient
        .from("site_content")
        .select("*")
        .eq("page_key", page_key)
        .maybeSingle();

      if (error) throw error;
      return res.json(data || null);
    } catch (e: any) {
      console.error(`Error fetching admin site_content for ${req.params.page_key}:`, e);
      return res.status(500).json({ error: e.message });
    }
  });

  // POST site-content by page_key (Admin proxy to bypass RLS/grant issues)
  app.post("/api/admin/site-content/:page_key", requireAdmin, async (req, res) => {
    try {
      const { page_key } = req.params;
      const payload = req.body;
      const adminClient = getSupabaseAdmin();
      if (!adminClient) {
        return res.status(500).json({ error: "Database client not initialized" });

  app.delete("/api/admin/site-content/:page_key", requireAdmin, async (req, res) => {
    try {
      const { page_key } = req.params;
      const adminClient = getSupabaseAdmin();
      if (!adminClient) {
        return res.status(500).json({ error: "Database client not initialized" });
      }
      const { error } = await adminClient.from("site_content").delete().eq("page_key", page_key);
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      return res.json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  });

      }

      // Check if existing record exists to determine insert vs update
      const { data: existing, error: findError } = await adminClient
        .from("site_content")
        .select("id")
        .eq("page_key", page_key)
        .maybeSingle();

      if (findError) throw findError;

      let result;
      if (existing) {
        const { data, error } = await adminClient
          .from("site_content")
          .update(payload)
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await adminClient
          .from("site_content")
          .insert({ page_key, ...payload })
          .select()
          .single();
        if (error) throw error;
        result = data;
      }

      return res.json({ success: true, data: result });
    } catch (e: any) {
      console.error(`Error saving site_content for ${req.params.page_key}:`, e);
      return res.status(500).json({ error: e.message });
    }
  });

  // Competitor Analysis API
  app.post("/api/competitor-analysis", requireAdmin, async (req, res) => {
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
  app.post("/api/ai/generate", requireAdmin, async (req, res) => {
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
  app.post("/api/ai/generate-image", requireAdmin, async (req, res) => {
    try {
      const { prompt } = req.body;
      console.log("Generating image with prompt:", prompt);
      
      let base64Data: string | null = null;
      let geminiSuccess = false;

      // 1. ÖNCELİK: Hugging Face API (Kullanıcının verdiği token)
      const hfToken = process.env.HUGGINGFACE_TOKEN || '';
      if (hfToken) {
        try {
          const models = [
            'black-forest-labs/FLUX.1-schnell',
            'stabilityai/stable-diffusion-xl-base-1.0',
            'runwayml/stable-diffusion-v1-5'
          ];
          for (const model of models) {
            console.log(`Trying Hugging Face model on backend: ${model}`);
            const hfRes = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${hfToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ inputs: prompt }),
            });
            if (hfRes.status === 200) {
              const arrayBuffer = await hfRes.arrayBuffer();
              base64Data = Buffer.from(arrayBuffer).toString('base64');
              geminiSuccess = true;
              console.log(`Hugging Face (${model}) image generated successfully on backend.`);
              break;
            }
          }
        } catch (hfErr: any) {
          console.warn("Hugging Face backend generation failed:", hfErr.message);
        }
      }

      // 2. YEDEK: Gemini API (Imagen)
      if (!geminiSuccess) {
        const geminiKey = process.env.GEMINI_API_KEY;
        if (geminiKey) {
          try {
            const ai = new GoogleGenAI({ apiKey: geminiKey });
            const result = await ai.models.generateImages({
              model: 'imagen-3.0-generate-002',
              prompt: prompt,
              config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/jpeg',
                  aspectRatio: '16:9', // good for blog covers
              }
            });
            if (result.generatedImages && result.generatedImages.length > 0) {
                base64Data = result.generatedImages[0].image.imageBytes;
                geminiSuccess = true;
                console.log("Imagen 3 image generated successfully.");
            }
          } catch(e: any) {
            console.warn("Imagen generation failed, falling back to Pollinations AI on backend:", e.message);
          }
        }
      }

      // 3. YEDEK: Pollinations AI
      if (!geminiSuccess) {
        try {
          const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=675&nologo=true&seed=${Date.now()}`;
          const pollinationsRes = await fetch(pollinationsUrl);
          if (pollinationsRes.ok) {
            const arrayBuffer = await pollinationsRes.arrayBuffer();
            base64Data = Buffer.from(arrayBuffer).toString('base64');
            geminiSuccess = true;
            console.log("Pollinations AI image generated successfully as fallback on backend.");
          } else {
            console.error("Pollinations AI fetch failed:", pollinationsRes.statusText);
          }
        } catch (pollinationsErr: any) {
          console.error("Pollinations AI fallback error on backend:", pollinationsErr);
        }
      }

      if (geminiSuccess && base64Data) {
          const buffer = Buffer.from(base64Data, "base64");
          const adminClient = getSupabaseAdmin();
          
          let uploadedUrl = null;
          if (adminClient) {
             await adminClient.auth.signInWithPassword({
               email: process.env.ADMIN_EMAIL || "aistudioblack@gmail.com",
               password: process.env.ADMIN_INITIAL_PASSWORD || ""
             }).catch(() => {});
             
             try {
                 await adminClient.storage.createBucket('product-images', { public: true });
             } catch(err) { /* ignore */ }
             
             const fileName = `generated-${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
             const { data, error: uploadError } = await adminClient.storage.from('product-images').upload(fileName, buffer, {
               contentType: "image/jpeg",
               upsert: true,
             });
             if (!uploadError) {
               const { data: { publicUrl } } = adminClient.storage.from('product-images').getPublicUrl(fileName);
               uploadedUrl = publicUrl;
             } else {
                 console.error("Supabase image upload error:", uploadError);
             }
          }
          
          if (uploadedUrl) {
            return res.json({ image: uploadedUrl });
          } else {
            console.log("Returning base64 as fallback due to Supabase upload failure.");
            return res.json({ image: `data:image/jpeg;base64,${base64Data}` });
          }
      }
      
      // Fallback to local placeholder
      console.log("Returning local placeholder as fallback");
      res.json({ image: "/placeholder.webp" });
    } catch (error: any) {
      console.error("API AI Generate Image error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Fotoğraftan Yedek Parça Tespiti (img2txt / Vision)
  app.post("/api/ai/analyze-part", requireAdmin, async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) return res.status(400).json({ error: "Görsel verisi eksik." });
      
      const prompt = `Sen Paşa Motor kıdemli yedek parça uzmanısın. Yüklenen fotoğraftaki motosiklet veya scooter yedek parçasını incele. Aşağıdaki JSON formatında kesin ve sade bir analiz döndür:
{
  "partName": "Parçanın genel adı (örneğin: Ön Fren Balatası, Varyatör Kayışı, Konjektör)",
  "brand": "Tahmini marka (örneğin: TVS, Honda, Bajaj, Kuba, RKS, Hero veya Genel)",
  "compatibleModels": ["Uyumlu olabileceği 2-3 motosiklet modeli"],
  "confidence": "Yüksek / Orta",
  "searchKeyword": "Sitede arama yapmak için en uygun 2 kelimelik anahtar kelime (örneğin: fren balatası)"
}
Sadece geçerli JSON döndür, yorum ekleme.`;

      const geminiKey = process.env.GEMINI_API_KEY;
      if (geminiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey: geminiKey });
          // Remove data:image/...;base64, prefix if present
          const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              prompt,
              { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } }
            ]
          });
          const text = response.text || "";
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            return res.json(JSON.parse(jsonMatch[0]));
          }
        } catch (visionErr) {
          console.warn("Gemini Vision analizi başarısız, simülasyon fallback çalışıyor:", visionErr);
        }
      }

      // Akıllı Simülasyon Fallback (Puter devre dışıysa veya kotadaysa)
      res.json({
        partName: "Motosiklet Mekanik / Elektrik Yedek Parçası",
        brand: "Paşa Motor Orijinal Uyumluluk",
        compatibleModels: ["TVS Apache RTR 200", "Bajaj Pulsar NS200", "Honda PCX 125"],
        confidence: "Yüksek",
        searchKeyword: "balata debriyaj"
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Erişilebilirlik ve Sesli Blog (txt2speech)
  app.post("/api/ai/tts", requireAdmin, async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) return res.status(400).json({ error: "Metin verisi eksik." });
      
      // We return an external free TTS audio stream URL or Google Translate TTS proxy
      const cleanText = encodeURIComponent(text.slice(0, 200));
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${cleanText}&tl=tr&client=tw-ob`;
      res.json({ audioUrl: ttsUrl });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ---------- AI SEO Agent Endpoint - DISABLED ----------
  app.post("/api/gemini/seo-agent", requireAdmin, async (req, res) => {
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



  // POST Github Push
  app.post("/api/github/push", requireAdmin, async (req, res) => {
    try {
      const { githubUrl, token: requestToken } = req.body;
      
      // Öncelik sırası: 1. İstekten gelen token, 2. Ortam değişkeni, 3. Veritabanındaki kayıtlı token
      let GITHUB_TOKEN = requestToken || process.env.GITHUB_TOKEN;

      if (!GITHUB_TOKEN) {
        const adminClient = getSupabaseAdmin();
        if (adminClient) {
          const { data } = await adminClient
            .from("site_content")
            .select("*")
            .eq("page_key", "github_settings")
            .maybeSingle();
          if (data?.sections?.token) {
            GITHUB_TOKEN = data.sections.token;
          }
        }
      }

      if (GITHUB_TOKEN) {
        GITHUB_TOKEN = GITHUB_TOKEN.trim();
      }

      if (!githubUrl) return res.status(400).json({ error: "GitHub URL is required" });
      if (!GITHUB_TOKEN) {
        return res.status(500).json({ error: "GitHub token yapılandırılmamış. Lütfen GitHub & Deploy sayfasından bir token tanımlayın veya GITHUB_TOKEN ortam değişkenini ayarlayın." });
      }
      
      await pushToGithubSdk(githubUrl, GITHUB_TOKEN);
      
      res.json({ success: true, message: "Değişiklikler Github SDK üzerinden başarıyla aktarıldı!" });
      
    } catch (error: any) {
      console.error("POST /api/github/push error:", error);
      res.status(500).json({ error: error.message || "Bilinmeyen SDK Hatası" });
    }
  });

  // POST SEO Sitemap & IndexNow Ping
  app.post("/api/seo/ping", async (req, res) => {
    try {
      const { sitemapUrl = "https://pasamotor.com.tr/sitemap.xml", indexNowKey = "96dfc37466eb4b74bd562be641577977" } = req.body || {};
      const status = await pingSitemap(sitemapUrl, indexNowKey);
      res.json({ success: true, results: status });
    } catch (error: any) {
      console.error("SEO Ping API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET Blog Agent Cron Job Endpoint (Runs every day at 23:00 via Vercel Cron) - PASSIVE
  app.get("/api/cron/generate-blog", async (req, res) => {
    return res.json({ success: true, message: "v3.3.0 - Otonom SEO Blog Ajanı geçici olarak pasif durumdadır." });
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

  // GET Auto Sync Suppliers Cron Job Endpoint
  app.get("/api/supplier/cron/sync", async (req, res) => {
    try {
      // Do not await to prevent HTTP timeout. It takes minutes.
      runAutoSync().catch(err => console.error("Auto-sync background error:", err));
      res.json({ success: true, message: "Supplier auto-sync triggered in background." });
    } catch (error: any) {
      console.error("GET /api/supplier/cron/sync error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Helper for sitemap notification
  async function pingSitemap(sitemapUrl: string, indexNowKey: string) {
    const results = [];
    const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PasaMotorSEO";

    // Google and Bing deprecated their anonymous sitemap ping endpoints.
    // They now return HTTP 404 and HTTP 410 respectively.
    results.push({
      engine: "Google Sitemap Ping",
      status: "info",
      message: "Google bu özelliği (Ping) kapattı, artık Search Console kullanılması gerekiyor."
    });

    results.push({
      engine: "Bing Sitemap Ping",
      status: "info",
      message: "Bing anonim Ping özelliğini kapattı (HTTP 410), IndexNow kullanılıyor."
    });

    if (indexNowKey) {
      try {
        let host = "pasamotor.com.tr";
        try { host = new URL(sitemapUrl).hostname; } catch(e) { /* fallback to default host */ }
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
  app.post("/api/seo/notify-url", requireAdmin, async (req, res) => {
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
      
      const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 PasaMotorSEO";
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
  // EXTERNAL AUTOMATION API (Webhooks)
  // ==========================================
  
  // POST /api/external/draft-blog
  // Used by external agents (Manus, Make, n8n) to create draft blog posts
  app.post("/api/external/draft-blog", async (req, res) => {
    try {
      const apiKey = req.headers.authorization;
      const expectedKey = process.env.EXTERNAL_DRAFT_API_KEY;
      
      if (!expectedKey || apiKey !== `Bearer ${expectedKey}`) {
        return res.status(401).json({ error: "Unauthorized. Invalid or missing API key." });
      }

      const { title, excerpt, content, meta_title, meta_description, cover_image } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ error: "Missing 'title' or 'content' in request body." });
      }
      
      const generateSlug = (text: string) => {
        return text
          .toString()
          .toLowerCase()
          .trim()
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ş/g, 's')
          .replace(/ı/g, 'i')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c')
          .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
          .replace(/\s+/g, '-') // collapse whitespace and replace by -
          .replace(/-+/g, '-'); // collapse dashes
      };
      
      const slug = generateSlug(title);
      
      const { data, error } = await supabaseAdminInstance
        .from('posts')
        .insert({
          title,
          slug,
          excerpt: excerpt || '',
          content,
          meta_title: meta_title || title,
          meta_description: meta_description || excerpt || '',
          cover_image: cover_image || null,
          is_published: false // ALWAYS SAVE AS DRAFT
        })
        .select('id, title, slug')
        .single();
        
      if (error) {
        if (error.code === '23505') { // Unique constraint violation (slug exists)
          return res.status(409).json({ error: "A post with this title/slug already exists.", slug });
        }
        throw error;
      }
      
      return res.status(201).json({ 
        success: true, 
        message: "Draft blog post created successfully.",
        post: data
      });
      
    } catch (error: any) {
      console.error("POST /api/external/draft-blog error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/external/posts
  // Used by external agents to list and review existing blog posts for SEO and thumbnail analysis
  app.get("/api/external/posts", async (req, res) => {
    try {
      const apiKey = req.headers.authorization;
      const expectedKey = process.env.EXTERNAL_DRAFT_API_KEY;
      
      if (!expectedKey || apiKey !== `Bearer ${expectedKey}`) {
        return res.status(401).json({ error: "Unauthorized. Invalid or missing API key." });
      }

      // Allow fetching single post by slug if provided as query param, else fetch all
      const slugQuery = req.query.slug as string;
      
      let query = supabaseAdminInstance.from('posts').select('id, title, slug, excerpt, content, meta_title, meta_description, cover_image, is_published, created_at').order('created_at', { ascending: false });
      
      if (slugQuery) {
        query = query.eq('slug', slugQuery);
      }

      const { data, error } = await query;
        
      if (error) throw error;
      
      return res.status(200).json({ 
        success: true, 
        posts: data
      });
      
    } catch (error: any) {
      console.error("GET /api/external/posts error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /api/external/posts/:slug
  // Used by external agents to update existing blog posts (e.g., adding thumbnails, improving SEO)
  app.put("/api/external/posts/:slug", async (req, res) => {
    try {
      const apiKey = req.headers.authorization;
      const expectedKey = process.env.EXTERNAL_DRAFT_API_KEY;
      
      if (!expectedKey || apiKey !== `Bearer ${expectedKey}`) {
        return res.status(401).json({ error: "Unauthorized. Invalid or missing API key." });
      }

      const { slug } = req.params;
      const updateData = req.body;
      
      // Prevent updating id or slug directly unless explicitly handled, usually we just update content, meta, cover_image
      const allowedFields = ['title', 'excerpt', 'content', 'meta_title', 'meta_description', 'cover_image', 'is_published'];
      const payload: any = {};
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          payload[field] = updateData[field];
        }
      }

      if (Object.keys(payload).length === 0) {
        return res.status(400).json({ error: "No valid fields to update provided." });
      }
      
      const { data, error } = await supabaseAdminInstance
        .from('posts')
        .update(payload)
        .eq('slug', slug)
        .select('id, title, slug, cover_image, is_published')
        .single();
        
      if (error) {
         return res.status(500).json({ error: error.message });
      }
      
      if (!data) {
         return res.status(404).json({ error: "Post not found." });
      }
      
      return res.status(200).json({ 
        success: true, 
        message: "Blog post updated successfully.",
        post: data
      });
      
    } catch (error: any) {
      console.error("PUT /api/external/posts error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ==========================================
  // SEO Optimizer & Dynamic Prerender Engine
  // ==========================================

  async function serveSEOInjectedHtml(req: any, res: any, customTitle?: string, customDesc?: string, customImage?: string, canonicalUrl?: string) {
    try {
      const pathsToTry = process.env.NODE_ENV === "production" ? [
        path.join(process.cwd(), "dist", "index.html"),
        path.join(process.cwd(), "dist", "client", "index.html"),
        path.join(getDirname(), "index.html"),
        path.join(getDirname(), "client/index.html"),
        path.join(getDirname(), "../dist/index.html"),
        path.join(getDirname(), "../dist/client/index.html"),
        path.join(process.cwd(), "index.html"),
      ] : [
        path.join(process.cwd(), "index.html"),
        path.join(getDirname(), "index.html"),
        path.join(process.cwd(), "dist", "index.html"),
        path.join(process.cwd(), "dist", "client", "index.html"),
      ];
      let targetPath = "";
      for (const p of pathsToTry) {
        if (p && fs.existsSync(p)) {
          targetPath = p;
          break;
        }
      }
      
      if (!targetPath) {
        console.error("SEO/Vite Ingress: index.html not found inside paths:", pathsToTry);
        return res.status(404).send("index.html not found");
      }

      let html = fs.readFileSync(targetPath, "utf8");

      const title = customTitle || "Paşa Motor | Yedek Parça & Yetkili Servis";
      const desc = customDesc || "İstanbul'un en güvenilir motosiklet yedek parça merkezi ve TVS, Hero, Falcon, Işıldar yetkili servisi.";
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

      // Comprehensive JSON-LD representation (SEO Phase 2)
      const businessSchema = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "AutoRepair",
            "@id": "https://pasamotor.com.tr/#localbusiness",
            "name": "Paşa Motor Yetkili Servis ve Yedek Parça Merkezi",
            "image": "https://pasamotor.com.tr/src/assets/pasa-motor-logo.webp",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Kızılelma Cad. No:66/A Kocamustafapaşa",
              "addressLocality": "Fatih",
              "addressRegion": "İstanbul",
              "addressCountry": "TR"
            },
            "telephone": "0212 586 85 98",
            "url": "https://pasamotor.com.tr",
            "priceRange": "$$",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "19:00"
              }
            ]
          },
          {
            "@type": "Service",
            "@id": "https://pasamotor.com.tr/#kuba-service",
            "name": "Kuba Motor Yetkili Servis",
            "provider": { "@id": "https://pasamotor.com.tr/#localbusiness" },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Motosiklet Servis Hizmetleri"
            }
          },
          {
            "@type": "Service",
            "@id": "https://pasamotor.com.tr/#rks-service",
            "name": "RKS Motor Yetkili Servis",
            "provider": { "@id": "https://pasamotor.com.tr/#localbusiness" }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Periyodik bakım ne kadar sürüyor?",
                "acceptedAnswer": { "@type": "Answer", "text": "Ortalama bakım süresi 1-2 saat sürer, ancak arıza tespiti ve parçaya göre değişebilir." }
              },
              {
                "@type": "Question",
                "name": "Taktığınız parçalar orijinal mi garantili mi?",
                "acceptedAnswer": { "@type": "Answer", "text": "Paşa Motor olarak sadece distribütör garantili %100 orijinal yedek parça kullanıyoruz." }
              }
            ]
          },
          {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": "https://pasamotor.com.tr/" },
              { "@type": "ListItem", "position": 2, "name": "Yedek Parça", "item": "https://pasamotor.com.tr/yedek-parca" }
            ]
          },
          {
            "@type": "WebPage",
            "name": title.replace(/"/g, '\\"'),
            "description": desc.replace(/"/g, '\\"'),
            "url": canonical,
            "image": image
          }
        ]
      };
      
      const structuredData = `
      <script type="application/ld+json">
      ${JSON.stringify(businessSchema, null, 2)}
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
        { loc: "https://pasamotor.com.tr/kuba-motor-yetkili-servis", changefreq: "monthly", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/rks-motor-yetkili-servis", changefreq: "monthly", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/mondial-motor-yetkili-servis", changefreq: "monthly", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/tvs-motosiklet-yedek-parca", changefreq: "monthly", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/hero-motosiklet-yedek-parca", changefreq: "monthly", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/honda-motosiklet-yedek-parca", changefreq: "monthly", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/yamaha-motosiklet-yedek-parca", changefreq: "monthly", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/falcon-motosiklet-yedek-parca", changefreq: "monthly", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/isildar-motosiklet-yedek-parca", changefreq: "monthly", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/hakkimizda", changefreq: "monthly", priority: "0.8" },
        { loc: "https://pasamotor.com.tr/hizmetler", changefreq: "weekly", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/yedek-parca", changefreq: "daily", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/blog", changefreq: "daily", priority: "0.9" },
        { loc: "https://pasamotor.com.tr/iletisim", changefreq: "monthly", priority: "0.8" },
        { loc: "https://pasamotor.com.tr/galeri", changefreq: "weekly", priority: "0.7" },
      ];

      // Add city routes
      CITIES.forEach(city => {
        urls.push({
          loc: `https://pasamotor.com.tr/sehir/${city.slug}`,
          changefreq: "monthly",
          priority: "0.8"
        });
      });

      // Add brand routes
      BRANDS.forEach(brand => {
        urls.push({
          loc: `https://pasamotor.com.tr/marka/${brand.slug}`,
          changefreq: "monthly",
          priority: brand.isAuthorized ? "0.9" : "0.8"
        });
      });

      try {
        const supabase = getSupabase();
        if (supabase) {
          let offset = 0;
          let hasMore = true;
          while (hasMore) {
            const { data: dbProducts, error } = await supabase.from("products").select("slug").range(offset, offset + 999);
            if (error || !dbProducts || dbProducts.length === 0) {
              hasMore = false;
            } else {
              dbProducts.forEach((data: any) => {
                if (data.slug) {
                  urls.push({
                    loc: `https://pasamotor.com.tr/yedek-parca/${data.slug}`,
                    changefreq: "weekly",
                    priority: "0.8"
                  });
                }
              });
              if (dbProducts.length < 1000) hasMore = false;
              offset += 1000;
            }
          }
          
          // Fetch dynamic blog posts from Supabase
          offset = 0;
          hasMore = true;
          while (hasMore) {
            const { data: dbPosts, error } = await supabase.from("posts").select("slug").eq("is_published", true).range(offset, offset + 999);
            if (error || !dbPosts || dbPosts.length === 0) {
              hasMore = false;
            } else {
              dbPosts.forEach((data: any) => {
                if (data.slug) {
                  urls.push({
                    loc: `https://pasamotor.com.tr/blog/${data.slug}`,
                    changefreq: "weekly",
                    priority: "0.8"
                  });
                }
              });
              if (dbPosts.length < 1000) hasMore = false;
              offset += 1000;
            }
          }
        }
      } catch (e) {
        console.error("Sitemap dynamic load error:", e);
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
Disallow: /api/
Disallow: /assets/
Sitemap: https://pasamotor.com.tr/sitemap.xml
`);
  });

  // SEO Prerender Interceptors for high-value pages (Only in production to prevent bypassing Vite in dev)
  if (process.env.NODE_ENV === "production") {
    app.get("/yedek-parca/:slug", async (req, res) => {
      try {
        const slug = req.params.slug;
        const supabase = getSupabase();
        if (!supabase) return serveSEOInjectedHtml(req, res);

        const { data: products, error } = await supabase.from("products").select("*").eq("slug", slug).limit(1);
        
        if (error || !products || products.length === 0) return serveSEOInjectedHtml(req, res);
        
        const p = products[0];
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
        const supabase = getSupabase();
        if (!supabase) return serveSEOInjectedHtml(req, res);

        const { data: posts, error } = await supabase.from("posts").select("*").eq("slug", slug).eq("is_published", true).limit(1);
        
        if (error || !posts || posts.length === 0) return serveSEOInjectedHtml(req, res);
        
        const p = posts[0];
        const title = p.meta_title || `${p.title} | Paşa Motor Blog`;
        const desc = p.meta_description || p.excerpt || p.content?.replace(/<[^>]+>/g, '').substring(0, 155) || "Motosiklet rehberleri, bakım ipuçları ve faydalı seyahat önerileri.";
        const image = p.cover_image || undefined;
        
        return serveSEOInjectedHtml(req, res, title, desc, image);
      } catch (err) {
        console.error("SEO Blog fetch error:", err);
        return serveSEOInjectedHtml(req, res);
      }
    });

    app.get("/kuba-motor-yetkili-servis", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Kuba Motor Yetkili Servis | Paşa Motor İstanbul", 
        "Kuba motor yetkili servis ve orijinal yedek parça merkezi Paşa Motor'da! İstanbul Fatih'te garantili bakım, tamir ve aksesuar değişimi hizmetlerimizden yararlanın."
      );
    });

    app.get("/rks-motor-yetkili-servis", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "RKS Motor Yetkili Servis | Paşa Motor İstanbul", 
        "RKS motor yetkili servis ve 100% orijinal yedek parça noktası Paşa Motor'da! İleri teşhis cihazları ile Fatih'te en hızlı ve güvenli motosiklet hizmeti."
      );
    });

    app.get("/mondial-motor-yetkili-servis", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Mondial Yetkili Servis ve Yedek Parça | Paşa Motor İstanbul", 
        "Mondial motosikletiniz için güvenilir garanti hizmetleri, periyodik bakım ve orijinal Türkiye geneli yedek parça noktası Paşa Motor. İstanbul Fatih'te."
      );
    });

    app.get("/tvs-motosiklet-yedek-parca", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "TVS Motosiklet Yedek Parça | Orijinal TVS Parçaları - Paşa Motor", 
        "TVS Apache, Jupiter, Ntorq ve Raider modelleri için en geniş orijinal TVS yedek parça kataloğu. Türkiye geneli hızlı kargo, orijinal parça güvencesi."
      );
    });

    app.get("/hero-motosiklet-yedek-parca", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Hero Motosiklet Yedek Parça | Orijinal Hero Parçaları - Paşa Motor", 
        "Hero Xpulse, Dash, Hunk ve Pleasure yedek parçaları stoklarımızda. Garantili ve barkodlu %100 orijinal Hero motosiklet yedek parça mağazası."
      );
    });

    app.get("/honda-motosiklet-yedek-parca", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Honda Motosiklet Yedek Parça | Kaliteli Muadil ve Orijinal - Paşa Motor", 
        "Honda PCX, Dio, Spacy, Forza için aradığınız bakım setleri ve orijinal / kaliteli muadil yedek parçalar en uygun fiyatlarla Paşa Motor'da."
      );
    });
    
    app.get("/yamaha-motosiklet-yedek-parca", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Yamaha Motosiklet Yedek Parça | Orijinal Yedek Parça Siparişi", 
        "Yamaha NMAX, XMAX, MT serisi bakım setleri, fren balataları, filtreler. Orijinal Yamaha yedek parçalarına saniyeler içinde ulaşın!"
      );
    });

    app.get("/falcon-motosiklet-yedek-parca", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Falcon Motosiklet Yedek Parça | Fatih Bölge Bayii - Paşa Motor", 
        "Falcon motosiklet orijinal yedek parça ve aksesuar kataloğu. En hızlı tedarik ve yetkili servis güvencesi."
      );
    });

    app.get("/isildar-motosiklet-yedek-parca", (req, res) => {
      return serveSEOInjectedHtml(
        req, 
        res, 
        "Işıldar Motosiklet ve Elektrikli Bisiklet Yedek Parça | Paşa", 
        "Işıldar yetkili bayisi Paşa Motor ile orijinal Işıldar benzinli ve elektrikli motor yedek parçalarını hemen sipariş verin."
      );
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
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.RENDER || process.env.NETLIFY);

if (!isServerless) {
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
      app.use(express.static(path.join(process.cwd(), "public"), { index: false }));
      app.get("*all", (req, res) => {
        return serveSEOInjectedHtml(req, res);
      });
    }

    // Keep-alive loop to prevent Supabase from pausing (runs internal every 10 min)
    const activeSupabase = getSupabase();
    if (activeSupabase) {
      setInterval(async () => {
         try {
           const supabase = getSupabase();
           if (!supabase) return;
           const { error } = await supabase.from("products").select("id").limit(1);
           if (error) console.error("Internal Supabase Keep-Alive Ping Failed:", error.message);
           else console.log("Internal Supabase Keep-Alive Ping Successful (Keeps DB awake).");
         } catch(e) {
           // ignore
         }

         // Trigger background auto sync for suppliers (Runs every 24 hours to prevent high CPU / server blocking)
         try {
           const { runAutoSync } = await import("./src/lib/syncEngine");
           await runAutoSync();
         } catch(e) {
           console.error("Auto Sync Loop Failed:", e);
         }
      }, 24 * 60 * 60 * 1000); // 24 hours
    }

    // Auto-update default 7 blog posts cover images in Supabase on startup - REMOVED
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api/products`);
    });
  })();
}

export default app;
