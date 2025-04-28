import { productByIdMap } from "@/utils/api/products/index";
import { Redis } from "ioredis";
import { Product } from "@/types/product";
import { ProductsResponse } from "@/services/productService";

const PRODUCT_DETAIL_CACHE_TTL = 1 * 60 * 60; // 1 hour
const PRODUCT_LIST_CACHE_TTL = 5 * 60; // 5 minutes

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
    const defaultListPage = allProducts.slice(0, 8);
    const totalProducts = allProducts.length;
    const totalPages = Math.ceil(totalProducts / 8);

    const defaultListData: ProductsResponse = {
      products: defaultListPage,
      pagination: {
        totalProducts: totalProducts,
        totalPages: totalPages,
        currentPage: 1,
        limit: 8,
      },
    };

    const cacheKey = "products::1:8:date_desc";
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

  // Preload individual products (newest 8)
  const popularProducts: Product[] = allProducts.slice(0, 8);

  if (popularProducts.length > 0) {
    try {
      const pipeline = redisClient.pipeline();

      for (const product of popularProducts) {
        const cacheKey = `product:${product.id}`;
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
