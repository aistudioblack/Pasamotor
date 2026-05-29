import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useRef, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase-client";
import { useToast } from "@/hooks/use-toast";
import {
  Plus, Edit2, Trash2, X, Loader2, Package, Upload, Link as LinkIcon,
  Check, Percent, Search, GripVertical, ScanLine, Sparkles
} from "lucide-react";
import type { Tables } from "@/lib/firebase-types";
import { convertToWebP, getWebPFileName } from "@/lib/imageOptimization";
import BarcodeScanner from "@/components/admin/BarcodeScanner";

type Product = Tables<"products">;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const tl = (n: number | null) =>
  n == null ? "-" : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" }).format(n);

const emptyForm = {
  title: "", slug: "", brand: "TVS", category: "yedek-parca",
  description: "", content: "", price: "", stock: "10", meta_title: "", meta_description: "",
  images: [] as string[],
  is_active: true, is_featured: false,
};

const BUCKET = "product-images";

const StockCell = ({ p, onUpdate, toast }: { p: Product, onUpdate: (id: string, stock: number) => void, toast: any }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(p.stock?.toString() || "0");

  const save = async () => {
    const val = draft.trim();
    const newStock = val === "" ? 0 : parseInt(val);
    if (isNaN(newStock) || newStock < 0) {
       toast({ title: "Geçersiz stok adedi", variant: "destructive" });
       return;
    }
    const { error } = await supabase.from("products").update({ stock: newStock }).eq("id", p.id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      onUpdate(p.id, newStock);
      setEditing(false);
      toast({ title: "Stok başarıyla güncellendi" });
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          autoFocus type="number" value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-20 px-2 py-1 rounded bg-muted border border-primary text-foreground text-xs font-mono"
        />
        <button onClick={save} className="p-1 rounded bg-primary text-primary-foreground">
          <Check className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setEditing(false)} className="p-1 rounded text-muted-foreground hover:bg-muted">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setEditing(true); setDraft(p.stock?.toString() || "0"); }}
      className="inline-flex items-center group/btn -mx-2 px-2 py-1 rounded hover:bg-muted text-left transition-colors"
      title="Hızlı stok güncelle"
    >
      <span className={`font-semibold text-xs px-2.5 py-1 rounded-full cursor-pointer transition-all ${
        (p.stock ?? 0) > 5 ? "bg-green-500/10 text-green-500 group-hover/btn:bg-green-500/20" :
        (p.stock ?? 0) > 0 ? "bg-amber-500/10 text-amber-500 group-hover/btn:bg-amber-500/20" :
        "bg-red-500/10 text-red-500 group-hover/btn:bg-red-500/20"
      }`}>
        {(p.stock ?? 0) > 0 ? `${p.stock} Adet` : "Tükendi / Düzenle"}
      </span>
    </button>
  );
};

const PriceCell = ({ p, onUpdate, toast }: { p: Product, onUpdate: (id: string, price: number | null) => void, toast: any }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(p.price?.toString() || "");

  const save = async () => {
    const val = draft.trim();
    const newPrice = val === "" ? null : parseFloat(val.replace(",", "."));
    if (newPrice !== null && (isNaN(newPrice) || newPrice < 0)) {
       toast({ title: "Geçersiz fiyat", variant: "destructive" });
       return;
    }
    const { error } = await supabase.from("products").update({ price: newPrice }).eq("id", p.id);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      onUpdate(p.id, newPrice);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          autoFocus type="number" step="0.01" value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") setEditing(false);
          }}
          className="w-24 px-2 py-1 rounded bg-muted border border-primary text-foreground text-sm"
        />
        <button onClick={save} className="p-1 rounded bg-primary text-primary-foreground">
          <Check className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setEditing(false)} className="p-1 rounded text-muted-foreground hover:bg-muted">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setEditing(true); setDraft(p.price?.toString() || ""); }}
      className="text-left text-foreground hover:text-primary transition-colors px-2 py-1 -mx-2 rounded hover:bg-muted"
      title="Hızlı düzenle"
    >
      {tl(p.price)}
    </button>
  );
};

