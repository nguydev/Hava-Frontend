/**
 * Key/value storage backed by AsyncStorage.
 *
 * AsyncStorage is asynchronous, but callers (and the Zustand stores that read at
 * startup) expect a SYNCHRONOUS interface. So we keep a synchronous in-memory
 * cache that is the read/write surface, and mirror every write to AsyncStorage
 * for persistence. On app start `hydrateStorage()` loads the persisted values
 * into the cache — it MUST be awaited before the stores read (see the root
 * layout, which gates render on it).
 *
 * Replaces the previous native react-native-mmkv backend (which caused build
 * issues on RN 0.86 / New Architecture). AsyncStorage works on iOS, Android and
 * web with no native-build headaches.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

/* -------------------------------------------------------------------------- */

/** Storage keys — centralized to avoid typos. */
export const STORAGE_KEYS = {
  authToken: 'auth.token',
  authUser: 'auth.user',
  role: 'auth.role',
  onboardingComplete: 'app.onboardingComplete',
  cart: 'cart.items',
  preferences: 'app.preferences',
  notificationPrefs: 'app.notificationPrefs',
} as const;

const KNOWN_KEYS = Object.values(STORAGE_KEYS);

/** Synchronous read/write surface. */
const cache = new Map<string, string>();
let hydrated = false;

/** Which persistence backend is active (kept for compatibility/logging). */
export const storageBackend = 'async-storage';

/**
 * Load persisted values into the cache. Await this once at app start before any
 * store reads. Safe to call more than once (no-op after the first).
 */
export async function hydrateStorage(): Promise<void> {
  if (hydrated) return;
  try {
    const pairs = await AsyncStorage.multiGet(KNOWN_KEYS);
    for (const [k, v] of pairs) if (v != null) cache.set(k, v);
  } catch (err) {
    if (__DEV__) console.warn('[storage] hydrate failed; starting with empty cache', err);
  } finally {
    hydrated = true;
  }
}

/* --------- internal sync surface (writes mirror to AsyncStorage) ---------- */

function setItem(key: string, value: string): void {
  cache.set(key, value);
  AsyncStorage.setItem(key, value).catch(() => {});
}
function removeItem(key: string): void {
  cache.delete(key);
  AsyncStorage.removeItem(key).catch(() => {});
}

export const storage = {
  getString(key: string): string | null {
    return cache.get(key) ?? null;
  },
  set(key: string, value: string): void {
    setItem(key, value);
  },
  delete(key: string): void {
    removeItem(key);
  },
  getBoolean(key: string): boolean {
    return cache.get(key) === 'true';
  },
  setBoolean(key: string, value: boolean): void {
    setItem(key, value ? 'true' : 'false');
  },
  getObject<T>(key: string): T | null {
    const raw = cache.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setObject<T>(key: string, value: T): void {
    setItem(key, JSON.stringify(value));
  },
  clearAll(): void {
    const keys = [...cache.keys()];
    cache.clear();
    AsyncStorage.multiRemove(keys).catch(() => {});
  },
};

/** Zustand persist adapter (JSON string interface) backed by `storage`. */
export const zustandStorage = {
  getItem: (name: string) => storage.getString(name),
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};
