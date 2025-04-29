import { NextRequest, NextResponse } from "next/server";
import { getCache, setCache, isUsingFallback } from "@/utils/cache";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";
import { getSessionId, getCartKey } from "@/utils/api/cart";
import { CART_SESSION_TTL } from "@/constants";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, setCookieHeader } = getSessionId(request);
    const cartKey = getCartKey(sessionId);
    const { product, quantity = 1 } = (await request.json()) as {
      product: Product;
      quantity?: number;
    };

    if (!product || !product.id || quantity < 1) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    const currentItems: CartItem[] =
      (await getCache<CartItem[]>(cartKey)) || [];
    let updatedItems: CartItem[];

    const existingItemIndex = currentItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingItemIndex > -1) {
      updatedItems = currentItems.map((item, index) =>
        index === existingItemIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      updatedItems = [...currentItems, { product, quantity }];
    }

    await setCache(cartKey, updatedItems, CART_SESSION_TTL);

    return new NextResponse(JSON.stringify({ items: updatedItems }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...(setCookieHeader && { ...setCookieHeader }),
      },
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON format" },
        { status: 400 }
      );
    }

    if (await isUsingFallback()) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
