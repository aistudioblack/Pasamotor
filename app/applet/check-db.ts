import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import config from '../../firebase-applet-config.json' assert { type: "json" };
const app = initializeApp(config);
const db = getFirestore(app);
async function run() {
  const qs = await getDocs(collection(db, 'faqs'));
  console.log('FAQs count:', qs.size);
  qs.forEach(d => console.log(d.id, d.data().question));
}
run().catch(console.error);
