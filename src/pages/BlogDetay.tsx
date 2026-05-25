import Layout from "@/components/layout/Layout";
import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { dbClient } from "@/lib/firebase-client";
import { ArrowLeft, Calendar, BookOpen, Clock, Share2, ArrowRight, MessageCircle, Phone } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import { sanitizeHtml } from "@/lib/sanitize";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/lib/firebase-types";
import { getCachedPostBySlug, addPostToCache, getCachedPosts } from "@/lib/blog-cache";

type Post = Tables<"posts">;

const readingTime = (html: string | null) => {
  if (!html) return 1;
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
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

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: post?.title, url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Bağlantı kopyalandı" });
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

  return (
    <Layout>
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || `${post.title} - Paşa Motor blog yazısı.`}
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

      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Hero */}
      <header className="relative pt-16 md:pt-24 pb-10 md:pb-14 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.03] via-background to-background" />
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Blog'a Dön
          </Link>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">Paşa Motor</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(post.published_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {minutes} dk okuma
            </span>
          </div>

          <h1 className="font-heading font-bold text-3xl md:text-5xl lg:text-6xl text-foreground mb-5 tracking-tight leading-[1.08]">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          <button
            onClick={share}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-foreground text-sm hover:border-primary/50 hover:text-primary transition-colors"
          >
            <Share2 className="w-4 h-4" /> Paylaş
          </button>
        </div>
      </header>

      {/* Cover */}
      {post.cover_image && (
        <div className="container mx-auto px-4 max-w-4xl mb-12 md:mb-16">
          <div className="rounded-2xl md:rounded-3xl overflow-hidden border border-border bg-muted aspect-[16/9]">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 max-w-3xl">
          {post.content && (
            <div
              className="
                prose prose-lg prose-invert max-w-none
                prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-foreground
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl md:prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-foreground/85 prose-p:leading-[1.85] prose-p:text-[1.05rem]
                prose-strong:text-foreground prose-strong:font-semibold
                prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-ul:my-5 prose-li:text-foreground/85 prose-li:leading-[1.8] prose-li:my-1.5
                prose-ol:my-5
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-5 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-foreground
                prose-img:rounded-xl prose-img:border prose-img:border-border
                prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                prose-hr:border-border
              "
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            />
          )}

          {/* CTA */}
          <div className="mt-14 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-border">
            <h3 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-2 tracking-tight">
              Bir sorunuz mu var?
            </h3>
            <p className="text-muted-foreground mb-5">
              Paşa Motor uzmanları motosikletinizle ilgili her sorunuzu yanıtlamaya hazır.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://wa.me/905348996817"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm"
                style={{ backgroundColor: "#25D366", color: "#fff" }}
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href="tel:+905348996817"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90"
              >
                <Phone className="w-4 h-4" /> 0534 899 68 17
              </a>
            </div>
          </div>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="pb-24 border-t border-border pt-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-8 tracking-tight">
              Diğer yazılar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  to={`/blog/${r.slug}`}
                  className="group flex flex-col rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-300"
                >
                  <div className="aspect-[16/10] bg-muted overflow-hidden">
                    {r.cover_image ? (
                      <img src={r.cover_image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><BookOpen className="w-10 h-10 text-muted-foreground/30" /></div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground mb-2">{formatDate(r.published_at)}</p>
                    <h3 className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {r.title}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs text-primary mt-3 font-medium">
                      Oku <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
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
