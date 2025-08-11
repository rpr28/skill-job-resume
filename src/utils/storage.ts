// Utility helpers for local storage keys
export const storage = {
  set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get<T>(key: string): T | null {
    const v = localStorage.getItem(key);
    if (!v) return null;
    try { return JSON.parse(v) as T; } catch { return null; }
  },
};
