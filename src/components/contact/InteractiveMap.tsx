import { useEffect, useRef, useState } from 'react';
import { 
  Compass, 
  ExternalLink, 
  Copy, 
  Check, 
  Clock, 
  Bus, 
  Car, 
  MapPin, 
  Navigation,
  Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const POSITION = [41.007132, 28.936435]; // Exact coordinate for Paşa Motor, Fatih

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function InteractiveMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'bus' | 'car'>('bus');
  const [shopStatus, setShopStatus] = useState({ open: true, label: "HESAPLANIYOR", text: "", color: "" });

  // Compute live open/closed state on render & every 30 seconds
  useEffect(() => {
    const calcStatus = () => {
      const nowUtc = new Date();
      // TR is UTC+3. Calculate Turkish local time:
      const trTime = new Date(nowUtc.getTime() + (3 * 60 * 60 * 1000));
      const day = trTime.getUTCDay(); // 0: Sunday, 1: Mon, ..., 6: Sat
      const hour = trTime.getUTCHours();
      const minute = trTime.getUTCMinutes();
      const timeVal = hour * 100 + minute;

      if (day === 0) { // Sunday
        setShopStatus({
          open: false,
          label: "ŞU AN KAPALI",
          text: "Pazar günleri kapalıyız.",
          color: "text-rose-500 bg-rose-500/10 border-rose-500/20"
        });
      } else if (day === 6) { // Saturday
        if (timeVal >= 900 && timeVal < 1700) {
          setShopStatus({
            open: true,
            label: "ŞU AN AÇIK",
            text: "Bugün 17:00'ye kadar teknik servis ve parça satışı aktiftir.",
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
      } else { // Weekdays
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

  // IntersectionObserver to delay map load until client is near the component
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "300px" }
    );

    observer.observe(mapContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView) return;

    let mapInstance: any = null;
    let resizeObserver: ResizeObserver | null = null;
    let timeouts: NodeJS.Timeout[] = [];

    const initMap = () => {
      window.ymaps.ready(() => {
        if (!mapContainerRef.current) return;

        mapContainerRef.current.innerHTML = '';

        mapInstance = new window.ymaps.Map(mapContainerRef.current, {
          center: POSITION,
          zoom: 17,
          controls: ['zoomControl', 'geolocationControl']
        }, {
          searchControlProvider: 'yandex#search'
        });

        // Use custom balloon and icon for Paşa Motor
        const MyIconContentLayout = window.ymaps.templateLayoutFactory.createClass(
          '<div style="transform: translate(0, -10px);" class="relative flex flex-col items-center justify-center shrink-0">' +
          /* Glowing ripple ring */
          '<div class="absolute w-14 h-14 bg-red-600/15 rounded-full animate-ping pointer-events-none"></div>' +
          '<div class="absolute w-8 h-8 bg-red-600/25 rounded-full animate-pulse pointer-events-none"></div>' +
          /* Corporate Pill Box Banner */
          '<div class="px-2 py-0.5 bg-slate-950/95 border border-red-500/40 rounded-lg shadow-xl text-[9px] font-black text-white whitespace-nowrap mb-1.5 flex items-center gap-1 shrink-0">' +
          '<span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>' +
          '<span>PAŞA MOTOR</span>' +
          '</div>' +
          /* Corporate Shield / Hexagon Frame */
          '<div class="w-9 h-9 bg-slate-900 rounded-xl border-2 border-red-600 flex items-center justify-center shadow-2xl text-white transform hover:scale-105 duration-200 transition-transform">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>' +
          '</div>' +
          /* Downward Triangle Arrow Point */
          '<div class="w-2 h-2 bg-slate-900 border-r border-b border-red-600 transform rotate-45 -mt-1 shadow-md"></div>' +
          '</div>'
        );

        const placemark = new window.ymaps.Placemark(POSITION, {
          hintContent: 'Paşa Motor | Yedek Parça & Yetkili Servis',
          balloonContent: `
            <div style="font-family: sans-serif; padding: 12px 6px; width: 220px; line-height: 1.5;">
              <h4 style="margin: 0 0 4px 0; color: #dc2626; font-size: 14px; font-weight: bold;">Paşa Motor</h4>
              <p style="margin: 0 0 8px 0; font-size: 11px; color: #475569;">TVS, Hero, Falcon, Işıldar Yetkili Servisi & Orijinal Parça Merkezi</p>
              <div style="font-size: 10px; color: #64748b; font-weight: 500; border-top: 1px dashed #cbd5e1; padding-top: 6px;">
                📍 Kızılelma Cad. No:66/A Kocamustafapaşa / Fatih
              </div>
            </div>
          `
        }, {
          iconLayout: 'default#imageWithContent',
          iconImageHref: '', // Transparent
          iconImageSize: [50, 75],
          iconImageOffset: [-25, -60],
          iconContentLayout: MyIconContentLayout
        });

        mapInstance.geoObjects.add(placemark);

        // Responsive Resyncing
        const forceResync = () => {
          if (mapInstance && mapInstance.container) {
            mapInstance.container.fitToViewport();
          }
        };

        resizeObserver = new ResizeObserver(() => {
          forceResync();
        });

        if (mapContainerRef.current) {
          resizeObserver.observe(mapContainerRef.current);
        }

        timeouts = [100, 500, 1500, 3000].map(d => setTimeout(forceResync, d));
        setIsLoaded(true);
      });
    };

    if (window.ymaps) {
      initMap();
    } else {
      const scriptSrc = 'https://api-maps.yandex.ru/2.1/?lang=tr_TR';
      let script = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement;
      
      if (script) {
        script.addEventListener('load', initMap);
      } else {
        script = document.createElement('script');
        script.src = scriptSrc;
        script.async = true;
        script.onload = initMap;
        document.body.appendChild(script);
      }
    }

    return () => {
      timeouts.forEach(clearTimeout);
      if (resizeObserver) resizeObserver.disconnect();
      if (mapInstance) {
        mapInstance.destroy();
      }
    };
  }, [isInView]);

  const openNavigation = (provider: 'google' | 'yandex' | 'apple') => {
    const [lat, lng] = POSITION;
    let url = '';
    switch (provider) {
      case 'google': 
        url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`; 
        break;
      case 'yandex': 
        url = `https://yandex.com/maps/?rtext=~${lat},${lng}`; 
        break;
      case 'apple': 
        url = `https://maps.apple.com/?daddr=${lat},${lng}`; 
        break;
    }
    window.open(url, '_blank');
  };

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${POSITION[0]}, ${POSITION[1]}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden flex flex-col group">
      
      {/* Top Overlay Action Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-[999] flex flex-col md:flex-row gap-3">
        {/* Navigation Provider Control */}
        <div className="flex-1 bg-slate-950/95 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-red-600/20 rounded-xl flex items-center justify-center text-rose-500 border border-rose-500/30 shrink-0">
              <Compass className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.1em] block">Hızlı Navigasyon</span>
              <span className="text-xs font-black text-white block">Paşa Motor Fatih</span>
            </div>
          </div>
          
          <div className="flex gap-1.5 items-center">
            <Button 
              size="sm"
              variant="outline"
              className="h-8 px-2.5 rounded-lg text-[11px] font-bold border-white/10 hover:bg-slate-800 text-white bg-slate-900/60 transition-all"
              onClick={() => openNavigation('google')}
              title="Google Haritalar ile Git"
            >
              Google
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="h-8 px-2.5 rounded-lg text-[11px] font-bold border-[#FFCC00]/20 hover:bg-[#FFCC00]/20 text-[#FFCC00] bg-slate-900/60 transition-all"
              onClick={() => openNavigation('yandex')}
              title="Yandex Harita ile Git"
            >
              Yandex
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="h-8 px-2.5 rounded-lg text-[11px] font-bold border-white/10 hover:bg-slate-800 text-white bg-slate-900/60 transition-all"
              onClick={() => openNavigation('apple')}
              title="Apple Maps ile Yol Tarifi Al"
            >
              Apple
            </Button>
          </div>
        </div>

        {/* Dynamic Shop Hours Badge */}
        <div className="md:w-64 bg-slate-950/95 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.5)] flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full relative shrink-0 ${shopStatus.open ? 'bg-emerald-555' : 'bg-rose-500'}`}>
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

      {/* Map Canvas Host */}
      <div 
        ref={mapContainerRef} 
        className={`flex-1 w-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-40'} map-container-wrapper relative z-10`}
      />

      {/* Bottom Interactive Transport & Location Copier Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-[999] flex flex-col sm:flex-row gap-3">
        {/* Exact Coordinates Copying Block */}
        <button
          onClick={handleCopyCoords}
          className="bg-slate-950/95 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex items-center justify-between text-left hover:border-indigo-500/40 hover:bg-slate-950 duration-350 transition-all select-none cursor-pointer group shrink-0"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
              {copied ? <Check className="w-4 h-4 text-emerald-400 shadow-inner" /> : <Copy className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.1em] block">GPS Koordinatları</span>
              <span className="text-[11px] font-bold text-white font-mono block">41.007132, 28.936435</span>
            </div>
          </div>
          <div className="text-[10px] font-black text-indigo-400 bg-indigo-500/5 px-2 py-1 rounded border border-indigo-500/10 ml-4 group-hover:bg-indigo-555 group-hover:bg-indigo-600/20 group-hover:text-indigo-300 duration-200">
            {copied ? 'Kopyalandı ✓' : 'Kopyala'}
          </div>
        </button>

        {/* Quick Transit Information Overlay (Very useful for couriers, clients & motorists) */}
        <div className="flex-1 bg-slate-950/95 backdrop-blur-md border border-white/10 p-2.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.4)] flex flex-col justify-center gap-2">
          {/* Tabs header */}
          <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-1.5">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1">
              <Info className="w-3 h-3 text-indigo-400" /> Pratik Ulaşım İpuçları
            </span>
            <div className="flex bg-slate-900 border border-white/5 rounded-lg p-0.5">
              <button
                onClick={() => setActiveTab('bus')}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-md flex items-center gap-1 transition-colors ${activeTab === 'bus' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Bus className="w-3 h-3" /> Toplu Taşıma
              </button>
              <button
                onClick={() => setActiveTab('car')}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-md flex items-center gap-1 transition-colors ${activeTab === 'car' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Car className="w-3 h-3" /> Motor & Araç
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="text-[10px] leading-relaxed text-zinc-300 px-1 font-sans">
            {activeTab === 'bus' ? (
              <span className="block whitespace-normal break-words font-medium leading-relaxed">
                🚌 <strong className="text-white font-semibold">35C, 35D, 35A, 35T</strong> otobüs hattıyla <strong className="text-white font-semibold">Kızılelma Durağında</strong> inerek dükkanımıza ulaşabilirsiniz. Fındıkzade Tramvay ve Marmaray'a 12 dk yürüyüş mesafesindedir.
              </span>
            ) : (
              <span className="block whitespace-normal break-words font-medium leading-relaxed">
                🏍️ <strong className="text-white font-semibold">Kızılelma Caddesi</strong> üzerindeyiz, Kocamustafapaşa Meydanı yönündeki tabelaları takip ederek merkezimize kolayca ulaşabilirsiniz.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
