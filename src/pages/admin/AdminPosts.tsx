import { adminFetch } from "@/lib/api-client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit2, Trash2, X, Loader2, FileText, Eye, AlertTriangle, RefreshCw, Upload, Radar, Bot } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables } from "@/lib/db-types";
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
  meta_title: "", meta_description: "", is_published: false
};

const AdminPosts = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft" | "auto">("all");

  const filteredItems = items.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.slug || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());

    const isAuto = (p as any).is_auto_generated;
    
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "published") return matchesSearch && p.is_published && !isAuto;
    if (statusFilter === "draft") return matchesSearch && !p.is_published && !isAuto;
    if (statusFilter === "auto") return matchesSearch && isAuto;
    return matchesSearch;
  });

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
    const cleanStr = (val: any) => {
      if (val === undefined || val === null) return "";
      const s = String(val).trim();
      if (s.toLowerCase() === "undefined" || s.toLowerCase() === "null") return "";
      return s;
    };
    setForm({
      title: cleanStr(p.title),
      slug: cleanStr(p.slug),
      excerpt: cleanStr(p.excerpt),
      content: cleanStr(p.content),
      cover_image: cleanStr(p.cover_image),
      meta_title: cleanStr(p.meta_title),
      meta_description: cleanStr(p.meta_description),
      is_published: p.is_published
    });
    setOpen(true);
  };

  const pingSearchEngines = async (slug: string) => {
    try {
      await adminFetch("/api/seo/notify-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: [`/blog/${slug}`] })
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

          // Convert Blob to Base64 to bypass client-side storage policies and RLS issues
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(webpBlob);
          });
          const base64String = await base64Promise;

          const response = await adminFetch("/api/upload-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              file: base64String,
              fileName: path,
              bucket: "product-images",
            }),
          });

          const result = await response.json();
          if (!response.ok || !result.success) return null;

          return result.publicUrl;
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
        const imgRegex = /<img[^ loading="lazy" decoding="async">]+src="([^">]+)"/g;
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

    const finalCoverImage = form.cover_image.trim();

    const cleanText = (txt: string) => txt 
      ? txt.replace(/—/g, "-")
           .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
           .replace(/\*/g, "")
           .replace(/“/g, '"')
           .replace(/”/g, '"')
           .replace(/’/g, "'")
           .replace(/‘/g, "'")
      : "";

    const payload: any = {
      title: cleanText(form.title.trim()),
      slug: finalSlug,
      excerpt: cleanText(form.excerpt.trim()) || null,
      content: cleanText(form.content.trim()) || null,
      cover_image: finalCoverImage || null,
      meta_title: cleanText(form.meta_title.trim()) || null,
      meta_description: cleanText(form.meta_description.trim()) || null,
      is_published: form.is_published,
      published_at: form.is_published ? (editing?.published_at || new Date().toISOString()) : null,
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

  const uploadCover = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/") && !file.name.endsWith(".svg")) return;

    setUploading(true);
    try {
      const webpBlob = await convertToWebP(file);
      const webpName = getWebPFileName(file.name);
      const path = `blog/${Date.now()}-${webpName}`;

      // Convert Blob to Base64 to bypass client-side storage policies and RLS issues
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (e) => reject(e);
        reader.readAsDataURL(webpBlob);
      });
      const base64String = await base64Promise;

      const response = await adminFetch("/api/upload-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: base64String,
          fileName: path,
          bucket: "product-images",
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Sunucu yükleme hatası");
      }

      setForm((prev) => ({ ...prev, cover_image: result.publicUrl }));
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
            <p className="text-sm text-muted-foreground">Manuel blog yazısı oluşturun ve yönetin</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
              <Plus className="w-4 h-4" /> Yeni Yazı
            </button>
          </div>
        </div>

        {/* Filtre ve Arama Alanı */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 bg-card/40 border border-border/50 p-4 rounded-xl backdrop-blur-sm">
          <div className="sm:col-span-2 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Yazı başlığı, slug veya özet içinde ara..."
              className="w-full pl-3 pr-10 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
            >
              <option value="all">Tüm Yazılar</option>
              <option value="published">Yayındakiler</option>
              <option value="draft">Taslaklar</option>
              <option value="auto">Yapay Zeka (Onay Bekleyenler)</option>
            </select>
          </div>
        </div>



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
                    <span className={`text-xs px-2 py-0.5 rounded shrink-0 ${(p as any).is_auto_generated ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" : p.is_published ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                      {(p as any).is_auto_generated ? "🤖 Otomatik — Onay Bekliyor" : p.is_published ? "Yayında" : "Taslak"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-muted-foreground truncate">{p.excerpt || p.slug}</p>
                    {p.created_at && <p className="text-[10px] text-muted-foreground/70">Tarih: {new Date(p.created_at).toLocaleString('tr-TR')}</p>}
                  </div>
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
                <label className="text-xs text-muted-foreground flex justify-between items-center">
                  <span>Kapak Görseli URL</span>
                </label>
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
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3">
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
