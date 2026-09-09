import { useState, useMemo, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import {
  ShieldCheck,
  Phone,
  MessageCircle,
  Gauge,
  Zap,
  CreditCard,
  CheckCircle2,
  X,
  Layers,
  MapPin,
  Clock,
  Gift,
  Search,
  Flame,
  Award,
  Fuel,
  BatteryCharging,
  ArrowUpDown,
  ChevronRight,
  Scale,
  Calculator,
  SlidersHorizontal,
  ShoppingBag,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { MOTORCYCLES, Motorcycle } from "@/data/motorcycles";
import { useMotorcycles } from "@/hooks/useMotorcycles";
import { formatColorName } from "@/lib/colorUtils";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

const HeroShowroom3D = lazy(() => import("@/components/magaza/HeroShowroom3D").then(m => ({ default: m.HeroShowroom3D || m.default })));
const MotorcycleCompareModal = lazy(() => import("@/components/magaza/MotorcycleCompareModal"));
const InstallmentCalculatorModal = lazy(() => import("@/components/magaza/InstallmentCalculatorModal"));

const tl = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);

const Magaza = () => {
  const { addItem } = useCart();
  const { 
    data: motorcyclesData = MOTORCYCLES,
    isFetching,
    refetch,
  } = useMotorcycles();
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [selectedColorIndex, setSelectedColorIndex] = useState<{ [key: string]: number }>({});
  
  // Comparison & Calculator state
  const [comparedBikes, setComparedBikes] = useState<Motorcycle[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [calculatorBike, setCalculatorBike] = useState<Motorcycle | null>(null);
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState<boolean>(false);

  const [displayedCount, setDisplayedCount] = useState<number>(12);

  useEffect(() => {
    setDisplayedCount(12);
  }, [selectedCategory, searchQuery, sortBy, motorcyclesData]);

  const categories = [
    { id: "all", label: "TÜM ÜRÜNLER" },
    { id: "E-CAR", label: "E-CAR" },
    { id: "ENDURO / CROSS", label: "ENDURO / CROSS" },
    { id: "CHOPPER", label: "CHOPPER" },
    { id: "SCOOTER", label: "SCOOTER" },
    { id: "TOURING", label: "TOURING" },
    { id: "E-GRUP", label: "E-GRUP" },
    { id: "CUB", label: "CUB" },
    { id: "E-TRICYCLE", label: "E-TRICYCLE" },
    { id: "UTV", label: "UTV" },
    { id: "GOLF BUGGY", label: "GOLF BUGGY" },
    { id: "ÇOCUK GRUBU", label: "ÇOCUK GRUBU" },
  ];

  const filteredMotorcycles = useMemo(() => {
    let list = motorcyclesData.filter((bike) => {
      const matchCategory = selectedCategory === "all" || bike.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        bike.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.engineSize.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.licenseType.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else {
      list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy, motorcyclesData]);

  const handleColorChange = (bikeId: string, index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedColorIndex((prev) => ({ ...prev, [bikeId]: index }));
  };

  const toggleCompare = (bike: Motorcycle, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (comparedBikes.some((b) => b.id === bike.id)) {
      setComparedBikes((prev) => prev.filter((b) => b.id !== bike.id));
      toast.info(`${bike.model} karşılaştırma listesinden çıkarıldı.`);
    } else {
      if (comparedBikes.length >= 3) {
        toast.warning("En fazla 3 motosiklet aynı anda karşılaştırılabilir.");
        return;
      }
      setComparedBikes((prev) => [...prev, bike]);
      toast.success(`${bike.model} karşılaştırma listesine eklendi!`);
    }
  };

  const openCalculator = (bike: Motorcycle) => {
    setCalculatorBike(bike);
    setIsCalculatorModalOpen(true);
  };

  return (
    <Layout>
      <Helmet>
        <title>MotoLux 0 KM Motosiklet & 3D Showroom | Paşa Motor Fatih</title>
        <meta
          name="description"
          content="Paşa Motor Resmî MotoLux Yetkili Satış Bayisi. 3D silindir vitrinde Americano 125, Rossi 50 RS, Cappadocia 125, CEO 110, Drift 200 ve 60'tan fazla modeli kredi kartına 3-6-9-12 taksit ve garantiyle inceleyin."
        />
      </Helmet>

      <div className="bg-background min-h-screen pt-24 pb-20">
        
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* ========================================================================= */}
          {/* 3D CYLINDRICAL SHOWROOM HERO PLATFORM (3D SILINDIR PLATFORM HERO)         */}
          {/* ========================================================================= */}
          <Suspense fallback={<div className="h-[500px] w-full rounded-3xl bg-card border border-border/80 flex items-center justify-center mb-12 animate-pulse"><div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div></div>}>
            <HeroShowroom3D onOpenLoanCalculator={openCalculator} />
          </Suspense>

          {/* ========================================================================= */}
          {/* TRUST & ADVANTAGE TILES                                                   */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
            <div className="p-4 rounded-2xl bg-card border border-border/80 flex items-center gap-3 shadow-sm">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">0 KM Resmî Garanti</h4>
                <p className="text-[11px] text-muted-foreground">2 Yıl Yetkili Bayi Güvencesi</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 flex items-center gap-3 shadow-sm">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">3 - 6 - 9 - 12 Taksit</h4>
                <p className="text-[11px] text-muted-foreground">Tüm Kredi Kartlarına Uygun</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 flex items-center gap-3 shadow-sm">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">B Sınıfı Ehliyet</h4>
                <p className="text-[11px] text-muted-foreground">50cc ile MTV & Sigortasız</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/80 flex items-center gap-3 shadow-sm">
              <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Hediye Kask & Kilit</h4>
                <p className="text-[11px] text-muted-foreground">Mağaza Teslim Paketi</p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* FILTER & SEARCH TOOLBAR                                                   */}
          {/* ========================================================================= */}
          <div className="bg-card border border-border rounded-3xl p-5 mb-8 shadow-sm space-y-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === c.id
                      ? "bg-red-600 text-white shadow-md shadow-red-600/25 scale-[1.02]"
                      : "bg-muted/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Sub Controls: Search, Counter, Sort & Compare Launcher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60">
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Model adı, 50cc, 125cc, elektrikli ara..."
                  className="w-full pl-9 pr-8 py-2.5 text-xs rounded-xl bg-muted border border-border focus:border-red-500 outline-none text-foreground transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between sm:justify-end w-full sm:w-auto gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium">
                    Toplam <strong className="text-foreground">{filteredMotorcycles.length}</strong> MotoLux modeli
                  </span>
                  {isFetching && (
                    <span 
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse"
                      title="Stale-While-Revalidate: Arka planda en güncel bayi kataloğu ve fiyatları senkronize ediliyor"
                    >
                      <RotateCw className="w-2.5 h-2.5 animate-spin" />
                      <span className="hidden sm:inline">Canlı Güncelleniyor</span>
                    </span>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-muted border border-border rounded-xl px-3 py-2 text-xs text-foreground outline-none focus:border-red-500"
                  >
                    <option value="featured">Öne Çıkanlar</option>
                    <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                    <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                  </select>
                </div>

                {/* Floating Compare Trigger Button */}
                {comparedBikes.length > 0 && (
                  <button
                    onClick={() => setIsCompareModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 hover:scale-105 transition-all"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    Karşılaştır ({comparedBikes.length})
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* MOTORCYCLE CARDS GRID                                                     */}
          {/* ========================================================================= */}
          {filteredMotorcycles.length === 0 ? (
            <div className="text-center py-16 bg-card/40 border border-border rounded-3xl p-8">
              <Layers className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-lg text-foreground mb-1">Aradığınız Kriterde MotoLux Modeli Bulunamadı</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto mb-4">
                Filtreleri sıfırlayarak tüm MotoLux modellerini görüntüleyebilir veya doğrudan showroom danışmanımıza danışabilirsiniz.
              </p>
              <button
                onClick={() => { setSelectedCategory("all"); setSearchQuery(""); }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                Tüm Modelleri Göster
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredMotorcycles.slice(0, displayedCount).map((bike) => {
                  const activeColorIndex = selectedColorIndex[bike.id] || 0;
                  const activeColor = bike.colors[activeColorIndex] || bike.colors[0];
                  
                  let targetIdx = activeColorIndex;
                  if (activeColor) {
                    if (typeof activeColor.imageIndex === "number" && activeColor.imageIndex >= 0 && activeColor.imageIndex < bike.images.length) {
                      targetIdx = activeColor.imageIndex;
                    } else if (activeColor.imageUrl) {
                      const found = bike.images.indexOf(activeColor.imageUrl);
                      if (found !== -1) targetIdx = found;
                    }
                  }
                  const activeImage = activeColor?.imageUrl || bike.images[targetIdx] || bike.images[0];
                  const isCompared = comparedBikes.some((b) => b.id === bike.id);

                  return (
                  <div
                    key={bike.id}
                    className="group relative rounded-3xl bg-card border border-border hover:border-red-500/60 shadow-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Top Badges & Compare Button */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-black uppercase tracking-wider shadow">
                          {bike.condition}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur-md border border-border text-foreground text-[10px] font-bold">
                          {bike.brand}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 pointer-events-auto">
                        <button
                          onClick={(e) => toggleCompare(bike, e)}
                          className={`p-2 rounded-xl backdrop-blur-md border transition-all text-[11px] font-semibold flex items-center gap-1 shadow-sm ${
                            isCompared
                              ? "bg-amber-500 text-black border-amber-400 font-bold"
                              : "bg-background/80 hover:bg-background border-border text-muted-foreground hover:text-foreground"
                          }`}
                          title="Karşılaştırma Listesine Ekle"
                        >
                          <Scale className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{isCompared ? "Eklendi" : "Kıyasla"}</span>
                        </button>
                      </div>
                    </div>

                    {/* High-Res Studio Image Area - Direct Link to Detail Page */}
                    <Link
                      to={`/magaza/${bike.slug}`}
                      className="relative h-64 w-full bg-gradient-to-b from-[#171b26] via-[#10131c] to-[#090b10] overflow-hidden flex items-center justify-center p-6 cursor-pointer select-none border-b border-border/40"
                    >
                      {/* Senior Architectural Contact Shadow (Absorbs transparent PNG white fringe artifacts) */}
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[70%] h-6 bg-black/95 blur-md rounded-[100%] pointer-events-none z-0" />
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[48%] h-2.5 bg-black blur-[1.5px] rounded-[100%] pointer-events-none z-0" />

                      <img
                        src={activeImage}
                        alt={`${bike.brand} ${bike.model} (${activeColor?.name || ''})`}
                        onError={(e) => { e.currentTarget.src = "/placeholder.webp"; }}
                        referrerPolicy="no-referrer"
                        className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-500 [filter:drop-shadow(0_12px_24px_rgba(0,0,0,0.9))] relative z-10 mix-blend-normal"
                        loading="lazy"
                        decoding="async"
                      />

                      {/* License Type Badge Overlay */}
                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white border border-white/10 flex items-center gap-1.5 z-20">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {bike.licenseType}
                      </div>
                    </Link>

                    {/* Content Body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        {/* Title and Tagline */}
                        <div className="mb-2">
                          <div className="flex items-center justify-between">
                            <Link
                              to={`/magaza/${bike.slug}`}
                              className="font-heading font-black text-xl text-foreground group-hover:text-red-500 transition-colors"
                            >
                              {bike.brand} {bike.model}
                            </Link>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground">
                              {bike.engineSize}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {bike.tagline}
                          </p>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-2 gap-2 py-3 border-y border-border/60 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            {bike.category === "E-GRUP" || bike.category === "E-TRICYCLE" ? (
                              <BatteryCharging className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            ) : (
                              <Fuel className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            )}
                            <span className="truncate">Hacim: <strong className="text-foreground">{bike.specs.engineCapacity.split(" ")[0]} {bike.specs.engineCapacity.split(" ")[1] || ""}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Zap className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span className="truncate">Güç: <strong className="text-foreground">{bike.specs.maxPower.split("@")[0]}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <ShieldCheck className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span className="truncate">Fren: <strong className="text-foreground">{bike.specs.brakes.includes("Disk") ? "Disk Fren" : "Kombine"}</strong></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Gauge className="w-3.5 h-3.5 text-red-500 shrink-0" />
                            <span className="truncate">Vites: <strong className="text-foreground">{bike.specs.transmission.includes("Otomatik") ? "Otomatik" : "Manuel"}</strong></span>
                          </div>
                        </div>

                        {/* Price Block */}
                        <div className="mt-3 p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between">
                          {bike.price > 0 ? (
                            <>
                              <div>
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                                  {bike.cashPrice ? "Nakit / Peşin" : "Satış Fiyatı"}
                                </span>
                                <span className="font-heading font-black text-base text-foreground tracking-tight">
                                  {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(bike.price)}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center justify-end gap-1">
                                  <CreditCard className="w-3 h-3" /> 12 Taksit
                                </span>
                                <span className="text-xs font-bold text-foreground">
                                  {bike.installment12Price 
                                    ? `${new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(bike.installment12Price)}`
                                    : `${Math.round(bike.price / 12).toLocaleString("tr-TR")} ₺/ay`}
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                                  Bayi Satış Durumu
                                </span>
                                <span className="font-heading font-black text-sm text-red-500 tracking-tight flex items-center gap-1">
                                  Fiyat ve Stok Sorunuz
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center justify-end gap-1">
                                  <ShieldCheck className="w-3 h-3" /> 0 KM Sıfır
                                </span>
                                <span className="text-xs font-semibold text-foreground">
                                  12 Taksit & Takas
                                </span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Color Options */}
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-muted-foreground truncate max-w-[140px]">
                            Renk: <strong className="text-foreground">{formatColorName(activeColor?.name, activeColor?.hex)}</strong>
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {bike.colors.map((c, i) => {
                              const isActive = activeColorIndex === i;
                              const displayName = formatColorName(c.name, c.hex);
                              return (
                                <button
                                  key={c.name + i}
                                  onClick={(e) => handleColorChange(bike.id, i, e)}
                                  title={displayName}
                                  style={isActive ? { backgroundColor: c.hex, boxShadow: `0 0 0 2px ${c.hex}66` } : { backgroundColor: c.hex }}
                                  className={`w-4 h-4 rounded-full border transition-all shadow-inner ${
                                    isActive
                                      ? "border-transparent scale-125"
                                      : "border-black/20 dark:border-white/20 hover:scale-110 hover:border-foreground"
                                  }`}
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons - Premium Refined Aesthetic */}
                      <div className="pt-2 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            to={`/magaza/${bike.slug}`}
                            className="group/btn relative py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-foreground text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1 shadow-sm active:scale-[0.98]"
                          >
                            <span>İncele</span>
                            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:translate-x-0.5 group-hover/btn:text-foreground transition-all" />
                          </Link>

                          {bike.price > 0 ? (
                            <button
                              type="button"
                              onClick={() => {
                                addItem({
                                  id: `bike_${bike.id}_${activeColor?.name || "default"}`,
                                  productId: bike.id,
                                  title: `${bike.brand} ${bike.model}${activeColor ? ` (${activeColor.name})` : ""}`,
                                  price: bike.price,
                                  image: activeImage || "/placeholder.webp",
                                  brand: bike.brand,
                                  category: bike.category,
                                  type: "motosiklet",
                                  slug: bike.slug,
                                  url: `/magaza/${bike.slug}`,
                                }, 1);
                              }}
                              className="py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-semibold tracking-wide transition-all duration-200 border border-red-500/40 shadow-[0_2px_10px_rgba(239,68,68,0.25)] hover:shadow-[0_4px_16px_rgba(239,68,68,0.35)] flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Sepete Ekle</span>
                            </button>
                          ) : (
                            <Link
                              to={`/magaza/${bike.slug}`}
                              className="py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-xs font-semibold tracking-wide transition-all duration-200 border border-red-500/40 shadow-[0_2px_10px_rgba(239,68,68,0.25)] flex items-center justify-center gap-1.5 active:scale-[0.98]"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Teklif Al</span>
                            </Link>
                          )}
                        </div>

                        <a
                          href={`https://wa.me/905348996817?text=Merhaba,%20MotoLux%20${encodeURIComponent(bike.model)}%20modeli%20(${encodeURIComponent(activeColor?.name || "Standart")})%20i%C3%A7in%20stok%20ve%20fiyat%20teklifi%20almak%20istiyorum.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 text-xs font-semibold tracking-wide transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98]"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp ile Fiyat & Stok Sor</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
              
              {filteredMotorcycles.length > displayedCount && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setDisplayedCount(prev => prev + 12)}
                    className="px-8 py-3 rounded-xl bg-muted hover:bg-muted/80 border border-border text-foreground text-sm font-semibold shadow-sm transition-all"
                  >
                    Daha Fazla Göster
                  </button>
                </div>
              )}
            </>
          )}

          {/* ========================================================================= */}
          {/* SHOWROOM VISIT & STORE CONTACT BANNER                                     */}
          {/* ========================================================================= */}
          <div className="rounded-3xl bg-gradient-to-r from-[#14151b] via-[#1b171c] to-[#14151b] border border-white/10 p-6 md:p-10 relative overflow-hidden mt-14">
            <div className="absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5" /> Fatih Kızılelma Showroom
                </div>
                <h3 className="font-heading font-black text-2xl md:text-3xl text-white">
                  MotoLux Modellerini Canlı İncelemek İçin Mağazamıza Bekliyoruz
                </h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                  İstanbul Fatih Kızılelma Caddesi'ndeki yetkili satış mağazamızda tüm MotoLux modellerini yakından görebilir, ergonomisini test edebilir ve uzman ekibimizle çay eşliğinde size en uygun ödeme planını oluşturabilirsiniz.
                </p>

                <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-red-400" />
                    <span>Hafta İçi: 09:00 - 19:00 | Cts: 09:00 - 17:00</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Aynı Gün Anahtar Teslim Plaka Desteği</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <a
                  href="https://maps.google.com/?q=Seyid+Ömer+Mah.+Kızılelma+Cad.+No:66/A+Fatih+İstanbul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-2xl bg-white text-black font-bold text-xs md:text-sm hover:bg-slate-200 transition-all flex items-center justify-center gap-2 text-center"
                >
                  <MapPin className="w-4 h-4 text-red-600" />
                  Haritada Yol Tarifi Al
                </a>
                <a
                  href="tel:+905348996817"
                  className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs md:text-sm transition-all flex items-center justify-center gap-2 text-center shadow-lg shadow-red-600/30"
                >
                  <Phone className="w-4 h-4" />
                  Showroom Satış Yetkilisini Ara
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Floating Interactive Modals */}
      <Suspense fallback={null}>
        {isCompareModalOpen && (
          <MotorcycleCompareModal
            isOpen={isCompareModalOpen}
            onClose={() => setIsCompareModalOpen(false)}
            bikes={comparedBikes}
            onRemoveBike={(id) => setComparedBikes((prev) => prev.filter((b) => b.id !== id))}
            onClearAll={() => setComparedBikes([])}
          />
        )}

        {isCalculatorModalOpen && (
          <InstallmentCalculatorModal
            isOpen={isCalculatorModalOpen}
            onClose={() => setIsCalculatorModalOpen(false)}
            selectedBike={calculatorBike}
          />
        )}
      </Suspense>
    </Layout>
  );
};

export default Magaza;
