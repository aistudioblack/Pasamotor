import Layout from "@/components/layout/Layout";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase-client";
import { 
  Package, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Check, 
  X, 
  ShoppingBag,
  ArrowUpDown,
  TrendingUp,
  Coins,
  Inbox,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import type { Tables } from "@/lib/db-types";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import JsonLd from "@/components/seo/JsonLd";
import ProductImagePlaceholder from "@/components/ui/ProductImagePlaceholder";
import { CITIES } from "@/data/cities";

type Product = Tables<"products">;

// Modül düzeyinde anlık önbellek (Sınırsız bakiye ve hızlı render)
let cachedProductsList: Product[] | null = null;
let lastSyncTime: number | null = null;

// Initialize cache from sessionStorage if available to persist between page refreshes and route swaps
try {
  if (typeof window !== "undefined") {
    const localCached = sessionStorage.getItem("pasa_motor_yedek_parca_cache");
    const localTime = sessionStorage.getItem("pasa_motor_yedek_parca_time");
    if (localCached && localTime) {
      cachedProductsList = JSON.parse(localCached);
      lastSyncTime = parseInt(localTime, 10);
    }
  }
} catch (e) {
  console.warn("Session storage read failed:", e);
}

const BRANDS_LIST = ["Tümü", "TVS", "Hero", "Falcon", "Işıldar", "RapidoX", "Kuba", "RKS", "Mondial", "HONDA", "BAJAJ", "BANDO", "NGK", "VARTA", "CFMOTO", "YAMAHA", "SUZUKI", "VESPA", "SYM"] as const;

const CATEGORIES_LIST = [
  { slug: "tumu", name: "Tüm Kategoriler" },
  { slug: "motor-parcalari", name: "Motor Parçaları" },
  { slug: "elektrik-sistemi", name: "Elektrik Sistemi" },
  { slug: "fren-sistemi", name: "Fren & Debriyaj" },
  { slug: "kaporta-aksesuar", name: "Kaporta & Aksesuar" },
  { slug: "sarf-malzeme", name: "Sarf Malzemeleri (Yağ, Balata vb.)" }
];

const YedekParca = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const brandMatchMap: Record<string, string> = {
    "/tvs-motosiklet-yedek-parca": "TVS",
    "/hero-motosiklet-yedek-parca": "Hero",
    "/honda-motosiklet-yedek-parca": "HONDA",
    "/yamaha-motosiklet-yedek-parca": "YAMAHA",
    "/falcon-motosiklet-yedek-parca": "Falcon",
    "/isildar-motosiklet-yedek-parca": "Işıldar",
  };
  
  const initialBrand = brandMatchMap[location.pathname] || "Tümü";

  // Master state: DB'den çekilen ürünler
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lastDocs, setLastDocs] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtreler State'i
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [activeBrand, setActiveBrand] = useState<string>(initialBrand);
  const [activeCategory, setActiveCategory] = useState<string>("tumu");

  useEffect(() => {
    const handler = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [tempMinPrice, setTempMinPrice] = useState<string>("");
  const [tempMaxPrice, setTempMaxPrice] = useState<string>("");
  
  // Sıralama & Görünüm State'i
  const [sortBy, setSortBy] = useState<string>("recommended"); // recommended, price-asc, price-desc, name-asc, name-desc
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Sayfalama (Pagination) State'i
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16; // E-ticaret standardı sayfa başına 16 ürün

  // Mobil Filtre Drawer/Modal Kontrolü
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const fetchActiveProductsFromDB = async (): Promise<Product[]> => {
    let allData: Product[] = [];
    let from = 0;
    const step = 1000;
    let hasMoreData = true;

    const fetchWithRetry = async (fromVal: number): Promise<Product[]> => {
      let retries = 3;
      let delay = 800;
      while (retries > 0) {
        try {
          const { data, error: fetchError } = await supabase
            .from("products")
            .select("*")
            .in("category", ["yedek-parca", "aksesuar"])
            .eq("is_active", true)
            .range(fromVal, fromVal + step - 1);

          if (fetchError) throw fetchError;
          return (data as any[]) || [];
        } catch (err: any) {
          retries--;
          const errMessage = err?.message || String(err);
          if (retries === 0) {
            throw err;
          }
          console.warn(`Sessiz arka plan senkronize denemesi başarısız oldu, yeniden deneniyor... Kalan deneme: ${retries}. Hata: ${errMessage}`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        }
      }
      return [];
    };

    while (hasMoreData) {
      const data = await fetchWithRetry(from);

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        from += step;
        if (data.length < step) {
          hasMoreData = false;
        }
      } else {
        hasMoreData = false;
      }
    }
    return allData;
  };

  const loadProducts = async (forceSync = false) => {
    try {
      const now = Date.now();
      const needsSync = !lastSyncTime || (now - lastSyncTime > 5 * 60 * 1000); // 5 dakika

      if (cachedProductsList && !forceSync) {
        setAllProducts(cachedProductsList);
        setLoading(false);
        // Sadece 5 dakikadan önce güncellendiyse arka planda sessizce senkronize et
        if (needsSync) {
          silentSync();
        }
        return;
      }

      setLoading(true);
      setError(null);
      const data = await fetchActiveProductsFromDB();
      cachedProductsList = data;
      lastSyncTime = Date.now();
      
      // Save to sessionStorage to fast-load on subsequent visits or reload
      try {
        sessionStorage.setItem("pasa_motor_yedek_parca_cache", JSON.stringify(data));
        sessionStorage.setItem("pasa_motor_yedek_parca_time", lastSyncTime.toString());
      } catch (e) {
        console.warn("Session storage write failed:", e);
      }

      setAllProducts(data);
    } catch (err: any) {
      console.error("Yedek parça yükleme hatası:", err);
      // Failover to local cache if possible so user has immediate access
      try {
        const localCached = sessionStorage.getItem("pasa_motor_yedek_parca_cache");
        if (localCached) {
          const fallbackData = JSON.parse(localCached);
          setAllProducts(fallbackData);
          cachedProductsList = fallbackData;
          setError(null);
          return;
        }
      } catch (cacheErr) {
        console.warn("Önbellekten yedek parça kurtarma başarısız oldu:", cacheErr);
      }
      setError(err.message || "Ürün listesi yüklenirken bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const silentSync = async () => {
    try {
      const data = await fetchActiveProductsFromDB();
      cachedProductsList = data;
      lastSyncTime = Date.now();
      
      try {
        sessionStorage.setItem("pasa_motor_yedek_parca_cache", JSON.stringify(data));
        sessionStorage.setItem("pasa_motor_yedek_parca_time", lastSyncTime.toString());
      } catch (e) {
        console.warn("Session storage write failed:", e);
      }

      setAllProducts(data);
    } catch (err: any) {
      console.warn("Sessiz arka plan senkronizasyonu geçici bir ağ aksaklığı nedeniyle ertelendi. Mevcut önbellek kullanılmaya devam ediyor:", err?.message || err);
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtreleri Sıfırlama
  const handleResetFilters = () => {
    setSearchInput("");
    setSearch("");
    setActiveBrand("Tümü");
    setActiveCategory("tumu");
    setOnlyInStock(false);
    setMinPrice("");
    setMaxPrice("");
    setTempMinPrice("");
    setTempMaxPrice("");
    setSortBy("recommended");
    setCurrentPage(1);
  };

  // Dinamik olarak her marka için ürün sayısını hesaplama (Tüm DB üzerinden - Harf duyarsız)
  const brandStats = useMemo(() => {
    const stats: Record<string, number> = { Tümü: allProducts.length };
    BRANDS_LIST.forEach(b => {
      if (b !== "Tümü") {
        stats[b] = allProducts.filter(p => p.brand?.trim().toLowerCase() === b.toLowerCase()).length;
      }
    });
    return stats;
  }, [allProducts]);

  // Dinamik olarak her kategori için ürün sayısını hesaplama (Tüm DB üzerinden)
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { tumu: allProducts.length };
    CATEGORIES_LIST.forEach(cat => {
      if (cat.slug !== "tumu") {
        stats[cat.slug] = allProducts.filter(p => {
          const titleL = p.title?.toLowerCase() || "";
          switch (cat.slug) {
            case "motor-parcalari":
              return titleL.includes("silindir") || titleL.includes("piston") || titleL.includes("krank") || titleL.includes("conta") || titleL.includes("motor") || titleL.includes("subap") || titleL.includes("karbüratör");
            case "elektrik-sistemi":
              return titleL.includes("ampul") || titleL.includes("buji") || titleL.includes("beyin") || titleL.includes("statör") || titleL.includes("far") || titleL.includes("sinyal") || titleL.includes("akü") || titleL.includes("varta") || titleL.includes("kablo");
            case "fren-sistemi":
              return titleL.includes("balata") || titleL.includes("disk") || titleL.includes("fren") || titleL.includes("debriyaj") || titleL.includes("tel") || titleL.includes("manet");
            case "kaporta-aksesuar":
              return p.category === "aksesuar" || titleL.includes("çamurluk") || titleL.includes("grenaj") || titleL.includes("ayna") || titleL.includes("sele") || titleL.includes("kilit") || titleL.includes("çanta") || titleL.includes("sehpa") || titleL.includes("eldiven") || titleL.includes("kask");
            case "sarf-malzeme":
              return titleL.includes("yağ") || titleL.includes("filtre") || titleL.includes("bando") || titleL.includes("kayış") || titleL.includes("zincir") || titleL.includes("sprey");
            default:
              return true;
          }
        }).length;
      }
    });
    return stats;
  }, [allProducts]);

  // Filtrelenmiş Ürün Listesi (Yerelde muazzam hızlı ve performanslı işleme)
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Arama Filtresi (Debounced olmayan ancak anlık reaktif arama)
    if (search.trim()) {
      const queryStr = search.toLowerCase().trim();
      result = result.filter(
        p => 
          (p.title && p.title.toLowerCase().includes(queryStr)) || 
          (p.sku && p.sku.toLowerCase().includes(queryStr)) ||
          (p.brand && p.brand.toLowerCase().includes(queryStr)) ||
          (p.description && p.description.toLowerCase().includes(queryStr))
      );
    }

    // 2. Marka Filtresi
    if (activeBrand !== "Tümü") {
      result = result.filter(p => p.brand?.trim().toLowerCase() === activeBrand.toLowerCase());
    }

    // 3. Kategori Filtresi (Eğer ürün verisinde alt kategori / tags varsa)
    if (activeCategory !== "tumu") {
      result = result.filter(p => {
        const titleL = p.title?.toLowerCase() || "";
        const descL = p.description?.toLowerCase() || "";
        const contentL = p.content?.toLowerCase() || "";
        
        switch (activeCategory) {
          case "motor-parcalari":
            return titleL.includes("silindir") || titleL.includes("piston") || titleL.includes("krank") || titleL.includes("conta") || titleL.includes("motor") || titleL.includes("subap") || titleL.includes("karbüratör");
          case "elektrik-sistemi":
            return titleL.includes("ampul") || titleL.includes("buji") || titleL.includes("beyin") || titleL.includes("statör") || titleL.includes("far") || titleL.includes("sinyal") || titleL.includes("akü") || titleL.includes("varta") || titleL.includes("kablo");
          case "fren-sistemi":
            return titleL.includes("balata") || titleL.includes("disk") || titleL.includes("fren") || titleL.includes("debriyaj") || titleL.includes("tel") || titleL.includes("manet");
          case "kaporta-aksesuar":
            return p.category === "aksesuar" || titleL.includes("çamurluk") || titleL.includes("grenaj") || titleL.includes("ayna") || titleL.includes("sele") || titleL.includes("kilit") || titleL.includes("çanta") || titleL.includes("sehpa") || titleL.includes("eldiven") || titleL.includes("kask");
          case "sarf-malzeme":
            return titleL.includes("yağ") || titleL.includes("filtre") || titleL.includes("bando") || titleL.includes("kayış") || titleL.includes("zincir") || titleL.includes("sprey");
          default:
            return true;
        }
      });
    }

    // 4. Stok Durumu Filtresi
    if (onlyInStock) {
      result = result.filter(p => (p.stock ?? 0) > 0);
    }

    // 5. Fiyat Aralığı Filtresi
    if (minPrice !== "") {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        result = result.filter(p => (p.price ?? 0) >= min);
      }
    }
    if (maxPrice !== "") {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        result = result.filter(p => (p.price ?? 0) <= max);
      }
    }

    // 6. Sıralama (Sorting) İşlemi
    result.sort((a, b) => {
      // Önce stokta olanları öne çıkar
      const isAInStock = (a.stock ?? 0) > 0;
      const isBInStock = (b.stock ?? 0) > 0;

      if (isAInStock && !isBInStock) return -1;
      if (!isAInStock && isBInStock) return 1;

      const priceA = a.price ?? 0;
      const priceB = b.price ?? 0;
      const titleA = a.title ?? "";
      const titleB = b.title ?? "";
      
      switch (sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "name-asc":
          return titleA.localeCompare(titleB, "tr");
        case "name-desc":
          return titleB.localeCompare(titleA, "tr");
        case "recommended":
        default: {
          const aTitleL = titleA.toLowerCase();
          const bTitleL = titleB.toLowerCase();
          // Trends tabanlı, en çok aranan bakım ve sarf ürünlerini öne çıkaran puanlama
          const keywords = ["balata", "kayış", "buji", "disk", "debriyaj", "yağ", "zincir", "kablo"];
          const getScore = (val: string) => {
            let s = 0;
            keywords.forEach((k, idx) => {
               if (val.includes(k)) s += (keywords.length - idx) * 10;
            });
            // Akü'leri ilk sayfadan uzaklaştırmak için eksi puan
            if (val.includes("akü") || val.includes("aku")) s -= 100;
            return s;
          };
          const scoreA = getScore(aTitleL);
          const scoreB = getScore(bTitleL);
          if (scoreA !== scoreB) return scoreB - scoreA;
          
          // Karışık, ilgi çekici bir listeleme için ürün ID'sine dayalı pseudo-random (karma) sıralama
          const hashString = (str: string) => {
            let h = 0;
            for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
            return h;
          };
          
          const hashA = hashString(a.id || a.title || "a");
          const hashB = hashString(b.id || b.title || "b");

          return hashB - hashA;
        }
      }
    });

    return result;
  }, [allProducts, search, activeBrand, activeCategory, onlyInStock, minPrice, maxPrice, sortBy]);

  // Filtreler değiştikçe sayfa numarasını 1'e çek
  useEffect(() => {
    setCurrentPage(1);
  }, [search, activeBrand, activeCategory, onlyInStock, minPrice, maxPrice, sortBy]);

  // Fiyat Filtresini Uygula Butonu İşlemi
  const handleApplyPriceFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
  };

  // Local pagination based on filtered items
  const paginatedProducts = useMemo(() => {
    const from = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(from, from + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // Akıllı Sayfa Numaraları Üretici (Örn: "1 ... 4 5 6 ... 128")
  const pageNumbers = useMemo(() => {
    const range: (number | string)[] = [];
    const delta = 1; // Aktif sayfanın kaç sağı ve solu gösterilsin

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || 
        i === totalPages || 
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      } else if (range[range.length - 1] !== "...") {
        range.push("...");
      }
    }
    return range;
  }, [currentPage, totalPages]);

  // Schema SEO Yapılandırılması
  const origin = typeof window !== "undefined" ? window.location.origin : "https://pasamotor.com.tr";
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: filteredProducts.slice(0, itemsPerPage).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${origin}/yedek-parca/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <Layout>
      <SEO
        title="Yedek Parça Kataloğu - TVS, Hero, Honda, Bajaj Orijinal Yedek Parçalar"
        description="Motosiklet yedek parçalarında e-ticaret kolaylığı! 2000'den fazla TVS, Hero, Falcon, Honda, Bajaj orijinal yedek parçası. Akıllı filtreleme ve uygun fiyatlarla."
        canonical="/yedek-parca"
        keywords="motosiklet yedek parça, tvs yedek parça, hero orjinal parça, honda parça, akıllı parça arama, pasamotor, fatih motosiklet yedek parça"
      />
      <JsonLd data={itemListSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "Yedek Parça", url: "/yedek-parca" },
        ])}
      />

      <section className="min-h-screen bg-[#0d0f14] py-12 md:py-16 text-foreground relative overflow-hidden">
        {/* Dekoratif Arka Plan Işıkları */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          
          {/* Breadcrumb & Katalog Başlığı */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl text-foreground mb-4 tracking-tight">
              Yedek Parça <span className="text-primary">Kataloğu</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-sm md:text-base leading-relaxed">
              TVS, Hero, Falcon, Honda, Bajaj ve Işıldar motosikletleri için orijinal ve yüksek kaliteli muadil parçalar. Akıllı filtreleri kullanarak 2000+ ürün arasından aradığınız parçayı saniyeler içinde bulun.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* SOL KOLON - Gelişmiş Filtre Sidebar (Masaüstü) */}
            <aside className="hidden lg:block lg:col-span-1 space-y-6">
              <div className="glass-card rounded-2xl border border-border/40 p-6 sticky top-24 space-y-6">
                
                {/* Başlık & Temizle */}
                <div className="flex items-center justify-between pb-4 border-b border-border/45">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <span className="font-heading font-semibold text-foreground text-base">Filtreleme</span>
                  </div>
                  <button 
                    onClick={handleResetFilters}
                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Temizle
                  </button>
                </div>

                {/* Arama Kutusu */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Arama</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Kod, başlık veya marka..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-background/50 border border-border/80 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                    {searchInput && (
                      <button 
                        onClick={() => { setSearchInput(""); setSearch(""); }} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Kategoriler */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kategoriler</label>
                  <div className="space-y-1 max-h-56 overflow-y-auto pr-1 flex flex-col">
                    {CATEGORIES_LIST.map((cat) => {
                      const count = categoryStats[cat.slug] || 0;
                      return (
                        <button
                          key={cat.slug}
                          onClick={() => setActiveCategory(cat.slug)}
                          className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                            activeCategory === cat.slug
                              ? "bg-primary/10 text-primary border-l-2 border-primary pl-2"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            activeCategory === cat.slug ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Markalar */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Markalar</label>
                  <div className="space-y-1 max-h-60 overflow-y-auto pr-1 flex flex-col">
                    {BRANDS_LIST.map((brand) => {
                      const count = brandStats[brand] || 0;
                      return (
                        <button
                          key={brand}
                          onClick={() => setActiveBrand(brand)}
                          className={`text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                            activeBrand === brand
                              ? "bg-primary/10 text-primary border-l-2 border-primary pl-2"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                          }`}
                        >
                          <span>{brand}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                            activeBrand === brand ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fiyat Aralığı */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fiyat Aralığı (TL)</label>
                  <form onSubmit={handleApplyPriceFilter} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={tempMinPrice}
                        onChange={(e) => setTempMinPrice(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-background/50 border border-border text-foreground text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <span className="text-muted-foreground text-xs">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={tempMaxPrice}
                        onChange={(e) => setTempMaxPrice(e.target.value)}
                        className="w-full px-2 py-1.5 rounded-lg bg-background/50 border border-border text-foreground text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-muted text-foreground hover:bg-primary hover:text-primary-foreground rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      Uygula
                    </button>
                  </form>
                </div>

                {/* Stok Durumu */}
                <div className="space-y-2 pt-2 border-t border-border/30">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="rounded border-border bg-background text-primary focus:ring-primary/50 focus:ring-offset-0 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-foreground">Sadece Stokta Olanlar</span>
                  </label>
                </div>

              </div>
            </aside>

            {/* SAĞ KOLON - Ürün Kataloğu ve Toolbar */}
            <main className="lg:col-span-3 space-y-6">
              
              {/* ÜST BAR (Katalog Toolbar) */}
              <div className="glass-card rounded-2xl border border-border/40 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Ürün Sayısı */}
                <div className="text-sm text-muted-foreground text-center md:text-left">
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="w-4 h-4 animate-pulse text-primary" /> Ürünler taranıyor...
                    </span>
                  ) : (
                    <span>
                      Bulunan Yedek Parça: <strong className="text-foreground text-base">{filteredProducts.length}</strong>
                    </span>
                  )}
                </div>

                {/* Sıralama ve Görünüm Kontrolleri */}
                <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
                  
                  {/* Mobil Filtre Butonu (Sadece mobilde görünür) */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    Filtrele
                  </button>

                  {/* Sıralama Seçici */}
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-background/90 text-foreground border border-border rounded-xl px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="recommended">Önerilen (Popüler)</option>
                      <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                      <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                      <option value="name-asc">Parça İsmi: A-Z</option>
                      <option value="name-desc">Parça İsmi: Z-A</option>
                    </select>
                  </div>

                  {/* Görünüm Değiştirici (Grid / List) */}
                  <div className="flex items-center rounded-xl bg-background/50 border border-border p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === "grid" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="Kutu Görünümü"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        viewMode === "list" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="Liste Görünümü"
                    >
                      <List className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </div>

              {/* Hata Durumu */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl text-center">
                  {error}
                  <button 
                    onClick={() => window.location.reload()}
                    className="ml-3 underline font-semibold text-xs hover:text-destructive-foreground"
                  >
                    Tekrar Dene
                  </button>
                </div>
              )}

              {/* ÜRÜN FEED (Loading / Grid / List / No Data) */}
              {loading ? (
                /* Skeleton Yükleme Ekranı */
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" 
                    : "space-y-4"
                }>
                  {Array.from({ length: itemsPerPage }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`glass-card rounded-2xl border border-border/20 p-4 animate-pulse ${
                        viewMode === "list" ? "flex flex-col sm:flex-row gap-4 h-auto" : ""
                      }`}
                    >
                      <div className={`bg-muted rounded-xl bg-white/5 ${
                        viewMode === "list" ? "w-full sm:w-44 h-36 shrink-0" : "w-full h-44 mb-4"
                      }`} />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-white/5 rounded w-2/5" />
                        <div className="h-3 bg-white/5 rounded w-4/5" />
                        <div className="h-3 bg-white/5 rounded w-3/5" />
                        <div className="h-6 bg-white/5 rounded w-1/4 pt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : paginatedProducts.length > 0 ? (
                /* Ürün Kartları Listesi */
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6" 
                    : "space-y-4"
                }>
                  {paginatedProducts.map((p) => {
                    const inStock = (p.stock ?? 0) > 0;
                    const isOriginal = p.title?.toLowerCase().includes("orjinal") || 
                                       p.title?.toLowerCase().includes("orijinal") ||
                                       p.title?.toLowerCase().includes("orjınal") ||
                                       p.title?.toLowerCase().includes("orijınal");
                    
                    return (
                      <div
                        key={p.id}
                        onClick={() => navigate(`/yedek-parca/${p.slug}`)}
                        className={`glass-card rounded-2xl border bg-[#121620]/60 overflow-hidden group transition-all duration-300 flex cursor-pointer ${
                          isOriginal 
                            ? "border-emerald-500/10 hover:border-emerald-500/40" 
                            : "border-white/[0.04] hover:border-primary/40"
                        } ${
                          viewMode === "list" 
                            ? "flex-col sm:flex-row h-auto sm:h-44 p-4 gap-5" 
                            : "flex-col p-4"
                        }`}
                      >
                        {/* Ürün Görseli */}
                        <div className={`relative overflow-hidden rounded-xl shrink-0 ${
                          viewMode === "list" 
                            ? "w-full sm:w-40 h-36 bg-white flex items-center justify-center border border-border" 
                            : "w-full h-44 mb-3 bg-white flex items-center justify-center border border-border"
                        }`}>
                          {p.images && p.images.length > 0 ? (
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              width={240}
                              height={176}
                              referrerPolicy="no-referrer"
                              className="max-w-full max-h-full w-auto h-auto object-contain p-4 transition-transform duration-500 hover:scale-110 mix-blend-multiply"
                              loading="lazy"
                            />
                          ) : (
                            <ProductImagePlaceholder brand={p.brand || "ALT-GRUP"} />
                          )}

                          {/* Stok Rozeti ve Overlay */}
                          {!inStock && (
                            <div className="absolute inset-0 bg-[#0d0f14]/80 backdrop-blur-xs flex items-center justify-center rounded-xl z-20">
                              <span className="text-[10px] font-extrabold tracking-wider text-red-400 bg-red-950/40 border border-red-500/20 px-2.5 py-1 rounded-full uppercase">
                                Stokta Yok
                              </span>
                            </div>
                          )}
                          
                          {isOriginal && (
                            <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/25 flex items-center gap-1 uppercase tracking-wider z-10 border border-emerald-400/30 backdrop-blur-xs">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-100" /> Orijinal Parça
                            </div>
                          )}
                        </div>

                        {/* Ürün Detayları */}
                        <div className="flex-1 flex flex-col justify-between pt-1">
                          <div>
                            {/* Üst Satır - Marka & Durum */}
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase ${
                                isOriginal 
                                  ? "text-emerald-500/95 bg-emerald-500/10 border border-emerald-500/20" 
                                  : "text-primary/90 bg-primary/5 border border-primary/10"
                              }`}>
                                {p.brand || "ALT-GRUP"}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono truncate">
                                Kod: {p.sku || "-"}
                              </span>
                            </div>

                            {/* Ürün Başlığı */}
                            <h3 className="font-heading font-semibold text-foreground text-sm leading-snug tracking-tight mb-1.5 group-hover:text-primary transition-colors line-clamp-2 uppercase">
                              {p.title}
                            </h3>

                            {/* Ek açıklama (sadece list modunda) */}
                            {viewMode === "list" && p.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                                {p.description}
                              </p>
                            )}
                          </div>

                          {/* Fiyat ve Eylem Alanı */}
                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/[0.04]">
                            <div>
                              {p.price ? (
                                <div className="space-y-0.5">
                                  {(p.original_price ?? 0) > p.price ? (
                                    <span className="text-[10px] text-muted-foreground line-through block font-mono">
                                      {new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(p.original_price || 0)} TL
                                    </span>
                                  ) : null}
                                  <span className="font-heading font-extrabold text-base text-foreground block">
                                    {new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(p.price)} TL
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground italic font-medium">Fiyat Sorunuz</span>
                              )}
                            </div>

                            {/* Whatsapp hızlı sipariş butonu */}
                            <a
                              href={`https://wa.me/905348996817?text=${encodeURIComponent(`Merhaba, ${p.title || ""}${p.sku ? ", " + p.sku : ""} (Marka: ${p.brand || ""}, Fiyat: ${p.price ? p.price + " TL" : "Fiyat Sorun"}) Bu ürünü sipariş vermek istiyorum.`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10 border border-emerald-400/25 shrink-0"
                              title="Sipariş Ver"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Sipariş Ver</span>
                            </a>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Sonuç Bulunamadı */
                <div className="glass-card rounded-2xl border border-border/40 py-20 text-center">
                  <Inbox className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-foreground font-heading font-semibold text-lg mb-2">Arama Kriterlerine Uygun Parça Bulunamadı</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                    Filtreleri esneterek veya arama kelimesini değiştirerek tekrar deneyebilirsiniz. Kataloğumuzda yer almayan özel parçalar için bizimle doğrudan iletişime geçebilirsiniz.
                  </p>
                  <button 
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl shadow hover:bg-primary/90 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Tüm Filtreleri Temizle
                  </button>
                </div>
              )}

              {/* ALT KISIM (Paginated Navigation Controls) */}
              {!loading && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/[0.04]">
                  
                  {/* Sayfa Bilgisi */}
                  <div className="text-xs text-muted-foreground">
                    Toplam <strong className="text-foreground">{filteredProducts.length}</strong> üründen{" "}
                    <strong className="text-foreground">{(currentPage - 1) * itemsPerPage + 1}</strong> ile{" "}
                    <strong className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</strong> arası gösteriliyor
                  </div>

                  {/* Sayfalama Butonları */}
                  <div className="flex items-center gap-1.5">
                    
                    {/* Önceki Sayfa */}
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted/70 disabled:opacity-40 disabled:hover:bg-background transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Sayfa Sayıları */}
                    {pageNumbers.map((p, idx) => {
                      if (p === "...") {
                        return (
                          <span key={`ellipsis-${idx}`} className="px-2.5 py-1 text-xs text-muted-foreground select-none">
                            ...
                          </span>
                        );
                      }
                      return (
                        <button
                          key={`page-${p}`}
                          onClick={() => setCurrentPage(Number(p))}
                          className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            currentPage === p
                              ? "bg-primary text-primary-foreground shadow"
                              : "bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted/70"
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}

                    {/* Sonraki Sayfa */}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground hover:bg-muted/70 disabled:opacity-40 disabled:hover:bg-background transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              )}

            </main>

          </div>

        </div>
      </section>

      {/* Türkiye Geneline Kargo Section */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border/40 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Türkiye'nin Her Yerine Kargo ile Gönderiyoruz</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              İstanbul Fatih'teki yetkili servisimizden Türkiye'nin dört bir yanına orijinal parçaları aynı gün kargoya veriyoruz.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {CITIES.map(city => (
              <Link 
                key={city.slug} 
                to={`/sehir/${city.slug}`}
                className="bg-card border border-border hover:border-primary px-4 py-3 rounded-xl text-center transition-colors shadow-sm cursor-pointer"
              >
                <div className="font-semibold text-foreground text-sm">{city.name}</div>
                <div className="text-xs text-muted-foreground mt-1">Motosiklet Yedek Parça</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MOBİL FİLTER DRAWERS (Zarif Popup Çekmece) */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-[#0d0f14]/85 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-[#0d0f14] border-l border-border/40 p-6 flex flex-col justify-between relative shadow-2xl overflow-y-auto">
              
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <span className="font-heading font-semibold text-foreground text-sm">Filtrele</span>
                  </div>
                  <button 
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="p-1 rounded-lg bg-white/5 border border-white/[0.05] text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Arama */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Arama</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Başlık, kod veya marka..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-background/50 border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Kategoriler */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Kategoriler</label>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1 flex flex-col">
                    {CATEGORIES_LIST.map((cat) => {
                      const count = categoryStats[cat.slug] || 0;
                      return (
                        <button
                          key={cat.slug}
                          onClick={() => {
                            setActiveCategory(cat.slug);
                          }}
                          className={`text-left px-2 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                            activeCategory === cat.slug
                              ? "bg-primary/10 text-primary border-l-2 border-primary pl-2"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                          }`}
                        >
                          <span>{cat.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                            activeCategory === cat.slug ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Markalar */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Markalar</label>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1 flex flex-col">
                    {BRANDS_LIST.map((brand) => {
                      const count = brandStats[brand] || 0;
                      return (
                        <button
                          key={brand}
                          onClick={() => {
                            setActiveBrand(brand);
                          }}
                          className={`text-left px-2 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                            activeBrand === brand
                              ? "bg-primary/10 text-primary border-l-2 border-primary pl-2"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                          }`}
                        >
                          <span>{brand}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fiyat Aralığı */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Fiyat Aralığı</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={tempMinPrice}
                      onChange={(e) => setTempMinPrice(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-background/50 border border-border text-foreground text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <span className="text-muted-foreground text-xs">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={tempMaxPrice}
                      onChange={(e) => setTempMaxPrice(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg bg-background/50 border border-border text-foreground text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Sadece stokta olanlar */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                      className="rounded border-border bg-background text-primary focus:ring-primary/50 focus:ring-offset-0 w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-foreground">Sadece Stokta Olanlar</span>
                  </label>
                </div>

              </div>

              {/* Alt Butonlar */}
              <div className="pt-6 border-t border-white/[0.04] space-y-2">
                <button
                  onClick={() => {
                    handleApplyPriceFilter();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full py-2 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Filtreleri Uygula
                </button>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full py-2 bg-muted hover:bg-white/5 text-foreground text-xs font-semibold rounded-xl transition-all border border-white/[0.03] cursor-pointer"
                >
                  Sıfırla
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default YedekParca;
