import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

console.log("Starting Supabase Authenticated Article Insertion...");

// Initialize Supabase
const sbUrl = process.env.VITE_SUPABASE_URL || "";
const sbKey = process.env.VITE_SUPABASE_ANON_KEY || "";

if (!sbUrl || !sbKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables!");
  process.exit(1);
}

const supabase = createClient(sbUrl, sbKey);

const articles = [
  {
    title: "Kuba Motor Yedek Parça Rehberi - En Sık Aranan 20 Parça",
    slug: "kuba-motor-yedek-parca-rehberi-en-sik-aranan-20-parca",
    excerpt: "Kuba motor sahiplerinin en çok ihtiyaç duyduğu yedek parçalar, güncel 2026 fiyatları, montaj süreleri ve orijinal parça farkları içeren kapsamlı rehber.",
    category: "rehber",
    seo_title: "Kuba Motor Yedek Parça Rehberi - En Sık Aranan 20 Parça",
    seo_description: "Kuba motorların en sık aranan 20 yedek parçası, güncel fiyatlar ve montaj bilgileri. Orijinal Kuba yedek parçaları Paşa Motor güvencesiyle Fatih'te.",
    cover_image: "/images/kuba_parts.png",
    content: `# Kuba Motor Yedek Parça Rehberi - En Sık Aranan 20 Parça

Kuba motor kullanıcıları için doğru ve kaliteli yedek parça temini, motosikletlerinin performansı, sürüş güvenliği ve motor ömrü açısından hayati bir öneme sahiptir. Çin kökenli ancak Türkiye pazarına özel olarak uyarlanmış Kuba modellerinin (Superlight, Trend, Fighter, TK03 vb.) kronik ihtiyaçları ve aşınan bileşenleri zaman içerisinde eskiyebilir. Paşa Motor olarak, İstanbul Fatih’teki yetkili servisimizde Kuba motosiklet sahiplerine orijinal ve sertifikalı muadil parça desteği sunmaktayız.

Bu yazımızda, Kuba motosikletlerde ve scooterlarda en sık yıpranan, değişime ihtiyaç duyan en önemli 20 yedek parçayı derinlemesine listeliyoruz. İşçilik, montaj süreleri ve orijinal parça kullanmanın uzun vadedeki avantajlarını teknik ayrıntılarla açıklayacağız.

## Neden Orijinal Kuba Yedek Parça Kullanmalısınız?

Kuba motosikletler için piyasada "muadil" veya "yan sanayi" adı altında satılan pek çok parça mevcuttur. Ancak elektrik ünitelerinden şanzıman dişlilerine, piston ve silindir setlerinden fren balatalarına kadar hayati parçalarda orijinal yerine yan sanayi kullanmak çok kısa sürede daha büyük masraflarla karşılaşmanıza yol açabilir.

*   Garanti Güvencesi: Orijinal parça değişimi yetkili servisimiz bünyesinde yapıldığında belirli bir parça ve montaj garantisi sağlar.
*   Tam Uyum ve Tolerans: Orijinal parçalar, motor blok ve şase toleranslarına birebir uyumludur. Titreşimi ve erken aşınmayı önler.
*   Yakıt Ekonomisi: Orijinal hava filtreleri ve karbüratör memeleri, doğru yakıt-hava karışımı sağlar.

Motosikletinizi uzun yıllar güvenle kullanmak istiyorsanız, ihtiyacınız olan tüm seçenekleri hızlıca incelemek için [/yedek-parca](/yedek-parca) sayfamıza göz atabilirsiniz.

## En Sık Aranan 20 Kuba Motor Yedek Parçası ve Fiyat Detayları (2026)

Aşağıdaki tabloda, teknik uzmanlarımızın sıklıkla değiştirdiği parçalar, tahmini maliyet aralıkları ve Fatih'teki servisimizde gerçekleştirdiğimiz montaj/işçilik sürelerini görebilirsiniz:

| No | Parça Adı | Açıklama | Fiyat Aralığı (TL) | Servis Montaj Süresi |
|---|---|---|---|---|
| 1 | Komple Silindir Seti | Motor hacmine özel piston, sekman, pim ve contalar dahil settir. | 1.800 - 3.200 | 1.5 - 2 Saat |
| 2 | Karbüratör Komple | Yakıt püskürtme ve karışım dengesini sağlayan mekanik aksam. | 950 - 1.650 | 45 Dakika |
| 3 | Krank Mili | Piston hareketini dairesel harekete çeviren çelik döküm mil. | 2.200 - 3.800 | 3 Saat |
| 4 | Arka Amortisör Seti | Çiftli veya tekli (monoshock) süspansiyon elemanı. | 1.200 - 2.400 | 30 Dakika |
| 5 | Varyatör & Baget Seti | Scooterlar için aktarma organı ve debriyaj dengesi. | 750 - 1.300 | 40 Dakika |
| 6 | Ön & Arka Dişli Seti | Zincir gücünün arka tekerleğe ideal aktarımını sağlayan dişliler. | 800 - 1.500 | 50 Dakika |
| 7 | O-Ringli Dişli Zinciri | Aşınmaya yüksek mukavemet gösteren dayanıklı zincir yapısı. | 950 - 1.800 | 25 Dakika |
| 8 | Marş Motoru | Aküden aldığı elektrikle motora ilk hareketi veren elektrik motoru. | 650 - 1.100 | 30 Dakika |
| 9 | Debriyaj Balatası Seti | Vitesli modellerde gücün kontrollü kavranmasını sağlayan balatalar. | 700 - 1.400 | 60 Dakika |
| 10 | Gaz ve Debriyaj Teli | Çelik örgülü, aşınmaya karşı korumalı spiral telleri. | 150 - 350 | 15 Dakika |
| 11 | Ön Fren Disk Aynası | Isı transfer delikli yüksek mukavemetli çelik disk. | 850 - 1.600 | 30 Dakika |
| 12 | Ön/Arka Balata (Sinterli) | Yüksek sıcaklığa dayanıklı, dozajlaması kararlı balata. | 300 - 750 | 15 Dakika |
| 13 | Hava Filtresi Elemanı | Motor emiş havasını tozlardan arındıran sünger veya kağıt filtre. | 150 - 400 | 10 Dakika |
| 14 | Yağ Süzgeci ve Filtresi | Motor içi aşınma tortularını temizleme elemanı. | 120 - 250 | 10 Dakika |
| 15 | Buji (NGK Dirençli) | İdeal zamanlamada ateşleme sağlayan yüksek performanslı buji. | 180 - 450 | 10 Dakika |
| 16 | Eksantrik Zincir Seti | Sübap zamanlamasını krank ile senkronize eden hassas zincir. | 600 - 1.200 | 1.5 Saat |
| 17 | Krank Keçesi Seti | Motor yağı sızıntılarını engelleyen sızdırmazlık contaları. | 250 - 550 | 1 Saat |
| 18 | Konjektör (Regülatör) | Statörden gelen elektriği 12V DC bandına sabitleyen devre. | 450 - 950 | 20 Dakika |
| 19 | CDI Ateşleme Ünitesi | Devir sayısına göre ateşleme eğrisini çizen elektronik beyin. | 550 - 1.250 | 15 Dakika |
| 20 | Far Komple & Göstergeler| Yüksek aydınlatma gücüne sahip orijinal reflektör ve gösterge panelleri. | 1.200 - 2.800 | 30 Dakika |

*Not: Tabloda verilen fiyatlar 2026 yılı için ortalama parça maliyetleri olup döviz kuru ve spesifik modellere (örneğin Kuba Superlight 200 vs Kuba Trendy 50) göre değişiklik gösterebilir. İşçilik ve kusursuz montaj fiyatlandırması için mutlaka teknik ekibimizle iletişime geçiniz.*

## Parça Seçerken Karşılaşılan Kritik Zorluklar

Kuba yedek parçalarında en büyük problem, şase numaralarının her zaman yedek parça katalogları ile kusursuz eşleşmemesidir. Özellikle ithal edilen farklı parti serilerinde soket yapısı farklı statörler veya mil kalınlıkları değişen kranklar kullanılabilmektedir. 

Bu noktada uzman bir usta desteği olmadan yapılacak parça alımları uyumsuzluk yaratacaktır. İstanbul Fatih ilçesindeki motosiklet sahipleri, servisimize gelerek doğrudan nokta tespiti ve şase uyumlu parça montajı hizmeti alabilir. Detaylı adres ve dükkan konumu bilgilerimize ulaşmak, randevu oluşturmak için [/iletisim](/iletisim) sayfamızı ziyaret edebilirsiniz.

## Sıkça Sorulan Sorular (SSS)

### 1. Kuba motorların yedek parçaları diğer Çinli markalarla (RKS, Mondial vb.) uyumlu mudur?
Evet, kimi yürüyen aksam ve motor içi parçaları (GY6 blok şanzıman dişlileri vb.) ortak fabrikalarda üretildiğinden uyumluluk gösterebilir. Ancak karoser plastikleri, sinyalizasyon üniteleri ve elektrik enjeksiyon soketleri modele göre birebir farklılık gösterir. Orijinal parça seçmenizi öneririz.

### 2. İnternetten yedek parça alırken nelere dikkat etmeliyiz?
Satın alacağınız parçanın kesin şase uyumu ve elektrik soketi yapısını bilmeniz gerekir. Ayrıca sahte ambalajlı taklit parçalardan kaçınmalı, güvenilir yetkili bayilerden alışveriş yapmalısınız.

### 3. Değişen parçalarda montaj garantisi veriyor musunuz?
Evet, Paşa Motor bünyesinde değiştirilen tüm orijinal yedek parçalarımız ve montaj işçiliğimiz firmamızın servis garantisi ve servis güvencesi altındadır.

### 4. Parça değişimi sonrasında motorun rodaj ihtiyacı olur mu?
Eğer motor içi parçalardan piston, silindir, sekman veya krank mili gibi sürtünmeye dayalı mekanik parçalar değiştiyse, ilk 500 km boyunca yumuşak bir sürüş yapılması ve yüksek devirlerden kaçınılması gerekmektedir.

## Paşa Motor ile Doğrudan WhatsApp Üzerinden İletişim

Aradığınız Kuba yedek parçasının stok durumunu sorgulamak, montaj için fiyat teklifi almak veya en kısa sürede servis randevusu oluşturmak için doğrudan WhatsApp hattımız üzerinden teknik ekibimizle görüşebilirsiniz:

💬 WhatsApp Üzerinden Hızlı Bilgi Alın: [wa.me/905348996817](https://wa.me/905348996817)

*Motosikletinizin sağlığı ve sürüş güvenliğiniz için merdiven altı tamirciler yerine her zaman donanımlı ve yetkin servisleri tercih edin. Paşa Motor ekibi olarak her zaman yanınızdayız!*
`,
    is_published: true,
    created_at: new Date().toISOString()
  },
  {
    title: "Hero Motosiklet İstanbul Yetkili Servisi - Paşa Motor",
    slug: "hero-motosiklet-istanbul-yetkili-servisi-yeni-seo",
    excerpt: "Dünyanın en büyük iki tekerlekli üreticilerinden biri olan Hero motosikletlerin İstanbul yetkili servis avantajları, Fatih konumumuz ve güncel bakım rehberimiz.",
    category: "rehber",
    seo_title: "Hero Motosiklet İstanbul Yetkili Servisi - Paşa Motor",
    seo_description: "Hero motosiklet İstanbul yetkili servis hizmetleri, Fatih'teki merkezimizde. Dash, Xpulse, Pleasure periyodik bakım fiyatları ve orijinal yedek parçalar.",
    cover_image: "/images/hero_service.png",
    content: `# Hero Motosiklet İstanbul Yetkili Servisi - Paşa Motor

Motosiklet dünyasında dayanıklılığı, düşük yakıt tüketimi ve ekonomik fiyat tarifeleri ile adından sıkça söz ettiren Hint devi Hero MotoCorp, Türkiye yollarında da yüz binlerce kurye ve bireysel sürücü tarafından tercih edilmektedir. Hero Xpulse 200, Dash 110/125, Pleasure, Duet ve Thriller gibi ikonik modellerin uzun vadede yıpranma oranlarının minimale indirilmesi ancak nitelikli bir yetkili servis bakımı ile mümkündür.

İstanbul’un tarihi kalbi Fatih’te faaliyet gösteren Paşa Motor, Hero marka motosikletlerin resmi yetkili servisi olarak uzman teknisyen kadrosu ve orijinal yedek parça stoğu ile hizmet sunmaktadır. 

## Yetkili Servis Bakımının Önemi: Garanti Koruma

Birçok motosiklet sürücüsü, servis maliyetlerini azaltmak amacıyla periyodik bakımları mahalle arasındaki gayriresmi tamircilerde yaptırmayı tercih etmektedir. Ancak bu karar, çok pahalıya patlayan sonuçlar doğurabilir:

1.  Garanti İptali: Hero’nun fabrika çıkışı sunduğu (modeline göre 5 yıl veya 50.000 km) devasa garanti süresi, tek bir yetkisiz müdahale, yan sanayi filtre kullanımı veya kayıt dışı yağ değişimi ile anında devre dışı kalır.
2.  Yazılım ve OBD Arıza Tespit: Modern enjeksiyonlu Hero modellerinde yaşanan sensör arızaları sadece orijinal diagnostik OBD cihazları ile tespit edilebilir. Yetkisiz servisler bu cihazlara erişemezler.
3.  Hassas Kalibrasyon: Sübap boşluğu ayarları, tork anahtarı kullanılmayan işlemlerde gevşer veya aşırı sıkışarak silindir kapağı hasarlarına (sübap erimesine) yol açar.

Hero motosikletinizin orijinal ömrünü korumak için güncel stok ve parça detaylarına ulaşmak üzere [/yedek-parca](/yedek-parca) bölümümüzü inceleyebilirsiniz.

## Hero Periyodik Bakım Kilometre Aralıkları ve Detayları

Hero motosikletlerde periyodik bakım aralıkları, motor blok ömrü için kritik öneme sahip adımlardan oluşur. Paşa Motor olarak uyguladığımız bakım protokolü şu şekildedir:

### 1. İlk 1.000 Km Rodaj Bakımı
*   Yağ Değişimi: Fabrikasyon mikro çapak içeren ilk motor yağının boşaltılması ve yüksek kaliteli yağ dolumu.
*   Sübap Ayarı: Rodaj süresince yerine oturan sübapların fabrika toleranslarına (genelde emme 0.08 mm, egzoz 0.12 mm) çekilmesi.
*   Cıvata Kontrolleri: Şase, maşa ve motor bilye bağlantılarının torklanması.

### 2. Her 3.000 - 4.000 Km Ara Bakım
*   Hava Filtresi: Temizlik veya tozlanma durumuna göre değişim.
*   Buji Kontrolü: Elektrot aralığının temizlenmesi ve tırnak boşluğu ölçümü.
*   Zincir Ayarı: Zincir temizliği, özel yağ ile yağlanması ve ideal sarkma toleransına (25-30 mm) getirilmesi.

### 3. Ağır Bakımlar (Her 12.000 Km'de Bir)
*   Ön Süspansiyon Yağ Değişimi: Amortisör keçelerinin incelenmesi ve hidrolik yağının yenilenmesi.
*   Fren Hidrolik Sıvısı: DOT4 fren sıvısının nem ölçümü yapılarak tamamen değiştirilmesi.
*   Debriyaj Sacları ve Balatası: Performans düşüşü, kaçırma olup olmadığının kontrol edilmesi.

## Hero Modelleri Tahmini Bakım ve Parça Maliyetleri (2026)

Motosikletinizin bakım maliyetleri konusunda şeffaf bilgi sahibi olmanız için oluşturduğumuz 2026 yılı tahmini fiyat listemiz:

| Model Grubu | Periyodik Bakım Ücreti (Yağ+Filtreler+İşçilik) | Debriyaj Komple Değişimi | Amortisör Keçe Revizyonu |
|---|---|---|---|
| Dash 110 / Pleasure | 850 TL - 1.200 TL | 1.800 TL - 2.400 TL | 1.100 TL - 1.500 TL |
| Xpulse 200 4V / T | 1.100 TL - 1.600 TL | 2.500 TL - 3.500 TL | 1.400 TL - 1.900 TL |
| Thriller / Hunk 150 | 950 TL - 1.400 TL | 2.100 TL - 2.800 TL | 1.200 TL - 1.600 TL |

*Yukarıdaki fiyatlar parça durumuna ve ilave saptanacak arızalara göre değişebilir. Net teklif almak ve dükkanımızı doğrudan Fatih'te ziyaret etmek için iletişim adreslerimizi [/iletisim](/iletisim) sayfamızda bulabilirsiniz.*

## Sıkça Sorulan Sorular (SSS)

### 1. Hero motosiklet garanti süresi ne kadardır?
Hero, Türkiye pazarına sunduğu modellerde periyodik bakımların yetkili servislerde yapılması kaydıyla 5 Yıl veya 50.000 Kilometre distribütör garantisi sunmaktadır. Bu süre sektör standartlarının oldukça üzerindedir.

### 2. Bakımlarda hangi marka motor yağı kullanıyorsunuz?
Hero standartlarının ve mühendislik onaylarının talep ettiği tam sentetik veya yarı sentetik yüksek performans yağlarını (Motul, Shell Advance, Hero Genuine Oil) tercih ediyoruz.

### 3. XPulse 200 modelinin kronik stop etme veya tır tır ses problemini çözebiliyor musunuz?
Evet, XPulse modellerinde yazılım güncellemesi ve sübap ayarı hassasiyeti stop etme problemlerini %99 oranında giderir. Yetkili servisimizde güncel yazılımlar eksiksiz yüklenmektedir.

### 4. Randevusuz gelirsem aynı gün bakım yapılır mı?
Yol güvenliği riski oluşturan acil arızalar hariç, yoğunluğu yönetebilmek adına randevulu çalışmaktayız. Randevulu araçlar doğrudan işleme alınır ve ortalama 1 saat içinde telim edilir.

## Paşa Motor WhatsApp İletişim Hattı

Hero motosikletiniz için randevu almak, güncel yedek parça fiyatlarını öğrenmek veya teknik destek ekibimizle anında konuşmak için WhatsApp hattımızdan bizimle iletişime geçebilirsiniz:

📞 Müşteri Temsilcimizle Görüşün: [wa.me/905348996817](https://wa.me/905348996817)

*İstanbul’un neresinde olursanız olun, güvenilir ellerde, orijinal kalitede bakım almak için Paşa Motor her zaman yanınızda!*
`,
    is_published: true,
    created_at: new Date().toISOString()
  },
  {
    title: "TVS Motosiklet Yedek Parça Fiyatları 2026",
    slug: "tvs-motosiklet-yedek-parca-fiyatlari-2026-yeni",
    excerpt: "TVS Apache RTR 150/180/200, Raider, Jupiter ve Ntorq modelleri için 2026 yılı güncel orijinal yedek parça fiyat endeksi ve teknik montaj detayları.",
    category: "rehber",
    seo_title: "TVS Motosiklet Yedek Parça Fiyatları 2026 - Paşa Motor",
    seo_description: "TVS Apache, Jupiter, Ntorq, Raider orijinal yedek parça fiyat listesi ve stok takibi. Fatih Paşa Motor orijinal parça tedarik ve montaj merkezi.",
    cover_image: "/images/tvs_parts.png",
    content: `# TVS Motosiklet Yedek Parça Fiyatları 2026

Hindistan’ın lider otomotiv ve motosiklet devlerinden biri olan TVS Motor Company, özellikle RTR serisi (Apache) vitesli modelleri ve Ntorq, Jupiter gibi yüksek torklu şehir içi scooterları ile Türkiye’de geniş bir kullanıcı kitlesine ulaşmıştır. Yarış pistlerinden esinlenen şase tasarımları ve yüksek devirli motor yapıları nedeniyle, TVS motorların bakımlarında kullanılan yedek parçaların orijinal olması hayati önem taşır.

Fatih Kocamustafapaşa ve Fındıkzade bölgelerinde hizmet veren Paşa Motor olarak, TVS motosiklet orijinal parça stoğumuz ile 2026 yılında da en uygun fiyatlı garantili çözümleri sunuyoruz.

## TVS Apache ve Ntorq Modellerinde Erken Aşınan Parçalar

Motosikletlerin çalışma dinamikleri gereği bazı parçalar sürtünme ve yüksek ısıya maruz kalarak diğerlerine göre çok daha hızlı yıpranır. TVS modellerinde özellikle şu aksamların takip edilmesi önerilir:

1.  Varyatör Kayışı ve Bagalar (Ntorq / Jupiter): Sürekli değişken şanzımana (CVT) sahip scooterlarda, kayış ömrü ortalama 15.000 - 18.000 km arasındadır. Aşınmış kayış, yakıt tüketimini artırır ve kopması halinde yolda kalmanıza neden olur.
2.  Debriyaj Tas ve Balata Kompleksi (Apache serisi): Özellikle yoğun şehir içi trafikte yapılan yarım debriyaj kullanımları debriyaj saclarını morartarak tork kaybına yol açar.
3.  Monoshock Arka Amortisör: Apache modellerinde spor kullanım nedeniyle arka amortisör bilye ve keçeleri zamanla aşınır ve yağ kaçırmaya başlar.

Stok durumumuzu sorgulamak, yedek parçaları anında satın almak için doğrudan [/yedek-parca](/yedek-parca) kataloğumuzu inceleyebilirsiniz.

## TVS Orijinal Yedek Parça Fiyat Endeksi (2026 Listesi)

Aşağıdaki liste, popüler TVS Apache RTR 150/180/200, TVS Raider 125, Ntorq ve Jupiter 110/125 sürücülerinin 2026 yılında servisimizde yaptıracağı parça değişimlerinin yaklaşık maliyetlerini içermektedir:

| Parça Grubu / Adı | Uyumlu Modeller | Orijinal Ürün Fiyatı (TL) | Atölye Montaj Süresi |
|---|---|---|---|
| Eksantrik Gergi Mili ve Zinciri | Apache RTR 150/180 | 750 TL - 1.250 TL | 90 Dakika |
| Varyatör Kayışı (Bando/Orijinal)| Ntorq 125 / Jupiter | 1.100 TL - 1.850 TL | 30 Dakika |
| Ön Amortisör Amortisör Borusu| Apache RTR (Çift) | 2.100 TL - 3.400 TL | 60 Dakika |
| Fren Kaliperi ve Üst Merkez | Tüm TVS Modelleri | 1.400 TL - 2.200 TL | 40 Dakika |
| Hava Filtresi Süngeri/Elemanı | Raider 125 / Apache | 180 TL - 420 TL | 10 Dakika |
| CDI Beyin Kartı (Ateşleme) | Apache 150 (Analog) | 950 TL - 1.800 TL | 15 Dakika |
| Ön Dişli, Arka Dişli ve Zincir Seti| Apache/Raider Komple | 1.200 TL - 2.400 TL | 45 Dakika |
| Debriyaj Tas Komple | Apache RTR 200 4V | 3.200 TL - 4.800 TL | 75 Dakika |

*Göz Atın: Belirtilen parça fiyatları ithalatçı döviz endeksli olarak guncellenmektedir. Tam fiyat doğrulaması ve işçilik dahil toplu iskonto fırsatları için teknik servisimiz ile iletişime geçebilirsiniz. İletişim sayfamıza ulaşmak ve harita tarifimizi almak için [/iletisim](/iletisim) sayfamızı inceleyin.*

## Orijinal Parça Kullanılmadığında Yaşanacak Kronik TVS Sorunları

TVS Apache RTR serisi motosikletlerde ateşleme sistemi son derece hassastır. Yan sanayi buji, kalitesiz bobin veya taklit CDI beyin takıldığında, motor devir kesiciye girdiğinde tekleme yapma, ani güç kaybı veya egzoz patlatma eğilimi gösterir. Aynı şekilde orijinal debriyaj teli kullanılmadığında yumuşaklık ayarı kaçarak vites geçişlerini aşırı kemikli hale getirir ve şanzıman hilallerine zarar verir.

Bu yüzden Paşa Motor bünyesinde asla sahte veya menşei belirsiz parçalar bulundurmuyoruz ve tüm montajlarımızda üreticinin servis kitapçık tork değerlerini uyguluyoruz.

## Sıkça Sorulan Sorular (SSS)

### 1. TVS yedek parçaları Türkiye'de kolay bulunuyor mu?
Evet, TVS'nin ana distribütör yedek parça tedarik ağı son derece güçlüdür. Paşa Motor olarak sıklıkla ihtiyaç duyulan rutin bakım malzemelerini her an stoğumuzda bulunduruyoruz. Nadir görülen şanzıman dişlisi veya karter parçası gibi durumları ise 3 iş günü içinde temin edebiliyoruz.

### 2. TVS Jupiter scooterlarda kayış koparsa ne olur?
Scooter yolda kalır, marş bassanız dahi tekerlek dönmez. Kopan kayış parçaları varyatör fanına veya debriyaj balatasına sıkışarak varyatör kapağını çatlatabilir. Bu yüzden kayış yıpranmalarını her 5.000 km'de bir kontrol etmek gerekir.

### 3. Sinterli or metalik balata farkı TVS Apache modellerinde fiyata yansır mı?
Evet, sinterli balatalar bakır alaşımlı olduğundan daha pahalıdır ancak yüksek süratlerde ısınmaya karşı maksimum direnç sağlar ve fren dozajlamasını kararlı kılar. Bütçenize ve sürüş tarzınıza göre seçim yapabilirsiniz.

### 4. TVS Raider 125 modelinin rölantide dalgalanma yapması yazılımsal mıdır?
Genellikle oksijen sensörünün (O2) kirlenmesi veya egzoz manifoldundaki hava sızıntılarından kaynaklanır. OBD sistemimiz sayesinde sorunu anında bulup kalibre edebiliyoruz.

## TVS Destek ve Parça WhatsApp Siparişi

Aradığınız parçanın stoğumuzda olup olmadığını sorgulamak, motora uyumlu şase parça sorgu desteği almak veya usta montaj randevusu oluşturmak için doğrudan WhatsApp hattımıza yazın:

💬 WhatsApp Hızlı TVS Hattı: [wa.me/905348996817](https://wa.me/905348996817)

*Motosikletinizde güvenliği ve performansı şansa bırakmayın, doğrudan uzmanlardan orijinal hizmet alın!*
`,
    is_published: true,
    created_at: new Date().toISOString()
  },
  {
    title: "Mondial Motosiklet Yedek Parça - Fatih İstanbul",
    slug: "mondial-motosiklet-yedek-parca-fatih-istanbul-yeni",
    excerpt: "İstanbul Fatih'te Mondial yedek parça arayan motosiklet ve scooter sahipleri için stok, periyodik tamir, orijinal parçaların önemi ve ucuz parça tuzağı.",
    category: "rehber",
    seo_title: "Mondial Motosiklet Yedek Parça - Fatih İstanbul",
    seo_description: "Mondial yedek parça İstanbul Fatih yetkili servis güvencesi. Drift L, Vulture, Strada, Wing, 125 Lavinia yedek parça fiyatları ve stok durumu.",
    cover_image: "/images/mondial_parts_fatih.png",
    content: `# Mondial Motosiklet Yedek Parça - Fatih İstanbul

Türkiye’nin en yaygın motosiklet markalarından biri olan Mondial, her bütçeye uygun scooterlar, commuter motosikletler ve cub modelleri ile özellikle paket servis kuryelerinin, günlük iş-ev ulaşımını sağlayan commuter sürücülerinin adeta sağ koludur. Mondial MH Drift L, Vulture I, Strada, Wing, Nevada ve Cub serileri çok yoğun koşullarda çalıştırıldığından periyodik aşınmaya tabidirler.

İstanbul’un en eski ve tecrübeli motosiklet atölyelerinin yer aldığı Fatih bölgesinde, Paşa Motor olarak Mondial sahiplerinin aradığı tüm kritik yedek parçaları tam uyumlu şase kodları ile sunar, montaj ve onarımlarını titizlikle gerçekleştiririz.

## Paket Servis Sektöründe Mondial Motosikletlerin Önemi ve Bakımı

Kuryelik ve ekspres taşımacılık yapan Mondial motorların günlük yaptıkları kilometre çok yüksek limitlerdedir. Zamanın paraya eşit olduğu bu düzende, kalitesiz bir parça nedeniyle motorun yolda kalması kurye için gelir kaybı demektir.

*   Sürekli Yüksek Isı: Paket servis motorları günde ortalama 10-12 saat dur-kalk esasına göre çalışır. Bu soğutma şartlarını zorlaştırarak subap ayarlarının hızlı bozulmasına ve motor yağın erken incelerek özelliğini kaybetmesine neden olur.
*   Varyatör Aşınması: Scooter kullanan kuryelerde ön varyatör bagaları ve arka debriyaj göbeğinin bilyeleri aşırı yük altındadır. Aşındıklarında çekiş gücü sıfırlanır.
*   Fren Balatası Tüketimi: Günde yüzlerce kez fren sıkan bir kuryenin balata ömrü bireysel bir kullanıcıya kıyasla 4 kat daha hızlı biter.

Stoklarımızdaki Mondial uyumlu kaliteli varyatör, balata, şanzıman ve kaporta aksamlarını incelemek için [/yedek-parca](/yedek-parca) sayfamıza yönelebilirsiniz.

## En Çok Tercih Edilen Mondial Yedek Parçaları ve Teknik Detaylar

Mondial motosikletlerde en çok yedek parça değişimi gerektiren bileşenlerin 2026 yılı güncel piyasa değerlendirmesi ve Fatih servisimizdeki montaj süreleri:

### 1. MH Drift L Debriyaj ve Şanzıman Aksamı
MH Drift modelleri vitesli yapıya sahiptir. Debriyaj teli koptuğunda veya balatası kaçırdığında vites geçişleri zorlaşır. Orijinal debriyaj sacları ve yay seti ortalama 900 TL - 1.600 TL olup montaj süresi 45 dakikadır.

### 2. Wing / Lavinia Scooter Varyatör ve Kayış Grubu
Hava soğutmalı scooter modellerinde aşırı ısınan kayış sertleşerek kopmaya meyillidir. Orijinal setler 800 TL - 1.450 TL bandında seyretmekte olup, deneyimli teknik personelimizce 30 dakikada değiştirilir.

### 3. Karbüratör Komple (50cc'den 125cc'ye kadar)
Mondial modellerinde yakıt kalitesine bağlı olarak karbüratör memeleri tıkanır ve rölanti jeti çalışmaz hale gelir. Komple orijinal karbüratör fiyatı 750 TL ile 1.300 TL arasında değişir. Montajı 40 dakikadır.

## İstanbul Fatih’te Güvenilir Mondial Servisi

Rastgele tamircilerde yapılan Mondial bakımlarında, vida dişlerinin yalama edilmesi, torksuz sabitlemeler yüzünden bloktan yağ sızması gibi hatalar sıklıkla yaşanmaktadır. Paşa Motor olarak tüm Mondial bakım ve parça işlemlerimizi garantili, faturaya işlenebilir şekilde şeffaf yürütüyoruz.

Açık dükkan adresimiz, telefon numaralarımız ve kroki yön tarifi için dilediğiniz an [/iletisim](/iletisim) sayfamızı ziyaret edebilirsiniz.

## Sıkça Sorulan Sorular (SSS)

### 1. Mondial Drift L 125 modelinde 200cc yükseltme silindir kiti performansı uzun vadede bozar mı?
Evet, motorun krankı ve rulmanları 125cc gücüne göre tasarlandığı için 200cc yükseltme yapıldığında eksantrik bilyeleri ve krank rulmanları çok kısa sürede aşınır ve büyük masraf çıkartır. Bu sebeple fabrikasyon standartlarında kalmasını öneririz.

### 2. İstanbul dışına anlaşmalı kargo ile yedek parça siparişi gönderiyor musunuz?
Tüm Türkiye'ye hızlı, güvenli ve anlaşmalı kargo ile yedek parça gönderimi sağlamaktayız. Şase numaranızı bizimle paylaştığınızda kusursuz uyumlu parçayı kargolamış oluruz.

### 3. Mondial scooterların arka fren teli neden sürekli sıkışıyor?
Kış aylarında yollara atılan tuz ve çamurlu sular telin spiral borusu içine kaçarak paslanmaya yol açar. Bu durum frenin takılı kalmasına sebob olur. Servisimizde bu telleri hidrolik yağlama sistemi ile temizliyor veya doğrudan sıfır orijinali ile değiştiriyoruz.

### 4. 50cc scooter modelini B sınıfı ehliyetle kullanıyorum, periyodik bakımı gecikir mi?
50cc bloklar çok küçük yağ kapasitelerine (ortalama 700ml) sahip olduğundan yağın aşınması ve eksilmesi çok daha tehlikeli sonuçlar doğurur (piston sarma). Bakımları her 2.000 km'de bir mutlaka yapılmalıdır.

## Mondial Yedek Parça WhatsApp Stok Hattı

Uyumlu parça sorgulamak veya Fatih dükkanımızda montaj randevusu talep etmek için doğrudan WhatsApp teknik iletişim hattımızdan bize ulaşabilirsiniz:

💬 Bize WhatsApp'tan Yazın: [wa.me/905348996817](https://wa.me/905348996817)

*Paşa Motor kalitesiyle motorunuz her zaman yollarda kalsın, performansınız zirvede yaşasın!*
`,
    is_published: true,
    created_at: new Date().toISOString()
  },
  {
    title: "RKS Motosiklet Yedek Parça - 2024-2026 Tüm Modeller",
    slug: "rks-motosiklet-yedek-parca-2024-2026-tum-modeller-yeni",
    excerpt: "RKS Spontini, Wildcat, Azure, Titanic, Real Blue ve diger tum RKS model ailelerinin yeni nesil parça katalugu, sase numarali sorgulama ve 2026 fiyatlari.",
    category: "rehber",
    seo_title: "RKS Motosiklet Yedek Parça - 2024-2026 Tüm Modeller",
    seo_description: "RKS Spontini, Azure, Wildcat, Titanic orijinal yedek parça fiyatları ve şase sorgulama. Fatih Paşa Motor RKS yetkili servis ve yedek parça mağazası.",
    cover_image: "/images/rks_parts.png",
    content: `# RKS Motosiklet Yedek Parça - 2024-2026 Tüm Modeller

Motosiklet pazarında son yılların en güçlü ivme yakalayan markalarından biri olan RKS Motor, özellikle Spontini 110, Wildcat, Azure 50/125, Real Blue, Titanic 150 ve son çıkan enjeksiyonlu yeni nesil modelleri ile hem kuryelerin hem de şehir içi pratik ulaşım arayanların vazgeçilmezi olmuştur. RKS motosikletlerin modern elektrik tesisatları, CBS fren sistemleri ve Euro 5 rölanti valf motor yapıları, eski usul mekaniklerden farklı olarak hassas yedek parçalarla desteklenmektedir.

İstanbul Fatih’te yerleşik Paşa Motor, RKS model ailesinin (2024-2026 ve öncesi tüm seriler) parça tedariki ve yetkin montajı konusunda bölgedeki en donanımlı atölyelerin başında gelmektedir.

## Yeni Nesil Euro 5 RKS Modellerinde Parça Seçimi

Euro 5 egzoz emisyon standartlarına sahip modern RKS modellerinde ateşleme sistemleri, oksijen sensörleri ve yakıt enjeksiyon püreleri (enjektörler) gelişmiş ECU entegrasyonu ile çalışır. Bu sistemlerde yan sanayi kalitesiz elektrik kabloları, sahte bujiler veya uyumsuz aküler kullanıldığında, araç beyni "Arıza Lambası" yakarak motoru koruma moduna alabilir (Gaz yememe sorunu).

*   Sensör Seçimi: Egzoz üzerinde yer alan Oksijen (O2) sensörü sadece orijinal RKS bileşenleri ile değiştirilmelidir.
*   Enjeksiyon & Rölanti Motoru: Gaz kelebek gövdesinin temizliği ve parça yenilemelerinde mutlaka orijinal contalar kullanılmalıdır.
*   Varyatör ve Şanzıman Mukavemeti: RKS Spontini gibi ticari kullanılan modellerde debriyaj balatası sinterli döküm olmalı, vitesli modellerde ise debriyaj sacları aşınma tolerans standartlarına uygun olmalıdır.

Motosikletinizin ihtiyacı olan tüm yürüyen aksam ve motor şasi parçalarını kontrol etmek için hızlıca [/yedek-parca](/yedek-parca) kataloğumuzu ziyaret edebilirsiniz.

## 2026 RKS Orijinal Parça Listesi ve Ortalama Fiyat Standartları

Aşağıdaki tablo, RKS motosiklet kullanıcılarının sıklıkla ihtiyaç duyduğu orijinal yedek parçaların güncel liste fiyatı ve Fatih'teki servisimizde uygulanan montaj sürelerini göstermektedir:

| Parça Grubu | RKS Model Uyumu | Parça Fiyatı (TL) | Servis Montaj Süresi |
|---|---|---|---|
| Varyatör Debriyaj Balatası (Komple) | Spontini / Wildcat | 1.100 - 1.800 | 45 Dakika |
| Ön Fren Kaliperi (CBS Uyumlu) | Azure 125 / Real Blue | 1.250 - 2.100 | 40 Dakika |
| Krank Komple (Geliştirilmiş Rulman)| Spontini 110 | 2.500 - 4.200 | 3 Saat |
| Far Grubu (LED Projektör) | RKS Avenye / Azure | 1.800 - 3.500 | 30 Dakika |
| CDI / ECU Beyin Ünitesi | Titanic 150 / Wildcat | 1.200 - 2.600 | 15 Dakika |
| Gaz Kelebek Gövdesi (EFI) | Tüm Yeni Euro 5 Modeller | 2.400 - 3.900 | 60 Dakika |
| Ön Amortisör Çifti | Spontini (Kampana/Disk) | 1.900 - 3.100 | 50 Dakika |
| Ateşleme Bobini & Buji Kablosu | Tüm RKS Modelleri | 450 - 850 | 15 Dakika |

*Yön: Elektriksel ve beyinsel arıza durumlarında sadece parça değişimi tek başına yeterli olmayabilir. Servisimizde yer alan diagnostik arıza tespit cihazı yardımıyla hata kodlarının da sıfırlanması gerekebilir. Konum ve randevu bilgileri için [/iletisim](/iletisim) sayfamızı ziyaret edebilirsiniz.*

## RKS Motosikletlerde Sık Yaşanan Sorunlar ve Çözümleri

RKS Spontini modelleri paket taşıma amacıyla çok ağır kilolara maruz bırakıldığı için arka jant kovan dişleri ve debriyaj balataları zamanla sıyırmaktadır. Bu durum tekerleğin boşa dönmesine veya kalkışta aşırı titremeye yol açar. Bu gibi durumlarda, orijinal jant kovanı değişimi ve çelik takviyeli debriyaj balatası montajı ile motorun ömrünü iki katına çıkartmaktayız.

Fren kaliperlerinin tozlanması ve hidrolik seviyelerinin azalması, CBS (Kombine Fren) sisteminin dengesiz çalışmasına ve tekerleğin aniden kilitlenmesine neden olabilir. Servisimizde her RKS bakımında fren kaliperleri özel spreylerle tamamen arındırılır.

## Sıkça Sorulan Sorular (SSS)

### 1. RKS Azure ve Spontini parçaları aynı mıdır?
Hayır. RKS Azure şık tasarımlı klasik bir şehir scooterı olup parça yapısı daha narin ve şıktır. RKS Spontini ise şasesi ve aktarması yük taşımaya göre sertleştirilmiş iş amaçlı bir motordur. Motor içi bazı varyatör parçaları (bagolar vb.) uysa da dış aksam tamamen farklıdır.

### 2. RKS motosikletlerde yedek parça siparişi verirken şase numarası neden istenir?
Özellikle 2024, 2025 ve 2026 üretim yılları arasında rölanti valfi, far soketi ve egzoz boğaz yapısı gibi parçalarda güncelleme (revizyon) yapılmıştır. Şase numarası en doğru revizyonlu parçayı bulmamızı sağlar ve uyumsuzluk riskini önler.

### 3. Jant ve şase eğriliklerini düzeltiyor veya sıfır parça olarak değiştiriyor musunuz?
Çatlama ve metal yorgunluğu riskine karşı can güvenliğinizi korumak adına jant ve şase düzeltme işlemlerini tavsiye etmiyoruz. Servisimizde hasarlı jant ve amortisör gruplarını orijinal RKS katalog parçalarıyla sıfırlamaktayız.

### 4. RKS motorun garanti kapsamında kalması için bakımları ne sıklıkla yapılmalı?
Kullanım kitapçığında aksi belirtilmedikçe her 3.000 km'de bir (veya 6 ayda bir) yetkili servislerde periyodik bakım (yağ, filtre, genel kontrol) yapılması yasal zorunluluktur.

## RKS Yedek Parça WhatsApp Siparişi ve Randevu

RKS motosikletinizin parça stok durumunu ücretsiz sorgulamak, montaj işçilik fiyatları ile beraber toplam yedek parça bütçesini öğrenmek için doğrudan WhatsApp destek hattımıza şase numaranızı yollayabilirsiniz:

💬 WhatsApp Hızlı RKS Destek: [wa.me/905348996817](https://wa.me/905348996817)

*İstanbul Fatih'te motosikletinizin ömrünü uzatan, sürüş keyfinizi artıran tek adres: Paşa Motor!*
`,
    is_published: true,
    created_at: new Date().toISOString()
  },
  {
    title: "Motosiklet Bakımı Ne Zaman Yapılır? - Tam Rehber",
    slug: "motosiklet-bakimi-ne-zaman-yapilir-tam-rehber-yeni",
    excerpt: "1000, 5000 ve 10000 km bakım listesi, motor yağı kararması, fren hidroliği, subap ayarları ve motor bakımının sürüş güvenliğine etkileri.",
    category: "rehber",
    seo_title: "Motosiklet Bakımı Ne Zaman Yapılır? - Tam Rehber",
    seo_description: "commuter ve scooterlar için 1000, 5000, 10000 km periyodik bakım takvimi. Hangi parça ne zaman değişir? Fatih Paşa Motor teknik bakım kılavuzu.",
    cover_image: "/images/moto_maintenance.png",
    content: `# Motosiklet Bakımı Ne Zaman Yapılır? - Tam Rehber

Motosikletler, otomobillere kıyasla çok daha yüksek devir çeviren, dış hava koşullarına (yağmur, çamur, aşırı toz) doğrudan maruz kalan ve son derece dinamik çalışan iki tekerlekli mekanik araçlardır. Bu nedenle, periyodik bakımlarının zamanında yapılması sadece sürüş konforunu artırmakla kalmaz; doğrudan can güvenliğinizi sağlar, yakıt ekonomisi oluşturur ve motorunuzun ömrünü iki katına çıkarır.

*Kendi can ve mal güvenliğinizi korumak, yolda kalma dertlerine son vermek istiyorsanız, bu rehberimizi baştan sona dikkatlice okumanızı öneririz.*

## Bakım Zamanlamasını Etkileyen Faktörler

Motosiklet bakımının ne zaman yapılacağı sadece kilometre saatine bakarak tayin edilmez. Sürüş tarzınız ve çevre koşulları bakım periyodunu doğrudan belirler:

1.  Günlük Kullanım Tarzı: Şehir içi paket servis kuryeliği gibi dur-kalkı çok yoğun olan sürüşler, uzun yol sürüşlerine göre motor yağını 3 kat daha hızlı yıpratır.
2.  Tozlu ve Kirli Yollar: Tozlu şantiye yollarında veya sahil şeridinde nemli tuzlu havada kullanılan motorların hava filtreleri çok daha hızlı tıkanır.
3.  Mevsimsel Değişimler: Kış aylarında motorun ısınma süresi uzadığından motor yağında mikroskobik su yoğunlaşması oluşabilir. Bu da yağın kimyasal yapısını bozar.

Mevsimlik bakımlarda değişmesi gereken aşınan parçalarımızı görmek üzere [/yedek-parca](/yedek-parca) sayfamızı inceleyebilirsiniz.

## 1000, 5000 ve 10000 Km Periyodik Bakım Şeması

Yetkili servisimiz Paşa Motor’da uyguladığımız, marka standartlarında onaylanmış ideal profesyonel bakım takvimi ve kontrol listesi şu şekildedir:

### 1. İlk 1.000 Km (Rodaj) Bakımı
Yeni sıfır kilometre alınan her motosikletin en kritik bakımıdır. Motor montaj aşamasında piston, yatak ve dişlilerden süzülen mikroskobik metal çapaklarını barındıran "fabrika rodaj yağı" boşaltılır. Sübap ayarları kontrol edilir, gevşeyen şase cıvataları tork anahtarıyla doğru torka sıkılır.

### 2. Her 5.000 Km Standard Periyodik Bakım
Motosikletinizin altın bakım dönemidir. Bu kilometrede şunlar yapılır:
*   Motor Yağı ve Yağ Filtresi: Tamamen yenilenir.
*   Hava Filtresi: Basınçlı hava ile temizlenir, gözenekleri dolmuşsa doğrudan değiştirilir.
*   Buji: Tırnak boşluğu ölçülür, aşınma varsa sıfırlanır.
*   Zincir ve Aktarma: Zincir gergisi ayarlanır, özel zincir yağıyla yağlama yapılır.

### 3. Her 10.000 Km Ağır Bakım Programı
Motosikletinizin tüm temel organlarının sökülüp incelendiği detaylı bakımdır:
*   Fren Hidrolik Sıvısı (DOT 4): Nem oranı ölçülerek tamamen boşaltılır ve yeni hidrolik doldurulur.
*   Ön Amortisör Yağları: Keçelerle birlikte revize edilerek amortisör hidrolikleri yenilenir.
*   Debriyaj Komple Kontrolü: Vitesli motorlarda debriyaj sacları, scooterlarda ise varyatör kayışları ve debriyaj balataları incelenir.
*   Karbüratör / Enjektör Temizliği: Gaz kelebek gövdesi özel solüsyonlarla tortulardan arındırılır.

## Periyodik Bakım Parçaları ve Değişim Takvimi (Tablo)

| Aşınan Parça / Sıvı Adı | İdeal Değişim Süresi | Olası Gecikme Sonucu | Ortalama Süre (Servis) |
|---|---|---|---|
| Motor Yağı | 2.500 - 4.000 Km | Piston sarma, yatak yorma, yüksek hararet. | 15 Dakika |
| Yağ Filtresi | Her Yağ Değişiminde | Kirli yağ dolaşımı, yağ kanallarının tıkanması. | 10 Dakika |
| Ön / Arka Fren Balatası| 6.000 - 8.000 Km | Disk aynasının çizilmesi, fren tutmaması. | 15 Dakika |
| Hava Filtresi | 4.000 - 6.000 Km | Fazla yakıt tüketimi, rölanti düzensizliği. | 10 Dakika |
| Ateşleme Bujisi | 8.000 - 10.000 Km | Tekleme yapma, yakıt çiğ atma, zor marş alma. | 10 Dakika |
| Şanzıman Yağı (Scooter)| 10.000 Km | Arka dişli kutusunda aşırı uğultu, dişli kırılması.| 15 Dakika |

*Geciken bakımlar motorun diğer sağlam organlarını da süratle bozarak faturanızı 10 katına çıkarabilir. İstanbul Fatih konumundaki atölyemize uğramak ve bakım sırası beklemeden işlem yaptırmak için lütfen [/iletisim](/iletisim) sayfamızdaki adres bilgilerini kullanarak randevu alınız.*

## Sıkça Sorulan Sorular (SSS)

### 1. Motor yağı rengi siyahlaştığında hemen değiştirmek gerekir mi?
Hayır. Kaliteli temizleyici katıklı motor yağları çalışmaya başladığı ilk 200 km içerisinde motor içindeki ısı karbon kurumlarını bünyesine topladığı için kararır. Bu yağın görevini iyi yaptığını gösterir. Değişim km saati baz alınmalıdır.

### 2. Sürüş yapmadığım dönemlerde de yıllık bakım yaptırmalı mıyım?
Evet. Motosikletinizi kış boyu hiç kullanmasanız dahi karterdeki yağ havanın nemiyle birleşerek asitlenir ve koruyucu özelliğini kaybeder. Yılda en az 1 kez kilometreye bakılmaksızın yağ değişimi şarttır.

### 3. Zincir bakımı kaç kilometrede bir yapılmalıdır?
Motosiklet zinciri her 500 - 600 km'de bir (veya yağmurlu ıslak sürüşlerden hemen sonra) tazyiksiz temizlenip özel kaliteli zincir spreyiyle yağlanmalıdır.

### 4. Scooterlarda rölanti ayarı neden sürekli kendiliğinden bozuluyor?
Karbüratör jeti kirliliği, emme manifoldu çatlakları veya Euro 5 stepper rölanti motorunun kirlenmesi rölanti düzensizliğine yol açar. Bilgisayarlı OBD kalibrasyonu ile bunu çözüyoruz.

## Teknik Ekibimizle WhatsApp Üzerinden Randevu Alın

Motosikletinizin kilometresi geldi mi? Güvenli ve sorunsuz bir sürüş için hemen Fatih Paşa Motor atölyemizden güncel bakım ve işçilik fiyatları hakkında bilgi alabilir, hızlıca randevunuzu planlayabilirsiniz:

💬 WhatsApp Bakım Hattı: [wa.me/905348996817](https://wa.me/905348996817)

*Unutmayın, ihmal edilen küçük bir bakım, yolda kalmanıza ve can güvenliğinizin tehlikeye girmesine sebep olabilir. Paşa Motor ekibi her zaman hizmetinizdedir!*
`,
    is_published: true,
    created_at: new Date().toISOString()
  },
  {
    title: "Motosiklet Karbüratör Temizliği - Adım Adım Rehber",
    slug: "motosiklet-karburator-temizligi-adim-adim-rehber-yeni",
    excerpt: "Tekleme, zor marş ve rölanti dalgalanması belirtileri, karbüratör memeleri temizlenme adımları, profesyonel servis gereksinimi ve teknik tüyolar.",
    category: "rehber",
    seo_title: "Motosiklet Karbüratör Temizliği - Adım Adım Rehber",
    seo_description: "Motosiklet karbüratör temizliği nasıl yapılır? Belirtiler, aşamalar ve temizlik spreyleri. Fatih Paşa Motor karbüratör bakım ve ayar rehberi.",
    cover_image: "/images/rks_parts.png",
    content: `# Motosiklet Karbüratör Temizliği - Adım Adım Rehber

Enjeksiyonlu (EFI) sistemler yaygınlaşmadan önce üretilmiş olan veya günümüzde hala üretilmekte olan birçok 50cc-150cc scooter ve commuter motosiklette yakıt besleme görevi karbüratör ile sağlanır. Karbüratör, yakıt ile havayı motorun devrine ve emme vakumuna göre en hassas pürüzsüz oranlarda karıştırarak silindire gönderen mekanik bir sanattır. Ancak yakıt kalitesizliği, depoda biriken paslar veya motorun uzun süre çalıştırılmadan yatması gibi faktörler, karbüratörün iç kanallarının tıkanmasına yol açar.

Bu ayrıntılı yazımızdan yola çıkarak, motorunuzun düzensiz çalışmasına sebep olan karbüratör tıkanıklığı belirtilerini ve adım adım profesyonel temizleme sürecini teknik ayrıntılarla öğreneceksiniz.

## Karbüratörün Tıkalı Olduğunu Gösteren 5 Kritik Belirti

Motosikletinizde aşağıdaki sorunlardan bir veya birkaçını yaşıyorsanız, karbüratör temizliği ve sübap ayarı zamanı gelmiş demektir:

1.  Zor Çalışma ve Marş Almama: Sabahları jikle çekilmeden motorun marş basmaması veya rölantide hemen stop etmesi.
2.  Rölanti Dalgalanması: Motor ısınmış olsa dahi devir saatinin sürekli inip çıkması veya rölantide çalışırken birden bire sönmesi.
3.  Gaz Yememe ve Boğulma: Gaz elciğini çevirdiğinizde motorun ivmelenmek yerine öne doğru yığılması ve egzozdan "boğuk" çalışma sesinin gelmesi.
4.  Yakıt Tüketiminin Aşırı Artması: Şamandıra iğnesinin tam kapanmaması nedeniyle yakıtın silindire aşırı dozda (zengin karışım) akması ve çiğ benzin kokusu.
5.  Egzoz Patlamaları: Fakir karışım nedeniyle egzoz manifold borusu içerisinde yakıt yanmasının gecikmesi ve patlatmalar oluşması.

Eğer karbüratörünüz tamamen yıpranmışsa ve yeni bir parça ile değiştirmek istiyorsanız, orijinal sıfır karbüratör fiyat standartlarımızı öğrenmek üzere [/yedek-parca](/yedek-parca) sayfamıza yönelebilirsiniz.

## Adım Adım Karbüratör Temizliği Nasıl Yapılır?

*Uyaralım: Karbüratör son derece narin pirinç memelere, kauçuk diyafram contalarına ve küçük yay bileşenlerine sahiptir. Bu rehber bilgilendirme amaçlı olup, el aletleri yetkinliğiniz yoksa işlemi tamamen bozup motoru çalışamaz hale getirebilirsiniz. Profesyonel yardım için servisimize başvurabilirsiniz.*

### Aşama 1: Sökme ve Hazırlık
Motosikletin koltuk altı bagajı veya yan kapakları sökülerek karbüratöre ulaşılır. Benzin hortumu ve gaz teli sökülür. Karbüratör manifold cıvataları gevşetilerek temiz ve tozsuz bir masaya alınır.

### Aşama 2: Hazne ve Şamandıra Ayrımı
Karbüratörün alt kısmında yer alan çanak (hazne) vidaları sökülür. İçerideki yakıt boşaltılır. Şamandıra pimi yerinden çıkartılarak şamandıra ve şamandıra iğnesi (benzin kesici iğne) dikkatlice ayrılır.

### Aşama 3: Memelerin (Jetlerin) Temizliği
Karbüratörün kalbi olan Ana Meme (Main Jet) ve Rölanti Memesi (Pilot Jet) düz tornavida ile sökülür. Bu memelerin mikron ölçeğindeki delikleri karbüratör temizleme spreyi ve basınçlı hava püskürtülerek yıkanır. *Asla metal tel veya toplu iğne gibi sert cisimlerle delikler kurcalanmamalıdır. Pirinç memeler anında genişler ve karbüratör ayar tutmaz hale gelir.*

### Aşama 4: Diyafram ve İğne Kontrolü
Karbüratörün üst kapağında yer alan vakum diyafram kauçuğu sökülerek incelenir. Kauçuk üzerinde en ufak iğne deliği büyüklüğünde dahi yırtılma varsa, vakum oluşmayacak ve gaz yememe sorunu sürecektir. Yırtık diyaframlar yenisi ile değiştirilmelidir.

### Aşama 5: Montaj ve Hava Ayarı
Tüm parçalar solvent bazlı kurutucu spreylerle temizlenip hava tutulduktan sonra ters sırayla birleştirilir. Manifoldu yerine sıkıca oturtarak hava kaçağı olmadığından emin olunur. Ardından motor çalıştırılarak Hava Ayarı Vidası (genelde 2.5 tur açık) ve rölanti seviyesi hassas olarak optimize edilir.

## Karbüratör Temizlik ve Bakım Parça Detayları (Tablo)

| Yapılan İşlem / Temizlenen Parça | Kullanılan Ekipman | Değişim Gerektiren Durum | Atölye Süresi |
|---|---|---|---|
| Ana ve Rölanti Memesi | Karbüratör Spreyi + Hava | İç kanal kireçlenmesi, tıkanma. | 25 Dakika |
| Vakum Kontrol Diyaframı | Fiziksel İnceleme | Diyafram kauçuğunda yırtık/delik.| 15 Dakika |
| Şamandıra ve Kesici İğne | Akış Testi | İğne lastik ucunun aşınması (kafile) | 15 Dakika |
| Manifold Contası | Sızdırmazlık Testi | Çatlak ve dışarıdan motor hava çekmesi. | 10 Dakika |

*Doğru hava-yakıt ayarı yapılamayan motorlar sibop yanmalarına ve silindir aşırı sıcaklıklarına neden olur. Atölyemizin şeffaf hizmetlerinden faydalanmak, Fatih'teki teknik servisimize ulaşmak için [/iletisim](/iletisim) sayfamızdaki adresimizi inceleyebilirsiniz.*

## Sıkça Sorulan Sorular (SSS)

### 1. Karbüratör temizleme spreyleri plastik aksamlara zarar verir mi?
Evet. Solvent bazlı tazyikli karbüratör temizleyiciler diyafram contası gibi hassas kauçuk kauçukları şişirip bozabilir. Bu sebeple temizlik spreyi sıkılmadan önce tüm lastik ve silikon contalar ana gövdeden ayrılmalıdır.

### 2. Motorun jiklesi açık unutulursa ne olur?
Motor sürekli zengin karışım (bol benzin) ile çalışır. Bu durum bujinin kurum bağlamasına (köprü yapması), egzozdan siyah duman atılmasına ve motorun boğulmasına neden olur.

### 3. Karbüratör yerine motoru enjeksiyonlu sisteme çevirmek mümkün mü?
Teorik olarak modifikasyon kitleri mevcuttur ancak son derece pahalı elektro-mekanik tesisat dönüştürme gerektirdiğinden ekonomik ve mantıklı değildir. Mevcut karbüratörü düzgün ayarlatmak en iyi sonuçtur.

### 4. Karbüratör manifoldunun hava emmesi (kaçak yapması) neye yol açar?
Motor kontrol dışı ekstra hava emdiği için karışım aşırı derecede fakirleşir. Motor kendi kendine aşırı rölanti yükseltir, gaz kolu bırakılsa dahi devir düşmez, stop etmek zorlaşır ve motor aşırı ısınır.

## Karbüratör Onay ve WhatsApp Servis Talebi

Karbüratör temizliği, jet ayarı ve sübap kalibrasyonu gibi hassas ve uzmanlık gerektiren mekanik işlemler için doğrudan İstanbul Fatih’teki Paşa Motor teknik kadromuzdan destek alabilirsiniz:

💬 WhatsApp  Destek ve Randevu: [wa.me/905348996817](https://wa.me/905348996817)

*Sağlıklı çalışan bir karbüratör, yakıtta tasarruf ve sürüşte mutlak güvenlik demektir. Paşa Motor olarak hizmetinizdeyiz!*
`,
    is_published: true,
    created_at: new Date().toISOString()
  },
  {
    title: "Falcon Motosiklet Yedek Parça - En Çok Değişen 15 Parça",
    slug: "falcon-motosiklet-yedek-parca-en-cok-degisen-15-parca-yeni",
    excerpt: "Falcon Freedom, Crown, Tekno, Nevada ve diger tum Falcon serileri için en sık ihtiyaç duyulan 15 yedek parça, Fatih stok durumu ve 2026 fiyat listesi.",
    category: "rehber",
    seo_title: "Falcon Motosiklet Yedek Parça - En Çok Değişen 15 Parça",
    seo_description: "Falcon yedek parça Fatih İstanbul. Freedom 250, Crown, Tekno, Soft sargı, varyatör, silindir seti fiyatları ve uzman montajı Paşa Motor güvencesiyle.",
    cover_image: "/images/falcon_parts.png",
    content: `# Falcon Motosiklet Yedek Parça - En Çok Değişen 15 Parça

Yerli ve ekonomik motosiklet pazarının önde gelen temsilcilerinden Falcon Motosiklet, özellikle klasik cruiser tarzı Freedom 250, bütçe dostu scooter modeli Tekno 50, retro tasarımlı Nevada ve commuter sınıfı modelleriyle geniş bütçe segmentlerindeki binicilerin beğenisini kazanmıştır. Falcon motosikletler parça maliyeti açısından cüzdan dostu olsalar da vibrasyon seviyeleri ve malzeme kaliteleri nedeniyle periyodik aralıklarla bazı mekanik bileşenlerin yenilenmesine ihtiyaç duyarlar.

Fatih Kocamustafapaşa’da yer alan tecrübeli servisimiz Paşa Motor, Falcon motosikletler için tüm kritik yedek parçaları stoklarında barındırmakta olup her revizyonu büyük bir hassasiyet ile gerçekleştirmektedir.

## Falcon Motosikletlerde Orijinal Yedek Parçanın Önemi

Falcon modellerinde parça uyumsuzluğu en yaygın karşılaşılan servis kırma problemlerindendir. Çin tabanlı şase üretim yapısı nedeniyle, motor bloğu dışındaki amortisör bağlantıları, elektrik şalter düğmeleri ve far duyları gibi yan parçalar standart ölçüler dışına çıkabilir. Taklit yan sanayi yerine orijinal parça seçildiğinde şu faydalar sağlanır:

*   Titreşime Dayanıklılık: Falcon Commuter modelleri titreşime meyillidir. Orijinal şase saplama vidaları ve takozları vibrasyona karşı ek sönümleme katmanlarına sahiptir.
*   Elektrik Güvenliği: Özellikle marş röleleri ve şarj regülatörleri (konjektör) orijinal seçildiğinde kablo tesisatının erimesini ve yangın çıkma riskini engeller.

Motosikletinizin ihtiyacı olan tüm yürüyen aksam ve motor şasi parçalarını kontrol etmek için hızlıca [/yedek-parca](/yedek-parca) sayfamızı ziyaret edebilirsiniz.

## En Çok Değişen 15 Falcon Yedek Parçası ve 2026 Fiyat Bilgisi

Falcon sahiplerinin servisimize en çok başvurduğu 15 temel parça değişim bütçesi ve Fatih servisimizdeki işçilik süreleri aşağıda listelenmiştir:

| No | En Sık Değişen Parça | Uyumlu Falcon Modeli | Ortalama Fiyat (TL) | Servis Değişim Süresi |
|---|---|---|---|---|
| 1 | Komple Sızdırmazlık Conta Takımı | Nevada / Freedom 250 | 350 - 650 | 60 Dakika |
| 2 | Statör (Şarj Bobini) | Falcon Crown / Tekno 50 | 850 - 1.400 | 45 Dakika |
| 3 | Konjektör (Şarj Regülatörü) | Tüm Falcon Modelleri | 400 - 800 | 15 Dakika |
| 4 | Ön & Arka Balata Seti | Falcon Freedom 250 (Çift disk) | 550 - 1.100 | 20 Dakika |
| 5 | Marş Otomatiği (Rölesi) | Tüm Modeller | 250 - 450 | 10 Dakika |
| 6 | Debriyaj Teli ve Borusu | Freedom 250 / Commuter | 150 - 300 | 15 Dakika |
| 7 | Hava Filtresi Süngeri | Tekno 100 / Crown | 120 - 280 | 10 Dakika |
| 8 | Karbüratör Diyafram Seti | Falcon 50cc Modelleri | 350 - 600 | 25 Dakika |
| 9 | Silindir Seti (Krom Alaşımlı)| Commuter 150cc | 1.600 - 2.800 | 2 Saat |
| 10| Eksantrik Gergi Mili | Tüm Modeller | 350 - 700 | 45 Dakika |
| 11| CDI Beyin Kartı | Falcon Kırmızı / Siyah | 500 - 1.100 | 10 Dakika |
| 12| Arka Fren Pedal teli/mili | Commuter Kampana Grubu | 200 - 450 | 20 Dakika |
| 13| Arka Süspansiyon Takozu (Burç)| Tüm Modeller | 150 - 350 | 30 Dakika |
| 14| Akü (12V 7Ah / 9Ah Jel) | Freedom 250 / Nevada | 800 - 1.600 | 10 Dakika |
| 15| Egzoz Saplaması ve Contası | Tüm Modeller (Vibrasyon kopması)| 180 - 380 | 30 Dakika |

*Not: Tabloda paylaşılan veriler Falcon fabrika parça distribütör fiyatlarının 2026 yılı ortalama endeksidir. Atölyemizin güncel iskontolu hizmetleri ve rezervasyon süreçleri için bizzat [/iletisim](/iletisim) sayfamızdaki harita konumumuzu kullanarak dükkanımıza gelebilirsiniz.*

## Falcon Motosiklet Titreşimden Kaynaklı Vida Gevşeme Problemi

Commuter tarzı Falcon modellerinde balansörsüz (vibrasyon emici olmaksızın dökülen) motor blokları, yüksek devirlerde aşırı titreşim üretir. 

Paşa Motor olarak servisimize periyodik bakım için gelen her Falcon motorun kritik şase somunlarını gevşemezlik sıvısı (Loctite tork kilidi) kullanarak sabitliyoruz. Bu sürüş güvenliğinizi korur ve parçaların düşüp kaybolmasını engeller.

## Sıkça Sorulan Sorular (SSS)

### 1. Falcon Freedom 250 cruiser modelinin parçaları piyasada rahatlıkla bulunuyor mu?
Evet. Freedom 250 bloğu pek çok çift silindirli makine ile ortak şablonlara (V-Twin veya sıralı çift) sahiptir. Yaygın aranan keçeler, balata grupları ve karbüratör diyaframları Paşa Motor stoklarında her zaman bulunmaktadır.

### 2. Jel akü ile standart asitli kuru akü arasındaki fark nedir?
Jel aküler titreşime, sarsıntıya ve dik yatış açılarına karşı maksimum dayanıklılık sağlar. Sızıntı yapmaz ve soğuk kış günlerinde marş basma gücü çok daha diridir. Falcon modelleri için jel aküyü şiddetle öneriyoruz.

### 3. Falcon Tekno 50 scooter modelini 80cc hacmine çıkarmak subap kesmesine sebep olur mu?
Eğer yükseltme kiti takılırken sadece piston büyütülür ve sübap yay-şapka toleransları ayarlanmazsa motor yüksek devirde subap kesebilir. Profesyonel kit dönüşümlerimizi yetkili usta kadromuzla güvenle yapmaktayız.

### 4. Statör sargı yanması neden olur?
Motosiklete ekstra takılan yüksek güçlü sis farları, çakar şerit LED'ler ve elcik ısıtmalar statör çıkış gücü kapasitesini aşarak sargının aşırı ısınıp yanmasına yol açar. Ekstra elektrikli aksesuar takılırken statör çıkışı hesaplanmalıdır.

## Falcon Bilgi Sorgu ve WhatsApp İletişim

Elinizdeki Falcon motorun arızasını tespit ettirmek, orijinal yedek parça temin fiyatı sormak veya servis randevusu almak için doğrudan teknik uzmanlarımızla WhatsApp hattı üzerinden hızlıca görüşebilirsiniz:

💬 WhatsApp Hızlı Falcon Hattı: [wa.me/905348996817](https://wa.me/905348996817)

*Motosikletinizi her zaman sıfır kondisyonunda korumak için gerekli tüm çözümler ve orijinal işçilik kalitesi Paşa Motor'da!*
`,
    is_published: true,
    created_at: new Date().toISOString()
  },
  {
    title: "Motosiklet Yağı Ne Zaman Değiştirilir? 2026 Rehberi",
    slug: "motosiklet-yagi-ne-zaman-degistirilir-2026-rehberi-yeni-seo-yeni",
    excerpt: "Motor yagi degisim araliklari ( mineral, yarimsentetik, tam sentetik), scooter ve vitesli motor yagi farki, vizkozite degeri ve karter tası puf noktalari.",
    category: "rehber",
    seo_title: "Motosiklet Yağı Ne Zaman Değiştirilir? 2026 Rehberi",
    seo_description: "Motosiklet yağı kaç km'de bir değişir? 10W-40, 15W-50 vizkozite seçimi, karter yağ tapası sorunları çözümü. Fatih Paşa Motor uzman yağ rehberi.",
    cover_image: "/images/moto_oil_change.png",
    content: `# Motosiklet Yağı Ne Zaman Değiştirilir? 2026 Rehberi

Motosiklet dünyasında en çok duyulan ve ne yazık ki en çok kafa karışıklığı yaratan sorulardan biri şudur: *"Motosikletimin motor yağını ne zaman değiştirmeliyim?"* Motosiklet motorları, otomobillere göre çok daha yüksek devir bandında (dakikada 6.000 - 12.000 devir arası) çalışan, motor içi dar toleranslara sahip ve çoğunlukla şanzıman dişlileri ile debriyaj balatalarını da aynı yağ havuzunda yağlayan dinamik ünitelere sahiptir. 

Bu sebeple motor yağı, motosikletinizin adeta kanıdır. Özelliğini kaybetmiş bir motor yağı, motor içi aşırı aşınmalara, vites geçişlerinin kemikleşmesine ve nihayetinde silindir kapağı veya silindir bloğunda ölümcül "piston sarma" (motor kitlemesi) arızalarına yol açar.

Fatih’teki yetkin servis merkezimiz Paşa Motor olarak, 2026 yılı motor yağı vizkozite teknolojileri ve en doğru değişim periyotlarını kılavuzumuzda paylaşıyoruz.

## Yağ Tipleri ve Doğru Seçim: Mineral vs. Yarı Sentetik vs. Tam Sentetik

Piyasada satılan motor yağları kimyasal üretim biçimlerine göre üç temel sınıfa ayrılır. Motosiklet tipinize göre doğru yağı seçmek hayati önem taşır:

1.  Mineral Yağlar: Doğal ham petrolden rafine edilen, katkı maddesi az olan geleneksel yağlardır. Genellikle düşük devirli ve düşük bütçeli 50cc scooterlar veya küçük rodaj dönemleri için tercih edilir. Maksimum 1.500 km ömürleri vardır.
2.  Yarı Sentetik Yağlar: Mineral yağlar ile sentetik baz yağların harmanlanmasıyla elde edilir. Günlük kullanılan 100cc-150cc commuter ve scooter modelleri için ideal fiyat/performans sağlar. Ortalama değişim sıklığı 2.500 - 3.500 km civarındadır.
3.  Tam Sentetik Yağlar: Laboratuvar ortamında tamamen kimyasal olarak sentezlenen, yüksek ısı ve kesilme mukavemetine sahip üst segment yağlardır. TVS Apache, RKS, Hero vitesli modeller veya yüksek performanslı motosikletler için şarttır. 4.000 - 6.000 km'ye kadar mükemmel koruma sağlarlar.

Yağ değişimi sırasında kontrol edilip temizlenmesi gereken yağ süzgeci, conta ve kelepçe gibi yedek parçalarımıza [/yedek-parca](/yedek-parca) sayfamızdan ulaşabilirsiniz.

## Yağ Değişim Takvimi ve Vizkozite Tablosu (2026)

| Motosiklet Sınıfı (Örnek Modeller) | İdeal Yağ Tipi | Önerilen Vizkozite | Değişim Kilometresi |
|---|---|---|---|
| 50cc / 100cc Scooter (Kuba Trendy vb.)| Yarı Sentetik | 10W-40 (Scooter özel) | 1.500 - 2.000 Km |
| commuter (Drift L, Hero Dash vb.) | Yarı / Tam Sentetik | 10W-40 MA2 | 2.500 - 3.000 Km |
| Yüksek Performans (Xpulse 200, RTR 200)| Tam Sentetik | 10W-40 / 15W-50 MA2 | 4.000 - 5.000 Km |
| Hava Soğutmalı Yaz Sürüşleri (Commuter)| Tam Sentetik | 15W-50 / 20W-50 | 2.500 Km |

## Scooter Yağı ile Vitesli Motosiklet Yağları Arasındaki Dev Fark

Motosiklet yağı alırken ambalajın üzerindeki standart kodlarına mutlaka dikkat etmelisiniz. En kritik ayrım şudur:

*   Vitesli Motosikletler (JASO MA / MA2 Standart): Vitesli motorlarda motor içi ıslak debriyaj sistemi de motor yağıyla banyo yapar. Eğer vitesli motorunuza otomobil yağı veya scooter yağı (JASO MB) koyarsanız, yağın içindeki aşırı sürtünme azaltıcı katkılar debriyaj balatalarınızın anında kaydırmasına (kaçırmasına) ve yanmasına yol açar.
*   Scooterlar (JASO MB Standart): Scooterların debriyajı motor dışında kuru tip (kayışlı CVT) olduğundan sürtünme azaltıcılığı çok yüksek scooter yağları (MB) sürtünme direncini kırarak motora ekstra güç kazandırır.

Bu yüzden her motora sadece şasi standart kod kılavuzunun talep ettiği (MA2 veya MB) spesifik yağ koyulmalıdır. Servisimizde bu kriterlere %100 uymaktayız.

## Karter Tapası Temizliği ve Profesyonel Yağ Değişimi

Motosiklet sahiplerinin en sık karşılaştığı durum karter tapası dişlerinin aşınmasıdır.

Paşa Motor ekibi olarak her yağ değişiminde karter tapası bakır pulunu sıfırlıyor, karter tapasını fabrikasyon torkunda (tork anahtarı ile) sıkıyor ve yağ süzgeçlerini özel tazyikli spreyle pürüzsüz kılıyoruz. Atölyemizi Fatih’te ziyaret etmek için harita kroki detaylarımıza [/iletisim](/iletisim) sayfamızdan erişebilirsiniz.

## Sıkça Sorulan Sorular (SSS)

### 1. Eksilen motor yağının üzerine yeni yağ eklemek doğru mudur?
Geçici acil durumlar hariç kesinlikle hayır. Karterde kalan eski yağın asit ve kurum tortuları, üzerine eklenen yeni yağın taze kimyasal katık yapısını anında bozarak yağı çamurlaştırır. Doğru olan eski yağı süzgeciyle boşaltıp tamamen yenilemektir.

### 2. Motor yağı vizkozitesi (Örn: 10W-40) ne anlama gelir?
"W" harfi Winter (Kış) anlamına gelir. Soldaki rakam (10) yağın düşük kış sıcaklıklarındaki akışkanlık direncini, sağdaki rakam (40) ise motor sıcakken (yüksek ısılarda) yağın sızdırmazlık ve koruyuculuk viskozitesini gösterir. Türkiye şeması için 10W-40 idealdir.

### 3. Scooter şanzıman (dişli) yağı ne zaman değişir?
Scooterların arka tekerlek göbeğinde yer alan dişli redüktör kutusundaki yağ (genelde 80W-90) her 10.000 km'de bir mutlaka sıfırlanmalıdır. Aksi halde arka tekerlekten aşırı uğultulu vınlama sesleri gelmeye başlar.

### 4. Motor iç temizleme solventleri (Engine Flush) kullanılmalı mıdır?
Eğer motorunuzun bakımları uzun süre aksadıysa veya içinde çamurlaşma varsa, yağ değişiminden hemen önce kartere konulan kaliteli motor içi temizleyiciler kurumları söker. Ancak çok eski yıpranmış motorlarda kurumların sökülmesi aşınmış segman boşluklarını açarak yağ yakmaya sebep olabilir. Analizi ustamız yapmalıdır.

## WhatsApp Üzerinden Hızlı Yağ Değişim Detayları ve Rezervasyon

Motosikletinizin vizkozite uyumunu öğrenmek, yağ değişim ve bakım paket tekliflerini sorgulamak veya en kısa sürede randevunuzu kesinleştirmek için WhatsApp üzerinden bize dilediğiniz an yazabilirsiniz:

💬 WhatsApp Yağ Bakım Hattı: [wa.me/905348996817](https://wa.me/905348996817)

*Paşa Motor ile motorunuzun sağlığını garantiye alın, yollara her zaman keyifle ve güvenle çıkın!*
`,
    is_published: true,
    created_at: new Date().toISOString()
  },
  {
    title: "Fatih İstanbul Motosiklet Servisi - Yetkili Servis Rehberi",
    slug: "fatih-istanbul-motosiklet-servisi-yetkili-servis-yeni-seo-yeni",
    excerpt: "İstanbul Fatih'te en iyi motosiklet servisi nasıl seçilir? Yetkili vs yetkisiz tamirci farkı, Paşa Motor'un donanım ve tecrübe avantajları, ulaşım.",
    category: "rehber",
    seo_title: "Fatih İstanbul Motosiklet Servisi - Yetkili Servis Rehberi",
    seo_description: "Fatih İstanbul motosiklet servisi seçimi kılavuzu. Yetkili servis güvencesi, diagnostik arıza tespiti ve orijinal yedek parça avantajları Paşa Motor'da.",
    cover_image: "/images/fatih_motor_service.png",
    content: `# Fatih İstanbul Motosiklet Servisi - Yetkili Servis Rehberi

İstanbul gibi metropol şehirlerde trafik çilesinden kaçmanın ve zaman kazanmanın en pratik yolu şüphesiz motosiklet kullanımıdır. Özellikle kuryelerin zamanla yarıştığı paket servis kollarında ve şehir içi günlük ulaşımda kullanılan motosikletlerin sorunsuz çalışması hayat kalitesini doğrudan etkiler. Ancak bu yoğun trafiğin, tozun ve nemin getirdiği zorlu şartlar motosikletlerin diğer şehirlere göre çok daha sık yıpranmasına ve bakıma ihtiyaç duymasına yol açar.

İstanbul yarımadasının tarihi ve ticari kalbi sayılan Fatih ilçesinde, motosikletinizi kime emanet edeceğiniz sorusu sürüş güvenliğiniz ve cüzdanınız için kritik bir karardır. Fatih Kocamustafapaşa ve Fındıkzade bölgelerinde faaliyet gösteren Paşa Motor, resmi yetkili servis donanımı, sertifikalı motor usta kadrosu ve zengin orijinal yedek parça stoğu ile bölgedeki en güvenilir motosiklet servisidir.

## Yetkili Servis ile Yetkisiz Tamirciler Arasındaki 5 Dev Fark

Birçok motosiklet binicisi ucuz işçilik reklamlarına aldanarak ruhsatsız, denetimsiz arka sokak tamircilerinde ("motosiklet tamirhanelerinde") işlem yaptırmaktadır. Ancak bu durum, sürüş emniyetinizi tehlikeye attığı gibi yasal olarak da başınızı ağrıtabilir. İşte yetkili servisimiz Paşa Motor’u tercih etmeniz için 5 temel sebep:

1.  Garantili İşçilik ve Fatura: Servisimizde yapılan tüm tamiratlar, motor revizyonları ve yedek parça montajları resmi olarak faturalandırılır. İlerleyen süreçte yaşanacak olası olumsuzluklarda kanuni tüketici haklarınız tam koruma altındadır. Arka sokak tamircilerinde ise hiçbir muhatap bulamazsınız.
2.  Diagnostik Bilgisayarlı OBD Arıza tespiti: Modern enjeksiyonlu (EFI Euro 5) motosikletlerde yan sanayi deneme yanılma yöntemleriyle arıza bulunamaz. Servisimiz bünyesinde yer alan son teknoloji OBD cihazlarımızla hata kodlarını anında okuyarak doğrudan noktasal tamirat yaparız.
3.  Tork Anahtarı ve Kalbibrasyon: Motor bloğu kapaklarından fren kaliper sabitlemelerine kadar her vidayı üretici kataloglarının talep ettiği hassas tork gücünde sıkarız. Tork anahtarı kullanılmayan işlemlerde vidalar ya yalama olur ya da gevşeyerek sürüş anında tekerleklerin kilitlenmesine yol açar.
4.  Temiz ve Tozsuz Çalışma Koşulları: Motor mekanik revizyonlarında (özellikle piston, silindir, şanzıman açıldığında) atölye ortamının tozsuz olması şarttır. Blok içine kaçacak tek bir toz tanesi dahi rulmanları çizebilir. Atölyemiz bu hassasiyet gözetilerek sterilize edilmektedir.
5.  Lisanslı ve Eğitimli Mekanikerler: Ustalarımız üretici fabrikaların (Kuba, RKS, Hero, Mondial vb.) periyodik eğitim seminerlerine katılarak mekanik akış şemalarını ezberlemiş uzmanlardır.

Gereksiz parça değişimlerinden ve kandırılma dertlerinden kurtularak, aradığınız orijinal yedek parçaları şeffaf fiyatlarla görmek için [/yedek-parca](/yedek-parca) sayfamıza hemen göz atabilirsiniz.

## Paşa Motor Tarafından Sunulan Profesyonel Servis Hizmetleri

Geniş kapasiteli atölyemizde motosikletiniz için a'dan z'ye tüm hizmetleri tek çatı altında topluyoruz:

### 1. Periyodik Yağ ve Sıvı Bakımı
Yarı ve tam sentetik kaliteli yağlar, hava filtreleri, iridyum bujiler ve fren hidrolik sıvısı değişimlerimiz her servis girişinde detaylı 15 nokta kontrolüyle birlikte yapılır.

### 2. Motor Mekanik & Şanzıman Revizyonu
Piston sarma, sübap eğilmesi, krank rulman uğultusu veya şanzıman dişli sıyırması gibi ağır mekanik arızaları orijinal yedek parça kullanımıyla fabrikasyon ayarlarında sıfırlıyoruz.

### 3. Fren ve Süspansiyon Güvenlik Revizyonları
Fren disk aynası değişimi, sinterli balata montajı, CBS/ABS fren sistemi kalibrasyonları ve amortisör keçe yağı yenilemeleri uzman ustalarımızca garanti kapsamında yürütülür.

### 4. Elektrik, Tesisat ve EFI Yazılım Desteği
Euro 5 sargı bobini ve statör arızaları, konjektör şarj ölçümleri, akü testleri ve EFI gaz kelebek gövdesi kalibrasyonları diagnostik cihazlarımızla kontrol edilir.

## Fatih Servis Hizmetleri ve Müşteri Destek Standartları (Tablo)

| Hizmet Türü | Detaylı Açıklama | Kullanılan Teknolojik Cihaz | Bölgesel Hizmet Alanı |
|---|---|---|---|
| Bilgisayarlı Diagnostik| EFI Hata kodları tespiti, ECU sıfırlama. | Profesyonel OBD Beyin Tarayıcı | Fatih / İstanbul (Tüm Çevre İlçeler)|
| Fren & Güvenlik | CBS Ayarı, Sinterli balata montajı.| Dijital Mikrometre Disk Ölçer| Fatih Yetkili Servis Merkezimiz |
| Mekanik Revizyon | Krank ve Piston Silindir Yenileme. | Tork Anahtarları (Pro-Grade) | Fatih Yetkili Servis Merkezimiz |
| Yol Yardım / Kurtarma| Yolda kalma durumlarında atölyeye sevk.| Çekici Araç Desteği | Tarihi Yarımada & Fatih Bölgesi |

*Tüm yasal yükümlülüklerimizi, şeffaf çalışma prensibimizi ve servis garantimizi resmi dükkan adresimizle birleştirerek güvencenizi koruyoruz. İletişim, harita konumu ve harita yol tarifi detaylarımıza [/iletisim](/iletisim) sayfamız üzerinden kolayca ulaşabilirsiniz.*

## Sıkça Sorulan Sorular (SSS)

### 1. Motosikletimi servise bırakırken yedek parçaların orijinal olup olmadığını nasıl anlarım?
Paşa Motor olarak müşterimizin talebi doğrultusunda sökülen eski aşınmış parçaları kendilerine ambalajıyla teslim ediyoruz. Değiştirilen tüm ürünler barkodlu ve üretici etiketiyle kutuludur.

### 2. Fatih Kocamustafapaşa dükkanınıza metrobüs veya tramvay ile nasıl ulaşabiliriz?
Atölyemiz Kocamustafapaşa Kızılelma Caddesi üzerindedir. Tramvay istasyonuna ve metrobüs duraklarına yürüme mesafesinde olup, toplu taşıma akslarıyla İstanbul'un her yerinden kolayca erişilebilir bir lokasyondadır.

### 3. Kuryeler için ekspres (hızlı) bakım seçeneğiniz var mı?
Evet, çalışan kuryelerimizin zaman kaybını önlemek adına önceden oluşturulmuş WhatsApp randevularımızda ekspres kanalları kullanıyor, rutin yağ ve balata bakımlarını ortalama 20 dakika içinde bitiriyoruz.

### 4. Şasi doğrultma veya kazalı motosiklet ekspertizi yapıyor musunuz?
Trafik kazası geçirmiş motosikletlerinizin sigorta ve kasko ekspertiz raporu çıkarma işlemlerini yetkili servis sıfatımızla resmi olarak yürütüyor, hasar onarımlarını hızlıca tamamlıyoruz.

## WhatsApp Teknik Uzman Randevu ve Kurtarıcı İletişim

Fatih bölgesinde güvenilir, faturası kesilen, garantisi sunulan kurumsal standartlarda bir motor servisi arıyorsanız, doğrudan teknik destek personelimizle WhatsApp hattı üzerinden hemen yazışabilirsiniz:

💬 WhatsApp Yetkili Servis Hattı: [wa.me/905348996817](https://wa.me/905348996817)

*Motosikletiniz bizimle her zaman güvenli ellerde, performansınız ise her zaman yollarda olsun. Paşa Motor olarak bekliyoruz!*
`,
    is_published: true,
    created_at: new Date().toISOString()
  }
];

