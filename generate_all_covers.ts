import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini Client
const geminiKey = process.env.GEMINI_API_KEY;
if (!geminiKey) {
  console.error("❌ HATA: GEMINI_API_KEY bulunamadı! Lütfen Settings > Secrets panelinden ekleyin.");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: geminiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Output Directory
const OUTPUT_DIR = './public/images/blog-cover-images';
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Generate an English prompt for image generation based on Turkish blog title
async function generateImagePrompt(title: string): Promise<string> {
  const systemPrompt = `You are an expert prompt engineer for ultra-realistic image generation models. 
Your task is to create a highly detailed, professional, and photorealistic English prompt for an image that will be used as a blog post cover.
The blog post title is: "${title}".

Requirements for the image prompt you write:
1. Style: Ultra-realistic, photorealistic, professional DSLR camera shot, cinematic lighting, shallow depth of field, sharp focus on mechanical details. No cartoonish or artistic illustration styles.
2. Subject: Focus closely on the mechanical components or action mentioned in the title (such as motorcycle chains, CVT varyators, carburetors, brake pads, coolant fluid, radiators, sparks, battery, etc.).
3. Environment: Set inside a clean, modern, premium motorcycle repair workshop in Istanbul.
4. Branding: Include a natural and subtle "Paşa Motor" branding. For example:
   - "Paşa Motor" embroidered in clean, elegant white letters on the front chest pocket of a professional mechanic's dark work jacket, overalls, or unbranded clothing.
   - Or "Paşa Motor" printed on a clean metal toolbox or modern neon/LED wall sign in the background.
5. Text restrictions: ABSOLUTELY NO other words, letters, gibberish, or text overlays should be present in the image to prevent spelling errors and AI text issues. Only the branding "Paşa Motor".
6. Format: Output ONLY the final English prompt string, without any quotes, introductions, or markdown.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: systemPrompt,
    });
    
    const generated = response.text?.trim();
    if (generated) {
      return generated;
    }
  } catch (error) {
    console.warn(`⚠️ Prompt üretilirken Gemini 3.5 Flash hatası: ${error.message}. Varsayılan prompt kullanılacak.`);
  }

  // Fallback prompt template if Gemini 3.5 Flash text fails
  return `An ultra-realistic, highly detailed photograph of motorcycle repair focusing on mechanical components, professional mechanic working in a clean premium workshop with a subtle "Paşa Motor" branding embroidered on their uniform chest, cinematic lighting, 4k resolution.`;
}

// Main logic
async function run() {
  console.log("🚀 Görsel üretme işlemi başlatılıyor...");
  
  try {
    // 1. Fetch posts with missing or empty cover images
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, slug, cover_image');

    if (fetchError) {
      throw fetchError;
    }

    if (!posts || posts.length === 0) {
      console.log("ℹ️ Üretilecek blog postu bulunamadı.");
      return;
    }

    console.log(`📋 Toplam ${posts.length} adet blog yazısı incelenecek.`);

    // 2. Loop and generate
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      console.log(`\n==================================================`);
      console.log(`⏳ [${i + 1}/${posts.length}] Blog: "${post.title}"`);
      
      const fileName = `${post.slug}-kapak.webp`;
      const localPath = path.join(OUTPUT_DIR, fileName);
      const dbPath = `/images/blog-cover-images/${fileName}`;

      // 3. Generate prompt using gemini-3.5-flash
      console.log("📝 Görsel promptu oluşturuluyor...");
      const imagePrompt = await generateImagePrompt(post.title);
      console.log(`🔍 Oluşturulan Prompt: "${imagePrompt}"`);

      // 4. Generate image using gemini-3.1-flash-image
      console.log("🎨 Görsel üretiliyor (gemini-3.1-flash-image)...");
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-image',
          contents: {
            parts: [{ text: imagePrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
              imageSize: "1K"
            },
          },
        });

        let imageBuffer: Buffer | null = null;
        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              imageBuffer = Buffer.from(part.inlineData.data, 'base64');
              break;
            }
          }
        }

        if (!imageBuffer) {
          throw new Error("Gemini yanıtında görsel verisi bulunamadı.");
        }

        // 5. Convert to WebP using sharp and save
        console.log("💾 Görsel WebP formatına dönüştürülüyor ve kaydediliyor...");
        await sharp(imageBuffer)
          .webp({ quality: 85 })
          .toFile(localPath);

        console.log(`✅ Görsel başarıyla kaydedildi: ${localPath}`);

        // 6. Update database
        const { error: updateError } = await supabase
          .from('posts')
          .update({ cover_image: dbPath })
          .eq('id', post.id);

        if (updateError) {
          console.error(`❌ Veritabanı güncelleme hatası:`, updateError.message);
        } else {
          console.log(`🎉 Veritabanı güncellendi! cover_image = ${dbPath}`);
        }

      } catch (genError) {
        console.error(`❌ Görsel üretimi BAŞARISIZ:`, genError.message || genError);
        console.log("⏭️ Bir sonraki blog yazısına geçiliyor...");
      }

      // Wait 5 seconds to avoid rate limits as requested by the user
      if (i < posts.length - 1) {
        console.log("⏳ Rate limit engellemek için 5 saniye bekleniyor...");
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    console.log(`\n✅ Tüm blog kapak görselleri işleme alındı!`);
  } catch (err) {
    console.error("❌ Ana işlem hatası:", err.message || err);
  }
}

run();
