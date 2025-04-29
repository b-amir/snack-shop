import { fetchProducts } from "@/services/productService";
import {
  PRODUCT_DETAIL_CACHE_TTL,
  PRODUCT_LIST_CACHE_TTL,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_ORDER,
  CACHE_KEY_PRODUCT_DETAIL_PREFIX,
  CACHE_KEY_PRODUCT_LIST_PREFIX,
} from "@/constants";
import { getCacheInitializationError, setCache } from "./client/redis";

//   Preloads product data into the cache.
//   Fetches the default first page of products and caches it.
//   Also caches the details for those specific products.

export async function warmCache(): Promise<void> {
  console.log("[Cache Warming] Starting cache warming process...");

  const initError = await getCacheInitializationError();
  if (initError) {
    console.warn(
      `[Cache Warming] Skipping cache warming due to cache initialization error: ${initError.message}`
    );
    return;
  }

  try {
    // 1. Fetch the default first page of products using the service
    console.log(
      `[Cache Warming] Fetching default product list (page 1, size ${DEFAULT_PAGE_SIZE}, sort ${DEFAULT_SORT_ORDER})...`
    );
    const productListData = await fetchProducts({
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      sort: DEFAULT_SORT_ORDER,
    });

    if (
      !productListData ||
      !productListData.products ||
      productListData.products.length === 0
    ) {
      console.log(
        "[Cache Warming] No products returned from service to warm cache with."
      );
      return;
    }

    const listCacheKey = `${CACHE_KEY_PRODUCT_LIST_PREFIX}1:${DEFAULT_PAGE_SIZE}:${DEFAULT_SORT_ORDER}`;
    await setCache(listCacheKey, productListData, PRODUCT_LIST_CACHE_TTL);
    console.log(
      `[Cache Warming] Successfully cached default product list (Key: ${listCacheKey}).`
    );

    // 2. Cache details for the products on the first page
    const productsToWarm = productListData.products;
    console.log(
      `[Cache Warming] Caching details for ${productsToWarm.length} products from the first page...`
    );

    let warmedCount = 0;
    for (const product of productsToWarm) {
      try {
        const detailCacheKey = `${CACHE_KEY_PRODUCT_DETAIL_PREFIX}${product.id}`;
        await setCache(detailCacheKey, { product }, PRODUCT_DETAIL_CACHE_TTL);
        warmedCount++;
      } catch (productError) {
        console.error(
          `[Cache Warming] Error caching detail for product ${product.id}:`,
          productError
        );
      }
    }
    console.log(
      `[Cache Warming] Finished caching ${warmedCount}/${productsToWarm.length} product details.`
    );
  } catch (error) {
    console.error("[Cache Warming] Error during cache warming process:", error);
  }
  console.log("[Cache Warming] Cache warming process finished.");
}
