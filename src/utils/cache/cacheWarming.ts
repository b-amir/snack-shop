import { productByIdMap } from "@/utils/api/products/index";
import { Redis } from "ioredis";
import { Product } from "@/types/product";
import { ProductsResponse } from "@/services/productService";
import {
  PRODUCT_DETAIL_CACHE_TTL,
  PRODUCT_LIST_CACHE_TTL,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_ORDER,
  CACHE_KEY_PRODUCT_DETAIL_PREFIX,
  CACHE_KEY_PRODUCT_LIST_PREFIX,
} from "@/constants";

export async function preloadPopularProducts(redisClient: Redis) {
  console.log("[Cache] Preloading products to cache...");

  const allProducts = Array.from(productByIdMap.values());
  if (allProducts.length === 0) {
    console.log("[Cache] No products found to preload");
    return;
  }

  allProducts.sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );

  try {
    const defaultListPage = allProducts.slice(0, DEFAULT_PAGE_SIZE);
    const totalProducts = allProducts.length;
    const totalPages = Math.ceil(totalProducts / DEFAULT_PAGE_SIZE);

    const defaultListData: ProductsResponse = {
      products: defaultListPage,
      pagination: {
        totalProducts: totalProducts,
        totalPages: totalPages,
        currentPage: 1,
        limit: DEFAULT_PAGE_SIZE,
      },
    };

    const cacheKey = `${CACHE_KEY_PRODUCT_LIST_PREFIX}:1:${DEFAULT_PAGE_SIZE}:${DEFAULT_SORT_ORDER}`;
    await redisClient.set(
      cacheKey,
      JSON.stringify(defaultListData),
      "EX",
      PRODUCT_LIST_CACHE_TTL
    );
  } catch (error) {
    console.log(
      "[Cache] Error preloading product list:",
      (error as Error).message
    );
  }

  const popularProducts: Product[] = allProducts.slice(0, DEFAULT_PAGE_SIZE);

  if (popularProducts.length > 0) {
    try {
      const pipeline = redisClient.pipeline();

      for (const product of popularProducts) {
        const cacheKey = `${CACHE_KEY_PRODUCT_DETAIL_PREFIX}${product.id}`;
        pipeline.set(
          cacheKey,
          JSON.stringify({ product }),
          "EX",
          PRODUCT_DETAIL_CACHE_TTL
        );
      }

      await pipeline.exec();
      console.log(
        `[Cache] Preloaded ${popularProducts.length} product details`
      );
    } catch (error) {
      console.log(
        "[Cache] Error preloading product details:",
        (error as Error).message
      );
    }
  }
}
