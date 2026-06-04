import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase-client";
import { Package, ArrowRight, Tag, ShieldCheck } from "lucide-react";

export default function ProductsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(4);
          
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <Package className="w-3.5 h-3.5" /> Öne Çıkan Ürünler
            </span>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-foreground mb-4 tracking-tight">
              Orijinal <span className="text-primary">Yedek Parçalar</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Motosikletinize tam uyumlu, garantili ve en uygun fiyatlı yedek parça ve aksesuarlar.
            </p>
          </div>
          <Link
            to="/yedek-parca"
            className="group inline-flex items-center gap-2 text-sm font-bold text-foreground bg-card border border-border hover:border-primary/50 transition-colors px-6 py-3 rounded-full shadow-sm hover:shadow-md"
          >
            Tüm Ürünleri Gör
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const isOriginal = product.title?.toLowerCase().includes("orjinal") || 
                               product.title?.toLowerCase().includes("orijinal") ||
                               product.title?.toLowerCase().includes("orjınal") ||
                               product.title?.toLowerCase().includes("orijınal");
            return (
              <Link
                key={product.id}
                to={`/yedek-parca/${product.slug}`}
                className={`group glass-card rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full bg-card ${
                  isOriginal ? "hover:border-emerald-500/40 border-emerald-500/10" : "hover:border-primary/40"
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center p-4 border-b border-border">
                  {product.images && product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      width={400}
                      height={400}
                      className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Package className="w-12 h-12 mb-2 opacity-50" />
                    </div>
                  )}
                  {product.is_featured && (
                    <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded shadow-sm shadow-primary/30 uppercase tracking-wider">
                      Öne Çıkan
                    </div>
                  )}
                  {isOriginal && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/25 flex items-center gap-1 uppercase tracking-wider z-10 border border-emerald-400/30 backdrop-blur-xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-100" /> Orijinal Parça
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1 border-t border-border focus-within:ring-2 focus-within:ring-primary/50">
                  <div className="mb-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                      isOriginal ? "bg-emerald-500/10 text-emerald-500/90" : "bg-muted text-muted-foreground"
                    }`}>
                      {product.brand}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-sm md:text-base text-foreground mb-3 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <div className="mt-auto flex items-end justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-0.5">Fiyat</span>
                      <span className="font-heading font-bold text-lg text-primary tracking-tight">
                        {new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(product.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
