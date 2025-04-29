import { NextRequest, NextResponse } from "next/server";
import {
  getCart,
  saveCart,
  getSessionId,
  getCartKey,
  createErrorResponse,
  parseAndValidateAddBody,
  addItemToList,
} from "@/utils/api/cart";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 1. Get Session & Cart Key (Handles setting cookie header internally)
  const { sessionId, setCookieHeader } = getSessionId(request);
  const cartKey = getCartKey(sessionId);

  // 2. Parse and Validate Body
  const bodyResult = await parseAndValidateAddBody(request);
  if ("error" in bodyResult) {
    return bodyResult.error;
  }
  const { product, quantity } = bodyResult;

  // 3. Perform Cart Update
  try {
    const currentItems = await getCart(cartKey);
    const updatedItems = addItemToList(currentItems, product, quantity);
    await saveCart(cartKey, updatedItems);

    // 4. Return Success Response (with potential cookie header)
    const response = NextResponse.json({ items: updatedItems });
    if (setCookieHeader) {
      Object.entries(setCookieHeader).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
    }
    return response;
  } catch (error) {
    // 5. Handle Unexpected Errors
    console.error("[API Cart POST] Error adding item to cart:", error);
    return createErrorResponse("Internal Server Error adding item", 500);
  }
}
