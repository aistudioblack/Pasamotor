import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article" | "product";
  keywords?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  schema?: Record<string, any> | Array<Record<string, any>>;
}

const SITE = "https://pasamotor.com.tr";
const DEFAULT_IMAGE = `${SITE}/favicon.png`;

export const localBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["AutomotiveBusiness", "MotorcycleRepair", "MotorcycleDealer"],
  "@id": `${SITE}/#organization`,
  "name": "Paşa Motor - Yetkili Servis ve Yedek Parça",
  "url": SITE,
  "logo": `${SITE}/favicon.png`,
  "image": `${SITE}/favicon.png`,
  "description": "Türkiye'nin en gelişmiş motosiklet yetkili servis ve yedek parça platformu. TVS, Hero, Falcon, Işıldar resmi partneri.",
  "telephone": "+90 500 000 00 00",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "İstanbul",
    "addressRegion": "İstanbul",
    "addressCountry": "TR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 41.0051,
    "longitude": 28.9328
  },
  "priceRange": "$$"
});

const SEO = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  keywords,
  noindex = false,
  publishedTime,
  modifiedTime,
  schema,
}: SEOProps) => {
  const url = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${SITE}${canonical}`
    : SITE;

  const sanitize = (s: string) =>
    s
      .replace(/\s*[•|–—]\s*/g, " - ")
      .replace(/\*+/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  const cleanTitle = sanitize(title);
  const fullTitle = cleanTitle.includes("Paşa Motor")
    ? (cleanTitle.includes("pasamotor.com.tr") ? cleanTitle : `${cleanTitle} | pasamotor.com.tr`)
    : `${cleanTitle} - Paşa Motor`;

  // Automatic Base Context / E-E-A-T Injection (All Pages)
  const baseSchema = localBusinessSchema();
  let finalSchema: any[] = [baseSchema];
  if (schema) {
    if (Array.isArray(schema)) finalSchema = [...finalSchema, ...schema];
    else finalSchema.push(schema);
  }

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="Paşa Motor" />
      <meta name="publisher" content="Paşa Motor" />
      <link rel="canonical" href={url} />
      
      {/* 2026 AI Overviews & Search Bots Mastery */}
      <meta
        name="robots"
        content={
          noindex
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      {!noindex && <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
      {!noindex && <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />}
      {!noindex && <meta name="yandex" content="index, follow, max-snippet:-1, max-image-preview:large" />}

      {/* Global Geo Data - Master Signal for Local Business Search */}
      <meta name="geo.region" content="TR-34" />
      <meta name="geo.placename" content="İstanbul" />
      <meta name="geo.position" content="41.0051;28.9328" />
      <meta name="ICBM" content="41.0051, 28.9328" />

      {/* Social & Engagement Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Paşa Motor" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="tr_TR" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@pasamotor" />
      <meta name="twitter:creator" content="@pasamotor" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Theme & PWA */}
      <meta name="apple-mobile-web-app-title" content="Paşa Motor" />
      <meta name="application-name" content="Paşa Motor" />
      <meta name="theme-color" content="#ffffff" />

      {/* Article timestamps (For Discover & News feeds) */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}

      {finalSchema && (
        <script type="application/ld+json">
          {JSON.stringify(finalSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;

export const breadcrumbSchema = (
  items: Array<{ name: string; url: string }>,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": item.name,
    "item": item.url.startsWith("http") ? item.url : `${SITE}${item.url}`,
  })),
});

export const productSchema = (product: {
  name: string;
  image: string[];
  description: string;
  sku?: string;
  price: number;
  currency?: string;
  url: string;
  availability?: string;
  brand?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": product.name,
  "image": product.image,
  "description": product.description,
  "sku": product.sku,
  "brand": {
    "@type": "Brand",
    "name": product.brand || "Paşa Motor Onaylı Parça"
  },
  "offers": {
    "@type": "Offer",
    "url": product.url.startsWith("http") ? product.url : `${SITE}${product.url}`,
    "priceCurrency": product.currency || "TRY",
    "price": product.price,
    "itemCondition": "https://schema.org/NewCondition",
    "availability": product.availability || "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Paşa Motor"
    }
  },
});

export const articleSchema = (article: {
  headline: string;
  image: string[];
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  url: string;
  description?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url.startsWith("http") ? article.url : `${SITE}${article.url}`,
  },
  "headline": article.headline,
  "description": article.description || article.headline,
  "image": article.image,
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "author": {
    "@type": "Organization",
    "name": article.authorName || "Paşa Motor Uzman Ekibi",
    "url": SITE
  },
  "publisher": {
    "@type": "Organization",
    "name": "Paşa Motor",
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE}/favicon.png`
    }
  }
});

export const faqSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

