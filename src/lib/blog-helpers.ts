export const COVER_FILES = [] as readonly string[];

export const DEFAULT_COVER = "";

/**
 * Verilen blog post verisi için kapak görseli yolunu döndürür.
 * Kapak görseli yoksa null döner, böylece UI gereksiz veya kırık görsel render etmez.
 */
export function getPostCoverImage(post?: { cover_image?: string | null } | null): string | null {
  if (!post || !post.cover_image || typeof post.cover_image !== "string") {
    return null;
  }

  const raw = post.cover_image.trim();
  if (!raw || raw === "null" || raw === "undefined") {
    return null;
  }

  return raw;
}
