import React from "react";
import { Motorcycle } from "@/data/motorcycles";
import { X, CheckCircle2, ShieldCheck, Scale, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const tl = (n: number) =>
  new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);

interface MotorcycleCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  bikes: Motorcycle[];
  onRemoveBike: (id: string) => void;
  onClearAll: () => void;
}

export const MotorcycleCompareModal: React.FC<MotorcycleCompareModalProps> = ({
  isOpen,
  onClose,
  bikes,
  onRemoveBike,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-card border border-border rounded-3xl p-6 overflow-y-auto shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-xl text-foreground">
                MotoLux Model Karşılaştırma Tablosu
              </h3>
              <p className="text-xs text-muted-foreground">
                Seçilen {bikes.length} modeli teknik özellikleri ve fiyatlarıyla yan yana inceleyin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {bikes.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs font-semibold text-muted-foreground hover:text-red-500 transition-colors"
              >
                Listeyi Temizle
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {bikes.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Scale className="w-12 h-12 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-semibold text-foreground">Karşılaştırma listeniz henüz boş.</p>
            <p className="text-xs text-muted-foreground">
              Mağaza kataloğundaki modellerin altındaki "Karşılaştır" butonuna basarak 3 adede kadar motosiklet ekleyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 font-bold text-muted-foreground w-40">Özellik</th>
                  {bikes.map((b) => (
                    <th key={b.id} className="p-3 font-heading font-black text-sm text-foreground min-w-[220px]">
                      <div className="relative bg-muted/40 p-3 rounded-2xl border border-border/80 text-center space-y-2">
                        <button
                          onClick={() => onRemoveBike(b.id)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-red-600 text-white shadow hover:scale-110 transition-transform"
                          title="Kaldır"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <img
                          src={b.images[0]}
                          alt={b.model}
                          onError={(e) => { e.currentTarget.src = "/placeholder.webp"; }}
                          className="h-24 w-full object-contain mx-auto"
                        />
                        <div className="font-bold text-sm text-foreground">{b.brand} {b.model}</div>
                        <div className="text-red-500 font-extrabold text-base">{tl(b.price)}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground bg-muted/20">Silindir Hacmi</td>
                  {bikes.map((b) => (
                    <td key={b.id} className="p-3 font-bold text-foreground">{b.specs.engineCapacity}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground bg-muted/20">Maksimum Güç</td>
                  {bikes.map((b) => (
                    <td key={b.id} className="p-3 text-foreground">{b.specs.maxPower}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground bg-muted/20">Şanzıman</td>
                  {bikes.map((b) => (
                    <td key={b.id} className="p-3 text-foreground">{b.specs.transmission}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground bg-muted/20">Fren Sistemi</td>
                  {bikes.map((b) => (
                    <td key={b.id} className="p-3 text-foreground">{b.specs.brakes}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground bg-muted/20">Yakıt / Batarya</td>
                  {bikes.map((b) => (
                    <td key={b.id} className="p-3 text-foreground">{b.specs.fuelTankOrBattery}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground bg-muted/20">Ehliyet Sınıfı</td>
                  {bikes.map((b) => (
                    <td key={b.id} className="p-3 font-bold text-emerald-500">{b.licenseType}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground bg-muted/20">Ağırlık</td>
                  {bikes.map((b) => (
                    <td key={b.id} className="p-3 text-foreground">{b.specs.weight}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-muted-foreground bg-muted/20">İşlem</td>
                  {bikes.map((b) => (
                    <td key={b.id} className="p-3 space-y-2">
                      <Link
                        to={`/magaza/${b.slug}`}
                        onClick={onClose}
                        className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        İncele <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <a
                        href={`https://wa.me/905348996817?text=Merhaba,%20MotoLux%20${encodeURIComponent(b.model)}%20modeli%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default MotorcycleCompareModal;
