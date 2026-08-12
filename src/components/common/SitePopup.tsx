import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, ArrowRight, BellRing, ChevronDown, ChevronUp } from "lucide-react";
import { dbClient } from "@/lib/db-client";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export interface PopupSettings {
  is_active: boolean;
  badge?: string;
  title: string;
  description: string;
  image_url?: string;
  button_text?: string;
  button_link?: string;
  delay_seconds?: number;
  frequency?: "always" | "once_per_session" | "once_per_day";
  bg_theme?: "red" | "dark" | "gradient";
}

const STORAGE_SESSION_KEY = "pasamotor_popup_dismissed_session";
const STORAGE_DAILY_KEY = "pasamotor_popup_dismissed_date";

export function FormattedPopupDescription({
  text,
  maxInitialLines = 3,
}: {
  text: string;
  maxInitialLines?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const rawLines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const hasMore = rawLines.length > maxInitialLines;
  const visibleLines = isExpanded ? rawLines : rawLines.slice(0, maxInitialLines);

  return (
    <div className="space-y-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
      <div className="space-y-2 relative transition-all">
        {visibleLines.map((line, idx) => {
          // Check for bullet markers: -, *, •
          const isBullet = /^[•\-*]\s+/.test(line);
          const isNumbered = /^\d+[.)]\s+/.test(line);

          if (isBullet) {
            const content = line.replace(/^[•\-*]\s+/, "");
            return (
              <div key={idx} className="flex items-start gap-2 pl-0.5 sm:pl-1">
                <span className="w-4 h-4 rounded-full bg-primary/15 text-primary border border-primary/30 flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                  ✓
                </span>
                <span className="flex-1">{renderBoldText(content)}</span>
              </div>
            );
          }

          if (isNumbered) {
            const match = line.match(/^(\d+[.)])\s+(.*)/);
            if (match) {
              return (
                <div key={idx} className="flex items-start gap-2 pl-0.5 sm:pl-1">
                  <span className="font-bold text-primary font-mono text-xs shrink-0 mt-0.5 min-w-[20px]">
                    {match[1]}
                  </span>
                  <span className="flex-1">{renderBoldText(match[2])}</span>
                </div>
              );
            }
          }

          return <p key={idx}>{renderBoldText(line)}</p>;
        })}
      </div>

      {hasMore && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold transition-all mt-1 focus:outline-none group"
        >
          <span>
            {isExpanded
              ? "Detayları Daralt"
              : `Tüm Detayları Gör (${rawLines.length - maxInitialLines} madde daha)`}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
          )}
        </button>
      )}
    </div>
  );
}

function renderBoldText(str: string) {
  const parts = str.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-bold text-foreground font-heading">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function SitePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [popup, setPopup] = useState<PopupSettings | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchPopup = async () => {
      try {
        let config: PopupSettings | null = null;

        // Try public API endpoint first (bypasses RLS)
        const res = await fetch("/api/site-content/homepage_popup");
        if (res.ok) {
          const apiData = await res.json();
          if (apiData && apiData.sections) {
            config = apiData.sections as PopupSettings;
          }
        }

        // Fallback to dbClient if API didn't return data
        if (!config) {
          const { data, error } = await dbClient
            .from("site_content")
            .select("sections")
            .eq("page_key", "homepage_popup")
            .maybeSingle();

          if (!error && data && data.sections) {
            config = data.sections as PopupSettings;
          }
        }

        if (!config || !config.is_active) return;

        // Frequency checks
        const frequency = config.frequency || "once_per_session";
        if (frequency === "once_per_session") {
          const isDismissed = sessionStorage.getItem(STORAGE_SESSION_KEY);
          if (isDismissed) return;
        } else if (frequency === "once_per_day") {
          const today = new Date().toISOString().split("T")[0];
          const lastDismissedDate = localStorage.getItem(STORAGE_DAILY_KEY);
          if (lastDismissedDate === today) return;
        }

        setPopup(config);

        // Delay handling
        const delay = (config.delay_seconds ?? 2) * 1000;
        timer = setTimeout(() => {
          setIsOpen(true);
        }, delay);
      } catch (e) {
        console.warn("Popup load error:", e);
      }
    };

    fetchPopup();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);

    if (!popup) return;
    const frequency = popup.frequency || "once_per_session";
    if (frequency === "once_per_session") {
      sessionStorage.setItem(STORAGE_SESSION_KEY, "true");
    } else if (frequency === "once_per_day") {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem(STORAGE_DAILY_KEY, today);
    }
  };

  if (!popup || !isOpen) return null;

  const themeClass =
    popup.bg_theme === "gradient"
      ? "bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950/40 border-red-500/30 text-white"
      : popup.bg_theme === "dark"
      ? "bg-neutral-900 border-neutral-800 text-neutral-100"
      : "bg-card border-primary/20 text-card-foreground";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          {/* Responsive Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-sm sm:max-w-lg md:max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto ${themeClass} z-10`}
          >
            {/* Touch-friendly Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-all backdrop-blur-md border border-white/20 shadow-lg"
              aria-label="Kapat"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Optional Banner Image */}
            {popup.image_url && (
              <div className="relative w-full h-36 sm:h-48 md:h-56 shrink-0 overflow-hidden bg-neutral-950">
                <ImageWithFallback
                  src={popup.image_url.startsWith("/src/assets/") ? popup.image_url.replace("/src/assets/", "/") : popup.image_url}
                  alt={popup.title}
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              </div>
            )}

            {/* Content Container with internal scroll if content is long */}
            <div className="p-5 sm:p-7 md:p-8 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
              {/* Badge */}
              {popup.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/25 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span>{popup.badge}</span>
                </div>
              )}

              {/* Title */}
              <h3 className="font-heading font-extrabold text-lg sm:text-2xl text-foreground leading-snug tracking-tight">
                {popup.title}
              </h3>

              {/* Formatted Description */}
              <FormattedPopupDescription text={popup.description} />

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                {popup.button_text && popup.button_link && (
                  <Link
                    to={popup.button_link}
                    onClick={handleClose}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 group text-center"
                  >
                    <span>{popup.button_text}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                )}

                <button
                  onClick={handleClose}
                  className="px-5 py-3 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground text-xs sm:text-sm font-medium transition-all text-center"
                >
                  Kapat
                </button>
              </div>
            </div>

            {/* Subtle Brand Footer Bar */}
            <div className="bg-muted/40 px-5 sm:px-6 py-2 border-t border-border/40 text-[10px] sm:text-[11px] text-muted-foreground flex items-center justify-between font-mono shrink-0">
              <span className="flex items-center gap-1">
                <BellRing className="w-3 h-3 text-primary" /> Paşa Motor Duyuru Sistemi
              </span>
              <span className="hidden sm:inline">pasamotor.com.tr</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
