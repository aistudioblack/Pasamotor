import { useState, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { MOTORCYCLES_QUERY_KEY } from "@/hooks/useMotorcycles";
import {
  Gauge,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  X,
  Loader2,
  Image as ImageIcon,
  Palette,
  ShieldCheck,
  Award,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Copy,
  RotateCcw,
  Upload,
  Link as LinkIcon,
  ArrowUp,
  ArrowDown,
  Star,
  Maximize2,
  FileImage,
  Check,
  Pipette,
  Wand2,
  Info,
  CheckCheck
} from "lucide-react";
import { MOTORCYCLES, Motorcycle, MotorcycleColor, MotorcycleSpecs } from "@/data/motorcycles";
import { secureStorage } from "@/lib/secure-storage";
import { adminFetch } from "@/lib/api-client";
import { convertToWebP, getWebPFileName } from "@/lib/imageOptimization";
import {
  normalizeHex,
  getClosestColorName,
  matchColorNameInput
} from "@/lib/colorUtils";

const CATEGORIES = [
  "SCOOTER",
  "CUB",
  "TOURING",
  "CHOPPER",
  "E-CAR",
  "ENDURO / CROSS",
  "E-GRUP",
  "E-TRICYCLE",
  "UTV",
  "GOLF BUGGY",
  "ÇOCUK GRUBU",
  "KLASİK"
] as const;

const BRANDS = ["MotoLux", "Kuba", "RKS", "Mondial", "TVS", "Falcon", "Işıldar", "Honda", "Yamaha", "Diğer"];

const defaultEmptyForm: Omit<Motorcycle, "id"> & { id?: string } = {
  slug: "",
  brand: "MotoLux",
  model: "",
  tagline: "Resmî Yetkili Satış Noktası",
  category: "SCOOTER",
  engineSize: "125cc",
  licenseType: "B (125cc Yasası Uyumlu) / A1",
  price: 0,
  condition: "0 KM Sıfır",
  featured: false,
  images: [""],
  colors: [
    { name: "Parlak Kırmızı", hex: "#dc2626" },
    { name: "Mat Siyah", hex: "#171717" }
  ],
  specs: {
    engineCapacity: "125 cc",
    maxPower: "9.5 HP",
    maxTorque: "10.2 Nm",
    transmission: "Otomatik CVT",
    cooling: "Hava Soğutmalı",
    brakes: "Ön Disk / Arka Kampana (CBS)",
    fuelTankOrBattery: "5.5 Litre",
    weight: "108 kg",
    licenseRequirement: "B Sınıfı (125cc Uyumlu) veya A1"
  },
  features: [
    "Dijital Gösterge Paneli",
    "LED Ön ve Arka Aydınlatma Grubu",
    "Geniş Sele Altı Bagaj Hacmi",
    "Kombine Fren Sistemi (CBS)"
  ],
  giftPackage: ["Kask", "Brand Koruma Örtüsü", "Zincir Kilidi"],
  description: "Yüksek performans, düşük yakıt tüketimi ve şık tasarım. Şehir içi ve uzun yol sürüşleri için ideal.",
  warranty: "2 Yıl veya 30.000 KM Resmî Fabrika Garantisi"
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function AdminMotorcycles() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);

  // Filters & View
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<Motorcycle | null>(null);
  const [form, setForm] = useState(defaultEmptyForm);
  const [activeTab, setActiveTab] = useState<"general" | "media" | "specs" | "colors" | "features">("general");

  // Image Upload & Gallery State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imageLinkInput, setImageLinkInput] = useState("");
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  // New item inputs in modal
  const [newColorName, setNewColorName] = useState("MotoLux Kırmızı");
  const [newColorHex, setNewColorHex] = useState("#dc2626");
  const [newColorHexInput, setNewColorHexInput] = useState("#dc2626");
  const [autoDetectedName, setAutoDetectedName] = useState("MotoLux Kırmızı");
  const [copiedColorHex, setCopiedColorHex] = useState<string | null>(null);
  const [newFeatureText, setNewFeatureText] = useState("");
  const [newGiftText, setNewGiftText] = useState("");

  // Color recognition & smart input handlers
  const handleHexInputChange = (inputVal: string) => {
    setNewColorHexInput(inputVal);
    const normalized = normalizeHex(inputVal);
    if (normalized) {
      setNewColorHex(normalized);
      const detected = getClosestColorName(normalized);
      setAutoDetectedName(detected);
      setNewColorName(detected);
    }
  };

  const handleColorNameInputChange = (inputVal: string) => {
    setNewColorName(inputVal);
    const matched = matchColorNameInput(inputVal);
    if (matched) {
      setNewColorHex(matched.hex);
      setNewColorHexInput(matched.hex);
      setAutoDetectedName(matched.name);
    }
  };

  const handleNativeColorPickerChange = (hexVal: string) => {
    const norm = normalizeHex(hexVal) || hexVal;
    setNewColorHex(norm);
    setNewColorHexInput(norm);
    const detected = getClosestColorName(norm);
    setAutoDetectedName(detected);
    setNewColorName(detected);
  };

  const handleEyeDropperPick = async () => {
    if (typeof window !== "undefined" && "EyeDropper" in window) {
      try {
        // @ts-expect-error Browser EyeDropper API
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          const hex = result.sRGBHex.toLowerCase();
          const norm = normalizeHex(hex) || hex;
          setNewColorHex(norm);
          setNewColorHexInput(norm);
          const detected = getClosestColorName(norm);
          setAutoDetectedName(detected);
          setNewColorName(detected);
          toast({
            title: "Renk Damlalıkla Seçildi",
            description: `${detected} (${norm}) rengi başarıyla algılandı.`
          });
        }
      } catch {
        // User cancelled picker
      }
    } else {
      toast({
        title: "Tarayıcı Desteği",
        description: "Damlalık aracı bu tarayıcıda desteklenmiyor. Renk kodunu manuel girebilirsiniz.",
        variant: "destructive"
      });
    }
  };

  const handleAddColorToForm = () => {
    const finalHex = normalizeHex(newColorHexInput) || newColorHex;
    const finalName = newColorName.trim() || autoDetectedName || "Özel Renk";
    
    // Check if color already exists
    const exists = form.colors.some(
      (c) => c.hex.toLowerCase() === finalHex.toLowerCase() && c.name.toLowerCase() === finalName.toLowerCase()
    );
    if (exists) {
      toast({
        title: "Renk Zaten Mevcut",
        description: "Bu renk paletinizde zaten ekli.",
        variant: "destructive"
      });
      return;
    }

    setForm({
      ...form,
      colors: [...form.colors, { name: finalName, hex: finalHex }]
    });

    toast({
      title: "Renk Eklendi",
      description: `${finalName} (${finalHex}) palete dahil edildi.`
    });

    // Reset with pleasant default or keep next
    setNewColorName("");
  };

  const handleMoveColor = (index: number, direction: "up" | "down") => {
    const newColors = [...form.colors];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newColors.length) return;
    const temp = newColors[index];
    newColors[index] = newColors[targetIdx];
    newColors[targetIdx] = temp;
    setForm({ ...form, colors: newColors });
  };

  const handleUpdateColorItem = (index: number, field: "name" | "hex", value: string) => {
    const newColors = [...form.colors];
    if (field === "name") {
      newColors[index] = { ...newColors[index], name: value };
    } else {
      const norm = normalizeHex(value);
      newColors[index] = { ...newColors[index], hex: norm || value };
    }
    setForm({ ...form, colors: newColors });
  };

  const handleUpdateColorImage = (colorIndex: number, imageIdx: number | null) => {
    const newColors = [...form.colors];
    if (imageIdx === null) {
      const updated = { ...newColors[colorIndex] };
      delete updated.imageIndex;
      delete updated.imageUrl;
      newColors[colorIndex] = updated;
    } else {
      newColors[colorIndex] = {
        ...newColors[colorIndex],
        imageIndex: imageIdx,
        imageUrl: form.images[imageIdx] || undefined
      };
    }
    setForm({ ...form, colors: newColors });
    toast({
      title: "Görsel Eşleşmesi Güncellendi",
      description: imageIdx !== null 
        ? `"${newColors[colorIndex].name}" rengi #${imageIdx + 1}. Görsel ile eşleştirildi.` 
        : `"${newColors[colorIndex].name}" renginin görsel eşleşmesi kaldırıldı.`
    });
  };

  const handleAutoPairColorsWithImages = () => {
    const newColors = form.colors.map((c, idx) => ({
      ...c,
      imageIndex: idx < form.images.length ? idx : undefined,
      imageUrl: idx < form.images.length ? form.images[idx] : undefined
    }));
    setForm({ ...form, colors: newColors });
    toast({
      title: "Sıralı Eşleştirme Yapıldı",
      description: "Renkler sırasıyla 1, 2, 3... numaralı görsellerle eşleştirildi."
    });
  };

  const handleCopyColorHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColorHex(hex);
    toast({
      title: "HEX Kopyalandı",
      description: `${hex} panoya kopyalandı.`
    });
    setTimeout(() => setCopiedColorHex(null), 2000);
  };

  const handleUploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || f.name.endsWith(".svg") || f.name.endsWith(".webp")
    );
    if (arr.length === 0) {
      toast({
        title: "Geçersiz Dosya Türü",
        description: "Lütfen sadece görsel dosyaları seçin (PNG, JPG, JPEG, WEBP, SVG).",
        variant: "destructive"
      });
      return;
    }
    setUploadingImages(true);
    const uploadedUrls: string[] = [];
    for (const f of arr) {
      try {
        let webpBlob: Blob = f;
        let webpName = f.name;
        if (!f.name.endsWith(".svg")) {
          webpBlob = await convertToWebP(f);
          webpName = getWebPFileName(f.name);
        }
        const path = `motorcycle-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${webpName}`;

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
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            file: base64String,
            fileName: path,
            bucket: "motorcycle-images"
          })
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || "Görsel yüklenirken sunucu hatası oluştu.");
        }

        uploadedUrls.push(result.publicUrl);
      } catch (err: any) {
        toast({
          title: `Yükleme Hatası: ${f.name}`,
          description: err.message || "Görsel yüklenemedi.",
          variant: "destructive"
        });
      }
    }

    if (uploadedUrls.length > 0) {
      setForm((prev) => {
        const existing = prev.images.filter((img) => img.trim() !== "");
        return {
          ...prev,
          images: [...existing, ...uploadedUrls]
        };
      });
      toast({
        title: "Görseller Yüklendi",
        description: `${uploadedUrls.length} adet görsel başarıyla WebP olarak optimize edilip kataloğa eklendi.`
      });
    }
    setUploadingImages(false);
  };

  const handleAddImageLink = () => {
    const url = imageLinkInput.trim();
    if (!url) return;
    if (!/^https?:\/\//i.test(url) && !url.startsWith("/")) {
      toast({
        title: "Geçersiz Bağlantı",
        description: "Lütfen geçerli bir http/https görsel bağlantısı giriniz.",
        variant: "destructive"
      });
      return;
    }
    setForm((prev) => {
      const existing = prev.images.filter((img) => img.trim() !== "");
      return {
        ...prev,
        images: [...existing, url]
      };
    });
    setImageLinkInput("");
    toast({
      title: "Görsel Bağlantısı Eklendi",
      description: "Görsel başarıyla model galerisine dahil edildi."
    });
  };

  const handleSetCoverImage = (index: number) => {
    if (index === 0) return;
    setForm((prev) => {
      const imgs = [...prev.images.filter((img) => img.trim() !== "")];
      const target = imgs.splice(index, 1)[0];
      imgs.unshift(target);
      return { ...prev, images: imgs };
    });
    toast({
      title: "Ana Görsel Ayarlandı",
      description: "Seçilen görsel ana vitrin kapağı yapıldı."
    });
  };

  const handleMoveImage = (index: number, direction: "up" | "down") => {
    setForm((prev) => {
      const imgs = [...prev.images.filter((img) => img.trim() !== "")];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= imgs.length) return prev;
      const temp = imgs[index];
      imgs[index] = imgs[targetIndex];
      imgs[targetIndex] = temp;
      return { ...prev, images: imgs };
    });
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => {
      const imgs = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: imgs.length > 0 ? imgs : [""]
      };
    });
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Check database site_content for motorcycles
      const { data, error } = await dbClient
        .from("site_content")
        .select("*")
        .eq("page_key", "motorcycles_catalog")
        .maybeSingle();

      if (data && Array.isArray(data.sections) && data.sections.length > 0) {
        setRecordId(data.id);
        setMotorcycles(data.sections as unknown as Motorcycle[]);
      } else {
        // Fallback to local data and save initialized snapshot
        setMotorcycles(MOTORCYCLES);
      }
    } catch (err: any) {
      console.warn("Motosiklet verisi yüklenirken yerel kataloğa geçildi:", err);
      setMotorcycles(MOTORCYCLES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveCatalogToDb = async (updatedList: Motorcycle[]) => {
    setSaving(true);
    try {
      if (recordId) {
        const { error } = await dbClient
          .from("site_content")
          .update({
            sections: updatedList as any,
            updated_at: new Date().toISOString()
          })
          .eq("id", recordId);

        if (error) throw error;
      } else {
        const { data, error } = await dbClient
          .from("site_content")
          .insert({
            page_key: "motorcycles_catalog",
            sections: updatedList as any
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setRecordId(data.id);
      }

      setMotorcycles(updatedList);
      queryClient.invalidateQueries({ queryKey: MOTORCYCLES_QUERY_KEY });
      toast({
        title: "Katalog Güncellendi",
        description: "Motosiklet modeli değişiklikleri başarıyla kaydedildi."
      });
    } catch (err: any) {
      toast({
        title: "Kayıt Başarısız",
        description: err.message || "Veritabanı güncellenemedi.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingBike(null);
    setForm(defaultEmptyForm);
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bike: Motorcycle) => {
    setEditingBike(bike);
    setForm({
      ...bike,
      images: bike.images && bike.images.length > 0 ? bike.images : [""],
      colors: bike.colors || [],
      specs: { ...defaultEmptyForm.specs, ...(bike.specs || {}) },
      features: bike.features || [],
      giftPackage: bike.giftPackage || []
    });
    setActiveTab("general");
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`"${name}" motosiklet modelini katalogdan silmek istediğinize emin misiniz?`)) {
      return;
    }
    const updated = motorcycles.filter((m) => m.id !== id);
    saveCatalogToDb(updated);
  };

  const handleDuplicate = (bike: Motorcycle) => {
    const newId = `${bike.slug}-kopya-${Date.now().toString().slice(-4)}`;
    const newModel: Motorcycle = {
      ...bike,
      id: newId,
      slug: `${bike.slug}-kopya`,
      model: `${bike.model} (Kopya)`,
      featured: false
    };
    const updated = [newModel, ...motorcycles];
    saveCatalogToDb(updated);
    toast({
      title: "Model Çoğaltıldı",
      description: `"${bike.model}" kopyalandı ve kataloğa eklendi.`
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.brand.trim() || !form.model.trim()) {
      toast({
        title: "Eksik Bilgi",
        description: "Lütfen marka ve model adını giriniz.",
        variant: "destructive"
      });
      return;
    }

    const calculatedSlug = form.slug?.trim() || slugify(`${form.brand}-${form.model}`);
    const validImages = form.images.filter((img) => img.trim() !== "");

    if (editingBike) {
      const updatedList = motorcycles.map((m) =>
        m.id === editingBike.id
          ? ({
              ...form,
              id: editingBike.id,
              slug: calculatedSlug,
              images: validImages.length > 0 ? validImages : ["/placeholder-bike.png"]
            } as Motorcycle)
          : m
      );
      saveCatalogToDb(updatedList);
    } else {
      const newBike: Motorcycle = {
        ...(form as any),
        id: `${slugify(form.brand)}-${slugify(form.model)}-${Date.now().toString().slice(-4)}`,
        slug: calculatedSlug,
        images: validImages.length > 0 ? validImages : ["/placeholder-bike.png"]
      };
      const updatedList = [newBike, ...motorcycles];
      saveCatalogToDb(updatedList);
    }

    setIsModalOpen(false);
  };

  // Reset to default catalog if needed
  const handleResetToDefault = () => {
    if (window.confirm("Kataloğu fabrika varsayılanlarına (orijinal MotoLux veritabanına) sıfırlamak istiyor musunuz?")) {
      saveCatalogToDb(MOTORCYCLES);
    }
  };

  // Filtered list
  const filteredBikes = useMemo(() => {
    return motorcycles.filter((bike) => {
      const matchesSearch =
        searchQuery === "" ||
        bike.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.engineSize?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bike.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesBrand = selectedBrand === "all" || bike.brand.toLowerCase() === selectedBrand.toLowerCase();
      const matchesCategory = selectedCategory === "all" || bike.category === selectedCategory;

      return matchesSearch && matchesBrand && matchesCategory;
    });
  }, [motorcycles, searchQuery, selectedBrand, selectedCategory]);

  const uniqueBrands = useMemo(() => {
    const brandsSet = new Set(motorcycles.map((m) => m.brand));
    return Array.from(brandsSet);
  }, [motorcycles]);

  return (
    <AdminLayout>
      <div className="space-y-6 pb-20">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-card/60 p-6 rounded-2xl border border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" /> Araç Kataloğu
              </span>
              <span className="text-xs text-muted-foreground">· Paşa Motor Showroom</span>
            </div>
            <h1 className="font-heading font-black text-2xl md:text-3xl text-foreground">
              Motosiklet & Araç Modelleri
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sıfır motosiklet, scooter, e-car, ATV/UTV modellerini, teknik özelliklerini ve renk seçeneklerini yönetin.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleResetToDefault}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium border border-border transition-colors"
              title="Varsayılan kataloğu geri yükle"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Varsayılana Dön
            </button>
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all shadow-md shadow-red-600/20 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" /> Yeni Motosiklet Ekle
            </button>
          </div>
        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <span className="text-xs text-muted-foreground font-medium">Toplam Model</span>
            <div className="text-2xl font-heading font-black text-foreground mt-1">{motorcycles.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <span className="text-xs text-muted-foreground font-medium">Farklı Marka</span>
            <div className="text-2xl font-heading font-black text-foreground mt-1">{uniqueBrands.length}</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <span className="text-xs text-muted-foreground font-medium">Vitrin / Öne Çıkan</span>
            <div className="text-2xl font-heading font-black text-red-500 mt-1">
              {motorcycles.filter((m) => m.featured).length}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <span className="text-xs text-muted-foreground font-medium">Filtrelenen Sonuç</span>
            <div className="text-2xl font-heading font-black text-foreground mt-1">{filteredBikes.length}</div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="p-4 rounded-2xl bg-card border border-border flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Model adı, marka veya motor hacmi ile ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-muted/60 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none"
            >
              <option value="all">Tüm Markalar ({uniqueBrands.length})</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-semibold focus:outline-none"
            >
              <option value="all">Tüm Kategoriler</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="flex items-center border border-border rounded-xl bg-muted/40 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Kart Görünümü"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  viewMode === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
                title="Tablo Görünümü"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Motorcycle List */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Motosiklet modelleri yükleniyor...</p>
          </div>
        ) : filteredBikes.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-card border border-border">
            <Gauge className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-heading font-bold text-lg text-foreground mb-1">Aramaya Uygun Model Bulunamadı</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Arama kriterlerinizi değiştirebilir veya yeni bir motosiklet ekleyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedBrand("all");
                setSelectedCategory("all");
              }}
              className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredBikes.map((bike) => (
              <div
                key={bike.id}
                className="group rounded-2xl bg-card border border-border/80 hover:border-red-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-sm hover:shadow-md"
              >
                {/* Image & Badges */}
                <div className="relative h-48 bg-muted/40 p-4 flex items-center justify-center overflow-hidden border-b border-border/60">
                  {bike.featured && (
                    <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Vitrin
                    </span>
                  )}
                  <span className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md bg-background/80 backdrop-blur-sm border border-border text-muted-foreground text-[10px] font-bold">
                    {bike.category}
                  </span>

                  <img
                    src={bike.images?.[0] || "/placeholder-bike.png"}
                    alt={bike.model}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-[11px] font-bold text-red-500 uppercase tracking-wider">{bike.brand}</div>
                    <h3 className="font-heading font-black text-base text-foreground line-clamp-1">{bike.model}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{bike.tagline}</p>
                  </div>

                  {/* Specs & Colors preview */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> {bike.engineSize || "N/A"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] truncate max-w-[140px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{" "}
                        {bike.licenseType?.split("/")[0]?.trim() || "B/A1"}
                      </span>
                    </div>

                    {/* Color palette dots */}
                    {bike.colors && bike.colors.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-1">
                        {bike.colors.map((c, idx) => (
                          <span
                            key={idx}
                            className="w-3 h-3 rounded-full border border-border shadow-xs"
                            style={{ backgroundColor: c.hex }}
                            title={c.name}
                          />
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-1">{bike.colors.length} Renk</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2">
                    <a
                      href={`/magaza/${bike.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground text-xs font-semibold transition-colors"
                      title="Mağazada Canlı Gör"
                    >
                      <Eye className="w-3.5 h-3.5" /> İncele
                    </a>
                    <button
                      onClick={() => handleOpenEdit(bike)}
                      className="inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(bike.id, `${bike.brand} ${bike.model}`)}
                      className="inline-flex items-center justify-center gap-1 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-semibold transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-muted-foreground text-xs uppercase font-bold border-b border-border">
                  <tr>
                    <th className="p-4">Görsel & Model</th>
                    <th className="p-4">Marka / Kategori</th>
                    <th className="p-4">Motor & Ehliyet</th>
                    <th className="p-4">Renkler</th>
                    <th className="p-4">Vitrin</th>
                    <th className="p-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredBikes.map((bike) => (
                    <tr key={bike.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={bike.images?.[0] || "/placeholder-bike.png"}
                            alt={bike.model}
                            className="w-12 h-12 rounded-lg bg-muted object-contain p-1 border border-border"
                          />
                          <div>
                            <div className="font-heading font-bold text-foreground">{bike.model}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{bike.tagline}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-xs text-foreground">{bike.brand}</div>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground border border-border">
                          {bike.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-xs font-bold text-amber-500">{bike.engineSize || "N/A"}</div>
                        <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">{bike.licenseType}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {bike.colors?.map((c, i) => (
                            <span
                              key={i}
                              className="w-3 h-3 rounded-full border border-border"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        {bike.featured ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold">
                            Vitrin
                          </span>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">Standart</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <a
                            href={`/magaza/${bike.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground"
                            title="Mağazada Gör"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleDuplicate(bike)}
                            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground"
                            title="Çoğalt"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(bike)}
                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                            title="Düzenle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(bike.id, `${bike.brand} ${bike.model}`)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal for Create / Edit */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
                <div>
                  <h2 className="font-heading font-black text-xl text-foreground">
                    {editingBike ? `Motosiklet Düzenle: ${editingBike.model}` : "Yeni Motosiklet / Araç Modeli Ekle"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Modelin vitrin bilgilerini, teknik donanımını ve renk opsiyonlarını yapılandırın.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-border bg-muted/20 px-6 gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveTab("general")}
                  className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === "general"
                      ? "border-red-500 text-red-500"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Gauge className="w-4 h-4" /> Temel Bilgiler
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("media")}
                  className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === "media"
                      ? "border-red-500 text-red-500"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  Görseller & Galeri ({form.images.filter((img) => img.trim() !== "").length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("specs")}
                  className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === "specs"
                      ? "border-red-500 text-red-500"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Zap className="w-4 h-4" /> Teknik Özellikler
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("colors")}
                  className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === "colors"
                      ? "border-red-500 text-red-500"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Palette className="w-4 h-4" /> Renk Paleti ({form.colors.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("features")}
                  className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === "features"
                      ? "border-red-500 text-red-500"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Award className="w-4 h-4" /> Donanım & Hediye Paketi
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                {activeTab === "general" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-foreground">Marka *</label>
                        <select
                          value={form.brand}
                          onChange={(e) => setForm({ ...form, brand: e.target.value })}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                          required
                        >
                          {BRANDS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-foreground">Model Adı *</label>
                        <input
                          type="text"
                          placeholder="Örn: AFRICA WOLF 2, TANGO 50, F5..."
                          value={form.model}
                          onChange={(e) => {
                            const newModel = e.target.value;
                            setForm({
                              ...form,
                              model: newModel,
                              slug: !editingBike ? slugify(`${form.brand}-${newModel}`) : form.slug
                            });
                          }}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-foreground">URL Bağlantısı (Slug)</label>
                        <input
                          type="text"
                          placeholder="motolux-africa-wolf-2"
                          value={form.slug}
                          onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-xs font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-foreground">Kategori</label>
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-foreground">Motor Hacmi / Gücü</label>
                        <input
                          type="text"
                          placeholder="Örn: 50cc, 125cc, 250cc, 2000W Elektrikli..."
                          value={form.engineSize}
                          onChange={(e) => setForm({ ...form, engineSize: e.target.value })}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-foreground">Ehliyet Şartı</label>
                        <input
                          type="text"
                          placeholder="Örn: B Sınıfı (125cc Yasası Uyumlu) / A1"
                          value={form.licenseType}
                          onChange={(e) => setForm({ ...form, licenseType: e.target.value })}
                          className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground">Slogan / Başlık</label>
                      <input
                        type="text"
                        placeholder="Resmî MotoLux Yetkili Satış Bayisi"
                        value={form.tagline}
                        onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                        className="w-full mt-1.5 px-3 py-2.5 rounded-xl bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground">Açıklama</label>
                      <textarea
                        rows={3}
                        placeholder="Model hakkında genel tanıtım metni..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
                      />
                    </div>

                    {/* Quick Image Summary & Upload Card */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-red-500" />
                          <span className="text-xs font-bold text-foreground">Model Görseli & Vitrin Kapağı</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab("media")}
                          className="text-xs font-bold text-red-500 hover:text-red-400 inline-flex items-center gap-1"
                        >
                          Tüm Galeriyi Yönet ({form.images.filter((img) => img.trim() !== "").length})
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {form.images[0] && form.images[0].trim() !== "" ? (
                          <div className="relative group w-32 h-24 rounded-xl border border-border overflow-hidden bg-muted/80 flex items-center justify-center shrink-0">
                            <img
                              src={form.images[0]}
                              alt="Ana Kapak Görseli"
                              className="w-full h-full object-contain p-1"
                            />
                            <div className="absolute top-1 left-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                              Kapak
                            </div>
                          </div>
                        ) : (
                          <div className="w-32 h-24 rounded-xl border-2 border-dashed border-border bg-muted/20 flex flex-col items-center justify-center text-muted-foreground shrink-0">
                            <FileImage className="w-6 h-6 mb-1 opacity-50" />
                            <span className="text-[10px]">Görsel Yok</span>
                          </div>
                        )}

                        <div className="flex-1 w-full space-y-2">
                          <p className="text-xs text-muted-foreground">
                            Cihazınızdan yeni motosiklet fotoğrafları yükleyebilir veya doğrudan web URL adresi girebilirsiniz.
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab("media");
                                setTimeout(() => fileInputRef.current?.click(), 100);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              Fotoğraf Yükle (WebP)
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveTab("media")}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted border border-border hover:bg-muted/80 text-foreground font-bold text-xs transition-colors"
                            >
                              <Layers className="w-3.5 h-3.5" />
                              Galeri & Sıralama
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Featured checkbox */}
                    <div className="flex items-center gap-3 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.featured}
                          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                          className="w-4 h-4 text-red-600 rounded bg-muted border-border focus:ring-red-500"
                        />
                        <span className="text-xs font-bold text-foreground">
                          Ana Sayfa & Vitrinde Öne Çıkar (Hero Showroom)
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Media / Images & Gallery Tab */}
                {activeTab === "media" && (
                  <div className="space-y-6">
                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          handleUploadFiles(e.target.files);
                          e.target.value = "";
                        }
                      }}
                      className="hidden"
                    />

                    {/* Drag & Drop Upload Zone */}
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDragOver(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDragOver(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDragOver(false);
                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                          handleUploadFiles(e.dataTransfer.files);
                        }
                      }}
                      onClick={() => !uploadingImages && fileInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                        dragOver
                          ? "border-red-500 bg-red-500/10 scale-[1.01]"
                          : "border-border hover:border-red-500/60 bg-muted/20 hover:bg-muted/40"
                      }`}
                    >
                      {uploadingImages ? (
                        <div className="py-6 flex flex-col items-center gap-3">
                          <Loader2 className="w-10 h-10 animate-spin text-red-500" />
                          <div className="text-sm font-bold text-foreground">
                            Görseller WebP formatına dönüştürülüp yükleniyor...
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Lütfen işlem tamamlanana kadar bekleyiniz.
                          </p>
                        </div>
                      ) : (
                        <div className="py-2 flex flex-col items-center gap-3">
                          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-inner">
                            <Upload className="w-7 h-7" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">
                              Görselleri Sürükleyip Bırakın veya Seçmek İçin Tıklayın
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Çoklu görsel seçimi desteklenir. PNG, JPG, JPEG, WEBP veya SVG formatları kabul edilir.
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground border border-border">
                              Otomatik WebP Optimizasyonu
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground border border-border">
                              Şeffaf / Dekupe Uyumlu
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-mono text-muted-foreground border border-border">
                              Yüksek Çözünürlük
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              fileInputRef.current?.click();
                            }}
                            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all"
                          >
                            <Upload className="w-4 h-4" />
                            Bilgisayardan / Cihazdan Görsel Seç
                          </button>
                        </div>
                      )}
                    </div>

                    {/* URL Input Bar */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-2">
                      <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        Veya Doğrudan Görsel URL Bağlantısı Ekleyin
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://... (Örn: https://motolux.com.tr/wp-content/...)"
                          value={imageLinkInput}
                          onChange={(e) => setImageLinkInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddImageLink();
                            }
                          }}
                          className="flex-1 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-xs font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddImageLink}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs whitespace-nowrap transition-colors"
                        >
                          URL Ekle
                        </button>
                      </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-red-500" />
                          Model Görselleri & Sıralama ({form.images.filter((img) => img.trim() !== "").length} Görsel)
                        </h3>
                        <span className="text-[11px] text-muted-foreground">
                          * İlk görsel ana sayfa ve katalog kapak görseli olarak kullanılır.
                        </span>
                      </div>

                      {form.images.filter((img) => img.trim() !== "").length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-muted/20 border border-border border-dashed text-muted-foreground">
                          <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          <p className="text-xs font-bold">Henüz görsel eklenmedi.</p>
                          <p className="text-[11px] mt-0.5">Yukarıdaki yükleme alanını kullanarak görsel ekleyebilirsiniz.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {form.images
                            .filter((img) => img.trim() !== "")
                            .map((img, idx) => (
                              <div
                                key={idx}
                                className={`relative rounded-2xl border overflow-hidden flex flex-col transition-all group bg-card ${
                                  idx === 0
                                    ? "border-amber-500/70 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30"
                                    : "border-border hover:border-border/80"
                                }`}
                              >
                                {/* Thumbnail Box with dark pattern */}
                                <div className="relative aspect-4/3 w-full bg-slate-950/80 flex items-center justify-center p-2 overflow-hidden">
                                  <img
                                    src={img}
                                    alt={`Görsel ${idx + 1}`}
                                    className="max-h-full max-w-full object-contain drop-shadow-md transition-transform group-hover:scale-105"
                                  />

                                  {/* Badges */}
                                  <div className="absolute top-2 left-2 flex items-center gap-1">
                                    <span className="px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] font-mono font-bold text-white">
                                      #{idx + 1}
                                    </span>
                                    {idx === 0 && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-black text-[10px] font-black shadow-xs">
                                        <Star className="w-3 h-3 fill-black" />
                                        Ana Kapak
                                      </span>
                                    )}
                                  </div>

                                  {/* Quick Zoom Button */}
                                  <button
                                    type="button"
                                    onClick={() => setPreviewModalImage(img)}
                                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Tam Ekran Önizle"
                                  >
                                    <Maximize2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Action Controls Footer */}
                                <div className="p-2 bg-muted/40 border-t border-border flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1">
                                    {idx > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => handleSetCoverImage(idx)}
                                        className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 font-bold text-[10px] transition-colors"
                                        title="Bu görseli ana kapak yap"
                                      >
                                        Kapak Yap
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      disabled={idx === 0}
                                      onClick={() => handleMoveImage(idx, "up")}
                                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-30"
                                      title="Öne Taşı"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={idx === form.images.filter((i) => i.trim() !== "").length - 1}
                                      onClick={() => handleMoveImage(idx, "down")}
                                      className="p-1 rounded-lg hover:bg-muted text-muted-foreground disabled:opacity-30"
                                      title="Arkaya Taşı"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(img);
                                        toast({
                                          title: "Bağlantı Kopyalandı",
                                          description: "Görsel URL adresi panoya kopyalandı."
                                        });
                                      }}
                                      className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                                      title="URL Kopyala"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveImage(idx)}
                                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                      title="Görseli Kaldır"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "specs" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-foreground">Motor Silindir Hacmi</label>
                      <input
                        type="text"
                        value={form.specs.engineCapacity}
                        onChange={(e) =>
                          setForm({ ...form, specs: { ...form.specs, engineCapacity: e.target.value } })
                        }
                        placeholder="Örn: 125 cc"
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground">Maksimum Güç</label>
                      <input
                        type="text"
                        value={form.specs.maxPower}
                        onChange={(e) => setForm({ ...form, specs: { ...form.specs, maxPower: e.target.value } })}
                        placeholder="Örn: 9.5 HP @ 7500 rpm"
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground">Maksimum Tork</label>
                      <input
                        type="text"
                        value={form.specs.maxTorque || ""}
                        onChange={(e) => setForm({ ...form, specs: { ...form.specs, maxTorque: e.target.value } })}
                        placeholder="Örn: 10.2 Nm @ 6000 rpm"
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground">Şanzıman / Vites</label>
                      <input
                        type="text"
                        value={form.specs.transmission}
                        onChange={(e) =>
                          setForm({ ...form, specs: { ...form.specs, transmission: e.target.value } })
                        }
                        placeholder="Örn: Otomatik CVT / 5 Vites Manuel"
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground">Soğutma Sistemi</label>
                      <input
                        type="text"
                        value={form.specs.cooling}
                        onChange={(e) => setForm({ ...form, specs: { ...form.specs, cooling: e.target.value } })}
                        placeholder="Örn: Hava Soğutmalı / Sıvı Soğutmalı"
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground">Fren Sistemi</label>
                      <input
                        type="text"
                        value={form.specs.brakes}
                        onChange={(e) => setForm({ ...form, specs: { ...form.specs, brakes: e.target.value } })}
                        placeholder="Örn: Ön Disk / Arka Disk (CBS/ABS)"
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground">Yakıt Deposu / Batarya Kapasitesi</label>
                      <input
                        type="text"
                        value={form.specs.fuelTankOrBattery}
                        onChange={(e) =>
                          setForm({ ...form, specs: { ...form.specs, fuelTankOrBattery: e.target.value } })
                        }
                        placeholder="Örn: 6.0 Litre / 72V 24Ah"
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground">Ağırlık (Boş / Dolu)</label>
                      <input
                        type="text"
                        value={form.specs.weight}
                        onChange={(e) => setForm({ ...form, specs: { ...form.specs, weight: e.target.value } })}
                        placeholder="Örn: 112 kg"
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-foreground">Garanti Kapsamı</label>
                      <input
                        type="text"
                        value={form.warranty}
                        onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                        placeholder="Örn: 2 Yıl veya 30.000 KM Resmî Fabrika Garantisi"
                        className="w-full mt-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "colors" && (
                  <div className="space-y-6">
                    {/* Smart Color Info Banner */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 via-amber-500/5 to-muted/40 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/30 text-red-500 flex items-center justify-center shrink-0 shadow-inner">
                          <Wand2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                            Akıllı Renk Tanıma Motoru
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-mono font-bold">
                              Canlı Senkron
                            </span>
                          </h4>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            HEX kodu girdiğinizde veya renk seçiciden seçim yaptığınızda Türkçe renk adı anında otomatik tanımlanır.
                          </p>
                        </div>
                      </div>
                      <div className="text-[11px] font-bold text-muted-foreground bg-background/80 px-3 py-1.5 rounded-xl border border-border shrink-0">
                        Tanımlı: <strong className="text-foreground">{form.colors.length} Renk</strong>
                      </div>
                    </div>

                    {/* Color Input Form Box */}
                    <div className="p-5 rounded-2xl bg-card border border-border shadow-xs space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                        {/* 1. Renk Seçici & Canlı Renk Kutusu */}
                        <div className="sm:col-span-3 space-y-1.5">
                          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                            Renk Seçimi
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="relative group w-full h-10 rounded-xl border-2 border-border overflow-hidden cursor-pointer shadow-inner flex items-center justify-center">
                              <div
                                className="w-full h-full transition-colors"
                                style={{ backgroundColor: newColorHex }}
                              />
                              <input
                                type="color"
                                value={newColorHex}
                                onChange={(e) => handleNativeColorPickerChange(e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                title="Renk Seçiciyi Aç"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-[10px] font-bold">
                                Renk Seç
                              </div>
                            </div>

                            {/* EyeDropper Button (if supported) */}
                            {typeof window !== "undefined" && "EyeDropper" in window && (
                              <button
                                type="button"
                                onClick={handleEyeDropperPick}
                                className="h-10 px-3 rounded-xl bg-muted border border-border hover:bg-muted/80 text-foreground transition-colors shrink-0 flex items-center justify-center"
                                title="Ekrandan / Görselden Damlalık ile Renk Çek"
                              >
                                <Pipette className="w-4 h-4 text-red-500" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* 2. HEX Kodu Girişi */}
                        <div className="sm:col-span-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                              HEX Kodu
                            </label>
                            {normalizeHex(newColorHexInput) && (
                              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-0.5">
                                <Check className="w-3 h-3" /> Geçerli
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-muted-foreground">
                              #
                            </span>
                            <input
                              type="text"
                              value={newColorHexInput.replace(/^#/, "")}
                              onChange={(e) => handleHexInputChange(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddColorToForm();
                                }
                              }}
                              placeholder="dc2626"
                              maxLength={7}
                              className="w-full pl-8 pr-3 h-10 rounded-xl bg-muted border border-border text-foreground text-xs font-mono font-bold focus:ring-2 focus:ring-red-500 focus:outline-none uppercase"
                            />
                          </div>
                        </div>

                        {/* 3. Renk Adı (Akıllı & Düzenlenebilir) */}
                        <div className="sm:col-span-4 space-y-1.5">
                          <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                            Renk Adı (Model Katalog İsmi)
                          </label>
                          <input
                            type="text"
                            value={newColorName}
                            onChange={(e) => handleColorNameInputChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddColorToForm();
                              }
                            }}
                            placeholder="Örn: Nardo Gri, Mat Siyah, İnci Beyazı..."
                            className="w-full px-3.5 h-10 rounded-xl bg-muted border border-border text-foreground text-xs font-medium focus:ring-2 focus:ring-red-500 focus:outline-none"
                          />
                        </div>

                        {/* 4. Palete Ekle Butonu */}
                        <div className="sm:col-span-2">
                          <button
                            type="button"
                            onClick={handleAddColorToForm}
                            className="w-full h-10 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-600/20 flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Plus className="w-4 h-4" />
                            Palete Ekle
                          </button>
                        </div>
                      </div>

                      {/* Live Auto-Detection Status Footer */}
                      <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                            style={{ backgroundColor: newColorHex }}
                          />
                          <span>
                            Canlı Eşleşme: <strong className="text-foreground font-bold">{autoDetectedName}</strong>
                            <span className="font-mono text-[11px] ml-1 opacity-70">({newColorHex})</span>
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground hidden sm:inline">
                          Enter tuşuna basarak hızlıca ekleyebilirsiniz
                        </span>
                      </div>
                    </div>

                    {/* Active Colors List & Alignment With Images */}
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-red-500" />
                            Model Renk Paleti & Görsel Eşleşmeleri ({form.colors.length} Renk Tanımlı)
                          </h3>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Her renk için aşağıdaki görsel butonlarından doğru motosiklet görselini seçerek eşleştirebilirsiniz.
                          </p>
                        </div>

                        {form.colors.length > 0 && form.images.filter((img) => img.trim() !== "").length > 0 && (
                          <button
                            type="button"
                            onClick={handleAutoPairColorsWithImages}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 border border-border text-foreground text-xs font-bold transition-colors shrink-0"
                            title="Tüm renkleri sırasıyla görsellere eşle (1->1, 2->2...)"
                          >
                            <Sparkles className="w-3 h-3 text-red-500" />
                            Sırayla Otomatik Eşle
                          </button>
                        )}
                      </div>

                      {form.colors.length === 0 ? (
                        <div className="p-8 text-center rounded-2xl bg-muted/20 border border-border border-dashed text-muted-foreground">
                          <Palette className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          <p className="text-xs font-bold">Henüz renk eklenmedi.</p>
                          <p className="text-[11px] mt-0.5">Yukarıdaki renk seçici veya HEX alanından renk ekleyebilirsiniz.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {form.colors.map((c, i) => {
                            const validImages = form.images.filter((img) => img.trim() !== "");
                            
                            // Determine mapped image
                            let currentMappedIndex: number | null = null;
                            if (typeof c.imageIndex === "number" && c.imageIndex >= 0 && c.imageIndex < form.images.length && form.images[c.imageIndex]?.trim() !== "") {
                              currentMappedIndex = c.imageIndex;
                            } else if (c.imageUrl) {
                              const found = form.images.indexOf(c.imageUrl);
                              if (found !== -1 && form.images[found]?.trim() !== "") {
                                currentMappedIndex = found;
                              }
                            } else if (i < form.images.length && form.images[i]?.trim() !== "") {
                              currentMappedIndex = i;
                            }

                            const mappedImage = currentMappedIndex !== null ? form.images[currentMappedIndex] : null;
                            const isCopied = copiedColorHex === c.hex;

                            return (
                              <div
                                key={i}
                                className="p-3.5 rounded-2xl bg-card border border-border hover:border-border/80 shadow-xs flex flex-col justify-between gap-3 transition-all group"
                              >
                                <div className="space-y-3">
                                  {/* Top Swatch, Name & HEX */}
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      <div className="relative shrink-0">
                                        <span
                                          className="w-9 h-9 rounded-xl border border-black/20 block shadow-inner"
                                          style={{ backgroundColor: c.hex }}
                                        />
                                        <span className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-slate-900 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs border border-slate-700">
                                          #{i + 1}
                                        </span>
                                      </div>

                                      {/* Editable Name & Hex */}
                                      <div className="min-w-0 flex-1">
                                        <input
                                          type="text"
                                          value={c.name}
                                          onChange={(e) => handleUpdateColorItem(i, "name", e.target.value)}
                                          className="text-xs font-bold text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-red-500 focus:outline-none px-0.5 w-full truncate"
                                          title="Rengin adını düzenlemek için tıklayın"
                                        />
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <input
                                            type="text"
                                            value={c.hex}
                                            onChange={(e) => handleUpdateColorItem(i, "hex", e.target.value)}
                                            className="text-[11px] text-muted-foreground font-mono font-bold uppercase bg-transparent border-b border-transparent hover:border-border focus:border-red-500 focus:outline-none w-20 px-0.5"
                                            title="Rengin HEX kodunu düzenlemek için tıklayın"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleCopyColorHex(c.hex)}
                                            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                            title="HEX Kodunu Kopyala"
                                          >
                                            {isCopied ? (
                                              <CheckCheck className="w-3 h-3 text-emerald-500" />
                                            ) : (
                                              <Copy className="w-3 h-3" />
                                            )}
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Mapped Mini Image Preview */}
                                    {mappedImage ? (
                                      <button
                                        type="button"
                                        onClick={() => setPreviewModalImage(mappedImage)}
                                        className="relative w-10 h-10 rounded-xl border border-red-500/40 bg-muted/60 overflow-hidden shrink-0 flex items-center justify-center p-0.5 hover:ring-2 hover:ring-red-500 transition-all"
                                        title={`#${currentMappedIndex! + 1}. Görsel eşleşti (Büyütmek için tıklayın)`}
                                      >
                                        <img
                                          src={mappedImage}
                                          alt={`Eşleşen görsel ${currentMappedIndex! + 1}`}
                                          className="w-full h-full object-contain"
                                        />
                                        <span className="absolute bottom-0 right-0 bg-red-600 text-white text-[8px] font-mono px-1 rounded-tl font-bold">
                                          #{currentMappedIndex! + 1}
                                        </span>
                                      </button>
                                    ) : (
                                      <div
                                        className="w-10 h-10 rounded-xl border border-dashed border-border bg-muted/20 shrink-0 flex items-center justify-center text-muted-foreground/50"
                                        title="Bu renge atanmış görsel yok"
                                      >
                                        <ImageIcon className="w-4 h-4" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Interactive Image Matcher Toolbar */}
                                  <div className="pt-2 border-t border-border/50 space-y-1.5">
                                    <div className="flex items-center justify-between text-[10px]">
                                      <span className="font-semibold text-muted-foreground flex items-center gap-1">
                                        <ImageIcon className="w-3 h-3 text-red-500" />
                                        Eşleşen Görsel:
                                      </span>
                                      {mappedImage ? (
                                        <span className="font-bold text-emerald-500">
                                          #{currentMappedIndex! + 1}. Görsel Seçili
                                        </span>
                                      ) : (
                                        <span className="text-amber-500 font-medium">Görsel Seçilmedi</span>
                                      )}
                                    </div>

                                    {/* Image Selector Thumbnails */}
                                    {validImages.length > 0 ? (
                                      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                                        {form.images.map((img, imgIdx) => {
                                          if (!img || img.trim() === "") return null;
                                          const isSelected = currentMappedIndex === imgIdx;
                                          return (
                                            <button
                                              key={imgIdx}
                                              type="button"
                                              onClick={() => handleUpdateColorImage(i, imgIdx)}
                                              className={`relative w-8 h-8 rounded-lg border overflow-hidden shrink-0 transition-all ${
                                                isSelected
                                                  ? "border-red-500 ring-2 ring-red-500/40 bg-red-500/10 scale-105"
                                                  : "border-border/70 hover:border-foreground/40 bg-muted/40 opacity-70 hover:opacity-100"
                                              }`}
                                              title={`Bu rengi #${imgIdx + 1}. Görsel (${img.split("/").pop()}) ile eşleştir`}
                                            >
                                              <img
                                                src={img}
                                                alt={`Görsel ${imgIdx + 1}`}
                                                className="w-full h-full object-contain p-0.5"
                                              />
                                              <span className="absolute bottom-0 right-0 px-1 rounded-tl bg-black/80 text-[8px] font-mono text-white leading-tight font-bold">
                                                #{imgIdx + 1}
                                              </span>
                                            </button>
                                          );
                                        })}
                                        <button
                                          type="button"
                                          onClick={() => handleUpdateColorImage(i, null)}
                                          className={`px-1.5 h-8 rounded-lg border text-[9px] font-bold shrink-0 transition-all ${
                                            currentMappedIndex === null
                                              ? "border-amber-500 bg-amber-500/10 text-amber-500"
                                              : "border-border hover:bg-muted text-muted-foreground"
                                          }`}
                                          title="Görsel eşleşmesini kaldır"
                                        >
                                          Yok
                                        </button>
                                      </div>
                                    ) : (
                                      <p className="text-[10px] text-muted-foreground italic">
                                        * Görseller sekmesinden görsel ekleyin.
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Bottom Controls */}
                                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      disabled={i === 0}
                                      onClick={() => handleMoveColor(i, "up")}
                                      className="p-1 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors"
                                      title="Öne Taşı"
                                    >
                                      <ArrowUp className="w-3 h-3" />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={i === form.colors.length - 1}
                                      onClick={() => handleMoveColor(i, "down")}
                                      className="p-1 rounded-md hover:bg-muted text-muted-foreground disabled:opacity-30 transition-colors"
                                      title="Arkaya Taşı"
                                    >
                                      <ArrowDown className="w-3 h-3" />
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setForm({ ...form, colors: form.colors.filter((_, idx) => idx !== i) });
                                      toast({
                                        title: "Renk Silindi",
                                        description: `${c.name} paletten kaldırıldı.`
                                      });
                                    }}
                                    className="p-1 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                    title="Rengi Paletten Sil"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="space-y-6">
                    {/* Donanım Özellikleri */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-foreground block">
                        Öne Çıkan Donanım & Güvenlik Özellikleri
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Örn: USB Şarj Soketi, Dijital LCD Ekran, LED Farlar..."
                          value={newFeatureText}
                          onChange={(e) => setNewFeatureText(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newFeatureText.trim()) return;
                            setForm({ ...form, features: [...form.features, newFeatureText.trim()] });
                            setNewFeatureText("");
                          }}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                        >
                          Ekle
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {form.features.map((f, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted border border-border text-xs text-foreground font-medium"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            {f}
                            <button
                              type="button"
                              onClick={() => {
                                setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
                              }}
                              className="ml-1 text-muted-foreground hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Hediye Paketi */}
                    <div className="space-y-3 pt-4 border-t border-border">
                      <label className="text-xs font-bold text-foreground block">
                        Kampanyalı Hediye & Aksesuar Paketi Maddeleri
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Örn: Kask, Disk Kilidi, Koruma Brandası..."
                          value={newGiftText}
                          onChange={(e) => setNewGiftText(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-muted border border-border text-foreground text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newGiftText.trim()) return;
                            setForm({
                              ...form,
                              giftPackage: [...(form.giftPackage || []), newGiftText.trim()]
                            });
                            setNewGiftText("");
                          }}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                        >
                          Ekle
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {form.giftPackage?.map((g, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-500 font-medium"
                          >
                            <Award className="w-3.5 h-3.5" />
                            {g}
                            <button
                              type="button"
                              onClick={() => {
                                setForm({
                                  ...form,
                                  giftPackage: form.giftPackage?.filter((_, i) => i !== idx)
                                });
                              }}
                              className="ml-1 text-amber-500 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal Actions */}
                <div className="pt-4 border-t border-border flex items-center justify-end gap-3 sticky bottom-0 bg-card py-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-colors"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20"
                  >
                    {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {editingBike ? "Değişiklikleri Kaydet" : "Modeli Kataloğa Ekle"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lightbox Modal for Large Image Inspection */}
        {previewModalImage && (
          <div
            className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setPreviewModalImage(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] bg-slate-950 border border-slate-800 rounded-3xl p-4 flex flex-col items-center shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-red-500" />
                  <span className="font-bold text-white">Görsel Önizleme</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(previewModalImage);
                      toast({
                        title: "Bağlantı Kopyalandı",
                        description: "Görsel URL adresi panoya kopyalandı."
                      });
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[11px]"
                  >
                    <Copy className="w-3.5 h-3.5" /> URL Kopyala
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewModalImage(null)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full max-h-[70vh] flex items-center justify-center p-4 my-2 overflow-hidden">
                <img
                  src={previewModalImage}
                  alt="Büyük Görsel Önizleme"
                  className="max-h-[65vh] max-w-full object-contain drop-shadow-2xl"
                />
              </div>

              <div className="w-full pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 truncate text-center">
                {previewModalImage}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
