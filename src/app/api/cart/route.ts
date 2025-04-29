import { NextRequest, NextResponse } from "next/server";
import { getCache, deleteCache, isUsingFallback } from "@/utils/cache";
import { CartItem } from "@/types/cart";
import { getSessionId, getCartKey } from "@/utils/api/cart";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { sessionId, setCookieHeader } = getSessionId(request);
    const cartKey = getCartKey(sessionId);

    const items: CartItem[] = (await getCache<CartItem[]>(cartKey)) || [];

    return new NextResponse(JSON.stringify({ items }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...(setCookieHeader && { ...setCookieHeader }),
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    if (await isUsingFallback()) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = request.cookies.get("cartSessionId")?.value;
    if (!sessionId) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }
    const cartKey = getCartKey(sessionId);

    await deleteCache(cartKey);

    return NextResponse.json({ message: "Cart cleared" }, { status: 200 });
  } catch (error) {
    console.error("Error clearing cart:", error);
    if (await isUsingFallback()) {
      return NextResponse.json({ message: "Cart cleared" }, { status: 200 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
