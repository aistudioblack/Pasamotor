import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Hafif pulse dalgası (arka plan radar efekti) */}
      <div className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />

      {/* Ana WhatsApp Butonu (Hafif Bounce & Pulse Animasyonlu) */}
      <a
        href="https://wa.me/905348996817?text=Merhaba%2C%20%C3%BCr%C3%BCnleriniz%20hakk%C4%B1nda%20bilgi%20almak%20ve%20sipari%C5%9F%20vermek%20istiyorum."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp ile iletişime geçin"
        className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-[#fff] font-bold text-sm shadow-xl hover:scale-110 active:scale-95 transition-transform duration-300 animate-whatsapp-float group cursor-pointer border border-white/20"
      >
        <MessageCircle className="w-5 h-5 text-white transition-transform group-hover:rotate-12 duration-300 shrink-0" />
        <span className="hidden sm:inline font-semibold tracking-wide">WhatsApp</span>

        {/* Yeşil canlı durum noktası */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-[#25D366]"></span>
        </span>
      </a>
    </div>
  );
};

export default WhatsAppButton;
