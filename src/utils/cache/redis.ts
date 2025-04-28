import { getCacheState } from "./cacheClientInstance";

export async function getCache<T>(key: string): Promise<T | null> {
  const cacheType = key.startsWith("api:") ? "API" : "Service";
  try {
    const { client, usingFallback } = await getCacheState();
    if (!client) return null;

    const data = await client.get(key);
    if (!data) {
      if (!usingFallback) console.log(`[Cache:${cacheType}] MISS key: ${key}`);
      return null;
    }

    if (!usingFallback) console.log(`[Cache:${cacheType}] HIT key: ${key}`);
    return JSON.parse(data) as T;
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log(
        `[Cache:${cacheType}] Error parsing key ${key}: ${
          (error as Error).message
        }`
      );
    }
    return null;
  }
}

export async function setCache<T>(
  key: string,
  data: T,
  ttlSeconds: number
): Promise<void> {
  try {
    const { client } = await getCacheState();
    if (!client) return;

    const value = JSON.stringify(data);
    await client.set(key, value, "EX", ttlSeconds);
  } catch (error) {
    console.log(
      `[Cache] Error setting key ${key}: ${(error as Error).message}`
    );
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    const { client } = await getCacheState();
    if (!client) return;

    await client.del(key);
  } catch (error) {
    console.log(
      `[Cache] Error deleting key ${key}: ${(error as Error).message}`
    );
  }
}

export async function isUsingFallback(): Promise<boolean> {
  const { usingFallback } = await getCacheState();
  return usingFallback;
}

export async function getCacheInitializationError(): Promise<Error | null> {
  const { error } = await getCacheState();
  return error;
}
