export interface MotorcycleColor {
  name: string;
  hex: string;
  imageIndex?: number;
  imageUrl?: string;
}

export interface MotorcycleSpecs {
  engineCapacity?: string;
  maxPower?: string;
  maxTorque?: string;
  maxSpeed?: string;
  fuelConsumption?: string;
  fuelTankOrBattery?: string;
  brakes?: string;
  weight?: string;
  dimensions?: string;
  transmission?: string;
  cooling?: string;
  tireSize?: string;
  frontTire?: string;
  rearTire?: string;
  rangeKm?: string;
  chargingTime?: string;
  frontSuspension?: string;
  rearSuspension?: string;
  maxLoadWeight?: string;
  batteryCapacity?: string;
  voltage?: string;
}

export interface SpecItem {
  label: string;
  value: string;
}

export interface Motorcycle {
  id: string;
  slug: string;
  brand: string;
  model: string;
  tagline: string;
  category: string;
  engineSize: string;
  licenseType: string;
  price: number;
  cashPrice?: number;
  installment6Price?: number;
  installment12Price?: number;
  originalPrice?: number;
  featured?: boolean;
  images: string[];
  colors: MotorcycleColor[];
  specs: MotorcycleSpecs;
  features: string[];
  warranty: string;
  condition: string;
  description: string;
  technicalSpecs?: SpecItem[];
  giftPackage?: string[];
  installmentText?: string;
}

