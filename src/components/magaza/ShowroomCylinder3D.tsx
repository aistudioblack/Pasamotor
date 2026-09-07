import React, { useEffect, useRef, useState, useMemo, Suspense } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { useProgress } from "@/hooks/useProgress";
import { ShowroomLoadingProgress } from "./ShowroomLoadingProgress";

interface ShowroomCylinder3DProps {
  glowColor?: string;
  bikeId?: string | number;
  bikeCategory?: string;
  gltfModelUrl?: string;
  className?: string;
}

// Lightweight cached shadow texture (generated once in memory to prevent GPU thrashing)
let cachedShadowTexture: THREE.CanvasTexture | null = null;
const getOrCreateShadowTexture = (): THREE.CanvasTexture => {
  if (cachedShadowTexture) return cachedShadowTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 60, 256, 256, 256);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.95)");
    grad.addColorStop(0.35, "rgba(0, 0, 0, 0.7)");
    grad.addColorStop(0.75, "rgba(0, 0, 0, 0.2)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }
  cachedShadowTexture = new THREE.CanvasTexture(canvas);
  return cachedShadowTexture;
};

// High-fidelity brushed titanium turntable platter radial texture
let cachedPlatterTexture: THREE.CanvasTexture | null = null;
const getOrCreatePlatterTexture = (): THREE.CanvasTexture => {
  if (cachedPlatterTexture) return cachedPlatterTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const cx = 512;
    const cy = 512;

    // Rich dark-titanium radial gradient with satin luster
    const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 512);
    bgGrad.addColorStop(0, "#2c3244");
    bgGrad.addColorStop(0.25, "#1f2433");
    bgGrad.addColorStop(0.65, "#131722");
    bgGrad.addColorStop(0.9, "#0b0d14");
    bgGrad.addColorStop(1, "#06070a");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Fine concentric machined grooves that catch studio reflections
    ctx.lineWidth = 1;
    for (let r = 50; r < 490; r += 8) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${r % 32 === 0 ? 0.05 : 0.018})`;
      ctx.stroke();
    }

    // Laser degree tick markings around platter perimeter
    for (let angle = 0; angle < 360; angle += 5) {
      const rad = (angle * Math.PI) / 180;
      const isMajor = angle % 30 === 0;
      const tickLength = isMajor ? 16 : 8;
      const startR = 482 - tickLength;
      const endR = 482;

      const x1 = cx + Math.cos(rad) * startR;
      const y1 = cy + Math.sin(rad) * startR;
      const x2 = cx + Math.cos(rad) * endR;
      const y2 = cy + Math.sin(rad) * endR;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isMajor ? "rgba(255, 255, 255, 0.45)" : "rgba(255, 255, 255, 0.18)";
      ctx.lineWidth = isMajor ? 2 : 1;
      ctx.stroke();
    }

    // Outer guideline
    ctx.beginPath();
    ctx.arc(cx, cy, 482, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  cachedPlatterTexture = new THREE.CanvasTexture(canvas);
  return cachedPlatterTexture;
};

// Internal 3D Canvas Scene
const ShowroomCylinderCanvas: React.FC<ShowroomCylinder3DProps & {
  onProgressUpdate?: (p: number, item?: string) => void;
}> = ({
  glowColor = "#ef4444",
  bikeId = "default",
  gltfModelUrl,
  className = "",
  onProgressUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Compute adaptive theme colors based on motorcycle body color
  const primaryColor = useMemo(() => new THREE.Color(glowColor || "#ef4444"), [glowColor]);
  const targetColorRef = useRef<THREE.Color>(primaryColor);

  useEffect(() => {
    targetColorRef.current = primaryColor;
  }, [primaryColor, bikeId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE & PERSPECTIVE CAMERA
    const scene = new THREE.Scene();
    const width = container.clientWidth || 760;
    const height = container.clientHeight || 280;

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 50);
    camera.position.set(0, 2.1, 5.6);
    camera.lookAt(0, -0.06, 0);

    // High-performance WebGL Renderer with bright, crisp tone mapping
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      precision: "mediump",
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.45; // Enhanced exposure to eliminate murky dark look

    container.appendChild(renderer.domElement);

    // KTX2 & DRACO COMPRESSED TEXTURE PIPELINE
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/libs/basis/");
    ktx2Loader.detectSupport(renderer);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

    // ==============================================================
    // STUDIO ILLUMINATION RIG (BRIGHT & CRISP AUTOMOTIVE SHOWROOM)
    // ==============================================================
    // 1. Ambient Baseline Fill
    const ambientLight = new THREE.AmbientLight(0xf0f4fc, 1.25);
    scene.add(ambientLight);

    // 2. High-Powered Overhead Key Spotlight
    const overheadSpot = new THREE.SpotLight(0xffffff, 3.2, 18, Math.PI / 3.5, 0.4, 1.2);
    overheadSpot.position.set(0, 7.5, 3.0);
    scene.add(overheadSpot);

    // 3. Front Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 5, 4.5);
    scene.add(keyLight);

    // 4. Cool Rim Kicker Light (Left/Back)
    const rimLightLeft = new THREE.DirectionalLight(0xa5c4ff, 1.5);
    rimLightLeft.position.set(-5, 3.5, -3.5);
    scene.add(rimLightLeft);

    // 5. Warm Rim Kicker Light (Right/Back)
    const rimLightRight = new THREE.DirectionalLight(0xffe2cc, 1.3);
    rimLightRight.position.set(5, 3.5, -3.5);
    scene.add(rimLightRight);

    const activeColor = targetColorRef.current.clone();

    // 6. Reactive Underglow Stage Lighting
    const reactiveUnderglowLight = new THREE.PointLight(activeColor, 3.2, 7.0, 1.4);
    reactiveUnderglowLight.position.set(0, -0.7, 0);
    scene.add(reactiveUnderglowLight);

    // ==============================================================
    // 3D LUXURY CYLINDRICAL TURNTABLE PLATFORM
    // ==============================================================
    const platformGroup = new THREE.Group();
    scene.add(platformGroup);

    const radius = 2.65;
    const cylinderHeight = 0.48;
    const topY = cylinderHeight / 2;

    // 1. Soft Floor AO Shadow Plane
    const shadowTex = getOrCreateShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(radius * 3.2, radius * 3.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -cylinderHeight / 2 - 0.04;
    scene.add(shadowMesh);

    // 2. Main Titanium Drum Cylinder Body with Brushed Luster
    const drumGeo = new THREE.CylinderGeometry(radius, radius * 1.03, cylinderHeight, 48, 1, true);
    const drumMat = new THREE.MeshStandardMaterial({
      color: 0x222634, // Brighter titanium grey
      metalness: 0.88,
      roughness: 0.28
    });
    const drumMesh = new THREE.Mesh(drumGeo, drumMat);
    drumMesh.position.y = 0;
    platformGroup.add(drumMesh);

    // 3. Lower Stepped Foundation Rim
    const baseGeo = new THREE.CylinderGeometry(radius * 1.04, radius * 1.06, 0.08, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x11141c,
      metalness: 0.92,
      roughness: 0.35
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -cylinderHeight / 2 - 0.03;
    platformGroup.add(baseMesh);

    // 4. Upper Obsidian-Titanium Platter Disc
    const platterTex = getOrCreatePlatterTexture();
    const platterGeo = new THREE.CylinderGeometry(radius - 0.02, radius - 0.02, 0.03, 48);
    const platterMat = new THREE.MeshStandardMaterial({
      map: platterTex,
      metalness: 0.82,
      roughness: 0.22
    });
    const platterMesh = new THREE.Mesh(platterGeo, platterMat);
    platterMesh.position.y = topY + 0.012;
    platformGroup.add(platterMesh);

    // 5. Polished Chrome Bevel Lip (Platter Edge Specular Highlight)
    const bevelGeo = new THREE.TorusGeometry(radius, 0.018, 12, 64);
    const bevelMat = new THREE.MeshStandardMaterial({
      color: 0x5a637d, // Bright specular reflection
      metalness: 0.98,
      roughness: 0.1
    });
    const bevelMesh = new THREE.Mesh(bevelGeo, bevelMat);
    bevelMesh.rotation.x = Math.PI / 2;
    bevelMesh.position.y = topY + 0.015;
    platformGroup.add(bevelMesh);

    // 6. Sleek Ambient Neon Perimeter Ring
    const neonGeo = new THREE.TorusGeometry(radius + 0.006, 0.012, 12, 64);
    const neonMat = new THREE.MeshStandardMaterial({
      color: activeColor,
      emissive: activeColor,
      emissiveIntensity: 2.6,
      roughness: 0.1,
      metalness: 0.1
    });
    const neonMesh = new THREE.Mesh(neonGeo, neonMat);
    neonMesh.rotation.x = Math.PI / 2;
    neonMesh.position.y = topY + 0.005;
    platformGroup.add(neonMesh);

    // ==============================================================
    // 3D MODEL LOADER WITH KTX2 + DRACO PIPELINE & PROGRESS
    // ==============================================================
    let loadedModelGroup: THREE.Group | null = null;
    if (gltfModelUrl) {
      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);
      gltfLoader.setKTX2Loader(ktx2Loader);

      gltfLoader.load(
        gltfModelUrl,
        (gltf) => {
          loadedModelGroup = gltf.scene;

          const bbox = new THREE.Box3().setFromObject(loadedModelGroup);
          const size = bbox.getSize(new THREE.Vector3());
          const center = bbox.getCenter(new THREE.Vector3());

          const targetLength = 3.6;
          const scale = targetLength / Math.max(size.x, size.z);
          loadedModelGroup.scale.set(scale, scale, scale);

          bbox.setFromObject(loadedModelGroup);
          const scaledMinY = bbox.min.y;

          loadedModelGroup.position.x = -center.x * scale;
          loadedModelGroup.position.z = -center.z * scale;
          loadedModelGroup.position.y = (topY + 0.035) - scaledMinY;

          platformGroup.add(loadedModelGroup);
          if (onProgressUpdate) onProgressUpdate(100);
        },
        (xhr) => {
          if (xhr.total > 0 && onProgressUpdate) {
            const percent = (xhr.loaded / xhr.total) * 100;
            onProgressUpdate(percent, gltfModelUrl);
          }
        },
        (err) => {
          console.warn("[3D Showroom] GLTF model load error fallback:", err);
          if (onProgressUpdate) onProgressUpdate(100);
        }
      );
    }

    // ==============================================================
    // INTERACTIVE PARALLAX & DRAG ROTATION
    // ==============================================================
    let targetRotationY = 0;
    let currentRotationY = 0;
    let targetTiltX = 0;
    let currentTiltX = 0;
    let isDragging = false;
    let prevMouseX = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      setIsInteracting(true);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      prevMouseX = clientX;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      if (isDragging) {
        const deltaX = clientX - prevMouseX;
        targetRotationY += deltaX * 0.008;
        prevMouseX = clientX;
      } else {
        const rect = container.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width - 0.5) * 2;
        const normY = ((clientY - rect.top) / rect.height - 0.5) * 2;
        targetTiltX = normY * 0.04;
        targetRotationY = normX * 0.1;
      }
    };

    const handlePointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    container.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    container.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // ==============================================================
    // ULTRA-EFFICIENT ANIMATION LOOP (Fixed 60 FPS)
    // ==============================================================
    let animationFrameId: number;

    const animate = () => {
      // Smooth color lerp
      activeColor.lerp(targetColorRef.current, 0.08);
      neonMat.color.copy(activeColor);
      neonMat.emissive.copy(activeColor);
      reactiveUnderglowLight.color.copy(activeColor);

      // Smooth mouse rotation
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;

      platformGroup.rotation.y = currentRotationY;
      platformGroup.rotation.x = currentTiltX;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 760;
      const newHeight = container.clientHeight || 280;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();

      container.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);

      container.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);

      ktx2Loader.dispose();
      dracoLoader.dispose();

      // Dispose Three.js geometries and materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else if (object.material) {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [gltfModelUrl, onProgressUpdate]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[240px] sm:h-[280px] md:h-[310px] pointer-events-auto select-none flex items-center justify-center cursor-grab ${
        isInteracting ? "cursor-grabbing" : ""
      } ${className}`}
      title="3D Showroom Platformu (Döndürmek için sürükleyin)"
    />
  );
};

// Top-Level Component with useProgress + Suspense
export const ShowroomCylinder3D: React.FC<ShowroomCylinder3DProps> = (props) => {
  const { active, progress, item } = useProgress();
  const [internalProgress, setInternalProgress] = useState(0);
  const [isManualLoading, setIsManualLoading] = useState(false);

  const handleProgressUpdate = (p: number, url?: string) => {
    setInternalProgress(p);
    if (p < 100) {
      setIsManualLoading(true);
    } else {
      setTimeout(() => setIsManualLoading(false), 300);
    }
  };

  const isModelLoading = active || isManualLoading;
  const currentProgress = active ? progress : internalProgress;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Suspense
        fallback={
          <ShowroomLoadingProgress
            progress={currentProgress}
            item={item}
            glowColor={props.glowColor || "#ef4444"}
          />
        }
      >
        <ShowroomCylinderCanvas {...props} onProgressUpdate={handleProgressUpdate} />
      </Suspense>

      {/* Real-time Loading Progress Bar Overlay */}
      {isModelLoading && (
        <ShowroomLoadingProgress
          progress={currentProgress}
          item={item}
          glowColor={props.glowColor || "#ef4444"}
        />
      )}
    </div>
  );
};

export default ShowroomCylinder3D;
