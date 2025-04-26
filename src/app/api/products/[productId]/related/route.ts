import { NextResponse } from "next/server";
import { getRelatedProducts } from "@/lib/api/products/index";
import { SupportedLocale } from "@/types/product";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const { searchParams } = new URL(request.url);
    const locale = (searchParams.get("locale") || "en") as SupportedLocale;
    const limit = parseInt(searchParams.get("limit") || "3", 10);

    if (!productId || isNaN(limit) || limit <= 0) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const relatedProducts = getRelatedProducts(productId, locale);

    if (!relatedProducts) {
      return NextResponse.json(
        { error: "Product not found or no related products" },
        { status: 404 }
      );
    }

    return NextResponse.json(relatedProducts.slice(0, limit));
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
