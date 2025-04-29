import { NextRequest } from "next/server";
import { randomUUID } from "crypto";
import {
  CART_COOKIE_MAX_AGE,
  CART_SESSION_COOKIE_NAME,
  CACHE_KEY_CART_PREFIX,
} from "@/constants";

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
