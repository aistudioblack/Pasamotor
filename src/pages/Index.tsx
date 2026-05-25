import { lazy, Suspense } from "react";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import JsonLd, { motorcycleDealerSchema } from "@/components/seo/JsonLd";
import SEO from "@/components/seo/SEO";
import { useSEO } from "@/hooks/useSEO";

const BrandsSection = lazy(() => import("@/components/home/BrandsSection"));
const ServicesSection = lazy(() => import("@/components/home/ServicesSection"));
const FAQ = lazy(() => import("@/components/home/FAQ"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

const Index = () => {
  const seo = useSEO(
    "index",
    "Paşa Motor - İstanbul Fatih Motosiklet Yetkili Servis Bayi",
    "Paşa Motor, İstanbul Fatih'te TVS, Hero, Falcon ve Işıldar yetkili servis bayi. 20+ yıllık deneyim ile motosiklet satış, profesyonel servis ve orijinal yedek parça. 0212 586 85 98"
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
      <Suspense fallback={<div className="h-40" />}>
        <BrandsSection />
        <ServicesSection />
        <FAQ />
        <CTASection />
      </Suspense>
    </Layout>
  );
};

export default Index;
