type CacheEntry = { data: unknown; expires: number; storedAt: number };

const cache = new Map<string, CacheEntry>();

export function getStaffCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function getStaffCacheAge(key: string): number | null {
  const entry = cache.get(key);
  if (!entry || Date.now() > entry.expires) return null;
  return Date.now() - entry.storedAt;
}

export function setStaffCache(key: string, data: unknown, ttlMs: number) {
  cache.set(key, { data, expires: Date.now() + ttlMs, storedAt: Date.now() });
}

export function invalidateStaffCache(prefix?: string) {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key);
  }
}
