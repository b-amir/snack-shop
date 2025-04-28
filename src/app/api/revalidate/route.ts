import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  invalidateProductCache,
  invalidateProductListingCache,
} from "@/utils/cache";
import { getCacheState } from "@/utils/cache/cacheClientInstance";
import { Redis } from "ioredis";
import { productByIdMap } from "@/utils/api/products/index";

export const dynamic = "force-dynamic";

const REVALIDATE_SECRET =
  process.env.REVALIDATE_SECRET_TOKEN || "some-secure-value";

async function clearRedisKeysByPattern(pattern: string) {
  const { client } = await getCacheState();

  if (client instanceof Redis) {
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (error) {
      console.error(`Error clearing Redis keys for pattern ${pattern}:`, error);
    }
  }
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");
  const body = await request.json();
  const { event, productId, changedLocales } = body;

  if (secret !== REVALIDATE_SECRET) {
    console.log("[Cache] Secret validation failed!");
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  if (!event || !productId) {
    return NextResponse.json(
      { message: "Missing event type or productId" },
      { status: 400 }
    );
  }

  const productExists = productByIdMap.has(productId);
  if (!productExists) {
    console.log(
      `[Cache] Revalidation attempt failed: Product ${productId} not found.`
    );
    return NextResponse.json(
      { message: `Product with ID ${productId} not found. Cannot revalidate.` },
      { status: 404 }
    );
  }

  const localesToRevalidate =
    Array.isArray(changedLocales) && changedLocales.length > 0
      ? changedLocales
      : ["en", "fa"];

  console.log(
    `[Cache] Revalidation triggered for product ${productId}, event: ${event}`
  );

  try {
    await invalidateProductCache(productId);

    await invalidateProductListingCache();

    await clearRedisKeysByPattern(`related:${productId}:*`);

    for (const locale of localesToRevalidate) {
      const pdpPath = `/${locale}/products/${productId}`;
      const homePath = `/${locale}`;
      revalidatePath(pdpPath);
      revalidatePath(homePath);
      console.log(
        `[Cache] Triggered revalidatePath for: ${pdpPath} and ${homePath}`
      );
    }

    return NextResponse.json({
      revalidated: true,
      message: `Cache revalidated successfully for product ID: ${productId}`,
      product: productId,
      timestamp: Date.now(),
    });
  } catch (err) {
    console.error(`[Cache] Revalidation failed for product ${productId}:`, err);
    return NextResponse.json(
      { message: "[Cache] Revalidation failed", error: (err as Error).message },
      { status: 500 }
    );
  }
}
