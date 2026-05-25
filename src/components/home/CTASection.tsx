import { MessageCircle, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden p-8 md:p-16 text-center" style={{ background: "var(--gradient-primary)" }}>
          {/* Decorative */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

          <div className="relative">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary-foreground mb-4">
              Hayalinizdeki Motosiklete Sahip Olun
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8 text-lg">
              Hemen bizi arayın veya WhatsApp'tan yazın. Size en uygun motosikleti birlikte bulalım.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/905348996817?text=Merhaba%2C%20motosikletleriniz%20hakk%C4%B1nda%20bilgi%20almak%20ve%20sipari%C5%9F%20vermek%20istiyorum."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-background text-foreground font-semibold text-sm hover:bg-background/90 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp ile Yazın
              </a>
              <a
                href="tel:+905348996817"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary-foreground/30 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-all"
              >
                <Phone className="w-5 h-5" />
                0534 899 68 17
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
