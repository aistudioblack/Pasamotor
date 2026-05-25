import React from "react";
import { CameraOff, Sparkles } from "lucide-react";

interface ProductImagePlaceholderProps {
  className?: string;
  brand?: string;
}

export const ProductImagePlaceholder: React.FC<ProductImagePlaceholderProps> = ({
  className = "",
  brand = "PAŞA MOTOR"
}) => {
  return (
    <div
      className={`relative w-full h-full min-h-[inherit] flex flex-col items-center justify-center bg-gradient-to-br from-[#121620] via-[#161a26] to-[#0d0f14] p-6 text-center select-none overflow-hidden group/placeholder ${className}`}
    >
      {/* Arka Plan Dekoratif Işıklar */}
      <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-primary/5 to-transparent pointer-events-none opacity-40 transition-opacity duration-500 group-hover/placeholder:opacity-75" />
      
      {/* No-Image Simgesi (Kamera Üzeri Çizgili) */}
      <div className="relative mb-3 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl scale-75 group-hover/placeholder:scale-100 transition-transform duration-500" />
        <div className="relative p-4 rounded-full bg-white/[0.02] border border-white/[0.05] shadow-inner text-muted-foreground/45 group-hover/placeholder:text-primary/70 group-hover/placeholder:border-primary/20 transition-all duration-300">
          <CameraOff className="w-10 h-10 stroke-[1.25]" />
        </div>
        
        {/* Parıltı Efekti */}
        <div className="absolute -top-1 -right-1 p-1 bg-primary/20 rounded-full animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
        </div>
      </div>

      {/* Metin Bilgileri */}
      <div className="space-y-1 relative z-10 max-w-[85%]">
        <span className="text-[10px] font-bold tracking-widest text-primary/80 uppercase font-mono px-2 py-0.5 rounded bg-primary/5 border border-primary/10">
          {brand}
        </span>
        <h4 className="text-xs font-semibold text-foreground/80 group-hover/placeholder:text-foreground transition-colors pt-1">
          Görsel Hazırlanıyor
        </h4>
        <p className="text-[10px] text-muted-foreground/60 leading-normal">
          Orijinal parça görseli en kısa sürede eklenecektir.
        </p>
      </div>

      {/* Dekoratif Çizgiler */}
      <div className="absolute bottom-2 right-2 text-[9px] font-mono font-bold tracking-lighter text-white/[0.02] uppercase">
        PASAMOTOR.COM.TR
      </div>
    </div>
  );
};

export default ProductImagePlaceholder;
