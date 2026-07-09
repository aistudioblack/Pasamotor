export interface Brand {
  slug: string;
  name: string;
  desc: string;
  isAuthorized: boolean;
  badge: string;
  popularParts: string[];
  popularModels: string[];
  seoTitle: string;
  seoDescription: string;
}

export const BRANDS: Brand[] = [
  {
    slug: "tvs",
    name: "TVS",
    desc: "Hindistan'ın lider motosiklet üreticisi",
    isAuthorized: true,
    badge: "Yetkili Servis",
    popularParts: ["Yağ Filtresi", "Hava Filtresi", "Fren Balatası", "Debriyaj Balatası", "Kayış", "Buji"],
    popularModels: ["Apache RTR 200", "Jupiter 125", "Raider 125", "NTORQ 125"],
    seoTitle: "TVS Motosiklet Yetkili Servis İstanbul — Paşa Motor",
    seoDescription: "İstanbul Fatih TVS yetkili servisi. Orijinal TVS yedek parça, periyodik bakım ve garanti hizmetleri. Türkiye geneline kargo. WhatsApp: 0534 899 68 17"
  },
  {
    slug: "hero",
    name: "Hero",
    desc: "Dünyanın en büyük iki tekerlekli araç üreticisi",
    isAuthorized: true,
    badge: "Yetkili Servis",
    popularParts: ["Fren Balatası", "Hava Filtresi", "Yağ Filtresi", "Zincir Dişli Seti", "Buji", "Varyatör Kayışı"],
    popularModels: ["Dash 125", "Xpulse 200 4V", "Destini 125", "Ignitor 125"],
    seoTitle: "Hero Motosiklet Yetkili Servis İstanbul — Paşa Motor",
    seoDescription: "İstanbul Fatih Hero yetkili servisi. Orijinal Hero yedek parça ve profesyonel bakım. Türkiye geneline kargo. WhatsApp: 0534 899 68 17"
  },
  {
    slug: "falcon",
    name: "Falcon",
    desc: "Güvenilir ve ekonomik motosikletler",
    isAuthorized: true,
    badge: "Yetkili Servis",
    popularParts: ["Karbüratör", "Fren Balatası", "Debriyaj Seti", "Zincir Dişli", "Ayna Seti", "Grenaj"],
    popularModels: ["Freedom 250", "Mocco 50", "New Soft 50", "Nitro 50"],
    seoTitle: "Falcon Motosiklet Yetkili Servis İstanbul — Paşa Motor",
    seoDescription: "İstanbul Fatih Falcon yetkili servisi. Falcon Freedom ve 50cc serisi orijinal yedek parçaları. Türkiye geneline kargo. WhatsApp: 0534 899 68 17"
  },
  {
    slug: "isildar",
    name: "Işıldar",
    desc: "Kaliteli Türk motosiklet markası",
    isAuthorized: true,
    badge: "Yetkili Servis",
    popularParts: ["Akü", "Şarj Aleti", "Fren Balatası", "Beyin", "Lastik", "Amortisör"],
    popularModels: ["Elektrikli Scooter", "E-Bike", "Kargo Serisi", "City Serisi"],
    seoTitle: "Işıldar Motosiklet Yetkili Servis İstanbul — Paşa Motor",
    seoDescription: "İstanbul Fatih Işıldar yetkili servisi. Orijinal yedek parça, akü ve periyodik bakım. Türkiye geneline kargo. WhatsApp: 0534 899 68 17"
  },
  {
    slug: "honda",
    name: "Honda",
    desc: "Dünyaca ünlü yüksek kaliteli Japon motosiklet üreticisi",
    isAuthorized: false,
    badge: "Yedek Parça & Servis",
    popularParts: ["PCX Varyatör", "Dio Hava Filtresi", "Spacy Kayış", "Fren Balatası", "Debriyaj Balatası", "Buji"],
    popularModels: ["PCX 125", "Dio", "Spacy Alpha", "Forza 250"],
    seoTitle: "Honda Motosiklet Yedek Parça İstanbul — Paşa Motor",
    seoDescription: "İstanbul Fatih Honda yedek parça ve profesyonel servis. PCX, Dio, Spacy parçaları stokta. Türkiye geneline kargo. WhatsApp: 0534 899 68 17"
  },
  {
    slug: "yamaha",
    name: "Yamaha",
    desc: "Yüksek performanslı efsanevi Japon motosiklet markası",
    isAuthorized: false,
    badge: "Yedek Parça & Servis",
    popularParts: ["NMAX Kayış", "XMAX Filtre Seti", "Fren Balatası", "Varyatör Filtresi", "Akü", "Buji"],
    popularModels: ["NMAX 125/155", "XMAX 250", "MT-25", "R25"],
    seoTitle: "Yamaha Motosiklet Yedek Parça İstanbul — Paşa Motor",
    seoDescription: "İstanbul Fatih Yamaha yedek parça ve profesyonel servis. NMAX ve XMAX orijinal parçaları stokta. Türkiye geneline kargo. WhatsApp: 0534 899 68 17"
  },
  {
    slug: "cfmoto",
    name: "CFMOTO",
    desc: "Performans ve şık tasarımlı motosikletler",
    isAuthorized: false,
    badge: "Yedek Parça & Servis",
    popularParts: ["Yağ Filtresi", "Hava Filtresi", "Fren Balatası", "Zincir Seti", "Ayna", "Grenaj"],
    popularModels: ["250NK", "250SR", "450SR", "150NK"],
    seoTitle: "CFMOTO Motosiklet Yedek Parça İstanbul — Paşa Motor",
    seoDescription: "İstanbul Fatih CFMOTO yedek parça ve profesyonel servis. 250NK, 250SR parçaları stokta. Türkiye geneline kargo. WhatsApp: 0534 899 68 17"
  },
  {
    slug: "vespa",
    name: "Vespa",
    desc: "Güvenlik, konfor ve şık tasarımı bir arada sunan seçkin scooter markası",
    isAuthorized: false,
    badge: "Yedek Parça & Servis",
    popularParts: ["Yağ Filtresi", "Varyatör Kayışı", "Fren Balatası", "Ayna", "Rüzgarlık", "Akü"],
    popularModels: ["Primavera 150", "Sprint 150", "GTS 300", "LX 150"],
    seoTitle: "Vespa Motosiklet Yedek Parça İstanbul — Paşa Motor",
    seoDescription: "İstanbul Fatih Vespa yedek parça ve profesyonel servis. Primavera ve Sprint parçaları stokta. Türkiye geneline kargo. WhatsApp: 0534 899 68 17"
  },
  {
    slug: "mondial",
    name: "Mondial",
    desc: "Yaygın servis ağı ve uygun fiyatlı modeller",
    isAuthorized: false,
    badge: "Yedek Parça & Servis",
    popularParts: ["Karbüratör", "Fren Balatası", "Debriyaj Tası", "Kayış", "Akü", "Buji"],
    popularModels: ["Drift L 125", "Nevada 250", "Vulture", "Rival"],
    seoTitle: "Mondial Motosiklet Yedek Parça İstanbul — Paşa Motor",
    seoDescription: "İstanbul Fatih Mondial yedek parça ve profesyonel servis. Orijinal ve yan sanayi parça seçenekleri. Türkiye geneline kargo. WhatsApp: 0534 899 68 17"
  }
];
