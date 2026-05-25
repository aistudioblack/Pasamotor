import type { Tables } from "@/lib/firebase-types";

type Post = Tables<"posts">;

interface BlogCache {
  posts: Post[] | null;
  lastFetchedAt: number;
}

// Global window veya modül düzeyinde saklanır.
// SPA olduğu için sayfa geçişlerinde kalıcı kalır.
const globalCache: BlogCache = {
  posts: null,
  lastFetchedAt: 0,
};

const CACHE_DURATION = 10 * 60 * 1000; // 10 dakika (Motosiklet blogları sık değişmez)

export const getCachedPosts = (): Post[] | null => {
  if (globalCache.posts && Date.now() - globalCache.lastFetchedAt < CACHE_DURATION) {
    return globalCache.posts;
  }
  return null;
};

export const setCachedPosts = (posts: Post[]) => {
  globalCache.posts = posts;
  globalCache.lastFetchedAt = Date.now();
};

export const getCachedPostBySlug = (slug: string): Post | null => {
  if (globalCache.posts) {
    return globalCache.posts.find((p) => p.slug === slug) || null;
  }
  return null;
};

export const addPostToCache = (post: Post) => {
  if (!globalCache.posts) {
    globalCache.posts = [];
  }
  const index = globalCache.posts.findIndex((p) => p.id === post.id);
  if (index !== -1) {
    globalCache.posts[index] = post;
  } else {
    globalCache.posts.push(post);
  }
};
