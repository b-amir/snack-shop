import { getCacheState } from "./cacheClientInstance";
import { CacheClient } from "../types";

let clientState = getCacheState();

async function getClient(): Promise<CacheClient | null> {
  try {
    const { client, error } = await clientState;
    if (error && !client.isFallback) {
      console.error(
        `[Cache] Using fallback due to Redis initialization error: ${error.message}`
      );
    }
    return client;
  } catch (initError) {
    console.error(
      `[Cache] Critical error during cache client initialization: ${initError}`
    );
    return null;
  }
}

export async function getCache<T>(key: string): Promise<T | null> {
  const client = await getClient();
  if (!client) return null;

  const cacheType = client.isFallback ? "Fallback" : "Redis";
  try {
    const data = await client.get(key);
    if (data === null) {
      console.log(`[Cache:${cacheType}] MISS: ${key}`);
      return null;
    }

    console.log(`[Cache:${cacheType}] HIT: ${key}`);
    try {
      return JSON.parse(data) as T;
    } catch (parseError) {
      console.error(
        `[Cache:${cacheType}] Error parsing JSON for key ${key}: ${
          (parseError as Error).message
        }`
      );
      return null;
    }
  } catch (error) {
    console.error(
      `[Cache:${cacheType}] Error getting key ${key}: ${
        (error as Error).message
      }`
    );
    return null;
  }
}

export async function setCache<T>(
  key: string,
  data: T,
  ttlSeconds: number
): Promise<void> {
  const client = await getClient();
  if (!client) return;

  const cacheType = client.isFallback ? "Fallback" : "Redis";
  try {
    const value = JSON.stringify(data);
    await client.set(key, value, "EX", ttlSeconds);
  } catch (error) {
    console.error(
      `[Cache:${cacheType}] Error setting key ${key}: ${
        (error as Error).message
      }`
    );
  }
}

export async function deleteCache(keyOrKeys: string | string[]): Promise<void> {
  const client = await getClient();
  if (!client) return;

  const cacheType = client.isFallback ? "Fallback" : "Redis";
  try {
    const deletedCount = await client.del(keyOrKeys);
    const keysStr = Array.isArray(keyOrKeys) ? keyOrKeys.join(", ") : keyOrKeys;
    console.log(
      `[Cache:${cacheType}] Deleted ${deletedCount} keys for pattern: ${keysStr}`
    );
  } catch (error) {
    console.error(
      `[Cache:${cacheType}] Error deleting key(s) ${keyOrKeys}: ${
        (error as Error).message
      }`
    );
  }
}

export async function isUsingFallback(): Promise<boolean> {
  const client = await getClient();
  return client?.isFallback ?? true;
}

export async function getCacheInitializationError(): Promise<Error | null> {
  try {
    const { error } = await clientState;
    return error;
  } catch {
    return new Error("Failed to retrieve cache state.");
  }
}

export async function disconnectCache(): Promise<void> {
  console.log("[Cache] Disconnecting cache client...");
  const client = await getClient();
  if (client) {
    try {
      await client.disconnect();
    } catch (disconnectError) {
      console.error("[Cache] Error during disconnect:", disconnectError);
    }
  }
  clientState = getCacheState();
}