const AdminProducts = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);

  // Filtering & bulk
  const [query, setQuery] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState(""); // "", "in_stock", "low_stock", "out_of_stock"
  const [statusFilter, setStatusFilter] = useState(""); // "", "active", "passive"
  
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isAllDBSelected, setIsAllDBSelected] = useState(false);
  const [margin, setMargin] = useState("");
  const [bulkStock, setBulkStock] = useState("");
  const [marginScope, setMarginScope] = useState<"selected" | "filtered" | "all">("selected");
  const [applyingMargin, setApplyingMargin] = useState(false);
  const [applyingStock, setApplyingStock] = useState(false);
  
  // AI SEO Title Optimization states
  const cancelTitleSEO = useRef(false);
  const [optimizingTitles, setOptimizingTitles] = useState(false);
  const [titleProgress, setTitleProgress] = useState("");
  const [titleLogStr, setTitleLogStr] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [barcodeActionData, setBarcodeActionData] = useState<{ barcode: string } | null>(null);
  const [barcodeAssignQuery, setBarcodeAssignQuery] = useState("");
  const [isAssigningBarcode, setIsAssigningBarcode] = useState(false);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [confirmModal, setConfirmModal] = useState<{ id?: string, bulk?: boolean } | null>(null);
  const [lastDocs, setLastDocs] = useState<any[]>([]); // To keep track of cursors for each page
  const [hasMore, setHasMore] = useState(true);
  const ITEMS_PER_PAGE = 50;

  const load = async (pageIndex: number = 1) => {
    setLoading(true);
    try {
      let q = supabase
        .from("products")
        .select("*", { count: "exact" });

      if (brandFilter) {
        q = q.eq("brand", brandFilter);
      }
      if (categoryFilter) {
        q = q.eq("category", categoryFilter);
      }
      if (statusFilter === "active") {
        q = q.eq("is_active", true);
      } else if (statusFilter === "passive") {
        q = q.eq("is_active", false);
      }

      if (stockFilter === "in_stock") {
        q = q.gt("stock", 0);
      } else if (stockFilter === "low_stock") {
        q = q.gt("stock", 0).lte("stock", 5);
      } else if (stockFilter === "out_of_stock") {
        q = q.eq("stock", 0);
      }

      if (query) {
        q = q.or(`title.ilike.%${query}%,slug.ilike.%${query}%,sku.ilike.%${query}%`);
      }

      q = q.order("created_at", { ascending: false });

      const from = (pageIndex - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, count, error } = await q.range(from, to);

      if (error) throw error;
      
      const newItems = data as Product[];

      setItems(newItems || []);
      if (count !== null) setTotalProducts(count);
      setHasMore((newItems || []).length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query, brandFilter, categoryFilter, stockFilter, statusFilter]);

  // Debounced search query handler
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(searchVal);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchVal]);

  const filtered = items;

  const allBrands = ["TVS", "Hero", "Falcon", "Işıldar", "HONDA", "BAJAJ", "BANDO", "NGK", "VARTA", "CFMOTO"];

  const autoFixAllBrokenTitles = async () => {
    setOptimizingTitles(true);
    setTitleProgress("Veritabanı taranıyor...");
    setTitleLogStr("");
    cancelTitleSEO.current = false;

    try {
      // 1. Fetch ALL products to find broken ones
      const { data: allProducts, error: fetchErr } = await supabase.from("products").select("id, title, brand, sku, category");
      if (fetchErr) throw fetchErr;

      // 2. Identify broken
      const targets = (allProducts || []).filter(p => {
        const title = p.title || '';
        const upper = title.toUpperCase();
        
        const hasSpam = upper.includes("YEDEK PARÇA") || upper.includes("MOTOSİKLET") || upper.includes("ATV") || title.includes("Ürün") || title.includes("Sport");
        const hasDash = title.includes("–") || title.includes("-");
        const suffixOrijinal = upper.endsWith("ORİJİNAL") || upper.endsWith("ORIJINAL"); 
        const isJSON = title.includes("{") || title.includes("[") || title.includes("optimized_title");

        return hasSpam || !hasDash || suffixOrijinal || isJSON;
      });

      if (targets.length === 0) {
        toast({ title: "Tebrikler!", description: "Veritabanında bozuk veya kurallara uymayan başlık bulunamadı." });
        setOptimizingTitles(false);
        return;
      }

      toast({
        title: "Senior Manager SEO Devrede",
        description: `Tüm veritabanı tarandı. ${targets.length} adet sorunlu ürün otomatik onarılıyor...`
      });

      let successCount = 0;
      let errorCount = 0;
      const BATCH_SIZE = 10; 

      for (let i = 0; i < targets.length; i += BATCH_SIZE) {
        if (cancelTitleSEO.current) {
          setTitleLogStr(prev => `[Durduruldu] Yönetici tarafından iptal edildi.\n` + prev);
          toast({ title: "Otomasyon Durduruldu", description: "İşlem iptal edildi." });
          break;
        }

        const batch = targets.slice(i, i + BATCH_SIZE);
        setTitleProgress(`${Math.min(i + BATCH_SIZE, targets.length)} / ${targets.length} ürün onarılıyor`);

        try {
          const batchJson = JSON.stringify(batch.map(p => ({
            id: p.id,
            brand: p.brand || "",
            sku: p.sku || "",
            title: p.title
          })));

          const prompt = `Sen profesyonel ecommerce SEO title optimizer sistemisin.

Görevin:
Motosiklet yedek parça ürün başlıklarını: doğal, temiz, insan gibi, OEM odaklı, model odaklı, okunabilir, spam içermeyen ve profesyonel ecommerce standardında yeniden oluşturmaktır (maks. 70 karakter).

KURALLAR:
- Ürün anlamını ASLA değiştirme.
- Teknik parça adını bozma, typo üretme, uydurma kelime üretme.
- Gereksiz kelime ekleme (örn: ürün, yedek parça, motosiklet, ATV, sport, stock kodu vb.).
- Başlık doğal okunmalı ve insan yazmış gibi görünmeli.
- SKU/OEM kodunu koru, Marka ve modeli koru.
- Türkçe karakterleri düzelt/koru (örn: RAİDER -> Raider, ORJİNAL -> Orijinal).
- Keyword stuffing ve gereksiz tekrar yapma.
- Sadece EN GÜÇLÜ formata sadık kal.
- ÇIKIŞ YALNIZCA GEÇERLİ, DÜZ BİR JSON DİZİSİ (ARRAY) OLMALIDIR.

EN GÜÇLÜ FORMAT:
{MARKA} {MODEL} {PARÇA ADI} Orijinal – {SKU}
(Eğer orijinal değilse Orijinal kelimesini atla)

REFERANS ÖRNEKLER:
Eski: "TVS TVS-NF228480 Motosiklet Yedek Parça - TVS APACHE RTR 200 E5 YAN KAPAK SAĞ SİYAH ORİJİNAL"
Yeni: "TVS Apache RTR 200 E5 Sağ Yan Kapak Siyah Orijinal – TVS-NF228480"

Lütfen aşağıdaki JSON dizisini optimize et ve sonucu YALNIZCA geçerli bir JSON dizisi olarak döndür. Markdown KULLANMA.

GİRDİ:
${batchJson}

BEKLENEN ÇIKTI (Sadece ham JSON):
[
  {"id": "...", "optimized_title": "..."}
]`;

          const response = await fetch("/api/ai/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, isJson: true })
          });

          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const resData = await response.json();
          const rawText = resData.text ? resData.text.trim() : "";
          
          if (!rawText) throw new Error("Yapay zeka boş bir yanıt döndürdü.");
          
          let parsed;
          try {
            const match = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
            if (match) {
              parsed = JSON.parse(match[0]);
            } else {
              parsed = JSON.parse(rawText);
            }
          } catch (e) {
            throw new Error("Yapay zeka formatlama hatası (Geçersiz JSON).");
          }
          
          if (!Array.isArray(parsed)) throw new Error("AI geçerli bir dizi dönmedi.");

          for (const item of parsed) {
            if (item.id && item.optimized_title) {
              const currentProduct = batch.find(p => p.id === item.id);
              const optTitle = item.optimized_title.replace(/^["'«“‘]|["'»”’]$/g, '').trim();

              const { error: updateError } = await supabase
                .from("products")
                .update({ title: optTitle, slug: slugify(optTitle) })
                .eq("id", item.id);

              if (updateError) {
                errorCount++;
                setTitleLogStr(prev => `[HATA] "${optTitle}" kaydedilemedi (${updateError.message})\n` + prev);
              } else {
                successCount++;
                setTitleLogStr(prev => `[ONARILDI] ✓ "${currentProduct?.title || ""}" -> "${optTitle}"\n` + prev);
              }
            }
          }
        } catch (itemErr: any) {
          errorCount += batch.length;
          setTitleLogStr(prev => `[SERVER/AI HATASI] Optimizasyon partisi atlandı: ${itemErr.message}\n` + prev);
        }

        // Wait to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      toast({
        title: "Senior Manager Görevi Tamamladı",
        description: `${successCount} ürün onarıldı, ${errorCount} hata oluştu.`
      });
      load();
    } catch (err: any) {
      toast({ title: "Genel Sistem Hatası", description: err.message, variant: "destructive" });
    } finally {
      setOptimizingTitles(false);
    }
  };

  const barcodeAssignFilteredItems = useMemo(() => {
    if (!barcodeAssignQuery) return items.slice(0, 50);
    const q = barcodeAssignQuery.toLowerCase();
    return items.filter(p => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q)).slice(0, 50);
  }, [items, barcodeAssignQuery]);

  useEffect(() => {
    setPage(1);
    setSelected(new Set());
    setIsAllDBSelected(false);
  }, [query, brandFilter, categoryFilter, stockFilter, statusFilter]);

  useEffect(() => {
    setSelected(new Set());
    setIsAllDBSelected(false);
  }, [page]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const paginatedItems = filtered;

  const toggleSelect = (id: string) => {
    if (isAllDBSelected) {
      const next = new Set(filtered.map(p => p.id));
      next.delete(id);
      setSelected(next);
      setIsAllDBSelected(false);
    } else {
      const next = new Set(selected);
      next.has(id) ? next.delete(id) : next.add(id);
      setSelected(next);
    }
  };
  const toggleSelectAll = () => {
    if (isAllDBSelected || selected.size === filtered.length) {
      setSelected(new Set());
      setIsAllDBSelected(false);
    } else {
      setSelected(new Set(filtered.map((p) => p.id)));
    }
  };

  const handleScan = async (barcode: string) => {
    setIsScanning(false);
    
    // 1. Search existing products (barcode might be in slug or description)
    const existing = items.find(p => p.slug.includes(barcode) || (p.description && p.description.includes(barcode)) || p.title.includes(barcode));
    if (existing) {
      toast({ title: "Ürün bulundu", description: existing.title });
      openEdit(existing);
      return;
    }

    // Instead of forcing a "Create New" or doing a potentially slow/unrelated UPC API call right away,
    // Provide the user with an option to either Assign to an Existing Product or Create New.
    // For local operations (like a motorcycle parts shop), many barcodes are local/supplier specific.
    setBarcodeActionData({ barcode });
  };

  const handleCreateNewFromBarcode = async () => {
    if (!barcodeActionData) return;
    const barcode = barcodeActionData.barcode;
    setBarcodeActionData(null);
    
    try {
      toast({ title: "Barkod aranıyor...", description: barcode });
      const res = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`);
      const data = await res.json();
      
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        setEditing(null);
        setForm({
          ...emptyForm,
          title: item.title || `Ürün ${barcode}`,
          slug: barcode,
          description: item.description || `Barkod no: ${barcode}`,
          brand: item.brand || "Diğer",
          images: item.images || [],
          price: item.lowest_recorded_price ? item.lowest_recorded_price.toString() : "",
        });
        setLinkInput("");
        setOpen(true);
        toast({ title: "Ürün bilgileri bulundu!" });
      } else {
        openNewWithBarcode(barcode);
      }
    } catch (err) {
      openNewWithBarcode(barcode);
    }
  };

  const openNewWithBarcode = (barcode: string) => {
    setEditing(null);
    setForm({
      ...emptyForm,
      title: ``,
      slug: barcode,
      description: `Barkod no: ${barcode}`
    });
    setLinkInput("");
    setOpen(true);
    toast({ title: "Yeni ürün", description: "Ürün sistemi için formu doldurun." });
  };

  const handleAssignBarcode = async (product: Product) => {
    if (!barcodeActionData) return;
    setIsAssigningBarcode(true);
    
    const newDescription = product.description 
      ? `${product.description} \nBarkod: ${barcodeActionData.barcode}`
      : `Barkod: ${barcodeActionData.barcode}`;
      
    const { error } = await supabase
      .from("products")
      .update({ description: newDescription })
      .eq("id", product.id);
      
    setIsAssigningBarcode(false);
    
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Barkod Atandı", description: "Ürün güncellendi, artık bu barkodla okunabilir." });
      setBarcodeActionData(null);
      load();
    }
  };


  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setLinkInput("");
    setOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      title: p.title, slug: p.slug, brand: p.brand, category: p.category,
      description: p.description || "", content: p.content || "",
      price: p.price?.toString() || "", stock: p.stock?.toString() || "0", meta_title: p.meta_title || "", meta_description: p.meta_description || "",
      images: p.images || [],
      is_active: p.is_active, is_featured: p.is_featured,
    });
    setLinkInput("");
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      brand: form.brand,
      category: form.category,
      description: form.description.trim() || null,
      content: form.content.trim() || null,
      price: form.price ? parseFloat(form.price) : null,
      stock: form.stock ? parseInt(form.stock) : 0,
      meta_title: form.meta_title.trim() || null,
      meta_description: form.meta_description.trim() || null,
      images: form.images,
      is_active: form.is_active,
      is_featured: form.is_featured,
    };
    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editing ? "Güncellendi" : "Eklendi" });
      setOpen(false);
      load();
    }
  };

  const remove = async (id: string) => {
    setConfirmModal({ id });
  };

  const getFilterQuery = (queryBuilder: any) => {
    let q = queryBuilder;
    if (brandFilter) q = q.eq("brand", brandFilter);
    if (categoryFilter) q = q.eq("category", categoryFilter);
    if (statusFilter === "active") q = q.eq("is_active", true);
    else if (statusFilter === "passive") q = q.eq("is_active", false);

    if (stockFilter === "in_stock") q = q.gt("stock", 0);
    else if (stockFilter === "low_stock") q = q.gt("stock", 0).lte("stock", 5);
    else if (stockFilter === "out_of_stock") q = q.eq("stock", 0);

    if (query) {
      q = q.or(`title.ilike.%${query}%,slug.ilike.%${query}%,sku.ilike.%${query}%`);
    }
    return q;
  };

  // ---------- Bulk stock ----------
  const applyBulkStock = async () => {
    const qty = parseInt(bulkStock.trim());
    if (isNaN(qty) || qty < 0) {
       toast({ title: "Geçerli bir stok adedi girin (0 veya daha büyük)", variant: "destructive" });
       return;
    }

    setApplyingStock(true);
    try {
      let q = supabase.from("products").update({ stock: qty });
      let updatedCount = 0;

      if (isAllDBSelected) {
        q = getFilterQuery(q);
        const { error } = await q;
        if (error) throw error;
        updatedCount = totalProducts;
      } else if (marginScope === "all") {
        const { error } = await q;
        if (error) throw error;
        updatedCount = totalProducts;
      } else if (marginScope === "filtered") {
        q = getFilterQuery(q);
        const { error } = await q;
        if (error) throw error;
        updatedCount = totalProducts;
      } else {
        // "selected"
        if (selected.size === 0) {
          toast({ title: "Seçili ürün yok", variant: "destructive" });
          setApplyingStock(false);
          return;
        }
        const ids = Array.from(selected);
        q = q.in("id", ids);
        const { error } = await q;
        if (error) throw error;
        updatedCount = ids.length;
      }
      toast({ title: "Stoklar Güncellendi", description: `${updatedCount} ürünün stoku ${qty} olarak güncellendi.` });
      setBulkStock("");
      setSelected(new Set());
      setIsAllDBSelected(false);
      load();
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    } finally {
      setApplyingStock(false);
    }
  };

  // ---------- Bulk margin ----------
  const applyMargin = async () => {
    const pct = parseFloat(margin.replace(",", "."));
    if (isNaN(pct)) {
      toast({ title: "Geçerli bir % değeri girin", variant: "destructive" });
      return;
    }

    setApplyingMargin(true);
    try {
      const factor = 1 + pct / 100;
      let targets: { id: string; price: number | null }[] = [];

      if (isAllDBSelected || marginScope === "all" || marginScope === "filtered") {
        let q = supabase.from("products").select("id, price");
        if (isAllDBSelected || marginScope === "filtered") {
          q = getFilterQuery(q);
        }
        const { data, error } = await q;
        if (error) throw error;
        targets = data || [];
      } else {
        // selected
        if (selected.size === 0) {
          toast({ title: "Seçili ürün yok", variant: "destructive" });
          setApplyingMargin(false);
          return;
        }
        const { data, error } = await supabase
          .from("products")
          .select("id, price")
          .in("id", Array.from(selected));
        if (error) throw error;
        targets = data || [];
      }

      const validTargets = targets.filter(p => p.price != null);
      if (validTargets.length === 0) {
        toast({ title: "Fiyatı olan ürün bulunamadı", variant: "destructive" });
        setApplyingMargin(false);
        return;
      }

      const CHUNK_SIZE = 200;
      let okCount = 0;

      for (let i = 0; i < validTargets.length; i += CHUNK_SIZE) {
        const chunk = validTargets.slice(i, i + CHUNK_SIZE);
        const updates = chunk.map(p => ({
          id: p.id,
          price: Math.round((p.price! * factor) * 100) / 100,
        }));

        const { error } = await supabase.from("products").upsert(updates);
        if (error) throw error;
        okCount += updates.length;
      }

      toast({ title: "Fiyatlar Güncellendi", description: `${okCount} ürünün fiyatı başarıyla güncellendi.` });
      setMargin("");
      setSelected(new Set());
      setIsAllDBSelected(false);
      load();
    } catch (err: any) {
      toast({ title: "Hata", description: err.message, variant: "destructive" });
    } finally {
      setApplyingMargin(false);
    }
  };

  const bulkDelete = async () => {
    if (selected.size === 0 && !isAllDBSelected) return;
    setConfirmModal({ bulk: true });
  };

  const confirmDeleteAction = async () => {
    if (!confirmModal) return;
    
    setLoading(true);
    try {
      if (confirmModal.bulk) {
        let q = supabase.from("products").delete();
        let deletedCount = 0;

        if (isAllDBSelected) {
          q = getFilterQuery(q);
          const { error } = await q;
          if (error) throw error;
          deletedCount = totalProducts;
        } else {
          const ids = Array.from(selected);
          q = q.in("id", ids);
          const { error } = await q;
          if (error) throw error;
          deletedCount = ids.length;
        }

        toast({ title: `${deletedCount} ürün silindi` });
        setSelected(new Set());
        setIsAllDBSelected(false);
      } else if (confirmModal.id) {
        const { error } = await supabase.from("products").delete().eq("id", confirmModal.id);
        if (error) throw error;
        toast({ title: "Silindi" });
      }
    } catch (error: any) {
      toast({ title: "Hata", description: error.message, variant: "destructive" });
    } finally {
      setConfirmModal(null);
      setLoading(false);
      load();
    }
  };

  const bulkSetStatus = async (isActive: boolean) => {
    if (selected.size === 0 && !isAllDBSelected) return;
    setLoading(true);
    try {
      let q = supabase.from("products").update({ is_active: isActive });
      let updatedCount = 0;

      if (isAllDBSelected) {
        q = getFilterQuery(q);
        const { error } = await q;
        if (error) throw error;
        updatedCount = totalProducts;
      } else {
        const ids = Array.from(selected);
        q = q.in("id", ids);
        const { error } = await q;
        if (error) throw error;
        updatedCount = ids.length;
      }

      toast({ title: `${updatedCount} ürünün durumu güncellendi` });
      setSelected(new Set());
      setIsAllDBSelected(false);
      load();
    } catch (error: any) {
      toast({ title: "Toplu güncelleme hatası", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ---------- Image upload ----------
  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/") || f.name.endsWith(".svg"));
    if (arr.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const f of arr) {
      try {
        // Convert to WebP
        const webpBlob = await convertToWebP(f);
        const webpName = getWebPFileName(f.name);
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${webpName}`;
        
        const { error } = await supabase.storage.from(BUCKET).upload(path, webpBlob, {
          contentType: "image/webp",
          upsert: false,
        });

        if (error) {
          toast({ title: `Yüklenemedi: ${f.name}`, description: error.message, variant: "destructive" });
          continue;
        }
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
        uploaded.push(pub.publicUrl);
      } catch (err: any) {
        toast({ title: `Hata: ${f.name}`, description: err.message || "WebP dönüşümü başarısız", variant: "destructive" });
      }
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
    setUploading(false);
    if (uploaded.length > 0) toast({ title: `${uploaded.length} görsel (WebP) yüklendi` });
  };

  const addLink = () => {
    const url = linkInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url)) {
      toast({ title: "Geçerli bir URL girin (http/https)", variant: "destructive" });
      return;
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setLinkInput("");
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= form.images.length) return;
    const next = [...form.images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    setForm({ ...form, images: next });
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="font-heading font-bold text-2xl text-foreground">Ürünler</h1>
            <p className="text-sm text-muted-foreground">Yedek parça ve ürün yönetimi · Hızlı fiyat & toplu işlem</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsScanning(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90">
              <ScanLine className="w-4 h-4" /> Barkod Tara
            </button>
            <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
              <Plus className="w-4 h-4" /> Yeni Ürün
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-5 mb-4 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchVal} onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Başlık, sku veya slug ara (Anlık filtrelenir)…"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm outline-none focus:ring-1 focus:ring-primary/40"
              />
            </div>
            
            <select
              value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-1 focus:ring-primary/40 outline-none"
            >
              <option value="">Marka - Tümü ({allBrands.length})</option>
              {allBrands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>

            <select
              value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-1 focus:ring-primary/40 outline-none"
            >
              <option value="">Kategori - Tümü</option>
              <option value="yedek-parca">Yedek Parça</option>
              <option value="motosiklet">Motosiklet</option>
              <option value="aksesuar">Aksesuar</option>
            </select>

            <select
              value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-1 focus:ring-primary/40 outline-none"
            >
              <option value="">Stok - Tümü</option>
              <option value="in_stock">Stokta Var</option>
              <option value="low_stock">Kritik Stok (≤5)</option>
              <option value="out_of_stock">Tükendi / Stoksuz</option>
            </select>

            <select
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-muted border border-border text-foreground text-sm focus:ring-1 focus:ring-primary/40 outline-none"
            >
              <option value="">Durum - Tümü</option>
              <option value="active">Aktif Ürünler</option>
              <option value="passive">Pasif Ürünler</option>
            </select>

            <div className="text-xs text-muted-foreground font-semibold px-3 py-2 bg-secondary/30 rounded-lg ml-auto border border-border">
              {filtered.length} / {items.length} Ürün Listeleniyor
            </div>
          </div>
        </div>

        {/* Bulk Operations */}
        <div className="glass-card rounded-xl p-5 mb-4 flex flex-col gap-4 divide-y divide-border/40">
          <div className="flex flex-wrap gap-5 items-center justify-between pb-1">
            {/* Left Scope Select */}
            <div className="flex items-center gap-2 text-sm text-foreground font-medium">
              <span>İşlem Kapsamı:</span>
              <select
                value={marginScope} onChange={(e) => setMarginScope(e.target.value as any)}
                className="px-3 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-semibold focus:ring-1 focus:ring-primary"
              >
                <option value="selected">Seçili Ürünler ({selected.size})</option>
                <option value="filtered">Filtrelenmiş Listelenecekler ({filtered.length})</option>
                <option value="all">Sistemdeki Tüm Ürünler ({items.length})</option>
              </select>
            </div>
          </div>

          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Price Margin Grid */}
            <div className="flex flex-wrap gap-2.5 items-center">
              <Percent className="w-4 h-4 text-primary" />
              <span className="text-xs text-foreground font-semibold">Fiyat Marjı (%):</span>
              <input
                type="number" step="0.1" value={margin} onChange={(e) => setMargin(e.target.value)}
                placeholder="örn. 15 veya -8"
                className="w-24 px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-mono"
              />
              <button
                onClick={applyMargin} disabled={applyingMargin || !margin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {applyingMargin && <Loader2 className="w-3 h-3 animate-spin" />}
                Fiyatları Güncelle
              </button>
              <span className="text-[10px] text-muted-foreground w-full sm:w-auto mt-0.5">
                • Pozitif artıran, negatif indiren marj uygular.
              </span>
            </div>

            {/* Stock Bulk Change Grid */}
            <div className="flex flex-wrap gap-2.5 items-center md:justify-end">
              <Package className="w-4 h-4 text-primary" />
              <span className="text-xs text-foreground font-semibold">Stok Hedef Değeri:</span>
              <input
                type="number" value={bulkStock} onChange={(e) => setBulkStock(e.target.value)}
                placeholder="örn. 50 veya 0"
                className="w-24 px-2.5 py-1.5 rounded-lg bg-muted border border-border text-foreground text-xs font-mono"
              />
              <button
                onClick={applyBulkStock} disabled={applyingStock || !bulkStock}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {applyingStock && <Loader2 className="w-3 h-3 animate-spin" />}
                Stokları Güncelle
              </button>
              <span className="text-[10px] text-muted-foreground w-full sm:w-auto mt-0.5">
                • Kapsamlı stok senkronizasyon hedefini ayarlar.
              </span>
            </div>
          </div>

          {/* AI SEO Title Optimizer Row */}
          <div className="pt-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1 px-1.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px] font-bold uppercase tracking-wider">SENIOR MANAGER</div>
                <span className="text-xs text-foreground font-semibold">Tüm Veritabanı Otomatik SEO Onarımı</span>
              </div>
              
              <div className="flex items-center gap-2">
                {optimizingTitles ? (
                  <button
                    type="button"
                    onClick={() => { cancelTitleSEO.current = true; }}
                    className="px-3 py-1.5 rounded-lg bg-red-500/25 hover:bg-red-500/45 text-red-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Durdur / İptal Et
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={autoFixAllBrokenTitles}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Tüm Bozuk Başlıkları Tespit Et ve Onar
                  </button>
                )}
              </div>
            </div>

            <p className="text-[10px] text-muted-foreground font-medium">
              • Sisteme girilen tüm ürün isimlerini inceler. "Yedek Parça", "Motosiklet", "Ürün" gibi gereksiz kelimeleri içeren, büyük harf uyumsuzluğu olan veya biçimi bozuk başlıkları otomatik olarak tespit eder ve uluslararası ecommerce/SEO standartlarına uygun, temiz ve profesyonel hale getirir. Tüm işlemler arka planda partiler halinde yönetilir.
            </p>

            {optimizingTitles && (
              <div className="mt-2 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-purple-300 bg-purple-950/30 border border-purple-500/10 rounded-lg p-2.5">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    Optimizasyon Devam Ediyor: <strong className="text-white">{titleProgress}</strong>
                  </span>
                  <span>Lütfen tarayıcı penceresini kapatmayın.</span>
                </div>
              </div>
            )}

            {titleLogStr && (
              <div className="mt-1 font-mono text-[11px] bg-slate-950/90 text-slate-300 rounded-lg p-3 max-h-40 overflow-y-auto divide-y divide-slate-800 border border-slate-800">
                {titleLogStr.split("\n").filter(Boolean).map((line, idx) => (
                  <div key={idx} className={`py-1.5 ${line.includes("[BAŞARILI]") ? "text-emerald-400" : line.includes("[HATA]") ? "text-red-400" : "text-yellow-400"}`}>
                    {line}
                  </div>
                ))}
              </div>
            )}
          </div>

          {(selected.size > 0 || isAllDBSelected) && (
            <div className="flex flex-wrap gap-2 items-center pt-4 mt-1">
              <span className="text-xs font-semibold text-foreground mr-1">
                {isAllDBSelected ? `Sistemdeki Tüm ${totalProducts} Ürün` : `Seçili ${selected.size} Ürün`} İçin Toplu Eylemler:
              </span>
              <button
                onClick={() => bulkSetStatus(true)}
                className="px-3 py-1.5 rounded-md bg-green-500/10 text-green-500 hover:bg-green-500/20 text-xs font-bold transition-all border border-green-500/20"
              >
                Aktif Yap
              </button>
              <button
                onClick={() => bulkSetStatus(false)}
                className="px-3 py-1.5 rounded-md bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 text-xs font-bold transition-all border border-amber-500/20"
              >
                Pasif Yap
              </button>
              <button
                onClick={bulkDelete}
                className="px-3 py-1.5 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 text-xs font-bold transition-all border border-red-500/20 ml-auto"
              >
                Kalıcı Olarak Sil
              </button>
            </div>
          )}
        </div>

        {/* Gmail Style Selection Notification */}
        {(selected.size > 0 || isAllDBSelected) && !loading && totalProducts > filtered.length && (
          <div className="bg-primary/10 border border-primary/20 text-foreground text-xs font-semibold px-4 py-3 rounded-lg flex flex-wrap items-center justify-between gap-3 mb-4 transition-all">
            <div className="flex items-center gap-2">
              <span>Bu sayfadaki <strong>{isAllDBSelected ? totalProducts : selected.size}</strong> ürün seçildi. </span>
              {!isAllDBSelected && (
                <span className="text-muted-foreground mr-1">
                  Sistemde filtrelere uyan toplam <strong>{totalProducts}</strong> ürün var.
                </span>
              )}
            </div>
            {!isAllDBSelected ? (
              <button
                type="button"
                onClick={() => setIsAllDBSelected(true)}
                className="px-3 py-1 bg-primary text-primary-foreground hover:bg-primary/95 rounded text-xs font-bold cursor-pointer transition select-none"
              >
                Tüm {totalProducts} ürünü seç
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-emerald-500 font-bold flex items-center gap-1.5 bg-emerald-500/15 px-2.5 py-1 rounded">
                  <Check className="w-3.5 h-3.5" /> Sistemdeki filtreye uyan tüm {totalProducts} ürün seçildi!
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAllDBSelected(false);
                    setSelected(new Set());
                  }}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground underline cursor-pointer select-none"
                >
                  Seçimi Temizle
                </button>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center">
            <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">Ürün bulunamadı.</p>
          </div>
        ) : (
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm whitespace-nowrap min-w-[800px]">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-3 w-10">
                      <input
                        type="checkbox"
                        checked={isAllDBSelected || (filtered.length > 0 && selected.size === filtered.length)}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="text-left p-3 w-16">Görsel</th>
                    <th className="text-left p-3">Başlık</th>
                    <th className="text-left p-3">Marka</th>
                    <th className="text-left p-3">Stok</th>
                    <th className="text-left p-3 w-44">Fiyat</th>
                    <th className="text-left p-3">Durum</th>
                    <th className="text-right p-3">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-3">
                        <input type="checkbox" checked={isAllDBSelected || selected.has(p.id)} onChange={() => toggleSelect(p.id)} />
                      </td>
                      <td className="p-3">
                        {p.images?.[0] ? (
                          <img 
                            src={p.images[0]} 
                            alt={p.title || "Ürün Görseli"} 
                            loading="lazy"
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded object-cover aspect-square bg-muted flex-shrink-0" 
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                            <Package className="w-4 h-4 text-muted-foreground/40" />
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-foreground font-medium">{p.title}</td>
                      <td className="p-3 text-muted-foreground">{p.brand}</td>
                      <td className="p-3">
                        <StockCell 
                          p={p} 
                          toast={toast} 
                          onUpdate={(id, newStock) => setItems(prev => prev.map(item => item.id === id ? { ...item, stock: newStock } : item))} 
                        />
                      </td>
                      <td className="p-3">
                        <PriceCell 
                          p={p} 
                          toast={toast} 
                          onUpdate={(id, newPrice) => setItems(prev => prev.map(item => item.id === id ? { ...item, price: newPrice } : item))} 
                        />
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded ${p.is_active ? "bg-green-500/10 text-green-500" : "bg-muted text-muted-foreground"}`}>
                          {p.is_active ? "Aktif" : "Pasif"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="inline-flex gap-1">
                          <button onClick={() => openEdit(p)} className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => remove(p.id)} className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border bg-muted/20">
                <p className="text-sm text-muted-foreground">
                  Toplam {totalProducts} üründen {(page - 1) * ITEMS_PER_PAGE + 1} - {Math.min(page * ITEMS_PER_PAGE, totalProducts)} arası gösteriliyor.
                </p>
                <div className="flex gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3 py-1 rounded bg-secondary text-secondary-foreground disabled:opacity-50 text-sm"
                  >
                    Önceki
                  </button>
                  <button
                    disabled={!hasMore}
                    onClick={() => setPage(page + 1)}
                    className="px-3 py-1 rounded bg-secondary text-secondary-foreground disabled:opacity-50 text-sm"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setOpen(false)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-2xl my-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-xl text-foreground">{editing ? "Ürünü Düzenle" : "Yeni Ürün"}</h2>
              <button onClick={() => setOpen(false)} className="p-1 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
              <div>
                <label className="text-xs text-muted-foreground">Başlık *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: editing ? form.slug : slugify(e.target.value) })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Slug (URL)</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Marka *</label>
                  <input list="brand-options" required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" placeholder="Seçiniz veya yazınız..." />
                  <datalist id="brand-options">
                    {allBrands.map((b) => <option key={b} value={b} />)}
                  </datalist>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Kategori *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm">
                    <option value="yedek-parca">Yedek Parça</option>
                    <option value="motosiklet">Motosiklet</option>
                    <option value="aksesuar">Aksesuar</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Kısa Açıklama</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Detaylı İçerik (HTML destekli)</label>
                <textarea rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm font-mono" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Fiyat (₺)</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Stok Adedi</label>
                  <input type="number" required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm" />
                </div>
              </div>

               {/* SEO ALANI */}
              <div className="p-4 bg-muted/40 rounded-xl border border-border space-y-3">
                 <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                       <h3 className="font-heading font-semibold text-sm">SEO Bilgileri</h3>
                    </div>
                 </div>
                 <div>
                    <label className="text-xs text-muted-foreground">Meta Başlık</label>
                    <input value={form.meta_title} onChange={(e) => setForm({...form, meta_title: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm" />
                 </div>
                 <div>
                    <label className="text-xs text-muted-foreground">Meta Açıklama</label>
                    <textarea rows={2} value={form.meta_description} onChange={(e) => setForm({...form, meta_description: e.target.value})} className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm resize-none" />
                 </div>
              </div>

              {/* IMAGES */}
              <div>
                <label className="text-xs text-muted-foreground">Görseller</label>

                {/* Drag & drop / upload */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
                  }}
                  className={`mt-1 rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
                    dragOver ? "border-primary bg-primary/5" : "border-border bg-muted/30"
                  }`}
                >
                  <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground mb-2">
                    Görselleri buraya sürükleyin veya{" "}
                    <button type="button" onClick={() => fileRef.current?.click()} className="text-primary underline">
                      dosya seçin
                    </button>
                    {" "}(çoklu seçim destekli)
                  </p>
                  <input
                    ref={fileRef} type="file" accept="image/*" multiple hidden
                    onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                  />
                  {uploading && (
                    <div className="inline-flex items-center gap-2 text-xs text-primary">
                      <Loader2 className="w-3 h-3 animate-spin" /> Yükleniyor…
                    </div>
                  )}
                </div>

                {/* Link add */}
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={linkInput} onChange={(e) => setLinkInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLink(); } }}
                      placeholder="https://… görsel URL'si yapıştır"
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-muted border border-border text-foreground text-sm"
                    />
                  </div>
                  <button type="button" onClick={addLink} className="px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-medium hover:bg-muted/70">
                    Ekle
                  </button>
                </div>

                {/* Preview grid */}
                {form.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {form.images.map((url, i) => (
                      <div key={i} className="group relative rounded-lg overflow-hidden border border-border bg-muted aspect-square">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button type="button" onClick={() => moveImage(i, i - 1)} disabled={i === 0} className="p-1 rounded bg-background/80 text-foreground disabled:opacity-30">
                            <GripVertical className="w-3 h-3 rotate-90" />
                          </button>
                          <button type="button" onClick={() => removeImage(i)} className="p-1 rounded bg-destructive text-destructive-foreground">
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button type="button" onClick={() => moveImage(i, i + 1)} disabled={i === form.images.length - 1} className="p-1 rounded bg-background/80 text-foreground disabled:opacity-30">
                            <GripVertical className="w-3 h-3 -rotate-90" />
                          </button>
                        </div>
                        {i === 0 && (
                          <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground font-medium">
                            Kapak
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Aktif
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Öne Çıkan
                </label>
              </div>
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
      {isScanning && (
        <BarcodeScanner 
          onScan={handleScan} 
          onClose={() => setIsScanning(false)} 
        />
      )}

      {/* Barcode Match/Action Modal */}
      {barcodeActionData && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-4" onClick={() => setBarcodeActionData(null)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-heading font-bold text-xl text-foreground flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-primary" /> Barkod Bulunamadı
              </h2>
              <button onClick={() => setBarcodeActionData(null)} className="p-1 hover:bg-muted rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-muted/50 rounded-xl border border-border flex items-center justify-between">
               <span className="text-sm text-muted-foreground font-medium">Okunan Barkod:</span>
               <span className="font-mono font-bold text-lg text-foreground tracking-wider">{barcodeActionData.barcode}</span>
            </div>

            <button 
               onClick={handleCreateNewFromBarcode}
               className="w-full flex items-center justify-center gap-2 py-3.5 mb-6 rounded-xl border-2 border-primary bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
               <Plus className="w-5 h-5" /> Yeni Ürün Olarak Ekle
            </button>

            <div className="relative mb-6">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
               <div className="relative flex justify-center"><span className="bg-background px-4 text-xs text-muted-foreground uppercase tracking-widest font-semibold">veya Mevcut Bir Ürüne Ata</span></div>
            </div>

            <div className="flex-1 flex flex-col min-h-0">
               <div className="relative mb-3">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    placeholder="Mevcut ürünlerde ara..." 
                    value={barcodeAssignQuery} 
                    onChange={e => setBarcodeAssignQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-border bg-background rounded-lg text-sm focus:ring-2 ring-primary/20 outline-none"
                  />
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                 {barcodeAssignFilteredItems.map(p => (
                   <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors group">
                      <div className="flex items-center gap-3 min-w-0 pr-3">
                         {p.images?.[0] ? (
                            <img src={p.images[0]} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                         ) : (
                            <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                               <Package className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                         )}
                         <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-foreground truncate">{p.title}</h4>
                            <p className="text-xs text-muted-foreground truncate">{p.brand} · {tl(p.price)}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => handleAssignBarcode(p)}
                        disabled={isAssigningBarcode}
                        className="flex-shrink-0 bg-secondary hover:bg-primary hover:text-primary-foreground text-secondary-foreground text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
                      >
                         Ata
                      </button>
                   </div>
                 ))}
                 {barcodeAssignFilteredItems.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">Ürün bulunamadı.</div>
                 )}
               </div>
            </div>

          </div>
        </div>
      )}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setConfirmModal(null)}>
          <div className="glass-card rounded-2xl p-6 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-heading font-bold text-xl text-foreground mb-2">Silme İşlemini Onayla</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {confirmModal.bulk 
                ? `Seçili ${selected.size} ürünü kalıcı olarak silmek istediğinize emin misiniz?` 
                : "Bu ürünü kalıcı olarak silmek istediğinize emin misiniz?"}
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setConfirmModal(null)} 
                className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/90"
              >
                İptal
              </button>
              <button 
                onClick={confirmDeleteAction} 
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
              >
                Kalıcı Olarak Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
