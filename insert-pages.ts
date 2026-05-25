import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDocs } from 'firebase/firestore';
import config from './firebase-applet-config.json' assert { type: "json" };
const app = initializeApp(config);
const db = getFirestore(app);

const pages = [
  {
    slug: "kvkk-aydinlatma-metni",
    title: "KVKK Aydınlatma Metni",
    content: "<h2>1. Veri Sorumlusunun Kimliği</h2><p>Kişisel verileriniz, veri sorumlusu sıfatıyla Paşa Motor (bundan böyle “Şirket” olarak anılacaktır) tarafından 6698 sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) uyarınca aşağıda açıklanan kapsamda işlenebilecektir.</p><h2>2. Kişisel Verilerin İşlenme Amacı</h2><p>Toplanan kişisel verileriniz, şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak için gerekli çalışmaların iş birimlerimiz tarafından yapılması, sipariş süreçlerinin yönetilmesi, ürün ve hizmetlerimizin sizlere uygun şekilde özelleştirilerek sunulması amacıyla işlenmektedir.</p><h2>3. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçlarla Aktarılabileceği</h2><p>Toplanan kişisel verileriniz; kanuni yükümlülüklerimizin yerine getirilmesi amacıyla yetkili kamu kurumlarına, ödeme ve teslimat süreçlerinin yürütülmesi amacıyla iş ortaklarımıza (kargo şirketleri, ödeme altyapısı sağlayıcıları) KVKK’nın 8. ve 9. maddelerinde belirtilen şartlar dâhilinde aktarabilecektir.</p><h2>4. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h2><p>Kişisel verileriniz, internet sitemiz, mobil sitemiz üzerinden elektronik ortamda toplanmaktadır. KVKK madde 5/2-c bendi uyarınca bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olmak ve madde 5/2-f bendi uyarınca meşru menfaatimiz hukuki sebeplerine dayalı olarak toplanmaktadır.</p><h2>5. İlgili Kişinin Hakları</h2><p>KVKK’nın 11. maddesi uyarınca veri sahipleri, kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme, eksik veya yanlış işlenmişse düzeltilmesini isteme haklarına sahiptir.</p>",
    is_published: true,
    meta_title: "KVKK Aydınlatma Metni | Paşa Motor",
    meta_description: "Kişisel verilerinizin korunması ve işlenmesi hakkında detaylı aydınlatma metnimiz.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    slug: "cerez-politikasi",
    title: "Çerez Politikası",
    content: "<h2>1. Çerez (Cookie) Nedir?</h2><p>Çerezler, bir internet sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza (bilgisayar, tablet, cep telefonu vb.) kaydedilen küçük boyutlu metin dosyalarıdır.</p><h2>2. Hangi Çerezleri Kullanıyoruz?</h2><p>Sitemizde, zorunlu çerezler (sitenin çalışması için temel olanlar), performans ve analiz çerezleri (ziyaretçi davranışlarını anlamak ve siteyi geliştirmek için) ile reklam/pazarlama çerezleri kullanılmaktadır.</p><h2>3. Çerezlerin Kullanım Amacı</h2><p>Çerezler, internet sitemizin işlevselliğini artırmak, kullanıcı deneyimini iyileştirmek, site kullanımına ilişkin istatistiksel veriler toplamak ve size daha uygun içerikler/reklamlar sunmak amacıyla kullanılmaktadır.</p><h2>4. Çerez Yönetimi Nasıl Yapılır?</h2><p>İnternet tarayıcınızın ayarlarından çerezleri her zaman silebilir, engelleyebilir veya çerez kaydedildiğinde uyarı almayı tercih edebilirsiniz. Detaylı bilgi için tarayıcınızın 'Yardım' veya 'Ayarlar' menüsünü inceleyebilirsiniz.</p>",
    is_published: true,
    meta_title: "Çerez Politikası | Paşa Motor",
    meta_description: "İnternet sitemizde kullanılan çerez türleri ve kullanım amaçları hakkında bilgilendirme.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    slug: "kullanim-kosullari",
    title: "Kullanım Koşulları",
    content: "<h2>1. Taraflar ve Onay</h2><p>Bu siteyi (pasamotor.com.tr) kullanmaya başladığınız andan itibaren aşağıda yer alan tüm koşul ve kuralları kabul etmiş sayılırsınız.</p><h2>2. Sorumlulukların Sınırlandırılması</h2><p>Şirketimiz, web sitesinde yer alan içeriklerin güncelliği ve doğruluğu için özen göstermekle birlikte, yaşanabilecek olası hata veya teknik aksaklıklardan doğacak doğrudan ya da dolaylı zararlardan sorumlu tutulamaz.</p><h2>3. Fikri Mülkiyet Hakları</h2><p>Bu sitede yer alan logo, metin, görsel, tasarım ve diğer tüm materyellerin hakları Paşa Motor'a aittir ve izinsiz kullanılamaz, kopyalanamaz, çoğaltılamaz.</p><h2>4. Değişiklik Hakkı</h2><p>Paşa Motor, bu kullanım koşullarında önceden bildirimde bulunmaksızın dilediği zaman değişiklik yapma hakkını saklı tutar.</p>",
    is_published: true,
    meta_title: "Kullanım Koşulları | Paşa Motor",
    meta_description: "Paşa Motor web sitesi kullanım şartları, sorumluluklar ve fikri mülkiyet hakları bildirimleri.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    slug: "gizlilik-ve-guvenlik",
    title: "Gizlilik ve Güvenlik",
    content: "<h2>1. Güvenlik Altyapısı</h2><p>Sitemiz üzerinden gerçekleştirdiğiniz veri alışverişi ve ödeme işlemleri 256-bit SSL güvenlik sertifikası ile şifrelenmektedir. Kredi kartı bilgileriniz sistemlerimizde kesinlikle saklanmamaktadır.</p><h2>2. Gizlilik Sözleşmesi</h2><p>Müşterilerimize ait kişisel bilgiler ve sipariş detayları, yasal zorunluluklar haricinde hiçbir üçüncü şahıs kurum veya kuruluşla paylaşılmaz.</p><h2>3. Üçüncü Taraf Bağlantıları</h2><p>Web sitemiz başka sitelere bağlantılar (linkler) içerebilir. Tarafımızca yönlendirilen diğer sitelerin gizlilik uygulamalarından Paşa Motor sorumlu tutulamaz.</p>",
    is_published: true,
    meta_title: "Gizlilik ve Güvenlik | Paşa Motor",
    meta_description: "Paşa Motor üzerinden yapacağınız işlemlerin güvenliği ve gizliliğine ilişkin taahhütlerimiz.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    slug: "mesafeli-satis-sozlesmesi",
    title: "Mesafeli Satış Sözleşmesi",
    content: "<h2>1. Taraflar</h2><p>İşbu Sözleşme, Satıcı (Paşa Motor) ile Alıcı (Tüketici) arasında, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri uyarınca kurulmuştur.</p><h2>2. Sözleşmenin Konusu</h2><p>Alıcının, Satıcıya ait internet sitesi üzerinden elektronik ortamda siparişini verdiği ürünlerin satışı ve teslimatı ile ilgili olarak tarafların hak ve yükümlülüklerinin belirlenmesidir.</p><h2>3. Cayma Hakkı</h2><p>Alıcı, ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içerisinde hiçbir hukuki ve cezai sorumluluk üstlenmeksizin ve hiçbir gerekçe göstermeksizin malı reddederek sözleşmeden cayma hakkına sahiptir.</p><h2>4. Uyuşmazlıkların Çözümü</h2><p>İşbu sözleşmenin uygulanmasında, Ticaret Bakanlığınca ilan edilen değere kadar Alıcının mal veya hizmeti satın aldığı veya ikametgahının bulunduğu yerdeki Tüketici Hakem Heyetleri ile Tüketici Mahkemeleri yetkilidir.</p>",
    is_published: true,
    meta_title: "Mesafeli Satış Sözleşmesi | Paşa Motor",
    meta_description: "Tüketici haklarını ve alım-satım yükümlülüklerini belirleyen yasal mesafeli satış sözleşmemiz.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

async function run() {
  console.log('Checking existing pages...');
  const snapshot = await getDocs(collection(db, 'pages'));
  const existingSlugs = snapshot.docs.map(d => d.data().slug);
  
  for (const page of pages) {
    if (!existingSlugs.includes(page.slug)) {
       console.log('Inserting ' + page.slug);
       const docRef = doc(collection(db, 'pages'));
       await setDoc(docRef, { id: docRef.id, ...page });
    } else {
       console.log('Already exists ' + page.slug);
    }
  }
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
