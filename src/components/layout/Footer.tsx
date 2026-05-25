import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import SafeEmail from "@/components/ui/SafeEmail";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <h3 className="font-heading font-bold text-xl text-foreground mb-3">Paşa Motor (pasamotor.com.tr)</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Orijinal <strong>pasamotor.com.tr</strong> resmî web sitemizdir. İstanbul Fatih'te TVS, Hero, Falcon ve Işıldar yetkili servis bayi. Motosiklet satış, servis ve yedek parça hizmetleri.
            </p>
            <div className="flex gap-2">
              {["TVS", "Hero", "Falcon", "Işıldar"].map((brand) => (
                <span key={brand} className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                  {brand}
                </span>
              ))}
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
                <span>Kızılelma Cad. No:66/A, Kocamustafapaşa, 34104 Fatih/İstanbul</span>
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
