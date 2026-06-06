import { useEffect, useRef, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { Check, Loader2, Play, Sparkles } from "lucide-react";
import logo from "@/assets/pasa-motor-logo.webp";
import { LOGO_ANIMATIONS, DEFAULT_ANIMATION_ID, type LogoAnimation } from "@/lib/logoAnimations";

const PAGE_KEY = "hero_animation";

const AnimationCard = ({
  anim,
  isSelected,
  onApply,
  applying,
}: {
  anim: LogoAnimation;
  isSelected: boolean;
  onApply: () => void;
  applying: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const trigger = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove(anim.className);
    void el.offsetWidth;
    el.classList.add(anim.className);
  };

  return (
    <div 
      className={`glass-card rounded-xl p-4 flex flex-col group overflow-hidden relative cursor-pointer border transition-all duration-300 ${isSelected ? 'border-primary shadow-[0_0_15px_rgba(255,0,0,0.15)] bg-primary/5' : 'border-border/50 hover:border-primary/50'}`}
      onMouseEnter={trigger}
      onClick={trigger}
    >
      <div className="aspect-square rounded-lg bg-background/50 flex items-center justify-center overflow-hidden mb-4 relative">
        <div 
          ref={ref} 
          className={`will-change-transform ${isSelected ? anim.className : ''}`} 
          style={{ transformOrigin: "center", animationIterationCount: isSelected ? 'infinite' : '1' }}
        >
          <img
            src={logo}
            alt={anim.name}
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain select-none pointer-events-none drop-shadow-lg"
            style={{ mixBlendMode: "screen" }}
            draggable={false}
          />
        </div>
        {isSelected && (
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-primary/90 text-primary-foreground px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Aktif
          </div>
        )}
      </div>
      
      <div className="flex-1 mb-4">
        <h3 className="font-heading font-bold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">{anim.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{anim.description}</p>
      </div>
      
      <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-border/30">
         <span className="text-[10px] text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">{(anim.durationMs/1000).toFixed(1)}s</span>
        <button
          onClick={(e) => { e.stopPropagation(); onApply(); }}
          disabled={applying || isSelected}
          className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            isSelected 
              ? "bg-primary/20 text-primary cursor-default" 
              : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/20"
          } disabled:opacity-50`}
        >
          {applying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {isSelected ? "Kullanılıyor" : "Uygula"}
        </button>
      </div>
    </div>
  );
};

const AdminAnimations = () => {
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_ANIMATION_ID);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await dbClient
        .from("site_content")
        .select("sections")
        .eq("page_key", PAGE_KEY)
        .maybeSingle();
      const id = (data?.sections as any)?.animation_id;
      if (typeof id === "string") setSelectedId(id);
      setLoading(false);
    })();
  }, []);

  const apply = async (anim: LogoAnimation) => {
    setApplyingId(anim.id);
    try {
      const { data: existing } = await dbClient
        .from("site_content")
        .select("id")
        .eq("page_key", PAGE_KEY)
        .maybeSingle();

      const payload = {
        page_key: PAGE_KEY,
        title: "Hero Logo Animation",
        sections: { animation_id: anim.id } as any,
      };

      const { error } = existing
        ? await dbClient.from("site_content").update(payload).eq("id", existing.id)
        : await dbClient.from("site_content").insert(payload);

      if (error) throw error;
      setSelectedId(anim.id);
      toast({ title: "Uygulandı", description: `${anim.name} animasyonu aktif.` });
    } catch (e: any) {
      toast({ title: "Hata", description: e?.message ?? "Kaydedilemedi", variant: "destructive" });
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-heading font-bold text-2xl text-foreground">Logo Animasyonları</h1>
        <p className="text-sm text-muted-foreground">
          20 farklı animasyondan birini seçin. Seçim ana sayfa hero logosuna uygulanır.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {LOGO_ANIMATIONS.map((a) => (
            <AnimationCard
              key={a.id}
              anim={a}
              isSelected={selectedId === a.id}
              onApply={() => apply(a)}
              applying={applyingId === a.id}
            />
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAnimations;
