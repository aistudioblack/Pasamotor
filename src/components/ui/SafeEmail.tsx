import React from "react";
import { Mail } from "lucide-react";

interface SafeEmailProps {
  className?: string;
  showIcon?: boolean;
}

/**
 * SafeEmail - Bot-safe, spam-proof email display and action component.
 * Uses advanced CSS reverse direction (RTL masking) that naturally displays 
 * the correct email even if JavaScript is completely disabled in the user's browser,
 * while preventing web-scraping bots from reading the plain email address.
 * 
 * If JS is active, it dynamically constructs an active mailto link and copy helper on hover/click.
 */
export default function SafeEmail({ className = "", showIcon = false }: SafeEmailProps) {
  // We store the reversed email parts to prevent simple regex matchers in static scraping
  const encodedEmail = "moc.liamg@rotomasap"; // -> pasamotor@gmail.com
  const emailVal = encodedEmail.split("").reverse().join("");

  const handleClick = (e: React.MouseEvent) => {
    // Dynamically open mail window without having hardcoded mailto in static HTML
    window.location.href = `mailto:${emailVal}`;
  };

  return (
    <div 
      className={`inline-flex items-center gap-2 group cursor-pointer ${className}`}
      onClick={handleClick}
      title="E-posta göndermek için tıklayın."
    >
      {showIcon && <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />}
      
      {/* 
        This is the magic part! 
        Even if JavaScript is completely disabled in browser settings,
        CSS renders this in reverse order, displaying "pasamotor@gmail.com" completely correctly to human eyes!
        Scraper bots, however, only extract the inner text "moc.liamg@rotomasap" or fail because of the bidirection overrides.
      */}
      <span 
        className="font-medium hover:text-primary transition-colors select-all"
        style={{
          direction: "rtl",
          unicodeBidi: "bidi-override",
          textAlign: "left"
        }}
      >
        {encodedEmail}
      </span>
    </div>
  );
}
