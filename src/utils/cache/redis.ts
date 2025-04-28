import Redis from "ioredis";
import { MemoryCache } from "./fallback";

// Cache client: Redis or in-memory fallback
let cacheClient: Redis | MemoryCache;
let usingFallback = false;

try {
  if (process.env.REDIS_URL) {
    cacheClient = new Redis(process.env.REDIS_URL);
    console.log("Connected to Redis");
  } else {
    throw new Error("REDIS_URL not set");
  }
} catch (error: unknown) {
  console.log(
    "Redis not available, using in-memory cache fallback",
    error instanceof Error ? error.message : ""
  );
  cacheClient = new MemoryCache();
  usingFallback = true;
}

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await cacheClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    console.error(`Cache get error for key ${key}:`, error);
    return null;
  }
}

export async function setCache<T>(
  key: string,
  data: T,
  ttlSeconds: number
): Promise<void> {
  try {
    await cacheClient.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch (error) {
    console.error(`Cache set error for key ${key}:`, error);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await cacheClient.del(key);
  } catch (error) {
    console.error(`Cache delete error for key ${key}:`, error);
  }
}

export function isUsingFallback(): boolean {
  return usingFallback;
}

export default cacheClient;
