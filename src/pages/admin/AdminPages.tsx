import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/firebase-client";
import { Plus, Trash2, Edit2, FileText, Loader2, Save, FileCheck, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/firebase-types";

type Page = Tables<"pages">;

export default function AdminPages() {
  const { toast } = useToast();
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  
  const [form, setForm] = useState<Partial<Page>>({
    title: "",
    slug: "",
    content: "",
    meta_title: "",
    meta_description: "",
    is_published: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    const { data } = await dbClient.from("pages").select("*").order("created_at", { ascending: false });
    setPages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (page: Page) => {
    setEditingId(page.id);
    setForm(page);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setEditingId(null);
    setForm({
      title: "",
      slug: "",
      content: "",
      meta_title: "",
      meta_description: "",
      is_published: true
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`'${title}' sayfasını silmek istediğinize emin misiniz?`)) return;
    const { error } = await dbClient.from("pages").delete().eq("id", id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Silindi", description: "Sayfa başarıyla silindi." });
      loadData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const { error } = await dbClient
          .from("pages")
          .update({
            title: form.title,
            slug: form.slug,
            content: form.content,
            meta_title: form.meta_title,
            meta_description: form.meta_description,
            is_published: form.is_published,
            updated_at: new Date().toISOString()
          })
          .eq("id", editingId);
        if (error) throw error;
        toast({ title: "Güncellendi", description: "Sayfa başarıyla güncellendi." });
      } else {
        const { error } = await dbClient
          .from("pages")
          .insert({
            title: form.title!,
            slug: form.slug!,
            content: form.content || "",
            meta_title: form.meta_title || "",
            meta_description: form.meta_description || "",
            is_published: form.is_published ?? true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        if (error) throw error;
        toast({ title: "Oluşturuldu", description: "Yasal sayfa başarıyla eklendi." });
      }
      setIsFormOpen(false);
      loadData();
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSeedDefaults = async () => {
    if (!window.confirm("Türkiye Cumhuriyeti yasalarına (KVKK, Tüketici Kanunu vb.) tam uyumlu, kurumsal düzeyde 5 adet sözleşme ve bilgilendirme sayfasını veritabanına otomatik yüklemek istiyor musunuz? Mevcut olan URL yolları korunacaktır.")) return;
    
    setSeeding(true);
    try {
      const defaultPages = [
        {
          slug: "kvkk-aydinlatma-metni",
          title: "KVKK Aydınlatma Metni",
          content: `<div class="space-y-6">
    <p class="lead text-base font-semibold text-foreground">6698 SAYILI KİŞİSEL VERİLERİN KORUNMASI KANUNU (KVKK) KAPSAMINDA AYDINLATMA METNİ</p>
    
    <h3 class="text-lg font-bold text-foreground mt-4">1. VERİ SÖRÜMLÜSÜNÜN KİMLİĞİ</h3>
    <p>Paşa Motor (Bundan böyle "Şirket" veya "Paşa Motor" olarak anılacaktır) olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca, "Veri Sorumlusu" sıfatıyla, kişisel verilerinizi aşağıda açıklanan amaçlar kapsamında, hukuka ve dürüstlük kurallarına uygun bir şekilde işleyebilmekte, kaydedebilmekte ve saklayabilmekteyiz.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">2. İŞLENEN KİŞİSEL VERİLERİNİZ</h3>
    <p>Web sitemiz üzerinden sunduğumuz hizmetler, e-ticaret süreçleri ve iletişim kanalları aracılığıyla aşağıdaki kişisel verileriniz işlenebilmektedir:</p>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, T.C. kimlik numarası (gerekli hallerde).</li>
      <li><strong>İletişim Bilgileri:</strong> Telefon numarası, e-posta adresi, teslimat ve fatura adresi.</li>
      <li><strong>Müşteri İşlem Bilgileri:</strong> Sipariş ve satın alma detayları, sepet bilgileri, finansal işlem kayıtları.</li>
      <li><strong>İşlem Güvenliği Bilgileri:</strong> IP adresi, log kayıtları, cihaz ve işletim sistemi bilgileri, sitemizdeki gezinme hareketleri.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-4">3. KİŞİSEL VERİLERİN İŞLENME AMAÇLARI</h3>
    <p>Kişisel verileriniz, KVKK’nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları dahilinde aşağıdaki amaçlarla işlenmektedir:</p>
    <ul class="list-disc pl-5 space-y-2">
      <li>Ürün ve hizmetlerimizin satış, faturalandırma ve teslimat süreçlerinin yürütülmesi,</li>
      <li>Yedek parça ve servis taleplerinin alınması, takibi ve sonuçlandırılması,</li>
      <li>Müşteri ilişkileri yönetimi, satış sonrası destek hizmetlerinin sunulması,</li>
      <li>Mevzuattan kaynaklanan yasal yükümlülüklerin yerine getirilmesi (fatura düzenleme, vergi beyanları vb.),</li>
      <li>Bilgi güvenliği süreçlerinin planlanması, denetimi ve icrası,</li>
      <li>Yetkili kamu kurum ve kuruluşlarına yasal bilgi ve belge aktarımının gerçekleştirilmesi.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-4">4. İŞLENEN KİŞİSEL VERİLERİN AKTARILMASI</h3>
    <p>Kişisel verileriniz, yukarıda açıklanan amaçlarla sınırlı olmak üzere;</p>
    <ul class="list-disc pl-5 space-y-2">
      <li>Teslimat süreçlerinin yürütülebilmesi amacıyla anlaşmalı kargo şirketlerine,</li>
      <li>Finansal/ödeme işlemlerinin tamamlanabilmesi amacıyla lisanslı ödeme kuruluşu altyapı sağlayıcılarına,</li>
      <li>Vergi, denetim veya yasal zorunluluklar sebebiyle yetkili kamu kurum ve kuruluşlarına, adli makamlara aktarılabilmektedir. Tüm aktarımlar yürürlükteki mevzuata uygun şekilde güvenlik önlemleri alınarak icra edilmektedir.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-4">5. VERİ TOPLAMA YÖNTEMLERİ VE HUKUKİ SEBEPLERİ</h3>
    <p>Kişisel verileriniz, web sitemizdeki üyelik formları, sipariş ekranları, iletişim formları ve çerezler aracılığıyla tamamen veya kısmen otomatik yöntemlerle elektronik ortamda toplanmaktadır. Bu veriler;</p>
    <ul class="list-disc pl-5 space-y-2">
      <li>Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması (Sözleşme İlişkisi - KVKK m.5/2-c),</li>
      <li>Kanunlarda açıkça öngörülmesi ve Veri Sorumlusunun hukuki yükümlülüğünü yerine getirebilmesi için zorunlu olması (Yasal Yükümlülük - KVKK m.5/2-ç, 5/2-a),</li>
      <li>Sizlerin temel hak ve özgürlüklerinize zarar vermemek kaydıyla, şirketimizin meşru menfaatleri için veri işlenmesinin zorunlu olması (Meşru Menfaat - KVKK m.5/2-f) hukuki sebeplerine dayanarak işlenmektedir.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-4">6. İLGİLİ KİŞİNİN HAKLARI (KVKK Madde 11)</h3>
    <p>KVKK'nın 11. maddesi uyarınca veri sahibi olarak dilediğiniz zaman Paşa Motor'a başvurarak;</p>
    <ul class="list-disc pl-5 space-y-2">
      <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
      <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme,</li>
      <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
      <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme,</li>
      <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme,</li>
      <li>Kanunun 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme haklarına sahipsiniz.</li>
    </ul>
    <p class="mt-4">Yasal haklarınızı kullanmak üzere başvurularınızı, kayıtlı e-posta adresinizden <strong><span style="direction: rtl; unicode-bidi: bidi-override; display: inline-block;">moc.liamg@rotomasap</span></strong> adresine veya şirketimizin fiziksel adresine yazılı dilekçe ile iletebilirsiniz.</p>
  </div>`,
          meta_title: "KVKK Aydınlatma Metni | Paşa Motor",
          meta_description: "Kişisel verilerinizin korunması ve işlenmesi hakkında 6698 sayılı kanuna uygun aydınlatma metnimiz.",
          is_published: true
        },
        {
          slug: "cerez-politikasi",
          title: "Çerez Politikası",
          content: `<div class="space-y-6">
    <p class="lead text-base font-semibold text-foreground">PAŞA MOTOR ÇEREZ POLİTİKASI</p>
    <p>Paşa Motor olarak sitemizin (pasamotor.com.tr) ziyaretçilerinin gizliliğini korumak ve kullanıcı deneyimini optimize etmek amacıyla çeşitli çerezler (cookie) kullanmaktayız. İşbu politika, hangi çerezlerin ne amaçla kullanıldığını ve bunları nasıl kontrol edebileceğinizi açıklamaktadır.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">1. ÇEREZ (COOKIE) NEDİR?</h3>
    <p>Çerezler, bir internet sitesini ziyaret ettiğinizde cihazınıza (bilgisayar, tablet veya akıllı telefon) kaydedilen ve siteyle olan etkileşimlerinize ilişkin verileri tutan küçük boyutlu metin dosyalarıdır.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">2. HANGİ TÜR ÇEREZLERİ KULLANIYORUZ?</h3>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Zorunlu Çerezler (Essential Cookies):</strong> Internet sitemizin güvenli bir şekilde çalışabilmesi, sayfalar arası geçişin sağlanması ve sepet adımları gibi temel işlevleri yerine getirebilmesi için kesinlikle gerekli olan çerezlerdir. Devre dışı bırakılamazlar.</li>
      <li><strong>Performans ve Analiz Çerezleri (Analytical/Performance Cookies):</strong> Sitemizi kaç kişinin ziyaret ettiğini, hangi sayfaların daha çok tıklandığını analiz ederek site tasarımını ve performansını artırmamıza yarayan çerezlerdir.</li>
      <li><strong>Fonksiyonel Çerezler (Functional Cookies):</strong> Dil tercihiniz, kullanıcı kayıt ayarlarınız gibi tercihlerinizi hatırlayarak sitemizi bir sonraki ziyaretinizde kişiselleştirilmiş bir deneyim sunmamızı sağlar.</li>
      <li><strong>Hedefleme ve Pazarlama Çerezleri (Targeting/Advertising Cookies):</strong> İlgi alanlarınıza uygun kişiselleştirilmiş reklamlar sunmak ve reklam kampanyalarının etkililiğini ölçmek amacıyla kullanılmaktadır.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-4">3. ÇEREZLERİ NASIL DENETLEYEBİLİR VEYA SİLEBİLİRSİNİZ?</h3>
    <p>Çerezlerin kullanımına ilişkin tercihlerinizi değiştirmek, çerezleri engellemek veya silmek için tarayıcınızın ayarlarını değiştirmeniz yeterlidir. Sıklıkla kullanılan tarayıcıların çerez yönetim adımları şunlardır:</p>
    <ul class="list-disc pl-5 space-y-1">
      <li><strong>Google Chrome:</strong> Ayarlar > Gizlilik ve Güvenlik > Çerezler ve Diğer Site Verileri</li>
      <li><strong>Mozilla Firefox:</strong> Seçenekler > Gizlilik ve Güvenlik > Geçmiş / Çerezler</li>
      <li><strong>Safari:</strong> Tercihler > Gizlilik > Çerezleri ve web sitesi verilerini engelle</li>
      <li><strong>Microsoft Edge:</strong> Ayarlar > Üçüncü taraf tanımlama bilgileri ve site izinleri</li>
    </ul>
    <p class="mt-4">Zorunlu çerezleri engellemeniz durumunda, sitemizdeki bazı temel e-ticaret işlevlerinin çalışmayabileceğini hatırlatmak isteriz.</p>
  </div>`,
          meta_title: "Çerez Politikası | Paşa Motor",
          meta_description: "İnternet sitemizde kullanılan çerez türleri, kullanım amaçları ve yönetimine ilişkin politikamız.",
          is_published: true
        },
        {
          slug: "gizlilik-ve-guvenlik",
          title: "Gizlilik ve Güvenlik",
          content: `<div class="space-y-6">
    <p class="lead text-base font-semibold text-foreground">GİZLİLİK VE VERİ GÜVENLİĞİ POLİTİKASI</p>
    <p>Paşa Motor olarak müşterilerimizin güvenliğine ve gizliliğine azami önem gösteriyoruz. Bu kapsamda, sitemiz üzerinden gerçekleştirdiğiniz alışverişler ve paylaştığınız veriler en üst düzey dijital koruma standartları altında güvenceye alınmıştır.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">1. VERİ İLETİM GÜVENLİĞİ (SSL ŞİFRELEME)</h3>
    <p>Sitemizin tüm sayfalarında ve özellikle üyelik/sipariş ekranlarında aktarılan kritik veriler (şifre, adres, sipariş detayları vb.), modern 256-bit SSL (Secure Sockets Layer) şifreleme protokolü ile korunmaktadır. Tarayıcınızın adres çubuğundaki kilit simgesi, verilerinizin şifrelenerek sunucumuza iletildiğinin ve üçüncü şahıslar tarafından dinlenemeyeceğinin kanıtıdır.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">2. KARTLI ÖDEME GÜVENLİĞİ (PCI-DSS UYUMLULUĞU VE 3D SECURE)</h3>
    <p>Paşa Motor, e-ticaret ödeme altyapısında Bankacılık Düzenleme ve Denetleme Kurumu (BDDK) lisanslı ve uluslararası PCI-DSS veri güvenliği standardına sahip ödeme aracılarını kullanmaktadır.</p>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Kart Bilgisi Kaydedilmez:</strong> Kredi kartı veya banka kartı bilgileriniz hiçbir şekilde bizim sunucularımızda veya veritabanımızda <strong>tutulmamakta, saklanmamakta ve işlenmemektedir</strong>. Kart işlemleri doğrudan bankanız ile güvenli ödeme geçidi arasında yürütülmektedir.</li>
      <li><strong>3D Secure Zorunluluğu:</strong> Alışverişlerinizi güvenle tamamlayabilmeniz için tüm kartlı işlemlerde SMS ile tek kullanımlık şifre doğrulama (3D Secure) sistemi zorunlu tutulmaktadır.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-4">3. KİŞİSEL VERİLERİN GİZLİLİĞİ</h3>
    <p>Şirketimize ilettiğiniz isim, adres, telefon ve e-posta gibi kişisel bilgiler, yasal yükümlülükler ile yetkili idari ve adli makamların resmi emirleri haricinde, kesinlikle üçüncü şahıs ve kurumlarla ticari amaçlarla paylaşılmamakta, satılmamakta veya kiralanmamaktadır.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">4. KULLANICI SORUMLULUKLARI</h3>
    <p>Sistemimizin güvenliğinin kusursuz işleyebilmesi için üyelerimizin de kendi hesap şifrelerini üçüncü kişilerle paylaşmaması, güvenli şifre kombinasyonları kullanması ve ortak kullanılan bilgisayarlarda güvenli çıkış yapması gerekmektedir. Şifre güvenliğinin ihmalinden doğabilecek aksaklıklardan kullanıcı sorumludur.</p>
  </div>`,
          meta_title: "Gizlilik ve Güvenlik | Paşa Motor",
          meta_description: "En üst düzey alışveriş güvenliği, SSL şifreleme, 3D Secure ve kullanıcı veri gizliliği taahhüdümüz.",
          is_published: true
        },
        {
          slug: "mesafeli-satis-sozlesmesi",
          title: "Mesafeli Satış Sözleşmesi",
          content: `<div class="space-y-6">
    <p class="lead text-base font-semibold text-foreground">MESAFELİ SATIŞ SÖZLEŞMESİ</p>
    
    <h3 class="text-lg font-bold text-foreground mt-4">1. TARAFLAR</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
      <div class="border border-border/50 p-4 rounded-lg bg-card">
        <p class="font-bold underline text-foreground">SATICI BİLGİLERİ:</p>
        <p><strong>Ünvan:</strong> Paşa Motor - Nihat KAN</p>
        <p><strong>Adres:</strong> İstanbul, Türkiye</p>
        <p><strong>E-posta:</strong> <span style="direction: rtl; unicode-bidi: bidi-override; display: inline-block;">moc.liamg@rotomasap</span></p>
      </div>
      <div class="border border-border/50 p-4 rounded-lg bg-card">
        <p class="font-bold underline text-foreground">ALICI BİLGİLERİ (TÜKETİCİ):</p>
        <p>Web sitesi üzerinden sipariş veren, kişisel bilgileri sipariş formunda belirtilen ve doğrulanmış olan müşteridir.</p>
      </div>
    </div>

    <h3 class="text-lg font-bold text-foreground mt-4">2. SÖZLEŞMENİN KONUSU VE KAPSAMI</h3>
    <p>İşbu Sözleşme, Alıcı'nın Satıcı'ya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği yedek parça, aksesuar veya servis ürünlerinin satışı, bedeli ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca tarafların hak ve yükümlülüklerini düzenler.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">3. SÖZLEŞME KONUSU ÜRÜN VE ÖDEME BİLGİLERİ</h3>
    <p>Sipariş edilen ürünlerin cinsi, miktarı, satış bedeli, vergi dahil fiyatı, kargo ücreti ve ödeme şekli sipariş onay ekranında ve fatura detayında belirtildiği gibidir. Gönderilen tüm ürünlerde fatura kesilmesi yasal zorunluluktur.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">4. CAYMA HAKKI</h3>
    <p>Alıcı (Tüketici), hiçbir yasal ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin, ürünü teslim aldığı tarihten itibaren <strong>14 (on dört) gün</strong> içerisinde cayma hakkını kullanarak ürünü iade edebilir.</p>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Cayma Hakkının Kullanımı:</strong> Alıcı, cayma talebini bu süre zarfında yazılı olarak veya e-posta yoluyla Satıcı'ya ulaştırmalıdır.</li>
      <li><strong>İade Şartları:</strong> İade edilecek ürünün koruyucu ambalajının açılmamış, kullanılmamış, montajı yapılmamış ve yeniden satılabilirlik özelliğini yitirmemiş olması şarttır.</li>
      <li><strong>İade Kargo Bedeli:</strong> Cayma hakkı kapsamında yapılan iadelerde, Satıcı'nın anlaşmalı olduğu kargo firması kullanıldığı takdirde kargo bedeli Satıcı'ya aittir.</li>
    </ul>

    <h3 class="text-lg font-bold text-foreground mt-4">5. CAYMA HAKKININ İSTİSNALARI</h3>
    <p>Mevzuat gereği; tüketiciye özel olarak hazırlanan/kesilen kablo, boru veya montajı yapılmış elektrikli yedek parçalar gibi iadesi sağlık veya teknik olarak uygun olmayan ve ambalajı açıldıktan sonra orijinalliği bozulan ürünlerde cayma hakkı kullanılamaz.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">6. UYUŞMAZLIKLARIN ÇÖZÜMÜ</h3>
    <p>İşbu Sözleşmeden doğacak her türlü uyuşmazlıkta, Ticaret Bakanlığı tarafından ilan edilen parasal değer sınırları dahilinde, Alıcı’nın mal veya hizmeti satın aldığı veya ikametgahının bulunduğu yerdeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.</p>
  </div>`,
          meta_title: "Mesafeli Satış Sözleşmesi | Paşa Motor",
          meta_description: "Tasarruflu ve güvenli alışverişinizi koruyan, cayma hakkı ve garanti şartlarını içeren resmi tüketici mesafeli satış sözleşmesi.",
          is_published: true
        },
        {
          slug: "kullanim-kosullari",
          title: "Kullanım Koşulları",
          content: `<div class="space-y-6">
    <p class="lead text-base font-semibold text-foreground">WEB SİTESİ KULLANIM KOŞULLARI SÖZLEŞMESİ</p>
    <p>Bu web sitesini (pasamotor.com.tr) ziyaret ederek veya sitemize üye olarak, aşağıda belirtilen kullanım koşullarını şartsız olarak kabul etmiş sayılırsınız. Lütfen siteyi kullanmadan önce bu koşulları dikkatlice okuyunuz.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">1. FİKRİ VE SINAİ MÜLKİYET HAKLARI</h3>
    <p>Sitemizde yer alan logo, tasarım, kod, metinler, yedek parça açıklamaları, görseller ve diğer tüm materyellerin fikri mülkiyet hakları Paşa Motor'a aittir ve uluslararası telif yasaları ile korunmaktadır. Şirketin yazılı izni olmaksızın site içeriğinin kısmen dahi olsa kopyalanması, çoğaltılması, başka sitelerde paylaşılması veya ticari amaçla kullanılması kesinlikle yasaktır.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">2. HİZMETİN KULLANIMI</h3>
    <p>Kullanıcılar, web sitesini yasalara ve dürüstlük kurallarına uygun olarak kullanmayı taahhüt ederler. Sitemizin güvenliğini tehlikeye atacak, sunuculara aşırı yük bindirecek veya diğer kullanıcıların siteyi kullanmasını engelleyecek her türlü eylem (DDoS, spam, veri kazıma (scraping), zararlı kod enjeksiyonu) hukuki ve cezai takibata tabidir.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">3. SORUMLULUĞUN SINIRLANDIRILMASI</h3>
    <p>Paşa Motor, internet sitesinde yer alan teknik bilgi, yedek parça uyumluluk verileri ve görsel içeriklerin doğruluğunu sağlamak için makul ölçüde çaba göstermektedir. Ancak, üretim yılı farkları, şasi uyumsuzlukları veya olası yazım hataları sebebiyle doğabilecek doğrudan veya dolaylı zararlardan sorumlu tutulamaz. Yedek parça uyumluluğu hususunda şüphe durumunda, montaj öncesi iletişim hatlarımızdan destek alınması tavsiye edilir.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">4. DEĞİŞİKLİK VE BÖLÜNEBİLİRLİK</h3>
    <p>Paşa Motor, önceden bildirimde bulunmaksızın bu Kullanım Koşullarını güncelleme, sitedeki ürün fiyatlarını ve stok durumlarını değiştirme hakkını saklı tutar. Değişiklikler sitede yayınlandığı andan itibaren yürürlüğe girer.</p>

    <h3 class="text-lg font-bold text-foreground mt-4">5. UYGULANACAK HUKUK VE YETKİLİ MAHKEME</h3>
    <p>Bu koşulların uygulanmasında, yorumlanmasında ve yönetiminde Türkiye Cumhuriyeti kanunları geçerli olacaktır. Olası uyuşmazlıklarda yetkili merci İstanbul Çağlayan Mahkemeleri ve İcra Daireleridir.</p>
  </div>`,
          meta_title: "Kullanım Koşulları | Paşa Motor",
          meta_description: "pasamotor.com.tr web sitesi fikri haklar, site kullanım kuralları, yükümlülükler ve yasal yetki şartları.",
          is_published: true
        }
      ];

      let count = 0;
      const existingSlugs = pages.map(p => p.slug);
      
      for (const pData of defaultPages) {
        if (!existingSlugs.includes(pData.slug)) {
          console.log("Seeding in-place: " + pData.slug);
          const { error } = await dbClient.from("pages").insert({
            title: pData.title,
            slug: pData.slug,
            content: pData.content,
            meta_title: pData.meta_title,
            meta_description: pData.meta_description,
            is_published: pData.is_published,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          if (error) throw error;
          count++;
        }
      }

      toast({ 
        title: count > 0 ? "Başarılı" : "Tamamlandı", 
        description: count > 0 ? `${count} adet yasal sayfa başarıyla oluşturuldu ve veritabanına işlendi!` : "Tüm yasal sayfalar zaten veritabanında mevcut olduğu için yeni ekleme yapılmadı." 
      });
      loadData();
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    } finally {
      setSeeding(false);
    }
  };

  const generateSlug = (val: string) => {
    return val
      .toLowerCase()
      .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
      .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Yasal & KVKK Sayfaları</h1>
          <p className="text-sm text-muted-foreground">E-ticaret ve Tüketici Hakları Mevzuatına uygun sayfaları buradan yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSeedDefaults} 
            disabled={seeding || loading}
            className="inline-flex items-center justify-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/85 px-4 py-2 text-sm font-medium transition-colors gap-2 disabled:opacity-60"
          >
            {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCheck className="w-4 h-4 outline-none" />}
            Varsayılan Şablonları Yükle
          </button>
          
          <button 
            onClick={handleNew} 
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/90 gap-2"
          >
            <Plus className="w-4 h-4" /> Yeni Sayfa
          </button>
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col md:flex-row items-start gap-4">
        <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
          <HelpCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground mb-1">Kurumsal Hukuk & Mevzuat Paketi</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Türkiye Cumhuriyeti yasaları uyarınca bir e-ticaret platformunda <strong>KVKK, Çerez Politikası, Gizlilik ve Güvenlik, Mesafeli Satış Sözleşmesi</strong> ve <strong>Kullanım Koşulları</strong> sayfalarının bulunması ve güncel olması yasal bir zorunluluktur. Eğer veritabanınızda bu sayfalar henüz yoksa, yukarıdaki <strong>&ldquo;Varsayılan Şablonları Yükle&rdquo;</strong> butonunu kullanarak senior düzeyinde formüle edilmiş kurumsal şablonları anında yayına alabilirsiniz.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : pages.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-dashed border-border/80">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold mb-2">Henüz Yasal Sayfa Bulunmuyor</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Mevzuata uygun sayfaları sıfırdan oluşturabilir veya tek tuşla hazır kurumsal sözleşme şablon paketimizi yükleyip anında düzenlemeye başlayabilirsiniz.
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={handleSeedDefaults} 
              disabled={seeding}
              className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Şablonlar Yükleniyor...
                </>
              ) : (
                "Yasal Sözleşme Paketini Otomatik Yükle"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map(page => (
             <div key={page.id} className="glass-card rounded-xl p-5 border border-border/50 hover:shadow-md transition-all duration-300 flex flex-col group">
               <div className="flex items-start justify-between mb-3 gap-2">
                 <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform group-hover:scale-105 duration-300">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="font-semibold text-foreground truncate">{page.title}</h3>
                      <p className="text-xs text-muted-foreground font-mono truncate">/sayfa/{page.slug}</p>
                    </div>
                 </div>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${page.is_published ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
                   {page.is_published ? "Yayında" : "Taslak"}
                 </span>
               </div>
               
               <p className="text-sm text-muted-foreground line-clamp-3 mt-3 mb-4 leading-relaxed">
                 {page.meta_description || "Açıklama belirtilmemiş..."}
               </p>

               <div className="flex justify-end gap-2 pt-4 border-t border-border mt-auto">
                 <button 
                   onClick={() => handleEdit(page)} 
                   className="p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-lg transition-colors"
                   title="Düzenle"
                 >
                   <Edit2 className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => handleDelete(page.id, page.title)} 
                   className="p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                   title="Sil"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-250">
            <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
              <h2 className="text-xl font-heading font-semibold">
                {editingId ? "Sayfayı Düzenle" : "Yeni Yasal Sayfa Ekle"}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="text-muted-foreground hover:text-foreground text-2xl leading-none">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sayfa Adı</label>
                  <input required type="text" value={form.title} placeholder="KVKK Aydınlatma Metni"
                    onChange={(e) => setForm({ 
                        ...form, 
                        title: e.target.value,
                        slug: !editingId ? generateSlug(e.target.value) : form.slug 
                    })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">URL Yolu (Slug)</label>
                  <input required type="text" value={form.slug} placeholder="kvkk-aydinlatma-metni"
                    onChange={(e) => setForm({ ...form, slug: generateSlug(e.target.value) })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">SEO Başlık</label>
                  <input type="text" value={form.meta_title || ""} placeholder="Opsiyonel SEO Başlığı"
                    onChange={(e) => setForm({ ...form, meta_title: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">SEO Açıklama</label>
                  <input type="text" value={form.meta_description || ""} placeholder="Arama motorları için kısa özet"
                    onChange={(e) => setForm({ ...form, meta_description: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sayfa İçeriği (HTML Formatı Desteklenir)</label>
                <textarea required value={form.content || ""} rows={12} placeholder="<h2>KVKK Nedir?</h2>..."
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-mono" />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_published" checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary/20" />
                <label htmlFor="is_published" className="text-sm font-medium cursor-pointer">
                  Yayında (Kullanıcılar görebilir)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-border">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 rounded-lg hover:bg-muted text-foreground transition-colors">
                  İptal
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
