import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import {
  CART_COOKIE_MAX_AGE,
  CART_SESSION_COOKIE_NAME,
  CACHE_KEY_CART_PREFIX,
} from "@/constants";
import { deleteCache, getCache, setCache } from "@/utils/cache";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { AddItemBody } from "./types";

export function getSessionId(request: NextRequest): {
  sessionId: string;
  setCookieHeader?: { "Set-Cookie": string };
} {
  let sessionId = request.cookies.get(CART_SESSION_COOKIE_NAME)?.value;
  let setCookieHeader: { "Set-Cookie": string } | undefined = undefined;

  if (!sessionId) {
    sessionId = randomUUID();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: CART_COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax" as const,
    };
    let cookieString = `${CART_SESSION_COOKIE_NAME}=${sessionId}; Path=${cookieOptions.path}; Max-Age=${cookieOptions.maxAge}; HttpOnly; SameSite=${cookieOptions.sameSite}`;
    if (cookieOptions.secure) {
      cookieString += "; Secure";
    }
    setCookieHeader = { "Set-Cookie": cookieString };
  }
  return { sessionId, setCookieHeader };
}

export function getCartKey(sessionId: string): string {
  return `${CACHE_KEY_CART_PREFIX}${sessionId}`;
}

export async function validateCartRequest(
  request: NextRequest,
  paramsPromise: Promise<{ productId: string }>
) {
  const { sessionId } = getSessionId(request);
  if (!sessionId) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }
  const cartKey = getCartKey(sessionId);
  const { productId } = await paramsPromise;
  if (!productId) {
    return {
      error: NextResponse.json(
        { message: "Product ID missing" },
        { status: 400 }
      ),
    };
  }
  return { sessionId, cartKey, productId };
}

export async function getCart(cartKey: string): Promise<CartItem[]> {
  return (await getCache<CartItem[]>(cartKey)) || [];
}

export async function saveCart(
  cartKey: string,
  items: CartItem[]
): Promise<void> {
  if (items.length > 0) {
    await setCache(cartKey, items, CART_COOKIE_MAX_AGE);
  } else {
    await deleteCache(cartKey);
  }
}

export function createErrorResponse(
  message: string,
  status: number
): NextResponse {
  return NextResponse.json({ message }, { status });
}

export async function parseAndValidateAddBody(
  request: NextRequest
): Promise<{ product: Product; quantity: number } | { error: NextResponse }> {
  let body: AddItemBody;
  try {
    body = (await request.json()) as AddItemBody;
  } catch {
    return { error: createErrorResponse("Invalid JSON body", 400) };
  }

  const { product, quantity = 1 } = body;

  if (
    !product ||
    !product.id ||
    typeof quantity !== "number" ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    console.warn("[API Cart POST] Invalid product or quantity received.", {
      productId: product?.id,
      quantity,
    });
    return {
      error: createErrorResponse("Invalid product or quantity data", 400),
    };
  }

  return { product, quantity };
}

export function addItemToList(
  currentItems: CartItem[],
  productToAdd: Product,
  quantityToAdd: number
): CartItem[] {
  const existingItemIndex = currentItems.findIndex(
    (item) => item.product.id === productToAdd.id
  );

  if (existingItemIndex > -1) {
    return currentItems.map((item, index) =>
      index === existingItemIndex
        ? { ...item, quantity: item.quantity + quantityToAdd }
        : item
    );
  } else {
    return [
      ...currentItems,
      { product: productToAdd, quantity: quantityToAdd },
    ];
  }
}

export async function handleCartItemOperation(
  request: NextRequest,
  paramsPromise: Promise<{ productId: string }>,
  modifyCartCallback: (
    items: CartItem[],
    productId: string,
    request: NextRequest
  ) => Promise<{ updatedItems: CartItem[]; errorResponse?: NextResponse }>
): Promise<NextResponse> {
  const validation = await validateCartRequest(request, paramsPromise);
  if (validation.error) return validation.error;
  const { cartKey, productId } = validation;

  try {
    const currentItems = await getCart(cartKey);
    const { updatedItems, errorResponse } = await modifyCartCallback(
      currentItems,
      productId,
      request
    );

    if (errorResponse) {
      return errorResponse;
    }

    await saveCart(cartKey, updatedItems);

    return NextResponse.json({ items: updatedItems });
  } catch (error) {
    console.error(`[API Cart Item Ops /${productId}] Error:`, error);
    return createErrorResponse("Internal Server Error handling cart item", 500);
  }
}

export async function updateQuantityCallback(
  items: CartItem[],
  productId: string,
  request: NextRequest
): Promise<{ updatedItems: CartItem[]; errorResponse?: NextResponse }> {
  let quantity: number;
  try {
    const body = await request.json();
    quantity = body.quantity;
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity <= 0
    ) {
      throw new Error("Invalid quantity value");
    }
  } catch (parseError) {
    console.warn(
      `[API Cart PUT /${productId}] Invalid quantity received:`,
      parseError
    );
    return {
      updatedItems: items,
      errorResponse: createErrorResponse(
        "Invalid quantity format or value",
        400
      ),
    };
  }

  const itemIndex = items.findIndex((item) => item.product.id === productId);
  if (itemIndex === -1) {
    return {
      updatedItems: items,
      errorResponse: createErrorResponse("Item not found in cart", 404),
    };
  }

  const updatedItems = items.map((item, index) =>
    index === itemIndex ? { ...item, quantity: quantity } : item
  );

  return { updatedItems };
}

export async function deleteItemCallback(
  items: CartItem[],
  productId: string
): Promise<{ updatedItems: CartItem[]; errorResponse?: NextResponse }> {
  const updatedItems = items.filter((item) => item.product.id !== productId);
  return { updatedItems };
}
