import { NextResponse } from "next/server";
import { getRelatedProducts } from "@/utils/api/products/related";
import { getCache, setCache } from "@/utils/cache";
import { SupportedLocale } from "@/types/product";

const RELATED_PRODUCTS_CACHE_TTL = 900; // 15 minutes

export async function GET(
  request: Request,
  context: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await context.params;
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get("locale") || "en") as SupportedLocale;
    const limit = parseInt(searchParams.get("limit") || "3");

    const cacheKey = `api:related:${productId}:${locale}:${limit}`;

    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const relatedProducts = getRelatedProducts(productId, locale).slice(
      0,
      limit
    );

    await setCache(cacheKey, relatedProducts, RELATED_PRODUCTS_CACHE_TTL);

    return NextResponse.json(relatedProducts);
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Failed to fetch related products" },
      { status: 500 }
    );
  }
}
