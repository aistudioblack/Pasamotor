// MotoLux Resmî Modeller Veritabanı
// Resmî teknik özellikler motolux.com.tr üzerinden eksiksiz güncellenmiştir.

export interface MotorcycleColor {
  name: string;
  hex: string;
  imageIndex?: number;
  imageUrl?: string;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface MotorcycleSpecs {
  engineCapacity: string;
  maxPower: string;
  maxTorque?: string;
  maxSpeed?: string;
  transmission: string;
  cooling?: string;
  brakes: string;
  fuelTankOrBattery: string;
  inputVoltage?: string;
  range?: string;
  chargingTime?: string;
  weight: string;
  maxLoadWeight?: string;
  dimensions?: string;
  tireSize?: string;
  licenseRequirement: string;
  extraFeatures?: string[];
  [key: string]: any;
}

export interface Motorcycle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  tagline: string;
  category: "E-CAR" | "ENDURO / CROSS" | "CHOPPER" | "SCOOTER" | "TOURING" | "E-GRUP" | "CUB" | "E-TRICYCLE" | "UTV" | "GOLF BUGGY" | "ÇOCUK GRUBU" | "KLASİK";
  engineSize: string;
  licenseType: string;
  price: number;
  cashPrice?: number;
  installment6Price?: number;
  installment12Price?: number;
  originalPrice?: number;
  installmentText?: string;
  condition: "0 KM Sıfır" | "İkinci El";
  featured?: boolean;
  images: string[];
  colors: MotorcycleColor[];
  specs: MotorcycleSpecs;
  technicalSpecs?: SpecItem[];
  features: string[];
  giftPackage?: string[];
  description: string;
  warranty: string;
}

