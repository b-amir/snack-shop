import Redis, { RedisOptions } from "ioredis";
import { MemoryCache } from "./fallback";
import { REDIS_CONNECT_TIMEOUT_MS } from "@/constants";
import { CacheClient } from "../types";

declare global {
  // eslint-disable-next-line no-var
  var __cachedResolvedCacheState__: ResolvedCacheState | undefined;
}

interface ResolvedCacheState {
  client: CacheClient;
  error: Error | null;
}

let cacheInitializationPromise: Promise<ResolvedCacheState> | null = null;

async function initializeRedisClient(): Promise<{ client: CacheClient }> {
  if (!process.env.REDIS_URL) {
    throw new Error("REDIS_URL not set.");
  }

  const redisOptions: RedisOptions = {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    connectTimeout: REDIS_CONNECT_TIMEOUT_MS,
    lazyConnect: true,
    showFriendlyErrorStack: false,
    tls: process.env.REDIS_URL.startsWith("rediss://")
      ? { rejectUnauthorized: false }
      : undefined,
  };

  const redisInstance = new Redis(process.env.REDIS_URL, redisOptions);

  try {
    await redisInstance.ping();
    console.log("[Cache:Redis] Connection successful (via ping).");
  } catch (connectionError) {
    redisInstance.disconnect();
    throw connectionError;
  }

  const redisClientWrapper: CacheClient = {
    isFallback: false,
    get: (key) => redisInstance.get(key),
    set: (key, value, mode, ttlSeconds) => {
      return mode === "EX" && ttlSeconds !== undefined
        ? redisInstance.set(key, value, mode, ttlSeconds)
        : redisInstance.set(key, value);
    },
    del: (keyOrKeys) => redisInstance.del(keyOrKeys as string[]),
    disconnect: async () => {
      await redisInstance.quit();
    },
  };

  return { client: redisClientWrapper };
}

async function initializeCache(): Promise<ResolvedCacheState> {
  try {
    const { client } = await initializeRedisClient();
    return { client, error: null };
  } catch (redisError) {
    console.warn(`[Cache] Redis init failed. Using fallback.`);
    return {
      client: new MemoryCache(),
      error: redisError as Error,
    };
  }
}

export function getCacheState(): Promise<ResolvedCacheState> {
  if (!cacheInitializationPromise) {
    cacheInitializationPromise = initializeCache();
  }
  return cacheInitializationPromise;
}
