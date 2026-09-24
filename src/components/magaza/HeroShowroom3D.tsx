import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
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
  RotateCw,
  Award,
  Layers,
  Sliders,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
const ShowroomCylinder3D = React.lazy(() => import("./ShowroomCylinder3D"));
import { useMotorcycles } from "@/hooks/useMotorcycles";
import { formatColorName } from "@/lib/colorUtils";

const tl = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);

// Interactive LED Atmosphere Lighting Themes for the 3D Showroom
const LED_THEMES = [
  { id: "auto", label: "Oto (Motor)", hex: "" },
  { id: "red", label: "Paşa Kırmızı", hex: "#ef4444" },
  { id: "cyan", label: "Buz Mavisi", hex: "#06b6d4" },
  { id: "amber", label: "Şampanya Altın", hex: "#f59e0b" },
  { id: "emerald", label: "Zümrüt Yeşil", hex: "#10b981" },
  { id: "purple", label: "Viyole Neon", hex: "#a855f7" }
];

// Architectural Thickness Profiles for the Turntable Cylinder
const THICKNESS_OPTIONS = [
  { id: "standard" as const, label: "Spor", desc: "0.58m İnce Profil" },
  { id: "bold" as const, label: "Bold", desc: "0.74m Önerilen Premium" },
  { id: "heavy" as const, label: "Monolit", desc: "0.88m Ağır Siklet Podyum" }
];

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

interface CleanShowroomColor extends MotorcycleColor {
  displayName: string;
  uniqueKey: string;
  resolvedImageUrl: string;
}

interface HeroShowroom3DProps {
  onSelectMotorcycle?: (bike: Motorcycle) => void;
  onOpenLoanCalculator?: (bike: Motorcycle) => void;
}

