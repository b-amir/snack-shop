import { deleteCache } from "@/utils/cache/redis";

export async function invalidateProductCache(productId: string) {
  await deleteCache(`product:${productId}`);
  await deleteCache(`api:product:${productId}`);

  console.log(`Invalidated cache for product ${productId}`);
}

export async function invalidateProductListingCache() {
  console.log("Product listings would be invalidated here");
}
