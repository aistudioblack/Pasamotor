/**
 * Paşa Motor - Kurumsal Ürün Başlığı Sadeleştirme ve Görsel Tamamlama Motoru
 * (SEO ve CRO Odaklı, Topical Authority Destekli)
 */

export interface BeautifiedResult {
  title: string;
  extractedPart: string;
  compatibilityList: string;
  compatibleBrands: string[];
  fallbackImage: string;
}

export function beautifyProduct(manufacturer: string, oemCode: string, rawName: string): BeautifiedResult {
  const mBrand = (manufacturer || "PAŞA MOTOR").trim().toUpperCase();
  const mCode = (oemCode || "").trim().toUpperCase();
  let mRaw = (rawName || "").trim();

  // Marka adını ve kodu ham isimden temizleyelim (çiftleme olmaması için)
  const cleanRegexM = new RegExp(mBrand.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
  const cleanRegexC = new RegExp(mCode.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
  mRaw = mRaw.replace(cleanRegexM, "").replace(cleanRegexC, "").replace(/\s+/g, " ").trim();

  // Türkçe motosiklet yedek parça sözlüğü (En çok kullanılan birleştirilmiş kelimeler)
  const partNouns = [
    { key: "ön fren balatası", name: "Ön Fren Balatası" },
    { key: "arka fren balatası", name: "Arka Fren Balatası" },
    { key: "fren balatası", name: "Fren Balatası" },
    { key: "fren balata", name: "Fren Balatası" },
    { key: "debriyaj balatası", name: "Debriyaj Balatası" },
    { key: "debriyaj balata", name: "Debriyaj Balatası" },
    { key: "debriyaj balatası", name: "Debriyaj Balatası" },
    { key: "debriyaj seti", name: "Debriyaj Seti" },
    { key: "varyatör kayışı", name: "Varyatör Kayışı" },
    { key: "varyatör seti", name: "Varyatör Komple Set" },
    { key: "varyatör kapak", name: "Varyatör Kapağı" },
    { key: "varyatör", name: "Varyatör Grubu" },
    { key: "silindir kiti", name: "Silindir Kiti" },
    { key: "silindir set", name: "Silindir Seti" },
    { key: "silindir kapağı", name: "Silindir Kapağı" },
    { key: "silindir", name: "Silindir Bloğu" },
    { key: "piston kiti", name: "Piston Kiti" },
    { key: "piston set", name: "Piston Seti" },
    { key: "piston", name: "Piston" },
    { key: "segman kiti", name: "Segman Seti" },
    { key: "segman takımı", name: "Segman Takımı" },
    { key: "segman", name: "Motosiklet Segmanı" },
    { key: "marş motoru", name: "Marş Motoru" },
    { key: "marş rölesi", name: "Marş Rölesi" },
    { key: "marş dişlisi", name: "Marş Dişlisi" },
    { key: "şarj konjektörü", name: "Şarj Konjektörü" },
    { key: "konjektör", name: "Konjektör (Şarj Regülatörü)" },
    { key: "regülatör", name: "Şarj Regülatörü" },
    { key: "elektrik sargısı", name: "Elektrik Sargısı" },
    { key: "statör sargı", name: "Statör (Ateşleme Sargısı)" },
    { key: "statör", name: "Statör (Elektrik Sargısı)" },
    { key: "alternatör", name: "Alternatör" },
    { key: "yağ filtresi", name: "Yağ Filtresi" },
    { key: "hava filtresi", name: "Hava Filtresi" },
    { key: "benzin filtresi", name: "Benzin Filtresi" },
    { key: "yakıt filtresi", name: "Yakıt Filtresi" },
    { key: "ateşleme bujisi", name: "Ateşleme Bujisi" },
    { key: "iridyum buji", name: "İridyum Ateşleme Bujisi" },
    { key: "buji", name: "Ateşleme Bujisi" },
    { key: "fren diski", name: "Fren Diski" },
    { key: "fren aynası", name: "Fren Diski Aynası" },
    { key: "fren pompası", name: "Fren Merkez Pompası" },
    { key: "fren kolu", name: "Fren Kolu (Manet)" },
    { key: "debriyaj kolu", name: "Debriyaj Kolu (Manet)" },
    { key: "manet takım", name: "Ayarlanabilir Manet Takımı" },
    { key: "manet", name: "Kumanda Maneti" },
    { key: "dikiz aynası", name: "Dikiz Ayna Seti" },
    { key: "ayna set", name: "Ayna Takımı" },
    { key: "ayna", name: "Dikiz Aynası" },
    { key: "amortisör", name: "Amortisör" },
    { key: "kilometre saati", name: "Kilometre Saati" },
    { key: "kilometre teli", name: "Kilometre Spirali (Teli)" },
    { key: "gaz teli", name: "Gaz Teli (Spirali)" },
    { key: "debriyaj teli", name: "Debriyaj Teli (Spirali)" },
    { key: "krank mili", name: "Krank Mili Komple" },
    { key: "bando kayış", name: "Bando Varyatör Kayışı" },
    { key: "kayış", name: "Varyatör Tahrik Kayışı" },
    { key: "akü", name: "Motosiklet Jel Aküsü" },
    { key: "far komple", name: "Ön Far Grubu Komple" },
    { key: "far", name: "Ön Far Grubu" },
    { key: "stop lambası", name: "Arka Stop Lambası Grubu" },
    { key: "arka stop", name: "Arka Stop Grubu" },
    { key: "sinyal lambası", name: "Sinyal Lambası" },
    { key: "sinyal", name: "Sinyal Grubu" },
    { key: "ateşleme bobini", name: "Yüksek Akımlı Ateşleme Bobini" },
    { key: "bobin", name: "Ateşleme Bobini" },
    { key: "enjektör", name: "Yakıt Enjektörü" },
    { key: "yakıt pompası", name: "Elektrikli Yakıt Pompası" },
    { key: "benzin pompası", name: "Benzin Pompası" },
    { key: "karbüratör", name: "Karbüratör Komple" },
    { key: "gaz kolu", name: "Gaz Kolu Takımı" }
  ];

  let matchedPartTitle = "";
  const rawLower = mRaw.toLowerCase();

  for (const item of partNouns) {
    if (rawLower.includes(item.key)) {
      matchedPartTitle = item.name;
      break;
    }
  }

  // Eşleşme yoksa, kelime analizinden son 2 anlamlı kelimeyi çıkaralım
  if (!matchedPartTitle) {
    // Parçalamanın temizlenmesi
    const rawWords = mRaw.replace(/[^a-zA-Z0-9çıüşöğIŞĞÜÖÇ\s]/g, "").split(/\s+/).filter(w => w.trim().length > 1);
    if (rawWords.length >= 2) {
      matchedPartTitle = rawWords.slice(-2).join(" ");
    } else {
      matchedPartTitle = mRaw || "Motosiklet Yedek Parçası";
    }
  }

  // Önemli büyük markaların taranması
  const majorBrands = [
    { key: "honda", name: "Honda" },
    { key: "suzuki", name: "Suzuki" },
    { key: "suzukı", name: "Suzuki" },
    { key: "ktm", name: "KTM" },
    { key: "yamaha", name: "Yamaha" },
    { key: "kawasaki", name: "Kawasaki" },
    { key: "kuba", name: "Kuba" },
    { key: "vox", name: "Vox" },
    { key: "rapidox", name: "RapidoX" },
    { key: "rks", name: "RKS" },
    { key: "tvs", name: "TVS" },
    { key: "hero", name: "Hero" },
    { key: "falcon", name: "Falcon" },
    { key: "isildar", name: "Işıldar" },
    { key: "ışıldar", name: "Işıldar" },
    { key: "bajaj", name: "Bajaj" },
    { key: "mondial", name: "Mondial" },
    { key: "bando", name: "Bando" },
    { key: "varta", name: "Varta" },
    { key: "ngk", name: "NGK" },
    { key: "cfmoto", name: "CFMOTO" },
    { key: "bmw", name: "BMW" }
  ];

  const matchedBrands: string[] = [];
  majorBrands.forEach(b => {
    const rx = new RegExp(`\\b${b.key}\\b`, 'i');
    if (rx.test(rawLower)) {
      matchedBrands.push(b.name);
    }
  });

  // Uyumlu model listesi temizlenmesi
  let cleanModelsStr = mRaw;
  partNouns.forEach(item => {
    const rx = new RegExp(item.key.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
    cleanModelsStr = cleanModelsStr.replace(rx, "");
  });
  // Temizleme ve güzelleştirme
  cleanModelsStr = cleanModelsStr.replace(/[-–—]/g, " ").replace(/\s+/g, " ").trim();

  // Marka uyumluluğunu şık ayraçla ekleme
  let compatibilitySuffix = "";
  if (matchedBrands.length > 0) {
    const brandsFormatted = matchedBrands.slice(0, 3).join(" / ");
    const hasMore = matchedBrands.length > 3 ? "..." : "";
    compatibilitySuffix = ` (${brandsFormatted}${hasMore} Uyumlu)`;
  }

  // Kurumsal title oluştur
  let finalTitle = "";
  let formattedBrandCode = `${mBrand}`;
  if (mCode) {
    formattedBrandCode += ` ${mCode}`;
  }
  finalTitle = `${formattedBrandCode} ${matchedPartTitle}${compatibilitySuffix}`;

  // Gereksiz boşlukları toparla
  finalTitle = finalTitle.replace(/\s+/g, ' ').trim();

  // Premium yüksek çözünürlüklü Unsplash görselleri
  let targetImage = "";
  const partLower = matchedPartTitle.toLowerCase();
  if (partLower.includes("buji")) {
    targetImage = "https://images.unsplash.com/photo-1620055375841-f7da58c0c055?auto=format&fit=crop&w=600&q=80";
  } else if (partLower.includes("balata") || partLower.includes("fren")) {
    targetImage = "https://images.unsplash.com/photo-1603286161434-6c39a0684f0b?auto=format&fit=crop&w=600&q=80";
  } else if (partLower.includes("zincir") || partLower.includes("dişli")) {
    targetImage = "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80";
  } else if (partLower.includes("kayış") || partLower.includes("varyatör")) {
    targetImage = "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=600&q=80";
  } else if (partLower.includes("akü")) {
    targetImage = "https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=600&q=80";
  } else if (partLower.includes("motor") || partLower.includes("silindir") || partLower.includes("piston") || partLower.includes("segman") || partLower.includes("krank")) {
    targetImage = "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80";
  } else if (partLower.includes("far") || partLower.includes("sinyal") || partLower.includes("lamba") || partLower.includes("stop")) {
    targetImage = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80";
  } else if (partLower.includes("ayna") || partLower.includes("manet") || partLower.includes("kol")) {
    targetImage = "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80";
  } else {
    targetImage = "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80";
  }

  return {
    title: finalTitle,
    extractedPart: matchedPartTitle,
    compatibilityList: cleanModelsStr,
    compatibleBrands: matchedBrands,
    fallbackImage: targetImage
  };
}
