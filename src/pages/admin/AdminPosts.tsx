import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { dbClient } from "@/lib/firebase-client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, X, Loader2, FileText, Eye, AlertTriangle, RefreshCw, Radar, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables } from "@/lib/firebase-types";
import { useRef } from "react";
import { convertToWebP, getWebPFileName } from "@/lib/imageOptimization";

type Post = Tables<"posts">;

const slugify = (text: string) =>
  text.toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const emptyForm = {
  title: "", slug: "", excerpt: "", content: "", cover_image: "",
  meta_title: "", meta_description: "", is_published: false, tags: [] as string[]
};

const AdminPosts = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  
  // AI Blog Draft Generator states
  const [generatingBlogs, setGeneratingBlogs] = useState(false);
  const [blogProgress, setBlogProgress] = useState("");
  const [blogLogStr, setBlogLogStr] = useState("");
  const cancelBlogGen = useRef(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const uniqueTags = Array.from(new Set(items.flatMap(p => p.tags || []))).sort();
  const filteredItems = selectedTag ? items.filter(p => (p.tags || []).includes(selectedTag)) : items;

  const load = async () => {
    setLoading(true);
    const { data } = await dbClient.from("posts").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setOpen(true); };

  const openEdit = (p: Post) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, excerpt: p.excerpt || "", content: p.content || "",
      cover_image: p.cover_image || "", meta_title: p.meta_title || "",
      meta_description: p.meta_description || "", is_published: p.is_published, tags: p.tags || []
    });
    setOpen(true);
  };

  const pingSearchEngines = async (slug: string) => {
    try {
      await dbClient.functions.invoke("notify-search-engines", {
        body: { urls: [`/blog/${slug}`, "/blog", "/sitemap.xml"] },
      });
    } catch (e) {
      console.warn("notify-search-engines failed:", e);
    }
  };

  const optimizeImagesInBackground = async (postId: string, slug: string, coverImageUrl: string | null, contentHtml: string | null) => {
    try {
      let isUpdated = false;
      let newCover = coverImageUrl;
      let newContent = contentHtml;

      const processUrl = async (url: string, suffix: string): Promise<string | null> => {
        if (!url || !url.startsWith("http") || url.includes("dbClient.co")) return null;
        try {
          const res = await fetch(url);
          if (!res.ok) return null;
          const blob = await res.blob();
          
          if (!blob.type.startsWith("image/")) return null;

          const webpBlob = await convertToWebP(blob);
          const rand = Math.floor(Math.random() * 1000);
          const path = `blog/${slug}-${suffix}-${rand}.webp`;

          const { error } = await dbClient.storage.from("product-images").upload(path, webpBlob, {
            contentType: "image/webp",
          });
          if (error) return null;

          const { data: pub } = dbClient.storage.from("product-images").getPublicUrl(path);
          return pub.publicUrl;
        } catch (e) {
          console.error("Failed to process background image", e);
          return null;
        }
      };

      if (coverImageUrl) {
        const optimizedCover = await processUrl(coverImageUrl, "cover");
        if (optimizedCover) {
          newCover = optimizedCover;
          isUpdated = true;
        }
      }

      if (contentHtml) {
        const imgRegex = /<img[^>]+src="([^">]+)"/g;
        let match;
        const replacements: { old: string; new: string }[] = [];
        let index = 1;
        
        while ((match = imgRegex.exec(contentHtml)) !== null) {
          const originalUrl = match[1];
          if (originalUrl.startsWith("http") && !originalUrl.includes("dbClient.co")) {
            const optimized = await processUrl(originalUrl, `image-${index++}`);
            if (optimized) {
              replacements.push({ old: originalUrl, new: optimized });
              isUpdated = true;
            }
          }
        }

        if (replacements.length > 0 && newContent) {
          for (const rep of replacements) {
            newContent = newContent.replace(rep.old, rep.new);
          }
        }
      }

      if (isUpdated) {
        await dbClient.from("posts").update({
          cover_image: newCover,
          content: newContent
        }).eq("id", postId);
        
        // Sadece background işleminin bittiğini gösterebilmek için:
        toast({ title: "Arka Plan İşlemi", description: "Yazıdaki resimler WebP olarak optimize edildi." });
        load(); // Sayfayı güncelle
      }
    } catch (err) {
      console.error("Background optimization failed", err);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const finalSlug = form.slug.trim() || slugify(form.title);
    const payload: any = {
      title: form.title.trim(),
      slug: finalSlug,
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      cover_image: form.cover_image.trim() || null,
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
      is_published: form.is_published,
      published_at: form.is_published ? (editing?.published_at || new Date().toISOString()) : null,
      tags: form.tags || [],
    };
      const wasPublished = editing?.is_published || false;
      const { data: resultData, error } = editing
        ? await dbClient.from("posts").update(payload).eq("id", editing.id).select()
        : await dbClient.from("posts").insert(payload).select();
      setSaving(false);
      
      if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
      else {
        toast({ title: editing ? "Güncellendi" : "Eklendi" });
        setOpen(false);
        load();
        
        if (resultData && resultData.length > 0) {
           // Arka plan optimize işlemi tetikle
           optimizeImagesInBackground(resultData[0].id, finalSlug, payload.cover_image, payload.content);
        }

        // Auto-ping search engines when newly published
        if (form.is_published && !wasPublished) {
          pingSearchEngines(finalSlug);
          toast({ title: "Arama motorlarına bildirildi", description: "Google, Bing ve IndexNow'a ping gönderildi." });
        }
      }
  };

  const manualPing = async (slug: string) => {
    toast({ title: "Bildiriliyor..." });
    await pingSearchEngines(slug);
    toast({ title: "Bildirildi", description: "Sitemap + IndexNow ping gönderildi." });
  };

  const remove = async (id: string) => {
    // if (!window.confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    const { error } = await dbClient.from("posts").delete().eq("id", id);
    if (error) {
       toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
       toast({ title: "Silindi" });
       load();
    }
  };

  const generate30Blogs = async () => {
    setGeneratingBlogs(true);
    setBlogProgress("Akıllı Planlama Yapılıyor...");
    setBlogLogStr("");
    cancelBlogGen.current = false;

    try {
      const { data: products, error: prodError } = await dbClient
        .from("products")
        .select("id, title, brand, sku, price, category, slug")
        .limit(100);

      if (prodError) throw prodError;
      if (!products || products.length === 0) {
        throw new Error("Sistemde konu oluşturulabilecek hiçbir ürün bulunamadı. Lütfen önce ürünleri senkronize edin.");
      }

      toast({
        title: "Otonom Blog Yazarı Başlatıldı",
        description: "Ürünlerinizle uyumlu 30 adet ileri SEO uyumlu blog yazısı taslağı üretiliyor..."
      });

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < 30; i++) {
        if (cancelBlogGen.current) {
          setBlogLogStr(prev => `[Durduruldu] Blog üretim işlemi kullanıcı tarafından durduruldu.\n` + prev);
          toast({ title: "İşlem Durduruldu", description: "Otonom blog yazımı yarıda kesildi." });
          break;
        }

        setBlogProgress(`${i + 1} / 30`);
        const product = products[i % products.length];

        try {
          const prompt = `You are a world-class automotive, motorcycle, and ATV spare parts SEO expert and marketing strategist in Turkey.
Your goal is to write a highly educational, customer-pulling, advanced-SEO blog draft post in Turkish that is tightly integrated with the following catalog product:

Product Name: "${product.title}"
Brand: "${product.brand || "Motosiklet"}"
Sku / Stock Code: "${product.sku || ""}"
Price: "${product.price || ""}"
Category: "${product.category || "yedek-parca"}"
Slug: "${product.slug}"

You MUST naturally link to this product. The site URL format for the product is: "/yedek-parca/${product.slug}". Use the anchor text like "Orijinal ${product.brand} ${product.title}" or "Orijinal ${product.brand} yedek parça satışı".

[OUTPUT INSTRUCTION]
Generate a complete, valid JSON object containing exactly the fields listed below. Do NOT write any explanatory text, markdown formatting, or HTML tags outside of the JSON fields. Just output the raw JSON string.

[JSON SCHEMA]
{
  "title": "A highly catchy, rich SEO friendly turkish title including search terms",
  "excerpt": "A professional article summary (150-240 characters) that is perfectly suited as meta description or search snippet.",
  "content": "HTML structure formatted text (using only <h2>, <p>, <ul>, <li>, <strong>) of at least 450 words in Turkish. Include an introduction about common motorcycle problems, educational symptoms, maintenance tips, and a natural call-to-action (CTA) with a link to get the original replacement part referencing '/yedek-parca/${product.slug}' with genuine price/stock incentive.",
  "meta_title": "SEO Meta Title (under 60 chars)",
  "meta_description": "SEO Meta Description (under 160 chars)",
  "image_prompt": "Cinematic high-quality photograph of ${product.brand} ${product.title} spare part, extreme detail, motorcycle service banner, shallow depth of field, 8k resolution, photorealistic"
}
`;

          const aiRes = await fetch("/api/ai/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, isJson: true })
          });

          if (!aiRes.ok) throw new Error(`AI generation failed: HTTP ${aiRes.status}`);
          const aiJson = await aiRes.json();
          let blogData: any = {};
          
          try {
            let rawText = (aiJson.text || "").trim();
            if (rawText.startsWith("```json")) {
              rawText = rawText.replace(/^```json/, "").replace(/```$/, "").trim();
            } else if (rawText.startsWith("```")) {
              rawText = rawText.replace(/^```/, "").replace(/```$/, "").trim();
            }
            blogData = JSON.parse(rawText);
          } catch (e) {
            console.warn("Raw parse failed, trying direct text extract...", e);
            throw new Error("Yapay zeka geçerli bir JSON yanıt şeması üretemedi.");
          }

          if (!blogData.title || !blogData.content) {
            throw new Error("Yapay zeka çıktısında başlık veya içerik eksik.");
          }

          let coverUrl = "";
          try {
            const imgPrompt = blogData.image_prompt || `${product.brand} ${product.title} spare part motorcycle`;
            const imgRes = await fetch("/api/ai/generate-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt: imgPrompt })
            });
            if (imgRes.ok) {
              const imgData = await imgRes.json();
              coverUrl = imgData.image || "";
            }
          } catch (imgErr) {
            console.error("Cover image generation failed", imgErr);
          }

          const slug = `${slugify(blogData.title)}-${Math.floor(Math.random() * 10000)}`;

          const { error: insertError } = await dbClient.from("posts").insert({
            title: blogData.title.trim(),
            slug,
            excerpt: blogData.excerpt ? blogData.excerpt.trim() : "",
            content: blogData.content,
            cover_image: coverUrl || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
            meta_title: blogData.meta_title ? blogData.meta_title.trim() : blogData.title.trim(),
            meta_description: blogData.meta_description ? blogData.meta_description.trim() : "",
            is_published: false,
            tags: [product.brand || "Motosiklet", "Bakım", "Yedek Parça"]
          });

          if (insertError) throw insertError;

          successCount++;
          setBlogLogStr(prev => `[ÜRETİLDİ] Yazı #${successCount}: "${blogData.title}" - İlişkili Ürün: "${product.title}" [Draft Kaydedildi]\n` + prev);
        } catch (itemErr: any) {
          errorCount++;
          setBlogLogStr(prev => `[HATA] Yazı #${i + 1} üretilemedi: ${itemErr.message}\n` + prev);
        }

        await new Promise(resolve => setTimeout(resolve, 4500));
      }

      toast({
        title: "Blog Üretimi Tamamlandı",
        description: `${successCount} blog yazısı taslağı başarıyla oluşturuldu, ${errorCount} hata oluştu.`
      });
      load();
    } catch (err: any) {
      toast({ title: "Blog Üretim Hatası", description: err.message, variant: "destructive" });
    } finally {
      setGeneratingBlogs(false);
    }
  };

  const uploadCover = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/") && !file.name.endsWith(".svg")) return;

    setUploading(true);
    try {
      const webpBlob = await convertToWebP(file);
      const webpName = getWebPFileName(file.name);
      const path = `blog/${Date.now()}-${webpName}`;

      const { error } = await dbClient.storage.from("product-images").upload(path, webpBlob, {
        contentType: "image/webp",
      });

      if (error) throw error;

      const { data: pub } = dbClient.storage.from("product-images").getPublicUrl(path);
      setForm((prev) => ({ ...prev, cover_image: pub.publicUrl }));
      toast({ title: "Görsel yüklendi (WebP)" });
    } catch (err: any) {
      toast({ title: "Yükleme hatası", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Blog Yazıları</h1>
            <p className="text-sm text-muted-foreground">Manuel veya AI ile yazı oluşturun</p>
          </div>
          <div className="flex items-center gap-3">
             {uniqueTags.length > 0 && (
               <select
                 value={selectedTag}
                 onChange={(e) => setSelectedTag(e.target.value)}
                 className="bg-muted text-foreground border border-border px-3 py-2 rounded-lg text-sm"
               >
                 <option value="">Tümü</option>
                 {uniqueTags.map(t => (
                   <option key={t} value={t}>{t}</option>
                 ))}
               </select>
             )}
            {generatingBlogs ? (
              <button
                type="button"
                onClick={() => { cancelBlogGen.current = true; }}
                className="mr-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/25 hover:bg-red-500/35 text-red-200 text-sm font-medium transition-all"
              >
                Durdur
              </button>
            ) : (
              <button
                type="button"
                onClick={generate30Blogs}
                className="mr-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all cursor-pointer"
              >
                <Radar className="w-4 h-4" /> 30 SEO Blog Yazısı Üret
              </button>
            )}
            <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
              <Plus className="w-4 h-4" /> Yeni Yazı
            </button>
          </div>
        </div>

        {/* AI Blog Generation Progress Card */}
        {generatingBlogs && (
          <div className="glass-card rounded-xl p-5 mb-6 space-y-4 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span className="text-sm font-bold text-foreground font-sans">Otonom SEO Blog Yazarı Çalışıyor</span>
              </div>
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded">
                İlerleme: {blogProgress}
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground font-medium font-sans">
              Her bir blog yazısı, sitemizdeki gerçek motor parçalarıyla zenginleştirilir. Ürünün markası, stok kodları, canlı fiyatları kullanılarak doğal çağrı (CTA) bağlantıları kurulur ve özel kapak görselleri üretilir.
            </p>
            
            {blogLogStr && (
              <div className="font-mono text-[11px] bg-slate-950/90 text-slate-300 rounded-lg p-3 max-h-44 overflow-y-auto divide-y divide-slate-800 border border-slate-800">
                {blogLogStr.split("\n").filter(Boolean).map((line, idx) => (
                  <div key={idx} className={`py-1.5 ${line.includes("[ÜRETİLDİ]") ? "text-emerald-400" : line.includes("[HATA]") ? "text-red-400" : "text-yellow-400"}`}>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {!generatingBlogs && blogLogStr && (
          <div className="glass-card rounded-xl p-5 mb-6 space-y-3">
            <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 font-sans">
              <Check className="w-4 h-4" /> Son Üretim Raporu
            </div>
            <div className="font-mono text-[11px] bg-slate-950/90 text-slate-300 rounded-lg p-3 max-h-44 overflow-y-auto divide-y divide-slate-800 border border-slate-800">
              {blogLogStr.split("\n").filter(Boolean).map((line, idx) => (
                <div key={idx} className="py-1.5 text-slate-300">{line}</div>
              ))}
            </div>
          </div>
        )}



        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : filteredItems.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Gösterilecek yazı bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((p) => (
              <div key={p.id} className="glass-card rounded-xl p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">{p.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${p.is_published ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                      {p.is_published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{p.excerpt || p.slug}</p>
                  {p.tags && p.tags.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {p.tags.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-secondary/10 text-secondary-foreground rounded">#{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                {p.is_published && (
                  <>
                    <button
                      onClick={() => manualPing(p.slug)}
                      title="Arama motorlarına bildir (sitemap + IndexNow)"
                      className="p-2 rounded hover:bg-secondary/10 text-muted-foreground hover:text-secondary"
                    >
                      <Radar className="w-4 h-4" />
                    </button>
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 rounded hover:bg-muted text-muted-foreground"><Eye className="w-4 h-4" /></a>
                  </>
                )}
                <button onClick={() => openEdit(p)} className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => remove(p.id)} className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl text-foreground">{editing ? "Yazıyı Düzenle" : "Yeni Yazı"}</h2>
              <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="text-xs text-muted-foreground">Başlık *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Özet</label>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">İçerik (HTML)</label>
                <textarea rows={10} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm font-mono text-xs" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Kapak Görseli URL</label>
                <div className="mt-1 flex gap-2">
                  <input value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} placeholder="https://..." className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 disabled:opacity-50 inline-flex items-center gap-1"
                  >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Yükle
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => uploadCover(e.target.files)} />
                </div>
                {form.cover_image && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-border bg-muted/40">
                    <img
                      src={form.cover_image}
                      alt="Kapak önizleme"
                      className="w-full max-h-48 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Etiketler (Virgülle ayırın)</label>
                  <input value={form.tags?.join(", ")} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map(t => t.trim()).filter(t => t) })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" placeholder="Motosiklet, Bakım, Enduro" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">SEO Başlık</label>
                  <input value={form.meta_title} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">SEO Açıklama</label>
                  <textarea rows={2} value={form.meta_description} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
                Yayınla
              </label>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-lg bg-muted text-foreground text-sm font-medium">İptal</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminPosts;
