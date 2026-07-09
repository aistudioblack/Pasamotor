import Layout from "@/components/layout/Layout";
import { useState, useEffect, useMemo, useTransition } from "react";
import { dbClient } from "@/lib/db-client";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, BookOpen, Search, Clock, RefreshCw } from "lucide-react";
import type { Tables } from "@/lib/db-types";
import SEO, { breadcrumbSchema } from "@/components/seo/SEO";
import JsonLd from "@/components/seo/JsonLd";
import { getCachedPosts, setCachedPosts } from "@/lib/blog-cache";
import { ImageWithFallback } from "@/components/ImageWithFallback";

type Post = Tables<"posts">;

import { useSEO } from "@/hooks/useSEO";

const readingTime = (html: string | null) => {
  if (!html) return 1;
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
};

const Blog = () => {
  const [posts, setPosts] = useState<Post[]>(() => {
    return getCachedPosts() || [];
  });
  const [loading, setLoading] = useState(() => {
    return !getCachedPosts(); // önbellek varsa loading false olarak başlar (0.01 ms render)
  });
  const [backgroundUpdating, setBackgroundUpdating] = useState(false);
  const [q, setQ] = useState("");
  const [deferredQ, setDeferredQ] = useState("");
  const [isPending, startTransition] = useTransition();
  const [visibleCount, setVisibleCount] = useState(6);

  const seo = useSEO(
    "blog",
    "Motosiklet Blog — Bakım ve Yedek Parça Rehberleri | Paşa Motor",
    "TVS, Hero, Honda, Yamaha bakım rehberleri ve yedek parça tavsiyeleri. Paşa Motor Fatih İstanbul uzman blogu."
  );

  useEffect(() => {
    const fetchPosts = async () => {
      const hasCache = !!getCachedPosts();
      if (hasCache) {
        setBackgroundUpdating(true);
      }
      try {
        const { data } = await dbClient
          .from("posts")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });
        
        const postsData = data || [];
        setPosts(postsData);
        setCachedPosts(postsData);
      } catch (error) {
        console.error("Post fetch error:", error);
      } finally {
        setLoading(false);
        setBackgroundUpdating(false);
      }
    };
    fetchPosts();
  }, []);

  // Okuma sürelerini ve verileri memoize edelim ki her renderda regex çalışmasın
  const memoizedPosts = useMemo(() => {
    return posts.map((p) => ({
      ...p,
      calcReadingTime: readingTime(p.content),
    }));
  }, [posts]);

  // Arama inputu için gecikmesiz güncelleme (useTransition)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQ(val);
    startTransition(() => {
      setDeferredQ(val);
      setVisibleCount(6); // Arama yapıldığında listeyi sıfırla
    });
  };

  const filtered = useMemo(() => {
    if (!deferredQ.trim()) return memoizedPosts;
    const t = deferredQ.toLowerCase();
    return memoizedPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(t) ||
        (p.excerpt || "").toLowerCase().includes(t),
    );
  }, [memoizedPosts, deferredQ]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  const visibleRest = useMemo(() => {
    return rest.slice(0, visibleCount);
  }, [rest, visibleCount]);

  const hasMore = rest.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "https://pasamotor.com.tr";
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Paşa Motor Blog",
    url: `${origin}/blog`,
    publisher: { "@type": "Organization", name: "Paşa Motor" },
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${origin}/blog/${p.slug}`,
      datePublished: p.created_at || p.published_at,
      image: p.cover_image || undefined,
    })),
  };

  return (
    <Layout>
      <SEO
        title={seo.title}
        description={seo.description}
        canonical="/blog"
        keywords="motosiklet blog, motor bakım ipuçları, motosiklet rehber, tvs hero falcon ışıldar"
      />
      <JsonLd data={blogSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ana Sayfa", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />

      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-25 blur-[100px] -z-10"
          style={{ background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)" }}
        />
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]">
            <BookOpen className="w-4 h-4" /> Paşa Motor Blog
            {backgroundUpdating && (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary ml-1" />
            )}
          </span>
          <h1 className="font-heading font-black text-5xl md:text-7xl text-foreground mb-6 tracking-tight leading-[1.05] drop-shadow-sm">
            Motosiklet bilgisinin{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-orange-500 animate-pulse-slow">
              kalbi
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Bakım rehberleri, model incelemeleri, satın alma tüyoları ve
            İstanbul'daki motosiklet kültüründen güncel hikayeler.
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={q}
              onChange={handleSearchChange}
              placeholder="Yazılar arasında ara..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
            {isPending && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border animate-pulse">
                  <div className="w-full aspect-[16/10] bg-muted" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-foreground font-medium text-lg mb-2">Sonuç bulunamadı</p>
              <p className="text-sm text-muted-foreground">
                {q ? "Farklı bir arama deneyin." : "Yakında bakım ipuçları ve haberler burada olacak."}
              </p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Featured */}
              {featured && !q && (
                <Link
                  to={`/blog/${featured.slug}`}
                  className="group block rounded-3xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all duration-500 mb-12 lg:mb-16"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-muted">
                      {featured.cover_image ? (
                        <ImageWithFallback
                          src={featured.cover_image}
                          alt={featured.title}
                          width={1200}
                          height={800}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                          loading="eager"
                          decoding="sync"
                          {...{ fetchpriority: "high" }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-20 h-20 text-muted-foreground/20" />
                        </div>
                      )}
                      <span className="absolute top-5 left-5 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold tracking-wide">
                        ÖNE ÇIKAN
                      </span>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-4 bg-muted/40 w-fit px-3 py-1.5 rounded-md">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(featured.created_at || featured.published_at)}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-border" />
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {featured.calcReadingTime} dk okuma
                        </span>
                      </div>
                      <h2 className="font-heading font-black text-3xl md:text-5xl text-foreground mb-5 leading-[1.1] tracking-tight group-hover:text-primary transition-colors duration-300 drop-shadow-sm">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-3 md:text-lg">
                          {featured.excerpt}
                        </p>
                      )}
                      <span className="mt-auto inline-flex items-center gap-2 bg-primary text-primary-foreground font-bold text-sm w-fit px-5 py-2.5 rounded-lg group-hover:bg-primary/90 transition-all duration-300 shadow-md group-hover:shadow-lg">
                        Yazıyı Oku
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {(q ? filtered : visibleRest).map((post) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.2)] transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      {post.cover_image ? (
                        <ImageWithFallback
                          src={post.cover_image}
                          alt={post.title}
                          width={600}
                          height={450}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-4">
                        <span className="inline-flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                          <Calendar className="w-3 h-3" />
                          {formatDate(post.created_at || post.published_at)}
                        </span>
                        <span className="inline-flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                          <Clock className="w-3 h-3" />
                          {post.calcReadingTime} dk
                        </span>
                      </div>
                      <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors leading-[1.3] line-clamp-2 tracking-tight">
                        {post.title}
                       </h3>
                      {post.excerpt && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="mt-auto inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground font-bold w-fit px-4 py-2 rounded-lg group-hover:bg-primary/90 transition-all duration-300 shadow-sm group-hover:shadow-md">
                        Devamını Oku
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Load more button */}
              {hasMore && !q && (
                <div className="flex justify-center mt-12 md:mt-16">
                  <button
                    onClick={handleLoadMore}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300"
                  >
                    Daha Fazla Yazı Yükle
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
