import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { GitCommit, Star, Target, Server, Paintbrush, Activity, Boxes, Bot } from "lucide-react";
import { motion } from "motion/react";
import AdminLayout from "@/components/admin/AdminLayout";

const changelogData = [
  {
    version: "v2.5.2 - Kritik Serverless Düzelten Hata Giderme Fazı",
    date: "2026-06-03",
    icon: Activity,
    items: [
      { type: "fix", text: "ESM (ES Modül) çalıştırma ortamlarında __dirname tanımsızlığı nedeniyle sunucunun çökmesine ve 500 hatası üretmesine sebep olan sorun giderildi (getDirname fallback entegre edildi)." },
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
