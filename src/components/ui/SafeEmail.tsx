import React, { useState, useEffect } from "react";
import { Mail } from "lucide-react";

interface SafeEmailProps {
  className?: string;
  showIcon?: boolean;
}

export default function SafeEmail({ className = "", showIcon = false }: SafeEmailProps) {
  // pasamotor@gmail.com base64 encoded to prevent static scraping
  const encodedEmail = "cGFzYW1vdG9yQGdtYWlsLmNvbQ=="; 
  const [email, setEmail] = useState("E-posta Adresi Yükleniyor...");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Decode email on client-side mount
    const decoded = atob(encodedEmail);
    setEmail(decoded);
    setIsReady(true);
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isReady) {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <div 
      className={`inline-flex items-center gap-2 group cursor-pointer ${className}`}
      onClick={handleClick}
      title="E-posta göndermek için tıklayın."
    >
      {showIcon && <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
      
      <span className="font-medium hover:text-primary transition-colors select-all">
        {email}
      </span>
    </div>
  );
}
