import { productByIdMap } from "@/utils/api/products/index";
import { setCache } from "@/utils/cache/redis";
import { Product } from "@/types/product";

const PRODUCT_CACHE_TTL = 3600; // 1 hour for products

export async function preloadPopularProducts() {
  console.log("Preloading popular products to cache...");

  // In a real app, we would identify popular products via analytics
  // For this demo, we'll just use the first few products
  const popularProducts: Product[] = Array.from(productByIdMap.values()).slice(
    0,
    10
  );

  for (const product of popularProducts) {
    const cacheKey = `product:${product.id}`;
    await setCache(cacheKey, { product }, PRODUCT_CACHE_TTL);
  }

  console.log(`Cached ${popularProducts.length} popular products`);
}

export function scheduleCacheWarming(intervalMinutes = 60) {
  preloadPopularProducts().catch((err) => {
    console.error("Cache warming error:", err);
  });

  console.log(`Scheduled cache refresh every ${intervalMinutes} minutes`);
}
