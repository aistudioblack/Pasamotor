import { useState, useRef, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/hooks/use-toast";
import { Database, Trash2, RefreshCw, Download, Upload, Save, Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const COLLECTIONS = ["products", "posts", "messages", "gallery_images", "faqs", "users", "site_content", "ai_logs"];

export default function AdminDatabase() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const newCounts: Record<string, number> = {};
      for (const col of COLLECTIONS) {
        const { count, error } = await supabase.from(col).select('*', { count: 'exact', head: true });
        if (!error && count !== null) {
          newCounts[col] = count;
        } else {
          newCounts[col] = 0;
        }
      }
      setCounts(newCounts);
    } catch (e) {
      console.error("Error fetching counts:", e);
    }
  };

  const handleCreateBackup = async (downloadOnly = false) => {
    setLoading(true);
    try {
        const backupData: Record<string, any[]> = {};
        for (const col of COLLECTIONS) {
            const { data } = await supabase.from(col).select('*');
            backupData[col] = data || [];
        }

        const dataStr = JSON.stringify(backupData, null, 2);

        if (downloadOnly) {
          const uri = "data:text/json;charset=utf-8," + encodeURIComponent(dataStr);
          const downloadAnchorNode = document.createElement('a');
          downloadAnchorNode.setAttribute("href", uri);
          downloadAnchorNode.setAttribute("download", `yedek_${new Date().toISOString().split('T')[0]}.json`);
          document.body.appendChild(downloadAnchorNode); 
          downloadAnchorNode.click();
          downloadAnchorNode.remove();
          toast({ title: "Yedek İndirildi" });
        } else {
          toast({ title: "Yedek başarılı." });
        }
    } catch (err: any) {
        toast({ title: "Hata", description: err.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  const processRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
       const text = await file.text();
       const data = JSON.parse(text);
       
       for (const col of COLLECTIONS) {
         if (data[col] && Array.isArray(data[col])) {
           if (data[col].length > 0) {
             const { error } = await supabase.from(col).upsert(data[col]);
             if (error) {
               console.error(`Error restoring ${col}:`, error);
               toast({ title: `${col} tablosunda hata`, description: error.message, variant: "destructive" });
             }
           }
         }
       }
       
       toast({ title: "Yükleme Başarılı", description: "Veritabanı yedeği geri yüklendi." });
       fetchCounts();
    } catch (err: any) {
      console.error(err);
      toast({ title: "Geçersiz Dosya", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const truncateTable = async (col: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.from(col).delete().not('id', 'is', null);
      if (error) throw error;
      
      toast({ title: "Tablo Temizlendi", description: `${col} tablosundaki veriler silindi.` });
      fetchCounts();
      setDeleteDialogOpen(null);
    } catch (e: any) {
      toast({ title: "Hata", description: e.message, variant: "destructive" });
      setDeleteDialogOpen(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground flex items-center gap-2">
            <Database className="w-8 h-8 text-primary" />
            Veritabanı Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">Supabase tablolarını, yedeklemeleri ve istatistikleri yönetin.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={processRestore} 
            className="hidden" 
          />
          <button onClick={() => fileInputRef.current?.click()} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-lg font-medium hover:bg-amber-500/20 transition-colors">
             <Upload className="w-4 h-4" />
             Yükle
          </button>
          <button onClick={() => handleCreateBackup(true)} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-lg font-medium hover:bg-indigo-500/20 transition-colors">
             <Download className="w-4 h-4" />
             Yedek İndir
          </button>
          <button onClick={fetchCounts} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg font-medium hover:bg-blue-500/20 transition-colors">
             <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
             Yenile
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {COLLECTIONS.map(col => (
          <div key={col} className="glass-card rounded-xl p-6 overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg font-heading capitalize">{col.replace('_', ' ')}</h3>
                  {counts[col] === 0 && (
                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold py-0.5 px-2 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> BOŞ
                    </span>
                  )}
                  {counts[col] > 0 && (
                    <span className="bg-green-500/10 text-green-500 border border-green-500/20 text-[10px] font-bold py-0.5 px-2 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> AKTİF
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Tablo verileri</p>
              </div>
              <Database className="w-5 h-5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
            </div>
            
            <div className="flex items-end justify-between">
              <div>
                <span className="text-3xl font-bold font-mono">{counts[col] !== undefined ? counts[col] : '...'}</span>
                <span className="text-xs text-muted-foreground ml-2">kayıt</span>
              </div>
              
              <Dialog open={deleteDialogOpen === col} onOpenChange={(open) => setDeleteDialogOpen(open ? col : null)}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" disabled={loading}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tabloyu Temizle</DialogTitle>
                    <DialogDescription>
                      <strong className="text-foreground">{col}</strong> tablosundaki tüm veriler silinecektir. Bu işlem geri alınamaz. 
                      Devam etmek istiyor musunuz?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" className="border-border" onClick={() => setDeleteDialogOpen(null)}>İptal</Button>
                    <Button variant="destructive" onClick={() => truncateTable(col)}>Evet, Temizle</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
