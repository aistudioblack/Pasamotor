import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackClassName?: string;
  fallbackIcon?: React.ReactNode;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className,
  fallbackClassName,
  fallbackIcon,
  ...props 
}) => {
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setError(false);
  }, [src]);

  const handleError = () => {
    if (!error && alt && alt.length > 5) {
      // First fallback: Auto-generate an image from title using Pollinations AI
      const encodedAlt = encodeURIComponent(alt.replace(/[^a-zA-Z0-9,\s]/g, '').slice(0, 200));
      const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedAlt}?width=1024&height=576&model=flux&nologo=true&seed=42`;
      
      // Prevent infinite loops if pollinations also fails
      if (currentSrc !== fallbackUrl) {
        setCurrentSrc(fallbackUrl);
        return;
      }
    }
    setError(true);
  };

  if (error || !currentSrc) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-muted text-muted-foreground", className, fallbackClassName)}>
        {fallbackIcon || <ImageIcon className="w-10 h-10 mb-2 opacity-50" />}
        <span className="text-xs font-medium opacity-50">Görsel Yüklenemedi</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt || "Görsel"}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

