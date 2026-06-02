import React from "react";
import { Wrench, ShieldCheck, Image, MessageCircle } from "lucide-react";

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
      className={`relative w-full h-full min-h-[inherit] flex flex-col items-center justify-center bg-slate-950 p-6 text-center select-none overflow-hidden group/placeholder border border-slate-900/60 rounded-2xl ${className}`}
    >
      {/* 1. Teknik Blueprint Mühendislik Grid Deseni - Kurumsallığı hissettirir */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
      
      {/* 2. Dairesel Kırmızı/Indigo Kurumsal Işık Hüzmesi */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-650 bg-red-600/10 rounded-full blur-3xl pointer-events-none opacity-50 group-hover/placeholder:opacity-80 transition-opacity duration-500" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none opacity-50 group-hover/placeholder:opacity-80 transition-opacity duration-500" />

      {/* 3. İkon ve Teknik Servis Kadran Grubu */}
      <div className="relative mb-4 flex items-center justify-center">
        {/* Koruyucu ve taşıyıcı harelenmeler */}
        <div className="absolute inset-0 bg-red-600/10 rounded-full blur-2xl scale-90 group-hover/placeholder:scale-110 transition-transform duration-500" />
        
        {/* Ana İkon Konteyneri */}
        <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-xl group-hover/placeholder:border-red-500/30 transition-all duration-300">
          <Image className="w-8 h-8 text-slate-500 group-hover/placeholder:scale-105 transition-transform duration-300 absolute" strokeWidth={1.5} />
          <Wrench className="w-4 h-4 text-red-500 absolute -bottom-1.5 -right-1.5 bg-slate-950 rounded-lg p-0.5 border border-slate-800 rotate-90 group-hover/placeholder:rotate-[135deg] duration-505 transition-transform" />
        </div>

        {/* %100 Orijinal Parça Küçük Rozeti */}
        <div className="absolute -top-1.5 -right-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md p-0.5 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        </div>
      </div>

      {/* 4. Metinsel Alan ve Bilgilendirme */}
      <div className="space-y-2.5 relative z-10 max-w-[90%] flex flex-col items-center">
        {/* Marka Etiketi */}
        <span className="text-[9px] font-black tracking-[0.15em] text-red-500 uppercase font-mono px-2 py-0.5 rounded bg-red-500/5 border border-red-500/10 shadow-sm leading-none">
          {brand}
        </span>
        
        {/* Durum Başlığı */}
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-200 tracking-tight leading-tight group-hover/placeholder:text-white transition-colors">
            Orijinal Parça Görseli Hazırlanıyor
          </h4>
          <p className="text-[10px] text-zinc-400 font-medium max-w-[200px] leading-relaxed mx-auto">
            Ürün teknik ekibimiz tarafından doğrulanmış olup, orijinal katalog görseli güncellenmektedir.
          </p>
        </div>

        {/* Kullanıcı Güveni ve Dönüşümü Artıran İpucu */}
        <div className="w-full max-w-[220px] bg-slate-900/60 border border-white/[0.03] rounded-lg p-2 mt-1.5 text-left flex items-start gap-1.5 hover:border-red-500/20 transition-all duration-300">
          <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-[9px] leading-normal text-zinc-400">
            <span className="text-slate-200 font-bold block">Fotoğraf Talep Edin</span>
            Parçanın depodaki gerçek fotoğrafını almak için WhatsApp numaramızı kullanabilirsiniz.
          </div>
        </div>
      </div>

      {/* 5. Kurumsal Marka Filigranı */}
      <div className="absolute bottom-2.5 right-3 text-[8px] font-black tracking-widest text-white/[0.02] uppercase select-none">
        PASAMOTOR.COM.TR
      </div>
    </div>
  );
};

export default ProductImagePlaceholder;
