import { NextResponse } from "next/server";
import { productByIdMap } from "@/utils/api/products/index";

export async function GET(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const { productId } = params;
    const product = productByIdMap.get(productId);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
