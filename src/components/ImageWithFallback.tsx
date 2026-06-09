import React, { useState } from 'react';
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

  if (error || !src) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-muted text-muted-foreground", className, fallbackClassName)}>
        {fallbackIcon || <ImageIcon className="w-10 h-10 mb-2 opacity-50" />}
        <span className="text-xs font-medium opacity-50">Görsel Yüklenemedi</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Görsel"}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};
