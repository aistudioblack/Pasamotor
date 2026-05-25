import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { dbClient } from "@/lib/firebase-client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Loader2, Image as ImageIcon, X, Upload } from "lucide-react";
import type { Tables } from "@/lib/firebase-types";
import { useRef } from "react";
import { convertToWebP, getWebPFileName } from "@/lib/imageOptimization";

type Img = Tables<"gallery_images">;

const AdminGallery = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", category: "showroom" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await dbClient.from("gallery_images").select("*").order("sort_order").order("created_at", { ascending: false });
    let itemsToSet = data || [];

    if (itemsToSet.length === 0) {
      // Insert default items to seed the db if empty
      const defaultItems = [
        { title: "Showroom", category: "showroom", url: "https://ais-dev-lbzfc4nkccrcfwx5lzh3dq-312076941169.europe-west1.run.app/assets/hero-bg-BL2E1x-4.webp" },
        { title: "Servis Atölyesi", category: "servis", url: "https://ais-dev-lbzfc4nkccrcfwx5lzh3dq-312076941169.europe-west1.run.app/assets/service-DFP84Zl-.webp" }
      ];
      
      const { data: inserted } = await dbClient.from("gallery_images").insert(defaultItems).select();
      if (inserted) {
        itemsToSet = inserted;
      }
    }

    setItems(itemsToSet);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await dbClient.from("gallery_images").insert({
      title: form.title.trim(),
      url: form.url.trim(),
      category: form.category,
    });
    setSaving(false);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Eklendi" }); setForm({ title: "", url: "", category: "showroom" }); setOpen(false); load(); }
  };

  const remove = async (id: string) => {
    // if (!window.confirm("Görseli silmek istediğinize emin misiniz?")) return;
    await dbClient.from("gallery_images").delete().eq("id", id);
    load();
  };

  const [uploadStatusText, setUploadStatusText] = useState("");

  const uploadFile = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/") && !file.name.endsWith(".svg")) return;

    setUploading(true);
    setUploadStatusText("WebP formatına dönüştürülüyor...");
    try {
      const webpBlob = await convertToWebP(file);
      const webpName = getWebPFileName(file.name);
      const path = `gallery/${Date.now()}-${webpName}`;

      setUploadStatusText("Yükleniyor...");
      const { error } = await dbClient.storage.from("product-images").upload(path, webpBlob, {
        contentType: "image/webp",
      });

      if (error) throw error;

      const { data: pub } = dbClient.storage.from("product-images").getPublicUrl(path);
      setForm((prev) => ({ ...prev, url: pub.publicUrl }));
      if (!form.title) {
        setForm(prev => ({ ...prev, title: file.name.split('.')[0] }));
      }
      toast({ title: "Görsel yüklendi (WebP)" });
    } catch (err: any) {
      toast({ title: "Yükleme hatası", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      setUploadStatusText("");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Galeri</h1>
            <p className="text-sm text-muted-foreground">Showroom ve servis fotoğrafları</p>
          </div>
          <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            <Plus className="w-4 h-4" /> Görsel Ekle
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Henüz görsel yok.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((img) => (
              <div key={img.id} className="glass-card rounded-xl overflow-hidden group relative">
                <img src={img.url} alt={img.title} className="w-full h-40 object-cover" />
                <div className="p-3">
                  <p className="text-sm text-foreground truncate">{img.title}</p>
                  <p className="text-xs text-muted-foreground">{img.category}</p>
                </div>
                <button onClick={() => remove(img.id)} className="absolute top-2 right-2 p-2 rounded-full bg-destructive/80 text-destructive-foreground opacity-0 group-hover:opacity-100 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl text-foreground">Görsel Ekle</h2>
              <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Başlık *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Görsel URL *</label>
                <div className="mt-1 flex gap-2">
                  <input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90 disabled:opacity-50 inline-flex items-center gap-1 min-w-[max-content]"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="hidden sm:inline">{uploadStatusText}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" /> Yükle
                      </>
                    )}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => uploadFile(e.target.files)} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Kategori</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm">
                  <option value="showroom">Showroom</option>
                  <option value="servis">Servis</option>
                  <option value="motosiklet">Motosiklet</option>
                  <option value="etkinlik">Etkinlik</option>
                </select>
              </div>
              <button type="submit" disabled={saving} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminGallery;
