import { NextResponse } from "next/server";
import {
  sortProducts,
  paginateProducts,
  getPaginationMetadata,
} from "@/utils/api/products/index";
import { getCache, setCache } from "@/utils/cache";
import productsData from "@/data/products.json";

const API_CACHE_TTL = 300; // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(
      1,
      parseInt(
        searchParams.get("limit") || searchParams.get("pageSize") || "10"
      )
    );
    const sort = searchParams.get("sort") || "";

    const cacheKey = `api:products:${page}:${limit}:${sort}`;

    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const sortedProducts = sortProducts(productsData.products, sort);
    const paginatedProducts = paginateProducts(sortedProducts, page, limit);

    const result = {
      products: paginatedProducts,
      pagination: getPaginationMetadata(sortedProducts.length, page, limit),
    };

    await setCache(cacheKey, result, API_CACHE_TTL);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
