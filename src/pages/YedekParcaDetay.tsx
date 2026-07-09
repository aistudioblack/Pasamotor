import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { dbClient } from "@/lib/db-client";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Package,
  ShieldCheck,
  Truck,
  Wrench,
  Focus,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Loader2,
} from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import JsonLd from "@/components/seo/JsonLd";
import type { Tables } from "@/lib/db-types";
import ProductImagePlaceholder from "@/components/ui/ProductImagePlaceholder";

type Product = Tables<"products">;

const YedekParcaDetay = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isMainImageLoaded, setIsMainImageLoaded] = useState(false);

  useEffect(() => {
    setIsMainImageLoaded(false);
  }, [selectedImage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen || !product?.images) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") {
        setSelectedImage((p) => Math.max(0, p - 1));
      }
      if (e.key === "ArrowRight") {
        setSelectedImage((p) =>
          Math.min((product.images?.length || 1) - 1, p + 1),
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, product?.images]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const { data } = await dbClient
          .from("products")
          .select("*")
          .eq("slug", slug)
          .eq("is_active", true)
          .maybeSingle();
        setProduct(data);
      } catch (err) {
        console.error("Yedek parça fetch error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="h-4 bg-muted rounded w-32 mb-8 animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
              <div className="space-y-6 lg:py-8">
                <div className="flex gap-2">
                  <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
                  <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="h-10 bg-muted rounded w-full animate-pulse" />
                  <div className="h-10 bg-muted rounded w-3/4 animate-pulse" />
                </div>
                <div className="h-16 bg-muted rounded w-1/3 mt-6 animate-pulse" />
                <div className="space-y-3 mt-10">
                  <div className="h-4 bg-muted rounded w-full animate-pulse" />
                  <div className="h-4 bg-muted rounded w-full animate-pulse" />
                  <div className="h-4 bg-muted rounded w-4/5 animate-pulse" />
                  <div className="h-4 bg-muted rounded w-full animate-pulse" />
                  <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="h-16 bg-muted rounded-xl animate-pulse" />
                  <div className="h-16 bg-muted rounded-xl animate-pulse" />
                  <div className="h-16 bg-muted rounded-xl animate-pulse" />
                  <div className="h-16 bg-muted rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <section className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <div className="container mx-auto px-4">
            <Package className="w-20 h-20 mx-auto text-muted-foreground/20 mb-6" />
            <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mb-4">
              Ürün Bulunamadı
            </h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Aradığınız yedek parça yayından kaldırılmış olabilir veya bağlantı
              hatalı olabilir. Lütfen mağazamızdaki diğer ürünleri inceleyin.
            </p>
            <Link
              to="/yedek-parca"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Tüm Yedek Parçaları Gör
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "https://pasamotor.com.tr";
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description:
      product.description || product.meta_description || product.title,
    image:
      product.images && product.images.length > 0
        ? product.images.map(img => img.startsWith("http") ? img : `${origin}${img}`)
        : [`${origin}/favicon.png`],
    brand: { "@type": "Brand", name: product.brand },
    sku: product.slug,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `${origin}/yedek-parca/${product.slug}`,
      priceCurrency: "TRY",
      price: product.price ?? undefined,
      availability: product.is_active
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Paşa Motor" },
    },
  };

  return (
    <Layout>
      <SEO
        title={
          product.meta_title ||
          `${product.title} - ${product.brand} Yedek Parça`
        }
        description={
          product.meta_description ||
          product.description ||
          `${product.title} - ${product.brand} orijinal ve muadil yedek parça.`
        }
        keywords={
          product.brand
            ? `${product.title?.toLowerCase()}, ${product.brand?.toLowerCase()} yedek parça, ${product.brand?.toLowerCase()} orijinal ${product.title?.toLowerCase()}, paşa motor yedek parça, motosiklet parça fiyatları`
            : `${product.title?.toLowerCase()}, motosiklet yedek parça, paşa motor, orijinal motosiklet parçası`
        }
        canonical={`/yedek-parca/${product.slug}`}
        image={product.images?.[0]}
        type="product"
      />
      <JsonLd data={productSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "Yedek Parça", url: "/yedek-parca" },
          { name: product.title, url: `/yedek-parca/${product.slug}` },
        ])}
      />

      <section className="py-12 md:py-20 lg:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-7xl">
          <Link
            to="/yedek-parca"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 md:mb-12 group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Kataloğa Geri Dön
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Left Column: Images (Sticky Area) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-4">
              <div
                className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-border/80 group shadow-sm cursor-zoom-in"
                onClick={() =>
                  product?.images?.length ? setIsLightboxOpen(true) : null
                }
              >
                <div className="absolute inset-0 pointer-events-none" />
                {product.images && product.images.length > 0 ? (
                  <>
                    {!isMainImageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-8 h-8 text-primary animate-spin" />
                          <div className="h-2 w-24 bg-primary/20 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-pulse w-full rounded-full" />
                          </div>
                        </div>
                      </div>
                    )}
                    <img
                      src={product.images[selectedImage]}
                      alt={product.title}
                      width={800}
                      height={800}
                      className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${isMainImageLoaded ? "opacity-100 blur-0" : "opacity-0 blur-md"}`}
                      loading="eager"
                      onLoad={() => setIsMainImageLoaded(true)}
                    />
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-md">
                      <Maximize2 className="w-5 h-5" />
                    </div>
                  </>
                ) : (
                  <ProductImagePlaceholder
                    brand={product.brand || "PAŞA MOTOR"}
                  />
                )}
                {/* Image Overlay Label */}
                {(product.stock ?? 0) > 0 && (
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/90 text-white text-xs font-bold shadow-md shadow-emerald-500/20 backdrop-blur-md">
                    <Focus className="w-3.5 h-3.5 animate-pulse" />
                    Stokta
                  </div>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-white border-2 flex items-center justify-center transition-all ${
                        selectedImage === i
                          ? "border-primary shadow-sm shadow-primary/20"
                          : "border-border/50 hover:border-primary/50 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${i + 1}`}
                        width={96}
                        height={96}
                        className="max-w-full max-h-full object-contain p-2"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Content & SEO */}
            <div className="lg:col-span-7 flex flex-col">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary tracking-wide uppercase border border-primary/20">
                  {product.brand || "YEDEK PARÇA"}
                </span>
                {product.category && (
                  <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-muted text-muted-foreground border border-border/80">
                    Orijinal Parça
                  </span>
                )}
                {product.sku && (
                  <span className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-900/60 text-slate-300 border border-slate-700/50">
                    KOD: {product.sku}
                  </span>
                )}
              </div>

              <h1 className="font-heading font-extrabold text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 tracking-tight leading-[1.15]">
                {product.title}
              </h1>

              <div className="flex items-center gap-6 mb-8 flex-wrap">
                {product.price ? (
                  <div className="inline-flex flex-col gap-1 px-7 py-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#1c2230] to-slate-950 border border-slate-700/60 shadow-xl relative overflow-hidden group/price">
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-primary" />
                    <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase mb-1">
                      Fiyat
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading font-extrabold text-4xl md:text-5xl text-white tracking-tighter">
                        {new Intl.NumberFormat("tr-TR", {
                          maximumFractionDigits: 0,
                        }).format(product.price)}
                      </span>
                      <span className="font-bold text-xl text-primary mt-1">
                        TL
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="inline-flex flex-col justify-center px-6 py-4 rounded-2xl bg-slate-900/40 border border-border/50">
                    <p className="font-heading font-bold text-lg text-slate-300 flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" /> Fiyat
                      için bilgi alın
                    </p>
                  </div>
                )}
              </div>

              {/* Premium CRO Buy Area - High Conversion Design */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 pb-10 border-b border-border/60">
                <a
                  href={`https://wa.me/905348996817?text=${encodeURIComponent(`Merhaba, web sitenizden "${product.title}" ürünü için Şasi numaramla uyumluluk ve sipariş bilgisi almak istiyorum. ${product.sku ? "Ürün Kodu: " + product.sku : ""} ${product.price ? "(Fiyat: " + product.price + " TL)" : ""}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex text-center justify-center items-center gap-3 px-6 h-16 rounded-xl font-bold text-base transition-all hover:scale-[1.02] shadow-xl shadow-emerald-500/10 active:scale-[0.98] border border-emerald-600/30 group"
                  style={{ backgroundColor: "#25D366", color: "#fff" }}
                >
                  <MessageCircle className="w-6 h-6 fill-white" />
                  <div className="flex flex-col items-start leading-tight">
                    <span>Şasi No İle Sor & Sipariş Ver</span>
                    <span className="text-[11px] font-medium opacity-90">
                      WhatsApp Hızlı Destek Hattı
                    </span>
                  </div>
                </a>
                <a
                  href="tel:+905348996817"
                  className="flex text-center justify-center items-center gap-3 px-6 h-16 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-lg active:scale-[0.98]"
                >
                  <Phone className="w-6 h-6" />
                  <div className="flex flex-col items-start leading-tight">
                    <span>Müşteri Temsilcisini Ara</span>
                    <span className="text-[11px] font-medium opacity-90">
                      0534 899 68 17
                    </span>
                  </div>
                </a>
              </div>

              {/* USP (Unique Selling Proposition) Corporate Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Orijinal Ürün Garantisi
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      %100 Yetkili distribütör.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Uyum Güvencesi
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Şasi no ile %100 kesin tespit.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Aynı Gün Kargoya Teslim
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Hafta içi saat 16:00'ya kadar.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-xl border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">
                      Sağlam Paketleme
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Kargo hasarlarına karşı korumalı.
                    </p>
                  </div>
                </div>
              </div>

              {/* Detailed SEO HTML Content generated by our AI Tool */}
              <div className="pt-8 border-t border-border/60">
                <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                  Detaylı Ürün İncelemesi
                </h3>
                {product.content ? (
                  <div
                    className="pasa-article"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(
                        product.content.replace(/<h1[^>]*>.*?<\/h1>/gi, ""), // Exclude duplicate H1 from editor
                      ),
                    }}
                  />
                ) : (
                  <p className="text-foreground/70 leading-relaxed text-lg">
                    {product.description ||
                      `${product.title} için detaylı açıklama alanımız en kısa sürede güncellenecektir. Orijinal parça garantisiyle satın alabilirsiniz.`}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Immersive Lightbox */}
      {isLightboxOpen && product?.images && product.images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl transition-all"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(false);
            }}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
            <img
              src={product.images[selectedImage]}
              alt={product.title}
              className="max-w-full max-h-full object-contain select-none"
              onClick={(e) => e.stopPropagation()}
              loading="lazy"
              decoding="async"
            />
          </div>

          {product.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((p) => Math.max(0, p - 1));
                }}
                disabled={selectedImage === 0}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30 disabled:hover:bg-white/10 z-50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((p) =>
                    Math.min((product.images?.length || 1) - 1, p + 1),
                  );
                }}
                disabled={selectedImage === product.images.length - 1}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-30 disabled:hover:bg-white/10 z-50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>

              <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md"
                onClick={(e) => e.stopPropagation()}
              >
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      selectedImage === idx
                        ? "bg-white scale-125"
                        : "bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </Layout>
  );
};

export default YedekParcaDetay;
