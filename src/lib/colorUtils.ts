// Renk Tanıma ve Otomotiv Renk Eşleştirme Yardımcı Kütüphanesi

export interface ColorPreset {
  name: string;
  hex: string;
  category?: string;
}

// Türkiye Motosiklet & Otomotiv Sektöründe En Çok Kullanılan Standart ve Popüler Renkler
export const POPULAR_MOTORCYCLE_COLORS: ColorPreset[] = [
  { name: "MotoLux Kırmızı", hex: "#dc2626", category: "Kırmızı" },
  { name: "Ateş Kırmızısı", hex: "#ef4444", category: "Kırmızı" },
  { name: "Metalik Bordo", hex: "#881337", category: "Kırmızı" },
  { name: "Mat Siyah", hex: "#1e293b", category: "Siyah" },
  { name: "Gece Siyahı", hex: "#0f172a", category: "Siyah" },
  { name: "Parlak Siyah", hex: "#000000", category: "Siyah" },
  { name: "İnci Beyazı", hex: "#f8fafc", category: "Beyaz" },
  { name: "Saf Kar Beyazı", hex: "#ffffff", category: "Beyaz" },
  { name: "Nardo Gri", hex: "#64748b", category: "Gri" },
  { name: "Mat Gri", hex: "#b3b2a6", category: "Gri" },
  { name: "Titanyum Füme", hex: "#475569", category: "Gri" },
  { name: "Gümüş Gri", hex: "#94a3b8", category: "Gri" },
  { name: "Kobalt Mavisi", hex: "#2563eb", category: "Mavi" },
  { name: "Okyanus Mavisi", hex: "#0284c7", category: "Mavi" },
  { name: "Gece Mavisi / Lacivert", hex: "#1e3a8a", category: "Mavi" },
  { name: "Turkuaz Mavisi", hex: "#06b6d4", category: "Mavi" },
  { name: "Güneş Sarısı", hex: "#eab308", category: "Sarı" },
  { name: "Yarış Sarısı", hex: "#facc15", category: "Sarı" },
  { name: "Bakır Turuncu", hex: "#ea580c", category: "Turuncu" },
  { name: "Lav Turuncusu", hex: "#f97316", category: "Turuncu" },
  { name: "Askeri Yeşil", hex: "#2d5a27", category: "Yeşil" },
  { name: "Mint Yeşili", hex: "#84cc16", category: "Yeşil" },
  { name: "Fıstık Yeşili", hex: "#16a34a", category: "Yeşil" },
  { name: "Zümrüt Yeşili", hex: "#059669", category: "Yeşil" },
  { name: "Karamel Kahve", hex: "#78350f", category: "Kahve" },
  { name: "Moka Kahverengi", hex: "#854d0e", category: "Kahve" },
  { name: "Vintage Krem", hex: "#dcd3c1", category: "Özel" }
];

