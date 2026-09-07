import React, { useState, useEffect, useRef, Suspense } from "react";
import { Link } from "react-router-dom";
import {
  MOTORCYCLES,
  Motorcycle,
  MotorcycleColor
} from "@/data/motorcycles";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  CreditCard,
  CheckCircle2,
  MessageCircle,
  Eye,
  Sparkles,
  Gauge,
  RotateCw,
  Award,
  Flame,
  ArrowRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
const ShowroomCylinder3D = React.lazy(() => import("./ShowroomCylinder3D"));
import { useMotorcycles } from "@/hooks/useMotorcycles";

const tl = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);

// Flagship models specifically featured on the 3D cylinder podium
const FEATURED_SLUGS = [
  "motolux-cappadocia125",
  "motolux-drift-200",
  "motolux-macchiato-125",
  "motolux-sst-125",
  "motolux-pitton-9000",
  "motolux-fayton-fx-55",
  "motolux-fayton-fx-34",
  "motolux-ist-34",
  "motolux-mw-46",
  "motolux-mtx01"
];

interface HeroShowroom3DProps {
  onSelectMotorcycle?: (bike: Motorcycle) => void;
  onOpenLoanCalculator?: (bike: Motorcycle) => void;
}

export const HeroShowroom3D: React.FC<HeroShowroom3DProps> = ({
  onOpenLoanCalculator
}) => {
  const { data: motorcyclesData = MOTORCYCLES } = useMotorcycles();
  // Filter hero motorcycles
  const heroBikes: Motorcycle[] = React.useMemo(() => {
    const list = motorcyclesData.filter((m) => FEATURED_SLUGS.includes(m.slug) || m.featured);
    return list.length > 0 ? list.slice(0, 8) : motorcyclesData.slice(0, 6);
  }, [motorcyclesData]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<MotorcycleColor | null>(null);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentBike = heroBikes[currentIndex] || heroBikes[0];

  useEffect(() => {
    if (currentBike && currentBike.colors.length > 0) {
      setSelectedColor(currentBike.colors[0]);
    }
  }, [currentIndex, currentBike]);

  // Automatic gentle podium rotation or next slide
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroBikes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoPlay, heroBikes.length]);

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % heroBikes.length);
  };

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + heroBikes.length) % heroBikes.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20; // -10 to +10 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -15; // -7.5 to +7.5 deg
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#121624] via-[#0d101a] to-[#07090e] border border-white/15 shadow-2xl p-4 sm:p-8 md:p-12 mb-12 select-none"
    >
      {/* Dynamic Studio Illumination & Ambient Volumetric Spotlights */}
      {/* 1. Overhead Studio Softbox Light Cone */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-white/15 via-white/5 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      {/* 2. Cyber Grid Pattern with brighter contrast */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      
      {/* 3. Color-Harmonized Stage Aura Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[440px] rounded-full blur-[110px] pointer-events-none opacity-30 transition-all duration-700"
        style={{
          backgroundColor: selectedColor ? selectedColor.hex : "#ef4444"
        }}
      />
      
      {/* 4. Studio Floor Spotlight Ring behind the 3D Turntable */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] sm:w-[720px] h-[180px] bg-gradient-to-t from-white/10 via-cyan-500/10 to-transparent blur-2xl rounded-full pointer-events-none" />
      <div className="absolute top-0 right-10 w-80 h-80 bg-red-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header & Badges */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-red-500 animate-pulse" />
            MotoLux Resmî 3D Showroom Vitrini
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 0 KM Hemen Teslim
          </span>
        </div>

        {/* Autoplay & 3D Stage Info */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              isAutoPlay
                ? "bg-red-500/15 border-red-500/40 text-red-400 shadow-sm"
                : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
            }`}
            title="Otomatik Dönüşü Aç / Kapat"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isAutoPlay ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }} />
            <span className="hidden sm:inline">{isAutoPlay ? "Otomatik Tur: Açık" : "Manuel Mod"}</span>
          </button>
        </div>
      </div>

      {/* MAIN 3D SHOWROOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-20">
        
        {/* LEFT COLUMN: 3D CYLINDER PLATFORM & MOTORCYCLE STAGE (7 cols) */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px] md:min-h-[500px]">
          
          {/* Stage Controls Arrows */}
          <button
            onClick={handlePrev}
            aria-label="Önceki Model"
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-black/60 hover:bg-red-600/90 text-white/80 hover:text-white backdrop-blur-md border border-white/10 hover:border-red-500 transition-all hover:scale-110 shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Sonraki Model"
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-30 p-3 rounded-2xl bg-black/60 hover:bg-red-600/90 text-white/80 hover:text-white backdrop-blur-md border border-white/10 hover:border-red-500 transition-all hover:scale-110 shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 3D TRANSFORM WRAPPER */}
          <div
            className="relative w-full h-[350px] sm:h-[420px] md:h-[460px] flex items-center justify-center transition-transform duration-300 ease-out"
            style={{
              perspective: "1200px",
              transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`
            }}
          >
            
            {/* ========================================================= */}
            {/* THREE.JS LUXURY 3D AUTOMOTIVE CYLINDER SHOWROOM PLATFORM  */}
            {/* WITH REVOLVING SYNCHRONIZED NEON LIGHT RING & PBR REFLECTIONS */}
            {/* ========================================================= */}
            <div className="absolute inset-0 w-full flex items-end justify-center z-0 pointer-events-none pb-1 sm:pb-2">
              <div className="w-full max-w-[620px] sm:max-w-[740px] md:max-w-[840px]">
                <Suspense fallback={<div className="h-64 flex items-center justify-center text-white/50 animate-pulse text-xs">Yükleniyor...</div>}>
                  <ShowroomCylinder3D
                    glowColor={selectedColor?.hex || currentBike.colors?.[0]?.hex || "#ef4444"}
                    bikeId={currentBike.id}
                    bikeCategory={currentBike.category}
                  />
                </Suspense>
              </div>
            </div>

            {/* MOTORCYCLE DISPLAY ON PODIUM WITH ANIMATION (Centered on Turntable Platter) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBike.id}
                initial={{ opacity: 0, scale: 0.93, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative z-10 w-full h-full flex items-center justify-center pb-8 sm:pb-11 md:pb-14"
              >
                {/* Physical Contact AO Shadow system directly on the 3D Platter surface */}
                {/* 1. Broad soft ambient occlusion shadow */}
                <div className="absolute bottom-9 sm:bottom-12 md:bottom-15 left-1/2 -translate-x-1/2 w-[72%] sm:w-[64%] h-8 bg-black/85 blur-md rounded-[100%] pointer-events-none z-0" />
                {/* 2. Rear Wheel Contact Shadow Patch */}
                <div className="absolute bottom-8 sm:bottom-11 md:bottom-14 left-[30%] sm:left-[33%] -translate-x-1/2 w-28 sm:w-34 h-4 bg-black/95 blur-[2px] rounded-[100%] pointer-events-none z-0" />
                {/* 3. Front Wheel Contact Shadow Patch */}
                <div className="absolute bottom-8 sm:bottom-11 md:bottom-14 right-[30%] sm:right-[33%] translate-x-1/2 w-28 sm:w-34 h-4 bg-black/95 blur-[2px] rounded-[100%] pointer-events-none z-0" />
                {/* 4. Center Main Contact Core Line */}
                <div className="absolute bottom-8 sm:bottom-11 md:bottom-14 left-1/2 -translate-x-1/2 w-[52%] sm:w-[46%] h-3.5 bg-black blur-[1.5px] rounded-[100%] pointer-events-none z-0" />

                <img
                  src={(() => {
                    if (!selectedColor) return currentBike.images[0];
                    let targetIdx = currentBike.colors.findIndex(c => c.name === selectedColor.name);
                    if (targetIdx < 0) targetIdx = 0;
                    
                    if (typeof selectedColor.imageIndex === "number" && selectedColor.imageIndex >= 0 && selectedColor.imageIndex < currentBike.images.length) {
                      targetIdx = selectedColor.imageIndex;
                    } else if (selectedColor.imageUrl) {
                      const found = currentBike.images.indexOf(selectedColor.imageUrl);
                      if (found !== -1) targetIdx = found;
                    }
                    
                    return currentBike.images[targetIdx] || currentBike.images[0];
                  })()}
                  alt={`${currentBike.brand} ${currentBike.model} (${selectedColor?.name || ''})`}
                  onError={(e) => { e.currentTarget.src = "/placeholder.webp"; }}
                  className="max-h-[230px] sm:max-h-[285px] md:max-h-[335px] max-w-full object-contain filter hover:scale-105 transition-transform duration-500 relative z-10 [filter:drop-shadow(0_14px_28px_rgba(0,0,0,0.95))_contrast(1.02)] mix-blend-normal"
                />

                {/* Floating Interactive Hotspots on the Bike */}
                <div className="absolute top-12 left-1/4 z-30">
                  <button
                    onClick={() => setActiveHotspot(activeHotspot === "engine" ? null : "engine")}
                    className="relative group flex items-center justify-center"
                    title="Motor Detayı"
                  >
                    <span className="w-4 h-4 rounded-full bg-red-500 animate-ping absolute opacity-75" />
                    <span className="w-4 h-4 rounded-full bg-red-600 border-2 border-white text-[10px] text-white font-bold flex items-center justify-center shadow-lg">
                      +
                    </span>
                    {activeHotspot === "engine" && (
                      <div className="absolute top-6 left-0 bg-black/90 backdrop-blur-md border border-red-500/50 text-white text-xs p-2.5 rounded-xl whitespace-nowrap z-40 shadow-2xl">
                        <div className="font-bold text-red-400">{currentBike.specs.engineCapacity} Motor</div>
                        <div className="text-[10px] text-slate-300">{currentBike.specs.maxPower}</div>
                      </div>
                    )}
                  </button>
                </div>

                <div className="absolute bottom-28 right-1/4 z-30">
                  <button
                    onClick={() => setActiveHotspot(activeHotspot === "brakes" ? null : "brakes")}
                    className="relative group flex items-center justify-center"
                    title="Fren & Şanzıman Detayı"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
                    <span className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white text-[10px] text-white font-bold flex items-center justify-center shadow-lg">
                      +
                    </span>
                    {activeHotspot === "brakes" && (
                      <div className="absolute bottom-6 right-0 bg-black/90 backdrop-blur-md border border-emerald-500/50 text-white text-xs p-2.5 rounded-xl whitespace-nowrap z-40 shadow-2xl">
                        <div className="font-bold text-emerald-400">{currentBike.specs.transmission}</div>
                        <div className="text-[10px] text-slate-300">{currentBike.specs.brakes}</div>
                      </div>
                    )}
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>

          {/* Model Thumbnails Carousel on Stage Dock */}
          <div className="w-full mt-2 flex items-center justify-center gap-2 overflow-x-auto py-2 px-2 scrollbar-none">
            {heroBikes.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => {
                  setIsAutoPlay(false);
                  setCurrentIndex(idx);
                }}
                className={`relative px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                  currentIndex === idx
                    ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30 scale-105"
                    : "bg-black/50 border-white/10 text-slate-400 hover:text-white hover:border-white/30"
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentIndex === idx ? "#ffffff" : "#ef4444" }} />
                <span>{b.model}</span>
              </button>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: MODEL DETAILS & PURCHASE CARD (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBike.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-neutral-950 border border-neutral-800/80 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col"
            >
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900" />

              {/* 1. Header Badges */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/50 pb-5">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-white uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                    Resmî Bayi
                  </span>
                  <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {currentBike.condition}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-1.5 rounded-md border border-emerald-500/20">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Stokta
                </span>
              </div>

              {/* 2. Title & Tagline */}
              <div className="py-6 border-b border-neutral-800/50">
                <div className="text-red-500 font-bold text-xs tracking-[0.25em] uppercase mb-2">{currentBike.brand}</div>
                <h2 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight leading-none mb-3">
                  {currentBike.model}
                </h2>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {currentBike.tagline}
                </p>
              </div>

              {/* 3. Price Block */}
              <div className="py-6 border-b border-neutral-800/50">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
                      {currentBike.cashPrice ? "Nakit / Peşin Satış Fiyatı" : "Tavsiye Edilen Satış Fiyatı"}
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="font-heading font-black text-4xl text-white tracking-tighter">
                        {tl(currentBike.price)}
                      </span>
                      {currentBike.originalPrice && currentBike.originalPrice > currentBike.price && (
                        <span className="text-sm text-slate-500 line-through font-semibold">
                          {tl(currentBike.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="sm:text-right">
                    <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1.5 flex items-center sm:justify-end gap-1.5">
                      <CreditCard className="w-3.5 h-3.5" /> 
                      {currentBike.installment12Price ? "12 Taksit Fiyatı" : "12 Taksit İmkanı"}
                    </div>
                    <div className="text-sm text-slate-300 font-bold">
                      {currentBike.installment12Price ? (
                        <>
                          {tl(currentBike.installment12Price)}{" "}
                          <span className="text-slate-500 font-normal text-xs">
                            ({Math.round(currentBike.installment12Price / 12).toLocaleString("tr-TR")} ₺/ay)
                          </span>
                        </>
                      ) : (
                        <>
                          {Math.round(currentBike.price / 12).toLocaleString("tr-TR")} ₺{" "}
                          <span className="text-slate-500 font-normal">/ ay</span>
                        </>
                      )}
                    </div>
                    {currentBike.installment6Price && (
                      <div className="text-xs text-slate-400 mt-1 font-medium">
                        6 Taksit: <strong className="text-slate-200">{tl(currentBike.installment6Price)}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Color Options Selector */}
              {currentBike.colors && currentBike.colors.length > 0 && (
                <div className="py-4 border-b border-neutral-800/50">
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">Renk Seçeneği:</span>
                    <span className="text-white font-bold text-xs">{selectedColor?.name || currentBike.colors[0]?.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentBike.colors.map((c, idx) => {
                      const isActive = selectedColor?.name === c.name || (!selectedColor && idx === 0);
                      return (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c)}
                          title={c.name}
                          style={isActive ? { borderColor: c.hex, backgroundColor: `${c.hex}25`, boxShadow: `0 4px 12px ${c.hex}15` } : {}}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                            isActive
                              ? "text-white scale-105"
                              : "bg-neutral-900/80 border-neutral-800 text-slate-400 hover:text-white hover:border-neutral-700"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/40 shadow-inner shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Key Specs */}
              <div className="flex items-center divide-x divide-neutral-800/80 py-6 border-b border-neutral-800/50">
                <div className="flex-1 pr-4">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Motor</div>
                  <div className="text-sm font-bold text-slate-200 truncate">{currentBike.specs.engineCapacity || currentBike.specs.maxPower}</div>
                </div>
                <div className="flex-1 px-4">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Şanzıman</div>
                  <div className="text-sm font-bold text-slate-200 truncate">{currentBike.specs.transmission}</div>
                </div>
                <div className="flex-1 pl-4">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1">Ehliyet Sınıfı</div>
                  <div className="text-[13px] font-bold text-emerald-400 line-clamp-1">{currentBike.licenseType}</div>
                </div>
              </div>

              {/* 5. Action Buttons - Sleek Premium Architecture */}
              <div className="pt-5 space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    to={`/magaza/${currentBike.slug}`}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white text-neutral-950 hover:bg-slate-100 font-semibold text-xs tracking-wide text-center transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detaylı İncele</span>
                  </Link>
                  <a
                    href={`https://wa.me/905348996817?text=Merhaba,%203D%20Showroom'da%20inceledi%C4%9Fim%20MotoLux%20${encodeURIComponent(currentBike.model)}%20modeli%20(${encodeURIComponent(selectedColor?.name || "Standart")})%20i%C3%A7in%20teklif%20ve%20stok%20bilgisi%20almak%20istiyorum.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 font-semibold text-xs tracking-wide text-center transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Satış Danışmanı</span>
                  </a>
                </div>

                {onOpenLoanCalculator && (
                  <button
                    onClick={() => onOpenLoanCalculator(currentBike)}
                    className="w-full py-2 px-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800/80 text-slate-300 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kredi Kartı & Taksit Hesaplayıcı</span>
                  </button>
                )}
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>

    </div>
  );
};

export default HeroShowroom3D;
