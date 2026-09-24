import React, { useEffect, useRef, useState, useMemo, Suspense } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { useProgress } from "@/hooks/useProgress";
import { ShowroomLoadingProgress } from "./ShowroomLoadingProgress";

export interface ShowroomCylinder3DProps {
  glowColor?: string;
  bikeId?: string | number;
  bikeCategory?: string;
  gltfModelUrl?: string;
  className?: string;
  thicknessMode?: "standard" | "bold" | "heavy";
  ledStyle?: "dual-ring" | "cyber-pulse" | "laser-precision";
  rotationSpeed?: number;
}

// ==============================================================
// 1. PROCEDURAL TEXTURE CACHES (Zero-Garbage GPU Textures)
// ==============================================================

// Soft Contact AO Floor Shadow
let cachedShadowTexture: THREE.CanvasTexture | null = null;
const getOrCreateShadowTexture = (): THREE.CanvasTexture => {
  if (cachedShadowTexture) return cachedShadowTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 70, 256, 256, 256);
    grad.addColorStop(0, "rgba(0, 0, 0, 0.98)");
    grad.addColorStop(0.35, "rgba(0, 0, 0, 0.78)");
    grad.addColorStop(0.7, "rgba(0, 0, 0, 0.28)");
    grad.addColorStop(0.92, "rgba(0, 0, 0, 0.06)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }
  cachedShadowTexture = new THREE.CanvasTexture(canvas);
  cachedShadowTexture.generateMipmaps = true;
  return cachedShadowTexture;
};

// Floor Optical Photon Glow Texture (Volumetric Ground Wash)
let cachedFloorGlowTexture: THREE.CanvasTexture | null = null;
const getOrCreateFloorGlowTexture = (): THREE.CanvasTexture => {
  if (cachedFloorGlowTexture) return cachedFloorGlowTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const grad = ctx.createRadialGradient(256, 256, 80, 256, 256, 256);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    grad.addColorStop(0.2, "rgba(255, 255, 255, 0.65)");
    grad.addColorStop(0.5, "rgba(255, 255, 255, 0.22)");
    grad.addColorStop(0.8, "rgba(255, 255, 255, 0.05)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
  }
  cachedFloorGlowTexture = new THREE.CanvasTexture(canvas);
  return cachedFloorGlowTexture;
};

// Vertical Machined Micro-Fluting Texture for Drum Wall
let cachedDrumTexture: THREE.CanvasTexture | null = null;
const getOrCreateDrumTexture = (): THREE.CanvasTexture => {
  if (cachedDrumTexture) return cachedDrumTexture;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // Dark graphite titanium baseline
    ctx.fillStyle = "#1e222d";
    ctx.fillRect(0, 0, 256, 512);

    // Subtle vertical CNC fluting ribs
    for (let x = 0; x < 256; x += 8) {
      const isMajor = x % 32 === 0;
      ctx.fillStyle = isMajor ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.025)";
      ctx.fillRect(x, 0, 2, 512);
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fillRect(x + 2, 0, 3, 512);
    }

    // Horizontal top-to-bottom metallic sheen
    const vGrad = ctx.createLinearGradient(0, 0, 0, 512);
    vGrad.addColorStop(0, "rgba(255, 255, 255, 0.12)");
    vGrad.addColorStop(0.15, "rgba(255, 255, 255, 0.02)");
    vGrad.addColorStop(0.85, "rgba(0, 0, 0, 0.25)");
    vGrad.addColorStop(1, "rgba(0, 0, 0, 0.55)");
    ctx.fillStyle = vGrad;
    ctx.fillRect(0, 0, 256, 512);
  }
  cachedDrumTexture = new THREE.CanvasTexture(canvas);
  cachedDrumTexture.wrapS = THREE.RepeatWrapping;
  cachedDrumTexture.wrapT = THREE.ClampToEdgeWrapping;
  cachedDrumTexture.repeat.set(6, 1);
  return cachedDrumTexture;
};

