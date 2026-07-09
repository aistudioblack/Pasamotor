import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, DecodeHintType, BarcodeFormat } from '@zxing/library';
import { X, RefreshCw, ScanLine, Loader2, AlertCircle, Flashlight, FlashlightOff, Focus } from 'lucide-react';
import { secureStorage } from '../../lib/secure-storage';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

// Global declaration for Native API
declare global {
  class BarcodeDetector {
    constructor(options?: { formats: string[] });
    detect(image: any): Promise<Array<{ rawValue: string }>>;
    static getSupportedFormats(): Promise<string[]>;
  }
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [error, setError] = useState<string>('');
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isMirrored, setIsMirrored] = useState(false);
  
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);

  const [hasPermission, setHasPermission] = useState<boolean>(() => {
     return secureStorage.getItem('cameraPermissionGranted') === 'true';
  });

  const animationFrameId = useRef<number | null>(null);
  const lastScannedCode = useRef<string | null>(null);
  const lastScanTime = useRef<number>(0);
  const isComponentUnmounted = useRef<boolean>(false);
  
  const streamRef = useRef<MediaStream | null>(null);
  
  const zxingReader = useRef<BrowserMultiFormatReader | null>(null);
  const nativeDetector = useRef<any>(null);

  // Initialize Engines
  useEffect(() => {
    isComponentUnmounted.current = false;

    // ZXing Fallback Config
    const hints = new Map();
    hints.set(DecodeHintType.POSSIBLE_FORMATS, [
      BarcodeFormat.EAN_13,
      BarcodeFormat.CODE_128,
      BarcodeFormat.QR_CODE,
      BarcodeFormat.UPC_A,
      BarcodeFormat.CODE_39
    ]);
    hints.set(DecodeHintType.TRY_HARDER, true);
    zxingReader.current = new BrowserMultiFormatReader(hints);

    // Native BarcodeDetector (Chrome/Apple ML)
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      (window as any).BarcodeDetector.getSupportedFormats().then((formats: string[]) => {
        const desiredFormats = ['ean_13', 'code_128', 'qr_code', 'upc_a', 'code_39'];
        const activeFormats = formats.filter(f => desiredFormats.includes(f));
        if (activeFormats.length > 0) {
          nativeDetector.current = new (window as any).BarcodeDetector({ formats: activeFormats });
        }
      }).catch((e: Error) => console.warn('Native detector not available', e));
    }

    return () => {
      isComponentUnmounted.current = true;
    };
  }, []);

  // Beep Sound
  const playBeep = useCallback(() => {
    try {
      const audio = new Audio('/pasa-motor-beep.mp3');
      audio.volume = 0.8;
      audio.play().catch(e => console.debug("Audio play blocked", e));
    } catch (e) {
      console.debug("Audio play failed", e);
    }
  }, []);

  const handleSuccessfulScan = useCallback((decodedText: string) => {
    const now = Date.now();
    // 2 Seconds Cooldown to prevent duplicate reads
    if (decodedText === lastScannedCode.current && (now - lastScanTime.current < 2000)) {
      return; 
    }
    
    lastScannedCode.current = decodedText;
    lastScanTime.current = now;

    playBeep();
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
    
    setIsScanning(true);
    setTimeout(() => {
       if (!isComponentUnmounted.current) setIsScanning(false);
    }, 600);

    onScan(decodedText);
  }, [onScan, playBeep]);

  // Scan Loop
  const scanLoop = useCallback(async () => {
    if (isComponentUnmounted.current) return;

    const video = videoRef.current;
    if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameId.current = requestAnimationFrame(scanLoop);
      return;
    }

    try {
      let decodedText: string | null = null;
      
      // 1. Native API (Full frame, ultra fast 0-copy)
      if (nativeDetector.current) {
        try {
          const barcodes = await nativeDetector.current.detect(video);
          if (barcodes.length > 0) decodedText = barcodes[0].rawValue;
        } catch(e) { /* silent fail, continue to zxing */ }
      }

      // 2. ZXing Fallback
      if (!decodedText && zxingReader.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        
        if (ctx) {
          // IMPORTANT FIX: Never downscale the barcode! Downscaling blurs it and causes failures.
          // Instead, we crop the center 600x400 area at 1:1 pixel resolution.
          const vWidth = video.videoWidth;
          const vHeight = video.videoHeight;
          const cropW = Math.min(vWidth, 800);
          const cropH = Math.min(vHeight, 500);
          
          canvas.width = cropW;
          canvas.height = cropH;
          
          const sx = (vWidth - cropW) / 2;
          const sy = (vHeight - cropH) / 2;
          
          // Draw the high-res center region to canvas
          ctx.drawImage(video, sx, sy, cropW, cropH, 0, 0, cropW, cropH);
          
          try {
            const result = await (zxingReader.current as any).decodeFromCanvas(canvas);
            decodedText = result.getText();
          } catch(e) {
            // ZXing constantly throws NotFoundException on empty frames, ignore.
          }
        }
      }

      if (decodedText) {
        handleSuccessfulScan(decodedText);
      }
    } finally {
      // Loop with slight delay to prevent completely freezing the main thread
      setTimeout(() => {
        if (!isComponentUnmounted.current) {
          animationFrameId.current = requestAnimationFrame(scanLoop);
        }
      }, 50);
    }
  }, [handleSuccessfulScan]);

  const startCamera = useCallback(async (deviceId?: string) => {
    // Cleanup Stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);

    setIsCameraReady(false);
    setError('');
    setTorchSupported(false);
    setTorchEnabled(false);

    try {
      const constraints: MediaStreamConstraints = {
        audio: false,
        video: deviceId 
          ? { deviceId: { exact: deviceId } }
          : { 
              facingMode: { ideal: 'environment' },
              width: { ideal: 1920 }, // Force highest resolution available on device
              height: { ideal: 1080 }
            }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      const track = stream.getVideoTracks()[0];
      if (track) {
        const settings = track.getSettings();
        // Visual mirroring for front cameras. 
        // Note: Canvas drawImage captures unmirrored, giving us accurate text reading!
        setIsMirrored(settings.facingMode === 'user');
        
        if (track.getCapabilities) {
           const caps = track.getCapabilities() as any;
           if (caps.torch) {
             setTorchSupported(true);
           }
           if (caps.focusMode && caps.focusMode.includes("continuous")) {
              try { await track.applyConstraints({ advanced: [{ focusMode: "continuous" } as any] }); } catch(err) { console.warn("Failed to apply focusMode", err); }
           }
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
        
        setIsCameraReady(true);
        setHasPermission(true);
        secureStorage.setItem('cameraPermissionGranted', 'true');
        animationFrameId.current = requestAnimationFrame(scanLoop);
      }
    } catch (err: any) {
      console.error("Camera fail:", err);
      // Fallback
      if (!deviceId && (err.name === 'OverconstrainedError' || err.name === 'NotReadableError')) {
         try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
               videoRef.current.srcObject = fallbackStream;
               streamRef.current = fallbackStream;
               await videoRef.current.play();
               setIsMirrored(true); // Usually desktop
               setIsCameraReady(true);
               animationFrameId.current = requestAnimationFrame(scanLoop);
            }
         } catch(e) {
            setError('Kamera başlatılamadı. İzinlerinizi kontrol edin.');
         }
      } else {
         setError(`Kamera bulunamadı veya erişim engellendi. (${err.name})`);
      }
    }
  }, [scanLoop]);

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !torchEnabled;
        await track.applyConstraints({
          advanced: [{ torch: nextState } as any]
        });
        setTorchEnabled(nextState);
      } catch (e) {
        console.warn("Torch set failed", e);
      }
    }
  };

  const manualFocus = async () => {
    // Attempting to trigger refocus or a UI hint
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (navigator.vibrate) navigator.vibrate(20);
    
    // In theory, re-applying continuous focus might trigger an AF run
    if (track && track.getCapabilities) {
      const caps = track.getCapabilities() as any;
      if (caps.focusMode && caps.focusMode.includes("continuous")) {
         try { await track.applyConstraints({ advanced: [{ focusMode: "continuous" } as any] }); } catch(err) { console.warn("Failed to apply focusMode", err); }
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        if (mounted) setCameras(videoDevices);
      } catch (err) {
        console.warn("Could not enumerate devices", err);
      }
      
      // If we don't know yet if we have permissions, we don't start automatically.
      const permissionGranted = secureStorage.getItem('cameraPermissionGranted') === 'true';
      if (permissionGranted && !streamRef.current) {
         await startCamera();
      }
    };
    init();

    return () => {
      mounted = false;
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
     
  }, [startCamera]);

  const switchCamera = () => {
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex(c => c.deviceId === activeCameraId);
      const nextIndex = (currentIndex + 1) % cameras.length;
      const nextCamera = cameras[nextIndex];
      setActiveCameraId(nextCamera.deviceId);
      startCamera(nextCamera.deviceId);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-black sm:rounded-[36px] w-full h-full sm:h-auto sm:max-w-md overflow-hidden flex flex-col relative sm:border sm:border-white/15 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
        
        {/* Header */}
        <div className="absolute top-0 inset-x-0 z-30 px-5 pt-8 pb-4 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/50 to-transparent">
          <div className="px-4 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white/90 text-sm font-semibold flex items-center gap-2 shadow-lg">
            <ScanLine className="w-4 h-4 text-white" /> Barkod Okuyucu
          </div>
          <button onClick={onClose} className="p-2.5 bg-black/40 hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-white transition-colors shadow-lg">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
        
        {/* Camera Area */}
        <div 
           className="relative flex-1 bg-black flex flex-col items-center justify-center overflow-hidden min-h-[600px] cursor-pointer"
           onClick={manualFocus}
        >
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            style={{ 
              opacity: isCameraReady ? 1 : 0, 
              transform: isMirrored ? 'scaleX(-1)' : 'none'
            }}
            muted
            playsInline
          />

          <canvas ref={canvasRef} className="hidden" />

          {/* Load State */}
          {/* Loading or Permission Required state */}
          {!isCameraReady && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
              {!hasPermission ? (
                <div className="flex flex-col items-center gap-6 p-6 max-w-sm text-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-2 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                     <ScanLine className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">Kamera Erişimi</h3>
                    <p className="text-white/60 text-[15px] leading-relaxed mb-8">
                       Barkod okuyabilmek için kameranıza erişim izni vermeniz gerekmektedir. İzinleriniz cihazınızda güvenle saklanır.
                    </p>
                  </div>
                  <button 
                    onClick={() => startCamera()} 
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all shadow-lg active:scale-[0.98]"
                  >
                     Devam Et (İzin İste)
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white/5 rounded-full border border-white/10 animate-pulse">
                     <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
                  </div>
                  <p className="text-white/50 font-medium text-sm tracking-wide">Kamera Hazırlanıyor...</p>
                </div>
              )}
            </div>
          )}

          {/* Scanner Outline Box */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center px-6 z-20">
            <div className={`w-full max-w-[280px] aspect-[1.3/1] relative transition-all duration-300 ease-out ${isScanning ? 'scale-105' : 'scale-100'}`}>
              
              {/* Blur Overlay around the cutout (CSS Trick using huge boxShadow) */}
              <div className="absolute inset-0 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] transition-colors duration-500" />
              
              {/* Corner Brackets */}
              <div className="absolute -top-1 -left-1 w-10 h-10 border-t-[3px] border-l-[3px] border-white/90 rounded-tl-2xl drop-shadow-md" />
              <div className="absolute -top-1 -right-1 w-10 h-10 border-t-[3px] border-r-[3px] border-white/90 rounded-tr-2xl drop-shadow-md" />
              <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-[3px] border-l-[3px] border-white/90 rounded-bl-2xl drop-shadow-md" />
              <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-[3px] border-r-[3px] border-white/90 rounded-br-2xl drop-shadow-md" />
              
              {/* Success Flash / Pulse */}
              <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${isScanning ? 'bg-green-500/40 shadow-[0_0_40px_rgba(34,197,94,0.4)]' : 'bg-transparent'}`} />
              
              {/* Animated Red Laser Line */}
              {isCameraReady && !isScanning && (
                <div 
                  className="absolute left-4 right-4 h-[2px] bg-red-500 shadow-[0_0_15px_4px_rgba(239,68,68,0.5)] rounded-full" 
                  style={{
                    animation: 'scan-laser 2s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate'
                  }}
                />
              )}
            </div>
            
          {/* Status Feedback and Focus Instruction */}
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-50 p-6 backdrop-blur-md">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                   <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 text-center">Kamera Erişimi Gerekli</h3>
                <p className="text-white/70 text-center mb-8 max-w-sm leading-relaxed">
                  {error} Lütfen cihazınızın ve tarayıcınızın (adres çubuğundaki kilit simgesi) ayarlarından kameraya izin verin.
                </p>
                <button 
                  onClick={() => startCamera()} 
                  className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors"
                >
                  Tekrar Dene
                </button>
            </div>
          ) : (
              <div className="mt-12 flex flex-col items-center gap-4">
                 <p className={`text-white text-[15px] font-semibold tracking-wide text-center px-6 py-3 rounded-2xl shadow-2xl transition-all duration-300 ${isScanning ? 'bg-green-500 scale-110 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'bg-black/60 backdrop-blur-xl border border-white/10'}`}>
                   {isScanning ? 'Barkod Okundu' : 'Barkodu Çerçeveye Hizalayın'}
                 </p>
                 <div className="flex items-center gap-1.5 text-white/60 bg-black/40 px-4 py-2 rounded-full text-xs border border-white/5 backdrop-blur-sm">
                   <Focus className="w-3.5 h-3.5 opacity-70" />
                   Ekrana dokunarak odaklayabilirsiniz
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-0 inset-x-0 p-8 pb-12 flex justify-center items-center gap-4 bg-gradient-to-t from-black via-black/80 to-transparent z-30">
          {torchSupported && (
            <button 
              onClick={toggleTorch}
              className={`flex items-center justify-center p-4 rounded-full backdrop-blur-2xl border transition-all active:scale-95 shadow-xl ${
                torchEnabled 
                  ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' 
                  : 'bg-black/40 text-white border-white/10 hover:bg-white/10'
              }`}
            >
              {torchEnabled ? <Flashlight className="w-6 h-6" /> : <FlashlightOff className="w-6 h-6" />}
            </button>
          )}

          {cameras.length > 1 && (
            <button 
              onClick={switchCamera} 
              className="flex items-center justify-center p-4 rounded-full bg-black/40 hover:bg-white/10 text-white backdrop-blur-2xl border border-white/10 transition-all active:scale-95 shadow-xl"
            >
              <RefreshCw className="w-6 h-6" />
            </button>
          )}
        </div>

        <style>{`
          @keyframes scan-laser {
            0% { top: 10%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 90%; opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default BarcodeScanner;

