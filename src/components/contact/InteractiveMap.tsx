import { useEffect, useRef, useState } from 'react';
import { Compass, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

const POSITION = [41.007132, 28.936435]; // Exact Yandex maps coordinate for Paşa Motor, Fatih

declare global {
  interface Window {
    ymaps: any;
  }
}

export default function InteractiveMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

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
      { rootMargin: "300px" } // Load map when it's 300px close to the viewport
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

        // Clean up previous instance if doing hot-reload
        mapContainerRef.current.innerHTML = '';

        mapInstance = new window.ymaps.Map(mapContainerRef.current, {
          center: POSITION,
          zoom: 18,
          controls: [] // Minimalist UI
        }, {
          searchControlProvider: 'yandex#search'
        });

        // Use standard Yandex circle marker with pulse-like effect
        const MyIconContentLayout = window.ymaps.templateLayoutFactory.createClass(
          '<div class="relative flex items-center justify-center">' +
          '<div class="absolute w-14 h-14 bg-red-600/30 rounded-full animate-pulse"></div>' +
          '<div class="relative w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-2xl border-2 border-white">' +
          '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>' +
          '</div>' +
          '</div>'
        );

        const placemark = new window.ymaps.Placemark(POSITION, {
          hintContent: 'Paşa Motor',
          balloonContent: '<div style="padding: 10px"><strong>Paşa Motor</strong><br/>Motosiklet Servis Center</div>'
        }, {
          iconLayout: 'default#imageWithContent',
          iconImageHref: '', // Transparent pixel or empty
          iconImageSize: [40, 40],
          iconImageOffset: [-20, -20],
          iconContentLayout: MyIconContentLayout
        });

        mapInstance.geoObjects.add(placemark);

        // Ensure the map fills the container correctly
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

        // Sequential triggers to combat browser layout delays
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
      case 'google': url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`; break;
      case 'yandex': url = `https://yandex.com/maps/?rtext=~${lat},${lng}`; break;
      case 'apple': url = `maps://maps.apple.com/?daddr=${lat},${lng}`; break;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="relative w-full h-full bg-[#f8fafc] overflow-hidden group">
      {/* Map Host Container */}
      <div 
        ref={mapContainerRef} 
        className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} map-container-wrapper`}
      />

      {/* Floating Directions Badge (Apple Style) */}
      <div className="absolute bottom-6 right-6 z-[1000] pointer-events-none transition-transform group-hover:scale-110 duration-700">
        <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-[20px] border border-white shadow-2xl flex items-center gap-3">
          <div className="relative">
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>
          <span className="text-[11px] font-black text-gray-900 uppercase tracking-[0.1em] whitespace-nowrap">Yol Tarifi Hazır</span>
        </div>
      </div>

      {/* High-Readability Action Bar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2.5rem)] max-w-md">
        <div className="bg-black/95 backdrop-blur-3xl border border-white/20 p-2.5 rounded-[26px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex items-center justify-between">
          <div className="flex items-center gap-3 pl-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary shadow-inner border border-primary/30">
              <Compass className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] leading-none mb-1">Lokasyon</span>
              <span className="text-sm font-bold text-white leading-none">Paşa Motor Fatih</span>
            </div>
          </div>
          
          <div className="flex gap-2 pr-1">
            <Button 
              className="h-11 px-6 rounded-2xl bg-white text-black hover:bg-gray-200 transition-all duration-300 text-[13px] font-black shadow-[0_8px_20px_rgba(255,255,255,0.15)]"
              onClick={() => openNavigation('google')}
            >
              Git
            </Button>
            <Button 
              className="h-11 px-6 rounded-2xl bg-[#FFCC00] text-black hover:bg-[#e6b800] transition-all duration-300 text-[13px] font-black shadow-[0_8px_20px_rgba(255,204,0,0.2)]"
              onClick={() => openNavigation('yandex')}
            >
              Yandex
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