export const MOTORCYCLES: Motorcycle[] = [
  {
    "id": "motolux-africa-wolf-2",
    "slug": "motolux-africa-wolf-2",
    "brand": "MotoLux",
    "model": "AFRICA WOLF 2",
    "tagline": "Resmî MotoLux AFRICA WOLF 2 Yetkili Satış Bayisi",
    "category": "CUB",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 69125,
    "originalPrice": 74700,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-51.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-52.png",
      "/motorcycles/cutouts/motolux-africa-wolf-2-0.png",
      "/motorcycles/cutouts/motolux-africa-wolf-2-1.png"
    ],
    "colors": [
      {
        "name": "Güneş Sarısı",
        "hex": "#ECD313",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-51.png",
        "imageIndex": 0
      },
      {
        "name": "Gökyüzü Mavisi",
        "hex": "#379AC8",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-52.png",
        "imageIndex": 1
      }
    ],
    "specs": {
      "engineCapacity": "48 cc",
      "maxPower": "2 kW(2.72 hp)",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "4 Vites",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-5Ah",
      "weight": "103 kg",
      "licenseRequirement": "A1 / A2 / B Sınıfı",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "253 kg",
      "dimensions": "1936x710x1130 mm",
      "tireSize": "2.50-17 Dublex 2.75-17 Dublex"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi AFRICA WOLF 2, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "48 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "2 kW(2.72 hp)"
      },
      {
        "label": "Şanzıman",
        "value": "4 Vites"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "3,8 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1936x710x1130 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-5Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "103 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "253 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "2.50-17 Dublex 2.75-17 Dublex"
      }
    ]
  },
  {
    "id": "motolux-alf-plus",
    "slug": "motolux-alf-plus",
    "brand": "MotoLux",
    "model": "ALF PLUS",
    "tagline": "Resmî MotoLux ALF PLUS Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 55115,
    "originalPrice": 59500,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-64.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-65.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-BIRAZ-DAHA-GRI-66.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/alf-plus-koruma-demir-66.png"
    ],
    "colors": [
      {
        "name": "Füme Gri",
        "hex": "#808080",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-64.png",
        "imageIndex": 0
      },
      {
        "name": "Mercan Kırmızı",
        "hex": "#FE284E",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-65.png",
        "imageIndex": 1
      },
      {
        "name": "İnci Beyazı",
        "hex": "#EFEFEF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-BIRAZ-DAHA-GRI-66.png",
        "imageIndex": 2
      },
      {
        "name": "Füme Gri",
        "hex": "#808080",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/alf-plus-koruma-demir-66.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "1500 W",
      "maxPower": "1500 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "otomatik",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "60V-20Ah",
      "weight": "63 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "range": "35-55 km",
      "chargingTime": "8-10 saat",
      "maxLoadWeight": "254 kg",
      "dimensions": "1835x690x1110 mm",
      "tireSize": "3.00-10 Dublex 3.00-10 Dublex",
      "extraFeatures": [
        "Dijital Gösterge"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi ALF PLUS, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "45 km/h"
      },
      {
        "label": "Vites",
        "value": "otomatik"
      },
      {
        "label": "Motor Gücü",
        "value": "1500 W"
      },
      {
        "label": "Batarya",
        "value": "60V-20Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "63 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "254 kg"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00-10 Dublex 3.00-10 Dublex"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1835x690x1110 mm"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "35-55 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "8-10 saat"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Ek Özellik",
        "value": "Dijital Gösterge"
      },
      {
        "label": "Koruma Demiri",
        "value": "(Opsiyonel)"
      }
    ]
  },
  {
    "id": "motolux-alf-pro",
    "slug": "motolux-alf-pro",
    "brand": "MotoLux",
    "model": "ALF PRO",
    "tagline": "Resmî MotoLux ALF PRO Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 55115,
    "originalPrice": 59500,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro_2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro_1.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro_2.png",
        "imageIndex": 0
      },
      {
        "name": "Mercan Kırmızı",
        "hex": "#F72259",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro.png",
        "imageIndex": 1
      },
      {
        "name": "Füme Gri",
        "hex": "#7F7F7F",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro_1.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1500W",
      "maxPower": "1500W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "72V-20Ah",
      "weight": "66 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "range": "35-55 km",
      "chargingTime": "8-10 saat",
      "maxLoadWeight": "255 kg",
      "dimensions": "2002x698x1148mm",
      "tireSize": "90/90/12 - 3.50-10 Dublex",
      "extraFeatures": [
        "Led Far",
        "Led Sinyal",
        "Usb Şarj",
        "Port Bagaj",
        "Dijital Gösterge",
        "Nfc Kart"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi ALF PRO, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "45 km/h"
      },
      {
        "label": "Vites",
        "value": "OTOMATİK"
      },
      {
        "label": "Motor Gücü",
        "value": "1500W"
      },
      {
        "label": "Batarya",
        "value": "72V-20Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "35-55 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "8-10 saat"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "66 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "255 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2002x698x1148mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "90/90/12 - 3.50-10 Dublex"
      },
      {
        "label": "Ek Özellik",
        "value": "Led Far, Led Sinyal, Usb Şarj, Port Bagaj, Dijital Gösterge, Nfc Kart"
      }
    ]
  },
  {
    "id": "motolux-americano-125",
    "slug": "motolux-americano-125",
    "brand": "MotoLux",
    "model": "AMERICANO 125",
    "tagline": "Resmî MotoLux AMERICANO 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 100973,
    "originalPrice": 109100,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_2.png"
    ],
    "colors": [
      {
        "name": "Orman Yeşili",
        "hex": "#0A4407",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_3.png",
        "imageIndex": 0
      },
      {
        "name": "Titanyum Gri",
        "hex": "#898989",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125.png",
        "imageIndex": 1
      },
      {
        "name": "Taba Kahve",
        "hex": "#6B2E00",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_1.png",
        "imageIndex": 2
      },
      {
        "name": "Buz Mavisi",
        "hex": "#7FEEF4",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_2.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "8,50 HP @ 7500 rpm",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-6Ah",
      "weight": "114 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "dimensions": "1920x670x1135 mm",
      "tireSize": "120/70-12 Tubeless - 120/70-12 Tubeless",
      "extraFeatures": [
        "Navigasyon",
        "Dijital Gösterge Paneli (TFT Ekran)",
        "Anahtarsız Çalıştırma"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi AMERICANO 125, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "125 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "8,50 HP @ 7500 rpm"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "5,5 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1920x670x1135 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-6Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "114 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (CBS)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön / Arka",
        "value": "120/70-12 Tubeless - 120/70-12 Tubeless"
      },
      {
        "label": "Ek Özellik",
        "value": "Navigasyon, Dijital Gösterge Paneli (TFT Ekran), Anahtarsız Çalıştırma"
      }
    ]
  },
  {
    "id": "motolux-cappadocia125",
    "slug": "motolux-cappadocia125",
    "brand": "MotoLux",
    "model": "CAPPADOCIA 125",
    "tagline": "Türkiye'nin Tek Otomatik Vitesli Chopper Modeli - Resmî MotoLux Yetkili Satış Bayisi",
    "category": "CHOPPER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / A / B (125cc Yasası Uyumlu)",
    "price": 125000,
    "cashPrice": 125000,
    "installment6Price": 130000,
    "installment12Price": 135000,
    "originalPrice": 135000,
    "installmentText": "6 Taksit: 130.000 TL · 12 Taksit: 135.000 TL",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_4-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125.png"
    ],
    "colors": [
      {
        "name": "Vintage Krem",
        "hex": "#F4ECDC",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_2.png",
        "imageIndex": 0
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_4-1.png",
        "imageIndex": 1
      },
      {
        "name": "Mat Siyah",
        "hex": "#000000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125-1.png",
        "imageIndex": 2
      },
      {
        "name": "Yeşil Metalik",
        "hex": "#2D4A4C",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_3.png",
        "imageIndex": 3
      },
      {
        "name": "Turuncu",
        "hex": "#FF9700",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_1.png",
        "imageIndex": 4
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "8 HP @ 7750 rpm",
      "maxTorque": "8.6 Nm @ 6000 rpm",
      "transmission": "Otomatik (CVT)",
      "cooling": "Hava Soğutma",
      "brakes": "Ön Disk / Arka Disk (ABS Destekli)",
      "fuelTankOrBattery": "6 L Yakıt Tankı / 12V-3Ah",
      "weight": "116 kg",
      "licenseRequirement": "A1 / A2 / A / B Sınıfı Uyumlu",
      "maxSpeed": "90 km/h",
      "inputVoltage": "12V-3Ah",
      "maxLoadWeight": "266 kg",
      "dimensions": "2116 x 800 x 1140 mm",
      "tireSize": "Ön: 80/90-17 Dublex - Arka: 140/70-13 Dublex"
    },
    "features": [
      "Türkiye'nin İlk ve Tek Otomatik Vitesli (CVT) Chopper Motosikleti",
      "Ön 17 İnç & Arka 13 İnç Geniş Chopper Dublex Lastik Kombinasyonu",
      "Güçlü Çift Disk Fren Sistemi ve ABS Fren Desteği",
      "Retro-Modern Gösterge ve Ergonomik Sürüş Pozisyonu",
      "0 KM Sıfır Bayi Teslimatı ve 2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim & Plaka Ruhsat Desteği",
      "Geniş Yetkili Servis ve Orijinal MotoLux Yedek Parça Güvencesi"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi CAPPADOCIA 125, klasik chopper hatlarını modern otomatik vites konforuyla buluşturan Türkiye'deki tek modeldir. 125 cc 4 zamanlı motoru, 116 kg hafif gövdesi, çift disk ABS fren donanımı ve 5 farklı büyüleyici renk seçeneğiyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "125 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek Silindir 4 Zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "8 HP @ 7750 rpm"
      },
      {
        "label": "Maksimum Tork",
        "value": "8.6 Nm @ 6000 rpm"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik (CVT)"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "6 Litre"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI / Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin (Enjeksiyon / EFI)"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2116 x 800 x 1140 mm"
      },
      {
        "label": "Batarya / Akü",
        "value": "12V-3Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "116 kg"
      },
      {
        "label": "Azami Yüklü Ağırlık",
        "value": "266 kg"
      },
      {
        "label": "Frenler (Ön / Arka)",
        "value": "Disk / Disk (ABS)"
      },
      {
        "label": "Tekerlek Ölçüsü (Ön / Arka)",
        "value": "80/90-17 Dublex - 140/70-13 Dublex"
      }
    ]
  },
  {
    "id": "motolux-cargo-44000-l-2",
    "slug": "motolux-cargo-44000-l-2",
    "brand": "MotoLux",
    "model": "CARGO 44000-L",
    "tagline": "Resmî MotoLux CARGO 44000-L Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 116146,
    "originalPrice": 125400,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-73.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-72.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-71.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-78.png",
      "/motorcycles/cutouts/motolux-cargo-44000-l-2-0.png"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#FF0000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-73.png",
        "imageIndex": 0
      },
      {
        "name": "Füme Gri",
        "hex": "#808080",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-72.png",
        "imageIndex": 1
      },
      {
        "name": "Güneş Sarısı",
        "hex": "#FFFF00",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-71.png",
        "imageIndex": 2
      },
      {
        "name": "Turkuaz Mavi",
        "hex": "#30D5C8",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-78.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "1500 W",
      "maxPower": "1500 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "2 ileri 1 geri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk / Disk",
      "fuelTankOrBattery": "72V 46Ah veya 72V 58Ah",
      "weight": "212 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "35 km/h",
      "inputVoltage": "220-240 V",
      "range": "40-60 km",
      "maxLoadWeight": "659 kg",
      "dimensions": "3141 mm x 1171 mm x 1348 mm",
      "tireSize": "3.50-16 - 4.00-12 Dublex"
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi CARGO 44000-L, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "35 km/h"
      },
      {
        "label": "Vites",
        "value": "2 ileri 1 geri"
      },
      {
        "label": "Motor Gücü",
        "value": "1500 W"
      },
      {
        "label": "Batarya",
        "value": "72V 46Ah veya 72V 58Ah"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40-60 km"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "212 kg"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "659 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "3141 mm x 1171 mm x 1348 mm"
      },
      {
        "label": "Kasa Ölçüleri",
        "value": "1550x1100 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk / Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.50-16 - 4.00-12 Dublex"
      }
    ]
  },
  {
    "id": "motolux-cargo-52000-l",
    "slug": "motolux-cargo-52000-l",
    "brand": "MotoLux",
    "model": "CARGO 52000 - L",
    "tagline": "Resmî MotoLux CARGO 52000 - L Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "200cc",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 142834,
    "originalPrice": 154300,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/11/gri-52000@2x.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/kirimizi-52000@2x-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/sari-52000@2x-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/cargo-52000-L.png"
    ],
    "colors": [
      {
        "name": "Antrasit Gri",
        "hex": "#696969",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/gri-52000@2x.png",
        "imageIndex": 0
      },
      {
        "name": "Ateş Kırmızısı",
        "hex": "#E80303",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/kirimizi-52000@2x-scaled.png",
        "imageIndex": 1
      },
      {
        "name": "Amber Sarısı",
        "hex": "#FFE000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/sari-52000@2x-scaled.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "3900 W",
      "maxPower": "3900 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "2 İleri - 1 Geri Vites",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "(76V - 42 Ah Lityum) veya (72V - 58 Ah) veya (72V - 45 Ah)",
      "weight": "251 Kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "42 km/h",
      "inputVoltage": "220-240 V",
      "range": "40-60 km",
      "chargingTime": "8-10 Saat",
      "maxLoadWeight": "512 Kg",
      "dimensions": "~3042 x 1168 x 1361 mm",
      "tireSize": "3.75-12 - 4.00-12",
      "extraFeatures": [
        "Geri Görüş Kamerası",
        "Dijital Ekran",
        "Müzik Çalar Sistemi"
      ]
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi CARGO 52000 - L, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "42 km/h"
      },
      {
        "label": "Vites",
        "value": "2 İleri - 1 Geri Vites"
      },
      {
        "label": "Motor Gücü",
        "value": "3900 W"
      },
      {
        "label": "Motor Takviyesi",
        "value": "Var"
      },
      {
        "label": "Batarya",
        "value": "(76V - 42 Ah Lityum) veya (72V - 58 Ah) veya (72V - 45 Ah)"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40-60 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "8-10 Saat"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "251 Kg"
      },
      {
        "label": "Taşıma Kapasitesi",
        "value": "512 Kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "~3042 x 1168 x 1361 mm"
      },
      {
        "label": "Kasa Ölçüleri",
        "value": "1195 x1555 mm"
      },
      {
        "label": "Dingil Mesafesi",
        "value": "2012 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.75-12 - 4.00-12"
      },
      {
        "label": "Ek Özellikler",
        "value": "Geri Görüş Kamerası, Dijital Ekran, Müzik Çalar Sistemi"
      }
    ]
  },
  {
    "id": "motolux-cargo-54000",
    "slug": "motolux-cargo-54000",
    "brand": "MotoLux",
    "model": "CARGO 54000",
    "tagline": "Resmî MotoLux CARGO 54000 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 135000,
    "originalPrice": 142000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-3.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-2.png"
    ],
    "colors": [
      {
        "name": "Antrasit Gri",
        "hex": "#696969",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-3.png",
        "imageIndex": 0
      },
      {
        "name": "Ateş Kırmızısı",
        "hex": "#E80303",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-1.png",
        "imageIndex": 1
      },
      {
        "name": "Amber Sarısı",
        "hex": "#FFE000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-2.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "3900 W",
      "maxPower": "3900 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 İleri - 1 Geri Vites",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72V - 58 Ah",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "42 km/h",
      "inputVoltage": "220-240 V",
      "range": "50-60 km",
      "chargingTime": "8-10 Saat",
      "maxLoadWeight": "512 Kg",
      "dimensions": "~3042 x 1168 x 1361 mm",
      "tireSize": "3.75-12 - 4.00-12",
      "extraFeatures": [
        "Geri Görüş Kamerası",
        "Dijital Ekran",
        "Müzik Çalar Sistemi"
      ]
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi CARGO 54000, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "42 km/h"
      },
      {
        "label": "Vites",
        "value": "3 İleri - 1 Geri Vites"
      },
      {
        "label": "Motor Gücü",
        "value": "3900 W"
      },
      {
        "label": "Motor Takviyesi",
        "value": "Var"
      },
      {
        "label": "Batarya",
        "value": "72V - 58 Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "50-60 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "8-10 Saat"
      },
      {
        "label": "Taşıma Kapasitesi",
        "value": "512 Kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "~3042 x 1168 x 1361 mm"
      },
      {
        "label": "Kasa Ölçüleri",
        "value": "1220 x1600 mm"
      },
      {
        "label": "Dingil Mesafesi",
        "value": "2012 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.75-12 - 4.00-12"
      },
      {
        "label": "Ek Özellikler",
        "value": "Geri Görüş Kamerası, Dijital Ekran, Müzik Çalar Sistemi"
      }
    ]
  },
  {
    "id": "motolux-ceo-110",
    "slug": "motolux-ceo-110",
    "brand": "MotoLux",
    "model": "CEO 110",
    "tagline": "Resmî MotoLux CEO 110 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "110cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 86267,
    "originalPrice": 93200,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-GRI.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-BEYAZ.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-KIRMIZI.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-MAVI.png"
    ],
    "colors": [
      {
        "name": "Titanyum Gri",
        "hex": "#898989",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-GRI.png",
        "imageIndex": 0
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-BEYAZ.png",
        "imageIndex": 1
      },
      {
        "name": "Mürdüm / Bordo",
        "hex": "#62232E",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-KIRMIZI.png",
        "imageIndex": 2
      },
      {
        "name": "Safir Mavi",
        "hex": "#0A72EA",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-MAVI.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "109 cc",
      "maxPower": "8000 d/d 8,8 hp",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-7Ah",
      "weight": "101 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "251 kg",
      "dimensions": "1820x665x1110 mm",
      "tireSize": "90/90-12 Dublex 3.50-10 Dublex"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi CEO 110, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "109 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "8000 d/d 8,8 hp"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "5.5 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1820x665x1110 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-7Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "101 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "251 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (CBS)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "90/90-12 Dublex 3.50-10 Dublex"
      }
    ]
  },
  {
    "id": "motolux-ceo-125",
    "slug": "motolux-ceo-125",
    "brand": "MotoLux",
    "model": "CEO 125",
    "tagline": "Resmî MotoLux CEO 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 74500,
    "originalPrice": 79000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125_1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125_2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125.png"
    ],
    "colors": [
      {
        "name": "Titanyum Gri",
        "hex": "#939089",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125_1.png",
        "imageIndex": 0
      },
      {
        "name": "Ateş Kırmızısı",
        "hex": "#E80000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125_2.png",
        "imageIndex": 1
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "118.8 cc",
      "maxPower": "7500 d/d (9,2 hp)",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (Kombine)",
      "fuelTankOrBattery": "12V-7Ah",
      "weight": "96 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "246 kg",
      "dimensions": "1870x642x1105 mm",
      "tireSize": "90/90-12 Tubeless 3.50-10 Tubeless"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi CEO 125, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "118.8 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "7500 d/d (9,2 hp)"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "5.5 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1870x642x1105 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-7Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "96 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "246 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (Kombine)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "90/90-12 Tubeless 3.50-10 Tubeless"
      }
    ]
  },
  {
    "id": "motolux-cortado-200-off",
    "slug": "motolux-cortado-200-off",
    "brand": "MotoLux",
    "model": "CORTADO 200-OFF",
    "tagline": "Resmî MotoLux CORTADO 200-OFF Yetkili Satış Bayisi",
    "category": "ENDURO / CROSS",
    "engineSize": "200cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 115000,
    "originalPrice": 122000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/CORTADO-200_3@2000x-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/CORTADO-200_2@2000x-8.png"
    ],
    "colors": [
      {
        "name": "Mat Siyah",
        "hex": "#000000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/CORTADO-200_3@2000x-8.png",
        "imageIndex": 0
      },
      {
        "name": "Yarış Kırmızısı",
        "hex": "#F40000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/CORTADO-200_2@2000x-8.png",
        "imageIndex": 1
      }
    ],
    "specs": {
      "engineCapacity": "200 cc",
      "maxPower": "15,4 HP",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "6 Vites",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (ABS)",
      "fuelTankOrBattery": "12V6.5 AH",
      "weight": "145 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "295 KG",
      "dimensions": "2090x935x1335 mm",
      "tireSize": "90/100-21-110/100-18"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi CORTADO 200-OFF, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "200 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "15,4 HP"
      },
      {
        "label": "Şanzıman",
        "value": "6 Vites"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Kapasitesi",
        "value": "15 lt"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2090x935x1335 mm"
      },
      {
        "label": "Batarya",
        "value": "12V6.5 AH"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "145 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "295 KG"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (ABS)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "90/100-21-110/100-18"
      }
    ]
  },
  {
    "id": "motolux-drift-200",
    "slug": "motolux-drift-200",
    "brand": "MotoLux",
    "model": "DRIFT 200",
    "tagline": "Resmî MotoLux DRIFT 200 Yetkili Satış Bayisi",
    "category": "TOURING",
    "engineSize": "200cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 105000,
    "cashPrice": 105000,
    "installment6Price": 110000,
    "installment12Price": 115000,
    "originalPrice": 115000,
    "installmentText": "6 Taksit: 110.000 TL · 12 Taksit: 115.000 TL",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-1-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-3.png"
    ],
    "colors": [
      {
        "name": "Turkuaz Mavi",
        "hex": "#02B2DF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-1-1.png",
        "imageIndex": 0
      },
      {
        "name": "Metalik Kırmızı",
        "hex": "#BF1818",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-2.png",
        "imageIndex": 1
      },
      {
        "name": "Hardal Sarısı",
        "hex": "#F4CF31",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-3.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "199.5cc",
      "maxPower": "15.7 HP",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "6 İleri",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (ABS)",
      "fuelTankOrBattery": "12V-7Ah",
      "weight": "132 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "282 Kg",
      "dimensions": "2005x830x1060",
      "tireSize": "80/90-12 Dublex / 130/70-17 Dublex"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi DRIFT 200, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "199.5cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "15.7 HP"
      },
      {
        "label": "Şanzıman",
        "value": "6 İleri"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "14 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektronik Ateşleme"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2005x830x1060"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "132 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "282 Kg"
      },
      {
        "label": "Batarya",
        "value": "12V-7Ah"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (ABS)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "80/90-12 Dublex / 130/70-17 Dublex"
      }
    ]
  },
  {
    "id": "motolux-drift",
    "slug": "motolux-drift",
    "brand": "MotoLux",
    "model": "DRIFT",
    "tagline": "Resmî MotoLux DRIFT Yetkili Satış Bayisi",
    "category": "ÇOCUK GRUBU",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 10598,
    "originalPrice": 11400,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-4.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/siyah.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-1.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/sari-1.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-1-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-3.png"
    ],
    "colors": [
      {
        "name": "Ateş Kırmızısı",
        "hex": "#E41F3A",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-4.jpg",
        "imageIndex": 0
      },
      {
        "name": "Kraliyet Moru",
        "hex": "#17141B",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/siyah.jpg",
        "imageIndex": 1
      },
      {
        "name": "Gökyüzü Mavisi",
        "hex": "#D9DBE6",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-1.jpg",
        "imageIndex": 2
      },
      {
        "name": "Güneş Sarısı",
        "hex": "#FFEF1E",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/sari-1.jpg",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "30 W (2 parça)",
      "maxPower": "30 W (2 parça)",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Ön Disk / Arka Disk (CBS)",
      "fuelTankOrBattery": "12V 7Ah",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "6 km/saat",
      "inputVoltage": "110-220 V",
      "chargingTime": "3-5 Saat",
      "dimensions": "1020x740x590 mm"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi DRIFT, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "6 km/saat"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1020x740x590 mm"
      },
      {
        "label": "Şarj Süresi",
        "value": "3-5 Saat"
      },
      {
        "label": "Akü",
        "value": "12V 7Ah"
      },
      {
        "label": "Motor Gücü",
        "value": "30 W (2 parça)"
      },
      {
        "label": "Taşınabilir Yük",
        "value": "35 kg"
      },
      {
        "label": "Giriş Voltaj",
        "value": "110-220 V"
      }
    ]
  },
  {
    "id": "motolux-e-vintage",
    "slug": "motolux-e-vintage",
    "brand": "MotoLux",
    "model": "E-VINTAGE",
    "tagline": "Resmî MotoLux E-VINTAGE Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 62945,
    "originalPrice": 68000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/10/w.png",
      "https://motolux.com.tr/wp-content/uploads/2024/10/e.png",
      "https://motolux.com.tr/wp-content/uploads/2024/10/q.png",
      "https://motolux.com.tr/wp-content/uploads/2024/10/r.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-36-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-39.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-38.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-37.png"
    ],
    "colors": [
      {
        "name": "Çelik Gri",
        "hex": "#8D8B88",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/10/w.png",
        "imageIndex": 0
      },
      {
        "name": "Limon Sarısı",
        "hex": "#E6EFAB",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/10/e.png",
        "imageIndex": 1
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/10/q.png",
        "imageIndex": 2
      },
      {
        "name": "Pudra Bej",
        "hex": "#E4CCC6",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/10/r.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "2kw",
      "maxPower": "2kw",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "2 vites",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "72V 20 Ah",
      "weight": "63 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "range": "40-55 km",
      "chargingTime": "6-8 Saat",
      "maxLoadWeight": "260 kg",
      "dimensions": "1780x690x1105 mm",
      "tireSize": "3.00-10 - 3.00-10"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi E-VINTAGE, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "45 km/h"
      },
      {
        "label": "Vites",
        "value": "2 vites"
      },
      {
        "label": "Motor Gücü",
        "value": "2kw"
      },
      {
        "label": "Batarya",
        "value": "72V 20 Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40-55 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "6-8 Saat"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "63 kg"
      },
      {
        "label": "Azami̇ Yüklü Kütle",
        "value": "260 kg"
      },
      {
        "label": "Boyutlar (Uxgxy)",
        "value": "1780x690x1105 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00-10 - 3.00-10"
      }
    ]
  },
  {
    "id": "motolux-eceo",
    "slug": "motolux-eceo",
    "brand": "MotoLux",
    "model": "E-CEO",
    "tagline": "Resmî MotoLux E-CEO Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 56033,
    "originalPrice": 60500,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-KAHVERENGI-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-KIRMIZI-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-MAVI.png"
    ],
    "colors": [
      {
        "name": "Füme Gri",
        "hex": "#8B887F",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-KAHVERENGI-scaled.png",
        "imageIndex": 0
      },
      {
        "name": "Bordo",
        "hex": "#920417",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-KIRMIZI-scaled.png",
        "imageIndex": 1
      },
      {
        "name": "Okyanus Mavisi",
        "hex": "#496389",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-MAVI.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1200 W",
      "maxPower": "1200 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "otomatik",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "72V - 20Ah",
      "weight": "69 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "range": "40-60 km",
      "chargingTime": "8-10 saat",
      "maxLoadWeight": "257 kg",
      "dimensions": "2010x740x1130 mm",
      "tireSize": "90/80-12 Dublex 90/90-10 Dublex",
      "extraFeatures": [
        "Led Far",
        "Led Sinyal",
        "Usb Şarj",
        "Port Bagaj",
        "Dijital Gösterge"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi E-CEO, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "45 km/h"
      },
      {
        "label": "Vites",
        "value": "otomatik"
      },
      {
        "label": "Motor Gücü",
        "value": "1200 W"
      },
      {
        "label": "Batarya",
        "value": "72V - 20Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "69 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "257 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "90/80-12 Dublex 90/90-10 Dublex"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2010x740x1130 mm"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40-60 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "8-10 saat"
      },
      {
        "label": "Ek Özellik",
        "value": "Led Far, Led Sinyal, Usb Şarj, Port Bagaj, Dijital Gösterge"
      }
    ]
  },
  {
    "id": "motolux-fayton-8200",
    "slug": "motolux-fayton-8200",
    "brand": "MotoLux",
    "model": "FAYTON 8200",
    "tagline": "Resmî MotoLux FAYTON 8200 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "200cc",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 96000,
    "originalPrice": 104000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-gRI-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-Kirmizi-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-krem-scaled.png"
    ],
    "colors": [
      {
        "name": "Füme",
        "hex": "#606060",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-gRI-scaled.png",
        "imageIndex": 0
      },
      {
        "name": "Mercan Kırmızı",
        "hex": "#CB373A",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-Kirmizi-scaled.png",
        "imageIndex": 1
      },
      {
        "name": "Kavun Bej",
        "hex": "#FEDDC1",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-krem-scaled.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1300 W",
      "maxPower": "1300 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 İleri - 1 Geri Vites",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72V - 32Ah",
      "weight": "170 Kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "30 km/h",
      "inputVoltage": "220-240 V",
      "range": "40-60 km",
      "chargingTime": "8-10 Saat",
      "maxLoadWeight": "560 kg",
      "dimensions": "~2750x900x1110 mm",
      "tireSize": "3.00-12 Dublex 3.00-12 Dublex"
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi FAYTON 8200, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "30 km/h"
      },
      {
        "label": "Vites",
        "value": "3 İleri - 1 Geri Vites"
      },
      {
        "label": "Motor Gücü",
        "value": "1300 W"
      },
      {
        "label": "Motor Takviyesi",
        "value": "Takviyeli"
      },
      {
        "label": "Batarya",
        "value": "72V - 32Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40-60 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "8-10 Saat"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "170 Kg"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "560 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "~2750x900x1110 mm"
      },
      {
        "label": "Kasa Ölçüleri",
        "value": "1000x1300 mm"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00-12 Dublex 3.00-12 Dublex"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      }
    ]
  },
  {
    "id": "motolux-fayton-8800",
    "slug": "motolux-fayton-8800",
    "brand": "MotoLux",
    "model": "FAYTON 8800",
    "tagline": "Resmî MotoLux FAYTON 8800 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 140000,
    "originalPrice": 151200,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-GRI.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-KIRMIZI.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-KREM.png"
    ],
    "colors": [
      {
        "name": "Antrasit Gri",
        "hex": "#696969",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-GRI.png",
        "imageIndex": 0
      },
      {
        "name": "Ateş Kırmızısı",
        "hex": "#E80303",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-KIRMIZI.png",
        "imageIndex": 1
      },
      {
        "name": "Krem Beyaz",
        "hex": "#FFFDD0",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-KREM.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1200 W",
      "maxPower": "1200 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 İleri - 1 Geri Vites",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72V32Ah",
      "weight": "262 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "35 km/h",
      "inputVoltage": "220-240 V",
      "range": "35-45 km",
      "chargingTime": "8-10 Saat",
      "maxLoadWeight": "591 kg",
      "dimensions": "2812 x 1034 x 1895mm",
      "tireSize": "3.75-12 - 3.75-12",
      "extraFeatures": [
        "Dijital Ekran",
        "Müzik Çalar Sistemi"
      ]
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi FAYTON 8800, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "35 km/h"
      },
      {
        "label": "Vites",
        "value": "3 İleri - 1 Geri Vites"
      },
      {
        "label": "Motor Gücü",
        "value": "1200 W"
      },
      {
        "label": "Motor Takviyesi",
        "value": "Var"
      },
      {
        "label": "Batarya",
        "value": "72V32Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "35-45 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "8-10 Saat"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "262 kg"
      },
      {
        "label": "Taşıma Kapasitesi",
        "value": "591 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2812 x 1034 x 1895mm"
      },
      {
        "label": "Dingil Mesafesi",
        "value": "2142 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.75-12 - 3.75-12"
      },
      {
        "label": "Ek Özellikler",
        "value": "Dijital Ekran, Müzik Çalar Sistemi"
      }
    ]
  },
  {
    "id": "motolux-fayton-fx-08",
    "slug": "motolux-fayton-fx-08",
    "brand": "MotoLux",
    "model": "FAYTON FX 08",
    "tagline": "Resmî MotoLux FAYTON FX 08 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 96000,
    "originalPrice": 104000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/gri-12.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-30.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-22.png"
    ],
    "colors": [
      {
        "name": "Titanyum Gri",
        "hex": "#969696",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/gri-12.png",
        "imageIndex": 0
      },
      {
        "name": "Koyu Kırmızı",
        "hex": "#AC0D0F",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-30.png",
        "imageIndex": 1
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-22.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1000 W",
      "maxPower": "1000 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 ileri 1 geri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "60V - 24Ah",
      "weight": "87 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "25 km/h",
      "inputVoltage": "220-240 V",
      "range": "50-60 km",
      "chargingTime": "6-8 saat",
      "maxLoadWeight": "187 kg",
      "dimensions": "1580x680x1050 mm",
      "tireSize": "4.00-12 Dublex"
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi FAYTON FX 08, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "25 km/h"
      },
      {
        "label": "Vites",
        "value": "3 ileri 1 geri"
      },
      {
        "label": "Motor Gücü",
        "value": "1000 W"
      },
      {
        "label": "Batarya",
        "value": "60V - 24Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "50-60 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "6-8 saat"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1580x680x1050 mm"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "87 kg"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "187 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "4.00-12 Dublex"
      }
    ]
  },
  {
    "id": "motolux-fayton-fx-09",
    "slug": "motolux-fayton-fx-09",
    "brand": "MotoLux",
    "model": "Fayton FX 09",
    "tagline": "Resmî MotoLux Fayton FX 09 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 71133,
    "originalPrice": 76800,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-24.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-25-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-23-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-2.png"
    ],
    "colors": [
      {
        "name": "Fildişi / Krem",
        "hex": "#E5E3CC",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-24.png",
        "imageIndex": 0
      },
      {
        "name": "Adaçayı Haki",
        "hex": "#CCD3AC",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-25-scaled.png",
        "imageIndex": 1
      },
      {
        "name": "Füme Gri",
        "hex": "#6D6D6D",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-23-scaled.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1000 W",
      "maxPower": "1000 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "2 vitesli",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Kampana/Kampana",
      "fuelTankOrBattery": "60V - 20Ah",
      "weight": "93 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "25 km/h",
      "inputVoltage": "220-240 V",
      "range": "40 - 60 km",
      "maxLoadWeight": "198 kg",
      "dimensions": "2200 x 1050 x 1730 mm",
      "tireSize": "3.00-8 - 3.00-8 Dublex"
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi Fayton FX 09, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "25 km/h"
      },
      {
        "label": "Vites",
        "value": "2 vitesli"
      },
      {
        "label": "Motor Gücü",
        "value": "1000 W"
      },
      {
        "label": "Batarya",
        "value": "60V - 20Ah"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40 - 60 km"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "93 kg"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "198 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2200 x 1050 x 1730 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Kampana/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00-8 - 3.00-8 Dublex"
      }
    ]
  },
  {
    "id": "motolux-fayton-fx-10-l",
    "slug": "motolux-fayton-fx-10-l",
    "brand": "MotoLux",
    "model": "Fayton FX 10 - L",
    "tagline": "Resmî MotoLux Fayton FX 10 - L Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 82209,
    "originalPrice": 88800,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-2.png"
    ],
    "colors": [
      {
        "name": "Çelik Gri",
        "hex": "#8D8B88",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-3.png",
        "imageIndex": 0
      },
      {
        "name": "Vişne Kırmızı",
        "hex": "#C61720",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-2.png",
        "imageIndex": 1
      },
      {
        "name": "Güneş Sarısı",
        "hex": "#FFFEF3",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-1.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1000 W",
      "maxPower": "1000 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "2 İleri 1 Geri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "60V - 32Ah",
      "weight": "106 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "32 km/h",
      "inputVoltage": "220-240 V",
      "range": "40 - 60 km",
      "maxLoadWeight": "307kg",
      "dimensions": "2175/870/1070 mm",
      "tireSize": "3.00-10 - 3.00-10 Dublex"
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi Fayton FX 10 - L, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "32 km/h"
      },
      {
        "label": "Motor Gücü",
        "value": "1000 W"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40 - 60 km"
      },
      {
        "label": "Batarya",
        "value": "60V - 32Ah"
      },
      {
        "label": "Vites",
        "value": "2 İleri 1 Geri"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2175/870/1070 mm"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "307kg"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "106 kg"
      },
      {
        "label": "Takviye",
        "value": "Var"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00-10 - 3.00-10 Dublex"
      }
    ]
  },
  {
    "id": "motolux-fayton-fx-12",
    "slug": "motolux-fayton-fx-12",
    "brand": "MotoLux",
    "model": "Fayton FX 12",
    "tagline": "Resmî MotoLux Fayton FX 12 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 94624,
    "originalPrice": 102200,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/02/MIN-YESIL.png",
      "https://motolux.com.tr/wp-content/uploads/2026/02/KIRMIZI-.png",
      "https://motolux.com.tr/wp-content/uploads/2026/02/KREM.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-2.png"
    ],
    "colors": [
      {
        "name": "Adaçayı Grisi",
        "hex": "#899388",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/02/MIN-YESIL.png",
        "imageIndex": 0
      },
      {
        "name": "Vişne Kırmızı",
        "hex": "#C61720",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/02/KIRMIZI-.png",
        "imageIndex": 1
      },
      {
        "name": "Krem Bej",
        "hex": "#DECBBA",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/02/KREM.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1200 W",
      "maxPower": "1200 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 İleri 1 Geri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "60V - 32Ah",
      "weight": "106 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "32 km/h",
      "inputVoltage": "220-240 V",
      "range": "40 - 60 km",
      "maxLoadWeight": "307kg",
      "dimensions": "2175/870/1070 mm",
      "tireSize": "3.00-10 - 3.00-10 Dublex"
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi Fayton FX 12, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "32 km/h"
      },
      {
        "label": "Motor Gücü",
        "value": "1200 W"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40 - 60 km"
      },
      {
        "label": "Batarya",
        "value": "60V - 32Ah"
      },
      {
        "label": "Vites",
        "value": "3 İleri 1 Geri"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2175/870/1070 mm"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "307kg"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "106 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00-10 - 3.00-10 Dublex"
      }
    ]
  },
  {
    "id": "motolux-fayton-fx-23",
    "slug": "motolux-fayton-fx-23",
    "brand": "MotoLux",
    "model": "Fayton FX 23",
    "tagline": "Resmî MotoLux Fayton FX 23 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 96000,
    "originalPrice": 104000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/fx23.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/fx23_2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/fx23_1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/08/fx23s-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-2.png"
    ],
    "colors": [
      {
        "name": "Gökyüzü Mavisi",
        "hex": "#B2E0F5",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/fx23.png",
        "imageIndex": 0
      },
      {
        "name": "Adaçayı Haki",
        "hex": "#8FB387",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/fx23_2.png",
        "imageIndex": 1
      },
      {
        "name": "Fıstık Yeşili",
        "hex": "#B3FEA4",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/fx23_1.png",
        "imageIndex": 2
      },
      {
        "name": "Krem Bej",
        "hex": "#C1AB9A",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/08/fx23s-2.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "1200 W",
      "maxPower": "1200 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "2 ileri 1 geri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk / Disk",
      "fuelTankOrBattery": "60V - 33Ah",
      "weight": "116 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "35 km/h",
      "inputVoltage": "220-240 V",
      "range": "40 - 60 km",
      "maxLoadWeight": "437 kg",
      "dimensions": "2180 mm x 1050 mm x 1185 mm",
      "tireSize": "3.10 (ön) - 3.10 (arka) Dublex"
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi Fayton FX 23, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "35 km/h"
      },
      {
        "label": "Vites",
        "value": "2 ileri 1 geri"
      },
      {
        "label": "Motor Gücü",
        "value": "1200 W"
      },
      {
        "label": "Batarya",
        "value": "60V - 33Ah"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40 - 60 km"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "116 kg"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "437 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2180 mm x 1050 mm x 1185 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk / Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.10 (ön) - 3.10 (arka) Dublex"
      }
    ]
  },
  {
    "id": "motolux-fayton-fx-24",
    "slug": "motolux-fayton-fx-24",
    "brand": "MotoLux",
    "model": "Fayton FX 24",
    "tagline": "Resmî MotoLux Fayton FX 24 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 96000,
    "originalPrice": 104000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-2.png"
    ],
    "colors": [
      {
        "name": "İris Moru",
        "hex": "#7A72C0",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-1.png",
        "imageIndex": 0
      },
      {
        "name": "Petrol Mavisi",
        "hex": "#477B90",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-3.png",
        "imageIndex": 1
      },
      {
        "name": "Mercan Kırmızı",
        "hex": "#421627",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-2.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1200 W",
      "maxPower": "1200 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 vitesli",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "64V - 30Ah (Lityum) - 60V - 32Ah",
      "weight": "116 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "35 km/h",
      "inputVoltage": "220-240 V",
      "range": "40-60 km",
      "maxLoadWeight": "437 kg",
      "dimensions": "2186 x 1048x 1214 mm",
      "tireSize": "3.00-10 - 3.00-10 Dublex",
      "extraFeatures": [
        "GeriGörüş Kamerası",
        "Bluetooth Müzik Çalar"
      ]
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi Fayton FX 24, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "35 km/h"
      },
      {
        "label": "Vites",
        "value": "3 vitesli"
      },
      {
        "label": "Motor Gücü",
        "value": "1200 W"
      },
      {
        "label": "Batarya",
        "value": "64V - 30Ah (Lityum) - 60V - 32Ah"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40-60 km"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "116 kg"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "437 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2186 x 1048x 1214 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00-10 - 3.00-10 Dublex"
      },
      {
        "label": "Ek özellikler",
        "value": "GeriGörüş Kamerası, Bluetooth Müzik Çalar"
      }
    ]
  },
  {
    "id": "motolux-fayton-fx-25",
    "slug": "motolux-fayton-fx-25",
    "brand": "MotoLux",
    "model": "Fayton FX 25",
    "tagline": "Resmî MotoLux Fayton FX 25 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 96000,
    "originalPrice": 104000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-1-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-3.png",
      "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-2.png"
    ],
    "colors": [
      {
        "name": "İris Moru",
        "hex": "#7A72C0",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-1-1.png",
        "imageIndex": 0
      },
      {
        "name": "Petrol Mavisi",
        "hex": "#477B90",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-3.png",
        "imageIndex": 1
      },
      {
        "name": "Fildişi Bej",
        "hex": "#EDE7CA",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-2.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1200 W",
      "maxPower": "1200 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 vitesli",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "76.8V - 48Ah (Lityum)",
      "weight": "353 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "35 km/h",
      "inputVoltage": "220-240 V",
      "range": "40-70 km",
      "maxLoadWeight": "437 kg",
      "dimensions": "2423x 1057x 1752 mm",
      "tireSize": "3.00-10 - 3.00-10 Dublex",
      "extraFeatures": [
        "Geri Görüş Kamerası",
        "Bluetooth Müzik Çalar",
        "NFC",
        "Anahtarsız Çalıştırma"
      ]
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi Fayton FX 25, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "35 km/h"
      },
      {
        "label": "Vites",
        "value": "3 vitesli"
      },
      {
        "label": "Motor Gücü",
        "value": "1200 W"
      },
      {
        "label": "Batarya",
        "value": "76.8V - 48Ah (Lityum)"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40-70 km"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "353 kg"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "437 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2423x 1057x 1752 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00-10 - 3.00-10 Dublex"
      },
      {
        "label": "Ek özellikler",
        "value": "Geri Görüş Kamerası, Bluetooth Müzik Çalar, NFC, Anahtarsız Çalıştırma"
      }
    ]
  },
  {
    "id": "motolux-fayton-fx-33",
    "slug": "motolux-fayton-fx-33",
    "brand": "MotoLux",
    "model": "Fayton FX 33",
    "tagline": "Resmî MotoLux Fayton FX 33 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 96000,
    "originalPrice": 104000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX33-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX33_1-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX33_2.png"
    ],
    "colors": [
      {
        "name": "Parlak Kırmızı",
        "hex": "#E53333",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX33-scaled.png",
        "imageIndex": 0
      },
      {
        "name": "Antrasit",
        "hex": "#4C4C4C",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX33_1-scaled.png",
        "imageIndex": 1
      },
      {
        "name": "Titanyum Gri",
        "hex": "#848484",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX33_2.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1300 W",
      "maxPower": "1300 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 ileri 1 geri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk / Kampana",
      "fuelTankOrBattery": "60V - 32 Ah",
      "weight": "112 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "range": "40 - 60 km",
      "maxLoadWeight": "382 kg",
      "dimensions": "2520 mm x 910 mm x 1135 mm",
      "tireSize": "3.00 -12 (ön) - 3.00-12 (arka) Dublex"
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi Fayton FX 33, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "45 km/h"
      },
      {
        "label": "Vites",
        "value": "3 ileri 1 geri"
      },
      {
        "label": "Motor Gücü",
        "value": "1300 W"
      },
      {
        "label": "Batarya",
        "value": "60V - 32 Ah"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40 - 60 km"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "112 kg"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "382 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2520 mm x 910 mm x 1135 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk / Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00 -12 (ön) - 3.00-12 (arka) Dublex"
      }
    ]
  },
  {
    "id": "motolux-fayton-fx-34",
    "slug": "motolux-fayton-fx-34",
    "brand": "MotoLux",
    "model": "Fayton FX 34",
    "tagline": "Resmî MotoLux Fayton FX 34 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 95000,
    "cashPrice": 95000,
    "installment6Price": 100000,
    "installment12Price": 105000,
    "originalPrice": 105000,
    "installmentText": "6 Taksit: 100.000 TL · 12 Taksit: 105.000 TL",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1araba.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1-copyaraba.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1-copy-2araba.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-2.png"
    ],
    "colors": [
      {
        "name": "Parlak Kırmızı",
        "hex": "#E53333",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1araba.jpg",
        "imageIndex": 0
      },
      {
        "name": "Açık Bej",
        "hex": "#D8BA9A",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1-copyaraba.jpg",
        "imageIndex": 1
      },
      {
        "name": "Titanyum Gri",
        "hex": "#848484",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1-copy-2araba.jpg",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1500 W",
      "maxPower": "1500 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 ileri 1 geri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk / Kampana",
      "fuelTankOrBattery": "60V - 32 Ah",
      "weight": "135 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "35 km/h",
      "inputVoltage": "220-240 V",
      "range": "40 - 60 km",
      "maxLoadWeight": "255 kg",
      "dimensions": "244 mm x 914mm x 1180 mm",
      "tireSize": "3.00 -12 (ön) - 3.00-12 (arka) Dublex"
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi Fayton FX 34, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "35 km/h"
      },
      {
        "label": "Vites",
        "value": "3 ileri 1 geri"
      },
      {
        "label": "Motor Gücü",
        "value": "1500 W"
      },
      {
        "label": "Batarya",
        "value": "60V - 32 Ah"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40 - 60 km"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "135 kg"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "255 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "244 mm x 914mm x 1180 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk / Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00 -12 (ön) - 3.00-12 (arka) Dublex"
      }
    ]
  },
  {
    "id": "motolux-fayton-fx-55",
    "slug": "motolux-fayton-fx-55",
    "brand": "MotoLux",
    "model": "Fayton FX 55",
    "tagline": "Resmî MotoLux Fayton FX 55 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "3 Teker / Kargo",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 95000,
    "cashPrice": 95000,
    "installment6Price": 100000,
    "installment12Price": 105000,
    "originalPrice": 105000,
    "installmentText": "6 Taksit: 100.000 TL · 12 Taksit: 105.000 TL",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-3.png"
    ],
    "colors": [
      {
        "name": "Krem Beyaz",
        "hex": "#FFFDD0",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-1.png",
        "imageIndex": 0
      },
      {
        "name": "Gümüş Metalik",
        "hex": "#BEBEBE",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-2.png",
        "imageIndex": 1
      },
      {
        "name": "Koyu Gri",
        "hex": "#666666",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-3.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "2350 W",
      "maxPower": "2350 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "2 İleri - 1 Geri Vites",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72 V - 32 Ah",
      "weight": "150 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "35 km/h",
      "inputVoltage": "220-240 V",
      "range": "55- 65 km",
      "maxLoadWeight": "376 kg",
      "dimensions": "2440x987x1040 mm",
      "tireSize": "3.00-12 - 3.00-12"
    },
    "features": [
      "Yüksek Taşıma Kapasitesi ve Damperli Kasa",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi Fayton FX 55, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "35 km/h"
      },
      {
        "label": "Vites",
        "value": "2 İleri - 1 Geri Vites"
      },
      {
        "label": "Motor Gücü",
        "value": "2350 W"
      },
      {
        "label": "Motor Takviyesi",
        "value": "2 Takviyeli"
      },
      {
        "label": "Batarya",
        "value": "72 V - 32 Ah"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "55- 65 km"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "150 kg"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "376 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2440x987x1040 mm"
      },
      {
        "label": "Dingil Mesafesi",
        "value": "1745 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00-12 - 3.00-12"
      },
      {
        "label": "Kabin Seçeneği",
        "value": "(Opsiyonel)"
      }
    ]
  },
  {
    "id": "motolux-fir-fir",
    "slug": "motolux-fir-fir",
    "brand": "MotoLux",
    "model": "FIR FIR",
    "tagline": "Resmî MotoLux FIR FIR Yetkili Satış Bayisi",
    "category": "ÇOCUK GRUBU",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 76000,
    "originalPrice": 82000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/kir.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/sari-2.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-2.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-4.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/FIR-FIR-2.png"
    ],
    "colors": [
      {
        "name": "Ateş Kırmızısı",
        "hex": "#F12526",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kir.png",
        "imageIndex": 0
      },
      {
        "name": "Güneş Sarısı",
        "hex": "#FFEF1E",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/sari-2.png",
        "imageIndex": 1
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-2.png",
        "imageIndex": 2
      },
      {
        "name": "Okyanus Mavisi",
        "hex": "#2B2BC3",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-4.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "30 W (2 parça)",
      "maxPower": "30 W (2 parça)",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "El Freni",
      "fuelTankOrBattery": "12V 8Ah",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "6 km/saat",
      "inputVoltage": "110-220 V",
      "chargingTime": "3.5 Saat",
      "dimensions": "900x600x600 mm"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi FIR FIR, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "6 km/saat"
      },
      {
        "label": "Şarj Süresi",
        "value": "3.5 Saat"
      },
      {
        "label": "Akü",
        "value": "12V 8Ah"
      },
      {
        "label": "Giriş Voltaj",
        "value": "110-220 V"
      },
      {
        "label": "Boyutlar U-G-Y (mm)",
        "value": "900x600x600 mm"
      },
      {
        "label": "Motor Gücü",
        "value": "30 W (2 parça)"
      },
      {
        "label": "Fren",
        "value": "El Freni"
      },
      {
        "label": "Taşınabilir Yük",
        "value": "35 kg"
      }
    ]
  },
  {
    "id": "motolux-go-55-dubai",
    "slug": "motolux-go-55-dubai",
    "brand": "MotoLux",
    "model": "GO 55 Dubai",
    "tagline": "Resmî MotoLux GO 55 Dubai Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 36007,
    "originalPrice": 38900,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-73.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-72.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-74.png",
      "/motorcycles/cutouts/motolux-go-55-dubai-0.png",
      "/motorcycles/cutouts/motolux-go-55-dubai-1.png",
      "/motorcycles/cutouts/motolux-go-55-dubai-2.png",
      "/motorcycles/cutouts/motolux-go-55-dubai-3.png"
    ],
    "colors": [
      {
        "name": "Ateş Kırmızısı",
        "hex": "#E5C1C6",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-73.png",
        "imageIndex": 0
      },
      {
        "name": "Açık Gri",
        "hex": "#DEDEDE",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-72.png",
        "imageIndex": 1
      },
      {
        "name": "Füme Gri",
        "hex": "#616161",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-74.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "249 W",
      "maxPower": "249 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "48V - 20Ah",
      "weight": "52 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "25 km/h",
      "inputVoltage": "220-240 V",
      "range": "35-55 km",
      "chargingTime": "6-8 Saat",
      "maxLoadWeight": "246 kg",
      "dimensions": "1640x700x995 mm",
      "tireSize": "3.00-10 - 3.00-10",
      "extraFeatures": [
        "Led Far",
        "Usb Port",
        "Dijital Gösterge",
        "Sırtlık",
        "Park Ayağı",
        "Ön Sepet"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi GO 55 Dubai, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "25 km/h"
      },
      {
        "label": "Vites",
        "value": "Otomatik"
      },
      {
        "label": "Motor Gücü",
        "value": "249 W"
      },
      {
        "label": "Batarya",
        "value": "48V - 20Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "35-55 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "6-8 Saat"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "52 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "246 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1640x700x995 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.00-10 - 3.00-10"
      },
      {
        "label": "Ek Özellik",
        "value": "Led Far, Usb Port, Dijital Gösterge, Sırtlık, Park Ayağı, Ön Sepet"
      }
    ]
  },
  {
    "id": "motolux-gogo",
    "slug": "motolux-gogo",
    "brand": "MotoLux",
    "model": "GOGO49",
    "tagline": "Resmî MotoLux GOGO49 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 42000,
    "originalPrice": 46000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-61@2000x-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8.png",
      "/motorcycles/cutouts/motolux-gogo-0.png"
    ],
    "colors": [
      {
        "name": "Ateş Kırmızısı",
        "hex": "#E30613",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-61@2000x-8.png",
        "imageIndex": 0
      },
      {
        "name": "Gece Mavisi",
        "hex": "#1A253E",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8.png",
        "imageIndex": 1
      }
    ],
    "specs": {
      "engineCapacity": "249W",
      "maxPower": "249W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "2 Vites",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Kampana/Kampana",
      "fuelTankOrBattery": "48V - 20Ah",
      "weight": "40 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "41 km/h",
      "inputVoltage": "220-240 V",
      "range": "35-55 km",
      "chargingTime": "6-8 Saat",
      "maxLoadWeight": "219 kg",
      "dimensions": "1490x650x1080 mm",
      "tireSize": "60/100-10 Dublex",
      "extraFeatures": [
        "NFC Kart",
        "Led Far",
        "Usb Port",
        "Dijital Gösterge",
        "Sırtlık",
        "Park Ayağı",
        "Ön Sepet"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi GOGO49, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "41 km/h"
      },
      {
        "label": "Vites",
        "value": "2 Vites"
      },
      {
        "label": "Motor Gücü",
        "value": "249W"
      },
      {
        "label": "Batarya",
        "value": "48V - 20Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "35-55 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "6-8 Saat"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "40 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "219 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1490x650x1080 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Kampana/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "60/100-10 Dublex"
      },
      {
        "label": "Ek Özellik",
        "value": "NFC Kart, Led Far, Usb Port, Dijital Gösterge, Sırtlık, Park Ayağı, Ön Sepet"
      }
    ]
  },
  {
    "id": "motolux-ist-1453-s",
    "slug": "motolux-ist-1453-s",
    "brand": "MotoLux",
    "model": "IST 1453-S",
    "tagline": "Resmî MotoLux IST 1453-S Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 167844,
    "originalPrice": 181300,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-66.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-64.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-67.png",
      "https://motolux.com.tr/wp-content/uploads/2026/02/IST-1453-S-KIRMIZI.png",
      "https://motolux.com.tr/wp-content/uploads/2026/02/IST-1453-S-KREM.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-66.png",
        "imageIndex": 0
      },
      {
        "name": "Güneş Sarısı",
        "hex": "#FFFF00",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-64.png",
        "imageIndex": 1
      },
      {
        "name": "Antrasit",
        "hex": "#293133",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-67.png",
        "imageIndex": 2
      },
      {
        "name": "Kırmızı",
        "hex": "#FF0000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/02/IST-1453-S-KIRMIZI.png",
        "imageIndex": 3
      },
      {
        "name": "Dinamik Turuncu",
        "hex": "#FEECC8",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/02/IST-1453-S-KREM.png",
        "imageIndex": 4
      }
    ],
    "specs": {
      "engineCapacity": "1900 W",
      "maxPower": "1900 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 ileri 1 geri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk / Disk",
      "fuelTankOrBattery": "76V - 52Ah (Lityum) veya 76V - 100Ah (Lityum) veya 72V-58Ah",
      "weight": "268 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "40 km/h",
      "inputVoltage": "220-240 V",
      "range": "76V-52Ah için 45-75 km - 76V - 100Ah için 80-120 km - 72V-58 Ah için 45-75 km",
      "maxLoadWeight": "733 kg",
      "dimensions": "3086 mm x 1177mm x 1713 mm",
      "tireSize": "3.75-12 (ön) - 4.00-12 (arka)",
      "extraFeatures": [
        "Geri görüş kamerası",
        "USB Giriş",
        "Dijital Kilometre Kadranı",
        "Açılır Tavan ( Havalandırma )"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi IST 1453-S, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "40 km/h"
      },
      {
        "label": "Vites",
        "value": "3 ileri 1 geri"
      },
      {
        "label": "Motor Gücü",
        "value": "1900 W"
      },
      {
        "label": "Batarya",
        "value": "76V - 52Ah (Lityum) veya 76V - 100Ah (Lityum) veya 72V-58Ah"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "76V-52Ah için 45-75 km - 76V - 100Ah için 80-120 km - 72V-58 Ah için 45-75 km"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "268 kg"
      },
      {
        "label": "Azami yüklü Kütle",
        "value": "733 kg"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "3086 mm x 1177mm x 1713 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk / Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.75-12 (ön) - 4.00-12 (arka)"
      },
      {
        "label": "Kasa Ölçüsü",
        "value": "1200x1600 mm"
      },
      {
        "label": "Ek Özellik",
        "value": "Geri görüş kamerası, USB Giriş, Dijital Kilometre Kadranı, Açılır Tavan ( Havalandırma )"
      }
    ]
  },
  {
    "id": "motolux-ist-34",
    "slug": "motolux-ist-34",
    "brand": "MotoLux",
    "model": "IST 34",
    "tagline": "Resmî MotoLux IST 34 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 95000,
    "cashPrice": 95000,
    "installment6Price": 100000,
    "installment12Price": 105000,
    "originalPrice": 105000,
    "installmentText": "6 Taksit: 100.000 TL · 12 Taksit: 105.000 TL",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-BEYAZ.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-SARI.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-MAVI.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-BEYAZ.png",
        "imageIndex": 0
      },
      {
        "name": "Güneş Sarısı",
        "hex": "#FFFF00",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-SARI.png",
        "imageIndex": 1
      },
      {
        "name": "Turkuaz Mavi",
        "hex": "#30D5C8",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-MAVI.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "11,2 HP @ 8000 rpm",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Sıvı Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "12V-9Ah",
      "weight": "126 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "dimensions": "1975x750x1150 mm",
      "tireSize": "100/80-14″-120/70-14 ″"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi IST 34, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "125 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "11,2 HP @ 8000 rpm"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Sıvı Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "8 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1975x750x1150 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-9Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "126 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön / Arka",
        "value": "100/80-14″-120/70-14 ″"
      }
    ]
  },
  {
    "id": "motolux-latte",
    "slug": "motolux-latte",
    "brand": "MotoLux",
    "model": "LATTE",
    "tagline": "Resmî MotoLux LATTE Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 42000,
    "originalPrice": 46000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/09/Untitled-3.png",
      "https://motolux.com.tr/wp-content/uploads/2024/09/2-1.png",
      "https://motolux.com.tr/wp-content/uploads/2024/09/GHHH.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX33_1-scaled.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/09/Untitled-3.png",
        "imageIndex": 0
      },
      {
        "name": "Elektrik Mavisi",
        "hex": "#0098FF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/09/2-1.png",
        "imageIndex": 1
      },
      {
        "name": "Haki Siyah",
        "hex": "#101E03",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/09/GHHH.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "1500W",
      "maxPower": "1500W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 Vites",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "72V - 20Ah",
      "weight": "74 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "range": "35-55 km",
      "chargingTime": "6-8 Saat",
      "maxLoadWeight": "260 kg",
      "dimensions": "1905x680x1150 mm",
      "tireSize": "90/90-12 - 90/90-12 Dublex",
      "extraFeatures": [
        "Led Far",
        "Alarm",
        "Hız sabitleyici",
        "Dijital Gösterge",
        "Park Ayağı"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi LATTE, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "45 km/h"
      },
      {
        "label": "Vites",
        "value": "3 Vites"
      },
      {
        "label": "Motor Gücü",
        "value": "1500W"
      },
      {
        "label": "Batarya",
        "value": "72V - 20Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "35-55 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "6-8 Saat"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1905x680x1150 mm"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "74 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "260 kg"
      },
      {
        "label": "Frenler",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "90/90-12 - 90/90-12 Dublex"
      },
      {
        "label": "Ek Özellik",
        "value": "Led Far, Alarm, Hız sabitleyici, Dijital Gösterge, Park Ayağı"
      }
    ]
  },
  {
    "id": "motolux-m111",
    "slug": "motolux-m111",
    "brand": "MotoLux",
    "model": "M111",
    "tagline": "Resmî MotoLux M111 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 64212,
    "originalPrice": 69300,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/M111-BEYAZ-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/M111-GRI.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/M111-SIYAH.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/M111-BEYAZ-scaled.png",
        "imageIndex": 0
      },
      {
        "name": "Titanyum Gri",
        "hex": "#898989",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/M111-GRI.png",
        "imageIndex": 1
      },
      {
        "name": "Mat Siyah",
        "hex": "#1D1D1B",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/M111-SIYAH.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "2000 W",
      "maxPower": "2000 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "2 vites",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72V-24 Ah",
      "weight": "75 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "290 kg",
      "dimensions": "2020x760x1140 mm",
      "tireSize": "90/90-12- 90/90-12"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi M111, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "45 km/h"
      },
      {
        "label": "Vites",
        "value": "2 vites"
      },
      {
        "label": "Motor Gücü",
        "value": "2000 W"
      },
      {
        "label": "Batarya",
        "value": "72V-24 Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "75 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "290 kg"
      },
      {
        "label": "Boyutlar",
        "value": "2020x760x1140 mm"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "90/90-12- 90/90-12"
      }
    ]
  },
  {
    "id": "motolux-m750-utv",
    "slug": "motolux-m750-utv",
    "brand": "MotoLux",
    "model": "M750-UTV",
    "tagline": "Resmî MotoLux M750-UTV Yetkili Satış Bayisi",
    "category": "UTV",
    "engineSize": "50cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (MTV'siz)",
    "price": 56000,
    "originalPrice": 61000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/utv-motolux-1.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#f8fafc"
      }
    ],
    "specs": {
      "engineCapacity": "32.5 kW",
      "maxPower": "32.5 kW",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Ön Disk / Arka Disk (CBS)",
      "fuelTankOrBattery": "12V - 30Ah",
      "weight": "110 kg",
      "licenseRequirement": "B Sınıfı (Otomobil Ehliyeti Yeterli)",
      "maxSpeed": "60 km/h",
      "inputVoltage": "220-240 V",
      "dimensions": "3030mm x 1526mm x 1920 mm",
      "tireSize": "225/75-14 270/75-14"
    },
    "features": [
      "B Sınıfı Otomobil Ehliyeti ile Kullanılabilir",
      "Motorlu Taşıtlar Vergisinden (MTV) Muaf",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi M750-UTV, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "60 km/h"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "3030mm x 1526mm x 1920 mm"
      },
      {
        "label": "Batarya",
        "value": "12V - 30Ah"
      },
      {
        "label": "Motor Gücü",
        "value": "32.5 kW"
      },
      {
        "label": "Maksimum Ağırlığı",
        "value": "1145 kg"
      },
      {
        "label": "Araç Net Ağırlığı",
        "value": "913 kg"
      },
      {
        "label": "Lastik/Jant",
        "value": "225/75-14 270/75-14"
      }
    ]
  },
  {
    "id": "motolux-macchiato-125",
    "slug": "motolux-macchiato-125",
    "brand": "MotoLux",
    "model": "MACCHIATO 125",
    "tagline": "Resmî MotoLux MACCHIATO 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 75000,
    "cashPrice": 75000,
    "installment6Price": 80000,
    "installment12Price": 85000,
    "originalPrice": 85000,
    "installmentText": "6 Taksit: 80.000 TL · 12 Taksit: 85.000 TL",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-54-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-52.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-53.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-55.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-56.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/MACCHIATO-125-5.png"
    ],
    "colors": [
      {
        "name": "Adaçayı Haki",
        "hex": "#66806F",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-54-scaled.png",
        "imageIndex": 0
      },
      {
        "name": "Gece Mavisi",
        "hex": "#2B3447",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-52.png",
        "imageIndex": 1
      },
      {
        "name": "Füme Gri",
        "hex": "#7588A1",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-53.png",
        "imageIndex": 2
      },
      {
        "name": "Gece Siyahı",
        "hex": "#040607",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-55.png",
        "imageIndex": 3
      },
      {
        "name": "Bordo",
        "hex": "#AF0816",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-56.png",
        "imageIndex": 4
      },
      {
        "name": "Kapadokya Kumu",
        "hex": "#E6DDC7",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/MACCHIATO-125-5.png",
        "imageIndex": 5
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "7500 rpm (9.2 hp)",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-7Ah",
      "weight": "114 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "264 kg",
      "dimensions": "1890x670x1140 mm",
      "tireSize": "120/70-12 Dublex 120/70-12 Dublex"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi MACCHIATO 125, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "125 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 Zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "7500 rpm (9.2 hp)"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "4.5 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1890x670x1140 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-7Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "114 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "264 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (CBS)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "120/70-12 Dublex 120/70-12 Dublex"
      }
    ]
  },
  {
    "id": "motolux-mcx-125",
    "slug": "motolux-mcx-125",
    "brand": "MotoLux",
    "model": "MCX 125",
    "tagline": "Resmî MotoLux MCX 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 150228,
    "originalPrice": 162200,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-34-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-33.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-35.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-32.png"
    ],
    "colors": [
      {
        "name": "Çelik Gri",
        "hex": "#8D8B88",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-34-scaled.png",
        "imageIndex": 0
      },
      {
        "name": "Mat Siyah",
        "hex": "#000000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-33.png",
        "imageIndex": 1
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-35.png",
        "imageIndex": 2
      },
      {
        "name": "Hardal Sarısı",
        "hex": "#55503A",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-32.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "8500d/d 12 hp",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Sıvı Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-7Ah",
      "weight": "138kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "dimensions": "1965x730x1180 mm",
      "tireSize": "110/80-14 Dublex - 120/70-14 Dublex",
      "extraFeatures": [
        "Navigasyon",
        "Alarm",
        "Dijital Gösterge Paneli (TFT Ekran)",
        "Kamera"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi MCX 125, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "125 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "8500d/d 12 hp"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Sıvı Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "8 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1965x730x1180 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-7Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "138kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (CBS)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/ Arka",
        "value": "110/80-14 Dublex - 120/70-14 Dublex"
      },
      {
        "label": "Ek Özellik",
        "value": "Navigasyon, Alarm, Dijital Gösterge Paneli (TFT Ekran), Kamera"
      }
    ]
  },
  {
    "id": "motolux-mini-e-atv",
    "slug": "motolux-mini-e-atv",
    "brand": "MotoLux",
    "model": "MINI E-ATV",
    "tagline": "Resmî MotoLux MINI E-ATV Yetkili Satış Bayisi",
    "category": "ÇOCUK GRUBU",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 76000,
    "originalPrice": 82000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/Mini-e-ATV.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#f8fafc"
      }
    ],
    "specs": {
      "engineCapacity": "350 W",
      "maxPower": "350 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "El ile",
      "fuelTankOrBattery": "24V - 8Ah Lithium",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "6 km/saat",
      "inputVoltage": "110-220 V 50 Hz",
      "range": "15 km",
      "chargingTime": "3 Saat 30 Dakika",
      "tireSize": "4.10 / 3.5-6"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi MINI E-ATV, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "6 km/saat"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "4.10 / 3.5-6"
      },
      {
        "label": "Motor Gücü",
        "value": "350 W"
      },
      {
        "label": "Akü",
        "value": "24V - 8Ah Lithium"
      },
      {
        "label": "Giriş Voltaj",
        "value": "110-220 V 50 Hz"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "15 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "3 Saat 30 Dakika"
      },
      {
        "label": "Tırmanılabilir Yokuş Açısı",
        "value": "10°"
      },
      {
        "label": "Fren",
        "value": "El ile"
      },
      {
        "label": "Taşınabilir Yük",
        "value": "35 kg"
      }
    ]
  },
  {
    "id": "motolux-mini-e-jeep",
    "slug": "motolux-mini-e-jeep",
    "brand": "MotoLux",
    "model": "MINI E-JEEP",
    "tagline": "Resmî MotoLux MINI E-JEEP Yetkili Satış Bayisi",
    "category": "ÇOCUK GRUBU",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 76000,
    "originalPrice": 82000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/yesil-2.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/pembe-1.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmiz.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/mavi.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/turuncu.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/Mini-e-JEEP.png"
    ],
    "colors": [
      {
        "name": "Füme Gri",
        "hex": "#7D896D",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/yesil-2.jpg",
        "imageIndex": 0
      },
      {
        "name": "Kraliyet Moru",
        "hex": "#BA1EC8",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/pembe-1.jpg",
        "imageIndex": 1
      },
      {
        "name": "Koyu Kırmızı",
        "hex": "#D11017",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmiz.jpg",
        "imageIndex": 2
      },
      {
        "name": "Okyanus Mavisi",
        "hex": "#2BA8DC",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/mavi.jpg",
        "imageIndex": 3
      },
      {
        "name": "Dinamik Turuncu",
        "hex": "#E85706",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/turuncu.jpg",
        "imageIndex": 4
      }
    ],
    "specs": {
      "engineCapacity": "350 W",
      "maxPower": "350 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "El ile",
      "fuelTankOrBattery": "28V - 8Ah Lithium",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "6 km/saat",
      "inputVoltage": "110-220 V 50 Hz",
      "range": "15 km",
      "chargingTime": "3 Saat 30 Dakika",
      "dimensions": "1120x580x650 mm",
      "tireSize": "4.10"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi MINI E-JEEP, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "6 km/saat"
      },
      {
        "label": "Giriş Voltaj",
        "value": "110-220 V 50 Hz"
      },
      {
        "label": "Fren",
        "value": "El ile"
      },
      {
        "label": "Boyutlar UxGxY (mm)",
        "value": "1120x580x650 mm"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "15 km"
      },
      {
        "label": "Taşınabilir Yük",
        "value": "35 kg"
      },
      {
        "label": "Motor Gücü",
        "value": "350 W"
      },
      {
        "label": "Şarj Süresi",
        "value": "3 Saat 30 Dakika"
      },
      {
        "label": "Tekerlek Ölçüsü Ön",
        "value": "4.10"
      },
      {
        "label": "Akü",
        "value": "28V - 8Ah Lithium"
      },
      {
        "label": "Tırmanılabilir Yokuş Açısı",
        "value": "10°"
      },
      {
        "label": "Tekerlek Ölçüsü Arka",
        "value": "3.5-6"
      }
    ]
  },
  {
    "id": "motolux-mtx01",
    "slug": "motolux-mtx01",
    "brand": "MotoLux",
    "model": "MTX 01",
    "tagline": "Resmî MotoLux MTX 01 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 35000,
    "cashPrice": 35000,
    "installment6Price": 40000,
    "installment12Price": 45000,
    "originalPrice": 45000,
    "installmentText": "6 Taksit: 40.000 TL · 12 Taksit: 45.000 TL",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/08/mtx-01-.png"
    ],
    "colors": [
      {
        "name": "Mat Siyah",
        "hex": "#000000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/08/mtx-01-.png",
        "imageIndex": 0
      }
    ],
    "specs": {
      "engineCapacity": "249 W",
      "maxPower": "249 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 İleri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Kampana/Kampana",
      "fuelTankOrBattery": "48V20Ah",
      "weight": "34 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "25 km/h",
      "inputVoltage": "220-240 V",
      "range": "35-40 km",
      "chargingTime": "6-8 saat",
      "maxLoadWeight": "213 kg",
      "dimensions": "1642x653x1077 mm",
      "tireSize": "2.5-12",
      "extraFeatures": [
        "Dijital Gösterge"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi MTX 01, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "25 km/h"
      },
      {
        "label": "Vites",
        "value": "3 İleri"
      },
      {
        "label": "Motor Gücü",
        "value": "249 W"
      },
      {
        "label": "Batarya",
        "value": "48V20Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "34 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "213 kg"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "2.5-12"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1642x653x1077 mm"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "35-40 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "6-8 saat"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Kampana/Kampana"
      },
      {
        "label": "Ek Özellik",
        "value": "Dijital Gösterge"
      }
    ]
  },
  {
    "id": "motolux-mw-46",
    "slug": "motolux-mw-46",
    "brand": "MotoLux",
    "model": "MW46",
    "tagline": "Resmî MotoLux MW46 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 75000,
    "cashPrice": 75000,
    "installment6Price": 80000,
    "installment12Price": 85000,
    "originalPrice": 85000,
    "installmentText": "6 Taksit: 80.000 TL · 12 Taksit: 85.000 TL",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/MW46_2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/MW46_1-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/MW46-1.png"
    ],
    "colors": [
      {
        "name": "Güneş Sarısı",
        "hex": "#FFED00",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/MW46_2.png",
        "imageIndex": 0
      },
      {
        "name": "Dinamik Turuncu",
        "hex": "#EF7D00",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/MW46_1-1.png",
        "imageIndex": 1
      },
      {
        "name": "Turkuaz Mavi",
        "hex": "#009BAC",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/MW46-1.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "7500 rpm (8,5 hp)",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-7Ah",
      "weight": "105 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "265 kg",
      "dimensions": "1960x675x1100 mm",
      "tireSize": "90/90-14 Dublex 100/80-14 Dublex"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi MW46, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "125 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "7500 rpm (8,5 hp)"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "6.0 L"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1960x675x1100 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-7Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "105 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "265 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "90/90-14 Dublex 100/80-14 Dublex"
      }
    ]
  },
  {
    "id": "motolux-mz46-a",
    "slug": "motolux-mz46-a",
    "brand": "MotoLux",
    "model": "MZ46-A",
    "tagline": "Resmî MotoLux MZ46-A Yetkili Satış Bayisi",
    "category": "TOURING",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 62330,
    "originalPrice": 67300,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-3.png"
    ],
    "colors": [
      {
        "name": "Mercan Kırmızı",
        "hex": "#C75D86",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-2.png",
        "imageIndex": 0
      },
      {
        "name": "Koyu Kırmızı",
        "hex": "#BF0000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-1.png",
        "imageIndex": 1
      },
      {
        "name": "Mat Siyah",
        "hex": "#090A0B",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-3.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "49,4 cc",
      "maxPower": "3,5 hp",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "5 Vites",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-9Ah",
      "weight": "106 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "256 kg",
      "dimensions": "1954 x 700 x1141mm",
      "tireSize": "2.50-18 Dublex / 2.75-18 Dublex"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi MZ46-A, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "49,4 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "3,5 hp"
      },
      {
        "label": "Şanzıman",
        "value": "5 Vites"
      },
      {
        "label": "Soğutma",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "11 L"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "Pozitif Ateşleme"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1954 x 700 x1141mm"
      },
      {
        "label": "Batarya",
        "value": "12V-9Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "106 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "256 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "2.50-18 Dublex / 2.75-18 Dublex"
      }
    ]
  },
  {
    "id": "motolux-mz46-t",
    "slug": "motolux-mz46-t",
    "brand": "MotoLux",
    "model": "MZ46-T",
    "tagline": "Resmî MotoLux MZ46-T Yetkili Satış Bayisi",
    "category": "TOURING",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 62330,
    "originalPrice": 67300,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-2.png"
    ],
    "colors": [
      {
        "name": "Ateş Kırmızısı",
        "hex": "#FF0A26",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-1.png",
        "imageIndex": 0
      },
      {
        "name": "Koyu Kırmızı",
        "hex": "#BF0000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-3.png",
        "imageIndex": 1
      },
      {
        "name": "Gece Mavisi",
        "hex": "#111318",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-2.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "49.4cc",
      "maxPower": "3,5 Hp",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "5 Vites",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-9Ah",
      "weight": "106 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "256 kg",
      "dimensions": "1954x700x1141 mm",
      "tireSize": "2.50-18 Dublex / 2.75-18 Dublex"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi MZ46-T, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "49.4cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "3,5 Hp"
      },
      {
        "label": "Şanzıman",
        "value": "5 Vites"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "11 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "Pozitif Ateşleme"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1954x700x1141 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-9Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "106 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "256 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "2.50-18 Dublex / 2.75-18 Dublex"
      }
    ]
  },
  {
    "id": "motolux-nirvana-pro",
    "slug": "motolux-nirvana-pro",
    "brand": "MotoLux",
    "model": "NIRVANA PRO",
    "tagline": "Resmî MotoLux NIRVANA PRO Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 66000,
    "originalPrice": 71300,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-3.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-2.png",
        "imageIndex": 0
      },
      {
        "name": "Antrasit",
        "hex": "#464646",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-1.png",
        "imageIndex": 1
      },
      {
        "name": "Kırmızı",
        "hex": "#FF0000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-3.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "50 cc",
      "maxPower": "8000 d/d (3,5 hp)",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-7 Ah",
      "weight": "90 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "240 kg",
      "dimensions": "1870x695x1110 mm",
      "tireSize": "110/60-12 110/60-12 Tubeless"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi NIRVANA PRO, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "50 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "8000 d/d (3,5 hp)"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "4,5 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI /Elektronik"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1870x695x1110 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-7 Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "90 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "240 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "110/60-12 110/60-12 Tubeless"
      }
    ]
  },
  {
    "id": "motolux-pitton-9000",
    "slug": "motolux-pitton-9000",
    "brand": "MotoLux",
    "model": "PITTON 9000",
    "tagline": "Resmî MotoLux PITTON 9000 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 70000,
    "cashPrice": 70000,
    "installment6Price": 75000,
    "installment12Price": 80000,
    "originalPrice": 80000,
    "installmentText": "6 Taksit: 75.000 TL · 12 Taksit: 80.000 TL",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/12/Asset-75-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/12/Asset-76-8.png",
      "/motorcycles/cutouts/motolux-pitton-9000-0.png",
      "/motorcycles/cutouts/motolux-pitton-9000-1.png",
      "/motorcycles/cutouts/motolux-pitton-9000-2.png",
      "/motorcycles/cutouts/motolux-pitton-9000-3.png"
    ],
    "colors": [
      {
        "name": "Ateş Kırmızısı",
        "hex": "#CD131B",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/12/Asset-75-8.png",
        "imageIndex": 0
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/12/Asset-76-8.png",
        "imageIndex": 1
      }
    ],
    "specs": {
      "engineCapacity": "1500 W",
      "maxPower": "1500 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 ileri 1 geri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "72V - 20Ah",
      "weight": "81 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "range": "45 - 55 km",
      "chargingTime": "8-10 saat",
      "maxLoadWeight": "271 kg",
      "dimensions": "1811 x 760 x 1218 mm",
      "tireSize": "90/90-12 Dublex 90/90-12 Dublex",
      "extraFeatures": [
        "Gündüz Aydınlatma Led Far",
        "Usb Şarj",
        "Port Bagaj",
        "Dijital Gösterge",
        "Nfc Kart",
        "Anahtarsız Çalıştırma"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi PITTON 9000, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "45 km/h"
      },
      {
        "label": "Vites",
        "value": "3 ileri 1 geri"
      },
      {
        "label": "Motor Gücü",
        "value": "1500 W"
      },
      {
        "label": "Batarya",
        "value": "72V - 20Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "45 - 55 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "8-10 saat"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1811 x 760 x 1218 mm"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "81 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "271 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "90/90-12 Dublex 90/90-12 Dublex"
      },
      {
        "label": "Ek Özellik",
        "value": "Gündüz Aydınlatma Led Far, Usb Şarj, Port Bagaj, Dijital Gösterge, Nfc Kart, Anahtarsız Çalıştırma"
      }
    ]
  },
  {
    "id": "motolux-pitton6000",
    "slug": "motolux-pitton6000",
    "brand": "MotoLux",
    "model": "PITTON 6000",
    "tagline": "Resmî MotoLux PITTON 6000 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 59000,
    "originalPrice": 63000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-KIRMIZI-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-YESIL.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-MAVI.png"
    ],
    "colors": [
      {
        "name": "Ateş Kırmızısı",
        "hex": "#CD131B",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-KIRMIZI-scaled.png",
        "imageIndex": 0
      },
      {
        "name": "Zümrüt Yeşili",
        "hex": "#33A81B",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-YESIL.png",
        "imageIndex": 1
      },
      {
        "name": "Turkuaz Mavi",
        "hex": "#65BDBF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-MAVI.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "2000 W",
      "maxPower": "2000 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 ileri 1 geri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72V - 24Ah",
      "weight": "75 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "range": "40 - 55 km",
      "chargingTime": "8-10 saat",
      "maxLoadWeight": "290 kg",
      "dimensions": "2020 x 760 x 1140 mm",
      "tireSize": "90/90-12 Dublex 90/90-12 Dublex",
      "extraFeatures": [
        "Gündüz Aydınlatma Led Far",
        "Usb Şarj",
        "Port Bagaj",
        "Dijital Gösterge",
        "Nfc Kart",
        "Anahtarsız Çalıştırma"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi PITTON 6000, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "45 km/h"
      },
      {
        "label": "Vites",
        "value": "3 ileri 1 geri"
      },
      {
        "label": "Motor Gücü",
        "value": "2000 W"
      },
      {
        "label": "Batarya",
        "value": "72V - 24Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40 - 55 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "8-10 saat"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2020 x 760 x 1140 mm"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "75 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "290 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "90/90-12 Dublex 90/90-12 Dublex"
      },
      {
        "label": "Ek Özellik",
        "value": "Gündüz Aydınlatma Led Far, Usb Şarj, Port Bagaj, Dijital Gösterge, Nfc Kart, Anahtarsız Çalıştırma"
      }
    ]
  },
  {
    "id": "motolux-ragner-rt2",
    "slug": "motolux-ragner-rt2",
    "brand": "MotoLux",
    "model": "RAGNER RT2",
    "tagline": "Resmî MotoLux RAGNER RT2 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 260346,
    "originalPrice": 281200,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/RT-2-13-12-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/RT-2-13-2-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Asset-4.png",
      "/motorcycles/cutouts/motolux-ragner-rt2-0.png"
    ],
    "colors": [
      {
        "name": "Dinamik Turuncu",
        "hex": "#BB9F75",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/RT-2-13-12-scaled.png",
        "imageIndex": 0
      },
      {
        "name": "Güneş Sarısı",
        "hex": "#FEEB18",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/RT-2-13-2-scaled.png",
        "imageIndex": 1
      },
      {
        "name": "Füme Gri",
        "hex": "#656564",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Asset-4.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "250 cc",
      "maxPower": "7500 rpm 17 kW (23.12 hp)",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Sıvı Soğutma",
      "brakes": "Disk/Disk (ABS) (TCS)",
      "fuelTankOrBattery": "12V-11Ah",
      "weight": "183 kg",
      "licenseRequirement": "A1 / A2 / B Sınıfı",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "dimensions": "2080 x 785 x 1345",
      "tireSize": "110/80-14 Dublex - 140/60-13 Dublex",
      "extraFeatures": [
        "Navigasyon",
        "Alarm",
        "Dijital Gösterge Paneli (TFT Ekran)",
        "ABS Fren Sistemi."
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi RAGNER RT2, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "250 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "7500 rpm 17 kW (23.12 hp)"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Sıvı Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "12.6 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2080 x 785 x 1345"
      },
      {
        "label": "Batarya",
        "value": "12V-11Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "183 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (ABS) (TCS)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "110/80-14 Dublex - 140/60-13 Dublex"
      },
      {
        "label": "Ek Özellik",
        "value": "Navigasyon, Alarm, Dijital Gösterge Paneli (TFT Ekran), ABS Fren Sistemi."
      }
    ]
  },
  {
    "id": "motolux-rossi-fx-50-2",
    "slug": "motolux-rossi-fx-50-2",
    "brand": "MotoLux",
    "model": "ROSSI FX 50",
    "tagline": "Resmî MotoLux ROSSI FX 50 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "50cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (MTV'siz)",
    "price": 68500,
    "originalPrice": 73000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-59@2000x-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-57@2000x-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-58@2000x-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-49.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-50.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-51.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-42-1-scaled.png"
    ],
    "colors": [
      {
        "name": "Ateş Kırmızısı",
        "hex": "#E30613",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-59@2000x-8.png",
        "imageIndex": 0
      },
      {
        "name": "Mat Siyah",
        "hex": "#1D1D1B",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-57@2000x-8.png",
        "imageIndex": 1
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-58@2000x-8.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "49.6 cc",
      "maxPower": "8000 d/d 3,5 hp",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-7Ah",
      "weight": "90 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "240 kg",
      "dimensions": "1830x670x1075",
      "tireSize": "3.50-10 -3.50-10 Dublex"
    },
    "features": [
      "B Sınıfı Otomobil Ehliyeti ile Kullanılabilir",
      "Motorlu Taşıtlar Vergisinden (MTV) Muaf",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi ROSSI FX 50, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "49.6 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "8000 d/d 3,5 hp"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "4.5 L"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1830x670x1075"
      },
      {
        "label": "Batarya",
        "value": "12V-7Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "90 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "240 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.50-10 -3.50-10 Dublex"
      }
    ]
  },
  {
    "id": "motolux-rossi-rs-125",
    "slug": "motolux-rossi-rs-125",
    "brand": "MotoLux",
    "model": "ROSSI RS 125",
    "tagline": "Resmî MotoLux ROSSI RS 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 74450,
    "originalPrice": 80400,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-40-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-41-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-42-1-scaled.png"
    ],
    "colors": [
      {
        "name": "Koyu Kırmızı",
        "hex": "#C80016",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-40-1.png",
        "imageIndex": 0
      },
      {
        "name": "Mat Siyah",
        "hex": "#252828",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-41-1.png",
        "imageIndex": 1
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-42-1-scaled.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "124.6 cc",
      "maxPower": "7500 d/d 8,5 hp",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "12V-7Ah",
      "weight": "109 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "259 kg",
      "dimensions": "1900x680x1220 mm",
      "tireSize": "120/70-12 Dublex 120/70-12 Dublex",
      "extraFeatures": [
        "Anahtarsız Çalıştırma"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi ROSSI RS 125, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "124.6 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "7500 d/d 8,5 hp"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "5.0 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1900x680x1220 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-7Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "109 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "259 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "120/70-12 Dublex 120/70-12 Dublex"
      },
      {
        "label": "Ek Özellik",
        "value": "Anahtarsız Çalıştırma"
      }
    ]
  },
  {
    "id": "motolux-rossirs-50",
    "slug": "motolux-rossirs-50",
    "brand": "MotoLux",
    "model": "ROSSI RS 50",
    "tagline": "Resmî MotoLux ROSSI RS 50 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "50cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (MTV'siz)",
    "price": 68720,
    "originalPrice": 74200,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-51.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-49.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-50.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-51.png",
        "imageIndex": 0
      },
      {
        "name": "Kozmik Siyah",
        "hex": "#0F0F0F",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-49.png",
        "imageIndex": 1
      },
      {
        "name": "Kırmızı",
        "hex": "#D20017",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-50.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "49.6 cc",
      "maxPower": "8000 d/d 3,5 hp",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-7Ah",
      "weight": "90 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "240 kg",
      "dimensions": "1940x685x1110 mm",
      "tireSize": "120/70-12 Dublex 120/70-12 Dublex",
      "extraFeatures": [
        "Anahtarsız Çalıştırma"
      ]
    },
    "features": [
      "B Sınıfı Otomobil Ehliyeti ile Kullanılabilir",
      "Motorlu Taşıtlar Vergisinden (MTV) Muaf",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi ROSSI RS 50, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "49.6 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "8000 d/d 3,5 hp"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "4.5 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1940x685x1110 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-7Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "90 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "240 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "120/70-12 Dublex 120/70-12 Dublex"
      },
      {
        "label": "Ek Özellik",
        "value": "Anahtarsız Çalıştırma"
      }
    ]
  },
  {
    "id": "motolux-sst-125",
    "slug": "motolux-sst-125",
    "brand": "MotoLux",
    "model": "SST 125",
    "tagline": "Resmî MotoLux SST 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 125000,
    "cashPrice": 125000,
    "installment6Price": 130000,
    "installment12Price": 135000,
    "originalPrice": 135000,
    "installmentText": "6 Taksit: 130.000 TL · 12 Taksit: 135.000 TL",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-63@2000x-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-61@2000x-8-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8-2.png",
      "/motorcycles/cutouts/motolux-sst-125-0.png",
      "/motorcycles/cutouts/motolux-sst-125-1.png"
    ],
    "colors": [
      {
        "name": "Açık Mavi",
        "hex": "#06DDF9",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-63@2000x-8.png",
        "imageIndex": 0
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8-1.png",
        "imageIndex": 1
      },
      {
        "name": "Mat Siyah",
        "hex": "#000000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-61@2000x-8-1.png",
        "imageIndex": 2
      },
      {
        "name": "Güneş Sarısı",
        "hex": "#FFCE00",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8-2.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "11,3 HP @ 8000 rpm",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Sıvı Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-11,2Ah",
      "weight": "142 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "dimensions": "1890x775x1230 mm",
      "tireSize": "110/80-14 Dublex- 120/70-12 Dublex",
      "extraFeatures": [
        "Navigasyon",
        "Dijital Gösterge Paneli (TFT Ekran)",
        "Anahtarsız Çalıştırma"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi SST 125, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "125 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "11,3 HP @ 8000 rpm"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Sıvı Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "10,5 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1890x775x1230 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-11,2Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "142 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (CBS)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön / Arka",
        "value": "110/80-14 Dublex- 120/70-12 Dublex"
      },
      {
        "label": "Ek Özellik",
        "value": "Navigasyon, Dijital Gösterge Paneli (TFT Ekran), Anahtarsız Çalıştırma"
      }
    ]
  },
  {
    "id": "motolux-super-54",
    "slug": "motolux-super-54",
    "brand": "MotoLux",
    "model": "SUPER 54",
    "tagline": "Resmî MotoLux SUPER 54 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 76000,
    "originalPrice": 82000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-3.png"
    ],
    "colors": [
      {
        "name": "Karbon Siyah",
        "hex": "#19161F",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-2.png",
        "imageIndex": 0
      },
      {
        "name": "Bordo",
        "hex": "#AC0503",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-1.png",
        "imageIndex": 1
      },
      {
        "name": "Açık Gri",
        "hex": "#AAAAAA",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-3.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "249 W",
      "maxPower": "249 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "7 Vites",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "48V - 20Ah",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "25 km/h",
      "inputVoltage": "220-240 V",
      "range": "35-50 km",
      "chargingTime": "6 saat",
      "tireSize": "20x4.0 - 20x4.0 Dublex"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi SUPER 54, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "25 km/h"
      },
      {
        "label": "Vites",
        "value": "7 Vites"
      },
      {
        "label": "Motor Gücü",
        "value": "249 W"
      },
      {
        "label": "Şarj Süresi",
        "value": "6 saat"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "35-50 km"
      },
      {
        "label": "Batarya",
        "value": "48V - 20Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "20x4.0 - 20x4.0 Dublex"
      }
    ]
  },
  {
    "id": "motolux-utv-550",
    "slug": "motolux-utv-550",
    "brand": "MotoLux",
    "model": "M550-UTV",
    "tagline": "Resmî MotoLux M550-UTV Yetkili Satış Bayisi",
    "category": "UTV",
    "engineSize": "50cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (MTV'siz)",
    "price": 56000,
    "originalPrice": 61000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/08/Asset-60@2000x-8-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/utv-motolux-1.png"
    ],
    "colors": [
      {
        "name": "Turkuaz Mavi",
        "hex": "#7DACA8",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/08/Asset-60@2000x-8-scaled.png",
        "imageIndex": 0
      }
    ],
    "specs": {
      "engineCapacity": "28.9 kW",
      "maxPower": "28.9 kW",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Ön Disk / Arka Disk (CBS)",
      "fuelTankOrBattery": "12V-30Ah",
      "weight": "953 kg",
      "licenseRequirement": "B Sınıfı (Otomobil Ehliyeti Yeterli)",
      "maxSpeed": "60 km/h",
      "inputVoltage": "220-240 V",
      "dimensions": "2908 mm x1237 mm x1850 mm",
      "tireSize": "Ön Lastik : 225 / 65 -14 72F Arka Lastik : 280 / 55 -14 79F"
    },
    "features": [
      "B Sınıfı Otomobil Ehliyeti ile Kullanılabilir",
      "Motorlu Taşıtlar Vergisinden (MTV) Muaf",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi M550-UTV, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "60 km/h"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2908 mm x1237 mm x1850 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-30Ah"
      },
      {
        "label": "Motor Gücü",
        "value": "28.9 kW"
      },
      {
        "label": "Maksimum Ağırlık",
        "value": "953 kg"
      },
      {
        "label": "Araç Net Ağırlığı",
        "value": "720 kg"
      },
      {
        "label": "Lastik/Jant",
        "value": "Ön Lastik : 225 / 65 -14 72F Arka Lastik : 280 / 55 -14 79F"
      }
    ]
  },
  {
    "id": "motolux-valencia",
    "slug": "motolux-valencia",
    "brand": "MotoLux",
    "model": "LIZBON",
    "tagline": "Resmî MotoLux LIZBON Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 76000,
    "originalPrice": 82000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon_3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/09/VALENCIA-KAHVERENGI.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon_2.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon.png",
        "imageIndex": 0
      },
      {
        "name": "Turkuaz Mavi",
        "hex": "#30D5C8",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon_3.png",
        "imageIndex": 1
      },
      {
        "name": "Dinamik Turuncu",
        "hex": "#ECD8B1",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/09/VALENCIA-KAHVERENGI.png",
        "imageIndex": 2
      },
      {
        "name": "Kırmızı",
        "hex": "#FF0000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon_2.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "249W",
      "maxPower": "249W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "3 İleri - 1 Geri",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "48V-20Ah",
      "weight": "45 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "42 km/h",
      "inputVoltage": "220-240 V",
      "range": "40-50 km",
      "chargingTime": "6-8 saat",
      "maxLoadWeight": "219 kg",
      "dimensions": "1756x678x1127 mm",
      "tireSize": "2.75-10 - 2.75-10 Dublex",
      "extraFeatures": [
        "Dijital Gösterge Paneli",
        "USB Şarj",
        "NFC Kart",
        "Alarm",
        "Led Far"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi LIZBON, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "42 km/h"
      },
      {
        "label": "Vites",
        "value": "3 İleri - 1 Geri"
      },
      {
        "label": "Motor Gücü",
        "value": "249W"
      },
      {
        "label": "Batarya",
        "value": "48V-20Ah"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "40-50 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "6-8 saat"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1756x678x1127 mm"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "45 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "219 kg"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240 V"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "2.75-10 - 2.75-10 Dublex"
      },
      {
        "label": "Ek Özellikler",
        "value": "Dijital Gösterge Paneli, USB Şarj, NFC Kart, Alarm, Led Far"
      }
    ]
  },
  {
    "id": "motolux-vegas125",
    "slug": "motolux-vegas125",
    "brand": "MotoLux",
    "model": "VEGAS 125",
    "tagline": "Resmî MotoLux VEGAS 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 104539,
    "originalPrice": 112900,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-45.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-43.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-44-scaled.png"
    ],
    "colors": [
      {
        "name": "Orman Yeşili",
        "hex": "#0A4407",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-45.png",
        "imageIndex": 0
      },
      {
        "name": "Titanyum Gri",
        "hex": "#898989",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-43.png",
        "imageIndex": 1
      },
      {
        "name": "Kraliyet Mavisi",
        "hex": "#0804A0",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-44-scaled.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "9,52 HP @ 7500 rpm",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-7Ah",
      "weight": "140 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "320 kg",
      "dimensions": "2000x780x1225 mm",
      "tireSize": "120/70-13-130/70-13 Dublex",
      "extraFeatures": [
        "Navigasyon",
        "Dijital Gösterge Paneli (TFT Ekran)",
        "Anahtarsız Çalıştırma"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi VEGAS 125, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "125 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "9,52 HP @ 7500 rpm"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "6,9 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2000x780x1225 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-7Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "140 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "320 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (CBS)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "120/70-13-130/70-13 Dublex"
      },
      {
        "label": "Ek Özellik",
        "value": "Navigasyon, Dijital Gösterge Paneli (TFT Ekran), Anahtarsız Çalıştırma"
      }
    ]
  },
  {
    "id": "motolux-vintage-s",
    "slug": "motolux-vintage-s",
    "brand": "MotoLux",
    "model": "VINTAGE S",
    "tagline": "Resmî MotoLux VINTAGE S Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 62000,
    "originalPrice": 67000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-36-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-37.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-38.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-39.png"
    ],
    "colors": [
      {
        "name": "Zümrüt Yeşili",
        "hex": "#88CAB8",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-36-scaled.png",
        "imageIndex": 0
      },
      {
        "name": "Titanyum Gri",
        "hex": "#898989",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-37.png",
        "imageIndex": 1
      },
      {
        "name": "Ateş Kırmızısı",
        "hex": "#E2BDBA",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-38.png",
        "imageIndex": 2
      },
      {
        "name": "Güneş Sarısı",
        "hex": "#D1C858",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-39.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "49,4 cc",
      "maxPower": "3,5 HP @ 8000 rpm",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Drum",
      "fuelTankOrBattery": "12V-7 Ah",
      "weight": "101 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "dimensions": "1758X690X1073 mm",
      "tireSize": "3.50-10-3.50-10"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi VINTAGE S, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "49,4 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "3,5 HP @ 8000 rpm"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Hava Soğutma"
      },
      {
        "label": "Yakıt Kapasitesi",
        "value": "5.4 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1758X690X1073 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-7 Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "101 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Drum"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "3.50-10-3.50-10"
      }
    ]
  },
  {
    "id": "motolux-wow-01",
    "slug": "motolux-wow-01",
    "brand": "MotoLux",
    "model": "WOW-01",
    "tagline": "Resmî MotoLux WOW-01 Yetkili Satış Bayisi",
    "category": "E-CAR",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 76000,
    "originalPrice": 82000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-4.png",
      "https://motolux.com.tr/wp-content/uploads/2026/04/Asset-11.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-1.png",
        "imageIndex": 0
      },
      {
        "name": "Nane Yeşili",
        "hex": "#9FC9B3",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-2.png",
        "imageIndex": 1
      },
      {
        "name": "Lila Gri",
        "hex": "#B6B6D2",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-4.png",
        "imageIndex": 2
      },
      {
        "name": "Kırmızı",
        "hex": "#FF0000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/04/Asset-11.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "5 kw",
      "maxPower": "5 kw",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "76V-52Ah(Lityum) - 76V100Ah(Lityum)",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "55-60 km/h",
      "inputVoltage": "220-240 V",
      "range": "76V-52Ah için 50 km - 76V100Ah için 95 km",
      "chargingTime": "2,5 saat",
      "dimensions": "2752x1292x1647 mm",
      "tireSize": "125/65-12’’ - 125/65-12 ‘’",
      "extraFeatures": [
        "4 Cam Otomatik",
        "Dijital Gösterge",
        "Geri Görüş Kamerası",
        "Sac Gövde",
        "Sunroof"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi WOW-01, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "55-60 km/h"
      },
      {
        "label": "Motor Gücü",
        "value": "5 kw"
      },
      {
        "label": "Batarya",
        "value": "76V-52Ah(Lityum) - 76V100Ah(Lityum)"
      },
      {
        "label": "Şarj Aleti",
        "value": "75V-25Ah"
      },
      {
        "label": "Şarj Süresi",
        "value": "2,5 saat"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "76V-52Ah için 50 km - 76V100Ah için 95 km"
      },
      {
        "label": "Vites",
        "value": "Otomatik"
      },
      {
        "label": "Fren",
        "value": "Disk/Disk"
      },
      {
        "label": "Lastik Ölçüsü",
        "value": "125/65-12’’ - 125/65-12 ‘’"
      },
      {
        "label": "Boyutlar",
        "value": "2752x1292x1647 mm"
      },
      {
        "label": "Yolcu Sayısı",
        "value": "4 Kişi"
      },
      {
        "label": "Ek Özellikler",
        "value": "4 Cam Otomatik, Dijital Gösterge, Geri Görüş Kamerası, Sac Gövde, Sunroof"
      }
    ]
  },
  {
    "id": "motolux-wow-150",
    "slug": "motolux-wow-150",
    "brand": "MotoLux",
    "model": "WOW 150",
    "tagline": "Resmî MotoLux WOW 150 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "50cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (MTV'siz)",
    "price": 56000,
    "originalPrice": 61000,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-34.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-32-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-33.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-35-scaled.png"
    ],
    "colors": [
      {
        "name": "Füme Gri",
        "hex": "#6A6A6A",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-34.png",
        "imageIndex": 0
      },
      {
        "name": "Mercan Kırmızı",
        "hex": "#A40321",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-32-scaled.png",
        "imageIndex": 1
      },
      {
        "name": "Okyanus Mavisi",
        "hex": "#4F95D1",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-33.png",
        "imageIndex": 2
      },
      {
        "name": "Orman Yeşili",
        "hex": "#31523E",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-35-scaled.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "150 cc",
      "maxPower": "10,5Kw (14,28 hp)",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "Otomatik",
      "cooling": "Sıvı Soğutma",
      "brakes": "Disk/Disk (ABS)",
      "fuelTankOrBattery": "12V-9Ah",
      "weight": "138 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "45 km/h",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "288 kg",
      "dimensions": "1950x725x1190 mm",
      "tireSize": "110/80-14 Dublex 130/70-13 Dublex"
    },
    "features": [
      "B Sınıfı Otomobil Ehliyeti ile Kullanılabilir",
      "Motorlu Taşıtlar Vergisinden (MTV) Muaf",
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi WOW 150, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "150 cc"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "10,5Kw (14,28 hp)"
      },
      {
        "label": "Şanzıman",
        "value": "Otomatik"
      },
      {
        "label": "Soğutma Tipi",
        "value": "Sıvı Soğutma"
      },
      {
        "label": "Yakıt Tankı Kapasitesi",
        "value": "11 L"
      },
      {
        "label": "Ateşleme Tipi",
        "value": "CDI/Elektrikli Marş"
      },
      {
        "label": "Yakıt Sistemi",
        "value": "Benzin"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1950x725x1190 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-9Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "138 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "288 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (ABS)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "110/80-14 Dublex 130/70-13 Dublex"
      }
    ]
  },
  {
    "id": "motolux-x-tankmini",
    "slug": "motolux-x-tankmini",
    "brand": "MotoLux",
    "model": "X-TANK MINI",
    "tagline": "Resmî MotoLux X-TANK MINI Yetkili Satış Bayisi",
    "category": "ÇOCUK GRUBU",
    "engineSize": "125cc",
    "licenseType": "A1 / A2 / B (125cc Yasası Uyumlu)",
    "price": 46000,
    "originalPrice": 49700,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/07/remove.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/07/remove-copy-2.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/07/remove-copy.jpg",
      "/motorcycles/cutouts/motolux-x-tankmini-0.png",
      "/motorcycles/cutouts/motolux-x-tankmini-1.png",
      "/motorcycles/cutouts/motolux-x-tankmini-2.png"
    ],
    "colors": [
      {
        "name": "Fıstık Yeşili",
        "hex": "#90FF00",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/07/remove.jpg",
        "imageIndex": 0
      },
      {
        "name": "Yarış Kırmızısı",
        "hex": "#F40000",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/07/remove-copy-2.jpg",
        "imageIndex": 1
      },
      {
        "name": "Alev Turuncu",
        "hex": "#FFA500",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/07/remove-copy.jpg",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "800 W",
      "maxPower": "800 W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "36V 12Ah",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "25km/h",
      "inputVoltage": "220-240 V",
      "tireSize": "Ön- 4.10-6 Arka-5.00-6"
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi X-TANK MINI, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Gücü",
        "value": "800 W"
      },
      {
        "label": "Hız",
        "value": "25km/h"
      },
      {
        "label": "Batarya",
        "value": "36V 12Ah"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "Ön- 4.10-6 Arka-5.00-6"
      }
    ]
  },
  {
    "id": "motolux-yt-a2-22-g",
    "slug": "motolux-yt-a2-22-g",
    "brand": "MotoLux",
    "model": "YT-A2.2+2 G",
    "tagline": "Resmî MotoLux YT-A2.2+2 G Yetkili Satış Bayisi",
    "category": "GOLF BUGGY",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 192000,
    "originalPrice": 207400,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-13.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/YT-A2.42-G.png"
    ],
    "colors": [
      {
        "name": "Okyanus Mavisi",
        "hex": "#244A93",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-13.png",
        "imageIndex": 0
      }
    ],
    "specs": {
      "engineCapacity": "5000W",
      "maxPower": "5000W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Ön Disk / Arka Disk (CBS)",
      "fuelTankOrBattery": "48V - 150Ah",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "25 km/h",
      "inputVoltage": "220-240",
      "range": "80-100 km",
      "dimensions": "2960x1310x2074 mm",
      "tireSize": "2.50-18 Dublex / 2.75-18 Dublex",
      "extraFeatures": [
        "Katlanır Ön Cam",
        "İki Noktalı Emniyet Kemeri",
        "Bluetooth Destekli 10 İnç Ekran",
        "Geri Görüş Kamerası",
        "Ses Sistemi",
        "Ön Sepet",
        "Ön Koruma Demiri"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi YT-A2.2+2 G, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "25 km/h"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2960x1310x2074 mm"
      },
      {
        "label": "Batarya",
        "value": "48V - 150Ah"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "2.50-18 Dublex / 2.75-18 Dublex"
      },
      {
        "label": "Motor Gücü",
        "value": "5000W"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240"
      },
      {
        "label": "Menzil",
        "value": "80-100 km"
      },
      {
        "label": "Maksimum Yükleme Ağırlığı",
        "value": "360 kg"
      },
      {
        "label": "Araç Net Ağırlığı",
        "value": "580 kg"
      },
      {
        "label": "Lastik/Jant",
        "value": "12 İnç Alüminyum Jant (Arazi Lastiği seçeneği ile)"
      },
      {
        "label": "Ek Özellik",
        "value": "Katlanır Ön Cam, İki Noktalı Emniyet Kemeri, Bluetooth Destekli 10 İnç Ekran, Geri Görüş Kamerası, Ses Sistemi, Ön Sepet, Ön Koruma Demiri"
      }
    ]
  },
  {
    "id": "motolux-yt-a2-22",
    "slug": "motolux-yt-a2-22",
    "brand": "MotoLux",
    "model": "YT-A2.2+2",
    "tagline": "Resmî MotoLux YT-A2.2+2 Yetkili Satış Bayisi",
    "category": "GOLF BUGGY",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 192000,
    "originalPrice": 207400,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-18.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-22.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/siyah-14.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/YT-A2.22.png"
    ],
    "colors": [
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-18.png",
        "imageIndex": 0
      },
      {
        "name": "Mercan Kırmızı",
        "hex": "#AB0024",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-22.png",
        "imageIndex": 1
      },
      {
        "name": "Mat Siyah",
        "hex": "#222322",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/siyah-14.png",
        "imageIndex": 2
      }
    ],
    "specs": {
      "engineCapacity": "5000W",
      "maxPower": "5000W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Ön Disk / Arka Disk (CBS)",
      "fuelTankOrBattery": "48V - 150Ah",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "25 km/h",
      "inputVoltage": "220-240",
      "range": "80-100 km",
      "dimensions": "2885x1230x1910 mm",
      "tireSize": "10 İnç Lastik/10 İnç Alüminyum Jant",
      "extraFeatures": [
        "Katlanır Ön Cam",
        "İki Noktalı Emniyet Kemeri",
        "Bluetooth Destekli 10 İnç Ekran",
        "Geri Görüş Kamerası",
        "Ses Sistemi",
        "Ön Sepet",
        "Ön Koruma Demiri"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi YT-A2.2+2, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "25 km/h"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "2885x1230x1910 mm"
      },
      {
        "label": "Batarya",
        "value": "48V - 150Ah"
      },
      {
        "label": "Motor Gücü",
        "value": "5000W"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240"
      },
      {
        "label": "Menzil",
        "value": "80-100 km"
      },
      {
        "label": "Maksimum Yükleme Ağırlığı",
        "value": "360 kg"
      },
      {
        "label": "Araç Net Ağırlığı",
        "value": "560 kg"
      },
      {
        "label": "Lastik/Jant",
        "value": "10 İnç Lastik/10 İnç Alüminyum Jant"
      },
      {
        "label": "Ek Özellik",
        "value": "Katlanır Ön Cam, İki Noktalı Emniyet Kemeri, Bluetooth Destekli 10 İnç Ekran, Geri Görüş Kamerası, Ses Sistemi, Ön Sepet, Ön Koruma Demiri"
      }
    ]
  },
  {
    "id": "motolux-yt-a2-42-g",
    "slug": "motolux-yt-a2-42-g",
    "brand": "MotoLux",
    "model": "YT-A2.4+2 G",
    "tagline": "Resmî MotoLux YT-A2.4+2 G Yetkili Satış Bayisi",
    "category": "GOLF BUGGY",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 230667,
    "originalPrice": 249100,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-24.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-20.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/YT-A2.42-G.png"
    ],
    "colors": [
      {
        "name": "Bordo",
        "hex": "#6A222D",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-24.png",
        "imageIndex": 0
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-20.png",
        "imageIndex": 1
      }
    ],
    "specs": {
      "engineCapacity": "5000W",
      "maxPower": "5000W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Ön Disk / Arka Disk (CBS)",
      "fuelTankOrBattery": "48V - 150Ah",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "25 km/h",
      "inputVoltage": "220-240",
      "range": "80-100 km",
      "dimensions": "3760x1310x2074 mm",
      "tireSize": "12 İnç Arazi Lastiği/12 İnç Alüminyum Jant",
      "extraFeatures": [
        "Katlanır Ön Cam",
        "İki Noktalı Emniyet Kemeri",
        "Bluetooth Destekli 10 İnç Ekran",
        "Geri Görüş Kamerası",
        "Ses Sistemi",
        "Ön Sepet",
        "Ön Koruma Demiri"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi YT-A2.4+2 G, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "25 km/h"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "3760x1310x2074 mm"
      },
      {
        "label": "Batarya",
        "value": "48V - 150Ah"
      },
      {
        "label": "Motor Gücü",
        "value": "5000W"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240"
      },
      {
        "label": "Menzil",
        "value": "80-100 km"
      },
      {
        "label": "Maksimum Yükleme Ağırlığı",
        "value": "360 kg"
      },
      {
        "label": "Araç Net Ağırlığı",
        "value": "660 kg"
      },
      {
        "label": "Lastik/Jant",
        "value": "12 İnç Arazi Lastiği/12 İnç Alüminyum Jant"
      },
      {
        "label": "Ek Özellik",
        "value": "Katlanır Ön Cam, İki Noktalı Emniyet Kemeri, Bluetooth Destekli 10 İnç Ekran, Geri Görüş Kamerası, Ses Sistemi, Ön Sepet, Ön Koruma Demiri"
      }
    ]
  },
  {
    "id": "motolux-yt-a2-42",
    "slug": "motolux-yt-a2-42",
    "brand": "MotoLux",
    "model": "YT-A2.4+2",
    "tagline": "Resmî MotoLux YT-A2.4+2 Yetkili Satış Bayisi",
    "category": "GOLF BUGGY",
    "engineSize": "Elektrikli",
    "licenseType": "B veya A Sınıfı Ehliyet Uyumlu",
    "price": 230667,
    "originalPrice": 249100,
    "installmentText": "3-6-9-12 Taksit",
    "condition": "0 KM Sıfır",
    "featured": false,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/siyah-15.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-23.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-19.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-14.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/YT-A2.42.png"
    ],
    "colors": [
      {
        "name": "Mat Siyah",
        "hex": "#1F2120",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/siyah-15.png",
        "imageIndex": 0
      },
      {
        "name": "Koyu Kırmızı",
        "hex": "#E50E0E",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-23.png",
        "imageIndex": 1
      },
      {
        "name": "İnci Beyazı",
        "hex": "#FFFFFF",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-19.png",
        "imageIndex": 2
      },
      {
        "name": "Gece Mavisi",
        "hex": "#0E337D",
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-14.png",
        "imageIndex": 3
      }
    ],
    "specs": {
      "engineCapacity": "5000W",
      "maxPower": "5000W",
      "maxTorque": "Optimize Tork Çıkışı",
      "transmission": "OTOMATİK",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Ön Disk / Arka Disk (CBS)",
      "fuelTankOrBattery": "48V - 150Ah",
      "weight": "110 kg",
      "licenseRequirement": "Ehliyetsiz / B Sınıfı Uyumlu",
      "maxSpeed": "25 km/h",
      "inputVoltage": "220-240",
      "range": "80-100 km",
      "dimensions": "3685x1230x1905 mm",
      "tireSize": "12 İnç Lastik/12 İnç Alüminyum Jant",
      "extraFeatures": [
        "Katlanır Ön Cam",
        "İki Noktalı Emniyet Kemeri",
        "Bluetooth Destekli 10 İnç Ekran",
        "Geri Görüş Kamerası",
        "Ses Sistemi",
        "Ön Sepet",
        "Ön Koruma Demiri"
      ]
    },
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Alarmlı Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux üretimi YT-A2.4+2, üstün mühendislik kalitesi, düşük işletme maliyeti, modern tasarımı ve konforlu sürüş dinamikleriyle Fatih showroomumuzda 0 KM olarak satışta.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "25 km/h"
      },
      {
        "label": "Motor Gücü",
        "value": "5000W"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "3685x1230x1905 mm"
      },
      {
        "label": "Batarya",
        "value": "48V - 150Ah"
      },
      {
        "label": "Giriş Voltajı",
        "value": "220-240"
      },
      {
        "label": "Menzil",
        "value": "80-100 km"
      },
      {
        "label": "Maksimum Yükleme Ağırlığı",
        "value": "360 kg"
      },
      {
        "label": "Araç Net Ağırlığı",
        "value": "640 kg"
      },
      {
        "label": "Lastik/Jant",
        "value": "12 İnç Lastik/12 İnç Alüminyum Jant"
      },
      {
        "label": "Ek Özellik",
        "value": "Katlanır Ön Cam, İki Noktalı Emniyet Kemeri, Bluetooth Destekli 10 İnç Ekran, Geri Görüş Kamerası, Ses Sistemi, Ön Sepet, Ön Koruma Demiri"
      }
    ]
  },
  {
    "id": "motolux-f7",
    "slug": "motolux-f7",
    "brand": "MotoLux",
    "model": "F7",
    "tagline": "Resmî MotoLux F7 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "349 W",
    "licenseType": "Ehliyet ve Plaka Gerektirmez",
    "price": 28500,
    "originalPrice": 32000,
    "installmentText": "3-6-9-12 Taksit İmkanı",
    "condition": "0 KM Sıfır",
    "featured": true,
    "images": [
      "/motorcycles/cutouts/motolux-f7-0.png",
      "/motorcycles/cutouts/motolux-f7-1.png"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#dc2626"
      },
      {
        "name": "Gece Siyahı",
        "hex": "#0f172a"
      }
    ],
    "specs": {
      "engineCapacity": "349 W",
      "maxPower": "349 W (249 W Nominal)",
      "maxTorque": "Optimize Elektrikli Tork",
      "transmission": "Otomatik / Pedal Sensör Destekli",
      "cooling": "Hava / Doğal Soğutma",
      "brakes": "Ön Kampana / Arka Kampana",
      "fuelTankOrBattery": "48V 14Ah",
      "weight": "34 kg",
      "licenseRequirement": "Ehliyetsiz & Plakasız Kullanım",
      "maxSpeed": "25 km/s",
      "inputVoltage": "220-240 V",
      "maxLoadWeight": "125 kg",
      "range": "45-55 km",
      "chargingTime": "6-8 Saat",
      "dimensions": "1550x630x1050 mm",
      "tireSize": "16x2.50 Tubeless",
      "extraFeatures": [
        "LED Far ve Stop Lambası",
        "Geniş Ön Eşya Sepeti",
        "Pedal Sensör Destek Sistemi",
        "Konforlu Yolcu Sırt Dayama Koltuğu",
        "Geniş LCD Hız & Batarya Göstergesi"
      ]
    },
    "features": [
      "Ehliyet, Ruhsat ve Plaka Gerektirmeyen Çevre Dostu Kullanım",
      "48V 14Ah Yüksek Verimli Batarya ile 55 km'ye Varan Menzil",
      "Pedal Sensör Desteği ile İster Elektrikli İster Pedallı Sürüş",
      "Geniş Ön Taşıma Sepeti ve Yolcu Sırt Dayama Minderi",
      "Tüm Kredi Kartlarına Peşin Fiyatına Taksit Seçenekleri",
      "Paşa Motor Fatih Yetkili Servis Güvencesi ve Orijinal Yedek Parça Desteği"
    ],
    "giftPackage": [
      "1 Adet ECE Onaylı Kask",
      "1 Adet Çelik Halat / Disk Kilidi",
      "1 Adet Su Geçirmez Motosiklet Brandası",
      "İlk Rodaj Bakımında Ücretsiz İşçilik Çeki"
    ],
    "description": "Resmî MotoLux F7, şehir içi kısa ve orta mesafe ulaşımlarda ehliyet ve plaka zorunluluğu olmadan ekonomik, pratik ve çevreci bir sürüş sunar. Güçlü 349W motoru, 48V 14Ah dayanıklı aküsü ve ergonomik sepetiyle günlük kullanımınızın en büyük yardımcısı.",
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "technicalSpecs": [
      {
        "label": "Motor Gücü",
        "value": "349 W (249 W Nominal)"
      },
      {
        "label": "Akü Voltajı",
        "value": "48 V"
      },
      {
        "label": "Akü Kapasitesi",
        "value": "14 Ah"
      },
      {
        "label": "Azami Hız",
        "value": "25 km/s"
      },
      {
        "label": "Menzil",
        "value": "45 - 55 km"
      },
      {
        "label": "Şarj Süresi",
        "value": "6 - 8 Saat"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "34 kg"
      },
      {
        "label": "Taşıma Kapasitesi",
        "value": "125 kg"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Kampana / Kampana"
      },
      {
        "label": "Tekerlek Ölçüsü",
        "value": "16x2.50 Tubeless"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1550x630x1050 mm"
      },
      {
        "label": "Ekstra Özellikler",
        "value": "LED Stop, Ön Sepet, Pedal Sensörü, Sırt Dayama"
      }
    ]
  }
];
