import { useEffect, useRef, useState } from 'react';
import { 
  Compass, 
  Copy, 
  Check, 
  Clock, 
  Bus, 
  Car, 
  Info,
  MapPin,
  RotateCcw
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const POSITION: [number, number] = [41.007132, 28.936435]; // Paşa Motor, Kızılelma Cad. No:66/A, Fatih / İstanbul

export default function InteractiveMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'bus' | 'car'>('bus');
  const [mapReady, setMapReady] = useState(false);
  const [shopStatus, setShopStatus] = useState({ open: true, label: "HESAPLANIYOR", text: "", color: "" });

  // Canlı çalışma saati durumunu hesapla (Türkiye saati UTC+3)
  useEffect(() => {
    const calcStatus = () => {
      const nowUtc = new Date();
      const trTime = new Date(nowUtc.getTime() + (3 * 60 * 60 * 1000));
      const day = trTime.getUTCDay(); // 0: Pazar, 1: Pzt, ..., 6: Cmt
      const hour = trTime.getUTCHours();
      const minute = trTime.getUTCMinutes();
      const timeVal = hour * 100 + minute;

      if (day === 0) { // Pazar
        setShopStatus({
          open: false,
          label: "ŞU AN KAPALI",
          text: "Pazar günleri kapalıyız.",
          color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
        });
      } else if (day === 6) { // Cumartesi
        if (timeVal >= 900 && timeVal < 1700) {
          setShopStatus({
            open: true,
            label: "ŞU AN AÇIK",
            text: "Bugün 17:00'ye kadar servis ve parça satışı aktiftir.",
            color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
          });
        } else {
          setShopStatus({
            open: false,
            label: "ŞU AN KAPALI",
            text: "Cumartesi mesaimiz 17:00'de sonlanmıştır.",
            color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
          });
        }
      } else { // Hafta İçi
        if (timeVal >= 900 && timeVal < 1900) {
          setShopStatus({
            open: true,
            label: "ŞU AN AÇIK",
            text: "Bugün 19:00'a kadar teknik servis & parça mağazamız açık.",
            color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
          });
        } else {
          setShopStatus({
            open: false,
            label: "ŞU AN KAPALI",
            text: "Hafta içi mesai saatlerimiz: 09:00 - 19:00",
            color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
          });
        }
      }
    };

    calcStatus();
    const interval = setInterval(calcStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  // Leaflet Haritasını Başlat (IFRAME KULLANILMAZ - DOM tabanlı doğrudan render)
  useEffect(() => {
    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;

    const initMap = async () => {
      if (!mapContainerRef.current) return;

      try {
        // Dinamik olarak Leaflet'i yükle (ESM/SSR güvenli)
        const leafletModule = await import('leaflet');
        const L = (leafletModule as any).default || leafletModule;

        if (!isMounted || !mapContainerRef.current) return;

        // Halihazırda harita varsa tekrar oluşturma
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize(true);
          return;
        }

        // Harita motorunu başlat
        const map = L.map(mapContainerRef.current, {
          center: POSITION,
          zoom: 16,
          minZoom: 5,
          maxZoom: 19,
          scrollWheelZoom: false, // Sayfa kaydırmayı engellemesin
          zoomControl: false,      // Temiz özel UI
          attributionControl: true
        });

        mapInstanceRef.current = map;

        // Sağ alt köşeye şık zoom kontrolleri ekle
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // OpenStreetMap Karoları (Doğrudan DOM img katmanı)
        const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>',
          crossOrigin: true
        });

        // Yedek karo katmanı (CartoDB OSM) - OSM karosu gecikirse veya engellenirse devreye girer
        osmLayer.on('tileerror', () => {
          if (!map.hasLayer(fallbackLayer)) {
            fallbackLayer.addTo(map);
          }
        });

        const fallbackLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd',
          maxZoom: 19
        });

        osmLayer.addTo(map);

        // Özel Yüksek Çözünürlüklü Paşa Motor Pini (Harici PNG URL'si gerektirmez, %100 SVG)
        const customPinIcon = L.divIcon({
          className: 'custom-pasa-pin',
          html: `
            <div style="position: relative; width: 44px; height: 56px; transform: translate(-50%, -100%); cursor: pointer;">
              <!-- Radar dalga efekti -->
              <div style="position: absolute; bottom: 0; left: 50%; transform: translate(-50%, 50%); width: 34px; height: 34px; background: rgba(220, 38, 38, 0.35); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              
              <!-- Ana Pin Gövdesi -->
              <svg viewBox="0 0 44 56" width="44" height="56" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 8px 16px rgba(0,0,0,0.6));">
                <path d="M22 0C9.84974 0 0 9.84974 0 22C0 36.8 22 56 22 56C22 56 44 36.8 44 22C44 9.84974 34.1503 0 22 0Z" fill="#DC2626"/>
                <path d="M22 2C10.9543 2 2 10.9543 2 22C2 35.2 22 53.5 22 53.5C22 53.5 42 35.2 42 22C42 10.9543 33.0457 2 22 2Z" stroke="#FFFFFF" stroke-width="2.5"/>
                <circle cx="22" cy="21" r="14" fill="#0F172A"/>
                <circle cx="22" cy="21" r="12" fill="#DC2626" opacity="0.2"/>
                <!-- Motor/Kask Silueti -->
                <path d="M15 23C15 19.134 18.134 16 22 16C25.866 16 29 19.134 29 23C29 26.866 25.866 28 22 28C18.134 28 15 26.866 15 23Z" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
                <path d="M18 22H26" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
          popupAnchor: [0, -48]
        });

        const marker = L.marker(POSITION, { icon: customPinIcon }).addTo(map);

        // Şık Kurumsal Bilgi Penceresi (Popup)
        const popupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: 220px; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <span style="background: #DC2626; color: white; font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">Yetkili Servis</span>
              <span style="font-size: 11px; font-weight: 700; color: #0f172a;">Paşa Motor</span>
            </div>
            <div style="font-size: 12px; color: #334155; line-height: 1.4; margin-bottom: 8px;">
              Kızılelma Cad. No:66/A, Kocamustafapaşa / Fatih / İstanbul
            </div>
            <div style="display: flex; gap: 6px;">
              <a href="tel:02125868598" style="flex: 1; background: #0f172a; color: white; text-align: center; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">Hemen Ara</a>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${POSITION[0]},${POSITION[1]}" target="_blank" rel="noopener noreferrer" style="flex: 1; background: #DC2626; color: white; text-align: center; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none;">Yol Tarifi</a>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);

        // Gri ekranı kesinlikle engelleyen periyodik boyut güncellemesi
        const invalidateTimers = [50, 150, 300, 600, 1200, 2500];
        invalidateTimers.forEach(delay => {
          setTimeout(() => {
            if (isMounted && mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize(true);
            }
          }, delay);
        });

        // ResizeObserver ile konteyner boyutu değiştikçe haritayı yenile
        if (window.ResizeObserver && mapContainerRef.current) {
          resizeObserver = new ResizeObserver(() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.invalidateSize(true);
            }
          });
          resizeObserver.observe(mapContainerRef.current);
        }

        if (isMounted) {
          setMapReady(true);
        }
      } catch (err) {
        console.error("Harita motoru başlatılamadı:", err);
      }
    };

    initMap();

    // Temizlik
    return () => {
      isMounted = false;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const resetCenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(POSITION, 16, { animate: true });
      mapInstanceRef.current.invalidateSize(true);
    }
  };

  const openNavigation = (provider: 'google' | 'apple' | 'yandex') => {
    const [lat, lng] = POSITION;
    let url = '';
    switch (provider) {
      case 'google': 
        url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`; 
        break;
      case 'apple': 
        url = `https://maps.apple.com/?daddr=${lat},${lng}`; 
        break;
      case 'yandex': 
        url = `https://yandex.com/maps/?rtext=~${lat},${lng}`; 
        break;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${POSITION[0]}, ${POSITION[1]}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-full min-h-[440px] bg-slate-950 overflow-hidden flex flex-col group select-none">
      
      {/* Üst Hızlı Navigasyon ve Canlı Durum Çubuğu */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex flex-col md:flex-row gap-2.5 pointer-events-auto">
        {/* Navigasyon Sağlayıcı Butonları: Google, Apple, Yandex (OSM kaldırıldı) */}
        <div className="flex-1 bg-slate-950/95 backdrop-blur-md border border-white/15 p-2.5 sm:p-3 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-red-600/20 rounded-xl flex items-center justify-center text-rose-500 border border-rose-500/30 shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.1em] block">Navigasyon Aç</span>
              <span className="text-xs font-black text-white block truncate">Paşa Motor (Kızılelma Cad.)</span>
            </div>
          </div>
          
          <div className="flex gap-1.5 items-center">
            <Button 
              size="sm"
              variant="outline"
              className="h-7 sm:h-8 px-2.5 rounded-lg text-[11px] font-bold border-white/15 hover:bg-slate-800 text-white bg-slate-900/80 transition-all cursor-pointer"
              onClick={() => openNavigation('google')}
              title="Google Haritalar ile Yol Tarifi Al"
            >
              Google
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="h-7 sm:h-8 px-2.5 rounded-lg text-[11px] font-bold border-white/15 hover:bg-slate-800 text-white bg-slate-900/80 transition-all cursor-pointer"
              onClick={() => openNavigation('apple')}
              title="Apple Harita ile Yol Tarifi Al"
            >
              Apple
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="h-7 sm:h-8 px-2.5 rounded-lg text-[11px] font-bold border-[#FFCC00]/30 hover:bg-[#FFCC00]/20 text-[#FFCC00] bg-slate-900/80 transition-all cursor-pointer"
              onClick={() => openNavigation('yandex')}
              title="Yandex Navigasyon ile Yol Tarifi Al"
            >
              Yandex
            </Button>
          </div>
        </div>

        {/* Canlı Mağaza Açık/Kapalı Durum Rozeti */}
        <div className="md:w-64 bg-slate-950/95 backdrop-blur-md border border-white/15 p-2.5 sm:p-3 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full relative shrink-0">
            <span className={`animate-ping absolute inset-0 rounded-full opacity-75 ${shopStatus.open ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${shopStatus.open ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">{shopStatus.label}</span>
              <Clock className="w-3 h-3 text-slate-400" />
            </div>
            <span className="text-[9px] text-slate-400 font-medium truncate block">{shopStatus.text}</span>
          </div>
        </div>
      </div>

      {/* Merkeze Dön Butonu */}
      <button
        onClick={resetCenter}
        title="Haritayı Paşa Motor Konumuna Odakla"
        className="absolute right-3.5 top-28 z-[400] px-2.5 py-1.5 rounded-xl bg-slate-950/90 hover:bg-slate-900 border border-white/20 text-white flex items-center gap-1.5 shadow-xl hover:scale-105 transition-all cursor-pointer text-[10px] font-bold backdrop-blur-md"
      >
        <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
        <span className="hidden sm:inline">Konuma Odakla</span>
      </button>

      {/* Harita Yükleniyor Arka Plan İskeleti */}
      {!mapReady && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-2">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold tracking-wide text-slate-300">Harita Yükleniyor...</span>
        </div>
      )}

      {/* DOĞRUDAN DOM TABANLI LEAFLET & OPENSTREETMAP KONTEYNERİ (IFRAME DEĞİLDİR) */}
      <div 
        ref={mapContainerRef} 
        id="pasa-motor-osm-map"
        className="w-full h-full min-h-[440px] flex-1 relative z-0"
        style={{ width: '100%', height: '100%', minHeight: '440px' }}
      />

      {/* Alt Bilgi & GPS / Ulaşım Çubuğu */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] flex flex-col sm:flex-row gap-2.5 pointer-events-auto">
        {/* Koordinat Kopyalama Kartı */}
        <button
          onClick={handleCopyCoords}
          className="bg-slate-950/95 backdrop-blur-md border border-white/15 p-2.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex items-center justify-between text-left hover:border-indigo-500/40 hover:bg-slate-950 duration-200 transition-all select-none cursor-pointer group shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              {copied ? <Check className="w-4 h-4 text-emerald-400 shadow-inner" /> : <Copy className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.1em] block">GPS Koordinatları</span>
              <span className="text-[11px] font-bold text-white font-mono block">41.007132, 28.936435</span>
            </div>
          </div>
          <div className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20 ml-4 group-hover:bg-indigo-600/20 duration-200">
            {copied ? 'Kopyalandı ✓' : 'Kopyala'}
          </div>
        </button>

        {/* Ulaşım İpuçları Kartı */}
        <div className="flex-1 bg-slate-950/95 backdrop-blur-md border border-white/15 p-2.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex flex-col justify-center gap-1.5">
          <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Info className="w-3 h-3 text-indigo-400" /> Pratik Ulaşım İpuçları
            </span>
            <div className="flex bg-slate-900 border border-white/10 rounded-lg p-0.5">
              <button
                onClick={() => setActiveTab('bus')}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-md flex items-center gap-1 transition-colors cursor-pointer ${activeTab === 'bus' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Bus className="w-3 h-3" /> Toplu Taşıma
              </button>
              <button
                onClick={() => setActiveTab('car')}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-md flex items-center gap-1 transition-colors cursor-pointer ${activeTab === 'car' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Car className="w-3 h-3" /> Motor & Araç
              </button>
            </div>
          </div>

          <div className="text-[10px] leading-relaxed text-zinc-300 px-0.5 font-sans">
            {activeTab === 'bus' ? (
              <span className="block whitespace-normal break-words font-medium">
                🚌 <strong className="text-white font-semibold">35C, 35D, 35A, 35T</strong> otobüs hatlarıyla <strong className="text-white font-semibold">Kızılelma Durağında</strong> inebilirsiniz. Fındıkzade Tramvay ve Marmaray'a 12 dk yürüyüş mesafesindedir.
              </span>
            ) : (
              <span className="block whitespace-normal break-words font-medium">
                🏍️ <strong className="text-white font-semibold">Kızılelma Caddesi No:66/A</strong> üzerindeyiz. Kocamustafapaşa Meydanı tabelalarını takip ederek mağazamızın önüne kolayca ulaşabilirsiniz.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
