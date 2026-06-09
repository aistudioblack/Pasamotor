import React from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { getCityBySlug } from "@/data/cities";
import SEO from "@/components/seo/SEO";
import JsonLd from "@/components/seo/JsonLd";
import Layout from "@/components/layout/Layout";
import { ArrowRight, CheckCircle2, ChevronRight, Package, MapPin, Search, ShieldCheck, Truck, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SehirYedekParca = () => {
  const { slug } = useParams<{ slug: string }>();
  const city = slug ? getCityBySlug(slug) : undefined;

  if (!city) {
    return <Navigate to="/404" replace />;
  }

  const WHATSAPP_NUMBER = "905348996817";
  const message = `Merhaba, ${city.name} için orijinal motosiklet yedek parçası arıyorum.`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SEO 
        title={city.seoTitle} 
        description={city.seoDescription} 
        keywords={`${city.name} motosiklet yedek parça, ${city.name} tvs yedek parça, ${city.name} hero kargo parça, orijinal parçalar`}
      />
      
      <JsonLd 
        type="LocalBusiness" 
        data={{
          name: "Paşa Motor - Türkiye Geneli Kargo",
          description: city.seoDescription,
          url: `https://pasamotor.com.tr/sehir/${city.slug}`,
          image: "https://pasamotor.com.tr/favicon.png",
          priceRange: "₺₺",
          address: {
            "@type": "PostalAddress",
            addressLocality: "İstanbul",
            addressCountry: "TR"
          },
          areaServed: city.name,
          telephone: "+905348996817",
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Motosiklet Yedek Parçaları",
            itemListElement: [
              { "@type": "Offer", name: "TVS Orijinal Parçalar" },
              { "@type": "Offer", name: "Hero Orijinal Parçalar" },
              { "@type": "Offer", name: "Falcon Orijinal Parçalar" }
            ]
          },
          availableDeliveryMethod: "http://purl.org/goodrelations/v1#DeliveryModeShip"
        }} 
      />

      <Layout>
      
      <main className="flex-1">
        {/* Header Hero */}
        <section className="relative overflow-hidden bg-muted/30 pt-24 pb-12 lg:pt-32 lg:pb-24 border-b border-border/40">
          <div className="container mx-auto px-4 md:px-6 z-10 relative">
            <div className="flex gap-2 items-center text-sm text-muted-foreground mb-6 font-medium">
              <Link to="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/yedek-parca" className="hover:text-primary transition-colors">Yedek Parça</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground">{city.name}</span>
            </div>
            
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                <MapPin className="mr-1 h-4 w-4" />
                {city.name} ve ilçelerine kargo
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                {city.h1}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {city.intro}
              </p>
              
              <div className="pt-6">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-14 items-center justify-center rounded-xl bg-green-600 px-8 text-base font-semibold text-white shadow-xl shadow-green-600/20 transition-all hover:bg-green-700 hover:scale-105">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp'tan Parça Sor
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Info Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-card border border-border shadow-sm rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    <Truck className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Kargo ve Teslimat</h3>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {city.cargoInfo}
                </p>
                <div className="bg-muted p-4 rounded-xl mt-6">
                  <h4 className="font-semibold mb-2">Gönderim Yapılan İlçeler:</h4>
                  <div className="flex flex-wrap gap-2">
                    {city.districts.map(d => (
                      <span key={d} className="inline-flex bg-background px-3 py-1 rounded-md text-sm border border-border">
                        {d}
                      </span>
                    ))}
                    <span className="inline-flex bg-background px-3 py-1 rounded-md text-sm border border-border">ve diğerleri...</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Neden Paşa Motor?</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-card border border-border p-4 rounded-xl flex flex-col gap-2">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Orijinal Parça</h4>
                    <p className="text-sm text-muted-foreground">Tüm marka ve modeller için %100 orijinal yedek parçalar.</p>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-xl flex flex-col gap-2">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Yetkili Servis</h4>
                    <p className="text-sm text-muted-foreground">TVS, Hero, Falcon yetkili servis güvencesiyle hizmet.</p>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-xl flex flex-col gap-2">
                    <Truck className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Hızlı Gönderim</h4>
                    <p className="text-sm text-muted-foreground">Aynı gün kargo imkanı ile parçalarınız hemen yola çıkar.</p>
                  </div>
                  <div className="bg-card border border-border p-4 rounded-xl flex flex-col gap-2">
                    <Search className="h-6 w-6 text-primary" />
                    <h4 className="font-semibold">Doğru Parça</h4>
                    <p className="text-sm text-muted-foreground">Şase no sorgula ile uyumlu parçayı nokta atışı buluyoruz.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="py-16 md:py-24 bg-muted/50 border-y border-border/40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Desteklediğimiz Markalar</h2>
              <p className="text-muted-foreground">Bu markaların tüm orijinal yedek parçalarını {city.name} adresinize sorunsuz ulaştırıyoruz.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "TVS Motor", link: "/yedek-parca", img: "https://pasamotor.com.tr/tvs-motor-logo.png" },
                { name: "Hero Motor", link: "/yedek-parca", img: "https://pasamotor.com.tr/logo.png" }, // Using general logo as placeholder
                { name: "Falcon", link: "/yedek-parca", img: "https://pasamotor.com.tr/falcon-motor-logo.png" },
                { name: "Işıldar", link: "/yedek-parca", img: "https://pasamotor.com.tr/isildar-motor-logo.png" }
              ].map(brand => (
                <Link to={brand.link} key={brand.name} className="group bg-card border border-border rounded-2xl p-6 text-center hover:border-primary transition-colors block">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <span className="font-bold text-xl">{brand.name}</span>
                  </div>
                  <span className="inline-flex items-center text-sm font-medium text-primary group-hover:underline">
                    Kataloğu İncele <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How to Order */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12">Nasıl Sipariş Verilir?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative group p-6 border rounded-2xl">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-lg">1</div>
                <h3 className="text-xl font-bold mb-3 mt-2">Şase No veya Parça Adı</h3>
                <p className="text-muted-foreground">İhtiyacınız olan parçayı veya motosikletinize ait şase numarasını WhatsApp üzerinden bize iletin.</p>
              </div>
              <div className="relative group p-6 border rounded-2xl">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-lg">2</div>
                <h3 className="text-xl font-bold mb-3 mt-2">Stok ve Fiyat Onayı</h3>
                <p className="text-muted-foreground">Ekiplerimiz orijinal programdan uyumluluğu kontrol edip size güncel fiyat ve stok bilgisini paylaşır.</p>
              </div>
              <div className="relative group p-6 border rounded-2xl">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg shadow-lg">3</div>
                <h3 className="text-xl font-bold mb-3 mt-2">Ödeme ve Kargo</h3>
                <p className="text-muted-foreground">Ödemenizi tamamladıktan sonra parçanız güvenle paketlenir ve aynı gün kargoya teslim edilip takip numarası iletilir.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 md:py-24 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4 md:px-6 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-8">Sık Sorulan Sorular</h2>
            <Accordion type="single" collapsible className="w-full">
              {city.faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="bg-card border border-border shadow-lg rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">{city.name} İçin Parça mı Arıyorsunuz?</h2>
              <p className="text-lg text-muted-foreground mb-8">Hemen WhatsApp üzerinden bizimle iletişime geçin, ustalarımız doğru parçayı bulup anında kargolasın.</p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center rounded-xl bg-green-600 px-8 font-medium text-white transition-colors hover:bg-green-700">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Destek
                </a>
                <Link to="/yedek-parca" className="inline-flex h-12 items-center justify-center rounded-xl bg-secondary px-8 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 border border-border">
                  <Package className="mr-2 h-5 w-5" />
                  Kataloğu Görüntüle
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      </Layout>
    </div>
  );
};

export default SehirYedekParca;