// Ultra-High-Fidelity Brushed Obsidian & Titanium Platter Disc
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

    // 1. Deep aeronautical tungsten & carbon-weave radial gradient
    const bgGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 512);
    bgGrad.addColorStop(0, "#32394a");
    bgGrad.addColorStop(0.2, "#232836");
    bgGrad.addColorStop(0.5, "#151924");
    bgGrad.addColorStop(0.8, "#0d1017");
    bgGrad.addColorStop(0.96, "#07090e");
    bgGrad.addColorStop(1, "#030406");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 1024);

    // 2. High-precision concentric lathe-groove lines (circular brushed metal)
    for (let r = 60; r < 496; r += 5) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${r % 25 === 0 ? 0.055 : 0.015})`;
      ctx.lineWidth = r % 50 === 0 ? 1.5 : 0.8;
      ctx.stroke();
    }

    // 3. Tire Traction Contact Lanes (Textured circular bands for motorcycle wheels)
    ctx.beginPath();
    ctx.arc(cx, cy, 330, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 42;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 330, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 46;
    ctx.setLineDash([4, 6]);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    // 4. Laser-Etched 360° Compass & Degree Graduations
    for (let angle = 0; angle < 360; angle += 2.5) {
      const rad = (angle * Math.PI) / 180;
      const isMajor = angle % 30 === 0;
      const isMedium = angle % 10 === 0;
      const tickLen = isMajor ? 20 : isMedium ? 12 : 6;
      const startR = 486 - tickLen;
      const endR = 486;

      const x1 = cx + Math.cos(rad) * startR;
      const y1 = cy + Math.sin(rad) * startR;
      const x2 = cx + Math.cos(rad) * endR;
      const y2 = cy + Math.sin(rad) * endR;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isMajor
        ? "rgba(255, 255, 255, 0.65)"
        : isMedium
        ? "rgba(255, 255, 255, 0.32)"
        : "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = isMajor ? 2.2 : isMedium ? 1.4 : 0.9;
      ctx.stroke();
    }

    // 5. Outer Precision Chamfer Border Ring
    ctx.beginPath();
    ctx.arc(cx, cy, 486, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 6. Central Laser Emblem: Paşa Motor Showroom Medallion
    const centerGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120);
    centerGrad.addColorStop(0, "#2c3345");
    centerGrad.addColorStop(0.7, "#171c26");
    centerGrad.addColorStop(1, "#0d1017");
    ctx.fillStyle = centerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.fill();

    // Gold/Titanium Accent Ring around Center Hub
    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Micro Laser Text
    ctx.save();
    ctx.font = "bold 13px monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "2px";
    ctx.fillText("PAŞA MOTOR SHOWROOM", cx, cy - 8);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "rgba(245, 158, 11, 0.65)";
    ctx.fillText("• FATİH • İSTANBUL •", cx, cy + 12);
    ctx.restore();
  }
  cachedPlatterTexture = new THREE.CanvasTexture(canvas);
  cachedPlatterTexture.generateMipmaps = true;
  return cachedPlatterTexture;
};

// ==============================================================
// 2. INTERNAL THREE.JS CANVAS SCENE
// ==============================================================
const ShowroomCylinderCanvas: React.FC<
  ShowroomCylinder3DProps & {
    onProgressUpdate?: (p: number, item?: string) => void;
  }
> = ({
  glowColor = "#ef4444",
  bikeId = "default",
  gltfModelUrl,
  className = "",
  thicknessMode = "bold",
  ledStyle = "dual-ring",
  rotationSpeed = 1.0,
  onProgressUpdate
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // Compute adaptive color from prop
  const primaryColor = useMemo(() => new THREE.Color(glowColor || "#ef4444"), [glowColor]);
  const targetColorRef = useRef<THREE.Color>(primaryColor);

  useEffect(() => {
    targetColorRef.current = primaryColor;
  }, [primaryColor, bikeId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ----------------------------------------------------------
    // SCENE & CINEMATIC PERSPECTIVE CAMERA
    // ----------------------------------------------------------
    const scene = new THREE.Scene();
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 320;

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    // Positioned slightly higher and further to showcase the substantial podium thickness
    camera.position.set(0, 2.35, 5.85);
    camera.lookAt(0, 0.05, 0);

    // ----------------------------------------------------------
    // WEBGL RENDERER WITH ACES FILMIC TONE MAPPING
    // ----------------------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      precision: "highp",
      stencil: false,
      depth: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.52; // Crisp, non-murky showroom exposure

    container.appendChild(renderer.domElement);

    // Compress Texture Loaders
    const ktx2Loader = new KTX2Loader();
    ktx2Loader.setTranscoderPath("https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/libs/basis/");
    ktx2Loader.detectSupport(renderer);

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");

    // ----------------------------------------------------------
    // LUXURY STUDIO ILLUMINATION RIG
    // ----------------------------------------------------------
    // 1. Ambient Baseline Fill
    const ambientLight = new THREE.AmbientLight(0xf2f6ff, 1.4);
    scene.add(ambientLight);

    // 2. High-Powered Studio Overhead Softbox
    const overheadSpot = new THREE.SpotLight(0xffffff, 3.6, 20, Math.PI / 3.2, 0.35, 1.2);
    overheadSpot.position.set(0, 8.2, 3.0);
    scene.add(overheadSpot);

    // 3. Front Key Light (Sharp specular gleam on chamfer)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(3.5, 5.5, 4.5);
    scene.add(keyLight);

    // 4. Cool Rim Kicker Light (Left/Back)
    const rimLightLeft = new THREE.DirectionalLight(0x9fc3ff, 1.6);
    rimLightLeft.position.set(-5.5, 4.0, -3.5);
    scene.add(rimLightLeft);

    // 5. Warm Rim Kicker Light (Right/Back)
    const rimLightRight = new THREE.DirectionalLight(0xffe5cc, 1.4);
    rimLightRight.position.set(5.5, 4.0, -3.5);
    scene.add(rimLightRight);

    // 6. Reactive Floor & Plinth Underglow Light
    const activeColor = targetColorRef.current.clone();
    const reactiveUnderglowLight = new THREE.PointLight(activeColor, 4.2, 8.5, 1.3);
    reactiveUnderglowLight.position.set(0, -0.65, 0);
    scene.add(reactiveUnderglowLight);

    // 7. Secondary Soft Accent Downlight
    const upperAccentLight = new THREE.PointLight(activeColor, 2.0, 5.5, 1.8);
    upperAccentLight.position.set(0, 0.45, 0);
    scene.add(upperAccentLight);

    // ----------------------------------------------------------
    // 3D SCULPTED LUXURY TURNTABLE PODIUM (PRECISION ARCHITECTURE)
    // ----------------------------------------------------------
    const platformGroup = new THREE.Group();
    scene.add(platformGroup);

    // Dimension calculations based on user's thickness request
    // Standard: 0.55, Bold: 0.74, Heavy: 0.88
    const cylinderHeight = thicknessMode === "heavy" ? 0.88 : thicknessMode === "standard" ? 0.58 : 0.74;
    const radius = 2.72;
    const topY = cylinderHeight / 2;
    const bottomY = -cylinderHeight / 2;

    // --- A. SOFT AMBIENT OCCLUSION FLOOR SHADOW ---
    const shadowTex = getOrCreateShadowTexture();
    const shadowGeo = new THREE.PlaneGeometry(radius * 3.4, radius * 3.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.95,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = bottomY - 0.05;
    scene.add(shadowMesh);

    // --- B. VOLUMETRIC FLOOR PHOTON GLOW HALO (LED Ground Wash) ---
    const floorGlowTex = getOrCreateFloorGlowTexture();
    const floorGlowGeo = new THREE.PlaneGeometry(radius * 3.1, radius * 3.1);
    const floorGlowMat = new THREE.MeshBasicMaterial({
      map: floorGlowTex,
      color: activeColor,
      transparent: true,
      opacity: 0.48,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const floorGlowMesh = new THREE.Mesh(floorGlowGeo, floorGlowMat);
    floorGlowMesh.rotation.x = -Math.PI / 2;
    floorGlowMesh.position.y = bottomY - 0.04;
    scene.add(floorGlowMesh);

    // --- C. FOUNDATION PLINTH (Tier 0: Ground Foundation Stepped Rim) ---
    const plinthHeight = 0.12;
    const plinthGeo = new THREE.CylinderGeometry(radius * 1.055, radius * 1.08, plinthHeight, 64);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x11141c,
      metalness: 0.94,
      roughness: 0.32
    });
    const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
    plinthMesh.position.y = bottomY + plinthHeight / 2;
    platformGroup.add(plinthMesh);

    // --- D. LOWER RECESSED LED ACCENT CHANNEL (Bottom Shadow/Glow Notch) ---
    const lowerChannelGeo = new THREE.CylinderGeometry(radius * 0.97, radius * 0.97, 0.05, 64);
    const lowerChannelMat = new THREE.MeshStandardMaterial({
      color: 0x07090e,
      metalness: 0.8,
      roughness: 0.5
    });
    const lowerChannelMesh = new THREE.Mesh(lowerChannelGeo, lowerChannelMat);
    lowerChannelMesh.position.y = bottomY + plinthHeight + 0.025;
    platformGroup.add(lowerChannelMesh);

    // Lower Edge Neon Light Ribbon
    const lowerNeonGeo = new THREE.TorusGeometry(radius * 0.98, 0.012, 16, 80);
    const lowerNeonMat = new THREE.MeshStandardMaterial({
      color: activeColor,
      emissive: activeColor,
      emissiveIntensity: 3.5,
      roughness: 0.1,
      metalness: 0.2
    });
    const lowerNeonMesh = new THREE.Mesh(lowerNeonGeo, lowerNeonMat);
    lowerNeonMesh.rotation.x = Math.PI / 2;
    lowerNeonMesh.position.y = bottomY + plinthHeight + 0.025;
    platformGroup.add(lowerNeonMesh);

    // --- E. MAIN THICK DRUM BODY (Tier 1: Vertical Micro-Fluted Anodized Titanium) ---
    const mainDrumHeight = cylinderHeight - plinthHeight - 0.09;
    const drumGeo = new THREE.CylinderGeometry(
      radius,
      radius * 1.025,
      mainDrumHeight,
      64,
      1,
      true
    );
    const drumTex = getOrCreateDrumTexture();
    const drumMat = new THREE.MeshStandardMaterial({
      map: drumTex,
      color: 0x222736,
      metalness: 0.88,
      roughness: 0.26
    });
    const drumMesh = new THREE.Mesh(drumGeo, drumMat);
    drumMesh.position.y = bottomY + plinthHeight + 0.05 + mainDrumHeight / 2;
    platformGroup.add(drumMesh);

    // --- F. TOP RECESSED LED LIGHTING FIXTURE (The High-Tech LED Light Tube) ---
    // 1. Inset Anodized Aluminum Reflective Housing Channel
    const housingChannelGeo = new THREE.CylinderGeometry(radius * 1.012, radius * 1.012, 0.045, 64);
    const housingChannelMat = new THREE.MeshStandardMaterial({
      color: 0x161922,
      metalness: 0.96,
      roughness: 0.15
    });
    const housingChannelMesh = new THREE.Mesh(housingChannelGeo, housingChannelMat);
    housingChannelMesh.position.y = topY - 0.02;
    platformGroup.add(housingChannelMesh);

    // 2. High-Powered Inner Laser LED Core Ring (Ultra Bright Core)
    const neonCoreGeo = new THREE.TorusGeometry(radius + 0.015, 0.016, 16, 96);
    const neonCoreMat = new THREE.MeshStandardMaterial({
      color: activeColor,
      emissive: activeColor,
      emissiveIntensity: 5.2, // Super crisp, non-clipping intensity
      roughness: 0.05,
      metalness: 0.1
    });
    const neonCoreMesh = new THREE.Mesh(neonCoreGeo, neonCoreMat);
    neonCoreMesh.rotation.x = Math.PI / 2;
    neonCoreMesh.position.y = topY - 0.016;
    platformGroup.add(neonCoreMesh);

    // 3. Frosted Optical Polycarbonate Light Guide (Translucent Diffuser Ring)
    const diffuserGeo = new THREE.TorusGeometry(radius + 0.015, 0.026, 16, 96);
    const diffuserMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 0.68,
      transparent: true,
      roughness: 0.22,
      metalness: 0.1,
      ior: 1.48
    });
    const diffuserMesh = new THREE.Mesh(diffuserGeo, diffuserMat);
    diffuserMesh.rotation.x = Math.PI / 2;
    diffuserMesh.position.y = topY - 0.016;
    platformGroup.add(diffuserMesh);

    // --- G. POLISHED SPECULAR CHROME CHAMFER LIP (Overhead Key Reflection) ---
    const chromeLipGeo = new THREE.TorusGeometry(radius - 0.005, 0.016, 16, 96);
    const chromeLipMat = new THREE.MeshStandardMaterial({
      color: 0x7e88a8,
      metalness: 0.99,
      roughness: 0.06
    });
    const chromeLipMesh = new THREE.Mesh(chromeLipGeo, chromeLipMat);
    chromeLipMesh.rotation.x = Math.PI / 2;
    chromeLipMesh.position.y = topY + 0.006;
    platformGroup.add(chromeLipMesh);

    // --- H. ROTATING OBSIDIAN-TITANIUM PLATTER DISC (Tier 2: Top Surface) ---
    const platterTex = getOrCreatePlatterTexture();
    const platterGeo = new THREE.CylinderGeometry(radius - 0.018, radius - 0.018, 0.04, 64);
    const platterMat = new THREE.MeshStandardMaterial({
      map: platterTex,
      metalness: 0.84,
      roughness: 0.22
    });
    const platterMesh = new THREE.Mesh(platterGeo, platterMat);
    platterMesh.position.y = topY + 0.018;
    platformGroup.add(platterMesh);

    // --- I. SECONDARY RAZOR-EDGE LASER BEVEL (Ultra Precision Ring) ---
    const razorGeo = new THREE.TorusGeometry(radius - 0.02, 0.006, 12, 96);
    const razorMat = new THREE.MeshStandardMaterial({
      color: activeColor,
      emissive: activeColor,
      emissiveIntensity: 3.8,
      roughness: 0.1,
      metalness: 0.1
    });
    const razorMesh = new THREE.Mesh(razorGeo, razorMat);
    razorMesh.rotation.x = Math.PI / 2;
    razorMesh.position.y = topY + 0.038;
    platformGroup.add(razorMesh);

    // ----------------------------------------------------------
    // 3D GLTF MODEL LOADER (If 3D asset supplied)
    // ----------------------------------------------------------
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

          const targetLength = 3.65;
          const scale = targetLength / Math.max(size.x, size.z);
          loadedModelGroup.scale.set(scale, scale, scale);

          bbox.setFromObject(loadedModelGroup);
          const scaledMinY = bbox.min.y;

          loadedModelGroup.position.x = -center.x * scale;
          loadedModelGroup.position.z = -center.z * scale;
          loadedModelGroup.position.y = (topY + 0.04) - scaledMinY;

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
          console.warn("[3D Showroom] GLTF model load fallback:", err);
          if (onProgressUpdate) onProgressUpdate(100);
        }
      );
    }

    // ----------------------------------------------------------
    // INTERACTIVE POINTER PARALLAX & ROTATION
    // ----------------------------------------------------------
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
        targetRotationY = normX * 0.12;
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

    // ----------------------------------------------------------
    // OPTIMIZED ANIMATION LOOP (Clock + Dynamic LED Breathing)
    // ----------------------------------------------------------
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth color lerp when vehicle or theme changes
      activeColor.lerp(targetColorRef.current, 0.08);

      // Subtle luminous breathing pulse (1.0 +- 0.16) for realistic stage realism
      const breathPulse = 1.0 + Math.sin(elapsedTime * 2.4) * 0.16;

      // Update LED materials & light sources
      neonCoreMat.color.copy(activeColor);
      neonCoreMat.emissive.copy(activeColor);
      neonCoreMat.emissiveIntensity = 4.8 * breathPulse;

      lowerNeonMat.color.copy(activeColor);
      lowerNeonMat.emissive.copy(activeColor);
      lowerNeonMat.emissiveIntensity = 3.2 * breathPulse;

      razorMat.color.copy(activeColor);
      razorMat.emissive.copy(activeColor);
      razorMat.emissiveIntensity = 3.6 * breathPulse;

      floorGlowMat.color.copy(activeColor);
      floorGlowMat.opacity = 0.42 * breathPulse;

      reactiveUnderglowLight.color.copy(activeColor);
      reactiveUnderglowLight.intensity = 3.8 * breathPulse;

      upperAccentLight.color.copy(activeColor);
      upperAccentLight.intensity = 1.8 * breathPulse;

      // Smooth inertia rotation
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;
      currentTiltX += (targetTiltX - currentTiltX) * 0.08;

      platformGroup.rotation.y = currentRotationY;
      platformGroup.rotation.x = currentTiltX;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // ----------------------------------------------------------
    // RESIZE OBSERVER
    // ----------------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 800;
      const newHeight = container.clientHeight || 320;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ----------------------------------------------------------
    // CLEANUP PIPELINE
    // ----------------------------------------------------------
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

      // Dispose geometries and materials
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

      try {
        renderer.forceContextLoss();
        const gl = renderer.getContext();
        if (gl && typeof gl.getExtension === "function") {
          const loseExt = gl.getExtension("WEBGL_lose_context");
          if (loseExt) loseExt.loseContext();
        }
      } catch {
        // Safe fallback
      }

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [gltfModelUrl, thicknessMode, ledStyle, rotationSpeed, onProgressUpdate]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[260px] sm:h-[310px] md:h-[340px] pointer-events-auto select-none flex items-center justify-center cursor-grab ${
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

  const handleProgressUpdate = (p: number) => {
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
