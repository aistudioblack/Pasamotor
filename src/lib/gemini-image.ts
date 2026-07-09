import { dbClient } from './db-client';

// Blog başlığından görsel prompt üret
function buildImagePrompt(title: string, content?: string): string {
  // If content is provided and it looks like a custom prompt (e.g. from AdminBlogAgent), use it directly
  if (content && content.length > 20) {
    return content;
  }

  let englishDesc = "a male professional motorcycle mechanic working with tools on a scooter engine in a tidy modern workshop";
  const t = title.toLowerCase();
  
  if (t.includes("elektrik") || t.includes("marş") || t.includes("kablo") || t.includes("akü") || t.includes("ateşleme") || t.includes("buji")) {
    englishDesc = "a male motorcycle mechanic checking electrical wires, spark plug, and battery on a disassembled delivery scooter with a digital multimeter, tools scattered on a workbench, background filled with parts";
  } else if (t.includes("yağ") || t.includes("şişme") || t.includes("trafiğinde") || t.includes("bakım") || t.includes("filtre")) {
    englishDesc = "a close-up shot of a mechanic's gloved hands pouring fresh Motul engine oil into a blue Yamaha NMax 155 scooter on a lift, using a black funnel, showing the detailed engine block and oil cans in a professional service";
  } else if (t.includes("fren") || t.includes("disk") || t.includes("balata") || t.includes("kaliper")) {
    englishDesc = "a highly detailed close-up shot of a mechanic's hands in black nitrile gloves changing metallic brake pads and checking the brake disc caliper of a motorcycle";
  } else if (t.includes("varyatör") || t.includes("kayış") || t.includes("titreşim") || t.includes("debriyaj") || t.includes("baga") || t.includes("scooter")) {
    englishDesc = "a close-up shot of a scooter CVT transmission system, rubber belt, clutch bell, and variator rollers being serviced by a mechanic wearing red-and-black work gloves, with a blue scooter on a lift in the background";
  } else if (t.includes("şasi") || t.includes("amortisör") || t.includes("keçe") || t.includes("suspansiyon") || t.includes("süspansiyon")) {
    englishDesc = "a professional mechanic replacing front suspension fork seals, showing high-quality chrome and silver front fork cylinders, wearing black nitrile gloves, working with precision tools";
  } else if (t.includes("karbüratör") || t.includes("rölanti") || t.includes("hava")) {
    englishDesc = "a close up of a mechanic cleaning and adjusting a motorcycle carburetor with a screwdriver in a bright workshop, with engine parts and metal tools nearby";
  } else if (t.includes("zincir") || t.includes("dişli") || t.includes("pulsar") || t.includes("ns200") || t.includes("bajaj")) {
    englishDesc = "a professional male mechanic working on a blue Bajaj Pulsar NS200 motorcycle on a rear stand, focusing on the rear wheel, chain, and steel sprocket, wearing black nitrile gloves, using a metal wrench";
  } else if (t.includes("soğutma") || t.includes("radyatör") || t.includes("hararet") || t.includes("antifriz")) {
    englishDesc = "a mechanic servicing liquid cooling system, radiator, hoses, and coolant reservoir on a modern motorcycle in a repair shop";
  } else if (t.includes("honda") || t.includes("yamaha") || t.includes("tvs") || t.includes("suzuki") || t.includes("hero")) {
    englishDesc = "a professional mechanic performing maintenance on a modern sport motorcycle on a hydraulic lift, adjusting mechanical parts with a professional wrench";
  }

  return `A highly detailed, professional photorealistic close-up shot of ${englishDesc}. Set inside a professional, clean motorcycle repair shop garage. Background shows tire racks with tires, red metal tool chests, and tools neatly organized on a brick wall. Cinematic warm lighting, raw industrial workshop atmosphere, shallow depth of field. Crucially, the mechanic is wearing plain black unbranded work clothes with black nitrile gloves. On the wall or cabinet in the background, there is a clean professional sign that clearly reads exactly "PAŞA MOTOR" (often as a glowing cyan and orange neon sign on a brick wall or a white sticker on a red tool chest). NO other text or gibberish. Premium quality, 8k resolution, authentic DSLR photograph.`;
}

