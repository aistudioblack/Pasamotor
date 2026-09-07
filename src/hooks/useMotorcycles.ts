import { useQuery, useQueryClient } from "@tanstack/react-query";
import { dbClient } from "@/lib/db-client";
import { MOTORCYCLES, Motorcycle } from "@/data/motorcycles";

export const MOTORCYCLES_QUERY_KEY = ["motorcycles"] as const;
const LOCAL_STORAGE_CACHE_KEY = "pasamotor_motorcycles_cache_v4";

/**
 * İlk render veya sayfa açılışında en son bilinen önbelleği ya da yerel kataloğu
 * gecikmesiz olarak döndürür (Stale fazı).
 */
export function getCachedMotorcycles(): Motorcycle[] {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // LocalStorage hatası durumunda varsayılan yerel kataloğa devam et
    }
  }
  return MOTORCYCLES;
}

/**
 * Veritabanından (Supabase/site_content) en güncel katalog verisini çeker (Revalidate fazı).
 */
export async function fetchMotorcyclesFromDb(): Promise<Motorcycle[]> {
  try {
    const { data, error } = await dbClient
      .from("site_content")
      .select("sections")
      .eq("page_key", "motorcycles_catalog")
      .maybeSingle();

    if (error) {
      console.warn("Veritabanından motosiklet verisi alınamadı, yerel katalog kullanılıyor:", error.message);
      return getCachedMotorcycles();
    }

    if (data && Array.isArray(data.sections) && data.sections.length > 0) {
      const list = data.sections as unknown as Motorcycle[];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(list));
        } catch {
          // LocalStorage doluluk vs. durumları yoksay
        }
      }
      return list;
    }
  } catch (err) {
    console.warn("Motosiklet verisi revalidate edilirken hata oluştu:", err);
  }
  return getCachedMotorcycles();
}

/**
 * Stale-While-Revalidate Konfigürasyonu:
 * - initialData: getCachedMotorcycles (Ekran anında açılır, sıfır bekleme)
 * - initialDataUpdatedAt: 0 (Veri stale kabul edilir, ilk açılışta arka plan doğrulaması hemen başlar)
 * - gcTime: 24 saat (Sayfa geçişlerinde önbellek asla bellekten atılmaz)
 * - refetchOnMount: "always" (Kullanıcı mağazaya her geçtiğinde önbellek anında ekrana gelirken arka planda yeni veri kontrol edilir)
 * - staleTime: 30 saniye (Kısa aralıklı seri tıklamalarda gereksiz ağ trafiğini önler)
 */
export const MOTORCYCLES_CACHE_OPTIONS = {
  staleTime: 1000 * 30, // 30 saniye tazelik penceresi
  gcTime: 1000 * 60 * 60 * 24, // 24 saat hafıza koruma
  refetchOnMount: "always" as const, // Sayfa geçişinde stale-while-revalidate tetikler
  refetchOnWindowFocus: true as const, // Sekmeye dönüldüğünde arka planda doğrular
  refetchOnReconnect: true as const, // İnternet bağlantısı sağlandığında doğrular
};

export function useMotorcycles() {
  return useQuery({
    queryKey: MOTORCYCLES_QUERY_KEY,
    queryFn: fetchMotorcyclesFromDb,
    initialData: getCachedMotorcycles,
    initialDataUpdatedAt: 0,
    ...MOTORCYCLES_CACHE_OPTIONS,
  });
}

/**
 * Tekil motosiklet detay sayfası için aynı önbelleği paylaşan yardımcı kanca
 */
export function useMotorcycle(slugOrId?: string) {
  const query = useMotorcycles();
  const bike = query.data?.find((m) => m.slug === slugOrId || m.id === slugOrId);

  return {
    ...query,
    bike,
  };
}

/**
 * Mağaza bağlantılarının üzerine gelindiğinde veya rota öncesinde veriyi ısıtmak için önceden yükleme (Prefetch) kancası
 */
export function usePrefetchMotorcycles() {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.prefetchQuery({
      queryKey: MOTORCYCLES_QUERY_KEY,
      queryFn: fetchMotorcyclesFromDb,
      ...MOTORCYCLES_CACHE_OPTIONS,
    });
  };
}

