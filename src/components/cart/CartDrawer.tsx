import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  X,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  ArrowRight,
  User,
  MapPin,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  HelpCircle
} from "lucide-react";
import { useCart, DEFAULT_WHATSAPP_PHONE } from "@/context/CartContext";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    customerInfo,
    setCustomerInfo,
    generateWhatsAppOrderUrl,
  } = useCart();

  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleInputChange = (field: keyof typeof customerInfo, value: string) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWhatsAppCheckout = () => {
    const waUrl = generateWhatsAppOrderUrl(DEFAULT_WHATSAPP_PHONE);
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg bg-background/95 backdrop-blur-xl border-l border-border/60 shadow-2xl flex flex-col h-full z-10 text-foreground overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between bg-card/50">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-sm">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-lg leading-tight flex items-center gap-2">
                    Alışveriş Sepetim
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-mono font-semibold">
                      {totalItems} Adet
                    </span>
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    Doğrudan WhatsApp Sipariş & Şasi Teyit Akışı
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {cart.length > 0 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors text-xs flex items-center gap-1"
                    title="Sepeti Temizle"
                    aria-label="Sepeti Temizle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={closeCart}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Clear Confirm Modal/Banner */}
            {showClearConfirm && (
              <div className="bg-red-500/10 border-b border-red-500/20 p-3 px-4 flex items-center justify-between gap-2 text-xs">
                <span className="text-red-400 font-medium">Tüm sepeti boşaltmak istediğinize emin misiniz?</span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      clearCart();
                      setShowClearConfirm(false);
                    }}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
                  >
                    Evet, Boşalt
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-2 py-1 bg-muted hover:bg-muted/80 text-foreground rounded"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            )}

            {/* Safety & No Online Payment Notice Banner */}
            <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-2.5 flex items-start gap-2.5 text-xs text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
              <div className="leading-tight">
                <span className="font-semibold block mb-0.5">Güvenli WhatsApp Sipariş Hattı</span>
                <span className="text-[11px] opacity-90">
                  Sitemizden kredi kartı bilgisi talep edilmez. Siparişiniz WhatsApp ile yetkili ekibimize aktarılır; stok ve şasi teyidinden sonra kargolanır.
                </span>
              </div>
            </div>

            {/* Body Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cart.length === 0 ? (
                /* Empty Cart State */
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center h-full">
                  <div className="w-20 h-20 rounded-3xl bg-muted/60 border border-border flex items-center justify-center mb-4 text-muted-foreground">
                    <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-foreground mb-2">
                    Sepetiniz Şu An Boş
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs mb-6">
                    Motosiklet modelinize uygun orijinal yedek parçaları veya sıfır motosikletlerimizi inceleyip sepetinize ekleyebilirsiniz.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2.5 w-full max-w-xs">
                    <Link
                      to="/yedek-parca"
                      onClick={closeCart}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                    >
                      <span>Yedek Parça Kataloğu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to="/magaza"
                      onClick={closeCart}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Sıfır Motosikletler</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Cart Items List */
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-card border border-border/70 hover:border-border transition-all shadow-sm flex gap-3.5 items-start group relative"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-muted/50 border border-border/60 overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img
                          src={item.image || "/pasa-motor-logo.webp"}
                          alt={item.title}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/pasa-motor-logo.webp";
                          }}
                        />
                      </div>

                      {/* Info & Controls */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={item.url || "#"}
                            onClick={closeCart}
                            className="font-heading font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-tight pr-4"
                            title={item.title}
                          >
                            {item.title}
                          </Link>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-muted-foreground hover:text-red-500 p-1 -mr-1 rounded transition-colors"
                            aria-label="Ürünü Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Badges / Details */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {item.brand && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                              {item.brand}
                            </span>
                          )}
                          {item.sku && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                              KOD: {item.sku}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              Renk: {item.selectedColor}
                            </span>
                          )}
                        </div>

                        {/* Price & Quantity Area */}
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/40">
                          {/* Quantity selector */}
                          <div className="flex items-center rounded-lg border border-border/80 bg-background/80 p-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
                              aria-label="Adet Azalt"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold font-mono text-foreground">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              aria-label="Adet Artır"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            {item.price && item.price > 0 ? (
                              <div>
                                <span className="font-heading font-extrabold text-sm sm:text-base text-foreground block">
                                  {new Intl.NumberFormat("tr-TR").format(item.price * item.quantity)} TL
                                </span>
                                {item.quantity > 1 && (
                                  <span className="text-[10px] text-muted-foreground block">
                                    Birim: {new Intl.NumberFormat("tr-TR").format(item.price)} TL
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-amber-500 font-medium italic">
                                Fiyat Sorunuz
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Customer Info Accordion / Fast Form */}
                  <div className="mt-4 rounded-2xl bg-card border border-border/80 overflow-hidden shadow-sm">
                    <button
                      type="button"
                      onClick={() => setIsCustomerFormOpen(!isCustomerFormOpen)}
                      className="w-full p-3.5 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-foreground">
                          Müşteri & Teslimat Bilgileri (İsteğe Bağlı)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <span>{isCustomerFormOpen ? "Gizle" : "Doldur"}</span>
                        {isCustomerFormOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isCustomerFormOpen && (
                      <div className="p-3.5 pt-0 border-t border-border/40 space-y-3 bg-muted/10">
                        <p className="text-[11px] text-muted-foreground mt-2">
                          Bilgilerinizi girerseniz WhatsApp mesajına otomatik eklenir, siparişiniz daha hızlı hazırlanır.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                              Adınız Soyadınız
                            </label>
                            <input
                              type="text"
                              value={customerInfo.fullName}
                              onChange={(e) => handleInputChange("fullName", e.target.value)}
                              placeholder="Örn: Ahmet Yılmaz"
                              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                              Telefon Numaranız
                            </label>
                            <input
                              type="tel"
                              value={customerInfo.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              placeholder="Örn: 0532 123 45 67"
                              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                              Şehir / İlçe
                            </label>
                            <input
                              type="text"
                              value={customerInfo.city}
                              onChange={(e) => handleInputChange("city", e.target.value)}
                              placeholder="Örn: İstanbul / Fatih"
                              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">
                              Şasi No / Motosiklet Modeli / Not
                            </label>
                            <input
                              type="text"
                              value={customerInfo.chassisOrNote}
                              onChange={(e) => handleInputChange("chassisOrNote", e.target.value)}
                              placeholder="Örn: 2022 Honda PCX 125 uyumu teyidi"
                              className="w-full bg-background border border-border rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary & Direct WhatsApp Checkout Action */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-border/70 bg-card/80 backdrop-blur-md space-y-3">
                {/* Price Calculation details */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Toplam Ürün Adedi:</span>
                    <span className="font-semibold text-foreground">{totalItems} adet</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Kargo & Teslimat:</span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> WhatsApp Teyidinde Belirlenir
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-border/40">
                    <span className="font-heading font-bold text-sm text-foreground">
                      Tahmini Tutar:
                    </span>
                    <div className="text-right">
                      {totalPrice > 0 ? (
                        <span className="font-heading font-extrabold text-xl text-primary">
                          {new Intl.NumberFormat("tr-TR").format(totalPrice)} TL
                        </span>
                      ) : (
                        <span className="font-heading font-bold text-sm text-amber-500">
                          Fiyat Teyidi Yapılacak
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary WhatsApp Action Button */}
                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.99] text-white font-heading font-bold text-base shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2.5 transition-all group"
                >
                  <MessageCircle className="w-6 h-6 fill-white shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Sepeti WhatsApp ile Sipariş Ver</span>
                </button>

                {/* Secondary Quick Call Option */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href="tel:+902125868598"
                    className="py-2.5 px-3 rounded-xl bg-muted/60 hover:bg-muted border border-border text-foreground font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>0212 586 85 98</span>
                  </a>
                  <button
                    onClick={closeCart}
                    className="py-2.5 px-3 rounded-xl bg-muted/60 hover:bg-muted border border-border text-muted-foreground hover:text-foreground font-semibold flex items-center justify-center transition-colors"
                  >
                    Alışverişe Devam Et
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
