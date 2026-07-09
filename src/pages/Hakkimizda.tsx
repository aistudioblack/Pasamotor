import Layout from "@/components/layout/Layout";
import { Shield, Award, Users, Calendar } from "lucide-react";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import JsonLd from "@/components/seo/JsonLd";

import { useSEO } from "@/hooks/useSEO";

const highlights = [
  { icon: Calendar, title: "20+ Yıllık Deneyim", desc: "Motosiklet sektöründe yılların verdiği tecrübe ve güvenle hizmet veriyoruz." },
  { icon: Shield, title: "Yetkili Servis Bayi", desc: "TVS, Hero, Falcon ve Işıldar markalarının resmi yetkili satış ve servis noktasıyız." },
  { icon: Users, title: "1000+ Mutlu Müşteri", desc: "Binlerce müşterimize kaliteli hizmet sunmanın gururunu yaşıyoruz." },
  { icon: Award, title: "Profesyonel Ekip", desc: "Eğitimli ve deneyimli kadromuzla size en iyi hizmeti sunuyoruz." },
];

const Hakkimizda = () => {
  const seo = useSEO(
    "hakkimizda",
    "Hakkımızda — Fatih İstanbul Motosiklet Yetkili Servis | Paşa Motor",
    "Fatih İstanbul'da TVS, Hero, Falcon ve Işıldar yetkili servisi. Orijinal parça, uzman ekip, uygun fiyat."
  );

  return (
    <Layout>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical="/hakkimizda"
        keywords="paşa motor hakkında, pasamotor.com.tr orijinal, nihat kan, fatih motosiklet bayi, kocamustafapaşa motosiklet servisi"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "Hakkımızda", url: "/hakkimizda" },
        ])}
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-6">
              Hakkımızda
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              <strong>Orijinal Paşa Motor resmî web sitemiz olan pasamotor.com.tr'desiniz.</strong> Paşa Motor, İstanbul Fatih'te motosiklet tutkunlarına TVS, Hero, Falcon ve Işıldar markalarının yetkili bayisi olarak hizmet vermektedir. Yılların deneyimiyle müşteri memnuniyetini ön planda tutarak satış, servis ve yedek parça hizmetleri sunuyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {highlights.map((item) => (
              <div key={item.title} className="glass-card rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-xl p-8 md:p-12 max-w-3xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Vizyonumuz</h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Müşterilerimize en kaliteli motosikletleri, en uygun fiyatlarla sunmak ve satış sonrası hizmetlerimizle sektörde fark yaratmak. Her müşterimizin güvenle yola çıkmasını sağlamak temel amacımızdır.
            </p>
            <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Yetkili Servis Bayi</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nihat KAN liderliğinde faaliyet gösteren Paşa Motor, Kızılelma Caddesi üzerindeki showroom ve servis merkeziyle sizlere hizmet vermektedir. Orijinal yedek parça garantisi ve uzman teknik kadromuzla motosikletiniz emin ellerdedir.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Hakkimizda;
