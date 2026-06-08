import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Edit2, Trash2, X } from "lucide-react";
import DynamicIcon from "@/components/ui/DynamicIcon";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  link: string;
}

const AdminServices = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [recordId, setRecordId] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ title: "", description: "", iconName: "Wrench", link: "/hizmetler" });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    setLoading(true);
    let currentId = recordId;
    const { data, error } = await dbClient.from("site_content").select("*").eq("page_key", "services").maybeSingle();
    let finalServices: Service[] = [];
    if (data) {
      currentId = data.id;
      setRecordId(data.id);
      const parsed = Array.isArray(data.sections) ? data.sections as any : [];
      finalServices = parsed.map((p: any) => ({
        id: p.id || Math.random().toString(36).substring(7),
        title: p.title || "",
        description: p.description || "",
        iconName: p.iconName || "Wrench",
        link: p.link || "/hizmetler"
      }));
    } else if (error && error.code !== 'PGRST116') {
       toast({ title: "Veri yüklenemedi", description: error.message, variant: "destructive" });
    }

    if (finalServices.length === 0 || localStorage.getItem("mig_services_1") !== "true") {
       finalServices = [
          { id: "srv_sat", title: "Motosiklet Satışı", description: "TVS, Hero, Falcon ve Işıldar markalarının en güncel modellerini showroom'umuzda inceleyebilirsiniz. Kredi ve taksit seçenekleri mevcuttur.", iconName: "ShoppingBag", link: "/hizmetler" },
          { id: "srv_mot", title: "Motor Servisi", description: "Periyodik bakım, motor revizyon, debriyaj, şanzıman ve genel mekanik onarım hizmetleri sunuyoruz.", iconName: "Wrench", link: "/hizmetler" },
          { id: "srv_ele", title: "Elektrik & Elektronik", description: "Aküden aydınlatmaya, CDI'den beyin arızalarına kadar tüm elektrik sorunlarını çözüyoruz.", iconName: "Zap", link: "/hizmetler" },
          { id: "srv_par", title: "Yedek Parça Satışı", description: "Orijinal ve muadil yedek parçalar geniş stoğumuzda. Bulunmayan parçalar kısa sürede temin edilir.", iconName: "Package", link: "/hizmetler" },
          { id: "srv_bak", title: "Bakım & Onarım", description: "Yağ değişimi, filtre, balata, zincir-dişli seti ve lastik değişimi gibi rutin bakım hizmetleri.", iconName: "Settings", link: "/hizmetler" },
          { id: "srv_gar", title: "Garanti Kapsamı", description: "Yetkili servis bayi olarak tüm satış ve servis işlemlerimiz garanti kapsamında gerçekleştirilir.", iconName: "Shield", link: "/hizmetler" }
       ];
       if (currentId) {
         await dbClient.from("site_content").update({ sections: finalServices, title: "Services" }).eq("id", currentId);
       } else {
         const { data: inserted } = await dbClient.from("site_content").insert({
           page_key: "services",
           title: "Services",
           sections: finalServices
         }).select().single();
         if (inserted) setRecordId(inserted.id);
       }
       localStorage.setItem("mig_services_1", "true");
    }
    setServices(finalServices);
    setLoading(false);
  };

  const handleSaveAll = async (newServices: Service[]) => {
    setSaving(true);
    try {
      if (recordId) {
        await dbClient.from("site_content").update({ sections: newServices, title: "Services" }).eq("id", recordId);
      } else {
        const { data: inserted } = await dbClient.from("site_content").insert({
          page_key: "services",
          title: "Services",
          sections: newServices
        }).select().single();
        if (inserted) setRecordId(inserted.id);
      }
      setServices(newServices);
      toast({ title: "Kaydedildi" });
    } catch (e: any) {
      toast({ title: "Hata", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const openNew = () => { setEditing(null); setForm({ title: "", description: "", iconName: "Wrench", link: "/hizmetler" }); setOpen(true); };
  const openEdit = (s: Service) => { setEditing(s); setForm({ title: s.title, description: s.description, iconName: s.iconName, link: s.link }); setOpen(true); };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    let newServices = [...services];
    if (editing) {
      newServices = newServices.map(s => s.id === editing.id ? { ...s, ...form } : s);
    } else {
      newServices.push({ id: Math.random().toString(36).substring(7), ...form });
    }
    await handleSaveAll(newServices);
    setOpen(false);
  };

  const remove = async (id: string) => {
    // if (!window.confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    const newServices = services.filter(s => s.id !== id);
    await handleSaveAll(newServices);
  };

  // Safe icon render
  const toKebabCase = (str: string) => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase() as keyof typeof dynamicIconImports;
  const renderIcon = (name: string, className?: string) => {
     let kebabName = toKebabCase(name);
     if (!(kebabName in dynamicIconImports)) {
       kebabName = "wrench";
     }
     return <DynamicIcon name={kebabName} className={className} />;
  };

  const availableIcons = ["ShoppingBag", "Wrench", "Package", "Settings", "Activity", "Zap", "Truck", "Shield"];

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl text-foreground">Hizmetler</h1>
          <p className="text-sm text-muted-foreground">Ana sayfada listelenen hizmetleri yönetin.</p>
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
          {services.map(s => (
            <div key={s.id} className="glass-card rounded-xl p-6 relative group">
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => openEdit(s)} className="p-1.5 bg-muted/80 backdrop-blur rounded hover:bg-muted text-foreground"><Edit2 className="w-4 h-4" /></button>
                 <button onClick={() => remove(s.id)} className="p-1.5 bg-destructive/10 backdrop-blur rounded text-destructive hover:bg-destructive text-white transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                 {renderIcon(s.iconName, "w-6 h-6 text-primary")}
              </div>
              <h3 className="font-heading font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{s.description}</p>
              <div className="text-xs text-primary font-medium">Link: {s.link}</div>
            </div>
          ))}
          {services.length === 0 && <p className="text-muted-foreground col-span-full">Henüz hizmet eklenmemiş.</p>}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
               <h2 className="font-heading font-bold text-xl">{editing ? 'Düzenle' : 'Yeni Hizmet'}</h2>
               <button onClick={() => setOpen(false)}><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={submitForm} className="space-y-4">
              <div>
                <label className="text-sm">Hizmet Başlığı</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm" />
              </div>
              <div>
                <label className="text-sm">Açıklama</label>
                <textarea required rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm resize-none" />
              </div>
              <div>
                <label className="text-sm">İkon</label>
                <select value={form.iconName} onChange={e => setForm({...form, iconName: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm">
                   {availableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm">Bağlantı (Link)</label>
                <input required value={form.link} onChange={e => setForm({...form, link: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm" />
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

export default AdminServices;