export const HeroShowroom3D: React.FC<HeroShowroom3DProps> = ({
  onOpenLoanCalculator
}) => {
  const { data: motorcyclesData = MOTORCYCLES } = useMotorcycles();

  // Filter hero motorcycles
  const heroBikes: Motorcycle[] = useMemo(() => {
    const list = motorcyclesData.filter((m) => FEATURED_SLUGS.includes(m.slug) || m.featured);
    return list.length > 0 ? list.slice(0, 8) : motorcyclesData.slice(0, 6);
  }, [motorcyclesData]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedColorKey, setSelectedColorKey] = useState<string>("");
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [selectedThickness, setSelectedThickness] = useState<"standard" | "bold" | "heavy">("bold");
  const [selectedLedTheme, setSelectedLedTheme] = useState<string>("auto");

  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentBike = heroBikes[currentIndex] || heroBikes[0];

  // Clean, normalize and guarantee unique color variants for the current motorcycle
  const showroomColors = useMemo<CleanShowroomColor[]>(() => {
    if (!currentBike) return [];
    
    if (!currentBike.colors || currentBike.colors.length === 0) {
      return [
        {
          name: "Standart",
          hex: "#ef4444",
          displayName: "Orijinal Fabrika Rengi",
          uniqueKey: `${currentBike.id}-default`,
          resolvedImageUrl: currentBike.images?.[0] || "/placeholder.webp"
        }
      ];
    }

    const seenHex = new Set<string>();
    const seenDisplayNames = new Set<string>();
    const cleaned: CleanShowroomColor[] = [];

    currentBike.colors.forEach((c, idx) => {
      const rawHex = (c.hex || "").trim();
      const normalizedHex = rawHex.startsWith("#") ? rawHex : `#${rawHex || "333333"}`;
      const hexKey = normalizedHex.toLowerCase();

      // Skip exact redundant hex duplicates if any
      if (seenHex.has(hexKey) && seenHex.size > 0) {
        return;
      }
      seenHex.add(hexKey);

      let displayName = formatColorName(c.name, normalizedHex);
      
      // If a color with this exact display name already exists for this bike, refine it cleanly
      if (seenDisplayNames.has(displayName.toLowerCase())) {
        displayName = `${displayName} Özel Seri`;
      }
      seenDisplayNames.add(displayName.toLowerCase());

      // Resolve high-resolution image URL for this specific color
      let resolvedUrl = c.imageUrl || "";
      if (!resolvedUrl) {
        if (typeof c.imageIndex === "number" && c.imageIndex >= 0 && c.imageIndex < currentBike.images.length) {
          resolvedUrl = currentBike.images[c.imageIndex];
        } else {
          resolvedUrl = currentBike.images[idx] || currentBike.images[0] || "/placeholder.webp";
        }
      }

      cleaned.push({
        ...c,
        hex: normalizedHex,
        displayName,
        uniqueKey: `${currentBike.id}-${hexKey}-${idx}`,
        resolvedImageUrl: resolvedUrl
      });
    });

    return cleaned;
  }, [currentBike]);

  // Synchronize active color when model changes
  useEffect(() => {
    if (showroomColors.length > 0) {
      setSelectedColorKey(showroomColors[0].uniqueKey);
    }
  }, [currentIndex, showroomColors]);

  const currentColor = useMemo(() => {
    return showroomColors.find((c) => c.uniqueKey === selectedColorKey) || showroomColors[0];
  }, [showroomColors, selectedColorKey]);

  // Active Glow Color driven either by custom LED theme or synchronized motorcycle body color
  const activeGlowColor = useMemo(() => {
    if (selectedLedTheme !== "auto") {
      const found = LED_THEMES.find((t) => t.id === selectedLedTheme);
      if (found && found.hex) return found.hex;
    }
    return currentColor?.hex || "#ef4444";
  }, [selectedLedTheme, currentColor]);

  // Millimeter-precision vertical alignment based on turntable cylinder thickness
  const contactPaddingClass = useMemo(() => {
    if (selectedThickness === "heavy") return "pb-11 sm:pb-15 md:pb-18";
    if (selectedThickness === "bold") return "pb-9 sm:pb-13 md:pb-16";
    return "pb-7 sm:pb-11 md:pb-14";
  }, [selectedThickness]);

  const shadowBottomClass = useMemo(() => {
    if (selectedThickness === "heavy") return "bottom-12 sm:bottom-15 md:bottom-18";
    if (selectedThickness === "bold") return "bottom-10 sm:bottom-13 md:bottom-16";
    return "bottom-8 sm:bottom-11 md:bottom-14";
  }, [selectedThickness]);

  // Automatic gentle podium rotation or next slide
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroBikes.length);
    }, 7500);
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
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16; // -8 to +8 deg
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12; // -6 to +6 deg
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  if (!currentBike) return null;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-3xl overflow-hidden bg-[#07090e] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.85)] p-4 sm:p-7 md:p-10 mb-12 select-none"
    >
      {/* ========================================================= */}
      {/* 1. LUXURY AUTOMOTIVE STUDIO LIGHTING & VOLUMETRIC GLOWS   */}
      {/* ========================================================= */}
      {/* Dynamic studio overhead softbox */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-b from-white/15 via-white/[0.03] to-transparent blur-3xl pointer-events-none rounded-full" />
      
      {/* Radial studio micro-grid floor */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px] opacity-35 pointer-events-none" />
      
      {/* Stage color harmonic aura glow tied directly to selected color pigment */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[480px] rounded-full blur-[130px] pointer-events-none opacity-25 transition-all duration-700"
        style={{
          backgroundColor: activeGlowColor
        }}
      />
      
      {/* Subtle floor backlight bounce */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[650px] sm:w-[800px] h-[200px] bg-gradient-to-t from-white/[0.08] via-red-500/[0.05] to-transparent blur-3xl rounded-full pointer-events-none" />

      {/* ========================================================= */}
      {/* 2. TOP STUDIO HEADER & TELEMETRY CONTROLS                 */}
      {/* ========================================================= */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-white/[0.08]">
        {/* Left Branding & Verified Dealer Badge */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>Paşa Motor • 3D Sanal Showroom</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-semibold text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>0 KM Orijinal Fabrika Garantili</span>
          </div>
        </div>

        {/* Right Stage Controls: 360 Indicator, Model Counter & Autoplay Switch */}
        <div className="flex items-center gap-3">
          {/* Model Counter Indicator (e.g. 02 / 08) */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono font-bold text-slate-300">
            <span className="text-red-500">{(currentIndex + 1).toString().padStart(2, "0")}</span>
            <span className="text-white/30">/</span>
            <span>{heroBikes.length.toString().padStart(2, "0")}</span>
          </div>

          {/* Autoplay Toggle Switch */}
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 backdrop-blur-md ${
              isAutoPlay
                ? "bg-red-500/15 border-red-500/40 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.2)]"
                : "bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:border-white/25"
            }`}
            title="Otomatik Tur Dönüşünü Aç / Kapat"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isAutoPlay ? "animate-spin text-red-400" : "text-slate-500"}`}
              style={{ animationDuration: "7s" }}
            />
            <span className="text-[11px]">{isAutoPlay ? "Otomatik Tur: Aktif" : "Manuel Mod"}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MAIN 3D SHOWROOM WORKBENCH (7 COLS STAGE + 5 COLS COCKPIT) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-20">
        
        {/* LEFT COLUMN: 3D TURNTABLE PODIUM & MOTORCYCLE SHOWCASE (7 cols) */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[420px] sm:min-h-[500px] md:min-h-[540px]">
          
          {/* STAGE LIGHTING & THICKNESS TOOLBAR */}
          <div className="w-full mb-3 px-1 flex flex-wrap items-center justify-between gap-2.5 text-xs z-30">
            {/* LED Glow Theme Swatches */}
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-1.5">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> LED Işık:
              </span>
              <div className="flex items-center gap-1.5">
                {LED_THEMES.map((theme) => {
                  const isActive = selectedLedTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedLedTheme(theme.id)}
                      title={theme.label}
                      className={`relative w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "ring-2 ring-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.6)]"
                          : "opacity-60 hover:opacity-100 hover:scale-105"
                      }`}
                      style={{
                        backgroundColor: theme.hex || currentColor?.hex || "#ef4444"
                      }}
                    >
                      {theme.id === "auto" && (
                        <span className="text-[8px] font-black text-black select-none">A</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Thickness / Height Selector */}
            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-1">
              <span className="text-[11px] font-semibold text-slate-300 px-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Silindir:
              </span>
              {THICKNESS_OPTIONS.map((opt) => {
                const isSelected = selectedThickness === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedThickness(opt.id)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all ${
                      isSelected
                        ? "bg-white/20 text-white shadow-sm border border-white/30"
                        : "text-slate-400 hover:text-white"
                    }`}
                    title={opt.desc}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage Controls Arrows (Luxury Machined Aluminum Appearance) */}
          <button
            onClick={handlePrev}
            aria-label="Önceki Motosiklet"
            className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl bg-black/70 hover:bg-red-600/90 text-white/80 hover:text-white backdrop-blur-xl border border-white/15 hover:border-red-500 transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Sonraki Motosiklet"
            className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl bg-black/70 hover:bg-red-600/90 text-white/80 hover:text-white backdrop-blur-xl border border-white/15 hover:border-red-500 transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center justify-center group"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* 3D Dynamic Perspective Canvas Wrapper */}
          <div
            className="relative w-full h-[370px] sm:h-[440px] md:h-[480px] flex items-center justify-center transition-transform duration-300 ease-out"
            style={{
              perspective: "1200px",
              transform: `rotateY(${mousePos.x}deg) rotateX(${mousePos.y}deg)`
            }}
          >
            
            {/* THREE.JS REVOLVING CYLINDER TURNTABLE PLATFORM */}
            <div className="absolute inset-0 w-full flex items-end justify-center z-0 pointer-events-none pb-0 sm:pb-2">
              <div className="w-full max-w-[640px] sm:max-w-[760px] md:max-w-[860px]">
                <Suspense fallback={<div className="h-64 flex items-center justify-center text-white/50 text-xs">Yükleniyor...</div>}>
                  <ShowroomCylinder3D
                    glowColor={activeGlowColor}
                    bikeId={currentBike.id}
                    bikeCategory={currentBike.category}
                    thicknessMode={selectedThickness}
                  />
                </Suspense>
              </div>
            </div>

            {/* MOTORCYCLE ON REVOLVING PLATFORM (Accurate wheel contacts & seamless color swapping) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentBike.id}-${currentColor?.uniqueKey || "default"}`}
                initial={{ opacity: 0, scale: 0.94, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ duration: 0.38, ease: "easeOut" }}
                className={`relative z-10 w-full h-full flex items-center justify-center ${contactPaddingClass}`}
              >
                {/* Reactive LED Underbody Photon Wash reflection onto wheels */}
                <div
                  className="absolute bottom-8 sm:bottom-11 md:bottom-14 left-1/2 -translate-x-1/2 w-[70%] sm:w-[60%] h-9 blur-xl pointer-events-none opacity-45 transition-colors duration-500 rounded-full z-0"
                  style={{ backgroundColor: activeGlowColor }}
                />

                {/* Physical Contact AO Shadow system directly resting on the Platter surface */}
                <div className={`absolute ${shadowBottomClass} left-1/2 -translate-x-1/2 w-[74%] sm:w-[66%] h-8 bg-black/90 blur-md rounded-[100%] pointer-events-none z-0`} />
                <div className={`absolute ${shadowBottomClass} left-[30%] sm:left-[33%] -translate-x-1/2 w-28 sm:w-36 h-4.5 bg-black/95 blur-[2.5px] rounded-[100%] pointer-events-none z-0`} />
                <div className={`absolute ${shadowBottomClass} right-[30%] sm:right-[33%] translate-x-1/2 w-28 sm:w-36 h-4.5 bg-black/95 blur-[2.5px] rounded-[100%] pointer-events-none z-0`} />
                <div className={`absolute ${shadowBottomClass} left-1/2 -translate-x-1/2 w-[54%] sm:w-[48%] h-3.5 bg-black blur-[1.5px] rounded-[100%] pointer-events-none z-0`} />

                <img
                  src={currentColor?.resolvedImageUrl || currentBike.images[0] || "/placeholder.webp"}
                  alt={`${currentBike.brand} ${currentBike.model} - ${currentColor?.displayName || "Orijinal"}`}
                  onError={(e) => {
                    e.currentTarget.src = currentBike.images[0] || "/placeholder.webp";
                  }}
                  referrerPolicy="no-referrer"
                  className="max-h-[240px] sm:max-h-[295px] md:max-h-[345px] max-w-full object-contain filter hover:scale-[1.03] transition-transform duration-500 relative z-10 [filter:drop-shadow(0_16px_32px_rgba(0,0,0,0.95))_contrast(1.03)]"
                />

                {/* Hotspot 1: Engine / Power Unit */}
                {currentBike.specs.engineCapacity && (
                  <div className="absolute top-14 left-1/4 z-30">
                    <button
                      onClick={() => setActiveHotspot(activeHotspot === "engine" ? null : "engine")}
                      className="relative group flex items-center justify-center"
                      title="Motor Teknolojisi"
                    >
                      <span className="w-5 h-5 rounded-full bg-red-500 animate-ping absolute opacity-60" />
                      <span className="w-5 h-5 rounded-full bg-red-600 border-2 border-white text-[11px] text-white font-bold flex items-center justify-center shadow-xl">
                        +
                      </span>
                      {activeHotspot === "engine" && (
                        <div className="absolute top-7 left-0 bg-[#0c1018]/95 backdrop-blur-xl border border-red-500/40 text-white text-xs p-3 rounded-xl whitespace-nowrap z-40 shadow-2xl">
                          <div className="font-bold text-red-400 flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5" />
                            {currentBike.specs.engineCapacity} Silindir Hacmi
                          </div>
                          <div className="text-[11px] text-slate-300 mt-0.5">{currentBike.specs.maxPower} Azami Güç</div>
                        </div>
                      )}
                    </button>
                  </div>
                )}

                {/* Hotspot 2: Transmission & Brakes */}
                {currentBike.specs.brakes && (
                  <div className="absolute bottom-28 right-1/4 z-30">
                    <button
                      onClick={() => setActiveHotspot(activeHotspot === "brakes" ? null : "brakes")}
                      className="relative group flex items-center justify-center"
                      title="Fren ve Şanzıman Sistemi"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500 animate-ping absolute opacity-60" />
                      <span className="w-5 h-5 rounded-full bg-emerald-600 border-2 border-white text-[11px] text-white font-bold flex items-center justify-center shadow-xl">
                        +
                      </span>
                      {activeHotspot === "brakes" && (
                        <div className="absolute bottom-7 right-0 bg-[#0c1018]/95 backdrop-blur-xl border border-emerald-500/40 text-white text-xs p-3 rounded-xl whitespace-nowrap z-40 shadow-2xl">
                          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {currentBike.specs.transmission || "Şanzıman Sistemi"}
                          </div>
                          <div className="text-[11px] text-slate-300 mt-0.5">{currentBike.specs.brakes}</div>
                        </div>
                      )}
                    </button>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

          </div>

          {/* Model Selection Dock (Horizontal Machined Capsule Strip) */}
          <div className="w-full mt-3 flex items-center justify-center gap-2 overflow-x-auto py-2 px-1 scrollbar-none">
            {heroBikes.map((b, idx) => {
              const isSelected = currentIndex === idx;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setIsAutoPlay(false);
                    setCurrentIndex(idx);
                  }}
                  className={`group relative px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-300 flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? "bg-red-600/90 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.35)] scale-[1.03]"
                      : "bg-[#0f121a]/80 border-white/10 text-slate-400 hover:text-white hover:border-white/25 hover:bg-white/[0.05]"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full transition-colors ${
                      isSelected ? "bg-white shadow-[0_0_8px_#ffffff]" : "bg-red-500/60 group-hover:bg-red-400"
                    }`}
                  />
                  <span className="tracking-wide">{b.model}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: LUXURY ATELIER SPECIFICATION & PURCHASE CARD (5 cols) */}
        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBike.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
              className="bg-[#0b0e16]/90 backdrop-blur-2xl border border-white/[0.12] rounded-3xl p-6 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col"
            >
              {/* Top Machined Racing Accent Line */}
              <div
                className="absolute top-0 left-0 w-full h-[3px] transition-colors duration-500"
                style={{
                  background: `linear-gradient(90deg, #ef4444 0%, ${currentColor?.hex || "#ef4444"} 50%, #b91c1c 100%)`
                }}
              />

              {/* Card Header Status Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
                    Resmî Bayi
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    {currentBike.condition || "0 KM Sıfır"}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Stokta Hazır
                </span>
              </div>

              {/* Motorcycle Brand & Bold Model Name */}
              <div className="py-4 border-b border-white/[0.08]">
                <div className="flex items-center justify-between text-xs font-bold text-red-500 uppercase tracking-[0.25em] mb-1.5">
                  <span>{currentBike.brand}</span>
                  <span className="text-slate-500 font-normal tracking-normal text-[11px]">{currentBike.category}</span>
                </div>
                <h2 className="font-heading font-black text-2xl sm:text-3xl lg:text-[32px] text-white tracking-tight leading-tight mb-2">
                  {currentBike.model}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
                  {currentBike.tagline || currentBike.description}
                </p>
              </div>

              {/* Pricing & Installment Financial Block */}
              <div className="py-4 border-b border-white/[0.08]">
                {currentBike.price > 0 ? (
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        {currentBike.cashPrice ? "Nakit Satış Fiyatı" : "Tavsiye Edilen Fiyat"}
                      </div>
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight">
                          {tl(currentBike.price)}
                        </span>
                        {currentBike.originalPrice && currentBike.originalPrice > currentBike.price && (
                          <span className="text-xs text-slate-500 line-through font-medium">
                            {tl(currentBike.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center sm:justify-end gap-1">
                        <CreditCard className="w-3.5 h-3.5" />
                        12 Taksit Seçeneği
                      </div>
                      <div className="text-sm font-bold text-slate-200">
                        {currentBike.installment12Price ? (
                          <>
                            {tl(currentBike.installment12Price)}{" "}
                            <span className="text-amber-400/90 font-medium text-xs block sm:inline">
                              ({Math.round(currentBike.installment12Price / 12).toLocaleString("tr-TR")} ₺ / ay)
                            </span>
                          </>
                        ) : (
                          <>
                            {Math.round(currentBike.price / 12).toLocaleString("tr-TR")} ₺{" "}
                            <span className="text-slate-400 font-normal text-xs">/ ay</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Showroom Satış Durumu
                      </div>
                      <div className="font-heading font-black text-2xl text-red-500 tracking-tight">
                        Özel Fiyat & Stok Sorunuz
                      </div>
                    </div>
                    <div className="sm:text-right">
                      <div className="text-xs font-semibold text-emerald-400 flex items-center sm:justify-end gap-1.5">
                        <ShieldCheck className="w-4 h-4" /> 2 Yıl Resmî Fabrika Garantisi
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Kredi Kartına 12 Taksit & Takas Desteği
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================= */}
              {/* REFINED COLOR CONFIGURATOR (GUARANTEED UNIQUE & VERIFIED) */}
              {/* ========================================================= */}
              <div className="py-4 border-b border-white/[0.08]">
                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                    <span>Gövde Rengi:</span>
                  </div>
                  <span className="text-white font-bold text-xs bg-white/[0.06] border border-white/10 px-2.5 py-0.5 rounded-full">
                    {currentColor?.displayName || "Orijinal Renk"}
                  </span>
                </div>

                {/* Color Swatch Capsule Buttons */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {showroomColors.map((c) => {
                    const isSelected = currentColor?.uniqueKey === c.uniqueKey;
                    return (
                      <button
                        key={c.uniqueKey}
                        onClick={() => setSelectedColorKey(c.uniqueKey)}
                        className={`group relative flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border transition-all duration-200 text-xs font-medium ${
                          isSelected
                            ? "bg-white/15 border-white text-white shadow-[0_0_16px_rgba(255,255,255,0.25)] scale-[1.03]"
                            : "bg-black/40 border-white/10 text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/[0.05]"
                        }`}
                        title={c.displayName}
                      >
                        {/* Circular Swatch with metallic border and light reflection */}
                        <span
                          className={`relative w-4 h-4 rounded-full border shadow-inner transition-transform duration-200 shrink-0 ${
                            isSelected ? "ring-2 ring-white scale-110" : "border-white/30 group-hover:scale-105"
                          }`}
                          style={{
                            backgroundColor: c.hex,
                            boxShadow: isSelected ? `0 0 10px ${c.hex}` : "none"
                          }}
                        >
                          {/* Inner soft gloss reflex */}
                          <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/25 to-white/60 pointer-events-none" />
                        </span>
                        
                        <span className="text-[11px] tracking-wide whitespace-nowrap">{c.displayName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical Telemetry Grid (Engine, Gearbox, License, Power) */}
              <div className="grid grid-cols-3 gap-2 py-4 border-b border-white/[0.08] text-center">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-2">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Motor</div>
                  <div className="text-xs font-bold text-white truncate">
                    {currentBike.specs.engineCapacity || currentBike.specs.maxPower || "Standart"}
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-2">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Şanzıman</div>
                  <div className="text-xs font-bold text-white truncate">
                    {currentBike.specs.transmission || "Otomatik"}
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-2">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Ehliyet</div>
                  <div className="text-xs font-bold text-emerald-400 truncate">
                    {currentBike.licenseType?.includes("B") ? "B Sınıfı" : "A1 / A2"}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Inspect & WhatsApp & Loan Calculator */}
              <div className="pt-4 space-y-2.5">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    to={`/magaza/${currentBike.slug}`}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white text-neutral-950 hover:bg-slate-100 font-bold text-xs tracking-wider uppercase text-center transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(255,255,255,0.2)] active:scale-[0.98]"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Detaylı İncele</span>
                  </Link>

                  <a
                    href={`https://wa.me/905348996817?text=Merhaba,%20Pa%C5%9Fa%20Motor%203D%20Showroom'da%20inceledi%C4%9Fim%20MotoLux%20${encodeURIComponent(currentBike.model)}%20modeli%20(${encodeURIComponent(currentColor?.displayName || "Se%C3%A7ili%20Renk")})%20i%C3%A7in%20teklif%20ve%20stok%20bilgisi%20almak%20istiyorum.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase text-center transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(16,185,129,0.25)] active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Satış Danışmanı</span>
                  </a>
                </div>

                {onOpenLoanCalculator && (
                  <button
                    onClick={() => onOpenLoanCalculator(currentBike)}
                    className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
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
