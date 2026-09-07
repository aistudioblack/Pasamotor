import { useState, useEffect, useCallback } from "react";
import * as THREE from "three";

export interface ProgressState {
  active: boolean;
  progress: number;
  loaded: number;
  total: number;
  item: string;
  errors: string[];
}

/**
 * Custom Hook: useProgress
 * Tracks real-time 3D asset loading progress across Three.js LoadingManager,
 * GLTF/DRACO/KTX2 pipelines, and custom asset streams.
 */
export function useProgress(customManager?: THREE.LoadingManager): ProgressState {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [total, setTotal] = useState(0);
  const [item, setItem] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const manager = customManager || THREE.DefaultLoadingManager;

    manager.onStart = (url, itemsLoaded, itemsTotal) => {
      setActive(true);
      setItem(url);
      setLoaded(itemsLoaded);
      setTotal(itemsTotal);
      const calculatedProgress = itemsTotal > 0 ? (itemsLoaded / itemsTotal) * 100 : 0;
      setProgress(calculatedProgress);
    };

    manager.onProgress = (url, itemsLoaded, itemsTotal) => {
      setActive(true);
      setItem(url);
      setLoaded(itemsLoaded);
      setTotal(itemsTotal);
      const calculatedProgress = itemsTotal > 0 ? (itemsLoaded / itemsTotal) * 100 : 0;
      setProgress(calculatedProgress);
    };

    manager.onLoad = () => {
      setProgress(100);
      const timeout = setTimeout(() => {
        setActive(false);
        setProgress(0);
      }, 400);
      return () => clearTimeout(timeout);
    };

    manager.onError = (url) => {
      setErrors((prev) => [...prev, url]);
      console.warn("[useProgress] 3D Asset Loading Warning:", url);
    };

    return () => {
      // Clear callbacks on unmount to avoid stale triggers
      manager.onStart = undefined;
      manager.onProgress = undefined;
      manager.onLoad = undefined;
      manager.onError = undefined;
    };
  }, [customManager]);

  return { active, progress, loaded, total, item, errors };
}

export default useProgress;
