import React, { useState, useEffect } from "react";
import { Motorcycle } from "@/data/motorcycles";
import { X, CreditCard, Calculator, CheckCircle2, MessageCircle, ArrowRight, Sparkles } from "lucide-react";

const tl = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);

interface InstallmentCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBike: Motorcycle | null;
}

export const InstallmentCalculatorModal: React.FC<InstallmentCalculatorModalProps> = ({
  isOpen,
  onClose,
  selectedBike,
}) => {
  const [totalPrice, setTotalPrice] = useState<number>(selectedBike && selectedBike.price > 0 ? selectedBike.price : 65000);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<number>(12);

  useEffect(() => {
    if (selectedBike) {
      setTotalPrice(selectedBike.price > 0 ? selectedBike.price : 65000);
      setDownPayment(0); // Default to 0 down payment so they can see full installment options easily
    }
  }, [selectedBike]);

  if (!isOpen) return null;

  const remainingAmount = Math.max(0, totalPrice - downPayment);

  const installmentOptions = [
    { 
      months: 3, 
      monthly: Math.round(remainingAmount / 3),
      total: remainingAmount 
    },
    { 
      months: 6, 
      monthly: selectedBike?.installment6Price 
        ? Math.round(Math.max(0, selectedBike.installment6Price - downPayment) / 6)
        : Math.round(remainingAmount / 6),
      total: selectedBike?.installment6Price 
        ? Math.max(0, selectedBike.installment6Price - downPayment) 
        : remainingAmount 
    },
    { 
      months: 9, 
      monthly: selectedBike?.installment12Price 
        ? Math.round(Math.max(0, selectedBike.installment12Price - downPayment) / 9)
        : Math.round(remainingAmount / 9),
      total: selectedBike?.installment12Price 
        ? Math.max(0, selectedBike.installment12Price - downPayment) 
        : remainingAmount 
    },
    { 
      months: 12, 
      monthly: selectedBike?.installment12Price 
        ? Math.round(Math.max(0, selectedBike.installment12Price - downPayment) / 12)
        : Math.round(remainingAmount / 12),
      total: selectedBike?.installment12Price 
        ? Math.max(0, selectedBike.installment12Price - downPayment) 
        : remainingAmount 
    },
  ];

  const currentOption = installmentOptions.find((o) => o.months === selectedMonth) || installmentOptions[3];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl bg-card border border-border rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl text-foreground">
                Kredi Kartına 3 - 6 - 9 - 12 Taksit Hesaplayıcı
              </h3>
              <p className="text-xs text-muted-foreground">
                {selectedBike ? `${selectedBike.brand} ${selectedBike.model}` : "MotoLux Motosiklet"} için taksit planını seçin.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-muted-foreground">Motosiklet Fiyatı:</span>
              <span className="text-foreground font-bold">{tl(totalPrice)}</span>
            </div>
            <input
              type="range"
              min={35000}
              max={160000}
              step={1000}
              value={totalPrice}
              onChange={(e) => setTotalPrice(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-muted-foreground">İsteğe Bağlı Peşinat (Nakit):</span>
              <span className="text-foreground font-bold">{tl(downPayment)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={totalPrice}
              step={1000}
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Kredi Kartı ile Çekilecek Tutar:</span>
            <span className="font-heading font-black text-xl text-red-500">{tl(remainingAmount)}</span>
          </div>
        </div>

        {/* 3 - 6 - 9 - 12 Taksit Grid */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground mb-2 flex items-center justify-between">
            <span>Taksit Seçeneğinizi Belirleyin:</span>
            <span className="text-red-500 font-bold">{selectedMonth} Taksit Seçili</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {installmentOptions.map((opt) => (
              <button
                key={opt.months}
                type="button"
                onClick={() => setSelectedMonth(opt.months)}
                className={`p-3.5 rounded-2xl border text-center space-y-1 transition-all cursor-pointer ${
                  selectedMonth === opt.months
                    ? "bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105"
                    : "bg-card border-border/80 text-foreground hover:border-red-500/50"
                }`}
              >
                <div className={`text-[11px] font-bold ${selectedMonth === opt.months ? "text-white" : "text-muted-foreground"}`}>
                  {opt.months} Taksit
                </div>
                <div className={`font-heading font-black text-base ${selectedMonth === opt.months ? "text-white" : "text-foreground"}`}>
                  {tl(opt.monthly)}
                </div>
                <div className={`text-[10px] font-semibold ${selectedMonth === opt.months ? "text-white/90" : "text-emerald-500"}`}>
                  / ay
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-2">
          <a
            href={`https://wa.me/905348996817?text=Merhaba,%20${selectedBike ? encodeURIComponent(selectedBike.model) : "MotoLux"}%20modeli%20i%C3%A7in%20Kredi%20Kart%C4%B1na%20${selectedMonth}%20Taksit%20(Ayl%C4%B1k%20${tl(currentOption.monthly)}${downPayment > 0 ? `, ${tl(downPayment)} peşinat` : ""})%20%C3%B6deme%20plan%C4%B1yla%20teklif%20almak%20istiyorum.`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            {selectedMonth} Taksit Seçeneği ile WhatsApp Teklifi Al
          </a>
        </div>

      </div>
    </div>
  );
};

export default InstallmentCalculatorModal;
