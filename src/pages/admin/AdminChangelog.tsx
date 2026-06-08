import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { GitCommit, Star, Target, Server, Paintbrush, Activity, Boxes, Bot } from "lucide-react";
import { motion } from "motion/react";
import AdminLayout from "@/components/admin/AdminLayout";

const changelogData = [
  {
    version: "v3.2.0 - Yerel SEO Gücü, SEO Ajanı ve Blog Geliştirmeleri",
    date: "2026-06-08",
    icon: Target,
    items: [
      { type: "improvement", text: "Index.html içerisine LocalBusiness (MotorcycleRepair) Schema Update'i uygulandı. TVS, Hero, Falcon ve Işıldar markaları 'makesOffer' bazlı schema taglerine eklenerek lokal Fatih (İstanbul) arama sonuçlarında görünürlük hedeflendi." },
      { type: "fix", text: "AdminBlogAgent.tsx içerisindeki otomatik görsel üretim modülü (generateImage) DALL-E 3 API (OpenAI) fallback ve sunucu tarafı (/api/ai/generate-image) köprüsü üzerinden stabil çalışacak şekilde düzeltildi. Kırık görseller ortadan kaldırıldı." },
      { type: "feature", text: "Yapay zeka üzerinden Fatih bölgesi motosiklet yetkili servis ve yedek parça pazar analizi raporlanarak sıralama kazanma stratejileri oluşturuldu." },
      { type: "feature", text: "Google Trends baz alınarak TVS, Hero, Falcon ve Işıldar kullanıcılarının bakım/yedek parça arayışlarına yanıt veren SEO uyumlu 5 blog taslağı geliştirildi." }
    ]
  },
  {
    version: "v3.1.5 - Secure Image Storage Bridge & RLS Bypass",
    date: "2026-06-04",
    icon: Server,
    items: [
      { type: "feature", text: "Farklı tarayıcılarda (Edge, Safari vb.) yaşanan görsel yükleme ve Supabase yetkilendirme (RLS) hatalarını aşmak için sunucu taraflı güvenli görsel köprüsü (/api/upload-image) geliştirildi." },
      { type: "feature", text: "Supabase tarafında gerekli olan 'product-images' depolama alanının (Bucket) eksik olması durumunda sunucu üzerinden otomatik olarak oluşturulup kamuya (Public) açık hale gelmesini sağlayan akıllı otomasyon eklendi." },
      { type: "improvement", text: "Ürünler, blog yazıları ve galeri panellerindeki doğrudan istemci-tabanlı Supabase API çağrıları, Base64 dönüştürücü aracılığıyla bu yeni bütünleşik sunucu köprüsüne taşındı." }
    ]
  },
  {
    version: "v3.1.0 - Genişletilmiş Marka ve RapidoX Destek Entegrasyonu",
    date: "2026-06-04",
    icon: Boxes,
    items: [
      { type: "feature", text: "Yönetici manuel yeni ürün ekleme pencerelerindeki ve ürün filtrelerindeki marka seçenekleri genişletildi." },
      { type: "feature", text: "RapidoX markası sisteme, yedek parça arama sayfasına ve marka filtre paneline entegre edildi." },
      { type: "improvement", text: "Yapay zeka asistanının otomatik isim güzelleştirme standardına (Beautify Engine) RapidoX marka kuralı dahil edildi." }
    ]
  },
  {
    version: "v3.0.0 - Kapsamlı SEO Optimizasyonu ve Genişletilmiş SSR",
    date: "2026-06-04",
    icon: Target,
    items: [
      { type: "feature", text: "React uygulamasının Googlebot tarafından indekslenebilmesi için Express server üzerinden dinamik SSR, SEO Injection ve Prerendering sistemi kuruldu." },
      { type: "feature", text: "JSON-LD formatında; LocalBusiness (AutoRepair), Service ve FAQPage barındıran kapsamlı Schema Markup (Structured Data) meta-etiket olarak entegre edildi." },
      { type: "feature", text: "Marka bazlı /kuba-motor-yetkili-servis, /rks-motor-yetkili-servis, /mondial-motor-yetkili-servis hizmet sayfaları yüksek kaliteli (600+ kelimelik) SEO içeriği ve statik routing ile oluşturuldu." },
      { type: "feature", text: "Tüm kritik route'ları içeren ve otomatik oluşturulan dinamik sitemap.xml ve robots.txt entegrasyonları tamamlandı." },
      { type: "improvement", text: "Open Graph (og:title, og:description vb.) etiketleri server tarafında dinamik hale getirilerek sosyal medya paylaşımlarında zengin önizleme iyileştirildi." }
    ]
  },
  {
    version: "v2.5.2 - Kritik Serverless Düzelten Hata Giderme Fazı",
    date: "2026-06-03",
    icon: Activity,
    items: [
      { type: "fix", text: "Octokit ESM/CJS çakışmasından kaynaklanan 'ERR_REQUIRE_ESM' sunucu hatası (esbuild statik analizini atlatmak için 'new Function' hilesi kullanılarak) çözüldü." },
      { type: "fix", text: "ESM (ES Modül) çalıştırma ortamlarında __dirname tanımsızlığı nedeniyle sunucunun çökmesine ve 500 hatası üretmesine sebep olan sorun giderildi (getDirname fallback entegre edildi)." },
      { type: "fix", text: "Vercel Serverless Function ortamında (CJS) import.meta.url kullanımından kaynaklanan SyntaxError parsing hatası kırılarak 500 FUNCTION_INVOCATION_FAILED problemi kalıcı olarak çözüldü." },
      { type: "improvement", text: "Senior Manager denetimi altında kod tabanında stabilite analizi tamamlandı ve Change Log güncel iş yapış standardı devreye alındı." }
    ]
  },
  {
    version: "v2.5.1 - Yönetici Şifre Güncelleme Fazı",
    date: "2026-06-03",
    icon: Server,
    items: [
      { type: "feature", text: "Yönetici panelinde (Admin Panel > Kullanıcılar) adminlerin şifrelerini güncelleyebilmesi için güvenli arayüz eklendi." },
      { type: "feature", text: "Şifre değiştirme işlemi için Supabase Admin/Service-Role API backend entegrasyonu (/api/admin/change-password) yapıldı." },
      { type: "improvement", text: "Change Log sayfasının navigasyon bütünlüğü AdminLayout entegrasyonu ile sağlandı (sidebar kaybolma sorunu çözüldü)." }
    ]
  },
  {
    version: "v2.5.0 - E-ticaret SEO ve Blog Ajanı Fazı",
    date: "2026-06-03",
    icon: SparklesIcon,
    items: [
      { type: "feature", text: "Google IndexNow ve Sitemap ping aracı entegre edildi (/api/seo/ping)." },
      { type: "feature", text: "llms.txt AI tarayıcı direktifi yapılandırıldı ve Türkçe güncellendi." },
      { type: "improvement", text: "Site geneli resmi partner markalar güncellendi (TVS, Hero, Falcon, Işıldar)." },
      { type: "fix", text: "API endpoint'lerinde (FCS Auth, FCS Fetch, SEO Ping) req.body parsing kaynaklı 500 hataları giderildi." },
      { type: "improvement", text: "Sitemap yükleme kapasitesi Range API üzerinden 1000 ürüne çıkartılarak paginate edildi." },
      { type: "fix", text: "Kullanılmayan LCP Preload tagları kaldırılarak performans optimizasyonu sağlandı." }
    ]
  },
  {
    version: "v2.4.0 - Supabase ve Edge Functions Entegrasyonu",
    date: "2026-06-02",
    icon: Server,
    items: [
      { type: "feature", text: "Ürünler Firestore yerine Supabase üzerinden sunulmaya başlandı." },
      { type: "improvement", text: "Supabase Keep-alive ve pinging endpoint'leri geliştirildi." },
      { type: "improvement", text: "Sitemap XML ve Robots dinamik endpoint (/api) olarak Vercel yapısına geçirildi." }
    ]
  },
  {
    version: "v2.1.0 - Yapay Zeka Özellikleri Fazı",
    date: "2026-05-25",
    icon: Bot,
    items: [
      { type: "feature", text: "Yapay zeka asistanı Blog makaleleri oluşturabilmek için sisteme entegre edildi." },
      { type: "improvement", text: "SEO Injected HTML ve prerender işlemleri için Sunucu Prerender yapısı kuruldu." }
    ]
  },
  {
    version: "v2.0.0 - Yeni Arayüz ve Admin Paneli",
    date: "2026-05-15",
    icon: Paintbrush,
    items: [
      { type: "feature", text: "Kapsamlı Admin Paneli v2 tasarımı başlatıldı." },
      { type: "feature", text: "FCS Auto-Sync entegrasyonu ve Supabase bağlantısı temelleri atıldı." },
      { type: "improvement", text: "Yeni marka yüzü ve dark-mode özellikli TailwindCSS komponentleri eklendi." }
    ]
  },
  {
    version: "v1.0.0 - Başlangıç",
    date: "2026-04-01",
    icon: Target,
    items: [
      { type: "feature", text: "Paşa Motor web sitesi devreye alındı." },
      { type: "feature", text: "Firestore veritabanı ile ilk ürün listeleme sistemi kuruldu." }
    ]
  }
];

