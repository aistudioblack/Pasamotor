import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { toast } from "sonner";

export interface CartItem {
  id: string; // unique identifier (e.g. `part_${productId}` or `bike_${id}_${color}`)
  productId: string;
  title: string;
  price: number | null;
  originalPrice?: number | null;
  image: string;
  sku?: string | null;
  brand?: string;
  category?: string;
  quantity: number;
  type: "yedek-parca" | "motosiklet";
  selectedColor?: string;
  slug: string;
  url: string;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  city: string;
  district?: string;
  address?: string;
  chassisOrNote?: string;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  generateWhatsAppOrderUrl: (phoneOverride?: string) => string;
  generateWhatsAppOrderMessage: () => string;
}

const CART_STORAGE_KEY = "pasa_motor_cart_v1";
const CUSTOMER_STORAGE_KEY = "pasa_motor_customer_v1";
export const DEFAULT_WHATSAPP_PHONE = "905348996817";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item) => item && typeof item.id === "string" && typeof item.quantity === "number" && item.quantity > 0
          );
        }
      }
    } catch {
      // Ignore parse errors
    }
    return [];
  });

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return {
            fullName: String(parsed.fullName || "").slice(0, 100),
            phone: String(parsed.phone || "").slice(0, 30),
            city: String(parsed.city || "").slice(0, 60),
            district: String(parsed.district || "").slice(0, 60),
            address: String(parsed.address || "").slice(0, 250),
            chassisOrNote: String(parsed.chassisOrNote || "").slice(0, 300),
          };
        }
      }
    } catch {
      // Ignore parse errors
    }
    return {
      fullName: "",
      phone: "",
      city: "",
      district: "",
      address: "",
      chassisOrNote: "",
    };
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // storage quota or error
    }
  }, [cart]);

  // Sync customer info to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerInfo));
    } catch {
      // storage quota or error
    }
  }, [customerInfo]);

  const addItem = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    const qtyToAdd = Math.max(1, Math.min(999, Math.floor(quantity)));
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((i) => i.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = Math.min(999, updated[existingIndex].quantity + qtyToAdd);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            ...item,
            quantity: qtyToAdd,
          },
        ];
      }
    });

    toast.success(`"${item.title.slice(0, 35)}..." sepete eklendi!`, {
      action: {
        label: "Sepeti Aç",
        onClick: () => setIsCartOpen(true),
      },
    });
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: Math.min(999, nextQty) } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const setQuantity = (id: string, quantity: number) => {
    const validQty = Math.max(1, Math.min(999, Math.floor(quantity)));
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: validQty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => {
      if (typeof item.price === "number" && !isNaN(item.price)) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);
  }, [cart]);

  // Format the structured WhatsApp Order text (Clean plain text without special characters or asterisks)
  const generateWhatsAppOrderMessage = () => {
    if (cart.length === 0) return "";

    const lines: string[] = [];
    lines.push("PASA MOTOR - SIPARIS VE TEKLIF TALEBI");
    lines.push("----------------------------------------");
    lines.push("Merhaba, web sitenizden asagidaki urunler icin siparis ve stok teyidi almak istiyorum:\n");
    lines.push("SEPETTEKI URUNLER:");

    let hasUnpricedItem = false;

    cart.forEach((item, index) => {
      const priceText =
        typeof item.price === "number" && item.price > 0
          ? `${new Intl.NumberFormat("tr-TR").format(item.price)} TL`
          : "Fiyat Sorulacak";

      if (!item.price || item.price <= 0) hasUnpricedItem = true;

      const lineTotal =
        typeof item.price === "number" && item.price > 0
          ? `${new Intl.NumberFormat("tr-TR").format(item.price * item.quantity)} TL`
          : "Fiyat Sorulacak";

      lines.push(`\n${index + 1}. ${item.title}`);
      if (item.brand) lines.push(`- Marka: ${item.brand}`);
      if (item.sku) lines.push(`- Parca Kodu: ${item.sku}`);
      if (item.selectedColor) lines.push(`- Renk / Varyant: ${item.selectedColor}`);
      lines.push(`- Adet: ${item.quantity}`);
      lines.push(`- Birim Fiyat: ${priceText}`);
      if (item.quantity > 1) {
        lines.push(`- Toplam Tutar: ${lineTotal}`);
      }
      if (item.url) {
        lines.push(`- Urun Linki: ${window.location.origin}${item.url}`);
      }
    });

    lines.push("\n----------------------------------------");
    if (totalPrice > 0) {
      lines.push(`TOPLAM TUTAR: ${new Intl.NumberFormat("tr-TR").format(totalPrice)} TL ${hasUnpricedItem ? "(+ Fiyati sorulacak parcalar)" : ""}`);
    } else {
      lines.push("TOPLAM TUTAR: Fiyat Teyidi Alinacak");
    }
    lines.push("----------------------------------------");

    const hasCustomerDetails =
      customerInfo.fullName.trim() ||
      customerInfo.phone.trim() ||
      customerInfo.city.trim() ||
      customerInfo.chassisOrNote?.trim();

    if (hasCustomerDetails) {
      lines.push("\nMUSTERI VE TESLIMAT BILGILERI:");
      if (customerInfo.fullName.trim()) lines.push(`- Ad Soyad: ${customerInfo.fullName.trim()}`);
      if (customerInfo.phone.trim()) lines.push(`- Telefon: ${customerInfo.phone.trim()}`);
      if (customerInfo.city.trim()) {
        const cityDist = [customerInfo.city.trim(), customerInfo.district?.trim()].filter(Boolean).join(" / ");
        lines.push(`- Sehir / Ilce: ${cityDist}`);
      }
      if (customerInfo.address?.trim()) lines.push(`- Adres: ${customerInfo.address.trim()}`);
      if (customerInfo.chassisOrNote?.trim()) {
        lines.push(`- Sasi No / Not: ${customerInfo.chassisOrNote.trim()}`);
      }
      lines.push("----------------------------------------");
    }

    lines.push("\nStok ve teslimat detaylari icin donusunuzu rica ederim.");

    return lines.join("\n");
  };

  const generateWhatsAppOrderUrl = (phoneOverride = DEFAULT_WHATSAPP_PHONE) => {
    const message = generateWhatsAppOrderMessage();
    const cleanPhone = phoneOverride.replace(/[^0-9]/g, "");
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        setQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        customerInfo,
        setCustomerInfo,
        generateWhatsAppOrderUrl,
        generateWhatsAppOrderMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
