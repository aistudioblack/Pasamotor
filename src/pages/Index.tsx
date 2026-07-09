import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import BrandsSection from "@/components/home/BrandsSection";
import ServicesSection from "@/components/home/ServicesSection";
import FAQ from "@/components/home/FAQ";
import CTASection from "@/components/home/CTASection";
import JsonLd, { motorcycleDealerSchema } from "@/components/seo/JsonLd";
import SEO from "@/components/seo/SEO";
import { useSEO } from "@/hooks/useSEO";

const Index = () => {
  const seo = useSEO(
    "index",
    "TVS Hero Falcon Yetkili Servis & Yedek Parça | Paşa Motor",
    "İstanbul Fatih'te hizmet veren TVS, Hero, Falcon ve Işıldar yetkili motosiklet servisi. 2000+ orijinal yedek parça stokta. Türkiye geneline kargo. WhatsApp: 0534 899 68 17"
  );

  return (
    <Layout>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical="/"
        keywords="paşa motor, pasamotor.com.tr, pasamotor com tr, motosiklet İstanbul, fatih motosiklet, tvs yetkili servis, hero yetkili servis, falcon yetkili servis, ışıldar yetkili servis, motosiklet servis fatih, yedek parça istanbul, kocamustafapaşa motosiklet"
      />
      <JsonLd data={motorcycleDealerSchema} />
      <HeroSection />
      <BrandsSection />
      <ServicesSection />
      <FAQ />
      <CTASection />
    </Layout>
  );
};

export default Index;
