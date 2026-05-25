import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { dbClient } from "@/lib/firebase-client";
import SEO from "@/components/seo/SEO";
import { Loader2 } from "lucide-react";
import type { Tables } from "@/lib/firebase-types";
import { legalDefaults } from "@/data/legalDefaults";

type Page = Tables<"pages">;

export default function LegalPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(false);
      if (!slug) return;
      
      try {
        const { data } = await dbClient
          .from("pages")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .limit(1);

        if (data && data.length > 0) {
          setPage(data[0]);
        } else if (legalDefaults[slug]) {
          // Fallback to beautiful default text instantly
          const fallbackPage = legalDefaults[slug] as unknown as Page;
          setPage(fallbackPage);
          
          // Silently auto-seed this page into firestore database so it appears in administration
          dbClient.from("pages").insert({
            title: fallbackPage.title,
            slug: fallbackPage.slug,
            content: fallbackPage.content,
            meta_title: fallbackPage.meta_title || "",
            meta_description: fallbackPage.meta_description || "",
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }).then(({ error }) => {
            if (error) console.warn("Background auto-seed page failed:", error);
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to load page from db, trying local fallback:", err);
        if (legalDefaults[slug]) {
          setPage(legalDefaults[slug] as unknown as Page);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error || !page) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center pt-24 pb-12">
          <div className="glass-card p-12 text-center rounded-2xl max-w-lg">
            <h1 className="text-2xl font-bold mb-4 font-heading text-destructive">Sayfa Bulunamadı</h1>
            <p className="text-muted-foreground">Aradığınız sayfa yayından kaldırılmış veya taşınmış olabilir.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO 
        title={page.meta_title || `${page.title} | Paşa Motor`} 
        description={page.meta_description || ""}
        keywords={`${page.title.toLowerCase()}, legal, sözleşme`}
      />

      <main className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <article className="glass-card rounded-2xl p-6 sm:p-10 lg:p-12 mt-6">
          <header className="mb-8 border-b border-border/50 pb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              {page.title}
            </h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Son Güncelleme: {new Date(page.updated_at).toLocaleDateString("tr-TR")}</span>
            </div>
          </header>

          <div 
            className="prose prose-sm sm:prose-base lg:prose-lg prose-gray dark:prose-invert max-w-none 
                       prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
                       prose-p:text-muted-foreground prose-p:leading-relaxed
                       prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-foreground prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: page.content || "" }} 
          />
        </article>
      </main>
    </Layout>
  );
}
