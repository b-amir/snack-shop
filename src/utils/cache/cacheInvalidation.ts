import { getCacheState } from "./client/cacheClientInstance";
import { CacheClient } from "./types";

async function getClient(): Promise<CacheClient> {
  const { client } = await getCacheState();
  if (!client) {
    throw new Error("Cache client is unavailable for invalidation.");
  }
  return client;
}

async function deleteByPattern(pattern: string): Promise<void> {
  try {
    const client = await getClient();
    await client.del(pattern);
    console.log(
      `[Cache Invalidation] Attempted deletion for pattern: ${pattern}`
    );
  } catch (error) {
    console.error(
      `[Cache Invalidation] Error deleting pattern ${pattern}:`,
      error
    );
  }
}

export async function invalidateProductCache(productId: string): Promise<void> {
  if (!productId) return;
  const keysToDelete = [`product:${productId}`, `api:product:${productId}`];
  try {
    const client = await getClient();
    await client.del(keysToDelete);
    console.log(
      `[Cache Invalidation] Invalidated cache for product: ${productId}`
    );
  } catch (error) {
    console.error(
      `[Cache Invalidation] Failed for product ${productId}:`,
      error
    );
  }
}

export async function invalidateProductListingCache(): Promise<void> {
  const listingPattern = `products:*`;
  const apiListingPattern = `api:products:*`;
  console.log(
    `[Cache Invalidation] Invalidating product listings (using patterns)...`
  );
  await deleteByPattern(listingPattern);
  await deleteByPattern(apiListingPattern);
}
