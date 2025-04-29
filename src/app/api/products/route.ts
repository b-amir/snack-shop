import { NextResponse } from "next/server";
import {
  sortProducts,
  paginateProducts,
  getPaginationMetadata,
} from "@/utils/api/products/index";
import { getCache, setCache } from "@/utils/cache";
import productsData from "@/data/products.json";
import { API_CACHE_TTL } from "@/constants";
import { ProductSortOption, Product } from "@/types/product";

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

    const sort = (searchParams.get("sort") || "") as ProductSortOption;
    const cacheKey = `api:products:${page}:${limit}:${sort}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    const sortedProductsReadonly = sortProducts(productsData.products, sort);
    const sortedProductsMutable: Product[] = Array.from(sortedProductsReadonly);

    const paginatedProducts = paginateProducts(
      sortedProductsMutable,
      page,
      limit
    );

    const result = {
      products: paginatedProducts,
      pagination: getPaginationMetadata(
        sortedProductsReadonly.length,
        page,
        limit
      ),
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
