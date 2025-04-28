import { deleteCache } from "@/utils/cache/redis";

export async function invalidateProductCache(productId: string) {
  await deleteCache(`product:${productId}`);
  await deleteCache(`api:product:${productId}`);
  console.log(`[Cache] Invalidated cache for product: ${productId}`);
}

export async function invalidateProductListingCache() {
  await deleteCache(`products:*`);
  await deleteCache(`api:products:*`);
  console.log("[Cache] Invalidated product listings cache");
}
