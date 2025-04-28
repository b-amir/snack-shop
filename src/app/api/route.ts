import { NextResponse } from "next/server";
import { isUsingFallback } from "@/utils/cache";
import "./_init";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "API is running",
    caching: {
      enabled: true,
      type: isUsingFallback() ? "in-memory (fallback)" : "redis",
    },
  });
}
