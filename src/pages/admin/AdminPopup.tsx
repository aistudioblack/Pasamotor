import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminFetch } from "@/lib/api-client";
import { dbClient } from "@/lib/db-client";
import { useToast } from "@/hooks/use-toast";
import { PopupSettings, FormattedPopupDescription } from "@/components/common/SitePopup";
import { convertToWebP, getWebPFileName } from "@/lib/imageOptimization";
import { motion } from "motion/react";
import logo from "@/assets/pasa-motor-logo.webp";
import heroBg from "@/assets/hero-bg.webp";
import {
  Megaphone,
  Save,
  Loader2,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Layout,
  Link as LinkIcon,
  Image as ImageIcon,
  Palette,
  RotateCcw,
  Upload,
  ListPlus,
  Bold,
  FileText
} from "lucide-react";

const DEFAULT_POPUP: PopupSettings = {
  is_active: true,
  badge: "PAŞA MOTOR DUYURUSU",
  title: "TVS & Falcon Yetkili Servis ve Orijinal Parça Merkezi",
  description: "İstanbul Fatih'te en güvenilir motosiklet yetkili servisi ve 2000+ orijinal yedek parça stoğuyla hizmetinizdeyiz. Hemen online randevu alın veya kataloğumuzu inceleyin!",
  image_url: heroBg,
  button_text: "Yedek Parçaları İncele",
  button_link: "/yedek-parca",
  delay_seconds: 2,
  frequency: "once_per_session",
  bg_theme: "red"
};

const PRESET_LINKS = [
  { label: "Yedek Parça Kataloğu", url: "/yedek-parca" },
  { label: "İletişim & Servis Randevusu", url: "/iletisim" },
  { label: "Servis & Tamir Hizmetleri", url: "/hizmetler" },
  { label: "Blog & Bakım Rehberleri", url: "/blog" },
];

