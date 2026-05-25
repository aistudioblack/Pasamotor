import { ChevronRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import logo from "@/assets/pasa-motor-logo.webp";
import heroBg from "@/assets/hero-bg.webp";
import { dbClient } from "@/lib/firebase-client";
import { DEFAULT_ANIMATION_ID, getAnimationById } from "@/lib/logoAnimations";

const HeroSection = () => {
  const desktopLogoRef = useRef<HTMLDivElement>(null);
  const mobileLogoRef = useRef<HTMLDivElement>(null);
  const [animationId, setAnimationId] = useState<string>(DEFAULT_ANIMATION_ID);

  // Load selected animation from site_content
  useEffect(() => {
    let active = true;
    dbClient
      .from("site_content")
      .select("sections")
      .eq("page_key", "hero_animation")
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        const id = (data?.sections as any)?.animation_id;
        if (typeof id === "string") setAnimationId(id);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const anim = getAnimationById(animationId);
    const ANIM_CLASS = anim.className;
    const INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
    let timeoutId: number | undefined;

    const triggerOnce = () => {
      if (document.hidden) {
        scheduleNext(INTERVAL_MS);
        return;
      }
      const targets = [desktopLogoRef.current, mobileLogoRef.current].filter(
        (el): el is HTMLDivElement => !!el,
      );
      targets.forEach((el) => {
        // Remove any prior logo-animation classes
        Array.from(el.classList)
          .filter((c) => c.startsWith("animate-logo-"))
          .forEach((c) => el.classList.remove(c));
        void el.offsetWidth; // restart animation cleanly
        el.classList.add(ANIM_CLASS);
      });
      scheduleNext(INTERVAL_MS);
    };

    const scheduleNext = (delay: number) => {
      timeoutId = window.setTimeout(triggerOnce, delay);
    };

    // Run immediately on first load
    const initial = window.setTimeout(triggerOnce, 600);

    return () => {
      window.clearTimeout(initial);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [animationId]);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden" style={{ contentVisibility: 'visible', containIntrinsicSize: 'auto' }}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Paşa Motor showroom"
          width={1920}
          height={1080}
          loading="eager"
          decoding="sync"
          {...{ fetchpriority: "high" }}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, hsl(220 20% 7% / 0.70) 0%, hsl(220 20% 7% / 0.85) 60%, hsl(220 20% 7%) 100%)" }}
        />
        {/* Spot Işıkları Ambient Işık Efektleri */}
        <div className="absolute top-[5%] left-[22%] w-[25%] h-[25%] bg-red-600/30 blur-[80px] animate-[pulse_4s_ease-in-out_infinite] pointer-events-none mix-blend-color-dodge rounded-full" />
        <div className="absolute top-[18%] left-[18%] w-[15%] h-[15%] bg-red-500/20 blur-[50px] animate-[pulse_3s_ease-in-out_infinite_0.5s] pointer-events-none mix-blend-lighten rounded-full" />
        
        <div className="absolute top-[15%] right-[25%] w-[25%] h-[25%] bg-[#0ea5e9]/30 blur-[80px] animate-[pulse_5s_ease-in-out_infinite] pointer-events-none mix-blend-color-dodge rounded-full" />
        <div className="absolute top-[22%] right-[18%] w-[15%] h-[15%] bg-[#38bdf8]/20 blur-[50px] animate-[pulse_4s_ease-in-out_infinite_1s] pointer-events-none mix-blend-lighten rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
          {/* Left text */}
          <motion.div 
            className="max-w-3xl"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground mb-6"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              TVS - Hero - Falcon - Işıldar Yetkili Servis Bayi
            </motion.div>

            <motion.h1 
              className="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 text-foreground"
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] } } }}
            >
              İstanbul'un Güvenilir{" "}
              <span className="gradient-text">Motosiklet</span>{" "}
              Yetkili Servis Bayi
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } } }}
            >
              Fatih'te 4 markanın yetkili satış ve servis noktası. Motosiklet satışı, profesyonel servis ve orijinal yedek parça hizmetleri.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } }}
            >
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all glow-red"
              >
                Bize Ulaşın
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+902125868598"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg glass text-foreground font-semibold text-sm hover:bg-muted/50 transition-all"
              >
                <Phone className="w-4 h-4" />
                Hemen Arayın
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border/50"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }}
            >
              {[
                { value: "4", label: "Yetkili Marka" },
                { value: "20+", label: "Yıllık Deneyim" },
                { value: "1000+", label: "Mutlu Müşteri" },
              ].map((stat) => (
                <motion.div 
                  key={stat.label}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } } }}
                >
                  <p className="font-heading font-bold text-2xl md:text-3xl gradient-text">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Animated Logo */}
          <div className="hidden lg:flex items-center justify-center relative min-h-[480px] overflow-visible">
            <div ref={desktopLogoRef} className="relative will-change-transform">
              <img
                src={logo}
                alt="Paşa Motor logosu"
                loading="eager"
                decoding="sync"
                {...{ fetchpriority: "high" }}
                className="relative w-full max-w-md object-contain drop-shadow-2xl select-none pointer-events-none"
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex justify-center mt-12 overflow-visible">
          <div ref={mobileLogoRef} className="relative will-change-transform">
            <img src={logo} alt="Paşa Motor logosu" loading="eager" decoding="sync" {...{ fetchpriority: "high" }} className="h-52 w-auto object-contain drop-shadow-2xl select-none pointer-events-none" draggable={false} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