export const MOTORCYCLES: Motorcycle[] = [
  {
    "id": "motolux-wow-01",
    "slug": "motolux-wow-01",
    "brand": "MotoLux",
    "model": "WOW-01",
    "tagline": "Resmî MotoLux WOW-01 Yetkili Satış Bayisi",
    "category": "E-CAR",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/04/sdsds-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-4.png",
      "https://motolux.com.tr/wp-content/uploads/2026/04/Asset-11.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#ffffff",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-1.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#9fc9b3",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-2.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#b6b6d2",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/04/wow01-4.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#ff0000",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/04/Asset-11.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "5 kw",
      "maxTorque": "",
      "maxSpeed": "55-60 km/h",
      "transmission": "Otomatik",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "76V-52Ah(Lityum) - 76V100Ah(Lityum)",
      "dimensions": "2752x1292x1647 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "125/65-12’’ - 125/65-12 ‘’",
      "licenseRequirement": "",
      "extraFeatures": [
        "4 Cam Otomatik, Dijital Gösterge, Geri Görüş Kamerası, Sac Gövde, Sunroof"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi WOW-01, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-cortado-200-off",
    "slug": "motolux-cortado-200-off",
    "brand": "MotoLux",
    "model": "CORTADO 200-OFF",
    "tagline": "Resmî MotoLux CORTADO 200-OFF Yetkili Satış Bayisi",
    "category": "ENDURO / CROSS",
    "engineSize": "200 cc",
    "licenseType": "B / A1 / A2 Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/11/WEB-ONIZLEME-50-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/CORTADO-200_3@2000x-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/CORTADO-200_2@2000x-8.png"
    ],
    "colors": [
      {
        "name": "Siyah",
        "hex": "#000000",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/CORTADO-200_3@2000x-8.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#F40000",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/CORTADO-200_2@2000x-8.png"
      }
    ],
    "specs": {
      "engineCapacity": "200 cc",
      "maxPower": "15,4 HP",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "6 Vites",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (ABS)",
      "fuelTankOrBattery": "12V6.5 AH",
      "dimensions": "2090x935x1335 mm",
      "weight": "145 kg",
      "maxLoadWeight": "295 KG",
      "tireSize": "90/100-21-110/100-18",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi CORTADO 200-OFF, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-cappadocia125",
    "slug": "motolux-cappadocia125",
    "brand": "MotoLux",
    "model": "CAPPADOCIA 125",
    "tagline": "Resmî MotoLux CAPPADOCIA 125 Yetkili Satış Bayisi",
    "category": "CHOPPER",
    "engineSize": "125",
    "licenseType": "B Sınıfı (125cc Yasası) / A1 / A2",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/10/WEB-ONIZLEME-1.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_4-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_1.png"
    ],
    "colors": [
      {
        "name": "Açık Gri / Gümüş",
        "hex": "#F4ECDC",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_2.png"
      },
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_4-1.png"
      },
      {
        "name": "Siyah",
        "hex": "#000000",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125-1.png"
      },
      {
        "name": "Askeri Yeşil",
        "hex": "#2D4A4C",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_3.png"
      },
      {
        "name": "Sarı / Altın",
        "hex": "#FF9700",
        "imageIndex": 5,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Cappadocia-125_1.png"
      }
    ],
    "specs": {
      "engineCapacity": "125",
      "maxPower": "8 HP @ 7750 rpm",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (ABS)",
      "fuelTankOrBattery": "12V-3Ah",
      "dimensions": "2116 x 800 x 1140 mm",
      "weight": "116 kg",
      "maxLoadWeight": "266",
      "tireSize": "80/90-17 Dublex - 140/70-13 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
    "technicalSpecs": [
      {
        "label": "Motor Hacmi",
        "value": "125"
      },
      {
        "label": "Motor Tipi",
        "value": "Tek silindir 4 zamanlı"
      },
      {
        "label": "Maksimum Güç",
        "value": "8 HP @ 7750 rpm"
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
        "value": "6 L"
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
        "value": "2116 x 800 x 1140 mm"
      },
      {
        "label": "Batarya",
        "value": "12V-3Ah"
      },
      {
        "label": "Yüksüz Ağırlık",
        "value": "116 kg"
      },
      {
        "label": "Azami Yüklü Kütle",
        "value": "266"
      },
      {
        "label": "Frenler Ön/Arka",
        "value": "Disk/Disk (ABS)"
      },
      {
        "label": "Tekerlek Ölçüsü Ön/Arka",
        "value": "80/90-17 Dublex - 140/70-13 Dublex"
      }
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi CAPPADOCIA 125, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-ceo-110",
    "slug": "motolux-ceo-110",
    "brand": "MotoLux",
    "model": "CEO 110",
    "tagline": "Resmî MotoLux CEO 110 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "109 cc",
    "licenseType": "B Sınıfı (125cc Yasası) / A1 / A2",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/05/CEO-110-84-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-GRI.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-BEYAZ.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-KIRMIZI.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-MAVI.png"
    ],
    "colors": [
      {
        "name": "Gri / Titanyum",
        "hex": "#898989",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-GRI.png"
      },
      {
        "name": "Beyaz",
        "hex": "#fff",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-BEYAZ.png"
      },
      {
        "name": "Karamel Kahve",
        "hex": "#62232e",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-KIRMIZI.png"
      },
      {
        "name": "Okyanus Mavisi",
        "hex": "#0A72EA",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/CEO-110-MAVI.png"
      }
    ],
    "specs": {
      "engineCapacity": "109 cc",
      "maxPower": "8000 d/d 8,8 hp",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-7Ah",
      "dimensions": "1820x665x1110 mm",
      "weight": "101 kg",
      "maxLoadWeight": "251 kg",
      "tireSize": "90/90-12 Dublex 3.50-10 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi CEO 110, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-americano-125",
    "slug": "motolux-americano-125",
    "brand": "MotoLux",
    "model": "AMERICANO 125",
    "tagline": "Resmî MotoLux AMERICANO 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125 cc",
    "licenseType": "B Sınıfı (125cc Yasası) / A1 / A2",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/08/WEB-ONIZLEME-09-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_2.png"
    ],
    "colors": [
      {
        "name": "Orman Yeşili",
        "hex": "#0A4407",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_3.png"
      },
      {
        "name": "Gri / Titanyum",
        "hex": "#898989",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125.png"
      },
      {
        "name": "Kahverengi / Bronz",
        "hex": "#6B2E00",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_1.png"
      },
      {
        "name": "Turkuaz / Buz Mavisi",
        "hex": "#7FEEF4",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Americano-125_2.png"
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "8,50 HP @ 7500 rpm",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-6Ah",
      "dimensions": "1920x670x1135 mm",
      "weight": "114 kg",
      "maxLoadWeight": "",
      "tireSize": "120/70-12 Tubeless - 120/70-12 Tubeless",
      "licenseRequirement": "",
      "extraFeatures": [
        "Navigasyon, Dijital Gösterge Paneli (TFT Ekran), Anahtarsız Çalıştırma"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi AMERICANO 125, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-ceo-125",
    "slug": "motolux-ceo-125",
    "brand": "MotoLux",
    "model": "CEO 125",
    "tagline": "Resmî MotoLux CEO 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "118.8 cc",
    "licenseType": "B Sınıfı (125cc Yasası) / A1 / A2",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/05/CEO-110-VE-125-19-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125_1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125_2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#939089",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125_1.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#e80000",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125_2.png"
      },
      {
        "name": "Beyaz",
        "hex": "#fff",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/ceo125.png"
      }
    ],
    "specs": {
      "engineCapacity": "118.8 cc",
      "maxPower": "7500 d/d (9,2 hp)",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (Kombine)",
      "fuelTankOrBattery": "12V-7Ah",
      "dimensions": "1870x642x1105 mm",
      "weight": "96 kg",
      "maxLoadWeight": "246 kg",
      "tireSize": "90/90-12 Tubeless 3.50-10 Tubeless",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi CEO 125, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-macchiato-125",
    "slug": "motolux-macchiato-125",
    "brand": "MotoLux",
    "model": "MACCHIATO 125",
    "tagline": "Resmî MotoLux MACCHIATO 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125 cc",
    "licenseType": "B Sınıfı (125cc Yasası) / A1 / A2",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/03/AMERICANO-125-54-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-54-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-52.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-53.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-55.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-56.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/MACCHIATO-125-5.png"
    ],
    "colors": [
      {
        "name": "Nardo Gri",
        "hex": "#66806f",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-54-scaled.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#2b3447",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-52.png"
      },
      {
        "name": "Nardo Gri",
        "hex": "#7588a1",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-53.png"
      },
      {
        "name": "Siyah",
        "hex": "#040607",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-55.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#af0816",
        "imageIndex": 5,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-20-56.png"
      },
      {
        "name": "Açık Gri / Gümüş",
        "hex": "#e6ddc7",
        "imageIndex": 6,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/MACCHIATO-125-5.png"
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "7500 rpm (9.2 hp)",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-7Ah",
      "dimensions": "1890x670x1140 mm",
      "weight": "114 kg",
      "maxLoadWeight": "264 kg",
      "tireSize": "120/70-12 Dublex 120/70-12 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi MACCHIATO 125, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-ist-34",
    "slug": "motolux-ist-34",
    "brand": "MotoLux",
    "model": "IST 34",
    "tagline": "Resmî MotoLux IST 34 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125 cc",
    "licenseType": "B Sınıfı (125cc Yasası) / A1 / A2",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-60-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-BEYAZ.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-SARI.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-MAVI.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-BEYAZ.png"
      },
      {
        "name": "Sarı",
        "hex": "#ffff00",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-SARI.png"
      },
      {
        "name": "Turkuaz Mavisi",
        "hex": "#30D5C8",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/IST-34-MAVI.png"
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "11,2 HP @ 8000 rpm",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Sıvı Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "12V-9Ah",
      "dimensions": "1975x750x1150 mm",
      "weight": "126 kg",
      "maxLoadWeight": "",
      "tireSize": "100/80-14″-120/70-14 ″",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi IST 34, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-mcx-125",
    "slug": "motolux-mcx-125",
    "brand": "MotoLux",
    "model": "MCX 125",
    "tagline": "Resmî MotoLux MCX 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125 cc",
    "licenseType": "B Sınıfı (125cc Yasası) / A1 / A2",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/07/MCX-125-32-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-34-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-33.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-35.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-32.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#8D8B88",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-34-scaled.png"
      },
      {
        "name": "Siyah",
        "hex": "#000000",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-33.png"
      },
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-35.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#55503A",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/MCX-125-32.png"
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "8500d/d 12 hp",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Sıvı Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-7Ah",
      "dimensions": "1965x730x1180 mm",
      "weight": "138kg",
      "maxLoadWeight": "",
      "tireSize": "110/80-14 Dublex - 120/70-14 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Navigasyon, Alarm, Dijital Gösterge Paneli (TFT Ekran), Kamera"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi MCX 125, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-mw-46",
    "slug": "motolux-mw-46",
    "brand": "MotoLux",
    "model": "MW46",
    "tagline": "Resmî MotoLux MW46 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125 cc",
    "licenseType": "B Sınıfı (125cc Yasası) / A1 / A2",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/03/WEB-ONIZLEME-15-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/05/MW46_2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/MW46_1-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/MW46-1.png"
    ],
    "colors": [
      {
        "name": "Sarı / Altın",
        "hex": "#FFED00",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/MW46_2.png"
      },
      {
        "name": "Turuncu",
        "hex": "#EF7D00",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/MW46_1-1.png"
      },
      {
        "name": "Okyanus Mavisi",
        "hex": "#009BAC",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/MW46-1.png"
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "7500 rpm (8,5 hp)",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-7Ah",
      "dimensions": "1960x675x1100 mm",
      "weight": "105 kg",
      "maxLoadWeight": "265 kg",
      "tireSize": "90/90-14 Dublex 100/80-14 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi MW46, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-nirvana-pro",
    "slug": "motolux-nirvana-pro",
    "brand": "MotoLux",
    "model": "NIRVANA PRO",
    "tagline": "Resmî MotoLux NIRVANA PRO Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "50 cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (Sigortadan Muaf)",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/03/NIRVANA-PRO-32-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-3.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-2.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#464646",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-1.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#FF0000",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/nIRVANA-PRO-3.png"
      }
    ],
    "specs": {
      "engineCapacity": "50 cc",
      "maxPower": "8000 d/d (3,5 hp)",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-7 Ah",
      "dimensions": "1870x695x1110 mm",
      "weight": "90 kg",
      "maxLoadWeight": "240 kg",
      "tireSize": "110/60-12 110/60-12 Tubeless",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi NIRVANA PRO, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-ragner-rt2",
    "slug": "motolux-ragner-rt2",
    "brand": "MotoLux",
    "model": "RAGNER RT2",
    "tagline": "Resmî MotoLux RAGNER RT2 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "250 cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (Sigortadan Muaf)",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/RT-2-13-13-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/05/RT-2-13-12-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/RT-2-13-2-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/Asset-4.png"
    ],
    "colors": [
      {
        "name": "Mat Gri",
        "hex": "#BB9F75",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/RT-2-13-12-scaled.png"
      },
      {
        "name": "Sarı / Altın",
        "hex": "#FEEB18",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/RT-2-13-2-scaled.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#656564",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/Asset-4.png"
      }
    ],
    "specs": {
      "engineCapacity": "250 cc",
      "maxPower": "7500 rpm 17 kW (23.12 hp)",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Sıvı Soğutma",
      "brakes": "Disk/Disk (ABS) (TCS)",
      "fuelTankOrBattery": "12V-11Ah",
      "dimensions": "2080 x 785 x 1345",
      "weight": "183 kg",
      "maxLoadWeight": "",
      "tireSize": "110/80-14 Dublex - 140/60-13 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Navigasyon, Alarm, Dijital Gösterge Paneli (TFT Ekran), ABS Fren Sistemi."
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi RAGNER RT2, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-rossirs-50",
    "slug": "motolux-rossirs-50",
    "brand": "MotoLux",
    "model": "ROSSI RS 50",
    "tagline": "Resmî MotoLux ROSSI RS 50 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "49.6 cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (Sigortadan Muaf)",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/05/ROSSI-RS-125-42-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-51.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-49.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-50.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#fff",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-51.png"
      },
      {
        "name": "Siyah",
        "hex": "#0F0F0F",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-49.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#D20017",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-50-50.png"
      }
    ],
    "specs": {
      "engineCapacity": "49.6 cc",
      "maxPower": "8000 d/d 3,5 hp",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-7Ah",
      "dimensions": "1940x685x1110 mm",
      "weight": "90 kg",
      "maxLoadWeight": "240 kg",
      "tireSize": "120/70-12 Dublex 120/70-12 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Anahtarsız Çalıştırma"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi ROSSI RS 50, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-rossi-fx-50-2",
    "slug": "motolux-rossi-fx-50-2",
    "brand": "MotoLux",
    "model": "ROSSI FX 50",
    "tagline": "Resmî MotoLux ROSSI FX 50 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "49.6 cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (Sigortadan Muaf)",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/09/Artboard-13.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-59@2000x-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-57@2000x-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-58@2000x-8.png"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#E30613",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-59@2000x-8.png"
      },
      {
        "name": "Siyah",
        "hex": "#1D1D1B",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-57@2000x-8.png"
      },
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-58@2000x-8.png"
      }
    ],
    "specs": {
      "engineCapacity": "49.6 cc",
      "maxPower": "8000 d/d 3,5 hp",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-7Ah",
      "dimensions": "1830x670x1075",
      "weight": "90 kg",
      "maxLoadWeight": "240 kg",
      "tireSize": "3.50-10 -3.50-10 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi ROSSI FX 50, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-rossi-rs-125",
    "slug": "motolux-rossi-rs-125",
    "brand": "MotoLux",
    "model": "ROSSI RS 125",
    "tagline": "Resmî MotoLux ROSSI RS 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "124.6 cc",
    "licenseType": "B Sınıfı (125cc Yasası) / A1 / A2",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/03/ROSSI-RS-125-40-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-40-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-41-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-42-1-scaled.png"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#C80016",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-40-1.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#252828",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-41-1.png"
      },
      {
        "name": "Beyaz",
        "hex": "#fff",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ROSSI-RS-125-42-1-scaled.png"
      }
    ],
    "specs": {
      "engineCapacity": "124.6 cc",
      "maxPower": "7500 d/d 8,5 hp",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "12V-7Ah",
      "dimensions": "1900x680x1220 mm",
      "weight": "109 kg",
      "maxLoadWeight": "259 kg",
      "tireSize": "120/70-12 Dublex 120/70-12 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Anahtarsız Çalıştırma"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi ROSSI RS 125, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-sst-125",
    "slug": "motolux-sst-125",
    "brand": "MotoLux",
    "model": "SST 125",
    "tagline": "Resmî MotoLux SST 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125 cc",
    "licenseType": "B Sınıfı (125cc Yasası) / A1 / A2",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/06/Artboard-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-63@2000x-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-61@2000x-8-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8-2.png"
    ],
    "colors": [
      {
        "name": "Turkuaz Mavisi",
        "hex": "#06DDF9",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-63@2000x-8.png"
      },
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8-1.png"
      },
      {
        "name": "Siyah",
        "hex": "#000000",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-61@2000x-8-1.png"
      },
      {
        "name": "Sarı / Altın",
        "hex": "#FFCE00",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8-2.png"
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "11,3 HP @ 8000 rpm",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Sıvı Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-11,2Ah",
      "dimensions": "1890x775x1230 mm",
      "weight": "142 kg",
      "maxLoadWeight": "",
      "tireSize": "110/80-14 Dublex- 120/70-12 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Navigasyon, Dijital Gösterge Paneli (TFT Ekran), Anahtarsız Çalıştırma"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi SST 125, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-drift-200",
    "slug": "motolux-drift-200",
    "brand": "MotoLux",
    "model": "DRIFT 200",
    "tagline": "Resmî MotoLux DRIFT 200 Yetkili Satış Bayisi",
    "category": "TOURING",
    "engineSize": "199.5cc",
    "licenseType": "B / A1 / A2 Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/05/WEB-ONIZLEME-46-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-1-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-3.png"
    ],
    "colors": [
      {
        "name": "Turkuaz Mavisi",
        "hex": "#02B2DF",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-1-1.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#BF1818",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-2.png"
      },
      {
        "name": "Sarı / Altın",
        "hex": "#F4CF31",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/drift200-3.png"
      }
    ],
    "specs": {
      "engineCapacity": "199.5cc",
      "maxPower": "15.7 HP",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "6 İleri",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (ABS)",
      "fuelTankOrBattery": "12V-7Ah",
      "dimensions": "2005x830x1060",
      "weight": "132 kg",
      "maxLoadWeight": "282 Kg",
      "tireSize": "80/90-12 Dublex / 130/70-17 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi DRIFT 200, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-wow-150",
    "slug": "motolux-wow-150",
    "brand": "MotoLux",
    "model": "WOW 150",
    "tagline": "Resmî MotoLux WOW 150 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "150 cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (Sigortadan Muaf)",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/03/WOW-150-33-32-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-34.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-32-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-33.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-35-scaled.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#6A6A6A",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-34.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#A40321",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-32-scaled.png"
      },
      {
        "name": "Okyanus Mavisi",
        "hex": "#4F95D1",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WEB-ONIZLEME-33.png"
      },
      {
        "name": "Askeri Yeşil",
        "hex": "#31523E",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/WOW-150-35-scaled.png"
      }
    ],
    "specs": {
      "engineCapacity": "150 cc",
      "maxPower": "10,5Kw (14,28 hp)",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Sıvı Soğutma",
      "brakes": "Disk/Disk (ABS)",
      "fuelTankOrBattery": "12V-9Ah",
      "dimensions": "1950x725x1190 mm",
      "weight": "138 kg",
      "maxLoadWeight": "288 kg",
      "tireSize": "110/80-14 Dublex 130/70-13 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi WOW 150, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-vintage-s",
    "slug": "motolux-vintage-s",
    "brand": "MotoLux",
    "model": "VINTAGE S",
    "tagline": "Resmî MotoLux VINTAGE S Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "49,4 cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (Sigortadan Muaf)",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/11/VINTAGE-S-SARI-39-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-36-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-37.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-38.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-39.png"
    ],
    "colors": [
      {
        "name": "Turkuaz",
        "hex": "#88CAB8",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-36-scaled.png"
      },
      {
        "name": "Gri / Titanyum",
        "hex": "#898989",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-37.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#E2BDBA",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-38.png"
      },
      {
        "name": "Altın Sarısı",
        "hex": "#D1C858",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VINTAGE-S-39.png"
      }
    ],
    "specs": {
      "engineCapacity": "49,4 cc",
      "maxPower": "3,5 HP @ 8000 rpm",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Drum",
      "fuelTankOrBattery": "12V-7 Ah",
      "dimensions": "1758X690X1073 mm",
      "weight": "101 kg",
      "maxLoadWeight": "",
      "tireSize": "3.50-10-3.50-10",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi VINTAGE S, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-vegas125",
    "slug": "motolux-vegas125",
    "brand": "MotoLux",
    "model": "VEGAS 125",
    "tagline": "Resmî MotoLux VEGAS 125 Yetkili Satış Bayisi",
    "category": "SCOOTER",
    "engineSize": "125 cc",
    "licenseType": "B Sınıfı (125cc Yasası) / A1 / A2",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/09/WEB-ONIZLEME-45-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-45.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-43.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-44-scaled.png"
    ],
    "colors": [
      {
        "name": "Orman Yeşili",
        "hex": "#0A4407",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-45.png"
      },
      {
        "name": "Gri / Titanyum",
        "hex": "#898989",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-43.png"
      },
      {
        "name": "Mavi",
        "hex": "#0804A0",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/VEGAS-125-44-scaled.png"
      }
    ],
    "specs": {
      "engineCapacity": "125 cc",
      "maxPower": "9,52 HP @ 7500 rpm",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "Otomatik",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "12V-7Ah",
      "dimensions": "2000x780x1225 mm",
      "weight": "140 kg",
      "maxLoadWeight": "320 kg",
      "tireSize": "120/70-13-130/70-13 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Navigasyon, Dijital Gösterge Paneli (TFT Ekran), Anahtarsız Çalıştırma"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi VEGAS 125, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-mz46-a",
    "slug": "motolux-mz46-a",
    "brand": "MotoLux",
    "model": "MZ46-A",
    "tagline": "Resmî MotoLux MZ46-A Yetkili Satış Bayisi",
    "category": "TOURING",
    "engineSize": "49,4 cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (Sigortadan Muaf)",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/03/WEB-ONIZLEME.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-3.png"
    ],
    "colors": [
      {
        "name": "Şeker Pembe",
        "hex": "C75D86",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-2.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#bf0000",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-1.png"
      },
      {
        "name": "Siyah",
        "hex": "#090A0B",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/MZ46A-3.png"
      }
    ],
    "specs": {
      "engineCapacity": "49,4 cc",
      "maxPower": "3,5 hp",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "5 Vites",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-9Ah",
      "dimensions": "1954 x 700 x1141mm",
      "weight": "106 kg",
      "maxLoadWeight": "256 kg",
      "tireSize": "2.50-18 Dublex / 2.75-18 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi MZ46-A, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-eceo",
    "slug": "motolux-eceo",
    "brand": "MotoLux",
    "model": "E-CEO",
    "tagline": "Resmî MotoLux E-CEO Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/03/E-CEO-61-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-KAHVERENGI-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-KIRMIZI-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-MAVI.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#8b887f",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-KAHVERENGI-scaled.png"
      },
      {
        "name": "Metalik Bordo",
        "hex": "#920417",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-KIRMIZI-scaled.png"
      },
      {
        "name": "Titanyum Füme",
        "hex": "#496389",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/E-CEO-MAVI.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1200 W",
      "maxTorque": "",
      "maxSpeed": "45 km/h",
      "transmission": "otomatik",
      "cooling": "",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "72V - 20Ah",
      "dimensions": "2010x740x1130 mm",
      "weight": "69 kg",
      "maxLoadWeight": "257 kg",
      "tireSize": "90/80-12 Dublex 90/90-10 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Led Far, Led Sinyal, Usb Şarj, Port Bagaj, Dijital Gösterge"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi E-CEO, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-mz46-t",
    "slug": "motolux-mz46-t",
    "brand": "MotoLux",
    "model": "MZ46-T",
    "tagline": "Resmî MotoLux MZ46-T Yetkili Satış Bayisi",
    "category": "TOURING",
    "engineSize": "49.4cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (Sigortadan Muaf)",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/03/MZ-46-T-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-2.png"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "FF0A26",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-1.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#bf0000",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-3.png"
      },
      {
        "name": "Siyah",
        "hex": "#111318",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/mz-46-t-2.png"
      }
    ],
    "specs": {
      "engineCapacity": "49.4cc",
      "maxPower": "3,5 Hp",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "5 Vites",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-9Ah",
      "dimensions": "1954x700x1141 mm",
      "weight": "106 kg",
      "maxLoadWeight": "256 kg",
      "tireSize": "2.50-18 Dublex / 2.75-18 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi MZ46-T, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-alf-pro",
    "slug": "motolux-alf-pro",
    "brand": "MotoLux",
    "model": "ALF PRO",
    "tagline": "Resmî MotoLux ALF PRO Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/04/WEB-ONIZLEME.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro_2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro_1.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro_2.png"
      },
      {
        "name": "MotoLux Kırmızı",
        "hex": "#F72259",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#7F7F7F",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/alf-pro_1.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1500W",
      "maxTorque": "",
      "maxSpeed": "45 km/h",
      "transmission": "OTOMATİK",
      "cooling": "",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "72V-20Ah",
      "dimensions": "2002x698x1148mm",
      "weight": "66 kg",
      "maxLoadWeight": "255 kg",
      "tireSize": "90/90/12 - 3.50-10 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Led Far, Led Sinyal, Usb Şarj, Port Bagaj, Dijital Gösterge, Nfc Kart"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi ALF PRO, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-alf-plus",
    "slug": "motolux-alf-plus",
    "brand": "MotoLux",
    "model": "ALF PLUS",
    "tagline": "Resmî MotoLux ALF PLUS Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/03/ALF-PLUS-64-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-64.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-65.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-BIRAZ-DAHA-GRI-66.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/alf-plus-koruma-demir-66.png"
    ],
    "colors": [
      {
        "name": "Gri",
        "hex": "#808080",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-64.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#FE284E",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-65.png"
      },
      {
        "name": "Beyaz",
        "hex": "#EFEFEF",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/ALF-PLUS-BIRAZ-DAHA-GRI-66.png"
      },
      {
        "name": "Gri",
        "hex": "#808080",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/alf-plus-koruma-demir-66.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1500 W",
      "maxTorque": "",
      "maxSpeed": "45 km/h",
      "transmission": "otomatik",
      "cooling": "",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "60V-20Ah",
      "dimensions": "1835x690x1110 mm",
      "weight": "63 kg",
      "maxLoadWeight": "254 kg",
      "tireSize": "3.00-10 Dublex 3.00-10 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Dijital Gösterge"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi ALF PLUS, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-go-55-dubai",
    "slug": "motolux-go-55-dubai",
    "brand": "MotoLux",
    "model": "GO 55 Dubai",
    "tagline": "Resmî MotoLux GO 55 Dubai Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/11/101-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-73.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-72.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-74.png"
    ],
    "colors": [
      {
        "name": "Turkuaz",
        "hex": "#E5C1C6",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-73.png"
      },
      {
        "name": "Beyaz",
        "hex": "#DEDEDE",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-72.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#616161",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-74.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "249 W",
      "maxTorque": "",
      "maxSpeed": "25 km/h",
      "transmission": "Otomatik",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "48V - 20Ah",
      "dimensions": "1640x700x995 mm",
      "weight": "52 kg",
      "maxLoadWeight": "246 kg",
      "tireSize": "3.00-10 - 3.00-10",
      "licenseRequirement": "",
      "extraFeatures": [
        "Led Far, Usb Port, Dijital Gösterge, Sırtlık, Park Ayağı, Ön Sepet"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi GO 55 Dubai, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-e-vintage",
    "slug": "motolux-e-vintage",
    "brand": "MotoLux",
    "model": "E-VINTAGE",
    "tagline": "Resmî MotoLux E-VINTAGE Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/10/web-onizleme-Recovered.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/10/w.png",
      "https://motolux.com.tr/wp-content/uploads/2024/10/e.png",
      "https://motolux.com.tr/wp-content/uploads/2024/10/q.png",
      "https://motolux.com.tr/wp-content/uploads/2024/10/r.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#8D8B88",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/10/w.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#E6EFAB",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/10/e.png"
      },
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/10/q.png"
      },
      {
        "name": "Açık Gri / Gümüş",
        "hex": "#E4CCC6",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/10/r.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "2kw",
      "maxTorque": "",
      "maxSpeed": "45 km/h",
      "transmission": "2 vites",
      "cooling": "",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "72V 20 Ah",
      "dimensions": "1780x690x1105 mm",
      "weight": "63 kg",
      "maxLoadWeight": "260 kg",
      "tireSize": "3.00-10 - 3.00-10",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi E-VINTAGE, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-gogo",
    "slug": "motolux-gogo",
    "brand": "MotoLux",
    "model": "GOGO49",
    "tagline": "Resmî MotoLux GOGO49 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/05/GOGO-57-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-61@2000x-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8.png"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#e30613",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-61@2000x-8.png"
      },
      {
        "name": "Mat Siyah",
        "hex": "#1A253E",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/Asset-60@2000x-8.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "249W",
      "maxTorque": "",
      "maxSpeed": "41 km/h",
      "transmission": "2 Vites",
      "cooling": "",
      "brakes": "Kampana/Kampana",
      "fuelTankOrBattery": "48V - 20Ah",
      "dimensions": "1490x650x1080 mm",
      "weight": "40 kg",
      "maxLoadWeight": "219 kg",
      "tireSize": "60/100-10 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "NFC Kart, Led Far, Usb Port, Dijital Gösterge, Sırtlık, Park Ayağı, Ön Sepet"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi GOGO49, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-valencia",
    "slug": "motolux-valencia",
    "brand": "MotoLux",
    "model": "LIZBON",
    "tagline": "Resmî MotoLux LIZBON Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/09/VALENCIA--scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon_3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/09/VALENCIA-KAHVERENGI.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon_2.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon.png"
      },
      {
        "name": "Turkuaz Mavisi",
        "hex": "#30D5C8",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon_3.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#ECD8B1",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/09/VALENCIA-KAHVERENGI.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#ff0000",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/lizbon_2.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "249W",
      "maxTorque": "",
      "maxSpeed": "42 km/h",
      "transmission": "3 İleri - 1 Geri",
      "cooling": "",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "48V-20Ah",
      "dimensions": "1756x678x1127 mm",
      "weight": "45 kg",
      "maxLoadWeight": "219 kg",
      "tireSize": "2.75-10 - 2.75-10 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Dijital Gösterge Paneli, USB Şarj, NFC Kart, Alarm, Led Far"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi LIZBON, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-latte",
    "slug": "motolux-latte",
    "brand": "MotoLux",
    "model": "LATTE",
    "tagline": "Resmî MotoLux LATTE Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/09/Artboard-20.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/09/Untitled-3.png",
      "https://motolux.com.tr/wp-content/uploads/2024/09/2-1.png",
      "https://motolux.com.tr/wp-content/uploads/2024/09/GHHH.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/09/Untitled-3.png"
      },
      {
        "name": "Okyanus Mavisi",
        "hex": "#0098FF",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/09/2-1.png"
      },
      {
        "name": "Siyah",
        "hex": "#101E03",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/09/GHHH.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1500W",
      "maxTorque": "",
      "maxSpeed": "45 km/h",
      "transmission": "3 Vites",
      "cooling": "",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "72V - 20Ah",
      "dimensions": "1905x680x1150 mm",
      "weight": "74 kg",
      "maxLoadWeight": "260 kg",
      "tireSize": "90/90-12 - 90/90-12 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Led Far, Alarm, Hız sabitleyici, Dijital Gösterge, Park Ayağı"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi LATTE, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-m111",
    "slug": "motolux-m111",
    "brand": "MotoLux",
    "model": "M111",
    "tagline": "Resmî MotoLux M111 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/09/M111-70-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/M111-BEYAZ-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/M111-GRI.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/M111-SIYAH.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/M111-BEYAZ-scaled.png"
      },
      {
        "name": "Gri / Titanyum",
        "hex": "#898989",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/M111-GRI.png"
      },
      {
        "name": "Siyah",
        "hex": "#1D1D1B",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/M111-SIYAH.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "2000 W",
      "maxTorque": "",
      "maxSpeed": "45 km/h",
      "transmission": "2 vites",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72V-24 Ah",
      "dimensions": "2020x760x1140 mm",
      "weight": "75 kg",
      "maxLoadWeight": "290 kg",
      "tireSize": "90/90-12- 90/90-12",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi M111, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-mtx01",
    "slug": "motolux-mtx01",
    "brand": "MotoLux",
    "model": "MTX 01",
    "tagline": "Resmî MotoLux MTX 01 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/08/Untitled-1.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/08/mtx-01-.png"
    ],
    "colors": [
      {
        "name": "Siyah",
        "hex": "#000000",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/08/mtx-01-.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "249 W",
      "maxTorque": "",
      "maxSpeed": "25 km/h",
      "transmission": "3 İleri",
      "cooling": "",
      "brakes": "Kampana/Kampana",
      "fuelTankOrBattery": "48V20Ah",
      "dimensions": "1642x653x1077 mm",
      "weight": "34 kg",
      "maxLoadWeight": "213 kg",
      "tireSize": "2.5-12",
      "licenseRequirement": "",
      "extraFeatures": [
        "Dijital Gösterge"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi MTX 01, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-pitton-9000",
    "slug": "motolux-pitton-9000",
    "brand": "MotoLux",
    "model": "PITTON 9000",
    "tagline": "Resmî MotoLux PITTON 9000 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/12/Pitton-9000.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/12/Asset-75-8.png",
      "https://motolux.com.tr/wp-content/uploads/2025/12/Asset-76-8.png"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#CD131B",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/12/Asset-75-8.png"
      },
      {
        "name": "Beyaz",
        "hex": "#FFFFFF",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/12/Asset-76-8.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1500 W",
      "maxTorque": "",
      "maxSpeed": "45 km/h",
      "transmission": "3 ileri 1 geri",
      "cooling": "",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "72V - 20Ah",
      "dimensions": "1811 x 760 x 1218 mm",
      "weight": "81 kg",
      "maxLoadWeight": "271 kg",
      "tireSize": "90/90-12 Dublex 90/90-12 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Gündüz Aydınlatma Led Far, Usb Şarj, Port Bagaj, Dijital Gösterge, Nfc Kart, Anahtarsız Çalıştırma"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi PITTON 9000, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-super-54",
    "slug": "motolux-super-54",
    "brand": "MotoLux",
    "model": "SUPER 54",
    "tagline": "Resmî MotoLux SUPER 54 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/05/super-54.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-3.png"
    ],
    "colors": [
      {
        "name": "Siyah",
        "hex": "#19161F",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-2.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#AC0503",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-1.png"
      },
      {
        "name": "Açık Gri / Gümüş",
        "hex": "#aaaaaa",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/SUPER-54-MOTOLUX-3.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "249 W",
      "maxTorque": "",
      "maxSpeed": "25 km/h",
      "transmission": "7 Vites",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "48V - 20Ah",
      "dimensions": "",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "20x4.0 - 20x4.0 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi SUPER 54, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-pitton6000",
    "slug": "motolux-pitton6000",
    "brand": "MotoLux",
    "model": "PITTON 6000",
    "tagline": "Resmî MotoLux PITTON 6000 Yetkili Satış Bayisi",
    "category": "E-GRUP",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/04/PITTON-6000-70-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-KIRMIZI-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-YESIL.png",
      "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-MAVI.png"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#CD131B",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-KIRMIZI-scaled.png"
      },
      {
        "name": "Yeşil",
        "hex": "#33A81B",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-YESIL.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#65BDBF",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/06/PITTON-6000-MAVI.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "2000 W",
      "maxTorque": "",
      "maxSpeed": "45 km/h",
      "transmission": "3 ileri 1 geri",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72V - 24Ah",
      "dimensions": "2020 x 760 x 1140 mm",
      "weight": "75 kg",
      "maxLoadWeight": "290 kg",
      "tireSize": "90/90-12 Dublex 90/90-12 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Gündüz Aydınlatma Led Far, Usb Şarj, Port Bagaj, Dijital Gösterge, Nfc Kart, Anahtarsız Çalıştırma"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi PITTON 6000, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-africa-wolf-2",
    "slug": "motolux-africa-wolf-2",
    "brand": "MotoLux",
    "model": "AFRICA WOLF 2",
    "tagline": "Resmî MotoLux AFRICA WOLF 2 Yetkili Satış Bayisi",
    "category": "CUB",
    "engineSize": "48 cc",
    "licenseType": "B Sınıfı Ehliyet Uyumlu (Sigortadan Muaf)",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/05/AFRICA-WOLF-2-1-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-51.png",
      "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-52.png"
    ],
    "colors": [
      {
        "name": "Sarı / Altın",
        "hex": "#ECD313",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-51.png"
      },
      {
        "name": "Kobalt Mavisi",
        "hex": "#379ac8",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/07/Asset-52.png"
      }
    ],
    "specs": {
      "engineCapacity": "48 cc",
      "maxPower": "2 kW(2.72 hp)",
      "maxTorque": "",
      "maxSpeed": "",
      "transmission": "4 Vites",
      "cooling": "Hava Soğutma",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "12V-5Ah",
      "dimensions": "1936x710x1130 mm",
      "weight": "103 kg",
      "maxLoadWeight": "253 kg",
      "tireSize": "2.50-17 Dublex 2.75-17 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi AFRICA WOLF 2, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-cargo-52000-l",
    "slug": "motolux-cargo-52000-l",
    "brand": "MotoLux",
    "model": "CARGO 52000 – L",
    "tagline": "Resmî MotoLux CARGO 52000 – L Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/11/cargo-52000-L.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/gri-52000@2x.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/kirimizi-52000@2x-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/sari-52000@2x-scaled.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#696969",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/gri-52000@2x.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#E80303",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/kirimizi-52000@2x-scaled.png"
      },
      {
        "name": "Sarı / Altın",
        "hex": "#FFE000",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/sari-52000@2x-scaled.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "3900 W",
      "maxTorque": "",
      "maxSpeed": "42 km/h",
      "transmission": "2 İleri - 1 Geri Vites",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "(76V - 42 Ah Lityum) veya (72V - 58 Ah) veya (72V - 45 Ah)",
      "dimensions": "~3042 x 1168 x 1361 mm",
      "weight": "251 Kg",
      "maxLoadWeight": "",
      "tireSize": "3.75-12 - 4.00-12",
      "licenseRequirement": "",
      "extraFeatures": [
        "Geri Görüş Kamerası, Dijital Ekran, Müzik Çalar Sistemi"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi CARGO 52000 – L, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-cargo-44000-l-2",
    "slug": "motolux-cargo-44000-l-2",
    "brand": "MotoLux",
    "model": "CARGO 44000-L",
    "tagline": "Resmî MotoLux CARGO 44000-L Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/07/cargo44000l.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-73.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-72.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-71.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-78.png"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#FF0000",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-73.png"
      },
      {
        "name": "Gri",
        "hex": "#808080",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-72.png"
      },
      {
        "name": "Sarı",
        "hex": "#ffff00",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-71.png"
      },
      {
        "name": "Turkuaz Mavisi",
        "hex": "#30D5C8",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/Asset-78.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1500 W",
      "maxTorque": "",
      "maxSpeed": "35 km/h",
      "transmission": "2 ileri 1 geri",
      "cooling": "",
      "brakes": "Disk / Disk",
      "fuelTankOrBattery": "72V 46Ah veya 72V 58Ah",
      "dimensions": "3141 mm x 1171 mm x 1348 mm",
      "weight": "212 kg",
      "maxLoadWeight": "659 kg",
      "tireSize": "3.50-16 - 4.00-12 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi CARGO 44000-L, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-cargo-54000",
    "slug": "motolux-cargo-54000",
    "brand": "MotoLux",
    "model": "CARGO 54000",
    "tagline": "Resmî MotoLux CARGO 54000 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-3.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-2.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#696969",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-3.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#E80303",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-1.png"
      },
      {
        "name": "Sarı / Altın",
        "hex": "#FFE000",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/cargo-54000-2.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "3900 W",
      "maxTorque": "",
      "maxSpeed": "42 km/h",
      "transmission": "3 İleri - 1 Geri Vites",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72V - 58 Ah",
      "dimensions": "~3042 x 1168 x 1361 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "3.75-12 - 4.00-12",
      "licenseRequirement": "",
      "extraFeatures": [
        "Geri Görüş Kamerası, Dijital Ekran, Müzik Çalar Sistemi"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi CARGO 54000, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-8200",
    "slug": "motolux-fayton-8200",
    "brand": "MotoLux",
    "model": "FAYTON 8200",
    "tagline": "Resmî MotoLux FAYTON 8200 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/01/8200-1-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-gRI-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-Kirmizi-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-krem-scaled.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#606060",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-gRI-scaled.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#CB373A",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-Kirmizi-scaled.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#FEDDC1",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-8200-krem-scaled.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1300 W",
      "maxTorque": "",
      "maxSpeed": "30 km/h",
      "transmission": "3 İleri - 1 Geri Vites",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72V - 32Ah",
      "dimensions": "~2750x900x1110 mm",
      "weight": "170 Kg",
      "maxLoadWeight": "560 kg",
      "tireSize": "3.00-12 Dublex 3.00-12 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi FAYTON 8200, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-fx-08",
    "slug": "motolux-fayton-fx-08",
    "brand": "MotoLux",
    "model": "FAYTON FX 08",
    "tagline": "Resmî MotoLux FAYTON FX 08 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/Fayton-5000x-1.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/gri-12.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-30.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-22.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#969696",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/gri-12.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#AC0D0F",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-30.png"
      },
      {
        "name": "Beyaz",
        "hex": "#ffffff",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-22.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1000 W",
      "maxTorque": "",
      "maxSpeed": "25 km/h",
      "transmission": "3 ileri 1 geri",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "60V - 24Ah",
      "dimensions": "1580x680x1050 mm",
      "weight": "87 kg",
      "maxLoadWeight": "187 kg",
      "tireSize": "4.00-12 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi FAYTON FX 08, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-8800",
    "slug": "motolux-fayton-8800",
    "brand": "MotoLux",
    "model": "FAYTON 8800",
    "tagline": "Resmî MotoLux FAYTON 8800 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/06/WEB-SITESI-ONIZLEME-SON-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-GRI.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-KIRMIZI.png",
      "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-KREM.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#696969",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-GRI.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#E80303",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-KIRMIZI.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#fffdd0",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/06/FAYTON-8800-KREM.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1200 W",
      "maxTorque": "",
      "maxSpeed": "35 km/h",
      "transmission": "3 İleri - 1 Geri Vites",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72V32Ah",
      "dimensions": "2812 x 1034 x 1895mm",
      "weight": "262 kg",
      "maxLoadWeight": "",
      "tireSize": "3.75-12 - 3.75-12",
      "licenseRequirement": "",
      "extraFeatures": [
        "Dijital Ekran, Müzik Çalar Sistemi"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi FAYTON 8800, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-fx-12",
    "slug": "motolux-fayton-fx-12",
    "brand": "MotoLux",
    "model": "Fayton FX 12",
    "tagline": "Resmî MotoLux Fayton FX 12 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/02/onizleme-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/02/MIN-YESIL.png",
      "https://motolux.com.tr/wp-content/uploads/2026/02/KIRMIZI-.png",
      "https://motolux.com.tr/wp-content/uploads/2026/02/KREM.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#899388",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/02/MIN-YESIL.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#C61720",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/02/KIRMIZI-.png"
      },
      {
        "name": "Açık Gri / Gümüş",
        "hex": "#decbba",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/02/KREM.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1200 W",
      "maxTorque": "",
      "maxSpeed": "32 km/h",
      "transmission": "3 İleri 1 Geri",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "60V - 32Ah",
      "dimensions": "2175/870/1070 mm",
      "weight": "106 kg",
      "maxLoadWeight": "307kg",
      "tireSize": "3.00-10 - 3.00-10 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi Fayton FX 12, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-fx-09",
    "slug": "motolux-fayton-fx-09",
    "brand": "MotoLux",
    "model": "Fayton FX 09",
    "tagline": "Resmî MotoLux Fayton FX 09 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/11/FX-09-25-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-24.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-25-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-23-scaled.png"
    ],
    "colors": [
      {
        "name": "Açık Gri / Gümüş",
        "hex": "#E5E3CC",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-24.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#CCD3AC",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-25-scaled.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#6D6D6D",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX-09-23-scaled.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1000 W",
      "maxTorque": "",
      "maxSpeed": "25 km/h",
      "transmission": "2 vitesli",
      "cooling": "",
      "brakes": "Kampana/Kampana",
      "fuelTankOrBattery": "60V - 20Ah",
      "dimensions": "2200 x 1050 x 1730 mm",
      "weight": "93 kg",
      "maxLoadWeight": "198 kg",
      "tireSize": "3.00-8 - 3.00-8 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi Fayton FX 09, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-fx-10-l",
    "slug": "motolux-fayton-fx-10-l",
    "brand": "MotoLux",
    "model": "Fayton FX 10 – L",
    "tagline": "Resmî MotoLux Fayton FX 10 – L Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/11/fx10L.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-1.png"
    ],
    "colors": [
      {
        "name": "Füme / Antrasit",
        "hex": "#8D8B88",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-3.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#C61720",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-2.png"
      },
      {
        "name": "Beyaz",
        "hex": "#FFFEF3",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/11/fx10-l-1.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1000 W",
      "maxTorque": "",
      "maxSpeed": "32 km/h",
      "transmission": "2 İleri 1 Geri",
      "cooling": "",
      "brakes": "Disk/Kampana",
      "fuelTankOrBattery": "60V - 32Ah",
      "dimensions": "2175/870/1070 mm",
      "weight": "106 kg",
      "maxLoadWeight": "307kg",
      "tireSize": "3.00-10 - 3.00-10 Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi Fayton FX 10 – L, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-fx-25",
    "slug": "motolux-fayton-fx-25",
    "brand": "MotoLux",
    "model": "Fayton FX 25",
    "tagline": "Resmî MotoLux Fayton FX 25 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/05/fx25-mor.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-1-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-3.png",
      "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-2.png"
    ],
    "colors": [
      {
        "name": "Nardo Gri",
        "hex": "#7a72c0",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-1-1.png"
      },
      {
        "name": "Nardo Gri",
        "hex": "#477b90",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-3.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#ede7ca",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/fx-25-2.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1200 W",
      "maxTorque": "",
      "maxSpeed": "35 km/h",
      "transmission": "3 vitesli",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "76.8V - 48Ah (Lityum)",
      "dimensions": "2423x 1057x 1752 mm",
      "weight": "353 kg",
      "maxLoadWeight": "437 kg",
      "tireSize": "3.00-10 - 3.00-10 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "Geri Görüş Kamerası, Bluetooth Müzik Çalar, NFC, Anahtarsız Çalıştırma"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi Fayton FX 25, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-fx-24",
    "slug": "motolux-fayton-fx-24",
    "brand": "MotoLux",
    "model": "Fayton FX 24",
    "tagline": "Resmî MotoLux Fayton FX 24 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-2-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-3.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-2.png"
    ],
    "colors": [
      {
        "name": "Nardo Gri",
        "hex": "#7a72c0",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-1.png"
      },
      {
        "name": "Nardo Gri",
        "hex": "#477b90",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-3.png"
      },
      {
        "name": "Mat Siyah",
        "hex": "#421627",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/fx24-2.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1200 W",
      "maxTorque": "",
      "maxSpeed": "35 km/h",
      "transmission": "3 vitesli",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "64V - 30Ah (Lityum) -\n60V - 32Ah",
      "dimensions": "2186 x 1048x 1214 mm",
      "weight": "116 kg",
      "maxLoadWeight": "437 kg",
      "tireSize": "3.00-10 - 3.00-10 Dublex",
      "licenseRequirement": "",
      "extraFeatures": [
        "GeriGörüş Kamerası, Bluetooth Müzik Çalar"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi Fayton FX 24, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-fx-33",
    "slug": "motolux-fayton-fx-33",
    "brand": "MotoLux",
    "model": "Fayton FX 33",
    "tagline": "Resmî MotoLux Fayton FX 33 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/05/fx-33-urun-gorsel-menu.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX33-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX33_1-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/FX33_2.png"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#E53333",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX33-scaled.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#4C4C4C",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX33_1-scaled.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#848484",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/FX33_2.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1300 W",
      "maxTorque": "",
      "maxSpeed": "45 km/h",
      "transmission": "3 ileri 1 geri",
      "cooling": "",
      "brakes": "Disk / Kampana",
      "fuelTankOrBattery": "60V - 32 Ah",
      "dimensions": "2520 mm x 910 mm x 1135 mm",
      "weight": "112 kg",
      "maxLoadWeight": "382 kg",
      "tireSize": "3.00 -12 (ön) - 3.00-12 (arka) Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi Fayton FX 33, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-fx-23",
    "slug": "motolux-fayton-fx-23",
    "brand": "MotoLux",
    "model": "Fayton FX 23",
    "tagline": "Resmî MotoLux Fayton FX 23 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/04/WEB-ONIZLEME-14-19-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/05/fx23.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/fx23_2.png",
      "https://motolux.com.tr/wp-content/uploads/2025/05/fx23_1.png",
      "https://motolux.com.tr/wp-content/uploads/2025/08/fx23s-2.png"
    ],
    "colors": [
      {
        "name": "Turkuaz",
        "hex": "#b2e0f5",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/fx23.png"
      },
      {
        "name": "Gümüş Gri",
        "hex": "#8fb387",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/fx23_2.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#b3fea4",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/05/fx23_1.png"
      },
      {
        "name": "Açık Gri / Gümüş",
        "hex": "#c1ab9a",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/08/fx23s-2.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1200 W",
      "maxTorque": "",
      "maxSpeed": "35 km/h",
      "transmission": "2 ileri 1 geri",
      "cooling": "",
      "brakes": "Disk / Disk",
      "fuelTankOrBattery": "60V - 33Ah",
      "dimensions": "2180 mm x 1050 mm x 1185 mm",
      "weight": "116 kg",
      "maxLoadWeight": "437 kg",
      "tireSize": "3.10 (ön) - 3.10 (arka) Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi Fayton FX 23, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-fx-34",
    "slug": "motolux-fayton-fx-34",
    "brand": "MotoLux",
    "model": "Fayton FX 34",
    "tagline": "Resmî MotoLux Fayton FX 34 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/05/fx-34.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1araba.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1-copyaraba.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1-copy-2araba.jpg"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#E53333",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1araba.jpg"
      },
      {
        "name": "Turkuaz",
        "hex": "#d8ba9a",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1-copyaraba.jpg"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#848484",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/05/Artboard-1-copy-2araba.jpg"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1500 W",
      "maxTorque": "",
      "maxSpeed": "35 km/h",
      "transmission": "3 ileri 1 geri",
      "cooling": "",
      "brakes": "Disk / Kampana",
      "fuelTankOrBattery": "60V - 32 Ah",
      "dimensions": "244 mm x 914mm x 1180 mm",
      "weight": "135 kg",
      "maxLoadWeight": "255 kg",
      "tireSize": "3.00 -12 (ön) - 3.00-12 (arka) Dublex",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi Fayton FX 34, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fayton-fx-55",
    "slug": "motolux-fayton-fx-55",
    "brand": "MotoLux",
    "model": "Fayton FX 55",
    "tagline": "Resmî MotoLux Fayton FX 55 Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/12/Asset-83-100.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-1.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-2.png",
      "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-3.png"
    ],
    "colors": [
      {
        "name": "Turkuaz",
        "hex": "#FFFDD0",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-1.png"
      },
      {
        "name": "Açık Gri / Gümüş",
        "hex": "#bebebe",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-2.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#666666",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/01/Fayton-fx-55-3.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "2350 W",
      "maxTorque": "",
      "maxSpeed": "35 km/h",
      "transmission": "2 İleri - 1 Geri Vites",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "72 V - 32 Ah",
      "dimensions": "2440x987x1040 mm",
      "weight": "150 kg",
      "maxLoadWeight": "376 kg",
      "tireSize": "3.00-12 - 3.00-12",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi Fayton FX 55, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-m750-utv",
    "slug": "motolux-m750-utv",
    "brand": "MotoLux",
    "model": "M750-UTV",
    "tagline": "Resmî MotoLux M750-UTV Yetkili Satış Bayisi",
    "category": "UTV",
    "engineSize": "Standart",
    "licenseType": "B / A1 / A2 Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/07/Artboard-1-copy-47.jpg"
    ],
    "colors": [
      {
        "name": "Standart Renk",
        "hex": "#1e293b",
        "imageIndex": 0,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/07/Artboard-1-copy-47.jpg"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "32.5 kW",
      "maxTorque": "",
      "maxSpeed": "60 km/h",
      "transmission": "",
      "cooling": "",
      "brakes": "",
      "fuelTankOrBattery": "12V - 30Ah",
      "dimensions": "3030mm x 1526mm x 1920 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "225/75-14\n270/75-14",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi M750-UTV, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-xtank200",
    "slug": "motolux-xtank200",
    "brand": "MotoLux",
    "model": "X-TANK 200",
    "tagline": "Resmî MotoLux X-TANK 200 Yetkili Satış Bayisi",
    "category": "UTV",
    "engineSize": "Standart",
    "licenseType": "B / A1 / A2 Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/08/Asset-1-8.png",
      "https://motolux.com.tr/wp-content/uploads/2026/08/X-TANK-200-BEYAZ.png",
      "https://motolux.com.tr/wp-content/uploads/2026/08/X-TANK-200-HAKI.png",
      "https://motolux.com.tr/wp-content/uploads/2026/08/X-TANK-200-MAVI.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#eaeaea",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/08/X-TANK-200-BEYAZ.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#565547",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/08/X-TANK-200-HAKI.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#465363",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/08/X-TANK-200-MAVI.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "180 cc",
      "maxTorque": "",
      "maxSpeed": "65km/h",
      "transmission": "",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "5 L",
      "dimensions": "1870 mm x 1110 mm x 1120 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "Ön Lastik : 23×7-10 (Alüminyum jant / Demir jant)\nArka Lastik : 22×10-10 (Alüminyum jant / Demir jant)",
      "licenseRequirement": "",
      "extraFeatures": []
    },
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "65km/h"
      },
      {
        "label": "Boyutlar (UxGxY)",
        "value": "1870 mm x 1110 mm x 1120 mm"
      },
      {
        "label": "Batarya",
        "value": "12 V 9 Ah"
      },
      {
        "label": "Motor Gücü",
        "value": "180 cc"
      },
      {
        "label": "Taşıma Kapasitesi",
        "value": "953 kg"
      },
      {
        "label": "Araç Net Ağırlığı",
        "value": "232 kg"
      },
      {
        "label": "Lastik/Jant",
        "value": "Ön Lastik : 23×7-10 (Alüminyum jant / Demir jant) Arka Lastik : 22×10-10 (Alüminyum jant / Demir jant)"
      },
      {
        "label": "Fren",
        "value": "Disk/Disk"
      },
      {
        "label": "Yakıt Kapasitesi",
        "value": "5 L"
      }
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi X-TANK 200, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-utv-550",
    "slug": "motolux-utv-550",
    "brand": "MotoLux",
    "model": "M550-UTV",
    "tagline": "Resmî MotoLux M550-UTV Yetkili Satış Bayisi",
    "category": "UTV",
    "engineSize": "Standart",
    "licenseType": "B / A1 / A2 Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/07/Artboard-1-copy-46.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/08/Asset-60@2000x-8-scaled.png"
    ],
    "colors": [
      {
        "name": "Turkuaz",
        "hex": "#7DACA8",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/08/Asset-60@2000x-8-scaled.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "28.9 kW",
      "maxTorque": "",
      "maxSpeed": "60 km/h",
      "transmission": "",
      "cooling": "",
      "brakes": "",
      "fuelTankOrBattery": "12V-30Ah",
      "dimensions": "2908 mm x1237 mm x1850 mm",
      "weight": "953 kg",
      "maxLoadWeight": "",
      "tireSize": "Ön Lastik : 225 / 65 -14 72F\nArka Lastik : 280 / 55 -14 79F",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi M550-UTV, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-ist-1453-s",
    "slug": "motolux-ist-1453-s",
    "brand": "MotoLux",
    "model": "IST 1453-S",
    "tagline": "Resmî MotoLux IST 1453-S Yetkili Satış Bayisi",
    "category": "E-TRICYCLE",
    "engineSize": "Elektrikli",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2025/10/IST-1453-S-1-scaled.jpg",
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-66.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-64.png",
      "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-67.png",
      "https://motolux.com.tr/wp-content/uploads/2026/02/IST-1453-S-KIRMIZI.png",
      "https://motolux.com.tr/wp-content/uploads/2026/02/IST-1453-S-KREM.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#ffffff",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-66.png"
      },
      {
        "name": "Sarı",
        "hex": "#FFFF00",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-64.png"
      },
      {
        "name": "Füme / Antrasit",
        "hex": "#293133",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2025/10/Asset-67.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#FF0000",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/02/IST-1453-S-KIRMIZI.png"
      },
      {
        "name": "Turkuaz",
        "hex": "#FEECC8",
        "imageIndex": 5,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/02/IST-1453-S-KREM.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1900 W",
      "maxTorque": "",
      "maxSpeed": "40 km/h",
      "transmission": "3 ileri 1 geri",
      "cooling": "",
      "brakes": "Disk / Disk",
      "fuelTankOrBattery": "76V - 52Ah (Lityum) veya 76V - 100Ah (Lityum) veya 72V-58Ah",
      "dimensions": "3086 mm x 1177mm x 1713 mm",
      "weight": "268 kg",
      "maxLoadWeight": "733 kg",
      "tireSize": "3.75-12 (ön) - 4.00-12 (arka)",
      "licenseRequirement": "",
      "extraFeatures": [
        "Geri görüş kamerası, USB Giriş, Dijital Kilometre Kadranı, Açılır Tavan ( Havalandırma )"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi IST 1453-S, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-yt-a2-42",
    "slug": "motolux-yt-a2-42",
    "brand": "MotoLux",
    "model": "YT-A2.4+2",
    "tagline": "Resmî MotoLux YT-A2.4+2 Yetkili Satış Bayisi",
    "category": "GOLF BUGGY",
    "engineSize": "Standart",
    "licenseType": "B / A1 / A2 Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/Artboard-1-copy-50.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/siyah-15.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-23.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-19.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-14.png"
    ],
    "colors": [
      {
        "name": "Siyah",
        "hex": "#1F2120",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/siyah-15.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#e50e0e",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-23.png"
      },
      {
        "name": "Beyaz",
        "hex": "#fff",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-19.png"
      },
      {
        "name": "Gece Mavisi / Lacivert",
        "hex": "#0E337D",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-14.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "5000W",
      "maxTorque": "",
      "maxSpeed": "25 km/h",
      "transmission": "",
      "cooling": "",
      "brakes": "",
      "fuelTankOrBattery": "48V - 150Ah",
      "dimensions": "3685x1230x1905 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "12 İnç Lastik/12 İnç Alüminyum Jant",
      "licenseRequirement": "",
      "extraFeatures": [
        "Katlanır Ön Cam, İki Noktalı Emniyet Kemeri, Bluetooth Destekli 10 İnç Ekran, Geri Görüş Kamerası, Ses Sistemi, Ön Sepet, Ön Koruma Demiri"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi YT-A2.4+2, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-yt-a2-22-g",
    "slug": "motolux-yt-a2-22-g",
    "brand": "MotoLux",
    "model": "YT-A2.2+2 G",
    "tagline": "Resmî MotoLux YT-A2.2+2 G Yetkili Satış Bayisi",
    "category": "GOLF BUGGY",
    "engineSize": "Standart",
    "licenseType": "B / A1 / A2 Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/Artboard-1-copy-49.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-13.png"
    ],
    "colors": [
      {
        "name": "Gece Mavisi / Lacivert",
        "hex": "#244A93",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-13.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "5000W",
      "maxTorque": "",
      "maxSpeed": "25 km/h",
      "transmission": "",
      "cooling": "",
      "brakes": "",
      "fuelTankOrBattery": "48V - 150Ah",
      "dimensions": "2960x1310x2074 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "12 İnç Alüminyum Jant (Arazi Lastiği seçeneği ile)",
      "licenseRequirement": "",
      "extraFeatures": [
        "Katlanır Ön Cam, İki Noktalı Emniyet Kemeri, Bluetooth Destekli 10 İnç Ekran, Geri Görüş Kamerası, Ses Sistemi, Ön Sepet, Ön Koruma Demiri"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi YT-A2.2+2 G, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-yt-a2-42-g",
    "slug": "motolux-yt-a2-42-g",
    "brand": "MotoLux",
    "model": "YT-A2.4+2 G",
    "tagline": "Resmî MotoLux YT-A2.4+2 G Yetkili Satış Bayisi",
    "category": "GOLF BUGGY",
    "engineSize": "Standart",
    "licenseType": "B / A1 / A2 Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/Artboard-1-copy-51.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-24.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-20.png"
    ],
    "colors": [
      {
        "name": "Karamel Kahve",
        "hex": "#6A222D",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-24.png"
      },
      {
        "name": "Beyaz",
        "hex": "#fff",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-20.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "5000W",
      "maxTorque": "",
      "maxSpeed": "25 km/h",
      "transmission": "",
      "cooling": "",
      "brakes": "",
      "fuelTankOrBattery": "48V - 150Ah",
      "dimensions": "3760x1310x2074 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "12 İnç Arazi Lastiği/12 İnç Alüminyum Jant",
      "licenseRequirement": "",
      "extraFeatures": [
        "Katlanır Ön Cam, İki Noktalı Emniyet Kemeri, Bluetooth Destekli 10 İnç Ekran, Geri Görüş Kamerası, Ses Sistemi, Ön Sepet, Ön Koruma Demiri"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi YT-A2.4+2 G, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-yt-a2-22",
    "slug": "motolux-yt-a2-22",
    "brand": "MotoLux",
    "model": "YT-A2.2+2",
    "tagline": "Resmî MotoLux YT-A2.2+2 Yetkili Satış Bayisi",
    "category": "GOLF BUGGY",
    "engineSize": "Standart",
    "licenseType": "B / A1 / A2 Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/Artboard-1-copy-48.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-18.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-22.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/siyah-14.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#fff",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-18.png"
      },
      {
        "name": "Kırmızı",
        "hex": "#ab0024",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-22.png"
      },
      {
        "name": "Siyah",
        "hex": "#222322",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/siyah-14.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "5000W",
      "maxTorque": "",
      "maxSpeed": "25 km/h",
      "transmission": "",
      "cooling": "",
      "brakes": "",
      "fuelTankOrBattery": "48V - 150Ah",
      "dimensions": "2885x1230x1910 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "10 İnç Lastik/10 İnç Alüminyum Jant",
      "licenseRequirement": "",
      "extraFeatures": [
        "Katlanır Ön Cam, İki Noktalı Emniyet Kemeri, Bluetooth Destekli 10 İnç Ekran, Geri Görüş Kamerası, Ses Sistemi, Ön Sepet, Ön Koruma Demiri"
      ]
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi YT-A2.2+2, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-higo",
    "slug": "motolux-higo",
    "brand": "MotoLux",
    "model": "HIGO",
    "tagline": "Resmî MotoLux HIGO Yetkili Satış Bayisi",
    "category": "GOLF BUGGY",
    "engineSize": "Standart",
    "licenseType": "B / A1 / A2 Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2026/09/higo.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/09/higo-2-scaled.png",
      "https://motolux.com.tr/wp-content/uploads/2026/09/higo-1-scaled.png"
    ],
    "colors": [
      {
        "name": "Beyaz",
        "hex": "#E3E3E3",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/09/higo-2-scaled.png"
      },
      {
        "name": "Turuncu",
        "hex": "#ff7415",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/09/higo-1-scaled.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "1.5 kW",
      "maxTorque": "",
      "maxSpeed": "35 km/h",
      "transmission": "Otomatik",
      "cooling": "",
      "brakes": "Disk/Disk (CBS)",
      "fuelTankOrBattery": "76V 52Ah ( Lityum Akü ) veya 72V 45Ah (Jel Akü)",
      "dimensions": "2948x1091x1812 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "130/90-10 - 130/90-10 (Ön ve Arka )",
      "licenseRequirement": "",
      "extraFeatures": [
        "Dijital Gösterge, Geri Görüş Kamerası, USB Şarj , Bardak Tutacağı , Spor modu tuşu"
      ]
    },
    "technicalSpecs": [
      {
        "label": "Hız",
        "value": "35 km/h"
      },
      {
        "label": "Anma Gücü",
        "value": "3000 W"
      },
      {
        "label": "Motor Gücü",
        "value": "1.5 kW"
      },
      {
        "label": "Batarya",
        "value": "76V 52Ah ( Lityum Akü ) veya 72V 45Ah (Jel Akü)"
      },
      {
        "label": "Şarj Aleti",
        "value": "75V-25Ah ( Lityum Akü )"
      },
      {
        "label": "Şarj Süresi",
        "value": "2 saat (Lityum), 6-8 saat (Jel)"
      },
      {
        "label": "Şarj Mesafesi",
        "value": "55-60 km"
      },
      {
        "label": "Vites",
        "value": "Otomatik"
      },
      {
        "label": "Fren",
        "value": "Disk/Disk (CBS)"
      },
      {
        "label": "Lastik Ölçüsü",
        "value": "130/90-10 - 130/90-10 (Ön ve Arka )"
      },
      {
        "label": "Boyutlar",
        "value": "2948x1091x1812 mm"
      },
      {
        "label": "Yolcu Sayısı",
        "value": "4 Kişi"
      },
      {
        "label": "Ek Özellikler",
        "value": "Dijital Gösterge, Geri Görüş Kamerası, USB Şarj , Bardak Tutacağı , Spor modu tuşu"
      }
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi HIGO, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-fir-fir",
    "slug": "motolux-fir-fir",
    "brand": "MotoLux",
    "model": "FIR FIR",
    "tagline": "Resmî MotoLux FIR FIR Yetkili Satış Bayisi",
    "category": "ÇOCUK GRUBU",
    "engineSize": "Standart",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/Artboard-1-copy-53.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/kir.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/sari-2.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-2.png",
      "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-4.png"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#F12526",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kir.png"
      },
      {
        "name": "Sarı / Altın",
        "hex": "#ffef1e",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/sari-2.png"
      },
      {
        "name": "Beyaz",
        "hex": "#fff",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-2.png"
      },
      {
        "name": "Mavi",
        "hex": "#2B2BC3",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/mavi-4.png"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "30 W (2 parça)",
      "maxTorque": "",
      "maxSpeed": "6 km/saat",
      "transmission": "",
      "cooling": "",
      "brakes": "El Freni",
      "fuelTankOrBattery": "12V 8Ah",
      "dimensions": "900x600x600 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi FIR FIR, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-mini-e-jeep",
    "slug": "motolux-mini-e-jeep",
    "brand": "MotoLux",
    "model": "MINI E-JEEP",
    "tagline": "Resmî MotoLux MINI E-JEEP Yetkili Satış Bayisi",
    "category": "ÇOCUK GRUBU",
    "engineSize": "Standart",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/Artboard-1-copy-55.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/yesil-2.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/pembe-1.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmiz.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/mavi.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/turuncu.jpg"
    ],
    "colors": [
      {
        "name": "Nardo Gri",
        "hex": "#7D896D",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/yesil-2.jpg"
      },
      {
        "name": "Mor / Bordo",
        "hex": "#BA1EC8",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/pembe-1.jpg"
      },
      {
        "name": "Kırmızı",
        "hex": "#D11017",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmiz.jpg"
      },
      {
        "name": "Turkuaz Mavisi",
        "hex": "#2BA8DC",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/mavi.jpg"
      },
      {
        "name": "Turuncu",
        "hex": "#E85706",
        "imageIndex": 5,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/turuncu.jpg"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "350 W",
      "maxTorque": "",
      "maxSpeed": "6 km/saat",
      "transmission": "",
      "cooling": "",
      "brakes": "El ile",
      "fuelTankOrBattery": "28V - 8Ah Lithium",
      "dimensions": "1120x580x650 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "3.5-6",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi MINI E-JEEP, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-mini-e-atv",
    "slug": "motolux-mini-e-atv",
    "brand": "MotoLux",
    "model": "MINI E-ATV",
    "tagline": "Resmî MotoLux MINI E-ATV Yetkili Satış Bayisi",
    "category": "ÇOCUK GRUBU",
    "engineSize": "Standart",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/Artboard-1-copy-54.jpg"
    ],
    "colors": [
      {
        "name": "Standart Renk",
        "hex": "#1e293b",
        "imageIndex": 0,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/Artboard-1-copy-54.jpg"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "350 W",
      "maxTorque": "",
      "maxSpeed": "6 km/saat",
      "transmission": "",
      "cooling": "",
      "brakes": "El ile",
      "fuelTankOrBattery": "24V - 8Ah Lithium",
      "dimensions": "",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "4.10 / 3.5-6",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi MINI E-ATV, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-x-tankmini",
    "slug": "motolux-x-tankmini",
    "brand": "MotoLux",
    "model": "X-TANK MINI",
    "tagline": "Resmî MotoLux X-TANK MINI Yetkili Satış Bayisi",
    "category": "ÇOCUK GRUBU",
    "engineSize": "Standart",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/11/xS-1.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/07/remove.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/07/remove-copy-2.jpg",
      "https://motolux.com.tr/wp-content/uploads/2026/07/remove-copy.jpg"
    ],
    "colors": [
      {
        "name": "Kahverengi / Bakır",
        "hex": "#90ff00",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/07/remove.jpg"
      },
      {
        "name": "Kırmızı",
        "hex": "#F40000",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/07/remove-copy-2.jpg"
      },
      {
        "name": "Sarı / Altın",
        "hex": "#FFA500",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2026/07/remove-copy.jpg"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "800 W",
      "maxTorque": "",
      "maxSpeed": "25km/h",
      "transmission": "",
      "cooling": "",
      "brakes": "Disk/Disk",
      "fuelTankOrBattery": "36V 12Ah",
      "dimensions": "",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "Ön- 4.10-6 Arka-5.00-6",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi X-TANK MINI, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  },
  {
    "id": "motolux-drift",
    "slug": "motolux-drift",
    "brand": "MotoLux",
    "model": "DRIFT",
    "tagline": "Resmî MotoLux DRIFT Yetkili Satış Bayisi",
    "category": "ÇOCUK GRUBU",
    "engineSize": "Standart",
    "licenseType": "Ehliyetsiz / B Sınıfı Uyumlu",
    "price": 0,
    "images": [
      "https://motolux.com.tr/wp-content/uploads/2024/06/Artboard-1-copy-52.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-4.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/siyah.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-1.jpg",
      "https://motolux.com.tr/wp-content/uploads/2024/06/sari-1.jpg"
    ],
    "colors": [
      {
        "name": "Kırmızı",
        "hex": "#E41F3A",
        "imageIndex": 1,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/kirmizi-4.jpg"
      },
      {
        "name": "Siyah",
        "hex": "#17141B",
        "imageIndex": 2,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/siyah.jpg"
      },
      {
        "name": "Açık Gri / Gümüş",
        "hex": "#D9DBE6",
        "imageIndex": 3,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/beyaz-1.jpg"
      },
      {
        "name": "Sarı / Altın",
        "hex": "#ffef1e",
        "imageIndex": 4,
        "imageUrl": "https://motolux.com.tr/wp-content/uploads/2024/06/sari-1.jpg"
      }
    ],
    "specs": {
      "engineCapacity": "",
      "maxPower": "30 W (2 parça)",
      "maxTorque": "",
      "maxSpeed": "6 km/saat",
      "transmission": "",
      "cooling": "",
      "brakes": "",
      "fuelTankOrBattery": "12V 7Ah",
      "dimensions": "1020x740x590 mm",
      "weight": "",
      "maxLoadWeight": "",
      "tireSize": "",
      "licenseRequirement": "",
      "extraFeatures": []
    },
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
    ],
    "features": [
      "0 KM Sıfır Bayi Teslimatı",
      "2 Yıl MotoLux Resmî Fabrika Garantisi",
      "Kredi Kartına 3, 6, 9 ve 12 Taksit İmkanı",
      "İstanbul İçi Aynı Gün Anahtar Teslim Plaka Desteği",
      "Geniş Yetkili Servis ve Orijinal Yedek Parça Ağı"
    ],
    "warranty": "2 Yıl / 30.000 KM MotoLux Resmî Fabrika Garantisi",
    "condition": "0 KM Sıfır",
    "description": "Resmî MotoLux üretimi DRIFT, üstün mühendislik kalitesi, modern tasarımı ve konforlu sürüş dinamikleriyle Paşa Motor Fatih showroomumuzda 0 KM olarak satışta.",
    "installmentText": "3-6-9-12 Taksit İmkanı / Fiyat Sorunuz"
  }
];
