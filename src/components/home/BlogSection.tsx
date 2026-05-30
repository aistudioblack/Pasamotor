import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { dbClient } from "@/lib/firebase-client";
import { ArrowRight, Calendar, BookOpen, Clock } from "lucide-react";

export default function BlogSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await dbClient
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const formatDate = (date: string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("tr-TR", {
      year: "numeric", month: "long", day: "numeric",
    });
  };

  const readingTime = (html: string | null) => {
    if (!html) return 1;
    const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 220));
  };

  if (loading || posts.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Paşa Motor Blog
            </span>
            <h2 className="font-heading font-black text-3xl md:text-4xl text-foreground mb-4 tracking-tight">
              Sektörden ve Servisten <span className="text-primary">Son Haberler</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Motosiklet bakımı, yeni modeller ve ipuçları hakkında güncel yazılarımızı okuyun.
            </p>
          </div>
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-sm font-bold text-foreground bg-card border border-border hover:border-primary/50 transition-colors px-6 py-3 rounded-full shadow-sm hover:shadow-md"
          >
            Tüm Yazıları Gör
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex flex-col rounded-3xl overflow-hidden bg-card border border-border/50 hover:border-primary/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {post.cover_image ? (
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    loading="lazy"
                    referrerPolicy="no-referrer"
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
                    {readingTime(post.content)} dk
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors leading-[1.3] line-clamp-2 tracking-tight">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-6">
                    {post.excerpt}
                  </p>
                )}
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-primary font-bold group-hover:translate-x-1 transition-transform">
                  Devamını Oku
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
