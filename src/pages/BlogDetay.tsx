import Layout from "@/components/layout/Layout";
import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { dbClient } from "@/lib/db-client";
import { 
  ArrowLeft, Calendar, BookOpen, Clock, Share2, ArrowRight, MessageCircle, Phone,
  CheckCircle2, User, Award, List, Heart, Sparkles, AlertCircle, Bookmark, Copy
} from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/db-types";
import { getCachedPostBySlug, addPostToCache, getCachedPosts } from "@/lib/blog-cache";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type Post = Tables<"posts">;

const readingTime = (content: string | null) => {
  if (!content) return 1;
  const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
};

const BlogDetay = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  
  const [post, setPost] = useState<Post | null>(() => {
    return slug ? getCachedPostBySlug(slug) : null;
  });
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(() => {
    return slug ? !getCachedPostBySlug(slug) : true;
  });
  const [progress, setProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      
      const cached = getCachedPostBySlug(slug);
      if (cached) {
        setPost(cached);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        const { data } = await dbClient
          .from("posts")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .maybeSingle();
        
        if (data) {
          setPost(data);
          addPostToCache(data);
        }
      } catch (err) {
        console.error("Fetch post error:", err);
      } finally {
        setLoading(false);
      }

      // Related posts optimization using local cached data
      const allCached = getCachedPosts();
      if (allCached && allCached.length > 1) {
        const rel = allCached
          .filter((p) => p.slug !== slug)
          .slice(0, 3);
        setRelated(rel);
      } else {
        try {
          const { data: rel } = await dbClient
            .from("posts")
            .select("*")
            .eq("is_published", true)
            .neq("slug", slug)
            .order("published_at", { ascending: false })
            .limit(3);
          setRelated(rel || []);
        } catch (err) {
          console.error("Fetch related error:", err);
        }
      }
      
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    };
    fetchPost();
  }, [slug]);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (scrolled / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Process HTML Content to dynamically inject robust, clean anchor IDs to H2 headings
  const processedContent = useMemo(() => {
    if (!post?.content) return "";
    
    const contentStr = post.content;
    const h2Regex = /<h2([^>]*)>(.*?)<\/h2>/gi;
    
    return contentStr.replace(h2Regex, (match, attrs, text) => {
      // Create clean id slug from text
      const cleanText = text.replace(/<[^>]+>/g, "").trim();
      const id = cleanText
        .toLowerCase()
        .replace(/ı/g, "i")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      
      if (attrs.includes("id=")) {
        return match;
      }
      return `<h2 id="${id}" ${attrs} class="scroll-mt-24 group flex items-center gap-2">${text}</h2>`;
    });
  }, [post?.content]);

  // Dynamically extract headings list for TOC (Table of Contents)
  const headings = useMemo(() => {
    if (!post?.content) return [];
    const h2Regex = /<h2[^>]*>(.*?)<\/h2>/gi;
    const list: Array<{ id: string; text: string }> = [];
    let match;
    
    while ((match = h2Regex.exec(post.content)) !== null) {
      const text = match[1].replace(/<[^>]+>/g, "").trim();
      const id = text
        .toLowerCase()
        .replace(/ı/g, "i")
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      list.push({ id, text });
    }
    return list;
  }, [post?.content]);

  // Setup active heading highlighting via IntersectionObserver
  useEffect(() => {
    if (headings.length === 0 || !contentRef.current) return;

    const observerOption = {
      root: null,
      rootMargin: "0px 0px -60% 0px", // triggers when heading is in the upper part of the viewport
      threshold: 0.1
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const visible = entries.filter(e => e.isIntersecting);
      if (visible.length > 0) {
        // Find topmost intersecting header
        const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActiveHeadingId(sorted[0].target.id);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, observerOption);
    
    // Select all auto id'd H2 headers in the content
    const elements = contentRef.current.querySelectorAll("h2[id]");
    elements.forEach(el => observer.observe(el));

    return () => {
      elements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [processedContent, headings]);

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { 
        await navigator.share({ title: post?.title, url }); 
      } catch { 
        /* cancelled */ 
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "🔗 Bağlantı Kopyalandı", description: "Makale linki panoya kaydedildi." });
    }
  };

  const articleSchema = useMemo(() => {
    if (!post) return null;
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt || post.meta_description || "",
      image: post.cover_image || "https://pasamotor.com.tr/favicon.png",
      datePublished: post.published_at,
      dateModified: post.updated_at,
      mainEntityOfPage: { "@type": "WebPage", "@id": `https://pasamotor.com.tr/blog/${post.slug}` },
      author: { "@type": "Organization", name: "Paşa Motor", url: "https://pasamotor.com.tr" },
      publisher: {
        "@type": "Organization",
        name: "Paşa Motor",
        url: "https://pasamotor.com.tr",
        logo: { "@type": "ImageObject", url: "https://pasamotor.com.tr/favicon.png" },
      },
    };
  }, [post]);

  if (loading) {
    return (
      <Layout>
        <article className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-3xl animate-pulse">
            <div className="h-6 bg-muted rounded w-32 mb-8" />
            <div className="h-12 bg-muted rounded w-3/4 mb-4" />
            <div className="h-4 bg-muted rounded w-1/3 mb-8" />
            <div className="h-72 bg-muted rounded-2xl mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-4/5" />
            </div>
          </div>
        </article>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <section className="py-24 text-center">
          <div className="container mx-auto px-4">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h1 className="font-heading font-bold text-2xl text-foreground mb-4">Yazı bulunamadı</h1>
            <Link to="/blog" className="text-primary hover:underline">Blog sayfasına dön</Link>
          </div>
        </section>
      </Layout>
    );
  }

  const minutes = readingTime(post.content);

  // Smooth scroll helper for TOC clicks
  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // navigation bar offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      // Set active slug locally as fallback before observer fires
      setActiveHeadingId(id);
    }
  };

  return (
    <Layout>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || `${post.title} - Paşa Motor uzman rehber yazısı.`}
        canonical={`/blog/${post.slug}`}
        image={post.cover_image || undefined}
        type="article"
        publishedTime={post.published_at || undefined}
        modifiedTime={post.updated_at}
      />
      {articleSchema && <JsonLd data={articleSchema} />}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ])}
      />

      {/* Modern Top Reading Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-transparent">
        <div
          className="h-full bg-primary transition-[width] duration-150 rounded-r-full shadow-[0_0_12px_rgba(var(--primary),0.8)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Premium Hero Design */}
      <header className="relative pt-24 md:pt-36 pb-12 overflow-hidden border-b border-border/10 bg-slate-950/20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full opacity-30 blur-[130px] -z-10"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
        />
        
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumbs returning category */}
          <div className="flex justify-between items-center mb-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-all duration-300 bg-card border border-border/50 px-4 py-2 rounded-full hover:shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
              <ArrowLeft className="w-4.5 h-4.5 transition-transform group-hover:-translate-x-0.5" /> Kütüphaneye Dön
            </Link>
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-muted/20 px-3py-1 px-3 py-1.5 rounded-full border border-border/20">
              <span className="text-secondary font-semibold">PAŞA MOTOR</span>
              <span>/</span>
              <span>Orijinal Teknik Rehber</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs md:text-sm font-medium text-muted-foreground mb-6 flex-wrap">
            <span className="px-3.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/25 shadow-sm font-semibold tracking-wider uppercase text-[10px]">
              ✓ Teknik Makale
            </span>
            <span className="inline-flex items-center gap-1.5 bg-muted/40 px-3.5 py-1 rounded-full text-foreground/80 text-xs shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-primary" /> {formatDate(post.published_at)}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-muted/40 px-3.5 py-1 rounded-full text-foreground/80 text-xs shadow-sm">
              <Clock className="w-3.5 h-3.5 text-secondary" /> {minutes} dk okuma süresi
            </span>
          </div>

          <h1 className="font-heading font-black text-3xl md:text-5xl lg:text-6xl text-foreground mb-6 tracking-tight leading-[1.125] drop-shadow-sm max-w-4xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg md:text-xl text-muted-foreground/90 leading-relaxed mb-8 max-w-3xl">
              {post.excerpt}
            </p>
          )}

          {/* Social Proof Author & Share */}
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border/30 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold shadow-sm">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                  Yazar: Paşa Motor Teknik Heyeti
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/10" aria-label="Doğrulanmış Teknik Kaynak" />
                </div>
                <div className="text-xs text-muted-foreground">Motosiklet Yedek Parça ve Servis Uzmanlığı</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={share}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card hover:bg-muted text-foreground font-bold text-xs hover:border-primary/50 hover:text-primary shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Yazıyı Paylaş
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image Container */}
      {post.cover_image && (
        <div className="container mx-auto px-4 max-w-5xl -mt-4 mb-16 relative">
          <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-border/80 bg-muted/30 aspect-[16/9] shadow-2xl shadow-primary/5 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover hover:scale-[1.015] transition-transform duration-700"
            />
          </div>
        </div>
      )}

      {/* Main Grid: Content & Sticky TOC */}
      <section className="pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* STICKY LEFT COLUMN: TOC + EEAT VERIFICATION */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-8 order-2 lg:order-1">
              
              {/* Dynamic Table of Contents (İçindekiler) */}
              {headings.length > 0 && (
                <div className="glass-card rounded-2xl border border-border/60 p-6 shadow-sm bg-card/60 backdrop-blur-md">
                  <div className="flex items-center gap-2.5 text-foreground font-extrabold text-sm tracking-wide border-b border-border/40 pb-4 mb-4 uppercase">
                    <List className="w-4.5 h-4.5 text-primary" />
                    <span>Yazı İçeriği (İçindekiler)</span>
                  </div>
                  <nav className="space-y-1 max-h-[350px] overflow-y-auto pr-1 text-sm scrollbar-thin">
                    {headings.map((h, index) => (
                      <a
                        key={h.id}
                        href={`#${h.id}`}
                        onClick={(e) => handleTocClick(e, h.id)}
                        className={`group block py-2.5 px-3 rounded-lg border-l-2 transition-all duration-200 leading-snug font-medium text-[13px] ${
                          activeHeadingId === h.id
                            ? "border-primary bg-primary/5 text-primary font-bold pl-4"
                            : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:pl-4"
                        }`}
                      >
                        <span className="text-[10px] font-mono mr-2 text-muted-foreground group-hover:text-primary">
                          0{index + 1}.
                        </span>
                        {h.text}
                      </a>
                    ))}
                  </nav>
                </div>
              )}

              {/* Expert E-E-A-T Quality Badge */}
              <div className="p-6 rounded-2xl border border-border/50 bg-[#0d0f14]/80 text-xs space-y-4 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border/30 pb-3">
                  <Award className="w-5 h-5 text-secondary shrink-0" />
                  <span className="font-bold text-foreground text-xs uppercase tracking-wider">DOĞRULANMIŞ TEKNİK BİLGİ</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Bu kılavuz, motosiklet mekaniği alanında 20 yılı aşkın tecrübeye sahip <strong>Paşa Motor Teknik Heyeti</strong> tarafından incelenmiş, teknik veriler ve parça toleransları güncel servis manuel kitapçıklarına göre doğrulanmıştır.
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-semibold bg-emerald-500/5 px-2.5 py-1.5 rounded-lg w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 fill-emerald-500/10" />
                  %100 Güvenilir Sürüş Güvencesi
                </div>
              </div>

            </aside>

            {/* MAIN CONTENT COLUMN: PERFECT PROSE STYLE */}
            <main ref={contentRef} className="lg:col-span-8 order-1 lg:order-2 space-y-12">
              
              {/* Main HTML container with beautiful premium blog styling */}
              {processedContent && (
                <div className="pasa-article">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeRaw]}
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-6 mt-8 text-foreground" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-4 mt-8 text-foreground border-b pb-2" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-3 mt-6 text-foreground" {...props} />,
                      p: ({node, ...props}) => <p className="text-base leading-8 mb-5 text-muted-foreground" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-5 space-y-2 text-muted-foreground" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-5 space-y-2 text-muted-foreground" {...props} />,
                      li: ({node, ...props}) => <li className="leading-7" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                      a: ({node, children, ...props}) => {
                        const isWhatsApp = typeof props.href === 'string' && props.href.includes("wa.me");
                        if (isWhatsApp) {
                          return (
                            <a 
                              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 mt-6 mb-10 rounded-xl font-semibold tracking-wide text-sm bg-[#128C7E] hover:bg-[#075E54] text-white shadow-md hover:shadow-lg transition-all duration-300 w-full sm:w-auto no-underline relative overflow-hidden group border border-[#128C7E]/20 hover:-translate-y-0.5"
                              target="_blank"
                              rel="noopener noreferrer"
                              {...props}
                            >
                              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                              <MessageCircle className="w-5 h-5 shrink-0 relative z-10 text-white" /> 
                              <span className="relative z-10 text-white drop-shadow-sm">WhatsApp ile Destek Al</span>
                            </a>
                          );
                        }
                        return <a className="text-primary hover:underline font-medium" {...props}>{children}</a>;
                      },
                      hr: ({node, ...props}) => <hr className="mt-12 mb-10 border-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground" {...props} />,
                      table: ({node, ...props}) => <div className="overflow-x-auto"><table className="w-full border-collapse my-6 text-sm" {...props} /></div>,
                      thead: ({node, ...props}) => <thead className="bg-muted" {...props} />,
                      th: ({node, ...props}) => <th className="border border-border px-4 py-2 text-left font-semibold text-foreground" {...props} />,
                      td: ({node, ...props}) => <td className="border border-border px-4 py-2 text-muted-foreground" {...props} />,
                      code: ({node, ...props}) => <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props} />,
                    }}
                  >
                    {processedContent}
                  </ReactMarkdown>
                </div>
              )}

              {/* Trust Signal Disclosure Footer */}
              <div className="flex items-center gap-3 p-4.5 rounded-xl border border-border/40 bg-card/40 text-[11px] text-muted-foreground leading-relaxed mt-10">
                <AlertCircle className="w-5 h-5 text-secondary shrink-0" />
                <span>
                  <strong>Açıklama:</strong> Sitemizdeki tüm teknik rehberler sadece bilgilendirme amaçlıdır. Motosikletinizdeki herhangi bir montaj veya aşınmış parça değişimi işlemini, can güvenliğiniz açısından uzman teknisyen yardımıyla yapmanızı tavsiye ederiz.
                </span>
              </div>

            </main>
          </div>
        </div>
      </section>

      {/* Recommended Related Posts Box */}
      {related.length > 0 && (
        <section className="pb-28 border-t border-border/40 pt-20 bg-slate-950/10">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Benzer Yazılar</span>
                <h2 className="font-heading font-black text-2xl md:text-3xl lg:text-4xl text-foreground tracking-tight">
                  İlgili İçerikler
                </h2>
              </div>
              <Link to="/blog" className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                Tüm Kütüphaneyi Gör <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/blog/${r.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] bg-muted overflow-hidden relative">
                    {r.cover_image ? (
                      <img 
                        src={r.cover_image} 
                        alt={r.title} 
                        width={400} 
                        height={250} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        loading="lazy" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-slate-950/70 backdrop-blur-md text-foreground text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-border/30">
                      Rehber
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[11px] text-muted-foreground mb-2 font-medium">{formatDate(r.published_at)}</p>
                    <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug text-sm md:text-base mb-4">
                      {r.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs text-primary mt-auto font-bold">
                      Hemen Oku <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default BlogDetay;

