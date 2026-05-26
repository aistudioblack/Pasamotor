import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Hata: VITE_SUPABASE_URL veya VITE_SUPABASE_ANON_KEY bulunamadı!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const seoBlogs = [
  {
    title: "Kuba, Mondial ve RKS Motosikletlerin Kronik Sorunları ve Profesyonel Çözümleri",
    slug: "motosiklet-kronik-sorunlar-ve-cozumleri",
    excerpt: "Kuba, Mondial ve RKS marka motosiklet sahiplerinin en sık yaşadığı kronik arızaları, nedenlerini ve profesyonel çözüm yollarını uzmanından inceleyin.",
    cover_image: "/images/scooter_maintenance.png",
    meta_title: "Kuba, Mondial, RKS Kronik Sorunlar Rehberi | Paşa Motor",
    meta_description: "Kuba, Mondial ve RKS motosikletlerde sıkça görülen elektrik, karbüratör ve varyatör kronik sorunları ve Fatih Paşa Motor uzman çözümleri.",
    is_published: true,
    content: `
<h1>Kuba, Mondial ve RKS Motosikletlerin Kronik Sorunları ve Profesyonel Çözümleri</h1>
<p>Türkiye motosiklet pazarında özellikle şehir içi ulaşım, kurye teslimatları ve başlangıç seviyesi sürücüler arasında <strong>Kuba, Mondial ve RKS</strong> markaları son derece popülerdir. Ekonomik fiyatları, bol yedek parça imkanları ve yaygın bayi ağları bu popülaritenin en büyük sebepleridir. Ancak her mekanik araçta olduğu gibi, bu markaların belirli modellerinde de zamanla kullanıcıların karşısına çıkan bazı <strong>kronik sorunlar</strong> mevcuttur.</p>

<p>Fatih’te yıllarca Kuba, Mondial ve RKS markalarının yetkili servisi olarak hizmet veren <strong>Paşa Motor</strong> ekibi olarak, motorunuzu daha uzun ömürlü ve sorunsuz kullanabilmeniz için bu kronik meseleleri ve bilimsel, teknik çözüm yollarını kaleme aldık.</p>

<hr />

<h2>1. Kuba Scooter ve Vitesli Modellerde Yaşanan Kronik Sorunlar</h2>
<p>Kuba Motor'un özellikle Superlight 120, Trendy, Space 50 ve Bluebird modelleri yollarda sıklıkla karşımıza çıkar. En sık görülen arıza başlıkları şunlardır:</p>

<h3>A. Karbüratör Tıkanması ve Geç Çalışma Problemi (Özellikle 50cc Modeller)</h3>
<p>Kuba 50cc scooter modellerinde Euro 4 ve Euro 5 emisyon standartlarını yakalamak için oldukça hassas ve elektronik destekli karbüratör sistemleri kullanılır. Bu karbüratörler, yakıt kalitesine karşı aşırı duyarlıdır.</p>
<ul>
  <li><strong>Belirtiler:</strong> Sabahları motorun uzun süre marş basmasına rağmen çalışmaması, rölantide stop etme, gaz yememe.</li>
  <li><strong>Profesyonel Çözüm:</strong> Karbüratör memelerinin ultrasonik temizleme cihazı ile periyodik temizlenmesi gerekir. Ayrıca yakıt sistemine kaliteli bir filtre eklemek ve yakıt enjektör/karbüratör temizleyici katkıları belirli aralıklarla kullanmak bu sorunu kökten çözer.</li>
</ul>

<h3>B. Elektrik Tesisatı ve Şasi Temassızlıkları</h3>
<p>Fabrika çıkışı şasi kablolarının gevşek bırakılması veya ince kablo kalitesi nedeniyle sinyallerin çalışmaması, farların gidip gelmesi veya akünün şarj olmaması gibi durumlar görülebilir.</p>
<ul>
  <li><strong>Profesyonel Çözüm:</strong> Paşa Motor teknik servisimizde, tüm elektrik soketleri korozyon önleyici spreylerle elden geçirilir, akü şasi bağlantısı kalınlaştırılır ve konjektör (regülatör) voltaj kararlılığı test edilir.</li>
</ul>

<hr />

<h2>2. Mondial Motosikletlerde Sık Karşılaşılan Kronik Problemler</h2>
<p>Mondial markasının özellikle Drift L, RX3i Evo, Wing 50 ve Revival modelleri yoğun talep görür. Mondial kullanıcılarının en çok geri bildirimde bulunduğu arızalar şunlardır:</p>

<h3>A. Drift L ve Vitesli Modellerde Dijital Ekran (Gösterge) Kararması ve Hız Sensörü Hataları</h3>
<p>Yağmurlu havalarda gösterge panelinin içerisine nem girmesi veya şanzımandaki hız okuyucu sensörün kir/sıcaklık nedeniyle işlevini kaybetmesi yaygındır.</p>
<ul>
  <li><strong>Profesyonel Çözüm:</strong> Gösterge paneli sökülerek kenarları özel sıvı conta ile izole edilir. Arızalı hız sensörü ise orijinal Mondial yedek parçasıyla değiştirilerek şanzıman çıkışı temizlenir.</li>
</ul>

<h3>B. Plastik Grenaj Titreşimleri ve Ses Yapması</h3>
<p>Mondial scooter modellerinde bir süre sonra plastik aksamın birbirine birleştiği klipsler gevşeyebilir, bu durum rölantide can sıkıcı bir tırıltı sesine yol açar.</p>
<ul>
  <li><strong>Profesyonel Çözüm:</strong> Grenaj birleşim noktalarına profesyonel sünger bantlama ve kauçuk pul uygulaması yapılır. Kırık klipsler orijinal tırnaklı vidalarla revize edilir.</li>
</ul>

<hr />

<h2>3. RKS Motosikletlerin Mekanik ve Kronik Durumları</h2>
<p>Premium tasarım çizgileriyle öne çıkan RKS'nin Wildcat, RK 125, Sniper Pro ve TNT 125 gibi modellerinde bazı fabrikasyon hassasiyetler bulunur:</p>

<h3>A. Fabrika Çıkışı Zincir Gevşemesi ve Zincir Kalitesi</h3>
<p>RKS modellerindeki fabrika çıkışlı zincirler ilk 1000-2000 km'de aşırı esneyebilir ve vites geçişlerinde vuruntu yapabilir.</p>
<ul>
  <li><strong>Profesyonel Çözüm:</strong> Zincir gerginliğinin her 500 km'de bir kontrol edilerek torklu vidalarla sıkılması gerekir. Aşırı aşınmış zincirleri, Paşa Motor'da O-Ring'li yüksek dayanımlı RK veya DID zincir setleri ile değiştiriyoruz.</li>
</ul>

<h3>B. Arka Amortisör Sertliği ve Keçe Patlaması</h3>
<p>Şehir içi çukurlu yollarda arka amortisör sistemlerinin hidrolik yağı kaçırması ve sertleşmesi süspansiyon konforunu azaltır.</p>
<ul>
  <li><strong>Profesyonel Çözüm:</strong> Amortisör keçelerinin değişimi mümkün değilse, daha yumuşak ve ayarlanabilir gazlı arka amortisör setlerinin montajı yapılarak sürüş konforu %70 oranında artırılır.</li>
</ul>

<hr />

<h2>Neden Yetkili Servis ve Orijinal Yedek Parça Önemlidir?</h2>
<p>Kuba, Mondial veya RKS motosikletinizde kronik bir arıza fark ettiğinizde bunu mahalle arasındaki yetkisiz tamircilere emanet etmek, sorunun daha da büyümesine ve motorun garanti kapsamı dışına çıkmasına yol açabilir. Yetkili servis olan <strong>Paşa Motor</strong> bünyesinde yapılan arıza tespitleri, üretici el kitabına (service manual) uygun tork değerleri ile gerçekleştirilir.</p>

<p>Eğer motorunuzda yukarıda belirttiğimiz belirtilerden biri varsa, hemen <a href="/iletisim">Paşa Motor Fatih Servisi İletişim</a> sayfamızdan bizlere ulaşabilir, profesyonel randevunuzu oluşturabilirsiniz. Unutmayın, doğru teşhis ve orijinal parça sürüş emniyetinizin temel taşıdır!</p>
    `
  },
  {
    title: "Orijinal ve Yan Sanayi Motosiklet Yedek Parçası Arasındaki Farklar: Neden Orijinal?",
    slug: "orijinal-motosiklet-yedek-parca-avantajlari",
    excerpt: "Motosiklet yedek parça seçiminde kalite neden hayati önem taşır? Orijinal yedek parçanın motor ömrüne ve sürüş güvenliğine etkilerini teknik verilerle detaylandırıyoruz.",
    cover_image: "/images/original_parts.png",
    meta_title: "Orijinal vs Yan Sanayi Yedek Parçe Karşılaştırması",
    meta_description: "Motosikletiniz için orijinal yedek parça ve yan sanayi parçaların ömür, performans ve maliyet analizleri. Uzmanından orijinal ürün tavsiyeleri.",
    is_published: true,
    content: `
<h1>Orijinal ve Yan Sanayi Motosiklet Yedek Parçası Arasındaki Farklar: Neden Orijinal?</h1>
<p>Motosiklet kullanıcılarının en büyük ikilemlerinden biri, yedek parça değişimi sırasında karşılarına çıkar: <strong>Orijinal parça mı almalı, yoksa daha ucuz olan yan sanayi (muadil) parçayı mı tercih etmeli?</strong> İlk etapta yan sanayi parçanın fiyat avantajı cazip görünse de, uzun vadede bu seçimin motosikletinize, bütçenize ve en önemlisi can güvenliğinize faturası çok ağır olabilir.</p>

<p>Bu makalede, <strong>TVS, Kuba, Mondial, RKS</strong> gibi önde gelen markaların orijinal yedek parçaları ile yan sanayi parçalar arasındaki teknik farkları, malzeme kalitesini ve neden her zaman orijinal parçaları tercih etmeniz gerektiğini mühendislik boyutuyla inceliyoruz.</p>

<hr />

<h2>1. Malzeme Kalitesi ve Dayanıklılık Farkı</h2>
<p>Orijinal parçalar (OEM - Original Equipment Manufacturer), motosikletinizin fabrikasında kullanılan ve üretici firmanın yaptığı tüm dayanıklılık testlerinden geçmiş parçalardır. Yan sanayi parçalar ise genellikle bu standartların dışında, daha düşük maliyetli ham maddeler kullanılarak üretilir.</p>

<table className="w-full border-collapse border border-border mt-4 mb-4 text-xs md:text-sm">
  <thead>
    <tr className="bg-muted">
      <th className="border border-border p-2 text-left">Özellik</th>
      <th className="border border-border p-2 text-left">Orijinal Yedek Parça</th>
      <th className="border border-border p-2 text-left">Yan Sanayi (Muadil)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td className="border border-border p-2 font-semibold">Ham Madde Kalitesi</td>
      <td className="border border-border p-2">Yüksek ısıl işlem görmüş çelik, saf alüminyum alaşım, yüksek kaliteli kauçuk.</td>
      <td className="border border-border p-2">Geri dönüştürülmüş metal alaşımlar, korozyona dayanıksız plastik/kauçuk formüller.</td>
    </tr>
    <tr>
      <td className="border border-border p-2 font-semibold">Uyum ve Milimetrik Ölçü</td>
      <td className="border border-border p-2">Motosikletinize %100 uyum sağlar. Modifikasyon gerektirmez.</td>
      <td className="border border-border p-2">Mikron düzeyinde sapmalar olabilir, montaj esnasında zorlama veya sızıntıya yol açabilir.</td>
    </tr>
    <tr>
      <td className="border border-border p-2 font-semibold">Kullanım Ömrü</td>
      <td className="border border-border p-2">Fabrika standartlarında 2-4 kat daha uzun ömürlü kullanım.</td>
      <td className="border border-border p-2">Erken deformasyon, çatlama, kırılma ve aşınma riskleri yüksektir.</td>
    </tr>
    <tr>
      <td className="border border-border p-2 font-semibold">Güvenlik ve Sertifikasyon</td>
      <td className="border border-border p-2">TSE, CE ve uluslararası otomotiv kalite sertifikalarına sahiptir.</td>
      <td className="border border-border p-2">Çoğu zaman herhangi bir test sertifikası bulunmaz.</td>
    </tr>
  </tbody>
</table>

<hr />

<h2>2. Kritik Parçalarda Orijinal Tercih Etmenin Önemi</h2>
<p>Her yedek parçanın motora etkisi aynı değildir. Bazı kozmetik veya plastik aksamlarda yan sanayi parçalar tolere edilebilirken, motor mekaniği ve sürüş güvenliğiyle doğrudan ilişkili parçalarda orijinal kullanımı <strong>hayati önem taşır</strong>:</p>

<h3>A. Fren Sistemi (Balatalar, Diskler, Merkezler)</h3>
<p>Fren balatasında yan sanayi seçildiğinde balatanın sürtünme katsayısı yüksek sıcaklıklarda düşer (fading etkisi). Bu durum fren mesafesini uzatır ve fren diskinin çizilmesine, aşırı ısınarak eğrilmesine neden olur. Orijinal fren balataları ise metalik-seramik alaşım oranları tam olarak test edilmiş, her hava koşulunda mükemmel tutuş sağlayan bileşenlerdir.</p>

<h3>B. Piston, Silindir ve Krank Mili</h3>
<p>Motorun kalbi olan bu parçalar dakikada binlerce kez yüksek sürtünme ve sıcaklık altında çalışır. Yan sanayi bir pistonun genleşme katsayısı hesaplanmamışsa, sıcak havalarda silindire sıkışarak (motor kilitleme/sağır kalma) çok büyük kazalara ve komple motor bloğunun çöp olmasına yol açabilir.</p>

<h3>C. Varyatör Kayışları (Scooter Modelleri)</h3>
<p>Scooter motosikletlerde gücü tekerleğe ileten varyatör kayışının kopması durumunda motor anında yolda kalır. Bando veya markaların orijinal Mitsuboshi kayışları Kevlar lifleriyle güçlendirilmişken, ucuz muadiller 2.000-3.000 km'de sıfır esnemeyle kopma eğilimi gösterir.</p>

<hr />

<h2>3. Uzun Vadeli Ekonomik Analiz: Neden Orijinal Daha Ucuz?</h2>
<p>Birok sürücü "Orijinal parça 2000 TL, yan sanayi 800 TL, o halde yan sanayi alıp tasarruf edeyim" diye düşünür. Ancak senaryo genellikle şu şekilde sonuçlanır:</p>
<ol>
  <li>Yan sanayi parça erken bozulur ve tekrar parça satın almak zorunda kalırsınız.</li>
  <li>Tamirciye gidip ikinci kez işçilik ücreti ödersiniz.</li>
  <li>Bozulan kalitesiz parça, motorun diğer sağlam dişlilerine ve elektrik sistemine de zarar verir, 10.000 TL'lik büyük bir faturaya yol açar.</li>
</ol>
<p>Sonuç olarak, orijinal parça satın aldığınızda tek bir işçilik ve uzun yıllar kafa rahatlığıyla aslında paranuzu korumuş olursunuz.</p>

<h2>Paşa Motor'da Sadece Orijinal Yedek Parça Güvencesi!</h2>
<p>Motosikletinizin hem güvenliğini hem de ömrünü korumak için periyodik bakımlarınızı aksatmayın. Fatih Kocamustafapaşa’daki modern servisimizde, uzman ekibimizle tüm bu filtre ve mekanik aksam kontrolünü milimetrik standartlarda gerçekleştiriyoruz. Randevunuzu almak ve kaliteli orijinal yedek parçalarımızla bakım yaptırmak için <a href="/iletisim">Paşa Motor Servis Randevu</a> sayfamızdan bizlerle hemen iletişime geçebilirsiniz.</p>
    `
  },
  {
    title: "Motosiklet Periyodik Bakımında Asla Atlanmaması Gereken 7 Kritik Parça",
    slug: "motosiklet-periyodik-bakim-kritik-parcalari",
    excerpt: "Güvenli bir sürüş ve motorun sağlığı için periyodik bakımda mutlaka değiştirilmesi gereken buji, filtreler ve kritik sarf malzemeleri hakkında bilmeniz gereken her şey.",
    cover_image: "/images/periodic_maintenance.png",
    meta_title: "Motosiklet Periyodik Bakımında Değişecek Parçalar",
    meta_description: "Güvenli sürüş için motosiklet periyodik bakımlarında buji, hava filtresi, motor yağı ve fren balatası gibi kritik parçaların değişim rehberi.",
    is_published: true,
    content: `
<h1>Motosiklet Periyodik Bakımında Asla Atlanmaması Gereken 7 Kritik Parça</h1>
<p>Motosiklet kullanmak büyük bir tutku ve özgürlüktür. Ancak bu özgürlüğün kesintisiz ve güvenli bir şekilde devam etmesi, motosikletinizin periyodik bakımlarının zamanında yapılmasına bağlıdır. Düzenli bakım, en pahalı tamiratlardan çok daha ekonomiktir. Bakım esnasında değiştirilmeyen basit bir parça, zincirleme olarak motorunuza kalıcı hasarlar verebilir.</p>

<p>Kurye motorlarından spor motosikletlere kadar her sınıftan iki tekerlekli dostumuz için periyodik bakımlarda mutlaka kontrol edilmesi veya değiştirilmesi gereken <strong>7 kritik yedek parçayı ve sarf malzemesini</strong> sizler için listeledik.</p>

<hr />

<h2>1. Motor Yağı (En Hayati Sıvı)</h2>
<p>Motosiklet motorları otomobillere göre çok daha yüksek devirlerde ve yüksek sıcaklıklarda çalışır. Motor yağı, piston ve silindir arasındaki sürtünmeyi azaltarak aşırı ısınmayı önler ve metal tortuları temizler.</p>
<ul>
  <li><strong>Değişim Sıklığı:</strong> Madeni yağlarda 1.000 - 1.500 km, yarı sentetik yağlarda 2.000 - 3.000 km, tam sentetik yağlarda ise 4.000 - 5.000 km aralığında değiştirilmelidir.</li>
  <li><strong>Hati Not:</strong> Yağ değişimi sırasında mutlaka süzgeç temizlenmeli veya yağ filtresi yenilenmelidir.</li>
</ul>

<h2>2. Hava Filtresi</h2>
<p>Motorun yanma odasına giren havayı temizleyen filtredir. İstanbul trafiği ve tozlu hava koşullarında hava filtresi hızla tıkanır.</p>
<ul>
  <li><strong>Tıkanma Belirtileri:</strong> Yakıt tüketiminin ciddi oranda artması, motorun nefessiz kalması (gaz yerken boğulma), egzozdan siyah duman çıkması.</li>
  <li><strong>Değişim Sıklığı:</strong> Her 4.000 - 6.000 km'de bir mutlaka değiştirilmelidir. Kirli yollarda bu süre yarıya inebilir.</li>
</ul>

<h2>3. Buji (Ateşleme Sistemi)</h2>
<p>Buji, yakıt-hava karışımını saniyede binlerce kez ateşleyen parçadır. Bujinin yıpranması ateşleme kalitesini düşürür.</p>
<ul>
  <li><strong>Yıpranma Belirtileri:</strong> Motorun zor çalışması, rölanti düzensizliği, çekiş kayıpları ve tekleme.</li>
  <li><strong>Değişim Sıklığı:</strong> Standart bujiler her 8.000 km'de, İridyum bujiler ise 15.000 - 20.000 km'de bir değiştirilmelidir.</li>
</ul>

<h2>4. Fren Balataları (Can Güvenliği)</h2>
<p>Fren yaptığınızda motoru durduran, diske baskı uygulayan sürtünme malzemesidir. Balataların bitmesi fren performansını sıfıra indirdiği gibi fren diskine de telafi edilemez zararlar verir.</p>
<ul>
  <li><strong>Belirtiler:</strong> Fren sıkıldığında sürtünme gıcırtısı sesi gelmesi, fren kolunun çok aşağıda kavraması.</li>
  <li><strong>Değişim Sıklığı:</strong> Kullanım tarzına göre değişmekle birlikte her periyodik bakımda mutlaka balata kalınlığı ölçülerek gerekirse değiştirilmelidir (alt limit 2.0mm).</li>
</ul>

<h2>5. Yağ Filtresi</h2>
<p>Motor yağı içerisindeki metal parçacıklarını ve yanma kurumlarını süzerek temiz yağın devridaim edilmesini sağlar.</p>
<ul>
  <li><strong>Değişim Sıklığı:</strong> Her yağ değişiminde veya en geç her iki yağ değişiminde bir mutlaka sıfır yağ filtresi takılmalıdır. Eski filtreyi temizlemeye çalışıp tekrar takmak motora kirli yağ göndermek demektir.</li>
</ul>

<h2>6. Varyatör Kayışı ve Debriyaj Bagaları (Scooter Modelleri)</h2>
<p>Özellikle Kuba, Mondial ve RKS scooterlarda motordan alınan gücü arka tekerleğe aktaran kauçuk bazlı dişli kayıştır.</p>
<ul>
  <li><strong>Yıpranma Belirtileri:</strong> Kayıştan gelen tiz sesler, hızlanırken sarsıntı ve bagaların aşınması nedeniyle son hızın düşmesi.</li>
  <li><strong>Değişim Sıklığı:</strong> Her 10.000 - 15.000 km'de bir orijinal varyatör kayışı ile değiştirilmelidir.</li>
</ul>

<h2>7. Zincir ve Dişli Seti (Vitesli Modeller)</h2>
<p>Vitesli motosikletlerde şanzımandan gelen torku arka tekerleğe ileten çelik zincir ve ön/arka dişli mekanizmasıdır.</p>
<ul>
  <li><strong>Yıpranma Belirtileri:</strong> Zincirin aşırı uzaması, dişlilerin sivrilişerek aşınması ve zincirin dişliden atma/çıkma eğilimi göstermesi.</li>
  <li><strong>Değişim Sıklığı:</strong> Düzenli temizlenip yağlanan zincirler 15.000 - 20.000 km gidebilir. Dişliler ile zincir mutlaka <strong>set halinde</strong> değiştirilmelidir.</li>
</ul>

<hr />

<h2>Paşa Motor'da Profesyonel Periyodik Bakım Zamanı!</h2>
<p>Motosikletinizin hem güvenliğini hem de ömrünü korumak için periyodik bakımlarınızı aksatmayın. Fatih Kocamustafapaşa’daki modern servisimizde, uzman ekibimizle tüm bu 7 filtre ve mekanik aksam kontrolünü milimetrik standartlarda gerçekleştiriyoruz. Randevunuzu almak ve kaliteli orijinal yedek parçalarımızla bakım yaptırmak için <a href="/iletisim">Paşa Motor Servis Randevu</a> sayfamızdan bizlerle hemen iletişime geçebilirsiniz.</p>
    `
  },
  {
    title: "Kuba ve RKS Yedek Parça Uyumluluk Rehberi: Hangi Parçalar Ortak?",
    slug: "kuba-rks-yedek-parca-uyumluluk-rehberi",
    excerpt: "Kuba ve RKS motosikletlerin birçok modeli aynı altyapıyı paylaşır. Hangi parçaların birbirine uyumlu olduğunu öğrenerek parça tedarikinizi çok daha hızlı hale getirin.",
    cover_image: "/images/parts_compatibility.png",
    meta_title: "Kuba ve RKS Yedek Parça Uyumluluğu Rehberi",
    meta_description: "Kuba ve RKS marka motorlarda uyumlu amortisör, debriyaj, fren ve karbüratör parçaları. İstanbul Fatih parça tedariği rehberi.",
    is_published: true,
    content: `
<h1>Kuba ve RKS Yedek Parça Uyumluluk Rehberi: Hangi Parçalar Ortak?</h1>
<p>Motosiklet yedek parça pazarında, özellikle Kuba ve RKS kullanıcılarının sıklıkla fark ettiği bir durum vardır: <strong>Birçok Kuba yedek parçası, RKS modellerine doğrudan uymakta ya da tam tersi RKS parçaları Kuba motorlarda kullanılabilmektedir.</strong> Bunun nedeni, her iki markanın da Türkiye'de aynı çatı şirket (MJ Group) bünyesinde üretilmesi ve küresel ölçekte benzer motor ve şasi platformlarını paylaşmasıdır.</p>

<p>Bu ortak parça stratejisi, kullanıcılara parça bulma kolaylığı ve fiyat avantajı sağlar. Ancak hangi parçaların birbiriyle %100 uyumlu olduğunu bilmek teknik uzmanlık gerektirir. <strong>Paşa Motor</strong> yedek parça ekibi olarak, Kuba ve RKS arasındaki ortak parça uyumluluklarını detaylıca açıkladık.</p>

<hr />

<h2>1. Motor Bloğu ve Yürüyen Aksam Ortaklığı</h2>
<p>Kuba ve RKS'nin özellikle 50cc and 125cc scooter ile vitesli commuter modellerinde motor blokları silindir çapı, krank boyutu ve subap yapısı olarak birebir aynıdır.</p>

<h3>A. GY6 Tabanlı 50cc ve 80cc Motor Parçaları</h3>
<p>Kuba Bluebird, Trendy 50, Space 50 modelleri ile RKS Azure 50, Blazer 50, Spontini 50 modelleri efsanevi <strong>GY6 motor bloğunu</strong> kullanır. Bu ne anlama gelir?</p>
<ul>
  <li>Silindir setleri, pistonlar, segmanlar ve subap takımları ortaktır.</li>
  <li>Karbüratörler, emme manifoldları ve hava filtresi hortumları genel olarak birbirine uyar.</li>
  <li>Varyatör ön debriyaj setleri, varyatör kayış boyutları (örn: 669 veya 729 boyutlar) iki markada da birebir aynıdır.</li>
</ul>

<h3>B. 125cc Commuter ve Scooter Blokları</h3>
<p>Kuba'nın CG/Commuter modelleri ile RKS'nin vitesli commuter modellerinde krank, şanzıman dişli setleri, debriyaj pleytleri ve balataları aynı tasarım ölçülerini taşır. RKS RK125 veya Kuba Çita serisinde debriyaj tası ve balata takımı birbirinin yerine kullanılabilir.</p>

<hr />

<h2>2. Elektrik ve Ateşleme Sistemi Uyumlulukları</h2>
<p>Kuba ve RKS markalarında CDI (beyin), ateşleme bobini, konjektör (regülatör) ve marş motorları gibi elektrik elemanlarında soket yapısı uyduğu sürece tam bir geçişkenlik söz konusudur:</p>
<ul>
  <li><strong>Konjektörler (Şarj Düzenleyici):</strong> AC/DC voltaj çıkış parametreleri aynı olduğundan, RKS Azure'un şarj problemi yaşandığında Kuba Trendy konjektörü doğrudan takılarak sorun giderilebilir.</li>
  <li><strong>Marş Motorları:</strong> Akü amper değerleri ve marş motoru tırnak sayıları uyduğu sürece marş dinamosu iki marka arasında sorunsuzca değiştirilir.</li>
</ul>

<hr />

<h2>3. Fren ve Süspansiyon Parçaları</h2>
<p>RKS ve Kuba scooter modellerinde kullanılan ön fren kaliperleri, fren ana merkezleri ve hatta ön çatal amortisör boruları çap olarak ortaktır. Örneğin RKS Wildcat ön balatası piyasada bulunamadığında Kuba'nın uyumlu scooter ön balatası takılarak fren performansı fabrikasyon değerlerde korunabilir.</p>

<hr />

<h2>Ortak Parça Alırken Nelere Dikkat Edilmelidir?</h2>
<p>Kuba ve RKS parçalarının uyumlu olması her parçanın rastgele takılabileceği anlamına gelmez. Şu üç kurala dikkat edilmelidir:</p>
<ol>
  <li><strong>Soket ve Kablo Yapısı:</strong> Elektrik parçalarında soket pin sayıları ve kablo renk sıralaması mutlaka karşılaştırılmalıdır.</li>
  <li><strong>Grenaj ve Estetik Parçalar:</strong> Motor ve şasi parçaları uysa bile, dış grenajlar ve far tasarımları markaların estetik kimliğine göre farklıdır. Dış plastik aksamlar genel olarak uyumlu değildir.</li>
  <li><strong>Usta Onayı ve Tork Değerleri:</strong> Parçanın uyumlu olması kadar doğru torklama ile monte edilmesi de önemlidir.</li>
</ol>

<h2>Uyumlu ve Orijinal Parçalar Paşa Motor Fatih Deposunda!</h2>
<p>Kuba veya RKS motosikletiniz için yedek parça arıyorsanız ve hangi parçanın motorunuza tam uyacağını kestiremiyorsanız endişelenmeyin. <strong>Paşa Motor</strong>'un dijital ve fiziki kataloğunda Kuba ve RKS motosikletlerinize ait binlerce orijinal parça şemaya göre sınıflandırılmıştır. Doğru yedek parçayı hemen sipariş etmek veya servis desteği almak için <a href="/yedek-parca">Paşa Motor Yedek Parça</a> bölümümüzü ziyaret edebilirsiniz.</p>
    `
  },
  {
    title: "Motosiklet Motor Rektefiye (Yenileme) Nedir? Ne Zaman ve Nasıl Yapılır?",
    slug: "motosiklet-motor-rektefiye-yenileme-rehberi",
    excerpt: "Motorunuzun performansı mı düştü veya yağ mı yakıyor? Motor rektefiye (motor yenileme) işleminin aşamalarını, maliyet kriterlerini ve usta seçiminin önemini öğrenin.",
    cover_image: "/images/engine_rebuild.png",
    meta_title: "Motosiklet Rektifiye ve Motor Yenileme Nedir?",
    meta_description: "Motosiklet motor ömrünü uzatan silikon ve piston değişimi ile profesyonel motor rektefiye işleminin tüm adımları ve Fatih servis teknik bilgileri.",
    is_published: true,
    content: `
<h1>Motosiklet Motor Rektefiye (Yenileme) Nedir? Ne Zaman ve Nasıl Yapılır?</h1>
<p>Motosikletinizin motoru zamanla yüksek kilometrelerde sürtünme, yüksek ısı ve kullanıma bağlı olarak yıpranır. Motorun ilk günkü gücünü kaybetmesi, ciddi oranda yağ eksiltmesi ve egzozdan mavi duman atması gibi durumlar, motorun ömrünü tamamladığının ve <strong>motor rektefiye (motor yenileme / rektifiye)</strong> işlemine ihtiyaç duyduğunun en net habercileridir.</p>

<p>Peki motosiklet motor yenileme işlemi nedir? Hangi aşamalardan oluşur ve bu işlem yapılırken nelere dikkat edilmelidir? Sektörün uzmanı <strong>Paşa Motor</strong> teknik ekibi olarak, motor rektifiyesinin tüm inceliklerini paylaşıyoruz.</p>

<hr />

<h2>1. Motor Rektefiye (Yenileme) İşlemi Nedir?</h2>
<p>Motor rektefiye; aşınmış, deforme olmuş silindir, piston, segman, krank mili ve subap grubu gibi parçaların ölçülerek temizlenmesi, fabrikasyon mikron hassasiyetindeki ölçülere geri getirilmesi veya yeni yedek parçalarla değiştirilerek motor bloğunun sıfırlanması işlemidir. Bu işlem tamamlandığında motorunuz teorik olarak 0 kilometredeki sağlık durumuna ve kompresyon (sıkıştırma) gücüne kavuşur.</p>

<hr />

<h2>2. Motorunuzun Rektefiyeye İhtiyacı Olduğunu Nasıl Anlarsınız?</h2>
<p>Motor bloğu açılmadan önce bazı belirtiler rektefiye zamanının geldiğini gösterir:</p>
<ul>
  <li><strong>Egzozdan Mavi Duman Çıkması:</strong> Piston segmanlarının aşındığını ve silindir odasına motor yağı sızarak yandığını gösterir.</li>
  <li><strong>Ciddi Güç ve Çekiş Kaybı:</strong> Motorun kompresyon kaçırması nedeniyle yokuşlarda çekmemesi, son hızının ciddi şekilde düşmesi.</li>
  <li><strong>Motordan Gelen Mekanik Vuruntu Sesleri (Yatak Sarma):</strong> Krank mili yataklarından veya piston piminden gelen yoğun metalik vuruntu sesleri.</li>
  <li><strong>Rölantide Stop Etme ve Zor Çalışma:</strong> Silindir sıkıştırma oranının düşmesiyle motorun marş almasının zorlaşması.</li>
</ul>

<hr />

<h2>3. Motor Rektefiye İşleminin Adımları</h2>
<p>Bir motosiklet motor rektefiye süreci Paşa Motor servisimizde şu profesyonel aşamalardan geçer:</p>

<h3>A. Motorun Sökülmesi ve Parçalanması</h3>
<p>Motor bloğu motosikletten tamamen ayrılır. Silindir kapağı, silindir bloğu ve karter sökülerek en ince parçasına kadar ayrıştırılır.</p>

<h3>B. Ölçüm ve Aşınma Analizi (Mikrometre Testi)</h3>
<p>Usta rektefiyeci, mikrometre kullanarak silindir iç çapındaki ovallikleri ölçer. Eğer aşınma belirli limitlerin altındaysa honlama yapılır, limitlerin üstündeyse silindir gömleği değiştirilir veya bir üst ölçüye (oversize) taşlanarak yeni piston sipariş edilir.</p>

<h3>C. Parça Değişimleri (Krank, Piston, Subap)</h3>
<p>Sürecin en hassas yeridir. Krank mili boşluğu kontrol edilerek gerekirse krank rulmanları ve biyel kolu yenilenir. Subaplar ve subap lastikleri kesinlikle değiştirilerek subap yuvaları taşlanır ve sızdırmazlık testi yapılır.</p>

<h3>D. Temizlik ve Montaj</h3>
<p>Tüm parçalar solvent bazlı yıkama ünitelerinde metal talaşlarından temizlenir. Yeni contalar ve orijinal yedek parçalar kullanılarak, tork anahtarı ile üretici standartlarında cıvatalar sıkılarak motor toplanır.</p>

<hr />

<h2>Rektefiye Sonrası "Rodaj" Süreci Neden Önemlidir?</h2>
<p>Rektefiyeden yeni çıkmış bir motor tıpkı sıfır alınmış bir motosiklet gibidir. Piston ve segmanların yeni silindire kusursuzca alışabilmesi için ilk 500-1000 km boyunca <strong>rodaj kurallarına</strong> uyulmalıdır:</p>
<ul>
  <li>Motor yüksek devirlere çıkarılmamalıdır.</li>
  <li>Ani gaza basmaktan ve aşırı yük taşımaktan kaçınılmalıdır.</li>
  <li>500 km sonra rodaj yağı boşaltılmalı, yeni kaliteli motor yağı doldurulmalıdır.</li>
</ul>

<h2>Paşa Motor'da Profesyonel Motor Yenileme İşçiliği</h2>
<p>Motosiklet motor rektefiyesi, hata kabul etmeyen en üst düzey mekanik uygulamadır. Milimetrik bir torklama hatası veya kalitesiz bir conta, motorun yeniden sökülmesine ve yüksek masraflara yol açar. Yetkili servisimiz <strong>Paşa Motor</strong>'da, Kuba, RKS, Mondial, TVS ve tüm lider markaların motor yenileme işlemlerini garantili ve orijinal parça güvencesi ile yapıyoruz. Motorunuzda güç kaybı veya yağ yakma varsa, <a href="/iletisim">Paşa Motor Fatih Teknik Servisi</a> ile iletişime geçerek motorunuza yeniden can verebilirsiniz!</p>
    `
  },
  {
    title: "TVS Apache RTR ve Jupiter Sahipleri İçin Kapsamlı Parça ve Arıza Kılavuzu",
    slug: "tvs-apache-rtr-jupiter-yedek-parca-ariza-rehberi",
    excerpt: "TVS Apache ve Jupiter modellerinin yedek parça kalitesi, sık karşılaşılan mekanik durumlar ve yetkili serviste yapılması gereken profesyonel bakımlar üzerine özel inceleme.",
    cover_image: "/images/tvs_showroom.png",
    meta_title: "TVS Apache & Jupiter Kronik Sorunlar ve Parçaları",
    meta_description: "TVS Apache RTR 150/200 ve TVS Jupiter scooter sahipleri için orijinal parça değişimi, servis püf noktaları ve teknik usta çözümleri Fatih'te.",
    is_published: true,
    content: `
<h1>TVS Apache RTR ve Jupiter Sahipleri İçin Kapsamlı Parça ve Arıza Kılavuzu</h1>
<p>Hindistan’ın dev kuruluşu TVS Motor Company, ülkemizde özellikle <strong>Apache RTR 150 / 160 / 200</strong> serisi vitesli modelleri ve efsanevi şehir içi scooter modeli <strong>TVS Jupiter</strong> ile tanınır. TVS motorlarının en dikkat çeken yönü, inanılmaz malzeme kalitesi, sağlamlıkları ve uzun motor ömürleridir. Ancak en kaliteli makine bile doğru bakım görmediğinde veya yanlış yedek parça kullanıldığında arıza verebilir.</p>

<p>Bu kılavuzda, TVS Apache ve TVS Jupiter kullanıcılarının karşılaştığı tipik arıza durumlarını, doğru parça tedarikinin yollarını ve profesyonel usta tavsiyelerini derledik.</p>

<hr />

<h2>1. TVS Apache RTR Serisinde Sık Yaşanan Durumlar ve Çözümleri</h2>
<p>Apache RTR serisi, sportif yapısı ve torku yüksek kısa stroklu motor yapısıyla kullanıcıların gözdesidir. Ancak şu detaylara dikkat edilmelidir:</p>

<h3>A. Debriyaj Tasından Gelen Ses ve Debriyaj Balatası Aşınması</h3>
<p>Yoğun trafikte debriyajın sık kullanılması nedeniyle bir süre sonra rölantide debriyaj basılı değilken tıkırtılı bir ses gelebilir.</p>
<ul>
  <li><strong>Sebebi:</strong> Debriyaj tası takozlarının (yaylarının) zamanla boşluk yapmasıdır.</li>
  <li><strong>Profesyonel Çözüm:</strong> Debriyaj sacları ve balataları aşınmışsa orijinal TVS Apache debriyaj seti takılmalı, debriyaj tası sökülerek boşluk kontrol edilmeli ve gerekirse yenilenmelidir.</li>
</ul>

<h3>B. Gidon Titreşimi ve Amortisör Yağ Kaçakları</h3>
<p>Apache'nin agresif sürüş karakteristiği çukurlara sert girildiğinde ön amortisör keçelerinin zarar görmesine neden olabilir.</p>
<ul>
  <li><strong>Profesyonel Çözüm:</strong> Keçeler sökülerek amortisör borusu çizik kontrolünden geçirilir. Orijinal TVS keçe ve amortisör hidrolik yağı (viskoziteye göre) kullanılarak ön takım sıfırlanır.</li>
</ul>

<hr />

<h2>2. TVS Jupiter Scooter Sık Karşılaşılan Durumlar</h2>
<p>Özellikle kuryelerin ve günlük kullanıcıların vazgeçilmezi olan metal grenajlı TVS Jupiter, sınıfının en dayanıklı scooter'ıdır. Ancak yıpranmaya bağlı şu durumlar görülebilir:</p>

<h3>A. Soğuk Havalarda Jikle Arızası ve Stop Etme</h3>
<p>TVS Jupiter modellerinde otomatik jikle sistemi bulunur. Otomatik jikle arızalandığında motor soğukken kolay stop eder veya aşırı zengin karışımla çalışıp yakıtı artırır.</p>
<ul>
  <li><strong>Profesyonel Çözüm:</strong> Jikle valfi elektrik devre ölçümleri yapılmalıdır. Arızalı otomatik jikle orijinal TVS yedek parçasıyla değiştirildiğinde karbüratör rölanti dengesi anında düzelir.</li>
</ul>

<h3>B. Arka Kampana Fren Zayıflığı</h3>
<p>Motosikletin ağır yükle veya artçılı kullanılması durumunda arka kampana fren balatası zamanla aşınır ve fren gücü azalır.</p>
<ul>
  <li><strong>Profesyonel Çözüm:</strong> Kampana içi asbest içermeyen yüksek tutuşlu orijinal TVS Jupiter balatası ile yenilenir, kampana içi temizlenir.</li>
</ul>

<hr />

<h2>TVS Motosikletlerde Orijinal Yedek Parça Neden Şarttır?</h2>
<p>TVS motorlarının üretim toleransları oldukça yüksektir. Örneğin bir yan sanayi hava filtresi takıldığında, TVS motorunun hava-yakıt emiş dengesi bozulur ve motor sürekli öksürme eğilimi gösterir. Aynı şekilde kalitesiz bir debriyaj teli takıldığında çok hızlı koparak sizi yolda bırakacaktır.</p>

<h2>Paşa Motor: TVS Yetkilendirilmiş Bakım ve Orijinal Parça Merkezi</h2>
<p>TVS Apache veya TVS Jupiter motosikletinizin uzun ömürlü olması için periyodik bakımlarında sadece orijinal yedek parçaları tercih edin. Fatih Kocamustafapaşa’daki servisimizde TVS motorlarına ait tüm orijinal yedek parçaları doğrudan stoklarımızdan montajlıyoruz. <a href="/yedek-parca">Paşa Motor TVS Yedek Parça Kataloğu</a> sayfamızı inceleyebilir veya doğrudan TVS uzmanı ustalarımızla görüşmek için <a href="/iletisim">servisimize ulaşabilirsiniz.</a></p>
    `
  },
  {
    title: "Motosiklet Debriyaj Balatası ve Şanzıman Arızası Belirtileri",
    slug: "motosiklet-debriyaj-balatasi-sanziman-arizasi",
    excerpt: "Debriyaj kaçırma problemi nasıl anlaşılır? Vites geçişlerinde zorluk ve şanzımandan gelen seslerin arkasındaki mekanik nedenler ile parça değişim rehberi.",
    cover_image: "/images/clutch_gearbox.png",
    meta_title: "Motosiklet Debriyaj Balatası Aşınma Belirtileri",
    meta_description: "Motosikletlerde debriyaj kaçırma, vites sertliği ve şanzıman boşluğu sorunlarının nedenleri. Debriyaj balatası ve dişli yenileme servis ipuçları.",
    is_published: true,
    content: `
<h1>Motosiklet Debriyaj Balatası ve Şanzıman Arızası Belirtileri</h1>
<p>Vitesli motosikletlerde motorun ürettiği gücü şanzımana, oradan da arka tekerleğe aktaran en önemli ara birim <strong>debriyaj sistemidir</strong>. Şanzıman ise bu gücü farklı tork ve hız sınırlarında yola iletmenizi sağlar. Islak tip çoklu balata kullanan motosikletlerde debriyaj balatası ve şanzıman dişlileri zamanla yıpranabilir.</p>

<p>Bu sistemlerde oluşan arızaları erken fark etmek, yolda kalmanızı önleyeceği gibi daha yüksek maliyetli şanzıman kırılmalarının da önüne geçer. Sektörün bilinen ismi <strong>Paşa Motor</strong> olarak debriyaj ve şanzıman arızalarını teknik detaylarıyla derledik.</p>

<hr />

<h2>1. Motosiklet Debriyaj Balatası Aşınma Belirtileri</h2>
<p>Debriyaj balatası aşındığında motor gücünü tam olarak şanzımana aktaramaz. Sürücünün en kolay anlayabileceği belirtiler şunlardır:</p>

<h3>A. Debriyaj Kaçırma (Slips)</h3>
<p>Gaza bastığınızda motor devri (RPM) hızla yükselmesine rağmen motosikletin hızı artmıyorsa veya geç hızlanıyorsa debriyaj kaçırıyor demektir. Özellikle yokuş yukarı çıkarken motorun bağırıp gitmemesi en klasik belirtidir.</p>

<h3>B. Vites Geçişlerinde Sertleşme ve Boş Vitesi Bulamama</h3>
<p>Motosiklet dururken boşa (N) geçmekte aşırı zorlanıyorsanız veya vites kolları kemikli ve sert geçiyorsa debriyaj tam olarak ayrılmıyor demektir. Bu durum debriyaj saclarının yamulduğunun ya da balataların kalınlığını yitirdiğinin göstergesidir.</p>

<h3>C. Debriyaj Manetinde Boşluk Kaybı</h3>
<p>Debriyaj telinin uçlarındaki boşluk azaldığında veya manet aşırı sertleştiğinde debriyaj sürekli hafifçe basılı kalır. Bu da balatanın sürtünerek hızla yanmasına yol açar.</p>

<hr />

<h2>2. Şanzıman Arızası ve Belirtileri</h2>
<p>Motosiklet şanzımanları sıralı (sequential) köpek dişli sisteme sahiptir. Araba şanzımanlarından farklı olarak çok daha kompakt yapıdadırlar ve şu arızalar görülebilir:</p>

<h3>A. Vitesten Atma (Helezyon/Hilal Aşınması)</h3>
<p>Motoru belirli bir vitese aldığınızda, gaza yüklenince motorun aniden o vitesten çıkıp boşta gibi bağırması veya bir alt/üst vitese kendi kendine geçmesi durumudur. Bu genellikle vites hilallerinin (forks) eğrilmesi veya dişli tırnaklarının yuvarlaklaşmasından kaynaklanır.</p>

<h3>B. Şanzımandan Gelen Uğultu ve Metal Sürtme Sesi</h3>
<p>Tüm viteslerde veya sadece belirli bir viteste giderken motor devriyle doğru orantılı olarak artan kulak tırmalayıcı bir uğultu (whining) sesi gelmesi, şanzıman rulmanlarının dağıldığının ve acilen müdahale edilmesi gerektiğinin habercisidir.</p>

<hr />

<h2>Debriyaj ve Şanzıman Ömrünü Uzatmak İçin Yapılması Gerekenler</h2>
<ul>
  <li><strong>Doğru Yağ Seçimi:</strong> Motosikletlerde debriyaj motor yağı içinde çalışır (ıslak debriyaj). Arabalar için üretilmiş sürtünme azaltıcı katkılı yağlar motosiklet debriyajının kaçırmasına yol açar. Mutlaka <strong>JASO MA / MA2</strong> standartlarındaki motosiklet yağı kullanın.</li>
  <li><strong>Yarım Debriyaj Yapmayın:</strong> Motoru sürekli yarım debriyajda tutmak balata sürtünmesini artırarak balatayı yakar.</li>
  <li><strong>Debriyaj Telini Yağlayın:</strong> Yılda bir kez debriyaj teline tazyikli sıvı gres sıkarak telin yumuşak kalmasını sağlayın.</li>
</ul>

<h2>Paşa Motor Güvencesiyle Debriyaj Yedek Parça Değişimi</h2>
<p>Yıpranmış bir debriyaj balatasıyla sürmek motorunuzun yakıt tüketimini %30 artırır ve sürüş keyfinizi sıfıra indirir. <strong>Paşa Motor</strong> teknik servisimizde, debriyaj sacları, balataları, yayları ve şanzıman grup milleri orijinal yedek parçalarla ve garantili işçilikle onarılır. Kataloğumuz üzerinden motorunuza uygun debriyaj balatalarını incelemek için <a href="/yedek-parca">Paşa Motor Orijinal Parçaları</a> sayfasına bakabilir veya Fatih'teki servisimize gelerek arıza tespiti yaptırabilirsiniz.</p>
    `
  },
  {
    title: "Mondial Yedek Parça İstanbul: Fatih’te Güvenilir ve Orijinal Tedarik Noktası",
    slug: "mondial-yedek-parca-istanbul-fatih-tedarik",
    excerpt: "İstanbul Fatih ilçesi ve çevre semtlerde orijinal Mondial yedek parçası bulmakta zorlanıyor musunuz? Paşa Motor stok güvencesiyle Mondial parça kataloğu incelemesi.",
    cover_image: "/images/mondial_parts.png",
    meta_title: "Mondial Yedek Parça İstanbul Fatih | Paşa Motor",
    meta_description: "Mondial scooter, cup ve vitesli motorlar için orijinal yedek parça satışı, İstanbul Fatih Kocamustafapaşa yetkili teknik servis ve parça stoğu.",
    is_published: true,
    content: `
<h1>Mondial Yedek Parça İstanbul: Fatih’te Güvenilir ve Orijinal Tedarik Noktası</h1>
<p>İstanbul gibi metropollerde motosiklet, her geçen gün lüks olmaktan çıkıp temel bir ulaşım ihtiyacı haline gelmiştir. Bu pazarda en yaygın kullanılan markalardan biri şüphesiz <strong>Mondial</strong>'dir. Mondial’in Drift L, Wing, Pagani, Strada, RX3i Evo gibi modelleri paket servis kuryelerinden günlük işe gidip gelenlere kadar geniş bir kitle tarafından tercih edilir. Ancak motosiklet nerede çok kullanılırsa yedek parça ve servis ihtiyacı da o kadar ön plana çıkar.</p>

<p>Peki İstanbul Fatih bölgesinde, Kocamustafapaşa ve çevre semtlerde orijinal Mondial yedek parçası nasıl ve nereden güvenle tedarik edilir? Yetkilendirilmiş servis noktası olan <strong>Paşa Motor</strong> kalitesiyle Mondial yedek parça süreçlerini kaleme aldık.</p>

<hr />

<h2>1. Yan Sanayi Mondial Parçaları Neden Risk Taşır?</h2>
<p>Piyasada ucuz, ambalajsız ve merdiven altı olarak üretilen binlerce sahte Mondial parçası dolaşmaktadır. Özellikle şu parçaların yan sanayi takılması büyük riskleri beraberinde getirir:</p>
<ul>
  <li><strong>Gaz ve Debriyaj Killeri:</strong> Kalitesiz tellerin iç kılavuzları çok hızlı aşınarak kilitlenmelere veya ansızın kopmalara yol açar. Trafikte giderken gaz telinin takılı kalması ölümcül kazalara sebep olabilir.</li>
  <li><strong>Egzantrik Milleri ve Subaplar:</strong> Metal kalitesi düşük yan sanayi egzantrik milleri birkaç bin kilometrede aşınarak motorun sesli çalışmasına ve subap yakmasına sebep olur.</li>
  <li><strong>Yakıt ve Enjeksiyon Elemanları:</strong> Enjektör, oksijen sensörü gibi elektronik parçaların yan sanayi seçilmesi ECU (beyin) arızalarına ve motor gidişinde dalgalanmalara yol açar.</li>
</ul>

<hr />

<h2>2. Paşa Motor'da Hangi Mondial Parçalarını Bulabilirsiniz?</h2>
<p>Mondial yedek parça stoğumuzda, her model aralığına uygun binlerce parça şemaya ve katalog koduna göre saklanır:</p>
<ul>
  <li><strong>Motor Mekanik Grubu:</strong> Silindir gömlekleri, piston, krank milleri, subap takımları, üst ve alt conta setleri.</li>
  <li><strong>Elektrik ve Elektronik:</strong> Statör, konjektör, CDI, sargı, ateşleme bobinleri, sinyal ve aydınlatma grupları.</li>
  <li><strong>Fren ve Yürüyen Aksam:</strong> Orijinal ön/arka balatalar, fren diskleri, amortisör keçeleri, jantlar ve rulman takımları.</li>
  <li><strong>Sarf Malzemeler:</strong> Orijinal Mondial hava filtreleri, yağ filtreleri ve varyatör kayışları.</li>
</ul>

<hr />

<h2>Fatih’te Mondial Servis ve Tedarikin Doğru Adresi</h2>
<p>Motosikletinizi yetkisiz kişilere emanet etmek, hem garanti kapsamını sonlandırır hem de yanlış parça montajıyla motor ömrünü tüketir. <strong>Paşa Motor</strong>, İstanbul Fatih’teki geniş deposu, güler yüzlü ekibi ve modern tavan led aydınlatmalı servis alanıyla Mondial kullanıcılarına kusursuz hizmet sunar.</p>

<p>Motosikletiniz için aradığınız parçayı anında bulmak, fiyatta sürprizlerle karşılaşmamak ve orijinal ürün güvencesiyle sipariş vermek için <a href="/yedek-parca">Paşa Motor Mondial Yedek Parça Kataloğu</a>muzu ziyaret edebilir veya hemen <a href="/iletisim">İletişim sayfamızdan</a> bizlere ulaşarak stok sorgulayabilirsiniz.</p>
    `
  },
  {
    title: "Scooter Varyatör ve Debriyaj Bakımı: Hız ve Yakıt Performansı Nasıl Artırılır?",
    slug: "scooter-varyator-debriyaj-bakimi-performans-artirma",
    excerpt: "Scooter motosikletlerde varyatör bagaları ve kayış bakımı, çekiş gücünü doğrudan etkiler. Varyatör temizliği ve bakımıyla yakıt tasarrufu sağlamanın püf noktaları.",
    cover_image: "/images/scooter_variator.png",
    meta_title: "Scooter Varyatör Bagası ve Kayış Bakımı Rehberi",
    meta_description: "Scooter motorlarda kalkıştaki titreme, hızlanma kaybı ve varyatör kayışı aşınma sorunlarının çözümler. Debriyaj bakımı ile performans artışı.",
    is_published: true,
    content: `
<h1>Scooter Varyatör ve Debriyaj Bakımı: Hız ve Yakıt Performansı Nasıl Artırılır?</h1>
<p>Scooter motosikletleri vitesli motosikletlerden ayıran en konforlu özellik, vites değiştirme zahmetini ortadan kaldıran <strong>CVT (Continuously Variable Transmission / Sürekli Değişken Şanzıman)</strong> sistemidir. Bu sistemin kalbi ise ön varyatör, arka varyatör (debriyaj) ve ikisini birbirine bağlayan aktarma borusu yani varyatör kayışıdır.</p>

<p>CVT sistemi debriyaj balatası tozu, hava yoluyla giren yol tozları ve sürtünme nedeniyle zamanla kirlenir ve aşınır. Bu yazımızda, scooter varyatör sisteminin nasıl çalıştığını, bakım adımlarını ve doğru varyatör ayarıyla <strong>motosikletinizin hızını artırıp yakıt tüketimini nasıl düşüreceğinizi</strong> açıklıyoruz.</p>

<hr />

<h2>1. Scooter Varyatör Sistemi Nasıl Çalışır?</h2>
<p>Ön varyatör motorun krank miline bağlıdır ve içinde santrifüj gücüyle hareket eden <strong>varyatör bagaları (misketleri)</strong> yer alır. Motor devri arttıkça bagalar dışarıya doğru savrulur, ön varyatör kasnaklarını birbirine yaklaştırır ve aradaki kayış yukarı tırmanır. Arka varyatör ise tam tersi hareketle genişler. Bu sayede sonsuz vites oranlı pürüzsüz bir kalkış ve hızlanma gerçekleşir.</p>

<hr />

<h2>2. Varyatör ve Debriyajda Bakımsızlık Belirtileri</h2>
<p>Eğer scooterınızda şu belirtiler başladıysa varyatör kapağını açma vakti gelmiştir:</p>
<ul>
  <li><strong>Kalkışta Titreme (Sarsıntı):</strong> Özellikle dur-kalk trafikte ilk kalkış anında motorun silkelenmesi. Bunun nedeni arka debriyaj balatasının kirlenmesi ve tasın içine tam tutunamayarak kaçırmasıdır.</li>
  <li><strong>Hızlanmada İsteksizlik ve Yakıt Artışı:</strong> Motorun bağırıp devirlenmesine rağmen hızlanmaması.</li>
  <li><strong>Varyatörden Gelen Şıkırtı Sesi:</strong> Ön varyatör bagalarının (misketlerinin) yuvarlaklığını kaybederek köşeli hale gelmesi ve tırnak plastiklerinin kırılması.</li>
</ul>

<hr />

<h2>3. Adım Adım Profesyonel Varyatör Bakımı</h2>
<p>Paşa Motor servisimizde uyguladığımız profesyonel varyatör bakım rutini:</p>
<ol>
  <li><strong>Sökme ve Toz Arındırma:</strong> Varyatör dış kapağı sökülür. Kompresör havası ve özel balata temizleme solventleri ile karter içi biriken asbest ve tozdan arındırılır.</li>
  <li><strong>Ön Varyatör Kontrolü:</strong> Bagalar dijital kumpas ile ölçülür. Düzleşme veya köşelenme varsa orijinal ağırlıktaki yeni bagalar takılır. Kasnak yüzeylerindeki aşınma kanalları incelenir.</li>
  <li><strong>Arka Debriyaj Bakımı:</strong> Debriyaj balatası zımparalanarak camlaşmış sertleşen yüzey temizlenir. Yaylar tork kontrolünden geçirilir.</li>
  <li><strong>Kayış Analizi:</strong> Varyatör kayış kalınlığı ölçülür, çatlak ve diş dökülmesi kontrol edilerek limit altındaysa yeni orijinal kayışla yenilenir.</li>
</ol>

<hr />

<h2>Varyatör Ayarı ile Performans ve Tasarruf Sırları</h2>
<p>Motosikletinizin karakteristiğini varyatör bagalarının ağırlığını değiştirerek ayarlayabilirsiniz:</p>
<ul>
  <li><strong>Daha Hafif Bagalar:</strong> Motorun daha yüksek devirde kalkmasını sağlar, yokuş çekişini ve ilk hızlanmayı (seriliği) ciddi oranda artırır ancak son hızı biraz düşürebilir.</li>
  <li><strong>Daha Ağır Bagalar:</strong> Motorun daha düşük devirde ilerlemesini sağlayarak sakin ve yakıt tasarruflu bir kurye/şehir dışı sürüşü sunar.</li>
</ul>

<h2>Paşa Motor Varyatör Ayar Standartları</h2>
<p>Motosikletinizde kalkış silkelemesi, yavaşlama veya yakıt artışı hissediyorsanız, yetkili servisimiz <strong>Paşa Motor</strong>’un Fatih’teki teknik merkezinde varyatörünüzü A’dan Z’ye revize edelim. Sürüş konforunuzu en üst seviyeye taşımak ve orijinal kayış-baga tedarik etmek için <a href="/yedek-parca">Paşa Motor Yedek Parça</a> kataloğumuzu inceleyebilir, hemen <a href="/iletisim">randevu oluşturabilirsiniz.</a></p>
    `
  },
  {
    title: "Kışlık Motosiklet Hazırlığı ve Motoru Uzun Süre Yatırma Kılavuzu",
    slug: "kislik-motosiklet-bakimi-motoru-yatirma-rehberi",
    excerpt: "Motosikletinizi kış aylarında uzun süre kullanmayacaksanız akü sağlığı, yakıt sistemi koruması ve dış etkenlere karşı boya koruma için hangi adımları atmalısınız?",
    cover_image: "/images/winter_care.png",
    meta_title: "Kışlık Motosiklet Bakımı ve Motor Saklama Kılavuzu",
    meta_description: "Motosikleti kışın garajda saklarken yapılması gereken akü, buji, karbüratör ve motor kılıfı hazırlıkları. İlk çalıştırma için uzman teknik seolar.",
    is_published: true,
    content: `
<h1>Kışlık Motosiklet Hazırlığı ve Motoru Uzun Süre Yatırma Kılavuzu</h1>
<p>Kış aylarının gelmesi, soğuk hava, kar ve buzlanma birçok motosiklet kullanıcısı için sezonun kapanması anlamına gelir. Motosikletinizi kış boyunca garajda veya açık alanda uzun süre yatıracaksanız, onu öylece bırakıp gitmek ilkbaharda büyük sürprizlerle (bitmiş bir akü, tıkanmış karbüratör, paslanmış zincir, çatlamış lastikler) karşılaşmanıza neden olur.</p>

<p>Doğru adımlarla kışlık koruma altına alınan bir motosiklet, bahar dönemi geldiğinde tek marşta sorunsuzca çalışacaktır. İşte <strong>Paşa Motor</strong> teknik servis ekibinin sizler için hazırladığı altın değerindeki kışlık saklama adımları.</p>

<hr />

<h2>1. Akü Sağlığını ve Şarjını Koruyun</h2>
<p>Yatan bir motosiklette akü kendi kendine yavaş yavaş deşarj olur. Soğuk kış günleri bu süreci hızlandırır ve akünün plaka yapısına kalıcı zararlar verir.</p>
<ul>
  <li><strong>Yapılması Gereken:</strong> Akü kutup başlarını (önce negatif - sökülerek) boşa çıkartın. Eğer imkanınız varsa aküyü komple söküp ev gibi sıcak bir alanda muhafaza edin ve ayda bir kez akü şarj cihazı (trickle charger) ile şarj edin.</li>
</ul>

<h2>2. Yakıt Deposu ve Yakıt Sistemi Hazırlığı</h2>
<p>Metal yakıt depolarında yarı yarıya bırakılan yakıt, sıcaklık dalgalanmaları nedeniyle deponun içinde nemlenme (kondensasyon) yapar. Bu da zamanla paslanmaya yol açar.</p>
<ul>
  <li><strong>Yapılması Gereken:</strong> Deponuzu tamamen, ağzına kadar kaliteli yakıtla doldurun. Böylece iç yüzey havayla temas etmeyerek oksitlenmez. Ayrıca karbüratörlü modellerde karbüratör alt haznesindeki (tahliye) benzini mutlaka boşaltın, aksi takdirde benzin uçarak geride jöle kıvamında tortu bırakır ve memeleri tıkatı.</li>
</ul>

<h2>3. Sıvı Koruyucular ve Yağ Değişimi</h2>
<p>Kullanılmış motor yağının içinde asidik yanma kalıntıları bulunur. Motorun bu kirli yağla uzun süre yatması iç yataklarda korozyona zemin hazırlar.</p>
<ul>
  <li><strong>Yapılması Gereken:</strong> Motoru kışa yatırmadan hemen önce motor yağını sıfırlayın. Ayrıca zincirinizi balata temizleyici sprey ile yıkayıp kuruttuktan sonra kalın kışlık zincir yağıyla bolca yağlayın.</li>
</ul>

<h2>4. Lastiklerin Şeklini Koruyun (Düzleşmeyi Önleyin)</h2>
<p>Motosiklet tek bir noktada aylarca aynı ağırlık altında durduğunda, lastiğin yerle temas eden yüzeyi düzleşir ve kalıcı balans bozukluğu oluşur.</p>
<ul>
  <li><strong>Yapılması Gereken:</strong> Motosikletinizi mutlaka <strong>orta sehpaya</strong> alın. Eğer orta sehpanız yoksa her iki tekerleği de yerden kesecek sehpa sistemleri (paddock) kullanın. Bu da mümkün değilse haftada bir kez motosikleti ileri geri hareket ettirerek lastik temas noktasını değiştirin.</li>
</ul>

<h2>5. Dış Yüzey Koruma ve Kılıf Seçimi</h2>
<p>Nem ve toz, metal parçaların paslanmasına, boyalı plastiklerin matlaşmasına neden olur.</p>
<ul>
  <li><strong>Yapılması Gereken:</strong> Motorunuzu güzelce yıkayın ve %100 kurutun. Metal ve kromajlı yüzeylere korozyon önleyici koruyucu sprey veya WD-40 sıkın. Üzerine örteceğiniz kılıfın kesinlikle naylon olmamasına, nefes alabilen özel kumaş kılıf olmasına dikkat edin; naylon kılıflar nemi hapsederek terleme yapar ve çürümeyi hızlandırır.</li>
</ul>

<hr />

<h2>Bahar Sezonunda Paşa Motor Güvencesiyle Yollara Dönün!</h2>
<p>Kışlık hazırlığı tam yapılan bir motor yeni senede sizi asla yarı yolda bırakmaz. Bahar geldiğinde motorunuzu güvenle yola çıkarmadan önce, Fatih Kocamustafapaşa’daki servisimizde A’dan Z’ye yola hazırlık check-up'ından geçirebilirsiniz. Kışlık bakım ürünleri, akatörler ve şarj cihazları için <a href="/yedek-parca">Paşa Motor Online Parça</a> sitemizden destek alabilir, her zaman <a href="/iletisim">yetkili servisimizle</a> irtibata geçebilirsiniz.</p>
    `
  }
];

