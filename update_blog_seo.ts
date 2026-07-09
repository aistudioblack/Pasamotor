import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY!
);

const MAPPINGS: Record<string, { title: string, desc: string }> = {
  "Kuba Motor Yedek Parça Rehberi - En Sık Aranan 20 Parça": {
    title: "Kuba Motor Yedek Parça 2026 — İstanbul Yetkili Servis",
    desc: "Kuba yedek parça fiyatları ve stok. Fatih İstanbul yetkili servis. Türkiye geneline kargo. WhatsApp: 0534 899 68 17"
  },
  "Hero Motosiklet İstanbul Yetkili Servisi - Paşa Motor": {
    title: "Hero Motosiklet İstanbul Fatih Yetkili Servis 2026",
    desc: "İstanbul Fatih Hero yetkili servisi. Bakım ve orijinal parça. Garanti kapsamı. Randevu: 0534 899 68 17"
  },
  "TVS Motosiklet Yedek Parça Fiyatları 2026": {
    title: "TVS Yedek Parça Fiyatları 2026 — Kargo ile Türkiye Geneli",
    desc: "TVS Apache, Raider, Star City parça fiyatları. Orijinal garanti. Türkiye geneline kargo. 0534 899 68 17"
  },
  "Motosiklet Bakımı Ne Zaman Yapılır? - Tam Rehber": {
    title: "Motosiklet Bakımı Ne Zaman Yapılır? 2026 Tam Rehber",
    desc: "5.000-10.000 km bakım listesi. Yağ, filtre, balata süreleri. İstanbul Fatih yetkili servis bilgisi."
  },
  "Falcon Motosiklet Yedek Parça - En Çok Değişen 15 Parça": {
    title: "Falcon Motosiklet Yedek Parça 2026 — Orijinal & Kargo",
    desc: "Falcon en çok değişen 15 parça ve fiyatları. İstanbul'dan Türkiye geneline kargo. Paşa Motor yetkili servis."
  },
  "Motosiklet Karbüratör Temizliği - Adım Adım Rehber": {
    title: "Motosiklet Karbüratör Temizliği Nasıl Yapılır? 2026",
    desc: "Karbüratör tıkanıklığı belirtileri ve temizlik rehberi. İstanbul Fatih profesyonel servis fiyatları."
  },
  "Motosiklet Yağı Ne Zaman Değiştirilir? 2026 Rehberi": {
    title: "Motosiklet Yağı Ne Zaman Değiştirilir? 2026 Rehberi",
    desc: "Yağ değişim aralıkları ve doğru yağ seçimi. Mineral vs sentetik fark. İstanbul Fatih yağ değişim servisi."
  },
  "Fatih İstanbul Motosiklet Servisi - Yetkili Servis Rehberi": {
    title: "Fatih İstanbul Motosiklet Servisi — Yetkili Servis 2026",
    desc: "Fatih İstanbul TVS, Hero, Falcon yetkili servisi. Uygun fiyat, orijinal parça. Randevu: 0534 899 68 17"
  }
};

async function run() {
  const { data: posts } = await supabase.from('posts').select('id, title');
  
  for (const post of posts || []) {
    let newTitle = post.title;
    let newDesc = "";

    const map = MAPPINGS[post.title];
    if (map) {
      newTitle = map.title;
      newDesc = map.desc;
    } else {
      const baseTitle = post.title.substring(0, 30);
      newTitle = baseTitle + " 2026 — İstanbul Servis";
      newTitle = newTitle.substring(0, 60);
      newDesc = baseTitle + " ve diğer bakım rehberleri. Orijinal parça garantisi. Fatih İstanbul'dan Türkiye'ye kargo. WhatsApp: 05348996817 | Paşa Motor";
      newDesc = newDesc.substring(0, 155);
    }

    await supabase.from('posts').update({
      meta_title: newTitle,
      meta_description: newDesc
    }).eq('id', post.id);
    console.log("Updated: " + newTitle);
  }
}
run();
