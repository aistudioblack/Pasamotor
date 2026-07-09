import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/seo/SEO";
import { BRANDS } from "@/data/brands";
import { ShieldCheck, Wrench, MessageCircle, Package, ArrowRight, CheckCircle2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const MarkaDetay = () => {
  const { slug } = useParams<{ slug: string }>();
  const brand = BRANDS.find(b => b.slug === slug);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!brand) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Marka Bulunamadı</h1>
          <p className="text-muted-foreground mb-8">Aradığınız marka sistemimizde kayıtlı değil.</p>
          <Link to="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Ana Sayfaya Dön
          </Link>
        </div>
      </Layout>
    );
  }

  const isAuth = brand.isAuthorized;
  
  const faqData = [
    {
      q: `Hangi ${brand.name} modellerine hizmet veriyorsunuz?`,
      a: `${brand.popularModels.join(", ")} başta olmak üzere tüm ${brand.name} modelleri için ${isAuth ? "yetkili servis ve orijinal yedek parça" : "yedek parça ve profesyonel servis"} desteği sunuyoruz.`
    },
    {
      q: `Parçalar orijinal mi?`,
      a: isAuth 
        ? `Evet, yetkili servis olduğumuz için kullandığımız tüm ${brand.name} yedek parçaları %100 orijinal ve garantilidir.`
        : `Stoklarımızda hem %100 orijinal ${brand.name} yedek parçaları hem de kaliteli muadil seçenekler bulunmaktadır. Bütçenize göre tercih yapabilirsiniz.`
    },
    {
      q: `Türkiye geneline kargo gönderiyor musunuz?`,
      a: "Evet, İstanbul içi kurye ve tüm Türkiye geneline anlaşmalı kargolarımızla güvenli gönderim yapıyoruz."
    },
    {
      q: `Sipariş veya randevu için nasıl ulaşabilirim?`,
      a: "0534 899 68 17 numaralı WhatsApp hattımızdan parça sorgulaması yapabilir veya servis randevusu alabilirsiniz."
    }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isAuth ? "AutoRepair" : "AutoPartsStore",
    "name": `Paşa Motor - ${brand.name} ${brand.badge}`,
    "image": "https://pasamotor.com.tr/logo.png",
    "@id": `https://pasamotor.com.tr/marka/${brand.slug}`,
    "url": `https://pasamotor.com.tr/marka/${brand.slug}`,
    "telephone": "+905348996817",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kızılelma Cd. No:66",
      "addressLocality": "Fatih",
      "addressRegion": "İstanbul",
      "postalCode": "34098",
      "addressCountry": "TR"
    },
    ...(isAuth && {
      "isAuthorizedServiceOf": {
        "@type": "Brand",
        "name": brand.name
      }
    })
  };

  return (
    <Layout>
      <SEO 
        title={brand.seoTitle} 
        description={brand.seoDescription} 
        canonical={`/marka/${brand.slug}`} 
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header Section */}
      <section className="relative py-20 bg-muted/30 border-b border-border overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-background border shadow-sm mb-4">
              <span className="text-3xl font-bold text-foreground/80">{brand.name[0]}</span>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
              {isAuth ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  {brand.badge}
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium border border-blue-500/20">
                  <Wrench className="w-4 h-4 mr-1.5" />
                  {brand.badge}
                </span>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {brand.name} {isAuth ? "Yetkili Servis" : "Yedek Parça"}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              İstanbul Fatih'te {brand.name} motosikletleriniz için {isAuth ? "garantili yetkili servis ve orijinal yedek parça" : "geniş yedek parça stoğu ve profesyonel servis"} hizmeti.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Models & Parts */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6 text-primary" />
                Popüler Modeller
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {brand.popularModels.map(model => (
                  <div key={model} className="p-4 rounded-xl border bg-card hover:border-primary/50 transition-colors">
                    <p className="font-medium">{model}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Wrench className="w-6 h-6 text-primary" />
                Sık Sorulan Parçalar
              </h2>
              <div className="flex flex-wrap gap-3">
                {brand.popularParts.map(part => {
                  const message = `Merhaba, ${brand.name} ${part} için stok ve fiyat bilgisi alabilir miyim?`;
                  const waLink = `https://wa.me/905348996817?text=${encodeURIComponent(message)}`;
                  
                  return (
                    <a 
                      key={part} 
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground transition-colors text-sm font-medium group"
                    >
                      {part}
                      <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  )
                })}
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Listede olmayan parçalar için doğrudan WhatsApp'tan şase numarası ile sorgulama yapabilirsiniz.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Steps to Order */}
      <section className="py-16 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nasıl Sipariş Verilir?</h2>
            <p className="text-muted-foreground">Türkiye'nin her yerine kargo ile hızlı gönderim</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block" />
            
            {[
              { title: "Şase Numarasını İletin", desc: "WhatsApp üzerinden aracınızın şase numarasını ve aradığınız parçayı yazın." },
              { title: "Fiyat ve Stok Onayı", desc: "Uzman ekibimiz parçanın orijinalliğini, fiyatını ve stok durumunu size bildirsin." },
              { title: "Hızlı Kargo", desc: "Ödemenizi tamamlayın, siparişiniz aynı gün kargoya teslim edilsin." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 bg-card border rounded-2xl p-6 text-center shadow-sm">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/905348996817"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl text-base font-semibold transition-all hover:scale-105 active:scale-95 bg-[#25D366] text-white hover:bg-[#20bd5a] h-14 px-8 w-full sm:w-auto shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp'tan Ulaşın
            </a>
            <Link 
              to="/yedek-parca"
              className="inline-flex items-center justify-center rounded-xl text-base font-medium transition-colors border-2 border-primary text-primary hover:bg-primary/5 h-14 px-8 w-full sm:w-auto"
            >
              <Package className="w-5 h-5 mr-2" />
              Online Kataloğu İncele
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Sıkça Sorulan Sorular</h2>
          </div>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <div key={i} className="border rounded-xl bg-card overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-6 text-left font-medium hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform shrink-0", openFaq === i && "rotate-180")} />
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MarkaDetay;
