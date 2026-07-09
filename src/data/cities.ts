export interface CityData {
  slug: string
  name: string
  nameTR: string
  region: string
  population: string
  districts: string[]
  seoTitle: string
  seoDescription: string
  h1: string
  intro: string
  cargoInfo: string
  localInfo: string
  faqs: { question: string; answer: string }[]
}

export const CITIES: CityData[] = [
  {
    slug: "ankara",
    name: "Ankara",
    nameTR: "Ankara",
    region: "İç Anadolu",
    population: "5.7 milyon",
    districts: ["Çankaya", "Keçiören", "Mamak", "Yenimahalle", "Etimesgut"],
    seoTitle: "Ankara Motosiklet Yedek Parça — TVS Hero Falcon Kargo ile",
    seoDescription: "Ankara'ya motosiklet yedek parçası kargoya veriyoruz. TVS, Hero, Falcon, Işıldar orijinal parçalar. Aynı gün kargo. WhatsApp sipariş: 0534 899 68 17",
    h1: "Ankara'ya Motosiklet Yedek Parça Kargo",
    intro: "İstanbul Fatih'teki Paşa Motor olarak Ankara ve tüm ilçelerine (Çankaya, Keçiören, Mamak, Yenimahalle) TVS, Hero, Falcon ve Işıldar orijinal yedek parçaları kargoya veriyoruz.",
    cargoInfo: "Ankara'ya saat 14:00'a kadar verilen siparişler aynı gün kargoya verilir. Yurtiçi Kargo ve MNG Kargo ile 1-2 iş günü içinde Ankara kapınıza ulaşır.",
    localInfo: "Ankara'da motosiklet yedek parçası bulmakta güçlük çekiyorsanız, İstanbul Fatih'te yetkili servisimizden orijinal parçaları WhatsApp ile sipariş verebilirsiniz.",
    faqs: [
      { question: "Ankara'ya kaç günde kargo gelir?", answer: "Aynı gün kargoya verilen siparişler 1-2 iş günü içinde Ankara'ya ulaşır." },
      { question: "Ankara'dan iade yapılabilir mi?", answer: "Evet, ürünü teslim aldıktan sonra 14 gün içinde iade hakkınız bulunmaktadır." },
      { question: "Ankara'da TVS yetkili servis var mı?", answer: "İstanbul Fatih'teki Paşa Motor TVS yetkili servisidir. Parçaları Ankara'ya kargoluyoruz." },
      { question: "Hangi kargo firmaları kullanılıyor?", answer: "Yurtiçi Kargo ve MNG Kargo ile gönderim yapıyoruz." }
    ]
  },
  {
    slug: "izmir",
    name: "İzmir",
    nameTR: "İzmir",
    region: "Ege",
    population: "4.4 milyon",
    districts: ["Konak", "Karşıyaka", "Bornova", "Buca", "Çiğli"],
    seoTitle: "İzmir Motosiklet Yedek Parça — TVS Hero Orijinal Parça Kargo",
    seoDescription: "İzmir'e motosiklet yedek parçası kargo. TVS, Hero, Falcon orijinal parçalar. Konak, Bornova, Karşıyaka teslimat. WhatsApp: 0534 899 68 17",
    h1: "İzmir'e Motosiklet Yedek Parça Kargo",
    intro: "Paşa Motor olarak İzmir ve tüm ilçelerine (Konak, Karşıyaka, Bornova, Buca, Çiğli) orijinal motosiklet yedek parçalarını kargoluyoruz.",
    cargoInfo: "İzmir'e 1-2 iş günü içinde teslimat. Saat 14:00'a kadar sipariş verin, aynı gün kargoya verelim.",
    localInfo: "İzmir'de TVS, Hero, Falcon yetkili servis parçası arıyorsanız, İstanbul'dan WhatsApp ile kolayca sipariş verebilirsiniz.",
    faqs: [
      { question: "İzmir'e kargo ücreti ne kadar?", answer: "500 TL ve üzeri siparişlerde kargo ücretsizdir." },
      { question: "İzmir Konak'a kaç günde gelir?", answer: "1-2 iş günü içinde tüm İzmir ilçelerine teslimat yapılır." },
      { question: "TVS Apache parçası İzmir'de bulunur mu?", answer: "Paşa Motor'da TVS Apache tüm model parçaları stokta mevcuttur, İzmir'e kargoluyoruz." },
      { question: "Kapıda ödeme var mı?", answer: "Evet, kapıda ödeme seçeneğimiz mevcuttur." }
    ]
  },
  {
    slug: "bursa",
    name: "Bursa",
    nameTR: "Bursa",
    region: "Marmara",
    population: "3.2 milyon",
    districts: ["Osmangazi", "Nilüfer", "Yıldırım", "Mudanya", "Gemlik"],
    seoTitle: "Bursa Motosiklet Yedek Parça — Orijinal TVS Hero Kargo",
    seoDescription: "Bursa'ya motosiklet yedek parçası kargo. Osmangazi, Nilüfer, Yıldırım teslimat. TVS Hero Falcon orijinal parçalar. 0534 899 68 17",
    h1: "Bursa'ya Motosiklet Yedek Parça Kargo",
    intro: "Bursa ve çevre ilçelerine (Osmangazi, Nilüfer, Yıldırım, Mudanya) TVS, Hero, Falcon ve Işıldar orijinal parçaları kargoluyoruz.",
    cargoInfo: "Bursa'ya İstanbul'a yakınlığı nedeniyle aynı gün ya da 1 iş günü içinde teslimat sağlanabilmektedir.",
    localInfo: "Bursa'dan sıklıkla sipariş alıyoruz. WhatsApp üzerinden şase numaranızı iletmeniz yeterli.",
    faqs: [
      { question: "Bursa'ya ne kadar sürede gelir?", answer: "İstanbul-Bursa yakınlığı sayesinde genellikle 1 iş günü içinde teslim edilir." },
      { question: "Hero Splendor parçası Bursa'da var mı?", answer: "Paşa Motor'da Hero Splendor tüm parçaları mevcuttur, Bursa'ya kargoluyoruz." },
      { question: "Nilüfer'e kargo yapıyor musunuz?", answer: "Evet, Bursa'nın tüm ilçelerine kargo gönderimi yapıyoruz." },
      { question: "Parça uyumunu nasıl kontrol ederim?", answer: "WhatsApp'tan şase numaranızı gönderin, size uyumlu parçayı bulalım." }
    ]
  },
  {
    slug: "antalya",
    name: "Antalya",
    nameTR: "Antalya",
    region: "Akdeniz",
    population: "2.6 milyon",
    districts: ["Muratpaşa", "Kepez", "Konyaaltı", "Alanya", "Manavgat"],
    seoTitle: "Antalya Motosiklet Yedek Parça — TVS Hero Kargo Aynı Gün",
    seoDescription: "Antalya'ya motosiklet yedek parçası kargo. Muratpaşa, Kepez, Alanya teslimat. TVS Hero Falcon orijinal parça. WhatsApp: 0534 899 68 17",
    h1: "Antalya'ya Motosiklet Yedek Parça Kargo",
    intro: "Antalya ve tüm ilçelerine (Muratpaşa, Kepez, Konyaaltı, Alanya, Manavgat) orijinal motosiklet yedek parçaları kargoya veriyoruz.",
    cargoInfo: "Antalya'ya 2 iş günü içinde teslimat. Yurtiçi Kargo ve MNG Kargo ile güvenli gönderim.",
    localInfo: "Antalya'da turizm sezonunda motosiklet kullanımı yoğunlaşır. Sezon öncesi bakım parçaları için WhatsApp'tan ulaşın.",
    faqs: [
      { question: "Alanya'ya kargo kaç günde gelir?", answer: "Antalya merkez ve ilçelerine 2 iş günü içinde teslimat yapılır." },
      { question: "Falcon parçası Antalya'da bulunur mu?", answer: "Paşa Motor Falcon yetkili servisidir. Tüm Falcon parçaları için kargo yapıyoruz." },
      { question: "Sezon başında toplu sipariş yapılabilir mi?", answer: "Evet, toplu siparişlerde özel fiyat için WhatsApp'tan iletişime geçin." },
      { question: "Manavgat'a gönderim yapıyor musunuz?", answer: "Evet, Antalya'nın tüm ilçelerine kargo gönderimi yapıyoruz." }
    ]
  },
  {
    slug: "konya",
    name: "Konya",
    nameTR: "Konya",
    region: "İç Anadolu",
    population: "2.3 milyon",
    districts: ["Selçuklu", "Karatay", "Meram", "Ereğli", "Akşehir"],
    seoTitle: "Konya Motosiklet Yedek Parça — Orijinal Parça Kargo ile",
    seoDescription: "Konya'ya TVS, Hero, Falcon motosiklet yedek parçası kargo. Selçuklu, Karatay, Meram teslimat. WhatsApp sipariş: 0534 899 68 17",
    h1: "Konya'ya Motosiklet Yedek Parça Kargo",
    intro: "Konya ve ilçelerine (Selçuklu, Karatay, Meram, Ereğli) TVS, Hero, Falcon ve Işıldar orijinal yedek parçaları kargoluyoruz.",
    cargoInfo: "Konya'ya 1-2 iş günü içinde teslimat. Faturalı ve garantili orijinal parça.",
    localInfo: "Konya'da tarım sezonunda motosiklet kullanımı artmaktadır. Dayanıklı parçalar için yetkili servis tercih edin.",
    faqs: [
      { question: "Konya'ya kargo ne kadar sürer?", answer: "Konya'ya 1-2 iş günü içinde teslimat sağlanmaktadır." },
      { question: "Selçuklu ilçesine teslimat yapıyor musunuz?", answer: "Evet, Konya'nın tüm ilçelerine kargo gönderimi mevcuttur." },
      { question: "Işıldar parçası Konya'da var mı?", answer: "Paşa Motor Işıldar yetkili servisidir, tüm parçalar için kargo yapıyoruz." },
      { question: "Faturalı satış yapıyor musunuz?", answer: "Evet, tüm satışlarımız faturalıdır." }
    ]
  },
  {
    slug: "adana",
    name: "Adana",
    nameTR: "Adana",
    region: "Akdeniz",
    population: "2.2 milyon",
    districts: ["Seyhan", "Yüreğir", "Çukurova", "Sarıçam", "Ceyhan"],
    seoTitle: "Adana Motosiklet Yedek Parça — TVS Hero Kargo Teslimat",
    seoDescription: "Adana'ya motosiklet yedek parçası kargo. Seyhan, Yüreğir, Çukurova teslimat. TVS Hero Falcon orijinal parça. 0534 899 68 17",
    h1: "Adana'ya Motosiklet Yedek Parça Kargo",
    intro: "Adana ve çevre ilçelerine TVS, Hero, Falcon ve Işıldar orijinal motosiklet yedek parçaları kargoluyoruz.",
    cargoInfo: "Adana'ya 2 iş günü içinde teslimat. Güvenli paketleme ile kırılmaz teslimat garantisi.",
    localInfo: "Adana'da yıl boyunca sıcak iklim nedeniyle motosiklet kullanımı yüksektir. Düzenli bakım için orijinal parça kullanın.",
    faqs: [
      { question: "Adana Seyhan'a kargo kaç gün sürer?", answer: "Adana merkez ve ilçelerine 2 iş günü içinde teslimat yapılır." },
      { question: "Ceyhan'a gönderim yapıyor musunuz?", answer: "Evet, Adana'nın tüm ilçelerine kargo gönderimi yapıyoruz." },
      { question: "TVS parçası Adana'da bulunur mu?", answer: "Paşa Motor TVS yetkili servisidir, tüm TVS parçaları için Adana'ya kargo yapıyoruz." },
      { question: "Parça garantisi var mı?", answer: "Tüm orijinal parçalarımız 1 yıl garanti kapsamındadır." }
    ]
  },
  {
    slug: "gaziantep",
    name: "Gaziantep",
    nameTR: "Gaziantep",
    region: "Güneydoğu Anadolu",
    population: "2.1 milyon",
    districts: ["Şahinbey", "Şehitkamil", "Nizip", "İslahiye", "Nurdağı"],
    seoTitle: "Gaziantep Motosiklet Yedek Parça — Kargo ile Hızlı Teslimat",
    seoDescription: "Gaziantep'e TVS, Hero, Falcon yedek parça kargo. Şahinbey, Şehitkamil teslimat. Orijinal parça garantisi. WhatsApp: 0534 899 68 17",
    h1: "Gaziantep'e Motosiklet Yedek Parça Kargo",
    intro: "Gaziantep ve ilçelerine (Şahinbey, Şehitkamil, Nizip) TVS, Hero, Falcon ve Işıldar orijinal parçaları kargoluyoruz.",
    cargoInfo: "Gaziantep'e 2-3 iş günü içinde teslimat. Sigortalı ve faturalı gönderim.",
    localInfo: "Gaziantep'te ticari motosiklet kullanımı yoğundur. Dayanıklı orijinal parçalarla daha az arıza.",
    faqs: [
      { question: "Gaziantep'e kargo kaç günde gelir?", answer: "Gaziantep'e 2-3 iş günü içinde teslimat yapılmaktadır." },
      { question: "Şehitkamil'e teslimat var mı?", answer: "Evet, Gaziantep'in tüm ilçelerine kargo gönderimi mevcuttur." },
      { question: "Hero motosiklet parçası Gaziantep'te var mı?", answer: "Paşa Motor Hero yetkili servisidir, tüm Hero parçaları için kargo yapıyoruz." },
      { question: "Sigortalı gönderim yapıyor musunuz?", answer: "Evet, tüm kargolarımız sigortalı olarak gönderilmektedir." }
    ]
  },
  {
    slug: "kocaeli",
    name: "Kocaeli",
    nameTR: "Kocaeli",
    region: "Marmara",
    population: "2.0 milyon",
    districts: ["İzmit", "Gebze", "Körfez", "Darıca", "Gölcük"],
    seoTitle: "Kocaeli İzmit Motosiklet Yedek Parça — Aynı Gün Kargo",
    seoDescription: "Kocaeli İzmit'e motosiklet yedek parçası. İstanbul'a yakınlık ile aynı gün kargo. TVS Hero Falcon orijinal parça. 0534 899 68 17",
    h1: "Kocaeli'ye Motosiklet Yedek Parça — Aynı Gün Kargo",
    intro: "İstanbul'a yakın konumuyla Kocaeli, İzmit, Gebze, Körfez ve Darıca'ya aynı gün veya 1 iş günü içinde teslimat yapıyoruz.",
    cargoInfo: "Kocaeli İstanbul'a yakın olduğundan aynı gün kargo mümkündür. Saat 14:00'a kadar sipariş verin.",
    localInfo: "Kocaeli'de sanayi bölgelerinde ticari kurye ve kargo motorları yoğun kullanılmaktadır.",
    faqs: [
      { question: "Gebze'ye kargo ne kadar sürer?", answer: "Kocaeli ve Gebze'ye genellikle aynı gün veya 1 iş günü içinde teslimat yapılır." },
      { question: "İzmit merkezine gönderim var mı?", answer: "Evet, İzmit ve tüm Kocaeli ilçelerine kargo gönderimi mevcuttur." },
      { question: "Falcon scooter parçası var mı?", answer: "Paşa Motor Falcon yetkili servisidir, tüm scooter parçaları stokta mevcuttur." },
      { question: "Gölcük'e teslimat yapıyor musunuz?", answer: "Evet, Gölcük dahil tüm Kocaeli ilçelerine kargo yapıyoruz." }
    ]
  },
  {
    slug: "mersin",
    name: "Mersin",
    nameTR: "Mersin",
    region: "Akdeniz",
    population: "1.9 milyon",
    districts: ["Yenişehir", "Mezitli", "Toroslar", "Akdeniz", "Tarsus"],
    seoTitle: "Mersin Motosiklet Yedek Parça — TVS Hero Kargo Teslimat",
    seoDescription: "Mersin'e motosiklet yedek parçası kargo. Yenişehir, Mezitli, Tarsus teslimat. Orijinal TVS Hero Falcon parça. WhatsApp: 0534 899 68 17",
    h1: "Mersin'e Motosiklet Yedek Parça Kargo",
    intro: "Mersin ve ilçelerine (Yenişehir, Mezitli, Toroslar, Tarsus) TVS, Hero, Falcon ve Işıldar orijinal parçaları kargoluyoruz.",
    cargoInfo: "Mersin'e 2 iş günü içinde teslimat. Güvenli paketleme ile hasarsız teslimat.",
    localInfo: "Mersin limanı çevresinde ticari motosiklet kullanımı yoğundur. Orijinal parça ile daha uzun ömür.",
    faqs: [
      { question: "Mersin Tarsus'a kargo kaç gün sürer?", answer: "Mersin ve Tarsus'a 2 iş günü içinde teslimat yapılır." },
      { question: "Yenişehir ilçesine teslimat var mı?", answer: "Evet, Mersin'in tüm ilçelerine kargo gönderimi mevcuttur." },
      { question: "TVS motosiklet parçası Mersin'de var mı?", answer: "Paşa Motor TVS yetkili servisidir, tüm TVS parçaları Mersin'e kargoluyoruz." },
      { question: "Büyük parçalar kargoya verilir mi?", answer: "Evet, motor ve şasi parçaları dahil tüm parçaları kargoluyoruz." }
    ]
  }
]

export const getCityBySlug = (slug: string): CityData | undefined =>
  CITIES.find(c => c.slug === slug)
