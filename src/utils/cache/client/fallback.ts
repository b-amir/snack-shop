/**
 * Fallback cache implementation for when Redis isn't available
 * In case you don't have Redis installed when cloning the repo
 */

import { FALLBACK_CACHE_CLEANUP_INTERVAL_MINUTES } from "@/constants";
import { CacheClient } from "../types";

export class MemoryCache implements CacheClient {
  private cache = new Map<string, { data: string; expiry: number | null }>();
  private cleanupTimer: NodeJS.Timeout | null = null;
  public readonly isFallback = true;

  constructor() {
    this.startPeriodicCleanup(
      FALLBACK_CACHE_CLEANUP_INTERVAL_MINUTES * 60 * 1000
    );
    console.log("[Cache:Fallback] Initialized MemoryCache.");
  }

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) {
      console.log(`[Cache:Fallback] MISS: ${key}`);
      return null;
    }

    if (item.expiry && item.expiry < Date.now()) {
      console.log(`[Cache:Fallback] EXPIRED: ${key}`);
      this.cache.delete(key);
      return null;
    }
    console.log(`[Cache:Fallback] HIT: ${key}`);
    return item.data;
  }

  async set(
    key: string,
    value: string,
    mode?: "EX",
    ttlSeconds?: number
  ): Promise<"OK" | null> {
    let expiry: number | null = null;
    if (mode === "EX" && typeof ttlSeconds === "number" && ttlSeconds > 0) {
      expiry = Date.now() + ttlSeconds * 1000;
    }

    this.cache.set(key, { data: value, expiry });
    return "OK";
  }

  async del(keyOrKeys: string | string[]): Promise<number> {
    const keysToDelete = Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
    let deletedCount = 0;
    for (const key of keysToDelete) {
      if (key.endsWith("*")) {
        const prefix = key.slice(0, -1);
        for (const cacheKey of this.cache.keys()) {
          if (cacheKey.startsWith(prefix)) {
            if (this.cache.delete(cacheKey)) {
              deletedCount++;
            }
          }
        }
      } else {
        if (this.cache.delete(key)) {
          deletedCount++;
        }
      }
    }
    return deletedCount;
  }

  private cleanupExpired(): void {
    const now = Date.now();
    let deletedCount = 0;
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry && item.expiry < now) {
        this.cache.delete(key);
        deletedCount++;
      }
    }
    if (deletedCount > 0) {
      console.log(`[Cache:Fallback] Cleaned up ${deletedCount} expired items.`);
    }
  }

  private startPeriodicCleanup(intervalMs: number): void {
    if (this.cleanupTimer) clearInterval(this.cleanupTimer);
    this.cleanupExpired();
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpired();
    }, intervalMs);
    this.cleanupTimer.unref();
  }

  async disconnect(): Promise<void> {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.cache.clear();
    console.log(
      "[Cache:Fallback] Disconnected (cleared cache and cleanup timer)."
    );
  }
}
