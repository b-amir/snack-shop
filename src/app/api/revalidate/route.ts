import {
  revalidateNextPaths,
  validateAndGetData,
} from "@/utils/api/revalidate/helpers";
import {
  invalidateProductCache,
  invalidateProductListingCache,
} from "@/utils/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 1. Validate Request & Get Data
  const validationResult = await validateAndGetData(request);

  if (validationResult instanceof NextResponse) {
    return validationResult;
  }

  const { event, productId, localesToRevalidate } = validationResult;
  console.log(
    `[Revalidate API] Request validated for product ${productId}, event: ${event}`
  );

  // 2. Perform Cache Invalidation & Path Revalidation
  try {
    await invalidateProductCache(productId);
    await invalidateProductListingCache();
    console.log(`[Revalidate API] Invalidated cache for ${productId}.`);
    revalidateNextPaths(productId, localesToRevalidate);

    // 3. Return Success Response
    return NextResponse.json({
      revalidated: true,
      message: `Revalidation successful for product ID: ${productId}`,
      timestamp: Date.now(),
    });
  } catch (err) {
    // 4. Handle Errors during revalidation/invalidation
    console.error(
      `[Revalidate API] Revalidation failed for product ${productId}:`,
      err
    );
    return NextResponse.json(
      { message: "Revalidation failed", error: (err as Error).message },
      { status: 500 }
    );
  }
}
