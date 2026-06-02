import React, { useRef, useState, useEffect } from "react";
import { ReactSketchCanvas, type ReactSketchCanvasRef } from "react-sketch-canvas";
import { 
  X, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Download, 
  Upload, 
  Check, 
  PenTool, 
  Eraser, 
  Sliders, 
  Palette, 
  Grid, 
  BookOpen, 
  Image as ImageIcon, 
  Sparkles, 
  Save, 
  Maximize2, 
  Minimize2,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DrawingCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (base64Image: string) => void;
  initialDrawing?: string; // Base64 data if continuing an old drawing
  noteTitle?: string;
}

const PREMIUM_COLORS = [
  { name: "Kömür Siyahı", hex: "#0f172a" },
  { name: "Servis Kırmızısı", hex: "#dc2626" },
  { name: "Turuncu", hex: "#f97316" },
  { name: "Paşa Altını", hex: "#eab308" },
  { name: "Neon Yeşil", hex: "#22c55e" },
  { name: "Mavi", hex: "#2563eb" },
  { name: "İndigo", hex: "#4f46e5" },
  { name: "Mor", hex: "#9333ea" },
  { name: "Temiz Beyaz", hex: "#f8fafc" },
];

const BRUSH_PRESETS = [
  { label: "İnce Kalem", size: 2, opacity: 1 },
  { label: "Mühendislik", size: 4, opacity: 1 },
  { label: "Kalın İşaretçi", size: 8, opacity: 1.0 },
  { label: "Fosforlu Kalem", size: 16, opacity: 0.4 },
];

