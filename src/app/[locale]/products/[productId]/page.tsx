import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SupportedLocale } from "@/types/product";
import { getTranslations } from "next-intl/server";
import { productByIdMap } from "@/utils/api/products/index";
import { locales } from "@/i18n/config";
import {
  ProductImage,
  ProductInfo,
  RelatedProductsSection,
} from "@/features/product/ProductDetail";
import detailStyles from "./page.module.css";
import { formatProductDisplayData } from "@/utils/formatProductDisplayData";
import { BackIcon } from "@/features/product/ProductDetail/icon";
import { getDirection } from "@/utils/direction";

export const revalidate = 3600;
export const dynamicParams = true;

type Params = Promise<{
  productId: string;
  locale: string;
}>;

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { locale, productId } = await params;

  if (!locales.includes(locale as SupportedLocale)) {
    notFound();
  }

  const product = productByIdMap.get(productId);
  if (!product) {
    console.warn(`ProductDetailPage: Product not found for ID: ${productId}`);
    notFound();
  }

  const tProductDetail = await getTranslations("productDetail");
  const tCommon = await getTranslations("common");
  const safeLocale = locale as SupportedLocale;
  const dir = getDirection(safeLocale);

  const { formattedDate, formattedPrice, imageSrc } = formatProductDisplayData(
    product,
    safeLocale
  );

  return (
    <>
      <div className={detailStyles.backLinkContainer}>
        <Link href={`/${locale}`} className={detailStyles.backLink} dir={dir}>
          <BackIcon className={detailStyles.backIcon} />
          {tCommon("backHome")}
        </Link>
      </div>{" "}
      <div className={detailStyles.container}>
        <div className={detailStyles.productGrid}>
          {imageSrc && (
            <ProductImage src={imageSrc} alt={product.name[safeLocale]} />
          )}
          <ProductInfo
            product={product}
            locale={safeLocale}
            formattedPrice={formattedPrice}
            formattedDate={formattedDate}
            t={tProductDetail}
          />
        </div>
        <RelatedProductsSection
          productId={productId}
          locale={safeLocale}
          t={tProductDetail}
        />
      </div>
    </>
  );
}

export async function generateStaticParams() {
  const allProducts = Array.from(productByIdMap.values());
  allProducts.sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );
  const newestProductIds = allProducts.slice(0, 8).map((p) => p.id);
  if (newestProductIds.length === 0) {
    console.warn("generateStaticParams: No products found to pre-render.");
    return [];
  }
  const params = newestProductIds.flatMap((productId) =>
    locales.map((locale) => ({ locale, productId }))
  );
  return params;
}