async function run() {
  console.log("🚀 Otomatik Yüksek ve Teknik SEO Uyumlu Blog İçeriği Ekleme Komutu Başlatıldı!");
  console.log("=========================================================================");

  // 1. Authenticate as Admin (to bypass Row Level Security blocks)
  const email = "pasamotor@gmail.com";
  const password = "PasaMotor2026!";
  
  console.log("🔑 Supabase Admin oturumu açılıyor...");
  const authRes = await supabase.auth.signInWithPassword({ email, password });

  if (authRes.error) {
    console.error("❌ Yönetici Girişi Başarısız! İşlem iptal edildi:", authRes.error.message);
    process.exit(1);
  }

  console.log(`✅ Oturum Açıldı: ${authRes.data.user?.email} (Admin yetkileri devrede)`);

  try {
    let successCount = 0;
    
    for (const blog of seoBlogs) {
      console.log(`⏳ İşleniyor: "${blog.title}"`);
      
      // Önce bu slug ile kayıt var mı kontrol et
      const { data: existing, error: checkError } = await supabase
        .from("posts")
        .select("id")
        .eq("slug", blog.slug)
        .maybeSingle();
        
      if (checkError) {
        console.error(`❌ Kontrol hatası (${blog.slug}):`, checkError.message);
        continue;
      }
      
      if (existing) {
        // Zaten var, güncelleme yap
        const { error: updateError } = await supabase
          .from("posts")
          .update({
            title: blog.title,
            excerpt: blog.excerpt,
            content: blog.content,
            cover_image: blog.cover_image,
            meta_title: blog.meta_title,
            meta_description: blog.meta_description,
            is_published: blog.is_published,
            updated_at: new Date().toISOString()
          })
          .eq("id", existing.id);
          
        if (updateError) {
          console.error(`❌ Güncelleme hatası (${blog.slug}):`, updateError.message);
        } else {
          console.log(`✅ Mevcut yazı başarıyla SEO optimize edilerek güncellendi: ${blog.slug}`);
          successCount++;
        }
      } else {
        // Yeni kayıt oluştur
        const { error: insertError } = await supabase
          .from("posts")
          .insert({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt,
            content: blog.content,
            cover_image: blog.cover_image,
            meta_title: blog.meta_title,
            meta_description: blog.meta_description,
            is_published: blog.is_published,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (insertError) {
          console.error(`❌ Ekleme hatası (${blog.slug}):`, insertError.message);
        } else {
          console.log(`✅ Yeni SEO Uyumlu blog başarıyla oluşturuldu: ${blog.slug}`);
          successCount++;
        }
      }
    }
    
    console.log("=========================================================================");
    console.log(`🎉 İşlem tamamlandı! Toplam ${successCount}/${seoBlogs.length} blog içeriği başarıyla veritabanına işlendi.`);
    
  } catch (err: any) {
    console.error("❌ Kritik hata oluştu:", err.message);
  }
}

run();
