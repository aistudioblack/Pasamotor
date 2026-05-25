import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState } from "react";
import { dbClient } from "@/lib/firebase-client";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Mail, Phone, Loader2, MessageSquare, Eye, EyeOff } from "lucide-react";
import type { Tables } from "@/lib/firebase-types";

type Message = Tables<"messages">;

const AdminMessages = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await dbClient.from("messages").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const toggleRead = async (m: Message) => {
    await dbClient.from("messages").update({ is_read: !m.is_read }).eq("id", m.id);
    load();
  };

  const remove = async (id: string) => {
    // if (!window.confirm("Mesajı silmek istediğinize emin misiniz?")) return;
    const { error } = await dbClient.from("messages").delete().eq("id", id);
    if (error) toast({ title: "Hata", description: error.message, variant: "destructive" });
    else { toast({ title: "Silindi" }); setSelected(null); load(); }
  };

  const open = async (m: Message) => {
    setSelected(m);
    if (!m.is_read) {
      await dbClient.from("messages").update({ is_read: true }).eq("id", m.id);
      load();
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-foreground">Mesajlar</h1>
          <p className="text-sm text-muted-foreground">İletişim formundan gelen mesajlar</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Henüz mesaj yok.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((m) => (
              <button
                key={m.id}
                onClick={() => open(m)}
                className={`w-full text-left glass-card rounded-xl p-4 hover:border-primary/50 transition flex items-start gap-3 ${
                  !m.is_read ? "border-l-4 border-l-primary" : ""
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!m.is_read ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`truncate ${!m.is_read ? "font-semibold text-foreground" : "text-foreground"}`}>{m.name}</p>
                    <span className="text-xs text-muted-foreground shrink-0">{new Date(m.created_at).toLocaleDateString("tr-TR")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{m.subject}</p>
                  <p className="text-xs text-muted-foreground/70 truncate mt-1">{m.message}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl text-foreground">{selected.subject}</h2>
              <span className="text-xs text-muted-foreground">{new Date(selected.created_at).toLocaleString("tr-TR")}</span>
            </div>
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2 text-sm">
                <strong className="text-foreground">{selected.name}</strong>
              </div>
              <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                <Phone className="w-4 h-4" /> {selected.phone}
              </a>
              {selected.email && (
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                  <Mail className="w-4 h-4" /> {selected.email}
                </a>
              )}
              <div className="bg-muted rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleRead(selected)} className="flex-1 py-2 rounded-lg bg-muted text-foreground text-sm font-medium inline-flex items-center justify-center gap-2">
                {selected.is_read ? <><EyeOff className="w-4 h-4" /> Okunmadı yap</> : <><Eye className="w-4 h-4" /> Okundu yap</>}
              </button>
              <button onClick={() => remove(selected.id)} className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm font-medium hover:bg-destructive/20 inline-flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMessages;
