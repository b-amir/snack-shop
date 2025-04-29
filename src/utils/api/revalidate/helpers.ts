import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { productByIdMap } from "@/utils/api/products/index";
import { locales } from "@/i18n/config";
import { RevalidateBody, ValidatedData } from "./types";

const REVALIDATE_SECRET =
  process.env.REVALIDATE_SECRET_TOKEN || "your-secret-token";

export async function validateAndGetData(
  request: NextRequest
): Promise<ValidatedData | NextResponse> {
  // 1. Validate Secret
  const secret = request.headers.get("x-revalidate-secret");
  if (secret !== REVALIDATE_SECRET) {
    console.warn("[Revalidate API] Secret validation failed!");
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  // 2. Parse Body
  let body: RevalidateBody;
  try {
    body = (await request.json()) as RevalidateBody;
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  // 3. Validate Body Content
  const { event, productId, changedLocales } = body;

  if (!event || !productId) {
    return NextResponse.json(
      { message: "Missing event type or productId" },
      { status: 400 }
    );
  }

  if (!productByIdMap.has(productId)) {
    console.warn(`[Revalidate API] Product ${productId} not found.`);
    return NextResponse.json(
      { message: `Product with ID ${productId} not found. Cannot revalidate.` },
      { status: 404 }
    );
  }

  const potentialLocales =
    Array.isArray(changedLocales) && changedLocales.length > 0
      ? changedLocales
      : locales;

  const localesToRevalidate = potentialLocales.filter((l): l is string =>
    locales.includes(l as (typeof locales)[number])
  );

  if (localesToRevalidate.length === 0) {
    console.warn(
      `[Revalidate API] No valid locales provided or derived for product ${productId}.`
    );
    return NextResponse.json(
      { message: "No valid locales found for revalidation" },
      { status: 400 }
    );
  }

  // 4. Return Validated Data
  return { event, productId, localesToRevalidate };
}

export function revalidateNextPaths(
  productId: string,
  localesToRevalidate: string[]
): void {
  console.log(
    `[Revalidate API] Triggering revalidatePath for ${localesToRevalidate.length} locales...`
  );
  for (const locale of localesToRevalidate) {
    const pdpPath = `/${locale}/products/${productId}`;
    const homePath = `/${locale}`;
    try {
      revalidatePath(pdpPath);
      revalidatePath(homePath);
    } catch (pathError) {
      console.error(
        `[Revalidate API] Error revalidating paths for locale ${locale}, product ${productId}:`,
        pathError
      );
    }
  }
}
