import { NextRequest } from "next/server";
import { randomUUID } from "crypto";

const CART_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export function getSessionId(request: NextRequest): {
  sessionId: string;
  setCookieHeader?: { "Set-Cookie": string };
} {
  let sessionId = request.cookies.get("cartSessionId")?.value;
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
    let cookieString = `cartSessionId=${sessionId}; Path=${cookieOptions.path}; Max-Age=${cookieOptions.maxAge}; HttpOnly; SameSite=${cookieOptions.sameSite}`;
    if (cookieOptions.secure) {
      cookieString += "; Secure";
    }
    setCookieHeader = { "Set-Cookie": cookieString };
  }
  return { sessionId, setCookieHeader };
}

export function getCartKey(sessionId: string): string {
  return `cart:${sessionId}`;
}
