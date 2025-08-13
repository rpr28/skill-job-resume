// Utility helpers for local storage keys
export const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    const v = localStorage.getItem(key);
    if (!v) return null;
    try { return JSON.parse(v); } catch { return null; }
  },
};







