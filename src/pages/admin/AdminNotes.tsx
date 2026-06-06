import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState, useCallback } from "react";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Loader2, 
  StickyNote, 
  Search, 
  Pin, 
  Download, 
  Upload, 
  CheckSquare, 
  Square, 
  Tag, 
  Calendar, 
  Save, 
  AlertTriangle,
  RotateCcw,
  Check,
  FolderOpen,
  Eye,
  Settings,
  Grid,
  List,
  Flame,
  Coffee,
  Database,
  Briefcase,
  Wrench,
  ChevronDown,
  PenTool
} from "lucide-react";
import DrawingCanvasModal from "@/components/admin/DrawingCanvasModal";
import { useRef } from "react";

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  color: string;
  is_pinned: boolean;
  checklist: ChecklistItem[];
  diagram?: string; // Base64 png/svg data
  created_at: string;
  updated_at: string;
}

const NOTE_CATEGORIES = [
  { id: "Genel", label: "Genel", color: "text-slate-400 bg-slate-500/10 border-slate-500/20" },
  { id: "Siparişler", label: "📦 Siparişler", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { id: "Müşteriler", label: "👥 Müşteriler", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  { id: "Servis", label: "🔧 Servis & Bakım", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  { id: "SEO & Blog", label: "✍️ SEO & Blog", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { id: "Önemli", label: "🔥 Önemli / Acil", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
];

const NOTE_COLORS = [
  { name: "Slate", value: "slate", borderClass: "border-slate-800 bg-slate-900/40 hover:bg-slate-900/60" },
  { name: "Amber", value: "amber", borderClass: "border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/30" },
  { name: "Blue", value: "blue", borderClass: "border-blue-500/30 bg-blue-950/20 hover:bg-blue-950/30" },
  { name: "Green", value: "green", borderClass: "border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/30" },
  { name: "Purple", value: "purple", borderClass: "border-purple-500/30 bg-purple-950/20 hover:bg-purple-950/30" },
  { name: "Red", value: "red", borderClass: "border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/30" },
];

export default function AdminNotes() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"synced" | "local">("local");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "title">("date_desc");

  // Form State
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteCategory, setNoteCategory] = useState("Genel");
  const [noteColor, setNoteColor] = useState("slate");
  const [noteIsPinned, setNoteIsPinned] = useState(false);
  const [noteChecklist, setNoteChecklist] = useState<ChecklistItem[]>([]);
  const [newChecklistItemText, setNewChecklistItemText] = useState("");
  const [noteDiagram, setNoteDiagram] = useState<string | undefined>(undefined);
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      // Birinci Adım: Supabase'den çekmeyi dene
      const { data, error } = await dbClient
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setNotes(data as Note[]);
        setSyncStatus("synced");
        // Yerel yedeği de güncel tut
        localStorage.setItem("pasamotor_admin_notes", JSON.stringify(data));
      } else {
        throw new Error("Boş veri döndü");
      }
    } catch (e) {
      // Bulut bağlantısı veya tablo yoksa yerel kaydı yükle
      const localDataStr = localStorage.getItem("pasamotor_admin_notes");
      if (localDataStr) {
        try {
          const parsed = JSON.parse(localDataStr) as Note[];
          setNotes(parsed);
        } catch (_) {
          setNotes(getDefaultNotes());
        }
      } else {
        const defaults = getDefaultNotes();
        setNotes(defaults);
        localStorage.setItem("pasamotor_admin_notes", JSON.stringify(defaults));
      }
      setSyncStatus("local");
    } finally {
      setLoading(false);
    }
  };

  const getDefaultNotes = (): Note[] => {
    return [
      {
        id: "def-1",
        title: "📌 Paşa Motor SEO Öncelikleri",
        content: "1. Google arama sonuçlarında TVS, Hero ve Falcon anahtar kelimelerinde ilk 3 hedefleniyor.\n2. Orijinal parça sorgulamalarında blog makaleleri altından WhatsApp'a yönlendirme artırılacak.\n3. Yeni üretilen Apache RTR 200 blog yazılarının slug yapıları kontrol edilecek.",
        category: "SEO & Blog",
        color: "purple",
        is_pinned: true,
        checklist: [
          { id: "c-1", text: "Özel şasi destek butonu WhatsApp linki güncellendi mi?", done: true },
          { id: "c-2", text: "Motosiklet markalarından sadece TVS, Hero, Falcon, Işıldar kalacak şekilde ana sayfa sadeleştirildi mi?", done: true },
          { id: "c-3", text: "Görsel yenileme sorunu için new window.Image() düzeltmesi yapıldı mı?", done: true }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "def-2",
        title: "🔧 Servis ve Yedek Parça Siparişleri",
        content: "Cumartesi sabahı gelecek TVS Jupiter debriyaj balataları kargosu takip edilecek.\nMüşteri Ahmet Bey'in (Fatih/İstanbul) şasi numarası ile sorgu sonucu teyit edilerek yedek parça siparişi girilecek.",
        category: "Servis",
        color: "green",
        is_pinned: false,
        checklist: [
          { id: "c-4", text: "TVS Jupiter debriyaj kargo takip nosu iste", done: false },
          { id: "c-5", text: "Müşteriye uyumluluk onayını WhatsApp'tan gönder", done: false }
        ],
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
      }
    ];
  };

  const saveNotesToSync = async (updatedNotes: Note[]) => {
    setNotes(updatedNotes);
    // Her zaman yerel storage'a kaydet
    localStorage.setItem("pasamotor_admin_notes", JSON.stringify(updatedNotes));

    if (syncStatus === "synced") {
      try {
        // Supabase veri tabanındaki tüm kayıtları temizleyip yenilerini beslemeyi ya da tek tek upsert etmeyi deneyelim
        // Bulk upsert/save yapalım
        for (const note of updatedNotes) {
          const payload = {
              id: note.id,
              title: note.title,
              content: note.content,
              category: note.category,
              color: note.color,
              is_pinned: note.is_pinned,
              checklist: note.checklist,
              diagram: note.diagram,
              created_at: note.created_at,
              updated_at: new Date().toISOString()
            };
            
          // Ensure we don't try to sync payload with properties not in schema yet
          // Catch and ignore if fails to insert non-existent column
          const { error } = await dbClient.from("notes").upsert(payload);
          if (error) console.error("Not bulut eşleme hatası:", error.message);
        }
      } catch (e) {
        // Hata durumunda yerel moda devam et
        console.warn("Bulut senkronizasyonu kesildi, veriler tarayıcıya güvenle kaydedildi.");
      }
    }
  };

  const handleOpenCreator = () => {
    setActiveNote(null);
    setNoteTitle("");
    setNoteContent("");
    setNoteCategory("Genel");
    setNoteColor("slate");
    setNoteIsPinned(false);
    setNoteChecklist([]);
    setNewChecklistItemText("");
    setNoteDiagram(undefined);
    setIsDrawingModalOpen(false);
    setIsEditorOpen(true);
  };

  const handleOpenEditor = (note: Note) => {
    setActiveNote(note);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteCategory(note.category || "Genel");
    setNoteColor(note.color || "slate");
    setNoteIsPinned(note.is_pinned || false);
    setNoteChecklist(note.checklist || []);
    setNewChecklistItemText("");
    setNoteDiagram(note.diagram);
    setIsDrawingModalOpen(false);
    setIsEditorOpen(true);
  };

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) {
      toast({
        title: "Başlık Gereklidir",
        description: "Lütfen notunuza bir başlık belirleyin.",
        variant: "destructive"
      });
      return;
    }
    
    const currentDiagram = noteDiagram;

    let updatedList: Note[];
    if (activeNote) {
      // Güncelleme
      updatedList = notes.map((n) => {
        if (n.id === activeNote.id) {
          return {
            ...n,
            title: noteTitle.trim(),
            content: noteContent.trim(),
            category: noteCategory,
            color: noteColor,
            is_pinned: noteIsPinned,
            checklist: noteChecklist,
            diagram: currentDiagram,
            updated_at: new Date().toISOString()
          };
        }
        return n;
      });
      toast({ title: "Not Güncellendi ✓", description: "Değişiklikler başarıyla kaydedildi." });
    } else {
      // Yeni Ekleme
      const newNote: Note = {
        id: "note-" + Date.now(),
        title: noteTitle.trim(),
        content: noteContent.trim(),
        category: noteCategory,
        color: noteColor,
        is_pinned: noteIsPinned,
        checklist: noteChecklist,
        diagram: currentDiagram,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      updatedList = [newNote, ...notes];
      toast({ title: "Yeni Not Eklendi ✓", description: "Not başarıyla oluşturuldu." });
    }

    await saveNotesToSync(updatedList);
    setIsEditorOpen(false);
  };

  const handleDeleteNoteClick = (id: string) => {
    setDeleteConfirmId(id);
  };

  const executeDeleteNote = async (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    await saveNotesToSync(updated);

    if (syncStatus === "synced") {
      try {
        await dbClient.from("notes").delete().eq("id", id);
      } catch (e: any) {
        console.error("Bulut veri silme hatası:", e.message);
      }
    }

    toast({ title: "Not Silindi", description: "Not başarıyla sistemden kaldırıldı." });
    setDeleteConfirmId(null);
    if (activeNote?.id === id) {
      setIsEditorOpen(false);
    }
  };

  const handleTogglePin = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.map((n) => {
      if (n.id === note.id) {
        return { ...n, is_pinned: !n.is_pinned };
      }
      return n;
    });
    await saveNotesToSync(updated);
    toast({
      title: !note.is_pinned ? "Not Sabitlendi 📌" : "Sabitleme Kaldırıldı",
      description: "Not görünüm düzeni güncellendi."
    });
  };

  // Checklist Helpers
  const handleAddChecklistItem = () => {
    if (!newChecklistItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: "chk-" + Date.now() + Math.floor(Math.random() * 100),
      text: newChecklistItemText.trim(),
      done: false
    };
    setNoteChecklist([...noteChecklist, newItem]);
    setNewChecklistItemText("");
  };

  const handleToggleCheckItem = (itemId: string) => {
    setNoteChecklist(
      noteChecklist.map((item) => {
        if (item.id === itemId) {
          return { ...item, done: !item.done };
        }
        return item;
      })
    );
  };

  const handleRemoveCheckItem = (itemId: string) => {
    setNoteChecklist(noteChecklist.filter((item) => item.id !== itemId));
  };

  // Not Kartındaki hızlı görev tamamlamaları
  const handleToggleCardCheckItem = async (noteId: string, itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notes.map((n) => {
      if (n.id === noteId) {
        const uChecklist = n.checklist.map((item) => {
          if (item.id === itemId) return { ...item, done: !item.done };
          return item;
        });
        return { ...n, checklist: uChecklist };
      }
      return n;
    });
    await saveNotesToSync(updated);
  };

  // Yedek Alma & Yükleme
  const downloadBackup = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(notes, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `pasamotor_notlar_yedek_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast({ title: "Yedek İndirildi", description: "Notlarınız bilgisayarınıza JSON dosyası olarak kaydedildi." });
    } catch (e: any) {
      toast({ title: "Yedek Alınamadı", description: e.message, variant: "destructive" });
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const files = e.target.files;
    if (!files || files.length === 0) return;

    fileReader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          // Basit bir şema kontrolü
          const isValid = parsed.every(item => item.id && item.title !== undefined);
          if (isValid) {
            const merged = [...parsed, ...notes].reduce((acc: Note[], current: Note) => {
              const x = acc.find(item => item.id === current.id);
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);
            await saveNotesToSync(merged);
            toast({ title: "Yedek Başarıyla Yüklendi!", description: `${parsed.length} adet not sisteme aktarıldı.` });
          } else {
            throw new Error("Geçersiz yedek dosyası şeması.");
          }
        } else {
          throw new Error("Dosya içeriği geçerli bir not listesi değil.");
        }
      } catch (err: any) {
        toast({ title: "Yükleme Hatası", description: "Yedek dosyası okunamadı: " + err.message, variant: "destructive" });
      }
    };
    fileReader.readAsText(files[0]);
  };

  // Filtreleme ve Arama Mantığı
  const filteredNotes = notes.filter((note) => {
    const matchesCategory = selectedCategory === "Tümü" || note.category === selectedCategory;
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower) ||
      (note.checklist && note.checklist.some(item => item.text.toLowerCase().includes(searchLower)));

    return matchesCategory && matchesSearch;
  });

  // Sıralama Mantığı
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // Sabitlenenler her zaman en üstte kalacak
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;

    // Sonra seçilen sıralamaya göre sırala
    if (sortBy === "date_desc") {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
    if (sortBy === "date_asc") {
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Üst Başlık Bölümü */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <StickyNote className="w-6 h-6 animate-pulse" />
              </div>
              <h1 className="font-heading font-bold text-2xl text-foreground">Gelişmiş Not Defteri</h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Paşa Motor günlük operasyonlarınızı, parça siparişlerini, SEO hedeflerini ve müşteri durumlarını takip edin.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap drop-shadow-sm">
            {/* Supabase / Local Badge */}
            <div className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 ${
              syncStatus === "synced" 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
            }`}>
              {syncStatus === "synced" ? (
                <>
                  <Database className="w-3.5 h-3.5" />
                  Bulut Veri Tabanı Aktif
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Yerel Hafıza (Çevrimdışı Güvenli)
                </>
              )}
            </div>

            {/* Yedek Al butonu */}
            <button
              onClick={downloadBackup}
              title="Notları Yedekle (JSON)"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-border/80 text-xs font-semibold select-none cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Yedekle
            </button>

            {/* Yedekten Yükle */}
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-border/80 text-xs font-semibold select-none cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              Yükle
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportBackup} 
                className="hidden" 
              />
            </label>

            {/* Yeni Not Oluştur */}
            <button
              onClick={handleOpenCreator}
              className="inline-flex items-center gap-2 px-5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs select-none cursor-pointer transition-all shadow-lg shadow-indigo-600/10"
            >
              <Plus className="w-4 h-4" />
              Yeni Not Ekle
            </button>
          </div>
        </div>

        {/* Arama, Kategori & Filtre Menüsü */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Arama Çubuğu */}
          <div className="lg:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Not başlığı, içerik veya görevlerde ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
            />
          </div>

          {/* Kategoriler Sürgüsü */}
          <div className="lg:col-span-5 flex items-center gap-1.5 overflow-x-auto pb-1.5 lg:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("Tümü")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                selectedCategory === "Tümü"
                  ? "bg-slate-200 text-slate-950 border-slate-300"
                  : "bg-slate-900/50 text-slate-400 border-border/50 hover:text-slate-200"
              }`}
            >
              Hepsi ({notes.length})
            </button>
            {NOTE_CATEGORIES.map((cat) => {
              const count = notes.filter((n) => n.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-slate-200 text-slate-950 border-slate-300"
                      : "bg-slate-900/50 text-slate-400 border-border/50 hover:text-slate-200"
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Sıralama ve Izgara Değiştirici */}
          <div className="lg:col-span-3 flex items-center justify-end gap-2">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-border text-xs text-slate-300 font-semibold focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
            >
              <option value="date_desc">En Yeni Önce</option>
              <option value="date_asc">En Eski Önce</option>
              <option value="title">A'dan Z'ye Sırala</option>
            </select>

            <div className="flex items-center gap-0.5 border border-border rounded-xl overflow-hidden bg-slate-900 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                title="Izgara Görünümü"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "grid" ? "bg-slate-800 text-indigo-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="Liste Görünümü"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === "list" ? "bg-slate-800 text-indigo-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Notlar Listelenmesi */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
            <span className="text-xs text-muted-foreground font-semibold">Notlar yükleniyor...</span>
          </div>
        ) : sortedNotes.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/10 border border-border/50 rounded-2xl max-w-xl mx-auto p-8">
            <StickyNote className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-lg text-foreground mb-1">Aradığınız Not Bulunamadı</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
              {searchQuery 
                ? `"${searchQuery}" kelimesi ile eşleşen bir sonuç bulunmuyor. Farklı kelimelerle arama yapabilirsiniz.`
                : `${selectedCategory} kategorisinde henüz hiçbir not yazılmamış durumda. Hemen sağ üstteki butondan yeni bir not oluşturabilirsiniz.`}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-border text-xs font-semibold text-slate-300 hover:text-slate-200 transition-all cursor-pointer"
              >
                Aramayı Temizle
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" 
            : "flex flex-col gap-4"
          }>
            {sortedNotes.map((note) => {
              const categoryObj = NOTE_CATEGORIES.find((c) => c.id === note.category);
              const colorInfo = NOTE_COLORS.find((col) => col.value === note.color) || NOTE_COLORS[0];
              
              // Checklist tamamlama oranları
              const totalTasks = note.checklist?.length || 0;
              const completedTasks = note.checklist?.filter(item => item.done).length || 0;
              const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <div
                  key={note.id}
                  onClick={() => handleOpenEditor(note)}
                  className={`group rounded-2xl border p-5 transition-all duration-300 relative hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 flex flex-col justify-between cursor-pointer ${
                    note.is_pinned 
                      ? "ring-1 ring-indigo-500/50 " + colorInfo.borderClass
                      : colorInfo.borderClass
                  }`}
                >
                  {/* Başlık ve Sabitleme */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      {/* Kategori Etiketi */}
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                        categoryObj?.color || "text-slate-400 bg-slate-500/10 border-slate-500/20"
                      }`}>
                        {categoryObj?.label || "Genel"}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleTogglePin(note, e)}
                          title={note.is_pinned ? "Sabitlemeyi kaldır" : "En üste sabitle"}
                          className={`p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer ${
                            note.is_pinned ? "text-indigo-400 bg-indigo-500/10" : "text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNoteClick(note.id);
                          }}
                          className="p-1 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-slate-800/80 transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-sm text-foreground line-clamp-1 group-hover:text-indigo-300 transition-colors mb-2">
                      {note.title}
                    </h3>

                    {/* İçerik */}
                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-4 whitespace-pre-wrap mb-4">
                      {note.content}
                    </p>
                    {note.diagram && (
                      <div className="flex items-center gap-2 mb-4 bg-slate-900/50 p-2 rounded-xl border border-border/40">
                         <PenTool className="w-4 h-4 text-indigo-400" />
                         <span className="text-[10px] text-slate-300 font-medium">Bu notta 1 çizim / diyagram var</span>
                      </div>
                    )}
                  </div>

                  {/* Alt Bölüm: Görevler, Tarih vs. */}
                  <div className="mt-4 pt-3.5 border-t border-border/40 space-y-3">
                    {/* Görev Listesi Hızlı Önizleme */}
                    {totalTasks > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold font-mono">
                          <span>📋 Yapılacaklar ({completedTasks}/{totalTasks})</span>
                          <span>%{progressPct}</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-slate-950 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full transition-all duration-500" 
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>

                        {/* İlk 2 Görev */}
                        <div className="space-y-1">
                          {note.checklist.slice(0, 2).map((item) => (
                            <div 
                              key={item.id}
                              onClick={(e) => handleToggleCardCheckItem(note.id, item.id, e)}
                              className="flex items-center gap-1.5 group/item py-0.5 text-[11px] text-slate-300 font-sans cursor-pointer hover:text-foreground"
                            >
                              {item.done ? (
                                <CheckSquare className="w-3.5 h-3.5 text-indigo-400 tracking-tight shrink-0" />
                              ) : (
                                <Square className="w-3.5 h-3.5 text-slate-500 shrink-0 group-hover/item:text-indigo-400 transition-all" />
                              )}
                              <span className={`truncate ${item.done ? "line-through text-slate-500" : ""}`}>
                                {item.text}
                              </span>
                            </div>
                          ))}
                          {totalTasks > 2 && (
                            <span className="text-[10px] text-slate-500 block text-right font-medium">
                              + {totalTasks - 2} görev daha var
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono tracking-wide">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-600" />
                        {new Date(note.updated_at || note.created_at).toLocaleDateString("tr-TR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                      <span>ID: {note.id.substring(0, 8)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Not Editör / Detay Modalı */}
        {isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in font-sans">
            <div className="w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
              {/* Modal Başlık Bölümü */}
              <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4 bg-slate-950/20">
                <div className="flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-300 tracking-wider uppercase font-mono">
                    {activeNote ? "Not Düzenleyici" : "Yeni Not Oluştur"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setNoteIsPinned(!noteIsPinned)}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      noteIsPinned 
                        ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" 
                        : "text-slate-400 border-border/80 hover:text-slate-200"
                    }`}
                  >
                    <Pin className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="p-1 px-2 text-xs border border-border/80 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer font-sans"
                  >
                    Kapat (ESC)
                  </button>
                </div>
              </div>

              {/* Modal İçerik / Form */}
              <div className="p-5 overflow-y-auto flex-1 font-sans space-y-4">
                
                {/* Sol Taraf: Metin ve Ayarlar */}
                <div className="space-y-4">
                  {/* 1. Başlık girişi */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Not Başlığı
                    </label>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Anahtar arıza kodu, kargo durumu, müşteri notu vb..."
                      className="w-full px-4 py-2 bg-slate-950 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-indigo-500/50 transition-all font-sans font-bold placeholder:font-normal"
                    />
                  </div>

                  {/* 2. Kategori Seçimi & Renk Seçimi */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Kategori
                      </label>
                      <select
                        value={noteCategory}
                        onChange={(e) => setNoteCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-950 border border-border rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                      >
                        {NOTE_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Kart Teması / Rengi
                      </label>
                      <div className="flex items-center gap-1.5 py-1">
                        {NOTE_COLORS.map((col) => (
                          <button
                            key={col.value}
                            type="button"
                            onClick={() => setNoteColor(col.value)}
                            title={col.name}
                            className={`w-6 h-6 rounded-full border border-slate-950 cursor-pointer transition-transform relative ${
                              col.value === "slate" ? "bg-slate-800" :
                              col.value === "amber" ? "bg-amber-600" :
                              col.value === "blue" ? "bg-blue-600" :
                              col.value === "green" ? "bg-emerald-600" :
                              col.value === "purple" ? "bg-purple-600" : "bg-rose-600"
                            } ${
                              noteColor === col.value 
                                ? "scale-125 ring-2 ring-indigo-500" 
                                : "hover:scale-115"
                            }`}
                          >
                            {noteColor === col.value && (
                              <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 3. Not İçeriği */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Detaylı Açıklama
                    </label>
                    <textarea
                      rows={5}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Detaylı notlarınızı, telefon numaralarını veya sorun inceleme adımlarını buraya yazabilirsiniz..."
                      className="w-full px-4 py-3 bg-slate-950 border border-border rounded-xl text-xs text-foreground focus:outline-none focus:border-indigo-500/50 transition-all font-sans leading-relaxed"
                    />
                  </div>

                  {/* 4. Yapılacaklar Listesi (Alt Görev Süzgeci) */}
                  <div className="p-3.5 rounded-xl border border-border bg-slate-950/30 space-y-3">
                    <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                      Alt Görev Listesi (Checklist)
                    </label>

                    {/* Görev Ekleme Kutusu */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newChecklistItemText}
                        onChange={(e) => setNewChecklistItemText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddChecklistItem();
                          }
                        }}
                        placeholder="Yeni görev/adım..."
                        className="flex-1 px-3 py-1.5 bg-slate-950 border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-indigo-500/50 transition-all font-sans"
                      />
                      <button
                        type="button"
                        onClick={handleAddChecklistItem}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs select-none cursor-pointer shrink-0"
                      >
                        Ekle
                      </button>
                    </div>

                    {/* Görevler Listesi */}
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {noteChecklist.length === 0 ? (
                        <span className="text-[11px] text-muted-foreground italic font-sans block py-1.5">
                          Henüz bu nota eklenmiş hiçbir görev yok.
                        </span>
                      ) : (
                        noteChecklist.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 p-1 px-2 rounded-lg bg-slate-900 border border-border/40 group/item"
                          >
                            <div
                              onClick={() => handleToggleCheckItem(item.id)}
                              className="flex items-center gap-2 cursor-pointer flex-1 overflow-hidden"
                            >
                              {item.done ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-500 shrink-0" />
                              )}
                              <span className={`text-[11px] font-medium leading-normal truncate ${
                                item.done ? "line-through text-slate-500" : "text-slate-300"
                              }`}>
                                {item.text}
                              </span>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => handleRemoveCheckItem(item.id)}
                              className="text-slate-500 hover:text-rose-400 transition-colors p-1 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Gelişmiş Atölye Çizim Alanı */}
                <div className="rounded-xl border border-border bg-slate-950/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <PenTool className="w-4 h-4 text-indigo-400" />
                      <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                        Gelişmiş Diyagram & Şema Atölyesi
                      </label>
                    </div>
                    {noteDiagram && (
                      <span className="text-[9px] font-black tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase font-mono">
                        Çizim Ekli
                      </span>
                    )}
                  </div>

                  {noteDiagram ? (
                    <div className="space-y-3">
                      {/* Çizim Önizleme Kartı */}
                      <div className="relative group/drawing overflow-hidden rounded-xl border border-slate-800 bg-slate-950 aspect-[21/9] flex items-center justify-center p-2">
                        <img 
                          src={noteDiagram} 
                          alt="Diyagram Önizleme" 
                          className="max-h-full max-w-full object-contain filter group-hover/drawing:scale-[1.01] transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover/drawing:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setIsDrawingModalOpen(true)}
                            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg flex items-center gap-1 cursor-pointer"
                          >
                            <PenTool className="w-3.5 h-3.5" /> Çizimi Düzenle
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if(confirm("Bu çizimi nottan kaldırmak istiyor musunuz?")) {
                                setNoteDiagram(undefined);
                                toast({
                                  title: "Çizim Kaldırıldı",
                                  description: "Notun içerisindeki çizim silindi."
                                });
                              }
                            }}
                            className="p-2 bg-rose-650 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all shadow-lg cursor-pointer"
                            title="Çizimi Kaldır"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 text-center leading-normal">
                        Diyagram üzerinde her zaman değişiklik yapabilir veya dosyaya çıkarabilirsiniz.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-6 px-4 border border-dashed border-border rounded-xl bg-slate-950/40 space-y-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                        <PenTool className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-slate-300">Yeni Diyagram / Çizim Ekle</h5>
                        <p className="text-[10px] text-slate-400 max-w-[280px] mx-auto leading-normal">
                          Motosiklet bileşenlerini çizmek, servis şemalarını çizmek veya parça uyumluluk haritası hazırlamak için tuvali açın!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDrawingModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-lg shadow-indigo-600/10"
                      >
                        <PenTool className="w-3.5 h-3.5" /> Gelişmiş Tuvali Aç
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* Modal Kaydet Butonları */}
              <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-4 bg-slate-950/20">
                <div>
                  {activeNote && (
                    <button
                      type="button"
                      onClick={() => handleDeleteNoteClick(activeNote.id)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs cursor-pointer transition-colors font-sans"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Sil
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-4 py-2 border border-border rounded-xl text-slate-300 hover:text-slate-200 text-xs font-bold bg-slate-900 cursor-pointer hover:bg-slate-800 transition-colors font-sans"
                  >
                    İptal Et
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition-colors shadow-lg shadow-indigo-600/10 font-sans"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <DrawingCanvasModal
          isOpen={isDrawingModalOpen}
          onClose={() => setIsDrawingModalOpen(false)}
          onSave={(base64Image) => {
            setNoteDiagram(base64Image);
          }}
          initialDrawing={noteDiagram}
          noteTitle={noteTitle || "Diyagram"}
        />

        {/* Silme Onay Modalı */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
             <div className="w-full max-w-sm bg-slate-900 border border-rose-500/20 rounded-2xl shadow-2xl p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                   <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Notu Sil</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                   Bu not tamamen silinecek. Geri alınamaz. Onaylıyor musunuz?
                </p>
                <div className="flex gap-3 justify-center pt-4">
                  <button 
                    onClick={() => setDeleteConfirmId(null)} 
                    className="px-4 py-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 border border-border transition-colors font-semibold text-xs"
                  >
                     İptal
                  </button>
                  <button 
                    onClick={() => executeDeleteNote(deleteConfirmId)} 
                    className="px-4 py-2 rounded-xl text-white bg-rose-600 hover:bg-rose-500 transition-colors font-semibold text-xs flex items-center gap-2"
                  >
                     <Trash2 className="w-4 h-4" /> Evet, Sil
                  </button>
                </div>
             </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