async function run() {
  console.log("Signing in with admin user to bypass RLS...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: "aistudioblack@gmail.com",
    password: "PassWord123!"
  });

  if (authError) {
    console.error("❌ Authentication failed:", authError.message);
    process.exit(1);
  }

  console.log("✅ Authenticated successfully as:", authData.user?.email);

  console.log(`Starting insertion of ${articles.length} posts to Supabase...`);
  for (const article of articles) {
    try {
      const payload = {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        cover_image: article.cover_image,
        meta_title: article.seo_title,
        meta_description: article.seo_description,
        is_published: true,
        published_at: null,
        created_at: article.created_at
      };

      console.log(`Checking existing slug: ${article.slug}`);
      const { data: existing, error: checkError } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", article.slug)
        .maybeSingle();

      if (checkError) {
        console.error(`Check error for ${article.slug}:`, checkError.message);
      }

      if (existing) {
        console.log(`Updating in Supabase: ${article.slug}`);
        const { error: updateError } = await supabase
          .from("posts")
          .update(payload)
          .eq("id", existing.id);

        if (updateError) {
          console.error(`Update error for ${article.slug}:`, updateError.message);
        } else {
          console.log(`✅ Supabase updated: ${article.title}`);
        }
      } else {
        console.log(`Inserting to Supabase: ${article.slug}`);
        const { error: insertError } = await supabase
          .from("posts")
          .insert(payload);

        if (insertError) {
          console.error(`Insert error for ${article.slug}:`, insertError.message);
        } else {
          console.log(`✅ Supabase inserted: ${article.title}`);
        }
      }
    } catch (err: any) {
      console.error(`Unhandled Supabase error for ${article.slug}:`, err.message || err);
    }
  }

  console.log("All done! Processing finished.");
  process.exit(0);
}

run().catch((e) => {
  console.error("Fatal run error:", e);
  process.exit(1);
});
