import { adminFetch } from "@/lib/api-client";
import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/db-client";
import { toast } from "sonner";
import {
  Plus,
  RefreshCw,
  Play,
  Upload,
  Trash2,
  TestTube2,
  Loader2,
  Pencil,
  Activity,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

type SourceType = "xml" | "json" | "csv_manual" | "xml_manual" | "json_manual" | "fcs_portal" | "api_push";

interface Supplier {
  id: string;
  name: string;
  source_type: SourceType;
  feed_url: string | null;
  portal_url: string | null;
  api_key?: string | null;
  customer_code: string | null;
  user_code: string | null;
  password_encrypted: string | null;
  field_mapping: Record<string, string>;
  sync_interval_minutes: number;
  auto_sync_enabled: boolean;
  is_initialized: boolean;
  last_sync_at: string | null;
  last_full_import_at: string | null;
  margin_percent: number;
  is_active: boolean;
  notes: string | null;
}

interface SyncJob {
  id: string;
  supplier_id: string;
  job_type: string;
  status: string;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  items_total: number;
  items_created: number;
  items_updated: number;
  items_skipped: number;
  items_failed: number;
  error_message: string | null;
  triggered_by: string;
}

const emptyForm: Partial<Supplier> = {
  name: "",
  source_type: "xml",
  feed_url: "",
  portal_url: "",
  api_key: "",
  customer_code: "",
  user_code: "",
  password_encrypted: "",
  field_mapping: {
    sku: "sku",
    name: "name",
    brand: "brand",
    category: "category",
    price: "price",
    stock: "stock",
    image: "image",
    description: "description",
  },
  sync_interval_minutes: 5,
  auto_sync_enabled: false,
  margin_percent: 20,
  is_active: true,
  notes: "",
};

const fmtDate = (s: string | null) =>
  s ? new Date(s).toLocaleString("tr-TR") : "-";

const AdminSuppliers = () => {
  const [items, setItems] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Supplier>>(emptyForm);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [logsOpen, setLogsOpen] = useState<string | null>(null);
  const [jobs, setJobs] = useState<SyncJob[]>([]);
  const [csvOpen, setCsvOpen] = useState<string | null>(null);
  const [csvText, setCsvText] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [syncProgress, setSyncProgress] = useState<{ id: string; phase: string; percent: number } | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await dbClient
      .from("suppliers")
      .select("*")
      .order("created_at", { ascending: false });
    
    let mapped = ((data as any[]) || []).map((s: any) => ({
      ...s,
      api_key: s.api_key || s.field_mapping?.api_key || null
    }));

    try {
      const { data: recentJobs } = await dbClient
        .from("sync_jobs")
        .select("supplier_id, started_at, job_type")
        .eq("status", "success")
        .order("started_at", { ascending: false });

      if (recentJobs && recentJobs.length > 0) {
        mapped = mapped.map((s: any) => {
          const supplierJobs = recentJobs.filter((j: any) => j.supplier_id === s.id);
          const latestSync = supplierJobs[0]?.started_at || null;
          
          const fullImportJobs = supplierJobs.filter((j: any) => j.job_type === "full_import" || j.job_type === "full");
          const latestFull = fullImportJobs[0]?.started_at || null;

          return {
            ...s,
            last_sync_at: s.last_sync_at || latestSync,
            last_full_import_at: s.last_full_import_at || latestFull || (latestSync ? latestSync : s.last_full_import_at),
            is_initialized: s.is_initialized || !!latestSync
          };
        });
      }
    } catch (e) {
      console.warn("Failed to overlay sync timestamps from sync_jobs map:", e);
    }

    setItems(mapped);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };
  const openEdit = (s: Supplier) => {
    setEditing(s);
    setForm({ 
      ...s,
      api_key: s.api_key || (s.field_mapping as any)?.api_key || null
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.name?.trim()) return toast.error("Ad zorunlu");
    
    const currentMapping = form.field_mapping || {};
    const updatedMapping = {
      ...currentMapping,
      api_key: form.api_key?.trim() || null
    };

    const payload = {
      name: form.name!.trim(),
      source_type: form.source_type || "xml",
      feed_url: form.feed_url?.trim() || null,
      portal_url: form.portal_url?.trim() || null,
      customer_code: form.customer_code?.trim() || null,
      user_code: form.user_code?.trim() || null,
      password_encrypted: form.password_encrypted?.trim() || null,
      field_mapping: updatedMapping,
      sync_interval_minutes: Number(form.sync_interval_minutes) || 5,
      auto_sync_enabled: !!form.auto_sync_enabled,
      margin_percent: Number(form.margin_percent) || 0,
      is_active: form.is_active !== false,
      notes: form.notes?.trim() || null,
    };
    const { error } = editing
      ? await dbClient.from("suppliers").update(payload).eq("id", editing.id)
      : await dbClient.from("suppliers").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Kaydedildi");
    setShowForm(false);
    await load();
  };

  const remove = async (id: string) => {
    // if (!window.confirm("Bu tedarikçiyi silmek istediğinize emin misiniz?")) return;
    const { error } = await dbClient.from("suppliers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Silindi");
    await load();
  };

  const callSync = async (
    supplier: Supplier,
    mode: "full_import" | "incremental" | "test_connection" | "test_login" | "sync_update",
  ) => {
    if ((supplier.source_type === "csv_manual" || supplier.source_type === "xml_manual" || supplier.source_type === "json_manual") && mode !== "test_connection") {
      toast.info("Manuel kaynaklar için 'Dosya Yükle' seçeneğini kullanın");
      return;
    }
    if (supplier.source_type === "api_push" && mode !== "test_connection") {
      toast.info("Bu tedarikçi (API Push) ürünlerini webhook üzerinden POST ile gönderir.");
      return;
    }
    setBusyId(supplier.id);

    const startTime = Date.now();
    let syncSuccess = false;
    let syncErrorStr: string | null = null;
    let syncData: any = null;

    try {
      const isFcs = supplier.source_type === "fcs_portal";
      
      let data, errorObj;
      if (isFcs) {
        if (!supplier.user_code || !supplier.password_encrypted) {
           throw new Error("Kullanıcı kodu veya parola eksik. Ayarlardan kontrol edin.");
        }

        setSyncProgress({
           id: supplier.id,
           phase: "Portal oturumu açılıyor...",
           percent: 5
        });

        const authRes = await adminFetch("/api/supplier/fcs-auth", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
              userCode: supplier.user_code,
              password: supplier.password_encrypted
           })
         });
         
        if (!authRes.ok) throw new Error("Portal oturum açma hatası.");
        const authJson = await authRes.json();
        if (!authJson.success || !authJson.cookies) throw new Error("Kimlik doğrulama başarısız.");
        
        if (mode === "test_connection" || mode === "test_login") {
          data = { total: 0, created: 0, updated: 0, skipped: 0, failed: 0 };
          syncData = data;
          syncSuccess = true;
          toast.success("Bağlantı/Login OK");
          setBusyId(null);
          setSyncProgress(null);
          return;
        }

        const cookies = authJson.cookies;
        const allowedBrands = ["BAJAJ","BANDO","BOSCH AKÜ","BOSCH MOTOSİKLET","DENSO","HONDA","KYB","MAHLE","NGK","SACHS","TECNECO","TRW","TVS","VARTA"];
        
        let totalFetchedCount = 0;
        let createdCount = 0;
        let updatedCount = 0;
        let skippedCount = 0;
        let failedCount = 0;

        const allDbProducts: any[] = [];
        let pOffset = 0;
        let pHasMore = true;
        while (pHasMore) {
          const { data: pData, error: pErr } = await dbClient.from("products").select("sku, slug, price, stock").range(pOffset, pOffset + 999);
          if (pErr) break;
          if (pData && pData.length > 0) {
            allDbProducts.push(...pData);
            pOffset += pData.length;
          } else {
            pHasMore = false;
          }
        }
        const existingSkus = new Map((allDbProducts).filter((p: any) => p.sku).map((p: any) => [p.sku, p]));

        for (let bIndex = 0; bIndex < allowedBrands.length; bIndex++) {
          const brand = allowedBrands[bIndex];
          let offset = 0;
          let hasMore = true;

          while (hasMore) {
            setSyncProgress({
               id: supplier.id,
               phase: `[${brand}] Fiyat & Stok taranıyor... (${offset} / ∞)`,
               percent: 10 + Math.floor((bIndex / allowedBrands.length) * 80)
            });

            const fetchRes = await adminFetch("/api/supplier/fcs-fetch", {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ cookies, brand, offset })
            });

            if (!fetchRes.ok) {
               console.error(`Fiyat/Stok Fetch failed for ${brand}`);
               break;
            }

            const fetchJson = await fetchRes.json();
            const items = fetchJson.data || [];
            if (fetchJson.hasMore !== undefined) {
               hasMore = fetchJson.hasMore;
            } else {
               hasMore = items.length === 24;
            }
            offset += 24;
            
            if (items.length === 0) break;
            
            totalFetchedCount += items.length;

            const toInsert: any[] = [];
            const toUpdate: any[] = [];
            const marginMult = 1 + ((supplier.margin_percent || 0) / 100);

            for (let item of items) {
              if (!item.sku) continue;
              
              const basePrice = item.price || 0;
              const newPrice = Number((basePrice * marginMult).toFixed(2));
              item = { ...item, price: newPrice };
              
              const existing = existingSkus.get(item.sku);
              if (existing) {
                // Fiyat ya da stok değiştiyse her halükarda güncelle
                // Numara (float) karşılaştırmasında JS çok ufak toleranslar sorun çıkarabilir diye mutlak fark
                const priceDiff = Math.abs((existing.price || 0) - newPrice);
                const priceChanged = priceDiff > 0.01;
                const stockChanged = existing.stock !== item.stock;

                if (priceChanged || stockChanged) {
                  toUpdate.push({ sku: item.sku, price: newPrice, stock: item.stock });
                } else {
                  skippedCount++;
                }
              } else {
                if (mode === "full_import") {
                  toInsert.push(item);
                } else {
                  skippedCount++;
                }
              }
            }

            if (toInsert.length > 0) {
               const { error } = await dbClient.from("products").insert(toInsert);
               if (error) failedCount += toInsert.length; 
               else createdCount += toInsert.length;
            }

            if (toUpdate.length > 0) {
               for (let i = 0; i < toUpdate.length; i += 10) {
                 const chunk = toUpdate.slice(i, i + 10);
                 const promises = chunk.map(up => 
                    dbClient.from("products")
                      .update({ price: up.price, stock: up.stock })
                      .eq('sku', up.sku)
                 );
                 const results = await Promise.all(promises);
                 for (const res of results) {
                   if (res.error) failedCount++;
                   else updatedCount++;
                 }
               }
            }
          }
        }

        setSyncProgress({
          id: supplier.id,
          phase: "Senkronizasyon tamamlandı!",
          percent: 100
        });
        
        data = { total: totalFetchedCount, created: createdCount, updated: updatedCount, skipped: skippedCount, failed: failedCount };
      } else {

        const fnName = "sync-supplier";
        const res = await dbClient.functions.invoke(fnName, {
          body: { supplier_id: supplier.id, mode, triggered_by: "manual" },
        });
        if (res.error) throw res.error;
        if ((res.data as any)?.error) throw new Error((res.data as any).error);
        data = res.data;
      }
      
      const r = data as any;
      syncData = r;
      syncSuccess = true;
      toast.success(
        mode === "test_connection" || mode === "test_login"
          ? "Bağlantı/Login OK"
          : `OK - Tplm: ${r.total} | Yeni: ${r.created} | Güncel: ${r.updated} | Atlanan: ${r.skipped} | Hata: ${r.failed}`
      );
      
      if (syncSuccess && isFcs && (mode === "full_import" || mode === "sync_update")) {
        const updatePayload: any = { last_sync_status: "success", is_active: true };
        if (mode === "full_import") updatePayload.last_full_import_at = new Date().toISOString();
        if (mode === "sync_update") updatePayload.last_sync_at = new Date().toISOString();
        const { error: supUpdateErr } = await dbClient.from("suppliers").update(updatePayload).eq("id", supplier.id);
        if (supUpdateErr) console.warn("Failed to update supplier sync timestamps:", supUpdateErr);
      }
      
      await load();
    } catch (e: any) {
      syncErrorStr = e.message || "Sync hatası";
      toast.error(syncErrorStr);
    } finally {
      setSyncProgress(null);
      setBusyId(null);

      // Create a sync log in sync_jobs table for visibility under sync logs logs tab
      try {
        const duration = Date.now() - startTime;
        const jobRecord = {
          supplier_id: supplier.id,
          job_type: mode === "test_connection" || mode === "test_login" ? "test" : mode,
          status: syncSuccess ? "success" : "failed",
          items_total: syncData?.total || 0,
          items_created: syncData?.created || 0,
          items_updated: syncData?.updated || 0,
          items_skipped: syncData?.skipped || 0,
          items_failed: syncData?.failed || (syncSuccess ? 0 : 1),
          error_message: syncErrorStr,
          duration_ms: duration,
          started_at: new Date(startTime).toISOString(),
          finished_at: new Date().toISOString()
        };
        await dbClient.from("sync_jobs").insert(jobRecord);
      } catch (logErr) {
        console.error("Failed to insert sync job log:", logErr);
      }
    }
  };

  const uploadCsv = async () => {
    if (!csvOpen || !csvText.trim()) return;
    setBusyId(csvOpen);
    try {
      const { data, error } = await dbClient.functions.invoke("import-csv", {
        body: {
          supplier_id: csvOpen,
          csv: csvText,
          mode: "full_import",
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const r = data as any;
      toast.success(
        `CSV: toplam:${r.total} oluşturuldu:${r.created} hata:${r.failed}`,
      );
      setCsvOpen(null);
      setCsvText("");
      await load();
    } catch (e: any) {
      toast.error(e.message || "CSV import hatası");
    } finally {
      setBusyId(null);
    }
  };

  const onCsvFile = async (f: File) => {
    const text = await f.text();
    setCsvText(text);
  };

  const openLogs = async (id: string) => {
    setLogsOpen(id);
    const { data } = await dbClient
      .from("sync_jobs")
      .select("*")
      .eq("supplier_id", id)
      .order("started_at", { ascending: false })
      .limit(50);
    setJobs((data as any) || []);
  };

  const toggleAuto = async (s: Supplier) => {
    const { error } = await dbClient
      .from("suppliers")
      .update({ auto_sync_enabled: !s.auto_sync_enabled })
      .eq("id", s.id);
    if (error) return toast.error(error.message);
    await load();
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">
              Tedarikçiler
            </h1>
            <p className="text-sm text-muted-foreground">
              XML/JSON feed veya manuel CSV/JSON ile çoklu tedarikçi yönetimi
            </p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" /> Yeni Tedarikçi
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center text-muted-foreground">
            Henüz tedarikçi yok. Yeni Tedarikçi ekleyin.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((s) => (
              <div key={s.id} className="glass-card rounded-xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-heading font-semibold text-foreground">
                        {s.name}
                      </h3>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground uppercase">
                        {s.source_type}
                      </span>
                      {s.is_initialized ? (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-500/20 text-green-400">
                          Initialized
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
                          Henüz import edilmedi
                        </span>
                      )}
                      {s.auto_sync_enabled && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-400">
                          Auto - {s.sync_interval_minutes}dk
                        </span>
                      )}
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
                      <div>
                        <div>Margin</div>
                        <div className="text-foreground font-medium">
                          %{s.margin_percent}
                        </div>
                      </div>
                      <div>
                        <div>Son sync</div>
                        <div className="text-foreground font-medium">
                          {fmtDate(s.last_sync_at)}
                        </div>
                      </div>
                      <div>
                        <div>Son full import</div>
                        <div className="text-foreground font-medium">
                          {fmtDate(s.last_full_import_at)}
                        </div>
                      </div>
                      <div className="truncate">
                        <div>{s.source_type === "fcs_portal" ? "Portal" : "Feed"}</div>
                        <div className="text-foreground font-medium truncate">
                          {s.source_type === "fcs_portal" ? (s.portal_url || "-") : (s.feed_url || "-")}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => callSync(s, "test_connection")}
                      disabled={busyId === s.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs hover:bg-muted/70 disabled:opacity-50"
                      title="Bağlantı testi"
                    >
                      <TestTube2 className="w-3.5 h-3.5" /> Test
                    </button>
                    {s.source_type === "csv_manual" || s.source_type === "xml_manual" || s.source_type === "json_manual" ? (
                      <button
                        onClick={() => {
                          setCsvOpen(s.id);
                          setCsvText("");
                        }}
                        disabled={busyId === s.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80 disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5" /> Dosya Yükle
                      </button>
                    ) : s.source_type === "api_push" ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs italic">
                        Webhook Dinleniyor...
                      </span>
                    ) : (
                      <>
                        <button
                          onClick={() => callSync(s, "full_import")}
                          disabled={busyId === s.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground text-xs hover:bg-secondary/80 disabled:opacity-50"
                          title="İlk tam import (tek seferlik)"
                        >
                          {busyId === s.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Play className="w-3.5 h-3.5" />
                          )}{" "}
                          Full Import
                        </button>
                        <button
                          onClick={() => callSync(s, "incremental")}
                          disabled={busyId === s.id}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs hover:bg-primary/90 disabled:opacity-50"
                          title="Sadece fiyat ve stok güncelle"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Fiyat/Stok Sync
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => toggleAuto(s)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs ${
                        s.auto_sync_enabled
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      Auto: {s.auto_sync_enabled ? "AÇIK" : "KAPALI"}
                    </button>
                    <button
                      onClick={() => openLogs(s.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs hover:bg-muted/70"
                    >
                      <Activity className="w-3.5 h-3.5" /> Loglar
                    </button>
                    <button
                      onClick={() => openEdit(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-foreground text-xs hover:bg-muted/70"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => remove(s.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/20 text-destructive text-xs hover:bg-destructive/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {syncProgress && syncProgress.id === s.id && (
                  <div className="mt-4 bg-background/50 p-4 rounded-lg border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-primary">{syncProgress.phase}</span>
                      <span className="text-xs font-bold font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">%{syncProgress.percent}</span>
                    </div>
                    <div className="h-2 w-full bg-muted overflow-hidden rounded-full">
                      <div 
                        className="h-full bg-primary transition-all duration-300 ease-out rounded-full" 
                        style={{ width: `${syncProgress.percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Form modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
            <div className="glass-card rounded-xl p-6 w-full max-w-2xl my-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-xl text-foreground">
                  {editing ? "Tedarikçi Düzenle" : "Yeni Tedarikçi"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Ad *">
                  <input
                    value={form.name || ""}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Kaynak Tipi">
                  <select
                    value={form.source_type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        source_type: e.target.value as SourceType,
                      })
                    }
                    className="input"
                  >
                    <option value="xml">XML Feed (Otomatik)</option>
                    <option value="json">JSON / REST (Otomatik)</option>
                    <option value="csv_manual">CSV Manuel Upload</option>
                    <option value="xml_manual">XML Manuel Upload</option>
                    <option value="json_manual">JSON Manuel Upload</option>
                    <option value="fcs_portal">FCS Portal (Login + Scrape)</option>
                    <option value="api_push">API Push (Webhook)</option>
                  </select>
                </Field>
                {(form.source_type === "xml" || form.source_type === "json") && (
                  <Field label="Feed URL" full>
                    <input
                      value={form.feed_url || ""}
                      onChange={(e) =>
                        setForm({ ...form, feed_url: e.target.value })
                      }
                      placeholder="https://tedarikci.com/feed.xml"
                      className="input"
                    />
                  </Field>
                )}
                {form.source_type === "api_push" && (
                  <Field label="Güvenlik İçin Özel API Anahtarı (Header: x-api-key)" full>
                    <input
                      value={form.api_key || ""}
                      onChange={(e) =>
                        setForm({ ...form, api_key: e.target.value })
                      }
                      placeholder="super-secret-key-123"
                      className="input font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Büyük firmalar tedarikçilerin kendi sistemlerine POST isteği atabilmesi için özel Webhook endpoint'leri oluşturur ve erişimi bu anahtar ile kısıtlar. (Örn: POST /api/supplier/webhook)
                    </p>
                  </Field>
                )}
                {form.source_type === "fcs_portal" && (
                  <Field label="Portal URL (ürün listesi sayfası)" full>
                    <input
                      value={form.portal_url || ""}
                      onChange={(e) =>
                        setForm({ ...form, portal_url: e.target.value })
                      }
                      placeholder="https://b2b.tedarikci.com/urunler"
                      className="input"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Login sonrası açılan ürün listesi sayfasının URL'i. Firecrawl otomatik login + scrape yapar.
                    </p>
                  </Field>
                )}
                <Field label="Müşteri Kodu">
                  <input
                    value={form.customer_code || ""}
                    onChange={(e) =>
                      setForm({ ...form, customer_code: e.target.value })
                    }
                    className="input"
                  />
                </Field>
                <Field label="Kullanıcı Kodu">
                  <input
                    value={form.user_code || ""}
                    onChange={(e) =>
                      setForm({ ...form, user_code: e.target.value })
                    }
                    className="input"
                  />
                </Field>
                <Field label="Şifre (Basic Auth)">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password_encrypted || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          password_encrypted: e.target.value,
                        })
                      }
                      className="input pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="Sync Aralığı (dakika)">
                  <input
                    type="number"
                    min={1}
                    value={form.sync_interval_minutes || 5}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        sync_interval_minutes: parseInt(e.target.value) || 5,
                      })
                    }
                    className="input"
                  />
                </Field>
                <Field label="Kar Marjı (%)">
                  <input
                    type="number"
                    step="0.1"
                    value={form.margin_percent ?? 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        margin_percent: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="input"
                  />
                </Field>
                <Field label="Otomatik Sync">
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={!!form.auto_sync_enabled}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          auto_sync_enabled: e.target.checked,
                        })
                      }
                    />
                    <span className="text-sm text-foreground">Açık</span>
                  </label>
                </Field>
                <Field label="Aktif">
                  <label className="flex items-center gap-2 mt-2">
                    <input
                      type="checkbox"
                      checked={form.is_active !== false}
                      onChange={(e) =>
                        setForm({ ...form, is_active: e.target.checked })
                      }
                    />
                    <span className="text-sm text-foreground">Aktif</span>
                  </label>
                </Field>
                <Field label="Alan Eşleştirme (JSON)" full>
                  <textarea
                    value={JSON.stringify(form.field_mapping || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        setForm({
                          ...form,
                          field_mapping: JSON.parse(e.target.value),
                        });
                      } catch {
                        // sessizce yoksay
                      }
                    }}
                    rows={8}
                    className="input font-mono text-xs"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Tedarikçi XML/JSON alan adlarını standart isimlere
                    eşleştirin. Nokta ile iç içe alan: "fiyat.satis"
                  </p>
                </Field>
                <Field label="Notlar" full>
                  <textarea
                    value={form.notes || ""}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    rows={2}
                    className="input"
                  />
                </Field>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm"
                >
                  İptal
                </button>
                <button
                  onClick={save}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* File upload modal */}
        {csvOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card rounded-xl p-6 w-full max-w-xl">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading font-bold text-lg text-foreground">
                  Dosya Yükle
                </h2>
                <button
                  onClick={() => setCsvOpen(null)}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Bu modül aracılığıyla CSV, JSON veya XML formatındaki tedarikçi ürünlerini manuel olarak içeri aktarabilirsiniz. Alt kısımdaki eşleştirme kuralları geçerli olacaktır.
              </p>
              <input
                type="file"
                accept=".csv,text/csv,.json,application/json,.xml,text/xml"
                onChange={(e) => e.target.files?.[0] && onCsvFile(e.target.files[0])}
                className="text-sm mb-3"
              />
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                rows={10}
                placeholder="Dosya içeriği buraya yüklenecek veya manuel yapıştırabilirsiniz..."
                className="input font-mono text-xs w-full"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setCsvOpen(null)}
                  className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm"
                >
                  İptal
                </button>
                <button
                  onClick={uploadCsv}
                  disabled={!csvText.trim() || busyId === csvOpen}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-50"
                >
                  {busyId === csvOpen ? "İşleniyor..." : "Yükle ve İçe Aktar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logs modal */}
        {logsOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="glass-card rounded-xl p-6 w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading font-bold text-lg text-foreground">
                  Sync Logları
                </h2>
                <button
                  onClick={() => setLogsOpen(null)}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-auto flex-1">
                {jobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Henüz log yok.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs whitespace-nowrap min-w-[500px]">
                      <thead className="text-muted-foreground border-b border-border">
                      <tr>
                        <th className="text-left p-2">Tarih</th>
                        <th className="text-left p-2">Tip</th>
                        <th className="text-left p-2">Durum</th>
                        <th className="text-right p-2">Toplam</th>
                        <th className="text-right p-2">Yeni</th>
                        <th className="text-right p-2">Güncel</th>
                        <th className="text-right p-2">Atlandı</th>
                        <th className="text-right p-2">Hata</th>
                        <th className="text-right p-2">Süre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((j) => (
                        <tr
                          key={j.id}
                          className="border-b border-border/50"
                          title={j.error_message || ""}
                        >
                          <td className="p-2">{fmtDate(j.started_at)}</td>
                          <td className="p-2">{j.job_type}</td>
                          <td className="p-2">
                            <span
                              className={`px-2 py-0.5 rounded-full ${
                                j.status === "success"
                                  ? "bg-green-500/20 text-green-400"
                                  : j.status === "error"
                                    ? "bg-red-500/20 text-red-400"
                                    : j.status === "partial"
                                      ? "bg-yellow-500/20 text-yellow-400"
                                      : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {j.status}
                            </span>
                          </td>
                          <td className="p-2 text-right">{j.items_total}</td>
                          <td className="p-2 text-right text-green-400">
                            {j.items_created}
                          </td>
                          <td className="p-2 text-right text-blue-400">
                            {j.items_updated}
                          </td>
                          <td className="p-2 text-right">{j.items_skipped}</td>
                          <td className="p-2 text-right text-red-400">
                            {j.items_failed}
                          </td>
                          <td className="p-2 text-right">
                            {j.duration_ms ? `${j.duration_ms}ms` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const Field = ({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="block text-xs font-medium text-muted-foreground mb-1">
      {label}
    </label>
    {children}
  </div>
);

export default AdminSuppliers;
