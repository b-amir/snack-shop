import { NextRequest, NextResponse } from "next/server";
import {
  getCache,
  setCache,
  deleteCache,
  isUsingFallback,
} from "@/utils/cache";
import { CartItem } from "@/types/product";
import { getSessionId, getCartKey } from "@/utils/api/cart/helpers";
import { CART_COOKIE_MAX_AGE } from "@/constants";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { sessionId } = getSessionId(request);
    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const cartKey = getCartKey(sessionId);
    const { productId } = await params;
    const { quantity } = (await request.json()) as { quantity: number };

    if (typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { message: "Invalid quantity" },
        { status: 400 }
      );
    }

    const items: CartItem[] = (await getCache<CartItem[]>(cartKey)) || [];
    if (items.length === 0 && !(await isUsingFallback())) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const itemIndex = items.findIndex((item) => item.product.id === productId);

    if (itemIndex === -1) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    items[itemIndex].quantity = quantity;

    await setCache(cartKey, items, CART_COOKIE_MAX_AGE);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error updating cart item:", error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { sessionId } = getSessionId(request);
    if (!sessionId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const cartKey = getCartKey(sessionId);
    const { productId } = await params;

    const items: CartItem[] = (await getCache<CartItem[]>(cartKey)) || [];
    if (items.length === 0) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    const updatedItems = items.filter((item) => item.product.id !== productId);

    if (updatedItems.length === items.length) {
      return NextResponse.json({ items });
    }

    if (updatedItems.length > 0) {
      await setCache(cartKey, updatedItems, CART_COOKIE_MAX_AGE);
    } else {
      await deleteCache(cartKey);
    }

    return NextResponse.json({ items: updatedItems });
  } catch (error) {
    console.error("Error deleting cart item:", error);

    if (await isUsingFallback()) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
