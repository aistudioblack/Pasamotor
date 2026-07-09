export interface DefaultLegalPage {
  slug: string;
  title: string;
  content: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export const legalDefaults: Record<string, DefaultLegalPage> = {
  "kvkk-aydinlatma-metni": {
    slug: "kvkk-aydinlatma-metni",
    title: "KVKK Aydınlatma Metni",
    content: `<div class="space-y-6 text-foreground/90">
    <p class="lead text-base font-semibold text-foreground border-b border-border/50 pb-2">6698 SAYILI KİŞİSEL VERİLERİN KORUNMASI KANUNU (KVKK) KAPSAMINDA AYDINLATMA METNİ</p>
    
    <p>Paşa Motor (Bundan böyle "Şirket" veya "Paşa Motor" olarak anılacaktır) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, "Veri Sorumlusu" sıfatıyla, kişisel verilerinizi güvenle koruyor ve yasal mevzuata tam uyum çerçevesinde işliyoruz. İşbu Aydınlatma Metni, verilerinizin toplanma yöntemleri, işlenme amaçları, hukuki sebepleri ve haklarınız konusunda sizi bilgilendirmek amacıyla hazırlanmıştır.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">1. VERİ SORUMLUSUNÜN KİMLİĞİ</h3>
    <div class="p-4 border border-border/60 rounded-xl bg-card my-3">
      <p><strong>Ticari Unvan:</strong> Paşa Motor - Nihat KAN</p>
      <p><strong>Adres:</strong> İstanbul, Türkiye</p>
      <p><strong>E-posta:</strong> <span style="direction: rtl; unicode-bidi: bidi-override; display: inline-block;">moc.liamg@rotomasap</span></p>
    </div>

    <h3 class="text-lg font-bold text-foreground mt-6">2. İŞLENEN KİŞİSEL VERİLERİNİZ</h3>
    <p>Ziyaretiniz, üyelik süreciniz veya alışverişleriniz esnasında işlenen verileriniz şunlardır:</p>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Kimlik Bilgileri:</strong> Ad soyad, cinsiyet, vergi numarası veya T.C. kimlik numarası (fatura düzenleme sınırları dahilinde).</li>
      <li><strong>İletişim Bilgileri:</strong> Teslimat adresi, fatura adresi, telefon numarası, e-posta adresi.</li>
      <li><strong>Müşteri İşlem Bilgileri:</strong> Satın alınan yedek parçalar, sepet geçmişi, fatura ve sipariş detayları, çağrı/destek merkezi kayıtları.</li>
      <li><strong>İşlem Güvenliği Bilgileri:</strong> IP adresi, site içi gezinti logları, cihaz bilgileri, tarayıcı türü, oturum anahtarları.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-6">3. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI</h3>
    <p>Kişisel verileriniz, yürürlükteki yasal mevzuat sınırları dâhilinde şu amaçlarla işlenecektir:</p>
    <ul class="list-disc pl-5 space-y-2">
      <li>Ürün satış, faturalandırma, kargolama ve teslimat süreçlerinin kesintisiz yürütülmesi,</li>
      <li>Doğru ve uyumlu motor yedek parça siparişlerinin tespiti ve teknik destek sağlanması,</li>
      <li>Satış sonrası iade, garanti ve müşteri ilişkileri destek süreçlerinin işletilmesi,</li>
      <li>Mevzuattan kaynaklanan muhasebe, vergilendirme ve diğer yasal bildirim gerekliliklerinin ifası,</li>
      <li>Bilgi ve işlem güvenliğinin teyit edilmesi ile siber tehditlerin önlenmesi,</li>
      <li>Yetkili idari, denetleyici veya adli makamlara yasal zorunluluk gereği bilgi sağlanması.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-6">4. İŞLENEN KİŞİSEL VERİLERİN AKTARILMASI</h3>
    <p>Kişisel verileriniz, yukarıdaki amaçlarla doğrudan bağlantılı olmak ve yasal limitler dahilinde kalmak kaydıyla;</p>
    <ul class="list-disc pl-5 space-y-2">
      <li>Siparişlerinizin adresinize ulaştırılması için iş ortaklığımız olan yurt içi kargo firmalarına,</li>
      <li>Güvenli ödemelerin gerçekleştirilebilmesi amacıyla BDDK lisanslı ödeme geçidi sağlayıcılarına,</li>
      <li>Gerekli hallerde bağımsız denetçilere, mali müşavirimize ve yasal süreç danışmanlarımıza,</li>
      <li>Kişisel Verilerin Korunması Kurulu, Ticaret Bakanlığı ve adli merciler gibi kanunen yetkili kamu kurum ve kuruluşlarına işleme şartları doğrultusunda aktarılabilecektir.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-6">5. VERİ TOPLAMA YÖNTEMLERİ VE HUKUKİ SEBEPLERİ</h3>
    <p>Kişisel verileriniz, web sitemizdeki üyelik kayıt formları, sepet adımındaki bilgi giriş alanları, teknik destek talepleriniz ve kullanıcı deneyimi analiz çerezleri vasıtasıyla tamamen veya kısmen otomatik yöntemlerle elektronik ortamda toplanmaktadır.</p>
    <p class="mt-2 text-muted-foreground">Söz konusu kişisel verilerin işlenmesinin hukuki sebepleri, KVKK Madde 5/2 uyarınca;</p>
    <ul class="list-disc pl-5 space-y-1">
      <li>"a) Kanunlarda açıkça öngörülmesi",</li>
      <li>"c) Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması kaydıyla, sözleşmenin taraflarına ait kişisel verilerin işlenmesinin gerekli olması",</li>
      <li>"ç) Veri sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması",</li>
      <li>"f) İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması" maddelerine dayanmaktadır.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-6">6. İLGİLİ KİŞİNİN HAKLARI (KVKK Madde 11)</h3>
    <p>KVKK'nın 11. maddesi kapsamındaki hak taleplerinizi, başvuruları kolaylaştırmak adına hazırladığımız <strong><span style="direction: rtl; unicode-bidi: bidi-override; display: inline-block;">moc.liamg@rotomasap</span></strong> e-posta adresine güvenli elektronik imzanız ile ya da kimliğinizi kanıtlayan belgelerle şirket merkez adresimize yazılı olarak iletebilirsiniz. Başvurularınız en geç 30 (otuz) gün içerisinde sonuçlandırılacaktır.</p>
  </div>`,
    meta_title: "KVKK Aydınlatma Metni | Paşa Motor",
    meta_description: "Kişisel verilerinizin korunması, işlenmesi ve 6698 sayılı kanuna uygun kullanım detaylarını içeren aydınlatma metnimiz.",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  "cerez-politikasi": {
    slug: "cerez-politikasi",
    title: "Çerez Politikası",
    content: `<div class="space-y-6 text-foreground/90">
    <p class="lead text-base font-semibold text-foreground border-b border-border/50 pb-2">PAŞA MOTOR ÇEREZ POLİTİKASI</p>
    <p>Paşa Motor olarak sitemizin (pasamotor.com.tr) ziyaretçilerinin gizliliğini korumak ve kullanıcı deneyimini optimize etmek amacıyla çeşitli çerezler (cookie) kullanmaktayız. İşbu politika, hangi çerezlerin ne amaçla kullanıldığını ve bunları nasıl kontrol edebileceğinizi açıklamaktadır.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">1. ÇEREZ (COOKIE) NEDİR?</h3>
    <p>Çerezler, bir internet sitesini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet veya akıllı telefon) kaydedilen ve siteyle olan etkileşimlerinize ilişkin verileri tutan küçük boyutlu metin dosyalarıdır.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">2. HANGİ TÜR ÇEREZLERİ KULLANIYORUZ?</h3>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Zorunlu Çerezler (Essential Cookies):</strong> Internet sitemizin güvenli bir şekilde çalışabilmesi, sayfalar arası geçişin sağlanması ve sepet adımları gibi temel işlevleri yerine getirebilmesi için kesinlikle gerekli olan çerezlerdir. Devre dışı bırakılamazlar.</li>
      <li><strong>Performans ve Analiz Çerezleri (Analytical/Performance Cookies):</strong> Sitemizi kaç kişinin ziyaret ettiğini, hangi sayfaların daha çok tıklandığını analiz ederek site tasarımını ve performansını artırmamıza yarayan çerezlerdir.</li>
      <li><strong>Fonksiyonel Çerezler (Functional Cookies):</strong> Dil tercihiniz, kullanıcı kayıt ayarlarınız gibi tercihlerinizi hatırlayarak sitemizi bir sonraki ziyaretinizde kişiselleştirilmiş bir deneyim sunmamızı sağlar.</li>
      <li><strong>Hedefleme ve Pazarlama Çerezleri (Targeting/Advertising Cookies):</strong> İlgi alanlarınıza uygun kişiselleştirilmiş reklamlar sunmak ve reklam kampanyalarının etkililiğini ölçmek amacıyla kullanılmaktadır.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-6">3. ÇEREZLERİ NASIL DENETLEYEBİLİR VEYA SİLEBİLİRSİNİZ?</h3>
    <p>Çerezlerin kullanımına ilişkin tercihlerinizi değiştirmek, çerezleri engellemek veya silmek için tarayıcınızın ayarlarını değiştirmeniz yeterlidir. Sıklıkla kullanılan tarayıcıların çerez yönetim adımları şunlardır:</p>
    <ul class="list-disc pl-5 space-y-1">
      <li><strong>Google Chrome:</strong> Ayarlar > Gizlilik ve Güvenlik > Çerezler ve Diğer Site Verileri</li>
      <li><strong>Mozilla Firefox:</strong> Seçenekler > Gizlilik ve Güvenlik > Geçmiş / Çerezler</li>
      <li><strong>Safari:</strong> Tercihler > Gizlilik > Çerezleri ve web sitesi verilerini engelle</li>
      <li><strong>Microsoft Edge:</strong> Ayarlar > Üçüncü taraf tanımlama bilgileri ve site izinleri</li>
    </ul>
    <p class="mt-4 text-muted-foreground">Zorunlu çerezleri engellemeniz durumunda, sitemizdeki bazı temel e-ticaret işlevlerinin çalışmayabileceğini hatırlatmak isteriz.</p>
  </div>`,
    meta_title: "Çerez Politikası | Paşa Motor",
    meta_description: "İnternet sitemizde kullanılan çerez türleri, kullanım amaçları ve yönetimine ilişkin politikamız.",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  "gizlilik-ve-guvenlik": {
    slug: "gizlilik-ve-guvenlik",
    title: "Gizlilik ve Güvenlik",
    content: `<div class="space-y-6 text-foreground/90">
    <p class="lead text-base font-semibold text-foreground border-b border-border/50 pb-2">GİZLİLİK VE VERİ GÜVENLİĞİ POLİTİKASI</p>
    <p>Paşa Motor olarak müşterilerimizin güvenliğine ve gizliliğine azami önem gösteriyoruz. Bu kapsamda, sitemiz üzerinden gerçekleştirdiğiniz alışverişler ve paylaştığınız veriler en üst düzey dijital koruma standartları altında güvenceye alınmıştır.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">1. VERİ İLETİM GÜVENLİĞİ (SSL ŞİFRELEME)</h3>
    <p>Sitemizin tüm sayfalarında ve özellikle üyelik/sipariş ekranlarında aktarılan kritik veriler (şifre, adres, sipariş detayları vb.), modern 256-bit SSL (Secure Sockets Layer) şifreleme protokolü ile korunmaktadır. Tarayıcınızın adres çubuğundaki kilit simgesi, verilerinizin şifrelenerek sunucumuza iletildiğinin ve üçüncü şahıslar tarafından dinlenemeyeceğinin kanıtıdır.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">2. KARTLI ÖDEME GÜVENLİĞİ (PCI-DSS UYUMLULUĞU VE 3D SECURE)</h3>
    <p>Paşa Motor, e-ticaret ödeme altyapısında Bankacılık Düzenleme ve Denetleme Kurumu (BDDK) lisanslı ve uluslararası PCI-DSS veri güvenliği standardına sahip ödeme aracılarını kullanmaktadır.</p>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Kart Bilgisi Kaydedilmez:</strong> Kredi kartı veya banka kartı bilgileriniz hiçbir şekilde bizim sunucularımızda veya veritabanımızda <strong>tutulmamakta, saklanmamakta ve işlenmemektedir</strong>. Kart işlemleri doğrudan bankanız ile güvenli ödeme geçidi arasında yürütülmektedir.</li>
      <li><strong>3D Secure Zorunluluğu:</strong> Alışverişlerinizi güvenle tamamlayabilmeniz için tüm kartlı işlemlerde SMS ile tek kullanımlık şifre doğrulama (3D Secure) sistemi zorunlu tutulmaktadır.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-6">3. KİŞİSEL VERİLERİN GİZLİLİĞİ</h3>
    <p>Şirketimize ilettiğiniz isim, adres, telefon ve e-posta gibi kişisel bilgiler, yasal yükümlülükler ile yetkili idari ve adli makamların resmi emirleri haricinde, kesinlikle üçüncü şahıs ve kurumlarla ticari amaçlarla paylaşılmamakta, satılmamakta veya kiralanmamaktadır.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">4. KULLANICI SORUMLULUKLARI</h3>
    <p>Sistemimizin güvenliğinin kusursuz işleyebilmesi için üyelerimizin de kendi hesap şifrelerini üçüncü kişilerle paylaşmaması, güvenli şifre kombinasyonları kullanması ve ortak kullanılan bilgisayarlarda güvenli çıkış yapması gerekmektedir. Şifre güvenliğinin ihmalinden doğabilecek aksaklıklardan kullanıcı sorumludur.</p>
  </div>`,
    meta_title: "Gizlilik ve Güvenlik | Paşa Motor",
    meta_description: "En üst düzey alışveriş güvenliği, SSL şifreleme, 3D Secure ve kullanıcı veri gizliliği taahhüdümüz.",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  "mesafeli-satis-sozlesmesi": {
    slug: "mesafeli-satis-sozlesmesi",
    title: "Mesafeli Satış Sözleşmesi",
    content: `<div class="space-y-6 text-foreground/90">
    <p class="lead text-base font-semibold text-foreground border-b border-border/50 pb-2">MESAFELİ SATIŞ SÖZLEŞMESİ</p>
    
    <h3 class="text-lg font-bold text-foreground mt-6">1. TARAFLAR</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
      <div class="border border-border/50 p-4 rounded-xl bg-card">
        <p class="font-bold underline text-foreground mb-1">SATICI BİLGİLERİ:</p>
        <p><strong>Ünvan:</strong> Paşa Motor - Nihat KAN</p>
        <p><strong>Adres:</strong> İstanbul, Türkiye</p>
        <p><strong>E-posta:</strong> <span style="direction: rtl; unicode-bidi: bidi-override; display: inline-block;">moc.liamg@rotomasap</span></p>
      </div>
      <div class="border border-border/50 p-4 rounded-xl bg-card">
        <p class="font-bold underline text-foreground mb-1">ALICI BİLGİLERİ (TÜKETİCİ):</p>
        <p>Web sitesi üzerinden sipariş veren, kişisel bilgileri sipariş formunda belirtilen ve doğrulanmış olan müşteridir.</p>
      </div>
    </div>

    <h3 class="text-lg font-bold text-foreground mt-6">2. SÖZLEŞMENİN KONUSU VE KAPSAMI</h3>
    <p>İşbu Sözleşme, Alıcı'nın Satıcı'ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği yedek parça, aksesuar veya servis ürünlerinin satışı, bedeli ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca tarafların hak ve yükümlülüklerini düzenler.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">3. SÖZLEŞME KONUSU ÜRÜN VE ÖDEME BİLGİLERİ</h3>
    <p>Sipariş edilen ürünlerin cinsi, miktarı, satış bedeli, vergi dahil fiyatı, kargo ücreti ve ödeme şekli sipariş onay ekranında ve fatura detayında belirtildiği gibidir. Gönderilen tüm ürünlerde fatura kesilmesi yasal zorunluluktur.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">4. CAYMA HAKKI</h3>
    <p>Alıcı (Tüketici), hiçbir yasal ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin, ürünü teslim aldığı tarihten itibaren <strong>14 (on dört) gün</strong> içerisinde cayma hakkını kullanarak ürünü iade edebilir.</p>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Cayma Hakkının Kullanımı:</strong> Alıcı, cayma talebini bu süre zarfında yazılı olarak veya e-posta yoluyla Satıcı'ya ulaştırmalıdır.</li>
      <li><strong>İade Şartları:</strong> İade edilecek ürünün koruyucu ambalajının açılmamış, kullanılmamış, montajı yapılmamış ve yeniden satılabilirlik özelliğini yitirmemiş olması şarttır.</li>
      <li><strong>İade Kargo Bedeli:</strong> Cayma hakkı kapsamında yapılan iadelerde, Satıcı'nın anlaşmalı olduğu kargo firması kullanıldığı takdirde kargo bedeli Satıcı'ya aittir.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-6">5. CAYMA HAKKININ İSTİSNALARI</h3>
    <p>Mevzuat gereği; tüketiciye özel olarak hazırlanan/kesilen kablo, boru veya montajı yapılmış elektrikli yedek parçalar gibi iadesi sağlık veya teknik olarak uygun olmayan ve ambalajı açıldıktan sonra orijinalliği bozulan ürünlerde cayma hakkı kullanılamaz.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">6. UYUŞMAZLIKLARIN ÇÖZÜMÜ</h3>
    <p>İşbu Sözleşmeden doğacak her türlü uyuşmazlıkta, Ticaret Bakanlığı tarafından ilan edilen parasal değer sınırları dahilinde, Alıcı’nın mal veya hizmeti satın aldığı veya ikametgahının bulunduğu yerdeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.</p>
  </div>`,
    meta_title: "Mesafeli Satış Sözleşmesi | Paşa Motor",
    meta_description: "Tasarruflu ve güvenli alışverişinizi koruyan, cayma hakkı ve garanti şartlarını içeren resmi tüketici mesafeli satış sözleşmesi.",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  "kullanim-kosullari": {
    slug: "kullanim-kosullari",
    title: "Kullanım Koşulları",
    content: `<div class="space-y-6 text-foreground/90">
    <p class="lead text-base font-semibold text-foreground border-b border-border/50 pb-2">WEB SİTESİ KULLANIM KOŞULLARI SÖZLEŞMESİ</p>
    <p>Bu web sitesini (pasamotor.com.tr) ziyaret ederek veya sitemize üye olarak, aşağıda belirtilen kullanım koşullarını şartsız olarak kabul etmiş sayılırsınız. Lütfen siteyi kullanmadan önce bu koşulları dikkatlice okuyunuz.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">1. FİKRİ VE SINAİ MÜLKİYET HAKLARI</h3>
    <p>Sitemizde yer alan logo, tasarım, kod, metinler, yedek parça açıklamaları, görseller ve diğer tüm materyellerin fikri mülkiyet hakları Paşa Motor'a aittir ve uluslararası telif yasaları ile korunmaktadır. Şirketin yazılı izni olmaksızın site içeriğinin kısmen dahi olsa kopyalanması, çoğaltılması, başka sitelerde paylaşılması veya ticari amaçla kullanılması kesinlikle yasaktır.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">2. HİZMETİN KULLANIMI</h3>
    <p>Kullanıcılar, web sitesini yasalara ve dürüstlük kurallarına uygun olarak kullanmayı taahhüt ederler. Sitemizin güvenliğini tehlikeye atacak, sunuculara aşırı yük bindirecek veya diğer kullanıcıların siteyi kullanmasını engelleyecek her türlü eylem (DDoS, spam, veri kazıma (scraping), zararlı kod enjeksiyonu) hukuki ve cezai takibata tabidir.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">3. SORUMLULUĞUN SINIRLANDIRILMASI</h3>
    <p>Paşa Motor, internet sitesinde yer alan teknik bilgi, yedek parça uyumluluk verileri ve görsel içeriklerin doğruluğunu sağlamak için makul ölçüde çaba göstermektedir. Ancak, üretim yılı farkları, şasi uyumsuzlukları veya olası yazım hataları sebebiyle doğabilecek doğrudan veya dolaylı zararlardan sorumlu tutulamaz. Yedek parça uyumluluğu hususunda şüphe durumunda, montaj öncesi iletişim hatlarımızdan destek alınması tavsiye edilir.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">4. DEĞİŞİKLİK VE BÖLÜNEBİLİRLİK</h3>
    <p>Paşa Motor, önceden bildirimde bulunmaksızın bu Kullanım Koşullarını güncelleme, sitedeki ürün fiyatlarını ve stok durumlarını değiştirme hakkını saklı tutar. Değişiklikler sitede yayınlandığı andan itibaren yürürlüğe girer.</p>

    <h3 class="text-lg font-bold text-foreground mt-6">5. UYGULANACAK HUKUK VE YETKİLİ MAHKEME</h3>
    <p>Bu koşulların uygulanmasında, yorumlanmasında ve yönetiminde Türkiye Cumhuriyeti kanunları geçerli olacaktır. Olası uyuşmazlıklarda yetkili merci İstanbul Çağlayan Mahkemeleri ve İcra Daireleridir.</p>
  </div>`,
    meta_title: "Kullanım Koşulları | Paşa Motor",
    meta_description: "pasamotor.com.tr web sitesi fikri haklar, site kullanım kuralları, yükümlülükler ve yasal yetki şartları.",
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};
