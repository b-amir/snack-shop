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

  console.log(`[Cache:Redis] Attempting connection...`);

  const redisOptions: RedisOptions = {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    connectTimeout: REDIS_CONNECT_TIMEOUT_MS,
    lazyConnect: false,
    showFriendlyErrorStack: false,
    tls: process.env.REDIS_URL.startsWith("rediss://")
      ? { rejectUnauthorized: false }
      : undefined,
  };

  const redisInstance = new Redis(process.env.REDIS_URL, redisOptions);

  const redisClientWrapper: CacheClient = {
    isFallback: false,
    get: (key: string) => redisInstance.get(key),
    set: (key: string, value: string, mode?: "EX", ttlSeconds?: number) => {
      return mode === "EX" && ttlSeconds !== undefined
        ? redisInstance.set(key, value, mode, ttlSeconds)
        : redisInstance.set(key, value);
    },
    del: (keyOrKeys: string | string[]) =>
      redisInstance.del(keyOrKeys as string[]),
    disconnect: async () => {
      await redisInstance.quit();
    },
  };

  return new Promise((resolve, reject) => {
    const connectTimer = setTimeout(() => {
      redisInstance.removeAllListeners();
      redisInstance.disconnect();
      reject(
        new Error(
          `[Cache:Redis] Connection timed out after ${REDIS_CONNECT_TIMEOUT_MS}ms.`
        )
      );
    }, REDIS_CONNECT_TIMEOUT_MS);

    redisInstance.once("ready", () => {
      clearTimeout(connectTimer);
      redisInstance.removeAllListeners("error");
      console.log("[Cache:Redis] Connection successful.");
      resolve({ client: redisClientWrapper });
    });

    redisInstance.once("error", (err) => {
      clearTimeout(connectTimer);
      redisInstance.removeAllListeners();
      redisInstance.disconnect();
      console.error(`[Cache:Redis] Connection error: ${err.message}`);
      reject(err);
    });
  });
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
    console.log("[Cache] Initializing cache state...");
    cacheInitializationPromise = initializeCache();
  }
  return cacheInitializationPromise;
}
