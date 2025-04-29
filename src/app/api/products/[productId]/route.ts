import { NextResponse } from "next/server";
import { productByIdMap } from "@/utils/api/products/index";
import { getCache, setCache } from "@/utils/cache";
import {
  PRODUCT_DETAIL_CACHE_TTL,
  CACHE_KEY_PRODUCT_DETAIL_PREFIX,
} from "@/constants";

export async function GET(
  request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;
    const cacheKey = `${CACHE_KEY_PRODUCT_DETAIL_PREFIX}${productId}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const product = productByIdMap.get(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const result = { product };
    await setCache(cacheKey, result, PRODUCT_DETAIL_CACHE_TTL);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