export default function DrawingCanvasModal({
  isOpen,
  onClose,
  onSave,
  initialDrawing,
  noteTitle
}: DrawingCanvasModalProps) {
  const { toast } = useToast();
  const canvasRef = useRef<ReactSketchCanvasRef>(null);

  // Drawing Settings
  const [strokeColor, setStrokeColor] = useState("#dc2626"); // Defaults to corporate service red
  const [customColor, setCustomColor] = useState("#ffffff");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [strokeOpacity, setStrokeOpacity] = useState(1.0);
  const [eraserMode, setEraserMode] = useState(false);
  const [eraserWidth, setEraserWidth] = useState(10);
  
  // Canvas grid overlays
  // "blank" | "engineering-grid" | "dot-grid" | "ruled-lines"
  const [gridTheme, setGridTheme] = useState<"blank" | "engineering-grid" | "dot-grid" | "ruled-lines">("engineering-grid");
  
  // Custom uploaded background template image
  const [uploadedBg, setUploadedBg] = useState<string | undefined>(undefined);
  
  // Is modal in fullscreen
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load existing drawing as background or sketch load
  useEffect(() => {
    if (initialDrawing && isOpen) {
      setUploadedBg(initialDrawing);
    } else {
      setUploadedBg(undefined);
    }
  }, [initialDrawing, isOpen]);

  if (!isOpen) return null;

  // Handles custom background upload (e.g. schematic, bike diagram)
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir görsel dosyası yükleyin.",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedBg(result);
      toast({
        title: "Şema Yüklendi ✓",
        description: "Motosiklet şeması tuval arka planına yerleştirildi. Üzerine çizebilirsiniz.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleApplyBrushPreset = (preset: { size: number; opacity: number }) => {
    setStrokeWidth(preset.size);
    setStrokeOpacity(preset.opacity);
    setEraserMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleToggleEraser = (active: boolean) => {
    setEraserMode(active);
    canvasRef.current?.eraseMode(active);
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    setUploadedBg(undefined);
    toast({
      title: "Temizlendi",
      description: "Tuval ve arka plan başarıyla sıfırlandı."
    });
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUri = await canvasRef.current.exportImage("png");
      onSave(dataUri);
      toast({
        title: "Çizim Kaydedildi ✓",
        description: "Notun içerisine başarıyla aktarıldı."
      });
      onClose();
    } catch (e) {
      console.error("Export error", e);
      toast({
        title: "Zaman Aşımı",
        description: "Çizim aktarılamadı.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadDraft = async (format: "png" | "svg") => {
    if (!canvasRef.current) return;
    try {
      if (format === "png") {
        const dataUri = await canvasRef.current.exportImage("png");
        const a = document.createElement("a");
        a.href = dataUri;
        a.download = `pasamotor_diyagram_${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const svgContent = await canvasRef.current.exportSvg();
        const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `pasamotor_diyagram_${Date.now()}.svg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
      toast({
        title: "İndirme Başarılı ✓",
        description: `${format.toUpperCase()} formatında cihazınıza kaydedildi.`
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Hata",
        description: "Dosya kaydedilemedi.",
        variant: "destructive"
      });
    }
  };

  // Convert rgba hex for translucent highlighting
  const brushColorWithOpacity = (() => {
    if (strokeOpacity === 1.0) return strokeColor;
    // Simple hex to rgba
    const hex = strokeColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${strokeOpacity})`;
  })();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className={`w-full ${isFullscreen ? 'max-w-[98vw] h-[95vh]' : 'max-w-6xl h-[85vh]'} bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}>
        
        {/* Üst Bar / Kontrol Panel Başlığı */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-600/10 border border-red-500/20 text-red-500">
              <PenTool className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">PAŞA MOTOR ATÖLYE</span>
              <h2 className="text-sm font-black text-white flex items-center gap-2">
                Teknik Çizim ve Diyagram Paneli {noteTitle && <span className="text-zinc-500 font-medium">({noteTitle})</span>}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Yatay Modu Küçük Ekran Yap" : "Tam Ekran Yap"}
              className="p-2 border border-slate-800 rounded-xl text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 border border-slate-800 rounded-xl text-slate-400 hover:text-emerald-400 bg-slate-900/60 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ana İş İstasyonu (Çizim Alanı + Kontrol Sütunu) */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row bg-slate-900">
          
          {/* Sol Kolon: Fırça Ayarları, Şemalar, Renkler */}
          <div className="w-full lg:w-[280px] bg-slate-950/40 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 overflow-y-auto space-y-5 flex flex-col justify-start select-none">
            
            {/* Kalem mi Silgi mi? */}
            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase block">ARAÇ SEÇİMİ</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleEraser(false)}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    !eraserMode 
                      ? "bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/10" 
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  Çizim Kalemi
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleEraser(true)}
                  className={`py-2 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    eraserMode 
                      ? "bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/10" 
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Eraser className="w-4 h-4" />
                  Silici
                </button>
              </div>
            </div>

            {/* Kalem Şablon Hazır Değerleri */}
            {!eraserMode && (
              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase block">KALEM KALIPLARI</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {BRUSH_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyBrushPreset(p)}
                      className={`py-1.5 px-2 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 text-slate-300 hover:text-white font-semibold text-[10px] text-center transition-all cursor-pointer ${
                        strokeWidth === p.size && strokeOpacity === p.opacity ? "ring-1 ring-red-500 border-transparent text-red-400" : ""
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Renk Paleti */}
            {!eraserMode && (
              <div className="space-y-2">
                <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase block">PREMIUM RENK PALETİ</span>
                <div className="grid grid-cols-3 gap-2">
                  {PREMIUM_COLORS.map((col, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setStrokeColor(col.hex)}
                      title={col.name}
                      style={{ backgroundColor: col.hex }}
                      className={`h-7 rounded-lg border cursor-pointer relative transition-transform ${
                        col.hex === "#f8fafc" ? "border-slate-700" : "border-slate-950"
                      } ${strokeColor === col.hex ? "scale-110 ring-2 ring-red-500 ring-offset-2 ring-offset-slate-900" : "hover:scale-105"}`}
                    >
                      {strokeColor === col.hex && (
                        <Check className={`w-4 h-4 absolute inset-0 m-auto ${col.hex === "#f8fafc" || col.hex === "#eab308" ? "text-slate-900" : "text-white"}`} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Özel Hex Girişi */}
                <div className="flex gap-2 items-center pt-1.5">
                  <div className="relative w-7 h-7 rounded-lg border border-slate-800 overflow-hidden shrink-0">
                    <input 
                      type="color" 
                      value={customColor} 
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        setStrokeColor(e.target.value);
                      }}
                      className="absolute inset-0 w-full h-full p-0 border-0 opacity-0 cursor-pointer"
                    />
                    <div style={{ backgroundColor: customColor }} className="w-full h-full flex items-center justify-center">
                      <Palette className="w-3.5 h-3.5 text-white mix-blend-difference" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={strokeColor}
                    onChange={(e) => setStrokeColor(e.target.value)}
                    placeholder="#hex-kodu"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg py-1 px-2.5 text-[10px] text-zinc-300 font-mono focus:outline-none focus:border-red-500/50"
                  />
                </div>
              </div>
            )}

            {/* İnce Ayarlar Sürgüsü */}
            <div className="space-y-4 pt-1 border-t border-slate-800/60">
              {/* Kalınlık */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-black tracking-widest text-zinc-400">
                  <span>{eraserMode ? "SİLİCİ BOYUTU" : "FIRÇA KALINLIĞI"}</span>
                  <span className="font-mono text-xs">{eraserMode ? eraserWidth : strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={eraserMode ? eraserWidth : strokeWidth}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (eraserMode) setEraserWidth(val);
                    else setStrokeWidth(val);
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
              </div>

              {/* Opaklık */}
              {!eraserMode && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-black tracking-widest text-zinc-400">
                    <span>MÜREKKEP OPAKLIĞI</span>
                    <span className="font-mono text-xs">%{Math.round(strokeOpacity * 100)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={strokeOpacity}
                    onChange={(e) => setStrokeOpacity(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
                  />
                </div>
              )}
            </div>

            {/* Tuval Şablon Katmanları (Grid) */}
            <div className="space-y-2 pt-1 border-t border-slate-800/60">
              <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase block">TEKNİK ZEMİN</span>
              <div className="space-y-1">
                {[
                  { id: "blank", label: "Boş Tuval", icon: BookOpen },
                  { id: "engineering-grid", label: "Mühendislik Grid", icon: Grid },
                  { id: "dot-grid", label: "Noktalı Grid", icon: Grid },
                  { id: "ruled-lines", label: "Çizgili Defter", icon: BookOpen },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setGridTheme(item.id as any)}
                    className={`w-full py-1.5 px-2.5 rounded-lg border text-left text-[11px] font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      gridTheme === item.id 
                        ? "bg-slate-900 border-slate-700 text-white" 
                        : "bg-slate-950/20 border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Şema/Sorgu Üzerine Çizim Yükle */}
            <div className="space-y-2 pt-1 border-t border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase block">ŞEMA / GÖRSEL MODEL</span>
                <span title="Motosiklet mekanik şeması veya parça fotoğrafı yükleyip üzerine işaretlemeler yapabilirsiniz.">
                  <Info className="w-3 h-3 text-red-500/80 animate-pulse" />
                </span>
              </div>
              <label className="flex items-center justify-center gap-2 w-full py-2 px-3 border border-dashed border-slate-800 hover:border-slate-700 rounded-xl bg-slate-950/40 text-slate-400 hover:text-white transition-all text-xs font-bold cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                Şema Görseli Yükle
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleBgUpload} 
                  className="hidden" 
                />
              </label>
              {uploadedBg && (
                <button
                  type="button"
                  onClick={() => setUploadedBg(undefined)}
                  className="w-full text-center text-[10px] font-bold text-red-400 hover:text-red-300 select-none"
                >
                  Arka Plan Modelini Kaldır
                </button>
              )}
            </div>

          </div>

          {/* Sağ Kolon: Çizim Tuval Alanı */}
          <div className="flex-1 min-h-0 flex flex-col p-4 bg-slate-950/40">
            
            {/* Üst Kısayollar ve Aksiyon Grubu */}
            <div className="flex items-center justify-between gap-4 p-2 bg-slate-900 border border-slate-800 rounded-t-xl shrink-0 border-b-0">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleUndo}
                  title="Geri Al"
                  className="p-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Geri Al
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  title="İleri Al"
                  className="p-1 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                >
                  <RotateCw className="w-3.5 h-3.5" /> İleri Al
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Lokal Cihaza İndirme İndisleri */}
                <button
                  type="button"
                  onClick={() => handleDownloadDraft("png")}
                  title="PNG Olarak Kaydet"
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />PNG
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadDraft("svg")}
                  title="SVG Olarak Kaydet"
                  className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />SVG
                </button>
                
                <div className="w-px h-5 bg-slate-800 mx-1" />

                <button
                  type="button"
                  onClick={handleClear}
                  title="Tuvali Temizle"
                  className="p-1 px-2.5 rounded-lg bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-red-400 hover:text-red-300 font-bold text-xs cursor-pointer transition-colors"
                >
                  Temizle
                </button>
              </div>
            </div>

            {/* Tuval Container (Teknik Grid Arka Planı Sınıfları) */}
            <div className={`overflow-hidden border border-slate-800 bg-white relative flex-1 cursor-crosshair rounded-b-xl max-h-[100%]
              ${gridTheme === "engineering-grid" ? "grid-engineering" : ""}
              ${gridTheme === "dot-grid" ? "grid-dots" : ""}
              ${gridTheme === "ruled-lines" ? "grid-notebook" : ""}
            `}>
              
              {/* Teknik Grid & Blueprint CSS Efektleri */}
              <style>{`
                .grid-engineering {
                  background-color: #0b0f19 !important;
                  background-image: 
                    linear-gradient(rgba(220, 38, 38, 0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(220, 38, 38, 0.08) 1px, transparent 1px),
                    linear-gradient(rgba(220, 38, 38, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(220, 38, 38, 0.03) 1px, transparent 1px) !important;
                  background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px !important;
                }
                .grid-dots {
                  background-color: #0f172a !important;
                  background-image: radial-gradient(rgba(241, 245, 249, 0.1) 1.5px, transparent 1.5px) !important;
                  background-size: 20px 20px !important;
                }
                .grid-notebook {
                  background-color: #fcfbf7 !important;
                  background-image: linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px) !important;
                  background-size: 100% 24px !important;
                }
              `}</style>

              <ReactSketchCanvas
                ref={canvasRef}
                strokeWidth={strokeWidth}
                strokeColor={brushColorWithOpacity}
                eraserWidth={eraserWidth}
                canvasColor={gridTheme === "blank" ? "#ffffff" : "transparent"}
                backgroundImage={uploadedBg}
                preserveBackgroundImageAspectRatio="xMidYMid meet"
                className="w-full h-full"
              />
              
              {/* Canlı Çizim Fırçası Boyut / Renk Gösterge Köşesi */}
              <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[10px] font-bold text-zinc-300 pointer-events-none flex items-center gap-2 select-none shadow-lg backdrop-blur-sm">
                <span className="font-mono text-zinc-400">Kalem:</span>
                <div 
                  style={{ 
                    backgroundColor: eraserMode ? "transparent" : brushColorWithOpacity,
                    width: `${Math.max(6, Math.min(24, eraserMode ? eraserWidth : strokeWidth))}px`,
                    height: `${Math.max(6, Math.min(24, eraserMode ? eraserWidth : strokeWidth))}px`,
                    border: eraserMode ? "2px dashed #f59e0b" : "1px solid rgba(255,255,255,0.2)"
                  }} 
                  className="rounded-full shadow-inner shrink-0"
                />
                <span className="font-mono text-zinc-400">{eraserMode ? "Silici Modu" : `${strokeWidth}px - Ops:%${Math.round(strokeOpacity * 100)}`}</span>
              </div>
            </div>

          </div>

        </div>

        {/* Alt Butonlar ve Kaydetme Çubuğu */}
        <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between gap-4 bg-slate-950/40 shrink-0 select-none">
          <div className="text-[10px] text-zinc-400 font-semibold font-mono hidden sm:flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Notunuza aktarmak için "Çizimi Nota Aktar ve Kaydet" düğmesini kullanın.</span>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-slate-800 rounded-xl text-zinc-400 hover:text-white text-xs font-bold bg-slate-900/60 hover:bg-slate-800 transition-colors cursor-pointer font-sans"
            >
              Kutuyu Kapat
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.01] text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-xl shadow-indigo-600/15 cursor-pointer"
            >
              <Save className="w-4 h-4 shrink-0" />
              ÇİZİMİ NOTA AKTAR VE KAYDET
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
