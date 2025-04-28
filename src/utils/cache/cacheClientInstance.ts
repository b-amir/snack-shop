import Redis, { RedisOptions } from "ioredis";
import { MemoryCache } from "./fallback";

const REDIS_CONNECT_TIMEOUT_MS = 2000;

interface CacheState {
  client: Redis | MemoryCache;
  usingFallback: boolean;
  error: Error | null;
}

let cacheStatePromise: Promise<CacheState> | null = null;

async function initializeCache(): Promise<CacheState> {
  if (!process.env.REDIS_URL) {
    console.log("[Cache] REDIS_URL not set. Using in-memory cache.");
    return { client: new MemoryCache(), usingFallback: true, error: null };
  }

  console.log(`[Cache] Connecting to Redis at ${process.env.REDIS_URL}...`);

  const redisOptions: RedisOptions = {
    maxRetriesPerRequest: 0,
    enableOfflineQueue: false,
    connectTimeout: REDIS_CONNECT_TIMEOUT_MS,
    lazyConnect: false,
    showFriendlyErrorStack: process.env.NODE_ENV !== "production",
    tls: process.env.REDIS_URL.startsWith("rediss://")
      ? { rejectUnauthorized: false }
      : undefined,
  };

  const redisInstance = new Redis(process.env.REDIS_URL, redisOptions);

  try {
    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        redisInstance.removeAllListeners("error");
        reject(
          new Error(
            `[Cache] Redis connection timed out after ${REDIS_CONNECT_TIMEOUT_MS}ms`
          )
        );
      }, REDIS_CONNECT_TIMEOUT_MS);

      redisInstance.once("ready", () => {
        clearTimeout(timeoutId);
        redisInstance.removeAllListeners("error");
        console.log("[Cache] Redis connection successful");
        resolve();
      });

      redisInstance.once("error", (err) => {
        clearTimeout(timeoutId);
        console.error(
          `[Cache] Redis connection error during setup: ${err.message}`
        );
        redisInstance.removeAllListeners("ready");
        reject(err);
      });
    });

    if (redisInstance.status !== "ready") {
      throw new Error(
        `[Cache] Redis connected but status is: ${redisInstance.status}`
      );
    }

    return { client: redisInstance, usingFallback: false, error: null };
  } catch (error) {
    console.warn(
      `[Cache] Failed to connect to Redis: ${
        (error as Error).message
      }. Using fallback.`
    );
    redisInstance.disconnect();
    return {
      client: new MemoryCache(),
      usingFallback: true,
      error: error as Error,
    };
  }
}

export async function getCacheState(): Promise<CacheState> {
  if (!cacheStatePromise) {
    cacheStatePromise = initializeCache();
  }
  return cacheStatePromise;
}
