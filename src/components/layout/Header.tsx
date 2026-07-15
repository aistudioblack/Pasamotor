import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/pasa-motor-logo.webp";
import { motion, AnimatePresence } from "motion/react";

const navLinks = [
  { label: "Ana Sayfa", path: "/" },
  { label: "Hakkımızda", path: "/hakkimizda" },
  { label: "Hizmetler", path: "/hizmetler" },
  { label: "Yedek Parça", path: "/yedek-parca" },
  { label: "Blog", path: "/blog" },
  { label: "Galeri", path: "/galeri" },
  { label: "İletişim", path: "/iletisim" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="Paşa Motor - Ana sayfa">
            <motion.img
              src={logo}
              alt="Paşa Motor"
              loading="eager"
              decoding="sync"
              width={160}
              height={56}
              className="h-11 w-auto md:h-14 object-contain drop-shadow-xl"
              style={{ mixBlendMode: "screen" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05, 
                rotate: [0, -2, 2, -1, 0],
                transition: { duration: 0.4, ease: "easeInOut" } 
              }}
              whileTap={{ scale: 0.95 }}
            />
            <motion.div 
              className="hidden sm:block leading-none"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            >
              <span className="font-display tracking-[0.02em] text-2xl md:text-[1.7rem] block font-extrabold uppercase">
                <span className="text-primary">PAŞA</span>
                <span className="text-foreground/90"> MOTOR</span>
              </span>
              <span className="flex items-center gap-2 mt-1.5 text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-muted-foreground font-medium">
                <span className="w-4 h-0.5 bg-primary/80 rounded-full"></span>
                Yetkili Servis Bayi
              </span>
            </motion.div>
          </Link>

          {/* Apple-style segmented nav */}
          <nav className="hidden lg:flex items-center" aria-label="Ana navigasyon">
            <motion.div 
              className="flex items-center gap-1 rounded-full bg-muted/40 backdrop-blur-md border border-border/50 px-1.5 py-1.5"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            >
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={active ? "page" : undefined}
                    className={`relative px-3.5 py-1.5 rounded-full text-[13px] font-medium tracking-tight transition-all duration-200 ${
                      active
                        ? "bg-primary text-primary-foreground shadow-[0_2px_10px_hsl(0_85%_55%/0.35)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-background/40"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </motion.div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <motion.a
              href="tel:+902125868598"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-[13px] hover:bg-primary/90 transition-all shadow-[0_2px_12px_hsl(0_85%_55%/0.4)] hover:shadow-[0_4px_18px_hsl(0_85%_55%/0.55)]"
            >
              <Phone className="w-4 h-4" />
              <span>0212 586 85 98</span>
            </motion.a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-foreground rounded-full hover:bg-muted/50"
              aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden glass border-t border-border overflow-hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1" aria-label="Mobil navigasyon">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={location.pathname === link.path ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:+902125868598"
                className="mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
              >
                <Phone className="w-4 h-4" />
                0212 586 85 98
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
