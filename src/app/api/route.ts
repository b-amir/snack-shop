import { NextResponse } from "next/server";
import { isUsingFallback } from "@/utils/cache";

export async function GET() {
  const usingFallback = await isUsingFallback();

  return NextResponse.json({
    status: "ok",
    message: "API is running",
    caching: {
      enabled: true,
      type: usingFallback ? "in-memory (fallback)" : "redis",
    },
  });
}
