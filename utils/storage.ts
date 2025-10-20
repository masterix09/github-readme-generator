export const STORAGE_KEY = 'grg.formData';

export function saveToStorage<T extends object>(partial: Partial<T>) {
  if (typeof window === 'undefined') return;
  try {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    const parsed = existing ? (JSON.parse(existing) as object) : {};
    const merged = { ...parsed, ...partial } as object;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {}
}

export function readFromStorage<T>(): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearStorage() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {}
}


