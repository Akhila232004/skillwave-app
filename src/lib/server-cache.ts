/**
 * server-cache.ts
 * Lightweight in-memory TTL cache for server-side API handlers.
 * Prevents stampede: concurrent requests for the same key reuse the
 * same in-flight promise rather than firing multiple GitHub fetches.
 */

const DEFAULT_TTL_MS = 60 * 1000; // 1 minute
type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

// Separate maps so the types remain clean
const cache = new Map<string, CacheEntry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

/**
 * Retrieve a cached value, or compute it via `fn` and cache the result.
 *
 * @param key      Unique cache key
 * @param fn       Async factory — only called on a cache miss
 * @param ttlMs    How long (ms) to keep the result. Default: 60 000 ms
 */
export async function withServerCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> {
  const now = Date.now();

  // Hot path: fresh value already in cache
  const existing = cache.get(key) as CacheEntry<T> | undefined;
  if (existing && existing.expiresAt > now) {
    return existing.value;
  }

  // Deduplicate concurrent fetches for the same key
  const pending = inflight.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const request = fn()
    .then((value) => {
      cache.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
      });
      return value;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, request as Promise<unknown>);
  return request;
}

/** Explicitly evict a cache entry (e.g. after a forced revalidation). */
export function invalidateServerCache(key: string) {
  cache.delete(key);
}

/** Clear the entire server cache (useful for testing). */
export function clearServerCache() {
  cache.clear();
}
