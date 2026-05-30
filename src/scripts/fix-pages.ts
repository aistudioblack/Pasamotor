import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://mock.supabase.co',
  process.env.VITE_SUPABASE_ANON_KEY || 'mock-key'
);

const blogPosts = [
  {
    slug: "kuba-rks-yedek-parca-uyumluluk-rehberi",
    title: "Kuba ve RKS Yedek Parça Uyumluluk Rehberi: Hangi Parçalar Uyar?",
    excerpt: "Kuba ve RKS motosikletlerinizin motor, elektrik ve grenaj parçalarının birbiriyle veya diğer markalarla uyumluluğunu bu rehberimizde inceliyoruz.",
    content: `<h2>Giriş</h2>
<p>Kuba ve RKS motosiklet kullanıcılarının sıkça sorduğu "Bu yedek parça benim motoruma uyar mı?" sorusunun yanıtını detaylı bir şekilde veriyoruz. Motor blokları, elektrik aksamları (konjektör, statör, CDI) ve yürüyen aksamların pek çok modelde ortak kullanıldığını biliyor muydunuz?</p>

<h2>Arıza Belirtileri ve Uyumsuz Parça Kullanımının Riskleri</h2>
<p>Yanlış yedek parça kullanıldığında motorunuzda ciddi arızalar meydana gelebilir. İşte belirtileri:</p>
<ul>
  <li>Motorun beklenmedik anlarda stop etmesi veya teklemesi</li>
  <li>Elektrik tesisatında (konjektör veya statör kaynaklı) aşırı ısınma ve akü bitmesi</li>
  <li>Varyatör ve debriyaj balatasının hızla aşınması</li>
  <li>Düşük performans, yüksek yakıt tüketimi</li>
  <li>Hatalı fren balatası sebebiyle fren diskinde çizilmeler</li>
</ul>

<h2>Kuba ve RKS Modelleri Arasındaki Ortak Parçalar</h2>
<p>Birçok Kuba ve RKS modeli aynı motor bloğunu (GY6 veya benzeri) kullanır. Bu sayede bazı hayati yedek parçalar birebir uyum sağlar:</p>

<table>
  <tr><th>Parça Adı</th><th>Uyumluluk (Kuba / RKS)</th><th>Uyumluluk Derecesi</th></tr>
  <tr><td>GY6 125/150cc Konjektör</td><td>Hemen hemen tüm GY6 Scooterlar</td><td>✓ Birebir uyumlu</td></tr>
  <tr><td>150cc Statör (Sargı)</td><td>CG Serisi / RKS Titanic</td><td>✓ Birebir uyumlu</td></tr>
  <tr><td>Ön Fren Balatası</td><td>RKS Spontini / Kuba X-Boss</td><td>✓ Uyumlu</td></tr>
  <tr><td>Marş Rölesi</td><td>Tüm standart 12V 100-200cc</td><td>✓ Birebir uyumlu</td></tr>
  <tr><td>CVT Varyatör Kayışı</td><td>Model uzunluğuna göre (Örn: 743-20-30)</td><td>⚠️ Modele Göre Değişir</td></tr>
</table>

<h2>Ortak Kullanılan Yedek Parçalar Hakkında Bilinmesi Gerekenler</h2>
<p>Özellikle elektrik sistemleri (<a href="/urunler/stator">statör</a>, <a href="/urunler/konjektor">konjektör</a>, ateşleme bobini) ve güç aktarım organları (varyatör, <a href="/urunler/debriyaj">debriyaj balatası</a>) konusunda orijinale en yakın, OEM standartlarında parçalar seçilmelidir. Kuba RKS yedek parça uyumluluk rehberimizi referans alarak motosikletinize güvenle alışveriş yapabilirsiniz.</p>

<div class="cta-box">
  <a href="/kategori/yedek-parca" class="btn-primary">Kuba ve RKS Uyumlu Yedek Parçaları İncele</a>
  <a href="https://wa.me/905348996817" class="btn-whatsapp">Şasi No ile Uyumluluğu Hemen Sorgula</a>
</div>`,
    category: "motor",
  },
  {
    slug: "motosiklet-motor-rektefiye-yenileme-rehberi",
    title: "Motosiklet Motor Rektefiye ve Yenileme Rehberi: Ne Zaman Yapılmalı?",
    excerpt: "Motosikletiniz yağ yakıyor, kompresyon kaybediyor veya performans düşüklüğü mü yaşıyor? Motor rektefiye (silindir/piston yenileme) adımlarını uzman anlatımıyla öğrenin.",
    content: `<h2>Giriş</h2>
<p>Motosikletinizin kalbi olan motor bloğu zamanla aşınır. Silindir, piston ve segman gibi hareketli parçalarda meydana gelen yıpranmalar motorun çekişten düşmesine ve yağ yakmasına sebep olur. Bu durumda motor rektefiye (yenileme) işlemi kaçınılmazdır.</p>

<h2>Arıza Belirtileri Nelerdir?</h2>
<p>Motorunuzun rektefiye işlemi gerektirdiğini gösteren en net belirtiler şunlardır:</p>
<ul>
  <li>Motosikletin egzozundan mavi veya yoğun beyaz duman atması (yağ yakma)</li>
  <li>Motor kompresyonunun (sıkıştırma basıncının) bariz şekilde düşmesi</li>
  <li>Yakıt tüketiminin ciddi oranda artması ve çekiş performansının düşmesi</li>
  <li>Motor içinden metal sürtünme sesi veya vuruntu gelmesi</li>
  <li>Ateşleme sistemi, statör veya <a href="/urunler/konjektor">konjektör</a> sağlam olmasına rağmen marşın zor çevirmesi veya gücün tekerleğe aktarılamaması</li>
</ul>

<h2>Motor Yenileme İşleminde Hangi Parçalar Değişir?</h2>
<p>Motosiklet motor rektefiyesinde standart olarak silindir kiti yenilenmesi tavsiye edilir. Aşağıdaki tabloda değişmesi gereken temel parçaları görebilirsiniz:</p>

<table>
  <tr><th>Parça Adı</th><th>Görevi</th><th>Değişim Önem Derecesi</th></tr>
  <tr><td>Silindir Bloğu</td><td>Pistonun içinde hareket ettiği yatak</td><td>Kritik (Çizik varsa değişmeli)</td></tr>
  <tr><td>Piston ve Segman Seti</td><td>Sıkıştırmayı sağlar ve yağı sıyırır</td><td>Kesinlikle değişmeli</td></tr>
  <tr><td>Üst ve Alt Contalar</td><td>Motor yağının sızmasını engeller</td><td>Kesinlikle değişmeli (Her açılışta)</td></tr>
  <tr><td>Eksantrik Zinciri</td><td>Subapların zamanlamasını ayarlar</td><td>Kontrol edilmeli, gevşekse değişmeli</td></tr>
  <tr><td>Subaplar ve Keçeler</td><td>Hava/Yakıt girişini ve gaz çıkışını ayarlar</td><td>Kritik (Sızdırma testi yapılmalı)</td></tr>
</table>

<h2>Usta Tavsiyesi ve Önemli Uyarılar</h2>
<p>Rektefiye işlemi sonrası "rodaj" dönemine azami dikkat edilmelidir. İlk 500-1000 km boyunca motor yüksek devirde zorlanmamalıdır. Ayrıca rektefiye ile birlikte elektrik sistemini besleyen <a href="/urunler/stator">statör</a>, ateşleme bobini ve <a href="/urunler/buji">buji</a> değişimleri de sıfır motor performansı için harika bir yatırımdır.</p>

<div class="cta-box">
  <a href="/kategori/yedek-parca" class="btn-primary">Orijinal Silindir ve Piston Setlerini Göster</a>
  <a href="https://wa.me/905348996817" class="btn-whatsapp">Ustamıza Danışarak Şasi No ile Parça Sorgula</a>
</div>`,
    category: "motor",
  },
  {
    slug: "motosiklet-periyodik-bakim-kritik-parcalari",
    title: "Motosiklet Periyodik Bakım Kılavuzu: Güvenli Sürüş İçin Kritik Parçalar",
    excerpt: "Her periyodik bakımda kontrol edilmesi gereken kritik motosiklet parçaları. Yağ, filtre, balata ve CVT bakımıyla ilgili hayati ipuçları.",
    content: `<h2>Giriş</h2>
<p>Motosikletinizin uzun ömürlü olması ve sürüş güvenliğiniz için periyodik motosiklet bakımı hayati önem taşır. Çoğu sürücü sadece yağı değiştirmenin yeterli olduğunu düşünür, ancak arka planda kontrol edilmesi gereken sayısız parça vardır.</p>

<h2>Arıza Belirtileri (Bakım Geciktiğinde)</h2>
<p>Periyodik bakım yapılmadığında oluşacak uyarı işaretleri şunlardır:</p>
<ul>
  <li>Fren kolunda yumuşama, <a href="/urunler/fren-balatasi">fren balatası</a> bitimine bağlı metal sürtünme sesi</li>
  <li>Yakıt filtresi tıkanıklığı sebebiyle gaz yerken tekleme</li>
  <li>Motor yağının özelliğini yitirmesinden kaynaklı aşırı ısınma ve vites geçişlerinde sertleşme</li>
  <li>CVT scooterlarda varyatör sisteminin toz veya aşınma nedeniyle titremesi</li>
  <li>Hava filtresinin tıkanarak yakıt sarfiyatını artırması</li>
</ul>

<h2>Her Bakımda Değişmesi veya Kontrol Edilmesi Gereken Parçalar</h2>

<table>
  <tr><th>Parça Adı</th><th>Bakım Aralığı</th><th>İşlem (Değişim / Kontrol)</th></tr>
  <tr><td>Motor Yağı ve Yağ Filtresi</td><td>Her 2.000 - 3.000 km</td><td>Değişim</td></tr>
  <tr><td>Hava Filtresi</td><td>Her 5.000 km</td><td>Temizlik / Değişim</td></tr>
  <tr><td>Fren Balatası ve Hidroliği</td><td>Her 5.000 km</td><td>Kontrol / Kalınlığa göre değişim</td></tr>
  <tr><td>Buji</td><td>Her 10.000 km</td><td>Kontrol / Değişim</td></tr>
  <tr><td>Varyatör Kayışı ve Tahrik Seti</td><td>Her 12.000 - 15.000 km</td><td>Kontrol / Değişim</td></tr>
  <tr><td>Konjektör ve Statör Akımı</td><td>Yılda en az 1 kez</td><td>Kontrol ve Multimetre Testi</td></tr>
</table>

<h2>Ağır Bakımlar Hakkında</h2>
<p>Periyodik bakımları atlamak, özellikle motor, ateşleme sistemi ve güç aktarım organı bileşenlerinde kalıcı hasar yaratabilir. Özellikle scooter tipi araçlarda varyatör kapağı içindeki temizliğin yapılması sürüş konforunu direkt etkiler. Bir sorununuz varsa önce <a href="/urunler/buji">buji</a> ve <a href="/urunler/karburator">karbüratör/enjektör</a> kontrolüyle başlayabilirsiniz.</p>

<div class="cta-box">
  <a href="/kategori/yedek-parca" class="btn-primary">Periyodik Bakım Parçalarını İncele</a>
  <a href="https://wa.me/905348996817" class="btn-whatsapp">Bakım Seti İçin Şasi No ile İletişime Geç</a>
</div>`,
    category: "yakit",
  },
  {
    slug: "orijinal-motosiklet-yedek-parca-avantajlari",
    title: "Orijinal Motosiklet Yedek Parça Kullanmanın Avantajları",
    excerpt: "Neden her zaman OEM ve orijinal motosiklet yedek parçası tercih etmelisiniz? Yan sanayi parçaların gizli tehlikeleri ve maliyet analizi.",
    content: `<h2>Giriş</h2>
<p>Motosiklet bakımında en kritik karar, parça seçiminde "Orijinal (OEM)" mi yoksa "Yan Sanayi (Aftermarket)" mi kullanılacağıdır. Ucuz yollu gibi gözüken yan sanayi parçaların motorunuza nasıl zararlar verdiğini detaylandırıyoruz.</p>

<h2>Yan Sanayi Parça Kullanmanın Olası Arıza Belirtileri Nelerdir?</h2>
<p>OEM olmayan yedek parça sebebiyle ortaya çıkan yaygın sorunlar:</p>
<ul>
  <li>Yan sanayi <a href="/urunler/konjektor">konjektör</a> kullanımında; şarj kesme, dalgalanma veya akünün aşırı şarj olup kaynaması</li>
  <li>Kalitesiz <a href="/urunler/fren-balatasi">fren balatası</a> sebebiyle; fren diskinde onarılamaz çizikler ve ötme sesi</li>
  <li>Yanlış ölçülerde üretilmiş silindir / piston sebebiyle; erken kompresyon kaybı ve motor kilitlenmesi</li>
  <li>Ucuz tahrik kayışı kullanımında; kayışın yolda kalarak kopması veya varyatör tasına sarması</li>
  <li>Ucuz hava filtresinde geçirgenliğin yanlış olması sonucu karbüratöre toz/pislik dolarak gaz tepkimesini bozması</li>
</ul>

<h2>Orijinal vs Yan Sanayi Karşılaştırması</h2>

<table>
  <tr><th>Özellik</th><th>Orijinal (OEM) Parça</th><th>Yan Sanayi Parça</th></tr>
  <tr><td>Malzeme Kalitesi</td><td>Üretici onaylı, yüksek dayanıklı alaşım</td><td>Belirsiz malzeme, genelde düşük kalite</td></tr>
  <tr><td>Uyumluluk (Milenyum)</td><td>Birebir üretim (Cıvatalarına kadar)</td><td>Zorlama montaj gerekebilir, boşluk yapar</td></tr>
  <tr><td>Kullanım Ömrü</td><td>Uzun ve stabil</td><td>Tahmin edilemez, genelde kısa</td></tr>
  <tr><td>Uzun Vadeli Maliyet</td><td>Maliyet verimli (Tek seferde çözüm)</td><td>Motor bloğuna zarar vererek yüksek masraf açabilir</td></tr>
</table>

<h2>Sonuç Olarak</h2>
<p>Elektrik aksamında, özellikle <a href="/urunler/stator">statör</a>, CDI beyni ve konjektör üçlüsünde kesinlikle orijinal parçaya sadık kalınmalıdır. Birkaç yüz lira tasarruf etmek uğruna elektrik tesisatını komple yakma riskine girmeyin.</p>

<div class="cta-box">
  <a href="/kategori/yedek-parca" class="btn-primary">TVS Orijinal Yedek Parça Kataloğunu İncele</a>
  <a href="https://wa.me/905348996817" class="btn-whatsapp">Orijinal Parça Teyidi İçin Bize Yazın</a>
</div>`,
    category: "genel",
  },
  {
    slug: "motosiklet-debriyaj-balatasi-sanziman-arizasi",
    title: "Motosiklet Debriyaj Balatası Bitişi ve Şanzıman Arızaları",
    excerpt: "Vitesli motosikletlerde debriyaj balatasının bittiği nasıl anlaşılır? Kaçırma, titreme ve şanzıman arızalarının nedenleri.",
    content: `<h2>Giriş</h2>
<p>Motosikletin motor bloğundan aldığı gücü arka tekerleğe aktaran en önemli sistem olan şanzıman ve debriyaj, yanlış kullanım (yarım debriyaj, sürekli teker yapma) sonucu hızla aşınır. Vitesli motosikletinizdeki "kaçırma" sorununa ışık tutuyoruz.</p>

<h2>Debriyaj Balatası Bitişi Arıza Belirtileri</h2>
<p>Motosikletiniz vites geçişlerinde ve ivmelenmede aşağıdaki belirtileri veriyorsa sorunun kaynağı büyük ihtimal debriyajdır:</p>
<ul>
  <li>Gaz verildiğinde motor devrinin (RPM) yükselmesine rağmen hızın aynı oranda artmaması (Debriyaj Kaçırması)</li>
  <li>Kalkış sırasında motosiklette şiddetli bir titreme ve vuruntu hissedilmesi</li>
  <li>Vites geçişlerinin sertleşmesi ve vites atmakta zorlanma</li>
  <li>Debriyaj tasından gelen ve maneti çekince kesilen sürtünme sesleri (Tas boşluğu)</li>
  <li>Rampa çıkarken devir olduğu halde motorun boğulup yürümemesi</li>
</ul>

<h2>Şanzıman ve Debriyaj Sistemi Uyumluluğu</h2>

<table>
  <tr><th>Olası Senaryo / Sorun</th><th>Sebep Olan Etken</th><th>Çözümü</th></tr>
  <tr><td>Vites Geçişlerinde Sertlik</td><td>Uygun olmayan yağ veya erimiş balata</td><td>Sentetik yağ değişimi, Balata kontrolü</td></tr>
  <tr><td>Devir Artıyor, Motor Gitmiyor</td><td>Debriyaj Balatası ve Sacları Aşınmış</td><td>Balata seti ve yay değişimi</td></tr>
  <tr><td>Kalkışta Ciddi Titreme</td><td>Balata yanık veya tas/göbek yamukluğu</td><td>Tas tornası veya debriyaj komple değişimi</td></tr>
</table>

<h2>Servis Önerisi</h2>
<p>Debriyaj balatası değişimi sırasında sadece mantar balatalar değil, çelik saclar (debriyaj saçları) ve tansiyon yayları da mutlaka kontrol edilmelidir. Aksi halde yeni yaktığınız balatalar kısa sürede tekrar bozulur. İleri analiz için debriyaj tasının durumunu mekaniklerinize kontrol ettirin.</p>

<div class="cta-box">
  <a href="/kategori/yedek-parca" class="btn-primary">Debriyaj Balata Setlerini Görüntüle</a>
  <a href="https://wa.me/905348996817" class="btn-whatsapp">Modelinizle Uyumlu Balatayı Sorgulayın</a>
</div>`,
    category: "motor",
  },
  {
    slug: "mondial-yedek-parca-istanbul-fatih-tedarik",
    title: "Mondial Yedek Parça Tedariği: İstanbul Fatih Orijinal Parça Merkezi (Drift, Revival)",
    excerpt: "İstanbul Fatih merkezli mağazamızdan Mondial Drift L, Revival, X-Treme Max gibi popüler Mondial modellerinin yedek parçalarını anında tedarik edin.",
    content: `<h2>Giriş</h2>
<p>Türkiye'nin en çok tercih edilen motosiklet markalarından Mondial'in yedek parça temini konusunda doğru adrestesiniz. Özellikle Mondial Drift L, Revival ve X-Treme Max modellerine yönelik tüm stok ihtiyacınızı İstanbul Fatih'ten hızlıca karşılıyoruz.</p>

<h2>Sık Aranan Mondial Arıza Çözümleri ve İlgili Parçalar</h2>
<p>Mondial kullanıcılarının en çok uğradığı şikayetler ve çözümleri şunlardır:</p>
<ul>
  <li>Mondial Drift sargı yakma veya akü bitirme sorunu → Yeni <a href="/urunler/stator">Statör</a> ve Konjektör Seti</li>
  <li>Revival modelinde şarj sorunu (Motosikletin yolda kalması) → Uyumlu marş rölesi ve akü sistemi yenileme</li>
  <li>Drift ve vulture modellerinde arka dişli ve zincir bollaşması → OEM Dişli ve O-Ring Zincir değişimi</li>
  <li>Karbüratör hava alması sonucu tekleme (Sarsıntı) → Karbüratör tamir takımı ve manifolt değişimi</li>
</ul>

<h2>Mondial Orijinal Parça Uyumluluğu</h2>

<table>
  <tr><th>Mondial Modeli</th><th>Popüler Tedarik Edilen Parça</th><th>Stok / Uyumluluk</th></tr>
  <tr><td>Mondial Drift 125 L / 150</td><td>Statör (Sargı), Karbüratör, Debriyaj Balatası</td><td>✓ Hazırda mevcut</td></tr>
  <tr><td>Mondial Revival 50cc / 80cc</td><td>Varyatör Kayışı, Bando Kayış, Ağırlık Baga</td><td>✓ Birebir uyumlu OEM</td></tr>
  <tr><td>X-Treme Max 200</td><td>Amortisör, Zincir Dişli, Fren Balatası</td><td>✓ Uyumlu</td></tr>
  <tr><td>Mondial ZNU / Vulture</td><td>Akü, Konjektör, Marş Motoru</td><td>✓ Hazır stok</td></tr>
</table>

<h2>Yedek Parça Seçerken</h2>
<p>İstanbul içinde aynı gün elden teslim veya kargo imkanı sunan Paşa Motor sayesinde, motosikletinizin tamirini hızlandırıyoruz. Orijinal parça numarasını bilmiyorsanız, şasi numaranızla uyumluluğu anında belirliyoruz.</p>

<div class="cta-box">
  <a href="/kategori/yedek-parca" class="btn-primary">Mondial Yedek Parça Mağazasına Git</a>
  <a href="https://wa.me/905348996817" class="btn-whatsapp">WhatsApp'tan Drift L veya Revival Parçası Sor</a>
</div>`,
    category: "genel",
  },
  {
    slug: "tvs-apache-rtr-jupiter-yedek-parca-ariza-rehberi",
    title: "TVS Apache RTR 200 ve Jupiter Arıza Belirtileri ve Yedek Parça Çözümleri",
    excerpt: "TVS Apache RTR 200 ve Jupiter kullanıcıları için spesifik kronik sorunlar, ABS arızaları, elektrik sistemi uyarıları ve çözümleri.",
    content: `<h2>Giriş</h2>
<p>TVS'nin yüksek satış rakamlarına ulaşan iki dev modeli; Apache RTR 200 ve Jupiter 110-125... Sağlam motor mekaniğine sahip bu modellerin zamanla gösterdiği aşınmalar, yedek parça gereksinimlerini de doğuruyor. Paşa Motor olarak TVS uzmanlığımızı paylaşıyoruz.</p>

<h2>Apache ve Jupiter Arıza Belirtileri</h2>
<p>TVS motosikletiniz aşağıdaki işaretleri veriyorsa onarım zamanı gelmiştir:</p>
<ul>
  <li><strong>Apache RTR 200:</strong> Yüksek hızlarda ABS uyarı ışığının yanık kalması veya ABS sensörü okunmama hatası</li>
  <li><strong>Apache RTR 200:</strong> Elektrik gösterge paneli ışıklarının seyir halindeyken kendi kendine kapanıp açılması (Akım dalgalanması)</li>
  <li><strong>Jupiter:</strong> Kalkış anında motordan ve varyatör içerisinden gelen viyk/kavrama titreme sesi</li>
  <li><strong>Ortak:</strong> Ekranda Engine Check (Motor Arızası) ışığı ve rölanti devrinin dengesiz çalışması</li>
  <li><strong>Ortak:</strong> Motorun akü bitirmesi ve marş rölesinin sadece "tık" sesi çıkarması</li>
</ul>

<h2>TVS Apache / Jupiter Parça Değişim Tablosu</h2>

<table>
  <tr><th>Sorun Alanı</th><th>Model</th><th>İlgili Yedek Parça</th></tr>
  <tr><td>Rölanti Dalgalanması ve Tıkanma</td><td>RTR 200 (Enjeksiyonlu)</td><td>Boğaz Kelebeği ve Enjektör Temizliği/Değişimi</td></tr>
  <tr><td>Ekrana Elektrik Gelmemesi</td><td>Ortak</td><td><a href="/urunler/konjektor">Konjektör</a> ve Akü Kontrolü</td></tr>
  <tr><td>Varyatörden Sesi (Gacır Gucur)</td><td>TVS Jupiter</td><td>Baga, Hassas Kayış veya Tam Varyatör Kiti</td></tr>
  <tr><td>Subap Vuruntu Sesi (Çıt çıt)</td><td>RTR 200</td><td>Subap ayarı, Eksantrik Zinciri Gergisi</td></tr>
</table>

<h2>Profesyonel TVS Servis Çözümü</h2>
<p>TVS Apache'lerde görülen şarj sistemi hatalarında çoğu zaman arayüz sadece akü bittiği için ekran ışığını söndürür. Önceliğiniz sağlam bir <a href="/urunler/stator">statör</a> teşhisi ve ardından orijinal regülatör değişimini yapmaktır.</p>

<div class="cta-box">
  <a href="/kategori/yedek-parca" class="btn-primary">TVS Apache / Jupiter Parçalarını Bulun</a>
  <a href="https://wa.me/905348996817" class="btn-whatsapp">TVS Arızanız İçin Ustaya Mesaj Atın</a>
</div>`,
    category: "elektrik",
  },
  {
    slug: "scooter-varyator-debriyaj-bakimi-performans-artirma",
    title: "Scooter Varyatör ve Debriyaj Bakımı ile Tam Performans Mümkün mü?",
    excerpt: "Otomatik vites scooter motosikletlerin (TVS Jupiter, RKS Spontini, Mondial Revival vs.) varyatör performansı nasıl artırılır? Baga ve kayış değişim rehberi.",
    content: `<h2>Giriş</h2>
<p>Vitesli motosikletlerdeki şanzıman ve debriyaj mantığının scooter tarafındaki karşılığı CVT varyatör sistemidir. Şehir içi ulaşımlarda pratik olan scooterların hızlanmasının yavaşlaması veya çok yakması direkt varyatör bakımıyla ilgilidir.</p>

<h2>Varyatör Arıza ve Performans Düşüklüğü Belirtileri</h2>
<p>Scooter motosikletiniz aşağıdaki sorunları çıkarıyorsa CVT bakım zamanı gelmiştir:</p>
<ul>
  <li>Motosikletin eski son hızlarına (Top Speed) ulaşamaması</li>
  <li>Kalkışlarda belirgin bir titreme, ön kasnağa vurma hissi</li>
  <li>Varyatör kapağından sarkan kayış sesi, tıkırtı veya tiz sürtünme sesleri</li>
  <li>Baga aşınması sebebiyle devrin çabuk yükselip motorun hızlanamaması</li>
  <li>Rampalarda (yokuş çıkarken) motorun çekişten çok şiddetli düşmesi ve ısınması</li>
</ul>

<h2>Scooter CVT Bakım Tablosu</h2>

<table>
  <tr><th>Bakım Uygulaması</th><th>Amaç ve Sonuç</th><th>Kritik Uyumluluk</th></tr>
  <tr><td>Ön Varyatör Baga Değişimi</td><td>Aşınan köşeli bagalar değişir, hızlanma pürüzsüzleşir. Ağır/Hafif baga ile top speed ayarı yapılır.</td><td>Gramaj motor standardında olmalı</td></tr>
  <tr><td>Varyatör Kayışı Değişimi</td><td>İncelmiş ve diş atlayan kayış yenilenerek yolda kalma riski önlenir.</td><td>Orijinal (Özellikle Bando vb.)</td></tr>
  <tr><td>Arka Varyatör Tas Temizliği</td><td>Balata tozundan aranan tas kalkış titremesini bitirir.</td><td>Tas yanık/kayganlaşmışsa değişir</td></tr>
  <tr><td>Arka Debriyaj Balatası</td><td>Kayıştan aldığı gücü tekere ileten zımpara etkisi geri döner.</td><td>Kesinlikle uyumlu OEM olmalı</td></tr>
</table>

<h2>Küçük Ayar, Büyük Performans</h2>
<p>Scooter'ınızı ilk fabrika günündeki 0 km çekiş hissiyatına kavuşturmak için kayış ve baga ikilisini aynı anda değiştirmek altın kuraldır. Uyumsuz baga ve tahrik mili parçaları sisteminizi mahvedebilir.</p>

<div class="cta-box">
  <a href="/kategori/yedek-parca" class="btn-primary">Varyatör Balata ve Bando Kayış Fiyatlarına Göz At</a>
  <a href="https://wa.me/905348996817" class="btn-whatsapp">Scooter Yedek Parçaları İçin Ustamıza Danışın</a>
</div>`,
    category: "motor",
  },
  {
    slug: "yazlik-motosiklet-bakimi-ve-sicak-hava-rehberi",
    title: "Yazlık Motosiklet Bakımı: Sıcak Havalara Hazırlık Rehberi",
    excerpt: "Kavurucu yaz sıcaklarında motorunuzun ısınmasını engelleyecek, performansı artıracak ve akünüzü koruyacak kritik yaz bakım önerileri.",
    content: `<h2>Giriş</h2>
<p>Soğuk havalardan çıkan motosikletiniz aşırı sıcak havaların olduğu yaz dönemine mutlaka önden hararet ve viskozite bakımlarıyla girmelidir. Yazın yüksek ısı ile savaşan iki bileşen motor bloğu ve aküdür.</p>

<h2>Yazın Motor Arıza Belirtileri (Kötü Bakım Varsa)</h2>
<p>Yazlık bakımını yapmadığınız bir motosiklette şu uyarılar gözlemlenir:</p>
<ul>
  <li>Motor sıcaklığının anormal derecede yükselmesi ve radyatör fanının sürekli (aralıksız) çalışması</li>
  <li>Kışın koyulan ince yağın sıcakta suya dönüşmesi kaynaklı supap ve motor vuruntu sesleri</li>
  <li>Buharlaşma kaynaklı yakıt sarfiyatının artması</li>
  <li>Sıcaktan genleşen fren hidrolik sıvısının frenleri sertleştirmesi ve manet şişmesi</li>
  <li>Aşırı sıcak motorda konjektör/regülatör soğutma kanallarının yetersiz kalıp <a href="/urunler/konjektor">konjektör</a> ünitesinin yanması</li>
</ul>

<h2>Yaz Bakım Listesi</h2>

<table>
  <tr><th>Bakım Adımı</th><th>Operasyon ve Önem</th><th>Gereken Sıklık</th></tr>
  <tr><td>Yazlık Yağ (10W-40 / 15W-50 vb) Geçiși</td><td>Sıcak hava koşullarında kalınlaşan yağ viskozitesi motoru korur.</td><td>Mevsim başında 1 Kez</td></tr>
  <tr><td>Antifriz Değişimi</td><td>Sulu soğutmalı motorlarda paslanmayı önler, kaynamayı geciktirir.</td><td>Yılda 1 Kez (Yaz başı ideal)</td></tr>
  <tr><td>Elektrik ve Akü Ölçümü</td><td>Sıcak aküyü şişirebilir. Şarj değeri multimetre ile ölçülmeli.</td><td>Mevsim geçişinde</td></tr>
  <tr><td>Zincir Temizliği ve Kuru Yağlama</td><td>Yazın yollardaki toz ve kum birikir, kuru yağlama tercih edilir.</td><td>Her 300-500 km'de bir</td></tr>
</table>

<h2>Konjektör Uyarısı</h2>
<p>Sıcak günlerde dur-kalk trafiğinde uzun süre kalmak, kapalı kasa motorlarda soğuyamayan <a href="/urunler/stator">statör</a> sargılarının kavrulmasına yol açabilir. Yazları devirli kullanımlarda ve rölanti sürelerinde rüzgar sirkülasyonuna dikkat edin.</p>

<div class="cta-box">
  <a href="/kategori/yedek-parca" class="btn-primary">Motosiklet Bakım Setlerini İnceleyin</a>
  <a href="https://wa.me/905348996817" class="btn-whatsapp">Şasi Numaranızla Yağ ve Filtre Takımına Ulaşın</a>
</div>`,
    category: "genel",
  }
];

async function run() {
  for (const post of blogPosts) {
    console.log("Upserting blog post: " + post.slug);
    
    const { data: existing } = await supabase.from('posts').select('id').eq('slug', post.slug).single();
    
    // Rastgele görsel atama
    const randomSeed = Math.floor(Math.random() * 9000) + 1000;
    const cover_image = `https://image.pollinations.ai/prompt/motorcycle%20spare%20parts%20close%20up%20real%20epic%20commercial%20photography%20${randomSeed}?width=1200&height=630&nologo=true`;

    const payload = {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      cover_image,
      meta_title: post.title.substring(0, 60),
      meta_description: post.excerpt.substring(0, 155),
      is_published: true,
      category: post.category,
      published_at: new Date().toISOString()
    };
    
    if (existing) {
      await supabase.from('posts').update(payload).eq('slug', post.slug);
    } else {
      await supabase.from('posts').insert(payload);
    }
  }
  console.log("Tüm içerikler başarıyla baştan yazıldı ve eklendi!");
}

run().catch(console.error);
