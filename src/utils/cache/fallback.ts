/**
 * Fallback cache implementation for when Redis isn't available
 * In case you don't have Redis installed when cloning the repo
 */

import { FALLBACK_CACHE_CLEANUP_INTERVAL_MINUTES } from "@/constants";

export class MemoryCache {
  private cache = new Map<string, { data: string; expiry: number | null }>();
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startPeriodicCleanup(
      FALLBACK_CACHE_CLEANUP_INTERVAL_MINUTES * 60 * 1000
    );
  }

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) {
      console.log(`[Fallback Cache] MISS: ${key}`);
      return null;
    }

    if (item.expiry && item.expiry < Date.now()) {
      console.log(`[Fallback Cache] EXPIRED: ${key}`);
      this.cache.delete(key);
      return null;
    }
    console.log(`[Fallback Cache] HIT: ${key}`);
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
