import Layout from "@/components/layout/Layout";
import { Wrench, ShoppingBag, Package, Settings, Zap, ShieldCheck } from "lucide-react";
import serviceImg from "@/assets/service.webp";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import JsonLd from "@/components/seo/JsonLd";

const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    { "@type": "Service", name: "Motosiklet Satışı", provider: { "@type": "LocalBusiness", name: "Paşa Motor" } },
    { "@type": "Service", name: "Motor Servisi", provider: { "@type": "LocalBusiness", name: "Paşa Motor" } },
    { "@type": "Service", name: "Elektrik & Elektronik Onarım", provider: { "@type": "LocalBusiness", name: "Paşa Motor" } },
    { "@type": "Service", name: "Yedek Parça Satışı", provider: { "@type": "LocalBusiness", name: "Paşa Motor" } },
    { "@type": "Service", name: "Periyodik Bakım & Onarım", provider: { "@type": "LocalBusiness", name: "Paşa Motor" } },
  ].map((s, i) => ({ "@type": "ListItem", position: i + 1, item: s })),
};

import { useSEO } from "@/hooks/useSEO";

const services = [
  { icon: ShoppingBag, title: "Motosiklet Satışı", desc: "TVS, Hero, Falcon ve Işıldar markalarının en güncel modellerini showroom'umuzda inceleyebilirsiniz. Kredi ve taksit seçenekleri mevcuttur." },
  { icon: Wrench, title: "Motor Servisi", desc: "Periyodik bakım, motor revizyon, debriyaj, şanzıman ve genel mekanik onarım hizmetleri sunuyoruz." },
  { icon: Zap, title: "Elektrik & Elektronik", desc: "Aküden aydınlatmaya, CDI'den beyin arızalarına kadar tüm elektrik sorunlarını çözüyoruz." },
  { icon: Package, title: "Yedek Parça Satışı", desc: "Orijinal ve muadil yedek parçalar geniş stoğumuzda. Bulunmayan parçalar kısa sürede temin edilir." },
  { icon: Settings, title: "Bakım & Onarım", desc: "Yağ değişimi, filtre, balata, zincir-dişli seti ve lastik değişimi gibi rutin bakım hizmetleri." },
  { icon: ShieldCheck, title: "Garanti Kapsamı", desc: "Yetkili servis bayi olarak tüm satış ve servis işlemlerimiz garanti kapsamında gerçekleştirilir." },
];

const Hizmetler = () => {
  const seo = useSEO(
    "hizmetler",
    "Hizmetlerimiz - Motosiklet Satış, Servis ve Yedek Parça",
    "Paşa Motor: TVS, Hero, Falcon, Işıldar motosiklet satışı, periyodik bakım, motor revizyon, elektrik onarım, yedek parça. İstanbul Fatih'te yetkili servis."
  );

  return (
    <Layout>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical="/hizmetler"
        keywords="pasamotor.com.tr, motosiklet servisi istanbul, orijinal paşa motor, motor bakımı fatih, motosiklet tamiri, periyodik bakım, motor revizyon"
      />
      <JsonLd data={servicesSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "Hizmetler", url: "/hizmetler" },
        ])}
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">
              Hizmetlerimiz
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Orijinal <strong>pasamotor.com.tr</strong> adresinden motosiklet satışından servise, yedek parçadan bakıma kadar tüm ihtiyaçlarınız için profesyonel çözümler sunuyoruz.
            </p>
          </div>

          {/* Hero Image */}
          <div className="relative rounded-2xl overflow-hidden mb-16 max-w-4xl mx-auto">
            <img src={serviceImg} alt="Paşa Motor servis atölyesi" loading="lazy" width={800} height={600} className="w-full h-64 md:h-80 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="font-heading font-bold text-xl text-foreground">Profesyonel Servis</p>
              <p className="text-sm text-muted-foreground">Uzman kadromuzla hizmetinizdeyiz</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.title} className="glass-card rounded-xl p-6 hover:scale-[1.02] transition-all duration-300 group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Hizmetler;