function SparklesIcon(props: any) {
  return <Bot {...props} />;
}

export default function AdminChangelog() {
  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Change Log & Geliştirmeler</h1>
          <p className="text-muted-foreground">Projenin başından bugüne kadar olan tüm güncellemeler ve iyileştirmeler.</p>
        </div>

        <div className="relative border-l border-border/50 ml-6 space-y-12 pb-8">
          {changelogData.map((log, index) => {
            const Icon = log.icon || GitCommit;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-8"
              >
                <div className="absolute -left-[20px] top-1 bg-background border border-border/50 p-2 rounded-full ring-4 ring-background">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                
                <div className="bg-card border border-border/50 rounded-xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold font-heading text-foreground">{log.version}</h2>
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                      {format(new Date(log.date), "dd MMMM yyyy", { locale: tr })}
                    </div>
                  </div>
                  
                  <ul className="space-y-3">
                    {log.items.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        {item.type === "feature" && <div className="mt-0.5 text-emerald-500 font-bold w-14 shrink-0">YENİ</div>}
                        {item.type === "fix" && <div className="mt-0.5 text-rose-500 font-bold w-14 shrink-0">HATA</div>}
                        {item.type === "improvement" && <div className="mt-0.5 text-blue-500 font-bold w-14 shrink-0">GELİŞİM</div>}
                        <span className="text-muted-foreground leading-relaxed">{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
