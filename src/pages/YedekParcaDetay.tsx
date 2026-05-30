import Layout from "@/components/layout/Layout";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { dbClient } from "@/lib/firebase-client";
import { ArrowLeft, Phone, MessageCircle, Package } from "lucide-react";
import { sanitizeHtml } from "@/lib/sanitize";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import JsonLd from "@/components/seo/JsonLd";
import type { Tables } from "@/lib/firebase-types";
import ProductImagePlaceholder from "@/components/ui/ProductImagePlaceholder";

type Product = Tables<"products">;

const YedekParcaDetay = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

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
          <div className="container mx-auto px-4 animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded-xl" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-24 bg-muted rounded" />
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
        <section className="py-16 md:py-24 text-center">
          <div className="container mx-auto px-4">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h1 className="font-heading font-bold text-2xl text-foreground mb-4">Ürün bulunamadı</h1>
            <Link to="/yedek-parca" className="text-primary hover:underline">
              Yedek Parça sayfasına dön
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.meta_description || product.title,
    image: product.images && product.images.length > 0 ? product.images : ["https://pasamotor.com.tr/favicon.png"],
    brand: { "@type": "Brand", name: product.brand },
    sku: product.slug,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `https://pasamotor.com.tr/yedek-parca/${product.slug}`,
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
        title={product.meta_title || `${product.title} - ${product.brand} Yedek Parça`}
        description={product.meta_description || product.description || `${product.title} - Paşa Motor ${product.brand} orijinal ve muadil yedek parça.`}
        keywords={product.brand ? `${product.title?.toLowerCase()}, ${product.brand.toLowerCase()} yedek parça, ${product.brand.toLowerCase()} orjinal ${product.title?.toLowerCase()}, ${product.brand.toLowerCase()} orijinal ${product.title?.toLowerCase()}, pasamotor.com.tr yedek parça, motosiklet ${product.title?.toLowerCase()}, fatih ${product.brand.toLowerCase()} parçaları` : `${product.title?.toLowerCase()}, motosiklet yedek parça, pasamotor.com.tr, orijinal motosiklet parçası`}
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
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Link to="/yedek-parca" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Yedek Parçaya Dön
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div>
              <div className="rounded-xl overflow-hidden bg-white aspect-square mb-4 flex items-center justify-center border border-border">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImage]}
                    alt={product.title}
                    width={800}
                    height={800}
                    className="max-w-full max-h-full object-contain p-6"
                    loading="eager"
                  />
                ) : (
                  <ProductImagePlaceholder brand={product.brand || "PAŞA MOTOR"} />
                )}
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 bg-white flex items-center justify-center transition-colors ${
                        selectedImage === i ? "border-primary" : "border-transparent"
                      }`}
                    >
                      <img src={img} alt="" width={80} height={80} className="max-w-full max-h-full object-contain p-2" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="lg:pt-2">
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary tracking-wide uppercase">
                  {product.brand}
                </span>
                {product.category && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                    {product.category}
                  </span>
                )}
                {(product.stock ?? 0) > 0 ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Stokta Var
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Tükendi / Sipariş Üzerine
                  </span>
                )}
              </div>

              <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-foreground mb-4 tracking-tight leading-[1.1]">
                {product.title}
              </h1>

              <div className="flex items-center gap-4 mb-6 flex-wrap">
                {product.price ? (
                  <div className="inline-flex flex-col gap-1 px-6 py-3.5 rounded-2xl bg-gradient-to-br from-[#1c2230] to-[#121620] border border-primary/20 shadow-xl shadow-primary/5 backdrop-blur-md relative overflow-hidden group/price">
                    <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    <span className="text-[10px] font-extrabold text-primary font-mono tracking-widest uppercase">FİYAT</span>
                    <p className="font-heading font-extrabold text-3xl md:text-4xl text-white tracking-tight">
                      {new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(product.price)} TL
                    </p>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-950/40 border border-white/[0.04] shadow-md backdrop-blur-md">
                    <p className="font-heading font-semibold text-sm text-slate-400">
                      Fiyat için iletişime geçin
                    </p>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <p>• Yetkili Distribütör Ürünü</p>
                  <p>• Aynı Gün Kargo İmkanı</p>
                </div>
              </div>

              {product.description && (
                <div className="border-l-2 border-primary/30 pl-4 py-1 mb-8">
                  <p className="text-foreground/85 leading-[1.7] text-base md:text-lg italic font-normal">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Premium E-commerce Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 bg-muted/30 p-4 rounded-xl border border-border/60">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm">🚚</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Aynı Gün Kargo</h4>
                    <p className="text-[11px] text-muted-foreground leading-snug">Saat 16:00'ya kadar olan siparişler aynı gün kargoda.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm">🏍️</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">%100 Uyum Garantisi</h4>
                    <p className="text-[11px] text-muted-foreground leading-snug">Uzmanlarımız şasi numaranızla parça uyumunu teyit eder.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm">🛠️</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Montaj Servisi Desteği</h4>
                    <p className="text-[11px] text-muted-foreground leading-snug">İstanbul Fatih mağazamızda montaj desteği sunulmaktadır.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-sm">🔒</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Güvenli WhatsApp Siparişi</h4>
                    <p className="text-[11px] text-muted-foreground leading-snug">Temsilcimizle birebir görüşerek güvenle satın alın.</p>
                  </div>
                </div>
              </div>

              {product.content && (
                <div
                  className="
                    prose prose-invert max-w-none mb-10
                    prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-foreground
                    prose-h2:text-xl md:prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
                    prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2
                    prose-p:text-foreground/80 prose-p:leading-[1.8] prose-p:my-3
                    prose-strong:text-foreground prose-strong:font-bold
                    prose-ul:my-4 prose-ul:pl-5 prose-li:text-foreground/80 prose-li:leading-[1.7] prose-li:my-1.5
                    prose-a:text-primary prose-a:font-medium hover:prose-a:underline
                  "
                  dangerouslySetInnerHTML={{ 
                    __html: sanitizeHtml(
                      product.content.replace(/<h1[^>]*>.*?<\/h1>/gi, "") // Exclude duplicate H1 heading from content context
                    ) 
                  }}
                />
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                <a
                  href={`https://wa.me/905348996817?text=${encodeURIComponent(`Merhaba, ${product.title}${product.sku ? ", " + product.sku : ""} (Marka: ${product.brand || ""}, Fiyat: ${product.price ? product.price + " TL" : "Fiyat Sorun"}) Bu ürünü sipariş vermek istiyorum.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] shadow-lg shadow-emerald-500/10 active:scale-[0.98]"
                  style={{ backgroundColor: "#25D366", color: "#fff" }}
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  Sipariş Ver / WhatsApp Bilgi Al
                </a>
                <a
                  href="tel:+905348996817"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/95 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Phone className="w-5 h-5" />
                  Hemen Arayın
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default YedekParcaDetay;
