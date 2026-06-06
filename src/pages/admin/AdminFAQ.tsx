import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit2, Loader2, HelpCircle, X } from "lucide-react";
import type { Tables } from "@/lib/db-types";

type FAQ = Tables<"faqs">;

const CATEGORIES = ["Genel", "Motosiklet Satışı", "Servis Hizmetleri", "Yedek Parça"];

const AdminFAQ = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", category: "Genel", is_active: true, sort_order: 0 });

  const load = async () => {
    setLoading(true);
    const { data } = await dbClient.from("faqs").select("*").order("sort_order").order("created_at", { ascending: false });
    
    let finalFaqs = data || [];
    
    if (finalFaqs.length === 0) {
      const defaults = [
        { question: "Motosiklet periyodik bakımı ne zaman yapılmalıdır?", answer: "Eğer motosikletiniz garanti kapsamındaysa servis kitapçığında belirtilen kilometre veya zaman aralıklarında (genelde her 5.000 - 6.000 km'de bir veya yılda 1 kez) yapılması gerekir. Kapasite ve segmente göre değişiklik gösterebilir.", category: "Servis Hizmetleri", is_active: true, sort_order: 1 },
        { question: "Sipariş ettiğim yedek parça ne zaman elime ulaşır?", answer: "Stoklarımızda bulunan parçalar ortalama 1-3 iş günü içerisinde kargoya teslim edilmekte olup, bulunmayan özel siparişler marka ve yurtdışı tedarik durumuna göre 15-45 gün arasında gelebilir.", category: "Yedek Parça", is_active: true, sort_order: 2 },
        { question: "Takas desteğiniz var mı?", answer: "Evet, belirli şartlara uyan marka ve modeldeki ikinci el motosikletlerinizi ekspertiz sonucu takas değerlendirmesinde kullanabiliyoruz.", category: "Motosiklet Satışı", is_active: true, sort_order: 3 },
        { question: "Garanti süresi devam eden motosikletimi dışarıda bakıma götürürsem garantiden çıkar mı?", answer: "Evet. Genellikle üreticiler, periyodik bakımların, arıza tespitinin ve müdahalenin sadece yetkili servislerde yapılmasını şart koşar.", category: "Genel", is_active: true, sort_order: 4 },
        { question: "Servis randevusunu nasıl alabilirim?", answer: "İnternet sitemizdeki İletişim sayfasından formu doldurarak veya doğrudan müşteri hizmetlerimizi arayarak (0212 123 45 67) servis randevusu oluşturabilirsiniz.", category: "Servis Hizmetleri", is_active: true, sort_order: 5 },
        { question: "Orijinal ve yan sanayi yedek parça arasındaki fark nedir?", answer: "Orijinal parçalar üretici firmanın garanti kapsamındadır ve motosikletinizin ömrünü uzatır. Yan sanayi parçalar daha uygun maliyetli olsa da, kalite standartları orijinali kadar yüksek olmayabilir. Paşa Motor olarak motosiklet sağlığı için her zaman orijinal parça kullanımını öneriyoruz.", category: "Yedek Parça", is_active: true, sort_order: 6 }
      ];
      
      const { data: inserted } = await dbClient.from("faqs").insert(defaults).select();
      if (inserted) {
        finalFaqs = inserted;
      }
    }
    
    setItems(finalFaqs);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ question: "", answer: "", category: "Genel", is_active: true, sort_order: 0 }); setOpen(true); };
  const openEdit = (f: FAQ) => {
    setEditing(f);
    setForm({ question: f.question, answer: f.answer, category: f.category || "Genel", is_active: f.is_active, sort_order: f.sort_order });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      question: form.question.trim(), answer: form.answer.trim(),
      category: form.category, is_active: form.is_active, sort_order: Number(form.sort_order) || 0,
    };
    const { error } = editing
      ? await dbClient.from("faqs").update(payload).eq("id", editing.id)
      : await dbClient.from("faqs").insert(payload);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Kaydedildi" }); setOpen(false); load(); }
  };

  const remove = async (id: string) => {
    // if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
    await dbClient.from("faqs").delete().eq("id", id);
    load();
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Sıkça Sorulan Sorular</h1>
            <p className="text-sm text-muted-foreground">SSS yönetimi</p>
          </div>
          <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
            <Plus className="w-4 h-4" /> Yeni Soru
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center max-w-xl mx-auto border border-dashed border-border/80 my-8">
            <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="font-heading font-semibold text-lg text-foreground mb-2">Sorular Veritabanı Henüz Boş</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
              Veritabanınızda henüz sıkça sorulan sorular bulunmuyor. Aşağıdaki butona tıklayarak sistemdeki hazır örnek 6 adet Soru ve Cevabı anında veritabanınıza yükleyip yayına alabilirsiniz.
            </p>
            <button
              onClick={async () => {
                setLoading(true);
                const defaults = [
                  { question: "Motosiklet periyodik bakımı ne zaman yapılmalıdır?", answer: "Eğer motosikletiniz garanti kapsamındaysa servis kitapçığında belirtilen kilometre veya zaman aralıklarında (genelde her 5.000 - 6.000 km'de bir veya yılda 1 kez) yapılması gerekir. Kapasite ve segmente göre değişiklik gösterebilir.", category: "Servis Hizmetleri", is_active: true, sort_order: 1 },
                  { question: "Sipariş ettiğim yedek parça ne zaman elime ulaşır?", answer: "Stoklarımızda bulunan parçalar ortalama 1-3 iş günü içerisinde kargoya teslim edilmekte olup, bulunmayan özel siparişler marka ve yurtdışı tedarik durumuna göre 15-45 gün arasında gelebilir.", category: "Yedek Parça", is_active: true, sort_order: 2 },
                  { question: "Takas desteğiniz var mı?", answer: "Evet, belirli şartlara uyan marka ve modeldeki ikinci el motosikletlerinizi ekspertiz sonucu takas değerlendirmesinde kullanabiliyoruz.", category: "Motosiklet Satışı", is_active: true, sort_order: 3 },
                  { question: "Garanti süresi devam eden motosikletimi dışarıda bakıma götürürsem garantiden çıkar mı?", answer: "Evet. Genellikle üreticiler, periyodik bakımların, arıza tespitinin ve müdahalenin sadece yetkili servislerde yapılmasını şart koşar.", category: "Genel", is_active: true, sort_order: 4 },
                  { question: "Servis randevusunu nasıl alabilirim?", answer: "İnternet sitemizdeki İletişim sayfasından formu doldurarak veya doğrudan müşteri hizmetlerimizi arayarak (0212 123 45 67) servis randevusu oluşturabilirsiniz.", category: "Servis Hizmetleri", is_active: true, sort_order: 5 },
                  { question: "Orijinal ve yan sanayi yedek parça arasındaki fark nedir?", answer: "Orijinal parçalar üretici firmanın garanti kapsamındadır ve motosikletinizin ömrünü uzatır. Yan sanayi parçalar daha uygun maliyetli olsa da, kalite standartları orijinali kadar yüksek olmayabilir. Paşa Motor olarak motosiklet sağlığı için her zaman orijinal parça kullanımını öneriyoruz.", category: "Yedek Parça", is_active: true, sort_order: 6 }
                ];
                const { error } = await dbClient.from("faqs").insert(defaults);
                if (error) {
                  toast({ title: "Hata", description: error.message, variant: "destructive" });
                } else {
                  toast({ title: "Örnek Sorular Yüklendi", description: "Soru veritabanı başarıyla dolduruldu." });
                }
                load();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground text-sm font-semibold transition cursor-pointer"
            >
              Örnek SSS Verilerini Yükle
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((f) => (
              <div key={f.id} className="glass-card rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground mb-1">{f.question}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{f.answer}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{f.category}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Sıra: {f.sort_order}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${f.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                        {f.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button onClick={() => openEdit(f)} className="p-2 rounded hover:bg-muted text-muted-foreground"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => remove(f.id)} className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl text-foreground">{editing ? "SSS Düzenle" : "Yeni SSS"}</h2>
              <button onClick={() => setOpen(false)} className="p-1"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Soru *</label>
                <input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Cevap *</label>
                <textarea required rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Kategori</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm">
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Sıralama (Küçükten Büyüğe)</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-foreground mt-4">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Aktif
              </label>
              <button type="submit" className="w-full py-2.5 mt-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Kaydet</button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFAQ;
