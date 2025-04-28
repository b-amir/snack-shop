/**
 * Fallback cache implementation for when Redis isn't available
 * In case you don't have Redis installed when cloning the repo
 */

export class MemoryCache {
  private cache = new Map<string, { data: string; expiry: number | null }>();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startPeriodicCleanup(10 * 60 * 1000); // cleanup every 10 minutes
  }

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
    mode?: string,
    ttlSeconds?: number
  ): Promise<"OK"> {
    let expiry: number | null = null;
    if (
      mode?.toUpperCase() === "EX" &&
      typeof ttlSeconds === "number" &&
      ttlSeconds > 0
    ) {
      expiry = Date.now() + ttlSeconds * 1000;
    }

    this.cache.set(key, { data: value, expiry });
    return "OK";
  }

  async del(key: string): Promise<number> {
    const deleted = this.cache.delete(key);
    return deleted ? 1 : 0;
  }

  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry && item.expiry < now) {
        this.cache.delete(key);
      }
    }
  }

  private startPeriodicCleanup(intervalMs: number): void {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired();
    }, intervalMs);
    this.cleanupTimer.unref();
  }

  disconnect(): void {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
  }
}
