import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import logo from '@/assets/pasa-motor-logo.webp';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
  fallbackIcon?: React.ReactNode;
}

const DEFAULT_FALLBACK_IMAGES = [
  "/placeholder.webp",
  "/images/blog-cover-images/motosiklet-yedek-parca-fiyatlari-kapak.webp",
  "/images/blog-cover-images/tvs-motosiklet-bakimi-servis-kapak.webp"
];

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className,
  fallbackClassName,
  fallbackIcon,
  ...props 
}) => {
  const [fallbackIndex, setFallbackIndex] = useState(-1);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src ? String(src) : undefined);

  useEffect(() => {
    if (src && String(src).trim() !== '') {
      setCurrentSrc(String(src));
      setFallbackIndex(-1);
    } else {
      // src missing initially, start with first fallback candidate
      setCurrentSrc(DEFAULT_FALLBACK_IMAGES[0]);
      setFallbackIndex(0);
    }
  }, [src]);

  const handleError = () => {
    const nextIndex = fallbackIndex + 1;
    if (nextIndex < DEFAULT_FALLBACK_IMAGES.length) {
      setFallbackIndex(nextIndex);
      setCurrentSrc(DEFAULT_FALLBACK_IMAGES[nextIndex]);
    } else {
      // All image candidates failed, trigger sleek SVG placeholder rendering
      setCurrentSrc(undefined);
    }
  };

  if (!currentSrc) {
    return (
      <div 
        className={cn(
          "flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-400 p-6 rounded-2xl border border-slate-800/80 select-none overflow-hidden relative group/fallback shadow-inner min-h-[160px]", 
          className, 
          fallbackClassName
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.1),transparent_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center max-w-[90%]">
          {fallbackIcon || (
            <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-center shadow-lg mb-2.5 group-hover/fallback:border-red-500/40 transition-colors">
              <img src={logo} alt="Paşa Motor" className="w-8 h-8 object-contain opacity-85" />
            </div>
          )}
          <span className="text-[10px] font-extrabold text-slate-300 tracking-widest uppercase font-mono bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
            {alt && alt !== "Görsel" ? alt : "PAŞA MOTOR YETKİLİ SERVİS"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt || "Görsel"}
      className={className}
      onError={handleError}
      loading={props.loading || "lazy"}
      decoding={props.decoding || "async"}
      {...props}
    />
  );
};


