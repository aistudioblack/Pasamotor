export interface LogoAnimation {
  id: string;
  name: string;
  description: string;
  className: string;
  durationMs: number;
}

export const LOGO_ANIMATIONS: LogoAnimation[] = [
  { id: "engine-rage", name: "🔥 Öfkeli Piston (Çılgın Devir)", description: "Devir kesiciye girmiş, sınırları zorlayan delice sızma/titreme", className: "animate-logo-engine-rage", durationMs: 600 },
  { id: "drift-king", name: "🏁 Drift Kralı (Viraj Savrulması)", description: "Sertçe yana kayar, patinaj çeker ve merkezine oturur", className: "animate-logo-drift-king", durationMs: 2000 },
  { id: "jelly-impact", name: "🦘 Jöleli Amortisör", description: "Motosiklet çukurdan geçer, jöle gibi komikçe esner ve zıplar", className: "animate-logo-jelly-impact", durationMs: 1200 },
  { id: "warp-jump", name: "🚀 Hiper Uzay Geçişi", description: "Bir anda incelerek uzar, bükülür ve ışık hızıyla geri döner", className: "animate-logo-warp-jump", durationMs: 1800 },
  { id: "neon-glitch", name: "⚡ Siber Glitch (Neon Arıza)", description: "Elektrik parazitleriyle sarsılan fütüristik dijital arayüz", className: "animate-logo-neon-glitch", durationMs: 1000 },
  { id: "oil-cleanse", name: "Motor Yağı Temizliği", description: "Yağ akar kararır, dönerek tertemiz olur", className: "animate-logo-oil-cleanse", durationMs: 3000 },
  { id: "engine-start", name: "Kontağı Çevir (Marş)", description: "Marş basar, titrer ve canlanır", className: "animate-logo-engine-start", durationMs: 2500 },
  { id: "exhaust-fire", name: "Egzoz Ateşi", description: "Güçlü ateş fırlatarak geri teper", className: "animate-logo-exhaust-fire", durationMs: 1500 },
  { id: "tire-spin", name: "Patinaj & Duman", description: "Hızlıca sarar, duman atar ve fırlar", className: "animate-logo-tire-spin", durationMs: 2000 },
  { id: "wheelie-ride", name: "Tek Teker", description: "Şahlanarak kalkar ve yere iner", className: "animate-logo-wheelie-ride", durationMs: 2500 },
  { id: "night-rider", name: "Gece Sürüşü (Far)", description: "Kararır ve güçlü LED farlar yanar", className: "animate-logo-night-rider", durationMs: 3000 },
  { id: "chain-whip", name: "Zincir Şaklaması", description: "Gergin bir motor zinciri gibi vurur", className: "animate-logo-chain-whip", durationMs: 800 },
  { id: "piston-pump", name: "Piston Hareketi", description: "Krank milinde çalışan sıkı bir piston", className: "animate-logo-piston-pump", durationMs: 1200 },
  { id: "helmet-visor", name: "Kask Vizörü", description: "Vizör kapanır, cam yansıması geçer", className: "animate-logo-helmet-visor", durationMs: 2000 },
];

export const DEFAULT_ANIMATION_ID = "engine-start";

export const getAnimationById = (id: string): LogoAnimation =>
  LOGO_ANIMATIONS.find((a) => a.id === id) ?? LOGO_ANIMATIONS.find((a) => a.id === DEFAULT_ANIMATION_ID)!;
