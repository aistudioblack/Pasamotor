import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import heroBg from "@/assets/hero-bg.webp";
import serviceImg from "@/assets/service.webp";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import JsonLd from "@/components/seo/JsonLd";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

import { useSEO } from "@/hooks/useSEO";

const fallbackImages = [
  { src: heroBg, title: "Showroom", category: "showroom" },
  { src: serviceImg, title: "Servis Atölyesi", category: "servis" },
];

const categories = ["Tümü", "showroom", "servis", "motosiklet", "etkinlik"];

const Galeri = () => {
  const { toast } = useToast();
  const seo = useSEO(
    "galeri",
    "Galeri - Showroom ve Servis Atölyemizden Kareler",
    "Paşa Motor showroom ve servis atölyesinden kareler. İstanbul Fatih Kocamustafapaşa motosiklet bayi galerisi."
  );

  const [active, setActive] = useState("Tümü");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const { data, error } = await dbClient.from("gallery_images").select("*").order("sort_order").order("created_at", { ascending: false });
        if (error) {
          toast({ title: "Görseller yüklenemedi", description: error.message, variant: "destructive" });
          setImages(fallbackImages);
        } else {
          const pImages = data.map(item => ({
            src: item.url,
            title: item.title,
            category: item.category
          }));
          setImages(pImages.length > 0 ? pImages : fallbackImages);
        }
      } catch (err) {
        console.warn("Galeri images load failed, using local fallback images:", err);
        setImages(fallbackImages);
      }
      setLoading(false);
    };
    fetchImages();
  }, [toast]);

  const filtered = active === "Tümü" ? images : images.filter((img) => img.category === active);

  return (
    <Layout>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical="/galeri"
        keywords="paşa motor galeri, motosiklet showroom, servis atölyesi"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "Galeri", url: "/galeri" },
        ])}
      />
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4">Galeri</h1>
            <p className="text-muted-foreground">Showroom ve servisimizden kareler</p>
          </div>

          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active === cat ? "bg-primary text-primary-foreground" : "glass text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "Tümü" ? cat : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map((i) => (
                <Skeleton key={i} className="aspect-video w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((img, i) => (
                <div key={i} className="group relative rounded-xl overflow-hidden aspect-video">
                  <img src={img.src} alt={img.title} width={600} height={400} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="font-heading font-medium text-foreground">{img.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">Bu kategoride henüz fotoğraf bulunmuyor.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Galeri;
