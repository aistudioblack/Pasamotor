interface JsonLdProps {
  data: Record<string, unknown>;
}

const JsonLd = ({ data }: JsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export default JsonLd;

// LocalBusiness + MotorcycleDealer combined schema (rich for Google + AI engines)
export const motorcycleDealerSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["MotorcycleDealer", "LocalBusiness", "Store", "AutomotiveBusiness"],
      "@id": "https://pasamotor.com.tr/#organization",
      name: "Paşa Motor (.com.tr)",
      alternateName: ["Paşa Motor Yetkili Servis Bayi", "Pasa Motor", "pasamotor.com.tr", "Orijinal Paşa Motor"],
      description:
        "Orijinal Paşa Motor resmî web sitesi (pasamotor.com.tr). İstanbul Fatih'te TVS, Hero, Falcon ve Işıldar markalarının yetkili satış ve servis bayi. 20+ yıllık deneyim ile motosiklet satış, profesyonel servis ve orijinal yedek parça.",
      url: "https://pasamotor.com.tr",
      logo: "https://pasamotor.com.tr/favicon.png",
      image: "https://pasamotor.com.tr/favicon.png",
      telephone: ["+902125868598", "+905348996817"],
      email: "pasamotor@gmail.com",
      foundingDate: "2003",
      slogan: "İstanbul'un Güvenilir Motosiklet Yetkili Servis Bayi",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Kızılelma Cad. No:66/A, Kocamustafapaşa",
        addressLocality: "Fatih",
        addressRegion: "İstanbul",
        postalCode: "34104",
        addressCountry: "TR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "41.0085",
        longitude: "28.9265",
      },
      hasMap: "https://www.google.com/maps/search/?api=1&query=Pa%C5%9Fa+Motor+Kocamustafapa%C5%9Fa+Fatih",
      areaServed: [
        { "@type": "City", name: "İstanbul" },
        { "@type": "AdministrativeArea", name: "Fatih" },
      ],
      brand: [
        { "@type": "Brand", name: "TVS" },
        { "@type": "Brand", name: "Hero" },
        { "@type": "Brand", name: "Falcon" },
        { "@type": "Brand", name: "Işıldar" },
      ],
      makesOffer: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Motosiklet Satışı" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Motosiklet Servisi" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Orijinal Yedek Parça" } },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "09:00",
          closes: "19:00",
        },
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Saturday",
          opens: "09:00",
          closes: "17:00",
        },
      ],
      sameAs: [
        "https://www.google.com/maps/search/?api=1&query=Pa%C5%9Fa+Motor+Kocamustafapa%C5%9Fa+Fatih",
      ],
      priceRange: "₺₺",
      currenciesAccepted: "TRY",
      paymentAccepted: "Cash, Credit Card",
    },
    {
      "@type": "WebSite",
      "@id": "https://pasamotor.com.tr/#website",
      name: "Paşa Motor",
      url: "https://pasamotor.com.tr",
      inLanguage: "tr-TR",
      publisher: { "@id": "https://pasamotor.com.tr/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://pasamotor.com.tr/yedek-parca?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};
