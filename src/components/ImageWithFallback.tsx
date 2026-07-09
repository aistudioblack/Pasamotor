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
    if (currentSrc !== '/placeholder.webp') {
      setCurrentSrc('/placeholder.webp');
    } else {
      setError(true);
    }
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
      loading={props.loading || "lazy"}
      decoding={props.decoding || "async"}
      {...props}
    />
  );
};

