import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import SafeEmail from "@/components/ui/SafeEmail";
import logo from "@/assets/pasa-motor-logo.webp";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-5">
            {/* Logo ve Kurumsal Kimlik */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-14 h-14 shrink-0 hover:scale-105 duration-300 transition-transform">
                  <img src={logo} alt="Paşa Motor Logo" width={56} height={56} className="object-contain w-full h-full" referrerPolicy="no-referrer"  loading="lazy" decoding="async" />
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg tracking-tight text-foreground leading-none">
                    PAŞA MOTOR
                  </h3>
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mt-1">
                    Yedek Parça & Yetkili Servis
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                  Resmî Yetkili Servis Bayi
                </span>
              </div>
            </div>

            {/* Açıklama */}
            <p className="text-muted-foreground text-xs leading-relaxed">
              Orijinal <strong className="text-foreground font-semibold">pasamotor.com.tr</strong> resmî platformumuzdur. İstanbul Fatih'te TVS, Hero, Falcon ve Işıldar yetkili teknik servis ve orijinal yedek parça tedarik noktası.
            </p>

            {/* Yetkili Marka Etiketleri */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                Yetkili Temsilcilikler:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "TVS", style: "border-red-500/20 text-red-600 dark:text-red-400 bg-red-500/5 hover:border-red-500" },
                  { name: "Hero", style: "border-red-600/20 text-red-700 dark:text-red-500 bg-red-600/5 hover:border-red-600" },
                  { name: "Falcon", style: "border-stone-500/20 text-stone-600 dark:text-stone-400 bg-stone-50/5 hover:border-stone-500" },
                  { name: "Işıldar", style: "border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 hover:border-indigo-500" },
                ].map((brand) => (
                  <span
                    key={brand.name}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${brand.style} transition-colors duration-300 cursor-default shadow-sm`}
                  >
                    {brand.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Güven Rozetleri */}
            <div className="pt-3 border-t border-dashed border-border/80 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-[10px] font-bold text-muted-foreground">100% Orijinal Parça</span>
              </div>
              <Link to="/iletisim#harita" className="flex items-center gap-1.5 hover:text-primary transition-colors group">
                <svg className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 duration-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary">Fiziki Mağaza</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Hızlı Bağlantılar</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Ana Sayfa", path: "/" },
                { label: "Hakkımızda", path: "/hakkimizda" },
                { label: "Hizmetler", path: "/hizmetler" },
                { label: "Yedek Parça", path: "/yedek-parca" },
                { label: "Blog", path: "/blog" },
                { label: "Galeri", path: "/galeri" },
                { label: "İletişim", path: "/iletisim" },
              ].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">İletişim</h4>
            <div className="flex flex-col gap-3">
              <a href="tel:+902125868598" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                0212 586 85 98
              </a>
              <a href="tel:+905348996817" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                0534 899 68 17
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0" />
                <SafeEmail />
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Seyid Ömer Mah. Kızılelma Cad. No:66/A, Kocamustafapaşa, 34104 Fatih/İstanbul</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4">Çalışma Saatleri</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-foreground">Pazartesi - Cuma</p>
                  <p className="text-muted-foreground">09:00 - 19:00</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-foreground">Cumartesi</p>
                  <p className="text-muted-foreground">09:00 - 17:00</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-foreground">Pazar</p>
                  <p className="text-destructive">Kapalı</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 lg:gap-6 text-sm text-muted-foreground mr-auto">
            <p>&copy; {new Date().getFullYear()} Paşa Motor. Tüm hakları saklıdır.</p>
            <div className="hidden md:block w-1 h-1 rounded-full bg-border"></div>
            <div className="flex items-center gap-4 text-xs">
              <Link to="/sayfa/kvkk-aydinlatma-metni" className="hover:text-primary transition-colors">KVKK</Link>
              <Link to="/sayfa/cerez-politikasi" className="hover:text-primary transition-colors">Çerez Politikası</Link>
              <Link to="/sayfa/gizlilik-ve-guvenlik" className="hover:text-primary transition-colors">Gizlilik ve Güvenlik</Link>
              <Link to="/sayfa/mesafeli-satis-sozlesmesi" className="hover:text-primary transition-colors">Satış Sözleşmesi</Link>
              <Link to="/sayfa/kullanim-kosullari" className="hover:text-primary transition-colors">Kullanım Koşulları</Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground shrink-0">
            Yetkili: Nihat KAN
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
