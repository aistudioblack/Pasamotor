const IS_CLIENT = typeof window !== "undefined";

export const getCache = (key: string) => {
  if (!IS_CLIENT) return null;
  return localStorage.getItem(key);
};

export const setCache = (key: string, value: string) => {
  if (!IS_CLIENT) return;
  localStorage.setItem(key, value);
};

export const clearCache = (key: string) => {
  if (!IS_CLIENT) return;
  localStorage.removeItem(key);
};