export default function AdminPopup() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [recordId, setRecordId] = useState<string | null>(null);
  const [settings, setSettings] = useState<PopupSettings>(DEFAULT_POPUP);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    fetchPopupSettings();
  }, []);

  const fetchPopupSettings = async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/site-content/homepage_popup");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setRecordId(data.id);
          if (data.sections) {
            setSettings({ ...DEFAULT_POPUP, ...(data.sections as PopupSettings) });
          }
        }
      } else {
        // Fallback to dbClient
        const { data } = await dbClient
          .from("site_content")
          .select("id, sections")
          .eq("page_key", "homepage_popup")
          .maybeSingle();

        if (data) {
          setRecordId(data.id);
          if (data.sections) {
            setSettings({ ...DEFAULT_POPUP, ...(data.sections as PopupSettings) });
          }
        }
      }
    } catch (e) {
      console.error("Popup settings fetch exception:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        title: "Ana Sayfa Popup Duyurusu",
        sections: settings as any,
      };

      const res = await adminFetch("/api/admin/site-content/homepage_popup", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Sunucu kaydetme hatası döndürdü.");
      }

      const result = await res.json();
      if (result && result.data && result.data.id) {
        setRecordId(result.data.id);
      }

      toast({
        title: "Başarıyla Kaydedildi! 🎉",
        description: settings.is_active
          ? "Popup duyurusu aktif edildi ve ana sayfada görüntülenecektir."
          : "Popup duyurusu pasife alındı.",
      });
    } catch (err: any) {
      toast({
        title: "Kaydetme Hatası",
        description: err.message || "Ayarlar kaydedilirken bir sorun oluştu.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const webpBlob = await convertToWebP(file).catch(() => file);
      const webpName = getWebPFileName(file.name);
      const fileName = `popup/${Date.now()}-${webpName}`;

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(webpBlob);
      });
      const base64String = await base64Promise;

      const res = await adminFetch("/api/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file: base64String,
          fileName,
          bucket: "product-images",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Görsel yüklenemedi.");
      }

      const imageUrl = data.publicUrl || data.url;
      if (imageUrl) {
        setSettings((prev) => ({ ...prev, image_url: imageUrl }));
        toast({
          title: "Görsel Yüklendi",
          description: "Popup resmi başarıyla güncellendi ve optimize edildi.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Yükleme Hatası",
        description: error.message || "Görsel yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/50 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-heading font-extrabold text-2xl text-foreground">
                  Popup (Açılır Pencere) Yönetimi
                </h1>
                <p className="text-sm text-muted-foreground">
                  Ana sayfada ziyaretçilerinize görünecek duyuru, kampanya ve özel teklif penceresini özelleştirin.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 bg-muted/50 hover:bg-muted text-foreground text-sm font-semibold transition-all shadow-sm"
            >
              <Eye className="w-4 h-4 text-primary" />
              <span>Canlı Önizle</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Değişiklikleri Kaydet</span>
            </button>
          </div>
        </div>

        {/* Status Card */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            settings.is_active
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
              : "bg-destructive/10 border-destructive/30 text-destructive-foreground"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {settings.is_active ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-destructive shrink-0" />
              )}
              <div>
                <h3 className="font-heading font-bold text-lg">
                  {settings.is_active ? "Popup Sitelerinde Aktif Durumda" : "Popup Sitelerde Kapalı"}
                </h3>
                <p className="text-xs opacity-80">
                  {settings.is_active
                    ? "Ziyaretçileriniz belirlediğiniz sıklıkta ana sayfada bu duyuruyu görecektir."
                    : "Açılır duyuru penceresi devre dışı bırakılmıştır."}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.is_active}
                onChange={(e) => setSettings({ ...settings, is_active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* Two-column layout: Form vs Realtime Side Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Settings Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Content Card */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Duyuru ve İçerik Bilgileri
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Rozet / Etiket Metni
                  </label>
                  <input
                    type="text"
                    value={settings.badge || ""}
                    onChange={(e) => setSettings({ ...settings, badge: e.target.value })}
                    placeholder="Örn: PAŞA MOTOR ÖZEL KAMPANYA"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border/60 focus:border-primary focus:outline-none text-sm text-foreground font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Popup Başlığı <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={settings.title}
                    onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                    placeholder="Örn: TVS & Falcon Orijinal Parçalarda %15 İndirim!"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border/60 focus:border-primary focus:outline-none text-sm text-foreground font-heading font-bold"
                  />
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Açıklama / Mesaj Metni <span className="text-primary">*</span>
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      Madde imi (<code className="text-primary font-mono font-bold">- </code>) veya Kalın (<code className="text-primary font-mono font-bold">**yazı**</code>) kullanabilirsiniz
                    </span>
                  </div>

                  {/* Quick Helper Formatting Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5 p-2 rounded-xl bg-muted/40 border border-border/50">
                    <button
                      type="button"
                      onClick={() => setSettings((prev) => ({ ...prev, description: (prev.description || "") + "\n- " }))}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background hover:bg-primary/10 hover:text-primary border border-border/60 text-xs font-medium transition-colors"
                      title="Madde işareti ekle"
                    >
                      <ListPlus className="w-3.5 h-3.5 text-primary" />
                      <span>Madde Ekle</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSettings((prev) => ({ ...prev, description: (prev.description || "") + " **vurgulu metin** " }))
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background hover:bg-primary/10 hover:text-primary border border-border/60 text-xs font-medium transition-colors"
                      title="Kalın / Vurgulu yazı ekle"
                    >
                      <Bold className="w-3.5 h-3.5 text-primary" />
                      <span>Vurgulu Yazı</span>
                    </button>

                    <div className="h-4 w-px bg-border mx-0.5 hidden sm:block" />

                    <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline">Şablonlar:</span>

                    <button
                      type="button"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          title: "TVS & Falcon Orijinal Parçalarda Özel İndirim!",
                          description:
                            "İstanbul Fatih merkezimizde ve online mağazamızda fırsat haftası başladı!\n- TVS ve Falcon tüm orijinal yedek parçalarda %15 indirim\n- Aynı gün kargo ve hızlı teslimat imkanı\n- **Kampanya Kodu:** PASA15",
                        }))
                      }
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-background hover:bg-primary/10 hover:text-primary border border-border/60 text-[11px] font-medium transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>İndirim Şablonu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSettings((prev) => ({
                          ...prev,
                          title: "Yetkili Servisimiz Hizmetinizde",
                          description:
                            "Motosikletinizin bakım ve onarım işlemleri için uzman kadromuzla yanınızdayız.\n- **Hafta İçi:** 08:30 - 19:30\n- **Cumartesi:** 09:00 - 18:00\n- Sıra beklemeden randevu almak için hemen online randevu oluşturabilirsiniz.",
                        }))
                      }
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-background hover:bg-primary/10 hover:text-primary border border-border/60 text-[11px] font-medium transition-colors"
                    >
                      <FileText className="w-3 h-3 text-blue-500" />
                      <span>Servis Şablonu</span>
                    </button>
                  </div>

                  <textarea
                    rows={5}
                    value={settings.description}
                    onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                    placeholder="Duyuru detaylarını buraya yazın. Satır başları, maddeler (- ) ve kalın metinler (**koyu**) otomatik olarak şık biçimlendirilir..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border/60 focus:border-primary focus:outline-none text-sm text-foreground font-sans leading-relaxed min-h-[120px]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Action & Link Card */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-primary" /> Aksiyon Butonu ve Yönlendirme
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Buton Yazısı
                  </label>
                  <input
                    type="text"
                    value={settings.button_text || ""}
                    onChange={(e) => setSettings({ ...settings, button_text: e.target.value })}
                    placeholder="Örn: Hemen İncele"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border/60 focus:border-primary focus:outline-none text-sm text-foreground font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Hedef Bağlantı (URL)
                  </label>
                  <input
                    type="text"
                    value={settings.button_link || ""}
                    onChange={(e) => setSettings({ ...settings, button_link: e.target.value })}
                    placeholder="Örn: /yedek-parca"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border/60 focus:border-primary focus:outline-none text-sm text-foreground font-mono"
                  />

                  {/* Preset Quick Links */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="text-[11px] text-muted-foreground self-center mr-1">Hızlı Seçim:</span>
                    {PRESET_LINKS.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setSettings({ ...settings, button_link: preset.url })}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary border border-border/40 font-mono transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Image & Visual Theme Card */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" /> Görsel ve Tasarım Teması
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Popup Görsel URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settings.image_url || ""}
                      onChange={(e) => setSettings({ ...settings, image_url: e.target.value })}
                      placeholder="Görsel URL'si girin veya yükleyin..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-muted/50 border border-border/60 focus:border-primary focus:outline-none text-sm text-foreground font-mono"
                    />

                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold cursor-pointer border border-border/60 transition-colors shrink-0">
                      {uploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>{uploadingImage ? "Yükleniyor..." : "Dosya Seç"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" /> Renk & Tema Seçeneği
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "red", name: "Açık / Kırmızı Vurgu", desc: "Kart stili Paşa kırmızısı" },
                      { id: "dark", name: "Koyu Lüks Tema", desc: "Premium koyu gri zemin" },
                      { id: "gradient", name: "Gece Gradyanı", desc: "Kırmızı & Siyah şık geçiş" },
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setSettings({ ...settings, bg_theme: theme.id as any })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          settings.bg_theme === theme.id
                            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                            : "border-border/50 hover:bg-muted/50"
                        }`}
                      >
                        <p className="text-xs font-bold text-foreground">{theme.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{theme.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Display Rules & Frequency */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm space-y-4">
              <h3 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Görüntülenme Kuralları & Zamanlama
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Gecikme Süresi (Saniye)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="1"
                      value={settings.delay_seconds ?? 2}
                      onChange={(e) =>
                        setSettings({ ...settings, delay_seconds: parseInt(e.target.value, 10) })
                      }
                      className="flex-1 accent-primary"
                    />
                    <span className="text-sm font-bold font-mono px-3 py-1 rounded-lg bg-muted border border-border/60">
                      {settings.delay_seconds ?? 2} Saniye
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Ziyaretçi ana sayfaya girdikten kaç saniye sonra popup ekrana gelsin?
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Gösterim Sıklığı (Kullanıcı Deneyimi)
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        id: "once_per_session",
                        label: "Oturum Başına 1 Kez (Tavsiye Edilen)",
                        desc: "Kullanıcı sekmeyi kapatana kadar popup sadece bir kere gösterilir.",
                      },
                      {
                        id: "once_per_day",
                        label: "Günde 1 Kez (24 Saat)",
                        desc: "Aynı ziyaretçiye günde en fazla bir defa görünür.",
                      },
                      {
                        id: "always",
                        label: "Her Sayfa Yenilemesinde",
                        desc: "Her sayfa açılışında popup tetiklenir (Test için uygundur).",
                      },
                    ].map((freq) => (
                      <label
                        key={freq.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          settings.frequency === freq.id
                            ? "bg-primary/10 border-primary"
                            : "border-border/50 hover:bg-muted/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="frequency"
                          value={freq.id}
                          checked={settings.frequency === freq.id}
                          onChange={() => setSettings({ ...settings, frequency: freq.id as any })}
                          className="mt-0.5 accent-primary"
                        />
                        <div>
                          <p className="text-xs font-bold text-foreground">{freq.label}</p>
                          <p className="text-[11px] text-muted-foreground">{freq.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Realtime Interactive Preview Side Panel */}
          <div className="lg:col-span-5 sticky top-20 space-y-4">
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground font-mono flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-primary" /> Canlı Arayüz Önizlemesi
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-mono font-bold">
                  CANLI
                </span>
              </div>

              {/* Mockup Container */}
              <div className="relative rounded-2xl border border-border/80 bg-neutral-950 p-3 sm:p-4 min-h-[420px] flex items-center justify-center overflow-hidden">
                {/* Background Dim Effect */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

                {/* Simulated Popup Box */}
                <div
                  className={`relative w-full rounded-2xl border shadow-2xl overflow-hidden text-card-foreground transition-all duration-300 z-10 flex flex-col max-h-[520px] ${
                    settings.bg_theme === "gradient"
                      ? "bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950/40 border-red-500/30 text-white"
                      : settings.bg_theme === "dark"
                      ? "bg-neutral-900 border-neutral-800 text-neutral-100"
                      : "bg-card border-primary/20 text-card-foreground"
                  }`}
                >
                  {/* Image */}
                  {settings.image_url && (
                    <div className="relative w-full h-32 sm:h-36 shrink-0 overflow-hidden bg-neutral-900">
                      <img
                        src={settings.image_url}
                        alt="Önizleme"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 sm:p-5 space-y-3 overflow-y-auto flex-1">
                    {settings.badge && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/25 font-mono">
                        <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                        <span>{settings.badge}</span>
                      </div>
                    )}

                    <h4 className="font-heading font-extrabold text-base leading-snug">
                      {settings.title || "Popup Başlığı Burada Görünecek"}
                    </h4>

                    <FormattedPopupDescription
                      text={settings.description || "Popup açıklama metni buraya gelecektir."}
                    />

                    <div className="pt-2 flex items-center gap-2">
                      {settings.button_text && (
                        <div className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-xs shadow-md">
                          <span>{settings.button_text}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div className="px-3 py-2 rounded-xl border border-border/60 text-muted-foreground text-xs font-medium">
                        Kapat
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Test Trigger */}
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="w-full py-3 px-4 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-heading font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Eye className="w-4 h-4" />
              <span>Tam Ekran Pop-Up Testi Çalıştır</span>
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Test Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsPreviewModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative w-full max-w-sm sm:max-w-lg md:max-w-xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] my-auto z-10 ${
              settings.bg_theme === "gradient"
                ? "bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950/40 border-red-500/30 text-white"
                : settings.bg_theme === "dark"
                ? "bg-neutral-900 border-neutral-800 text-neutral-100"
                : "bg-card border-primary/20 text-card-foreground"
            }`}
          >
            <button
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white/90 hover:text-white transition-all backdrop-blur-md border border-white/20 shadow-lg"
              aria-label="Kapat"
            >
              ✕
            </button>

            {settings.image_url && (
              <div className="relative w-full h-36 sm:h-48 md:h-56 shrink-0 overflow-hidden bg-neutral-950">
                <img src={settings.image_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
              </div>
            )}

            <div className="p-5 sm:p-7 md:p-8 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1">
              {settings.badge && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/25 font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span>{settings.badge}</span>
                </div>
              )}
              <h3 className="font-heading font-extrabold text-lg sm:text-2xl leading-snug">{settings.title}</h3>

              <FormattedPopupDescription text={settings.description} />

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 text-center"
                >
                  {settings.button_text || "Tamam"}
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground text-xs sm:text-sm font-medium transition-all text-center"
                >
                  Kapat
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
}