async function generateHFClientImage(prompt: string, token: string): Promise<{ data: string; mimeType: string } | null> {
  const models = [
    'black-forest-labs/FLUX.1-schnell',
    'stabilityai/stable-diffusion-xl-base-1.0',
    'runwayml/stable-diffusion-v1-5'
  ];

  for (const model of models) {
    try {
      console.log(`🤖 Hugging Face client-side modelı deneniyor: ${model}`);
      const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (response.status === 200) {
        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        console.log(`   ✅ Hugging Face (${model}) ile görsel başarıyla üretildi!`);
        return { data: btoa(binary), mimeType: 'image/jpeg' };
      }

      const text = await response.text();
      console.warn(`   ⚠️ Hugging Face client-side (${model}) hatası (${response.status}):`, text.slice(0, 100));
    } catch (err: any) {
      console.error(`   ❌ Hugging Face (${model}) fetch hatası:`, err.message);
    }
  }
  return null;
}

export async function generateBlogImage(
  title: string,
  postId: string,
  content?: string
): Promise<{ url: string | null; error: string | null }> {
  try {
    const imagePrompt = buildImagePrompt(title, content);

    console.log(`Görsel üretiliyor (Sunucu Tarafı): "${title}"`);
    console.log(`Prompt: ${imagePrompt}`);

    // Oturum tokenını al
    const { data: { session } } = await dbClient.auth.getSession();
    const token = session?.access_token;

    // 1. ÖNCELİK: Sunucu tarafında resmi üretip kaydetmesini iste (WAF 403 hatasını önlemek için en güvenli yol)
    try {
      console.log("🔄 Sunucu tabanlı görsel üretim uç noktası çağrılıyor...");
      const response = await fetch('/api/generate-save-blog-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          prompt: imagePrompt
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Sunucu tarafında görsel başarıyla üretildi ve kaydedildi: ${result.url}`);
        return { url: result.url, error: null };
      } else {
        const errorText = await response.text();
        console.warn('   ⚠️ Sunucu tabanlı görsel üretimi başarısız oldu, istemci yedek kanalına geçiliyor:', errorText);
      }
    } catch (apiErr: any) {
      console.warn('   ⚠️ Sunucu API isteğinde hata oluştu, istemci yedek kanalına geçiliyor:', apiErr.message);
    }

    // 2. YEDEK: İstemci Tarafında Pollinations AI ile üret ve Supabase Storage Bucket'a yükle
    console.log("🔄 İstemci yedek kanalı: Pollinations AI ile görsel üretiliyor...");
    let base64Data = '';
    const mimeType = 'image/jpeg';
    
    try {
      const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1200&height=675&nologo=true&seed=${Date.now()}`;
      const pollinationsRes = await fetch(pollinationsUrl);
      if (!pollinationsRes.ok) {
        throw new Error(`Pollinations AI HTTP hata kodu: ${pollinationsRes.status}`);
      }
      const arrayBuffer = await pollinationsRes.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      base64Data = btoa(binary);
      console.log("   ✅ Pollinations AI ile istemci tarafında üretildi.");
    } catch (pollinationsErr: any) {
      console.error("   ❌ Pollinations AI görsel üretimi de başarısız oldu:", pollinationsErr);
      return { url: null, error: 'Tüm görsel üretim motorları başarısız oldu.' };
    }

    const cleanSlug = title.toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 35) || "blog";

    const fileName = `${cleanSlug}-${Date.now()}.webp`;

    // Base64'ten Blob'a çevir ve Supabase Storage bucket'a yükle
    const byteCharacters = atob(base64Data);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: mimeType });

    const fallbackFileName = `images/blogimg/${fileName}`;
    const { error: uploadError } = await dbClient.storage
      .from('assets')
      .upload(fallbackFileName, blob, { contentType: mimeType, upsert: true });

    if (uploadError) {
      return { url: null, error: uploadError.message || 'Storage yükleme başarısız' };
    }

    const { data } = dbClient.storage
      .from('assets')
      .getPublicUrl(fallbackFileName);

    if (!data?.publicUrl) {
       return { url: null, error: 'Public URL alınamadı' };
    }

    console.log(`✅ Görsel Supabase deposuna yüklendi: ${data.publicUrl}`);
    return { url: data.publicUrl, error: null };

  } catch (err: any) {
    console.error('Görsel üretme hatası:', err);
    return { url: null, error: err.message || 'Görsel üretilemedi' };
  }
}
