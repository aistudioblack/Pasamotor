import type { Tables } from "@/lib/db-types";

type Product = Tables<"products">;

const DB_NAME = "pasa_motor_cache_db";
const STORE_NAME = "product_cache";
const CACHE_KEY = "yedek_parca_list";
const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 dakika

// In-memory cache for ultra-fast instantaneous access within the SPA session
let inMemoryProducts: Product[] | null = null;
let inMemoryTimestamp: number | null = null;

// Safe cleanup of legacy sessionStorage to free any exceeded quota
if (typeof window !== "undefined") {
  try {
    sessionStorage.removeItem("pasa_motor_yedek_parca_cache");
    sessionStorage.removeItem("pasa_motor_yedek_parca_time");
    sessionStorage.removeItem("pasamotor_yedek_parca_cache");
    sessionStorage.removeItem("pasamotor_yedek_parca_sync");
  } catch (e) {
    // Non-blocking
  }
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not available"));
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Failed to open IndexedDB"));
  });
}

export function getCachedProductsSync(): Product[] | null {
  return inMemoryProducts;
}

export function getLastSyncTimeSync(): number | null {
  return inMemoryTimestamp;
}

export async function getProductCache(): Promise<{ products: Product[]; timestamp: number } | null> {
  if (inMemoryProducts && inMemoryTimestamp && Date.now() - inMemoryTimestamp < CACHE_DURATION_MS) {
    return { products: inMemoryProducts, timestamp: inMemoryTimestamp };
  }

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(CACHE_KEY);

      request.onsuccess = () => {
        const result = request.result as { products: Product[]; timestamp: number } | undefined;
        if (result && result.products && result.timestamp) {
          inMemoryProducts = result.products;
          inMemoryTimestamp = result.timestamp;
          resolve(result);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        resolve(null);
      };
    });
  } catch (e) {
    if (inMemoryProducts && inMemoryTimestamp) {
      return { products: inMemoryProducts, timestamp: inMemoryTimestamp };
    }
    return null;
  }
}

export async function setProductCache(products: Product[]): Promise<void> {
  const timestamp = Date.now();
  inMemoryProducts = products;
  inMemoryTimestamp = timestamp;

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ products, timestamp }, CACHE_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch (e) {
    // In-memory cache is already set, silent fallback
  }
}

export async function clearProductCache(): Promise<void> {
  inMemoryProducts = null;
  inMemoryTimestamp = null;

  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(CACHE_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  } catch (e) {
    // Non-blocking
  }
}
