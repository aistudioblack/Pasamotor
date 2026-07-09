import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit2, Trash2, X } from "lucide-react";
import { secureStorage } from '../../lib/secure-storage';

interface Brand {
  id: string; // generate unique id for client side
  name: string;
  desc: string;
}

const AdminBrands = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [recordId, setRecordId] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form, setForm] = useState({ name: "", desc: "" });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    setLoading(true);
    let currentId = recordId;
    const { data, error } = await dbClient.from("site_content").select("*").eq("page_key", "brands").maybeSingle();
    let finalBrands: Brand[] = [];
    if (data) {
      currentId = data.id;
      setRecordId(data.id);
      const parsed = Array.isArray(data.sections) ? data.sections as any : [];
      finalBrands = parsed.map((p: any) => ({
        id: p.id || Math.random().toString(36).substring(7),
        name: p.name || "",
        desc: p.desc || ""
      }));
    } else if (error && error.code !== 'PGRST116') {
       toast({ title: "Veri yüklenemedi", description: error.message, variant: "destructive" });
    }

    if (finalBrands.length === 0 || secureStorage.getItem("mig_brands_1") !== "true") {
       finalBrands = [
          { id: "brand_kuba", name: "Kuba", desc: "Türkiye'nin lider motosiklet markalarından biri" },
          { id: "brand_mondial", name: "Mondial", desc: "Yaygın servis ağı ve uygun fiyatlı modeller" },
          { id: "brand_rks", name: "RKS", desc: "Performans ve şık tasarımlı motosikletler" },
          { id: "brand_tvs", name: "TVS", desc: "Hindistan'ın lider motosiklet üreticisi" },
          { id: "brand_hero", name: "Hero", desc: "Dünyanın en büyük iki tekerlekli araç üreticisi" },
          { id: "brand_falcon", name: "Falcon", desc: "Güvenilir ve ekonomik motosikletler" },
          { id: "brand_isildar", name: "Işıldar", desc: "Kaliteli Türk motosiklet markası" },
          { id: "brand_vox", name: "Vox", desc: "Güvenlik, konfor ve şık tasarımı bir arada sunan seçkin motosiklet ve aksesuar markası" },
          { id: "brand_rapidox", name: "RapidoX", desc: "Orijinal ve yüksek kaliteli yedek parçalar sunan lider marka" },
          { id: "brand_honda", name: "Honda", desc: "Dünyaca ünlü yüksek kaliteli Japon motosiklet üreticisi" },
          { id: "brand_bajaj", name: "Bajaj", desc: "Dayanıklı ve ekonomik Hintli motosiklet üreticisi" },
          { id: "brand_yamaha", name: "Yamaha", desc: "Yüksek performanslı efsanevi Japon motosiklet markası" }
       ];
       if (currentId) {
         await dbClient.from("site_content").update({ sections: finalBrands, title: "Brands" }).eq("id", currentId);
       } else {
         const { data: inserted } = await dbClient.from("site_content").insert({
           page_key: "brands",
           title: "Brands",
           sections: finalBrands
         }).select().single();
         if (inserted) setRecordId(inserted.id);
       }
       secureStorage.setItem("mig_brands_1", "true");
    }
    setBrands(finalBrands);
    setLoading(false);
  };

  const handleSaveAll = async (newBrands: Brand[]) => {
    setSaving(true);
    try {
      if (recordId) {
        await dbClient.from("site_content").update({ sections: newBrands, title: "Brands" }).eq("id", recordId);
      } else {
        const { data: inserted } = await dbClient.from("site_content").insert({
          page_key: "brands",
          title: "Brands",
          sections: newBrands
        }).select().single();
        if (inserted) setRecordId(inserted.id);
      }
      setBrands(newBrands);
      toast({ title: "Kaydedildi" });
    } catch (e: any) {
      toast({ title: "Hata", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const openNew = () => { setEditing(null); setForm({ name: "", desc: "" }); setOpen(true); };
  const openEdit = (b: Brand) => { setEditing(b); setForm({ name: b.name, desc: b.desc }); setOpen(true); };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    let newBrands = [...brands];
    if (editing) {
      newBrands = newBrands.map(b => b.id === editing.id ? { ...b, name: form.name, desc: form.desc } : b);
    } else {
      newBrands.push({ id: Math.random().toString(36).substring(7), name: form.name, desc: form.desc });
    }
    await handleSaveAll(newBrands);
    setOpen(false);
  };

  const remove = async (id: string) => {
    // if (!window.confirm("Bu markayı silmek istediğinize emin misiniz?")) return;
    const newBrands = brands.filter(b => b.id !== id);
    await handleSaveAll(newBrands);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Markalar</h1>
          <p className="text-sm text-muted-foreground">Ana sayfada listelenen markaları yönetin.</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5" />
          Yeni Ekle
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map(b => (
            <div key={b.id} className="glass-card rounded-xl p-5 relative group">
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => openEdit(b)} className="p-1.5 bg-muted/80 backdrop-blur rounded hover:bg-muted text-foreground"><Edit2 className="w-4 h-4" /></button>
                 <button onClick={() => remove(b.id)} className="p-1.5 bg-destructive/10 backdrop-blur rounded text-destructive hover:bg-destructive text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-muted flex items-center justify-center">
                 <span className="font-heading font-bold text-xl">{b.name}</span>
              </div>
              <h3 className="font-heading font-semibold text-center mb-1">{b.name}</h3>
              <p className="text-sm text-muted-foreground text-center line-clamp-2">{b.desc}</p>
            </div>
          ))}
          {brands.length === 0 && <p className="text-muted-foreground col-span-full">Henüz marka eklenmemiş.</p>}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
               <h2 className="font-heading font-bold text-xl">{editing ? 'Düzenle' : 'Yeni Marka'}</h2>
               <button onClick={() => setOpen(false)}><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="text-sm">Marka Adı</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm" />
              </div>
              <div>
                <label className="text-sm">Açıklama</label>
                <textarea required rows={3} value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm resize-none" />
              </div>
              <button disabled={saving} type="submit" className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium flex justify-center items-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin"/>}
                Kaydet
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBrands;
