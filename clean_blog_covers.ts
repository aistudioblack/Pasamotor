import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

async function run() {
  console.log("Veritabanından blog kapak resimleri temizleniyor...");
  try {
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, cover_image');

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Toplam ${posts?.length || 0} blog içeriği bulundu.`);

    let cleanedCount = 0;
    for (const post of posts || []) {
      if (post.cover_image !== null && post.cover_image !== "") {
        const { error: updateError } = await supabase
          .from('posts')
          .update({ cover_image: null })
          .eq('id', post.id);

        if (updateError) {
          console.error(`❌ Blog güncellenemedi (${post.title}):`, updateError.message);
        } else {
          console.log(`🧹 Temizlendi: ${post.title}`);
          cleanedCount++;
        }
      } else {
        console.log(`Already empty: ${post.title}`);
      }
    }

    console.log(`✅ Temizlik işlemi tamamlandı! ${cleanedCount} adet blog kapak resmi veritabanından başarıyla temizlendi.`);
  } catch (err) {
    console.error("❌ Temizlik hatası:", err.message || err);
  }
}

run();
