import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import {
  MOTORCYCLES,
  Motorcycle,
  MotorcycleColor
} from "@/data/motorcycles";
import {
  ShieldCheck,
  Phone,
  MessageCircle,
  Gauge,
  Zap,
  CreditCard,
  CheckCircle2,
  MapPin,
  Clock,
  Gift,
  ChevronRight,
  ArrowLeft,
  Fuel,
  BatteryCharging,
  Award,
  Share2,
  Calendar,
  Layers,
  Sparkles,
  Info,
  Calculator,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";
import InstallmentCalculatorModal from "@/components/magaza/InstallmentCalculatorModal";
import { useCart } from "@/context/CartContext";
import { useMotorcycles } from "@/hooks/useMotorcycles";
import { formatColorName } from "@/lib/colorUtils";



const MagazaDetay = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { data: motorcyclesData = MOTORCYCLES } = useMotorcycles();
  
  const [isLoanCalcOpen, setIsLoanCalcOpen] = useState(false);

  const bike: Motorcycle | undefined = useMemo(() => {
    return motorcyclesData.find((m) => m.slug === slug || m.id === slug);
  }, [slug, motorcyclesData]);

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<MotorcycleColor | null>(
    bike && bike.colors.length > 0 ? bike.colors[0] : null
  );

  // Related models
  const relatedBikes = useMemo(() => {
    if (!bike) return [];
    return motorcyclesData.filter((m) => m.id !== bike.id && m.category === bike.category).slice(0, 3);
  }, [bike, motorcyclesData]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${bike?.brand} ${bike?.model} - Paşa Motor Showroom`,
        text: `0 KM ${bike?.brand} ${bike?.model} motosiklet fiyatı ve teknik özellikleri.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Motosiklet detay linki panoya kopyalandı!");
    }
  };

  if (!bike) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-20 container mx-auto px-4 text-center">
          <Layers className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
          <h1 className="font-heading font-black text-2xl text-foreground mb-2">Motosiklet Modeli Bulunamadı</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Aradığınız MotoLux modeli kaldırılmış veya adresi değişmiş olabilir.
          </p>
          <Link
            to="/magaza"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Mağaza Kataloğuna Dön
          </Link>
        </div>
      </Layout>
    );
  }

  const categoryNames: { [key: string]: string } = {
    "scooter-50": "50cc Scooter (B Sınıfı Ehliyet)",
    "scooter-125": "110cc - 150cc Scooter",
    "chopper": "Chopper / Cruiser",
    "touring-cross": "Vitesli & Enduro / Cross",
    "elektrikli": "Elektrikli Scooter (E-Group)",
    "kargo-uc-teker": "3 Tekerlekli & Kargo Triportör"
  };

  return (
    <Layout>
      <Helmet>
        <title>{`${bike.brand} ${bike.model} 0 KM Fiyatı & Teknik Özellikleri | Paşa Motor Fatih Bayi`}</title>
        <meta
          name="description"
          content={`${bike.brand} ${bike.model} 0 KM sıfır satış fiyatı, 12 taksit imkanı, ${bike.licenseType}, motor gücü, yakıt tüketimi ve tüm teknik detayları Paşa Motor Fatih Showroom'da.`}
        />
      </Helmet>

      <div className="bg-background min-h-screen pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6 py-2 overflow-x-auto">
            <Link to="/" className="hover:text-foreground transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            <Link to="/magaza" className="hover:text-foreground transition-colors">Mağaza</Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            <span className="text-muted-foreground">{categoryNames[bike.category] || "Motosiklet"}</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
            <span className="text-foreground font-semibold truncate">{bike.brand} {bike.model}</span>
          </nav>

          {/* Main Showcase Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Image Gallery & Badges (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Main Image Container */}
              <div className="relative rounded-3xl bg-gradient-to-b from-[#181d2a] via-[#10141f] to-[#0a0d14] border border-border/80 p-4 md:p-8 overflow-hidden shadow-xl">
                
                {/* Floating Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow">
                      {bike.condition}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-background/90 backdrop-blur-md border border-border text-foreground text-xs font-bold shadow-sm">
                      {bike.engineSize}
                    </span>
                  </div>

                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl bg-background/80 hover:bg-background backdrop-blur-md border border-border text-muted-foreground hover:text-foreground transition-colors pointer-events-auto shadow-sm"
                    title="Motosikleti Paylaş"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Hero Image & Studio Ground Shadow */}
                <div className="w-full h-80 md:h-[420px] flex items-center justify-center relative select-none">
                  {/* Senior Contact Shadow Layer (Defringes cutout artifacts on dark floor) */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[74%] h-7 bg-black/95 blur-lg rounded-[100%] pointer-events-none z-0" />
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[52%] h-3 bg-black blur-[1.5px] rounded-[100%] pointer-events-none z-0" />

                  <img
                    src={bike.images[activeImageIndex] || bike.images[0]}
                    alt={`${bike.brand} ${bike.model}`}
                    onError={(e) => { e.currentTarget.src = "/placeholder.webp"; }}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain [filter:drop-shadow(0_14px_28px_rgba(0,0,0,0.9))] transition-all duration-300 relative z-10 mix-blend-normal"
                  />
                </div>

                {/* License Type Bottom Badge */}
                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-semibold text-white border border-white/10 flex items-center gap-2 z-20">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {bike.licenseType}
                </div>
              </div>

              {/* Thumbnail Gallery (if multiple) */}
              {bike.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {bike.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        const matched = bike.colors.find((c, cIdx) => {
                          if (typeof c.imageIndex === "number") return c.imageIndex === idx;
                          if (c.imageUrl) return c.imageUrl === img;
                          return cIdx === idx;
                        });
                        if (matched) {
                          setSelectedColor(matched);
                        } else if (idx < bike.colors.length) {
                          setSelectedColor(bike.colors[idx]);
                        }
                      }}
                      className={`relative w-20 h-20 rounded-2xl bg-card border-2 p-2 overflow-hidden shrink-0 transition-all ${
                        activeImageIndex === idx ? "border-red-500 scale-105 shadow-md" : "border-border/60 hover:border-border"
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${bike.model} ${idx}`} 
                        onError={(e) => { e.currentTarget.src = "/placeholder.webp"; }}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain" 
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Showroom Benefits Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-card/60 border border-border/80 text-center">
                  <Award className="w-5 h-5 text-red-500 mx-auto mb-1.5" />
                  <div className="text-[11px] font-bold text-foreground">0 KM Resmî Garanti</div>
                  <div className="text-[10px] text-muted-foreground">2 Yıl / 30.000 KM</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-card/60 border border-border/80 text-center">
                  <CreditCard className="w-5 h-5 text-red-500 mx-auto mb-1.5" />
                  <div className="text-[11px] font-bold text-foreground">12 Taksit</div>
                  <div className="text-[10px] text-muted-foreground">Tüm Kredi Kartları</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-card/60 border border-border/80 text-center">
                  <ShieldCheck className="w-5 h-5 text-red-500 mx-auto mb-1.5" />
                  <div className="text-[11px] font-bold text-foreground">Hızlı Plaka & Ruhsat</div>
                  <div className="text-[10px] text-muted-foreground">Aynı Gün Teslimat</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-card/60 border border-border/80 text-center">
                  <Gift className="w-5 h-5 text-red-500 mx-auto mb-1.5" />
                  <div className="text-[11px] font-bold text-foreground">Hediye Paketi</div>
                  <div className="text-[10px] text-muted-foreground">Kask & Kilit Dahil</div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Purchase & Specs Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Product Title & Brand Badge */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" /> MotoLux Resmî Yetkili Satış Noktası
                  </div>
                  <h1 className="font-heading font-black text-2xl md:text-3xl text-foreground">
                    {bike.brand} {bike.model}
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    {bike.tagline}
                  </p>
                </div>

                {/* Official Dealer Price Block */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-3">
                  {bike.price > 0 ? (
                    <>
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                            {bike.cashPrice ? "Nakit / Peşin Satış Fiyatı" : "Tavsiye Edilen Satış Fiyatı"}
                          </span>
                          <span className="font-heading font-black text-3xl text-foreground tracking-tight">
                            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(bike.price)}
                          </span>
                        </div>
                        {bike.originalPrice && bike.originalPrice > bike.price && (
                          <span className="text-sm text-muted-foreground line-through font-semibold">
                            {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(bike.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Installment Pricing Details */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                        <div className="p-2.5 rounded-xl bg-card border border-border/60">
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase block">6 Taksit Fiyatı</span>
                          <strong className="text-foreground text-sm">
                            {bike.installment6Price 
                              ? new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(bike.installment6Price)
                              : `${Math.round(bike.price / 6).toLocaleString("tr-TR")} ₺/ay`}
                          </strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border/60">
                          <span className="text-[10px] text-amber-500 font-bold uppercase flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> 12 Taksit
                          </span>
                          <strong className="text-foreground text-sm">
                            {bike.installment12Price 
                              ? new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(bike.installment12Price)
                              : `${Math.round(bike.price / 12).toLocaleString("tr-TR")} ₺/ay`}
                          </strong>
                        </div>
                      </div>

                      {/* Calculator trigger button */}
                      <button
                        type="button"
                        onClick={() => setIsLoanCalcOpen(true)}
                        className="w-full py-2 px-3 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-600 border border-red-500/20 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Kredi Kartına 3 - 6 - 9 - 12 Taksit Hesapla</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                            Bayi Özel Satış Fiyatı
                          </span>
                          <span className="font-heading font-black text-2xl text-red-500 tracking-tight">
                            Fiyat ve Stok Sorunuz
                          </span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                          0 KM Bayi Stokta
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-xs">
                        <div className="p-2.5 rounded-xl bg-card border border-border/60">
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase block">Ödeme Seçenekleri</span>
                          <strong className="text-foreground text-xs font-bold">
                            Kredi Kartına 12 Taksit
                          </strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-card border border-border/60">
                          <span className="text-[10px] text-emerald-500 font-bold uppercase flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Takas Desteği
                          </span>
                          <strong className="text-foreground text-xs font-bold">
                            Tüm İkinci El Takasları
                          </strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsLoanCalcOpen(true)}
                        className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-foreground border border-white/10 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Calculator className="w-3.5 h-3.5 text-amber-400" />
                        <span>Örnek Taksit Tutarlarını Hesapla</span>
                      </button>
                    </>
                  )}
                </div>

                {/* Color Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-muted-foreground">Renk Seçeneği:</span>
                    <span className="text-foreground font-bold">
                      {formatColorName(selectedColor?.name || bike.colors[0]?.name, selectedColor?.hex || bike.colors[0]?.hex)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {bike.colors.map((c, i) => {
                      let targetIdx = i;
                      if (typeof c.imageIndex === "number" && c.imageIndex >= 0 && c.imageIndex < bike.images.length) {
                        targetIdx = c.imageIndex;
                      } else if (c.imageUrl) {
                        const found = bike.images.indexOf(c.imageUrl);
                        if (found !== -1) targetIdx = found;
                      }
                      
                      const isActive = selectedColor?.name === c.name || (!selectedColor && i === 0);
                      const displayName = formatColorName(c.name, c.hex);
                      
                      return (
                        <button
                          key={c.name + i}
                          onClick={() => {
                            setSelectedColor(c);
                            if (targetIdx < bike.images.length) {
                              setActiveImageIndex(targetIdx);
                            }
                          }}
                          title={displayName}
                          style={isActive ? { borderColor: c.hex, backgroundColor: `${c.hex}15` } : {}}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 text-xs font-medium transition-all ${
                            isActive
                              ? "text-foreground font-bold shadow-sm"
                              : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 shrink-0 shadow-inner"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{displayName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Key Quick Specs */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-border/60">
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      {bike.specs.fuelTankOrBattery?.includes("V") || bike.category === "E-GRUP" ? (
                        <Zap className="w-4 h-4" />
                      ) : (
                        <Fuel className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-muted-foreground font-medium leading-none mb-1">
                        {bike.specs.fuelTankOrBattery?.includes("V") ? "Motor Gücü" : "Silindir Hacmi"}
                      </div>
                      <div className="font-bold text-foreground text-sm tracking-tight">
                        {bike.specs.maxPower || bike.specs.engineCapacity}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      <Gauge className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-muted-foreground font-medium leading-none mb-1">
                        Maksimum Hız
                      </div>
                      <div className="font-bold text-foreground text-sm tracking-tight">
                        {bike.specs.maxSpeed || "45 km/h"}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      {bike.specs.fuelTankOrBattery?.includes("V") ? (
                        <BatteryCharging className="w-4 h-4" />
                      ) : (
                        <Fuel className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-muted-foreground font-medium leading-none mb-1">
                        {bike.specs.fuelTankOrBattery?.includes("V") ? "Batarya / Akü" : "Yakıt Deposu"}
                      </div>
                      <div className="font-bold text-foreground text-sm tracking-tight">
                        {bike.specs.fuelTankOrBattery}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-muted/40 border border-border/50 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] text-muted-foreground font-medium leading-none mb-1">
                        Fren Sistemi
                      </div>
                      <div className="font-bold text-foreground text-sm tracking-tight">
                        {bike.specs.brakes}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons - Senior Premium Layout */}
                <div className="space-y-2.5 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (!bike) return;
                        const colorInfo = selectedColor ? ` (${selectedColor.name})` : "";
                        addItem({
                          id: `bike_${bike.id}_${selectedColor?.name || "default"}`,
                          productId: bike.id,
                          title: `${bike.brand} ${bike.model}${colorInfo}`,
                          price: bike.price,
                          image: bike.images[0] || "/placeholder.webp",
                          brand: bike.brand,
                          category: bike.category,
                          type: "motosiklet",
                          slug: bike.slug,
                          url: `/magaza/${bike.slug}`,
                        }, 1);
                      }}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold text-xs tracking-wide transition-all duration-200 border border-red-500/40 shadow-[0_2px_12px_rgba(239,68,68,0.25)] hover:shadow-[0_4px_16px_rgba(239,68,68,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Sepete Ekle</span>
                    </button>

                    <a
                      href={`https://wa.me/905348996817?text=Merhaba,%20MotoLux%20${encodeURIComponent(bike.model)}%20modeli%20i%C3%A7in%20stok,%20renk%20(${encodeURIComponent(formatColorName(selectedColor?.name || "Standart", selectedColor?.hex))})%20ve%20taksit%20teklifi%20almak%20istiyorum.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 font-semibold text-xs tracking-wide transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp Teklif Al</span>
                    </a>
                  </div>

                  <button
                    onClick={() => setIsCalculatorOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-foreground font-medium text-xs tracking-wide transition-all flex items-center justify-center gap-1.5"
                  >
                    <Calculator className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kredi Kartı & Taksit Hesaplayıcı</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="tel:+905348996817"
                      className="py-2 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-red-500/40 text-foreground font-medium text-xs tracking-wide transition-all flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-red-500" />
                      <span>Satış Yetkilisini Ara</span>
                    </a>

                    <a
                      href="https://maps.google.com/?q=Seyid+Ömer+Mah.+Kızılelma+Cad.+No:66/A+Fatih+İstanbul"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-red-500/40 text-foreground font-medium text-xs tracking-wide transition-all flex items-center justify-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-red-500" />
                      <span>Showrooma Yol Tarifi</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Gift & Delivery Box */}
              <div className="p-5 rounded-3xl bg-red-500/5 border border-red-500/20 space-y-3">
                <div className="flex items-center gap-2 text-red-500 font-bold text-xs">
                  <Gift className="w-4 h-4" />
                  Paşa Motor Yetkili Bayi Teslimat Hediyeleri
                </div>
                <ul className="space-y-2 text-xs text-foreground">
                  {bike.giftPackage?.map((gift, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{gift}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          {/* ========================================================================= */}
          {/* TECHNICAL SPECIFICATIONS & DETAILED DESCRIPTION                          */}
          {/* ========================================================================= */}
          <div className="mt-12 space-y-8">
            
            {/* Description Card */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="font-heading font-black text-xl text-foreground mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-red-500" />
                {bike.brand} {bike.model} Hakkında Detaylı Bilgi
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {bike.description}
              </p>
            </div>

            {/* Technical Specs Table */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-heading font-black text-xl text-foreground flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-red-500" />
                    Teknik Özellikler
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    MotoLux resmî fabrika teknik verileri
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                    {bike.warranty}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {bike.technicalSpecs && bike.technicalSpecs.length > 0 ? (
                  bike.technicalSpecs.map((spec, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors flex justify-between items-center gap-4"
                    >
                      <span className="text-muted-foreground font-medium shrink-0">{spec.label}:</span>
                      <span className="font-bold text-foreground text-right">{spec.value}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Hız:</span>
                      <span className="font-bold text-foreground">{bike.specs.maxSpeed || "45 km/h"}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Vites / Şanzıman:</span>
                      <span className="font-bold text-foreground">{bike.specs.transmission}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Motor Gücü:</span>
                      <span className="font-bold text-foreground">{bike.specs.maxPower}</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Batarya / Yakıt:</span>
                      <span className="font-bold text-foreground">{bike.specs.fuelTankOrBattery}</span>
                    </div>
                    {bike.specs.inputVoltage && (
                      <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Giriş Voltajı:</span>
                        <span className="font-bold text-foreground">{bike.specs.inputVoltage}</span>
                      </div>
                    )}
                    {bike.specs.range && (
                      <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Şarj Mesafesi / Menzil:</span>
                        <span className="font-bold text-foreground">{bike.specs.range}</span>
                      </div>
                    )}
                    {bike.specs.chargingTime && (
                      <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Şarj Süresi:</span>
                        <span className="font-bold text-foreground">{bike.specs.chargingTime}</span>
                      </div>
                    )}
                    <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Yüksüz Ağırlık:</span>
                      <span className="font-bold text-foreground">{bike.specs.weight}</span>
                    </div>
                    {bike.specs.maxLoadWeight && (
                      <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Azami Yüklü Kütle:</span>
                        <span className="font-bold text-foreground">{bike.specs.maxLoadWeight}</span>
                      </div>
                    )}
                    {bike.specs.dimensions && (
                      <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Boyutlar (UxGxY):</span>
                        <span className="font-bold text-foreground">{bike.specs.dimensions}</span>
                      </div>
                    )}
                    <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Frenler Ön/Arka:</span>
                      <span className="font-bold text-foreground">{bike.specs.brakes}</span>
                    </div>
                    {bike.specs.tireSize && (
                      <div className="p-3.5 rounded-2xl bg-muted/40 flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">Tekerlek Ölçüsü Ön/Arka:</span>
                        <span className="font-bold text-foreground">{bike.specs.tireSize}</span>
                      </div>
                    )}
                  </>
                )}

                <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex justify-between items-center md:col-span-2">
                  <span className="text-muted-foreground font-medium">Ehliyet & Tescil Gereksinimi:</span>
                  <span className="font-bold text-emerald-500">{bike.specs.licenseRequirement}</span>
                </div>
              </div>
            </div>

            {/* Standard Features */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="font-heading font-black text-xl text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-red-500" />
                Standart Donanım ve Avantajlar
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {bike.features.map((feat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-muted/30 border border-border/60 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <span className="text-foreground font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* RELATED MOTORCYCLES SECTION                                               */}
          {/* ========================================================================= */}
          {relatedBikes.length > 0 && (
            <div className="mt-14 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-black text-2xl text-foreground">
                    Diğer {categoryNames[bike.category] || "MotoLux"} Modelleri
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Aynı kategorideki alternatif modelleri inceleyin
                  </p>
                </div>
                <Link
                  to="/magaza"
                  className="text-xs font-bold text-red-500 hover:text-red-400 flex items-center gap-1"
                >
                  Tümünü Gör <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBikes.map((rb) => (
                  <Link
                    key={rb.id}
                    to={`/magaza/${rb.slug}`}
                    className="group bg-card border border-border hover:border-red-500/50 rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                  >
                    <div className="h-44 w-full bg-muted/30 rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3">
                      <img
                        src={rb.images[0]}
                        alt={rb.model}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-heading font-black text-base text-foreground group-hover:text-red-500 transition-colors">
                          {rb.brand} {rb.model}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {rb.engineSize}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {rb.licenseType.split(" ")[0]} {rb.licenseType.split(" ")[1]}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <InstallmentCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        selectedBike={bike}
      />
    </Layout>
  );
};

export default MagazaDetay;
