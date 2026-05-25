import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import config from './firebase-applet-config.json' assert { type: "json" };
const app = initializeApp(config);
const db = getFirestore(app);

const faqs = [
  {
    question: "Motosiklet periyodik bakımı ne zaman yapılmalıdır?",
    answer: "Eğer motosikletiniz garanti kapsamındaysa servis kitapçığında belirtilen kilometre veya zaman aralıklarında (genelde her 5.000 - 6.000 km'de bir veya yılda 1 kez) yapılması gerekir. Kapasite ve segmente göre değişiklik gösterebilir.",
    category: "Servis Hizmetleri",
    is_active: true,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    question: "Sipariş ettiğim yedek parça ne zaman elime ulaşır?",
    answer: "Stoklarımızda bulunan parçalar ortalama 1-3 iş günü içerisinde kargoya teslim edilmekte olup, bulunmayan özel siparişler marka ve yurtdışı tedarik durumuna göre 15-45 gün arasında gelebilir.",
    category: "Yedek Parça",
    is_active: true,
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    question: "Takas desteğiniz var mı?",
    answer: "Evet, belirli şartlara uyan marka ve modeldeki ikinci el motosikletlerinizi ekspertiz sonucu takas değerlendirmesinde kullanabiliyoruz.",
    category: "Motosiklet Satışı",
    is_active: true,
    sort_order: 3,
    created_at: new Date().toISOString()
  },
  {
    question: "Garanti süresi devam eden motosikletimi dışarıda bakıma götürürsem garantiden çıkar mı?",
    answer: "Evet. Genellikle üreticiler, periyodik bakımların, arıza tespitinin ve müdahalenin sadece yetkili servislerde yapılmasını şart koşar.",
    category: "Genel",
    is_active: true,
    sort_order: 4,
    created_at: new Date().toISOString()
  },
  {
    question: "Servis randevusunu nasıl alabilirim?",
    answer: "İnternet sitemizdeki İletişim sayfasından formu doldurarak veya doğrudan müşteri hizmetlerimizi arayarak (0212 123 45 67) servis randevusu oluşturabilirsiniz.",
    category: "Servis Hizmetleri",
    is_active: true,
    sort_order: 5,
    created_at: new Date().toISOString()
  },
  {
    question: "Orijinal ve yan sanayi yedek parça arasındaki fark nedir?",
    answer: "Orijinal parçalar üretici firmanın garanti kapsamındadır ve motosikletinizin ömrünü uzatır. Yan sanayi parçalar daha uygun maliyetli olsa da, kalite standartları orijinali kadar yüksek olmayabilir. Paşa Motor olarak önceliğimiz her zaman orijinal parça kullanımıdır.",
    category: "Yedek Parça",
    is_active: true,
    sort_order: 6,
    created_at: new Date().toISOString()
  }
];

async function run() {
  console.log("Fetching existing...");
  const snapshot = await getDocs(collection(db, 'faqs'));
  console.log("Deleting old documents...");
  for (const item of snapshot.docs) {
    await deleteDoc(doc(db, 'faqs', item.id));
  }
  
  console.log("Inserting new 6 FAQs...");
  for (const faq of faqs) {
    const docRef = doc(collection(db, 'faqs'));
    await setDoc(docRef, { id: docRef.id, ...faq });
  }
  console.log("Success! Inserted 6 items.");
  
  const sn = await getDocs(collection(db, 'faqs'));
  console.log('Current FAQs count:', sn.size);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
