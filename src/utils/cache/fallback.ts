/**
 * Fallback cache implementation for when Redis isn't available
 * In case you don't have Redis installed when cloning the repo
 */

export class MemoryCache {
  private cache = new Map<string, { data: string; expiry: number | null }>();

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  async set(
    key: string,
    value: string,
    ex?: string,
    ttl?: number
  ): Promise<"OK"> {
    const expiry = ttl ? Date.now() + ttl * 1000 : null;
    this.cache.set(key, { data: value, expiry });
    return "OK";
  }

  async del(key: string): Promise<number> {
    return this.cache.delete(key) ? 1 : 0;
  }
}
