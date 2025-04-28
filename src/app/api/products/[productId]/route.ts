import { NextResponse } from "next/server";
import { productByIdMap } from "@/utils/api/products/index";
import { getCache, setCache } from "@/utils/cache";

const PRODUCT_DETAIL_CACHE_TTL = 3600; // 1 hour

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;

    const cacheKey = `api:product:${productId}`;

    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log(`API CACHE HIT: ${cacheKey}`);
      return NextResponse.json(cachedData);
    }

    console.log(`API CACHE MISS: ${cacheKey}`);

    // Get product (in a real app, this would be a DB query)
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
