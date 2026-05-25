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

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function toTitleCaseTurkish(str: string): string {
  if (!str) return "";
  const acronyms = ["RTR", "NS", "RS", "E5", "ABS", "EFI", "LED", "CC", "ATV", "OEM", "GP", "HP"];
  return str
    .split(/\s+/)
    .map(word => {
      const upperWord = word.toUpperCase();
      if (acronyms.includes(upperWord)) {
        return upperWord;
      }
      return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
    })
    .join(" ");
}

function cleanAndFormatTitle(title: string, brand: string, sku: string): string {
  let clean = title || "";
  
  // 1. Detect "orijinal" / "orjinal"
  const isOriginal = /orijinal|orjınal|orjinal/i.test(clean);
  
  // Remove "orijinal" / "orjinal" from title
  clean = clean.replace(/orijinal|orjınal|orjinal/gi, "");

  // 2. Remove any SKU instances (with or without brackets)
  if (sku) {
    const escapedSku = sku.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const skuRegex1 = new RegExp(`\\(${escapedSku}\\)`, 'gi');
    const skuRegex2 = new RegExp(escapedSku, 'gi');
    clean = clean.replace(skuRegex1, "").replace(skuRegex2, "");
  }
  
  if (sku && sku.includes("-")) {
    const parts = sku.split("-");
    const numericPart = parts[parts.length - 1];
    if (numericPart && numericPart.length > 3) {
      const escapedNum = numericPart.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const numRegex = new RegExp(escapedNum, 'gi');
      clean = clean.replace(numRegex, "");
    }
  }

  // 3. Remove dirty words
  const dirtyWords = [
    "motosiklet", "yedek parça", "yedek parca", "yedekparça", "yedekparca", 
    "motor", "atv", "yedek parçası", "yedek parcasi", "ürün", "urun", 
    "aksesuar", "yedek", "orijinal parça", "orjinal parca"
  ];
  for (const word of dirtyWords) {
    const rx = new RegExp(`\\b${word}\\b`, 'gi');
    clean = clean.replace(rx, "");
  }

  // 4. Remove repeating brand name
  if (brand) {
    const escapedBrand = brand.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const brandRx = new RegExp(`\\b${escapedBrand}\\b`, 'gi');
    clean = clean.replace(brandRx, "");
  }

  // 5. Clean up extra punctuation, spaces, and empty parenthesis
  clean = clean
    .replace(/\(\s*\)/g, "")
    .replace(/[-+–_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^\s+|\s+$/g, "");

  // 6. TitleCase it
  clean = toTitleCaseTurkish(clean);

  // 7. Format clean brand
  const formattedBrand = toTitleCaseTurkish(brand || "");

  // 8. Reconstruct: "{Brand} {CleanTitle} [Orijinal] – {SKU}"
  let finalTitle = `${formattedBrand} ${clean}`;
  if (isOriginal) {
    finalTitle += " Orijinal";
  }
  
  if (sku) {
    finalTitle += ` – ${sku.toUpperCase()}`;
  }

  return finalTitle.replace(/\s+/g, " ").trim();
}

async function runWithConcurrency(tasks: (() => Promise<void>)[], concurrency: number) {
  const executing: Promise<void>[] = [];
  for (const task of tasks) {
    const p = task();
    executing.push(p);
    p.then(() => {
      executing.splice(executing.indexOf(p), 1);
    });
    if (executing.length >= concurrency) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
}

async function run() {
  console.log("🚀 Tüm Veritabanı Yetkilendirilmiş Sınırsız SEO Optimizasyon ve Temizlik Komut Dosyası Başlatıldı!");
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

  // 2. Pull ALL products paginated (to fetch more than 1000 threshold)
  let allProducts: any[] = [];
  let from = 0;
  const step = 1000;
  let hasMore = true;

  console.log("⏳ Veritabanı taranıyor...");
  while (hasMore) {
    const { data, error } = await supabase
      .from("products")
      .select("id, title, brand, sku, category")
      .range(from, from + step - 1);

    if (error) {
      console.error("❌ Ürün verisi alma hatası:", error.message);
      process.exit(1);
    }

    if (data && data.length > 0) {
      allProducts = allProducts.concat(data);
      console.log(`- ${allProducts.length} adet ürün çekildi...`);
      from += step;
    } else {
      hasMore = false;
    }
  }

  // Filter out already optimized ones (containing the space-en-dash-space separator)
  const productsToClean = allProducts.filter((p) => !p.title.includes(" – "));
  const alreadyOptimizedCount = allProducts.length - productsToClean.length;

  console.log(`📦 Veritabanında Toplam: ${allProducts.length} ürün var.`);
  console.log(`✨ Halihazırda SEO Uyumlu Olan: ${alreadyOptimizedCount} ürün.`);
  console.log(`⏳ SEO Optimizasyonu Bekleyen: ${productsToClean.length} ürün.`);

  if (productsToClean.length === 0) {
    console.log("🎉 Tüm veritabanı %100 SEO uyumlu ve temiz durumda!");
    process.exit(0);
  }

  let successCount = 0;
  let failCount = 0;

  // Build concurrent tasks
  const tasks = productsToClean.map((product) => async () => {
    const newTitle = cleanAndFormatTitle(product.title, product.brand, product.sku || "");
    const newSlug = slugify(newTitle);

    const { error: updateError } = await supabase
      .from("products")
      .update({
        title: newTitle,
        slug: newSlug,
        meta_title: newTitle.substring(0, 70),
        meta_description: `${product.brand} ${newTitle} yedek parçası. En uygun fiyatlar, hızlı kargo ve kapıda ödeme seçeneğiyle Paşa Motor'da!`.substring(0, 160)
      })
      .eq("id", product.id);

    if (updateError) {
      console.error(`❌ Güncelleme Başarısız: ID ${product.id} - Hata: ${updateError.message}`);
      failCount++;
    } else {
      console.log(`✅ [BAŞARILI] "${product.title}" ➡️ "${newTitle}"`);
      successCount++;
    }
  });

  // Run with friendly concurrency of 20 connections
  console.log(`⚡ ${productsToClean.length} ürün, 20 paralel havuz ile işleniyor...`);
  await runWithConcurrency(tasks, 20);

  console.log("\n=========================================================================");
  console.log("🎉 Temizlik ve Optimizasyon Tamamlandı!");
  console.log(`📊 Sonuçlar: Başarılı: ${successCount} | Başarısız: ${failCount}`);
}

run();
