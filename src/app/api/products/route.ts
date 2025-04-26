import { NextResponse } from "next/server";
import {
  searchProducts,
  sortProducts,
  paginateProducts,
  getPaginationMetadata,
  preprocessedProducts,
} from "@/utils/api/products/index";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.max(
      1,
      parseInt(
        searchParams.get("limit") || searchParams.get("pageSize") || "10"
      )
    );
    const sort = searchParams.get("sort") || "";

    // Apply operations in pipeline: filter -> sort -> paginate
    // Filtering first reduces the dataset size early,
    // making subsequent sorting and pagination faster.

    const filteredProducts = searchProducts(preprocessedProducts, searchQuery);
    const sortedProducts = sortProducts(filteredProducts, sort);
    const paginatedProducts = paginateProducts(sortedProducts, page, limit);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: getPaginationMetadata(filteredProducts.length, page, limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
