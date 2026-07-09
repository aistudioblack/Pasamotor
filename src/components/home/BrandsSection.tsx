import { Link } from "react-router-dom";
import { BRANDS } from "@/data/brands";

const BrandsSection = () => {
  return (
    <section className="py-16 md:py-20 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-2">
            Yetkili Servis Bayi Markalarımız
          </h2>
          <p className="text-muted-foreground">
            4 büyük markanın İstanbul Fatih yetkili satış ve servis noktası
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BRANDS.filter(b => b.isAuthorized).map((brand) => {
            return (
              <Link
                key={brand.slug}
                to={`/marka/${brand.slug}`}
                className="group relative overflow-hidden bg-[#111318]/80 hover:bg-[#151216] border border-white/[0.08] rounded-2xl p-7 flex flex-col items-center justify-between text-center transition-all duration-500 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_-10px_rgba(239,68,68,0.25)] hover:-translate-y-1 min-h-[250px]"
              >
                {/* Kart Çevresi Kırmızı Çizgi Animasyonu */}
                <span className="absolute top-0 left-0 h-[1px] bg-red-500 w-0 group-hover:w-full transition-all duration-300 ease-out z-20" />
                <span className="absolute top-0 right-0 w-[1px] bg-red-500 h-0 group-hover:h-full transition-all duration-300 delay-[100ms] ease-out z-20" />
                <span className="absolute bottom-0 right-0 h-[1px] bg-red-500 w-0 group-hover:w-full transition-all duration-300 delay-[200ms] ease-out z-20" />
                <span className="absolute bottom-0 left-0 w-[1px] bg-red-500 h-0 group-hover:h-full transition-all duration-300 delay-[300ms] ease-out z-20" />

                {/* Arka plan kırmızı parlama efekti */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/25 transition-all duration-500 pointer-events-none" />

                {/* Rozet (Badge) */}
                <div className="w-full flex justify-end relative z-10">
                  <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                    {brand.badge || "Yetkili Servis"}
                  </span>
                </div>

                {/* Logo Kutusu ve Çevresindeki Kırmızı Çizgi Animasyonu */}
                <div className="relative w-24 h-24 my-4 rounded-2xl bg-[#181b22] border border-white/[0.08] flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:bg-[#1f1619] shadow-inner">
                  {/* Logo Kutusu Kırmızı Çizgi Animasyonu */}
                  <span className="absolute top-0 left-0 h-[1px] bg-red-500 w-0 group-hover:w-full transition-all duration-300 ease-out z-20" />
                  <span className="absolute top-0 right-0 w-[1px] bg-red-500 h-0 group-hover:h-full transition-all duration-300 delay-[100ms] ease-out z-20" />
                  <span className="absolute bottom-0 right-0 h-[1px] bg-red-500 w-0 group-hover:w-full transition-all duration-300 delay-[200ms] ease-out z-20" />
                  <span className="absolute bottom-0 left-0 w-[1px] bg-red-500 h-0 group-hover:h-full transition-all duration-300 delay-[300ms] ease-out z-20" />

                  <span className="font-heading font-extrabold text-2xl md:text-3xl tracking-wider text-foreground group-hover:text-red-400 transition-colors duration-300 relative z-10">
                    {brand.name}
                  </span>
                </div>

                {/* Marka Adı & Açıklama */}
                <div className="relative z-10 flex flex-col items-center mt-1">
                  <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-red-400 transition-colors duration-300 mb-1.5">
                    {brand.name}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed max-w-[210px]">
                    {brand.desc}
                  </p>
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