// Hex kodunu temizle ve normalize et (# ekle, 3 hane ise 6 haneye dönüştür)
export function normalizeHex(input: string): string | null {
  if (!input) return null;
  let clean = input.trim().replace(/^#/, "").trim();
  
  // 3 haneli hex ise 6 haneye genişlet (#f00 -> #ff0000)
  if (/^[0-9A-Fa-f]{3}$/.test(clean)) {
    clean = clean.split("").map((c) => c + c).join("");
  }
  
  if (/^[0-9A-Fa-f]{6}$/.test(clean)) {
    return `#${clean.toLowerCase()}`;
  }
  return null;
}

// Hex kodundan RGB bileşenlerini elde et
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const norm = normalizeHex(hex);
  if (!norm) return null;
  const num = parseInt(norm.slice(1), 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

// RGB'den HSL'e dönüştür
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// İki RGB rengi arasındaki renk mesafesi (CIE / Euclidean)
export function getColorDistance(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const rDiff = rgb1.r - rgb2.r;
  const gDiff = rgb1.g - rgb2.g;
  const bDiff = rgb1.b - rgb2.b;
  return Math.sqrt(0.3 * (rDiff * rDiff) + 0.59 * (gDiff * gDiff) + 0.11 * (bDiff * bDiff));
}

// Herhangi bir HEX kodundan anında en doğru ve doğal Türkçe Otomotiv/Motosiklet Renk Adını bul
export function getClosestColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "Özel Renk";

  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // 1. Önce doğrudan popüler renkler arasında yakın mesafe kontrolü yap
  let closestPreset: ColorPreset | null = null;
  let minDistance = Infinity;

  for (const preset of POPULAR_MOTORCYCLE_COLORS) {
    const presetRgb = hexToRgb(preset.hex);
    if (!presetRgb) continue;
    const dist = getColorDistance(rgb, presetRgb);
    if (dist < minDistance) {
      minDistance = dist;
      closestPreset = preset;
    }
  }

  // Çok yakın bir preset varsa (distance < 28) doğrudan adını döndür
  if (closestPreset && minDistance < 28) {
    return closestPreset.name;
  }

  // 2. Akıllı HSL Renk Skalası Analizi (Her renk için %100 kusursuz Türkçe tanımlama)
  // Akromatik / Nötr tonlar (Düşük doygunluk)
  if (s <= 12) {
    if (l >= 93) return "Saf Kar Beyazı";
    if (l >= 84) return "İnci Beyazı";
    if (l >= 70) return "Gümüş Gri";
    if (l >= 48) return "Nardo Gri";
    if (l >= 30) return "Titanyum Füme";
    if (l >= 16) return "Mat Siyah";
    return "Gece Siyahı";
  }

  // Sıcak / Krem / Bej Tonları
  if (h >= 30 && h <= 50 && s < 35 && l >= 75) {
    return "Vintage Krem";
  }

  // Kromatik Renk Aileleri
  if (h >= 345 || h < 12) {
    if (l < 25) return "Koyu Bordo";
    if (l < 42) return "Metalik Bordo";
    if (l > 65) return "Mercan Kırmızısı";
    return "Ateş Kırmızısı";
  }
  
  if (h >= 12 && h < 38) {
    if (l < 32) return "Karamel Kahve";
    if (l < 50) return "Bakır Turuncu";
    return "Lav Turuncusu";
  }

  if (h >= 38 && h < 65) {
    if (l < 35) return "Moka Kahverengi";
    if (l < 60) return "Altın Sarısı";
    return "Güneş Sarısı";
  }

  if (h >= 65 && h < 160) {
    if (h < 95) return "Fıstık Yeşili";
    if (l < 30) return "Askeri Yeşil";
    if (l > 60) return "Mint Yeşili";
    return "Zümrüt Yeşili";
  }

  if (h >= 160 && h < 195) {
    return "Turkuaz Mavisi";
  }

  if (h >= 195 && h < 255) {
    if (l < 28) return "Gece Mavisi / Lacivert";
    if (l > 55) return "Okyanus Mavisi";
    return "Kobalt Mavisi";
  }

  if (h >= 255 && h < 295) {
    return "Mistik Mor";
  }

  if (h >= 295 && h < 345) {
    return "Şeker Pembe";
  }

  return closestPreset ? closestPreset.name : "Özel Renk";
}

// Renk adı arama veya yazma sırasında HEX eşleştirme
export function matchColorNameInput(input: string): { name: string; hex: string } | null {
  if (!input || input.trim().length === 0) return null;
  const q = input.toLowerCase().trim()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c");

  // Önce popüler renklerde ara
  for (const p of POPULAR_MOTORCYCLE_COLORS) {
    const pNorm = p.name.toLowerCase()
      .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
      .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c");

    if (pNorm === q || pNorm.startsWith(q) || q.startsWith(pNorm)) {
      return { name: p.name, hex: p.hex };
    }
  }

  // Temel Türkçe anahtar kelimeler
  const genericKeywords: Record<string, { name: string; hex: string }> = {
    "kirmizi": { name: "Ateş Kırmızısı", hex: "#dc2626" },
    "bordo": { name: "Metalik Bordo", hex: "#881337" },
    "siyah": { name: "Mat Siyah", hex: "#1e293b" },
    "beyaz": { name: "İnci Beyazı", hex: "#f8fafc" },
    "gri": { name: "Nardo Gri", hex: "#64748b" },
    "fume": { name: "Titanyum Füme", hex: "#475569" },
    "gumus": { name: "Gümüş Gri", hex: "#94a3b8" },
    "mavi": { name: "Kobalt Mavisi", hex: "#2563eb" },
    "lacivert": { name: "Gece Mavisi / Lacivert", hex: "#1e3a8a" },
    "turkuaz": { name: "Turkuaz Mavisi", hex: "#06b6d4" },
    "sari": { name: "Güneş Sarısı", hex: "#eab308" },
    "altin": { name: "Altın Sarısı", hex: "#d97706" },
    "turuncu": { name: "Bakır Turuncu", hex: "#ea580c" },
    "yesil": { name: "Askeri Yeşil", hex: "#2d5a27" },
    "haki": { name: "Askeri Yeşil", hex: "#2d5a27" },
    "mint": { name: "Mint Yeşili", hex: "#84cc16" },
    "fistik": { name: "Fıstık Yeşili", hex: "#16a34a" },
    "kahve": { name: "Karamel Kahve", hex: "#78350f" },
    "krem": { name: "Vintage Krem", hex: "#dcd3c1" },
    "bej": { name: "Vintage Krem", hex: "#dcd3c1" },
    "mor": { name: "Mistik Mor", hex: "#7c3aed" },
    "pembe": { name: "Şeker Pembe", hex: "#ec4899" }
  };

  for (const [key, val] of Object.entries(genericKeywords)) {
    if (q.includes(key)) {
      return val;
    }
  }

  return null;
}
