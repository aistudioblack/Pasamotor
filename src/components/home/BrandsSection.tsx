import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { BRANDS } from "@/data/brands";

const BrandsSection = () => {
  const authorizedBrands = BRANDS.filter((b) => b.isAuthorized);

  return (
    <section className="py-16 md:py-20 border-b border-border bg-gradient-to-b from-background via-background/95 to-background relative overflow-hidden">
      {/* Arka plan yumuşak ışık efekti */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-80 bg-red-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            Resmî Bayi & Yetkili Servis
          </div>
          <h2 className="font-heading font-bold text-2xl md:text-4xl text-foreground mb-3 tracking-tight">
            Yetkili Servis Bayi Markalarımız
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            İstanbul Fatih'te <strong className="text-foreground">TVS</strong>, <strong className="text-foreground">Falcon</strong> ve <strong className="text-foreground">Işıldar</strong> markalarının resmî yetkili satış, orijinal yedek parça ve teknik servis noktası.
          </p>
        </div>

        {/* 3 Marka Kartı Grid - Ortalanmış, Eşit Genişlik & Yükseklikte */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto justify-center items-stretch">
          {authorizedBrands.map((brand) => {
            return (
              <Link
                key={brand.slug}
                to={`/marka/${brand.slug}`}
                className="group relative overflow-hidden bg-[#111318]/90 hover:bg-[#161318] border border-white/[0.08] hover:border-red-500/40 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-between text-center transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_12px_35px_-10px_rgba(239,68,68,0.3)] hover:-translate-y-1.5 min-h-[300px] w-full"
              >
                {/* Kart Çevresi Kırmızı Çizgi Animasyonu */}
                <span className="absolute top-0 left-0 h-[1.5px] bg-red-500 w-0 group-hover:w-full transition-all duration-300 ease-out z-20" />
                <span className="absolute top-0 right-0 w-[1.5px] bg-red-500 h-0 group-hover:h-full transition-all duration-300 delay-[100ms] ease-out z-20" />
                <span className="absolute bottom-0 right-0 h-[1.5px] bg-red-500 w-0 group-hover:w-full transition-all duration-300 delay-[200ms] ease-out z-20" />
                <span className="absolute bottom-0 left-0 w-[1.5px] bg-red-500 h-0 group-hover:h-full transition-all duration-300 delay-[300ms] ease-out z-20" />

                {/* Arka plan kırmızı parlama efekti */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/25 transition-all duration-500 pointer-events-none" />

                {/* Üst Kısım: Rozet (Badge) */}
                <div className="w-full flex justify-center relative z-10">
                  <span className="inline-flex items-center text-[11px] uppercase font-bold tracking-wider px-3.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                    {brand.badge || "Yetkili Servis"}
                  </span>
                </div>

                {/* Orta Kısım: Logo Kutusu */}
                <div className="relative w-28 h-28 my-5 rounded-2xl bg-[#181b22] border border-white/[0.1] flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:bg-[#21161a] group-hover:border-red-500/30 shadow-inner">
                  {/* Logo Kutusu Kırmızı Çizgi Animasyonu */}
                  <span className="absolute top-0 left-0 h-[1px] bg-red-500 w-0 group-hover:w-full transition-all duration-300 ease-out z-20" />
                  <span className="absolute top-0 right-0 w-[1px] bg-red-500 h-0 group-hover:h-full transition-all duration-300 delay-[100ms] ease-out z-20" />
                  <span className="absolute bottom-0 right-0 h-[1px] bg-red-500 w-0 group-hover:w-full transition-all duration-300 delay-[200ms] ease-out z-20" />
                  <span className="absolute bottom-0 left-0 w-[1px] bg-red-500 h-0 group-hover:h-full transition-all duration-300 delay-[300ms] ease-out z-20" />

                  <span className="font-heading font-black text-3xl md:text-4xl tracking-tight text-foreground group-hover:text-red-400 transition-colors duration-300 relative z-10">
                    {brand.name}
                  </span>
                </div>

                {/* Alt Kısım: Marka Adı, Açıklama ve İncele Butonu */}
                <div className="relative z-10 flex flex-col items-center w-full">
                  <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-red-400 transition-colors duration-300 mb-1.5">
                    {brand.name} Motosiklet
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed max-w-[220px] mb-4">
                    {brand.desc}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 group-hover:text-red-300 transition-all duration-300">
                    Parça & Servis Detayı
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrandsSection;
