import { NextResponse } from "next/server";
import productsData from "@/lib/data/products.json";
import { Product } from "@/types/product";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search")?.toLowerCase() || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const allProducts = productsData.products as Product[];

    //! Note: The current implementation is for showcasing purposes and uses an in-memory JSON file.
    // For scalability and to handle time/space complexities with a large dataset (e.g., billions of products),
    // it is recommended to use a database. This allows efficient filtering, pagination, and querying.

    const filteredProducts = searchQuery
      ? allProducts.filter(
          (product) =>
            product.name.en.toLowerCase().includes(searchQuery) ||
            product.name.fa.includes(searchQuery) ||
            product.description.en.toLowerCase().includes(searchQuery) ||
            product.description.fa.includes(searchQuery)
        )
      : allProducts;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const totalProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      products: paginatedProducts,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
