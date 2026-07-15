import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

async function run() {
  console.log("🧹 Blog içerikleri temizleniyor (Yapay Zeka izleri temizleniyor)...");
  try {
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, content');

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Toplam ${posts?.length || 0} adet blog içeriği inceleniyor.`);

    let updatedCount = 0;
    for (const post of posts || []) {
      let originalContent = post.content || "";
      let cleanedContent = originalContent;

      // 1. "—" (em-dash) karakterlerini "-" (tire) ile değiştir
      if (cleanedContent.includes("—")) {
        cleanedContent = cleanedContent.replace(/—/g, " - ");
      }

      // 2. Dangling or literal "**" karakterlerini temizle veya düzelt
      // Not: Eğer Markdown kalın yazı için ise, ReactMarkdown bunu işler fakat bazı yerlerde yapay zeka izi olarak çiğ durabilir.
      // Kullanıcı isteğine göre "**" karakterlerini temizliyoruz veya sadeleştiriyoruz.
      if (cleanedContent.includes("**")) {
        cleanedContent = cleanedContent.replace(/\*\*/g, "");
      }

      // 3. Çift tırnak ve yapay zeka formatındaki diğer tırnak izlerini temizle
      if (cleanedContent.includes('“') || cleanedContent.includes('”') || cleanedContent.includes('`')) {
        cleanedContent = cleanedContent
          .replace(/[“”]/g, '"')
          .replace(/`/g, '');
      }

      // Başlıktaki AI izlerini de temizleyelim
      let originalTitle = post.title;
      let cleanedTitle = originalTitle;
      if (cleanedTitle.includes("—")) {
        cleanedTitle = cleanedTitle.replace(/—/g, " - ");
      }
      if (cleanedTitle.includes("**")) {
        cleanedTitle = cleanedTitle.replace(/\*\*/g, "");
      }

      if (cleanedContent !== originalContent || cleanedTitle !== originalTitle) {
        const { error: updateError } = await supabase
          .from('posts')
          .update({ 
            content: cleanedContent,
            title: cleanedTitle
          })
          .eq('id', post.id);

        if (updateError) {
          console.error(`❌ Güncelleme hatası (${post.title}):`, updateError.message);
        } else {
          console.log(`✨ Temizlendi ve Güncellendi: "${cleanedTitle}"`);
          updatedCount++;
        }
      }
    }

    console.log(`\n✅ İçerik temizleme işlemi başarıyla tamamlandı! Toplam ${updatedCount} adet içerik güncellendi.`);
  } catch (err) {
    console.error("❌ İçerik temizleme hatası:", err.message || err);
  }
}

run();
