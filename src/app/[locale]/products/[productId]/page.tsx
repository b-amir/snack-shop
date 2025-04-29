import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SupportedLocale, Product } from "@/types/product";
import { ProductCard } from "@/features/products/ProductCard";
import detailStyles from "./page.module.css";
import sharedStyles from "@/features/products/ProductList/styles.module.css";
import {
  fetchRelatedProducts,
  fetchProductById,
} from "@/services/productService";
import { ProductQuantityActions } from "./components/ProductQuantityActions";
import { getTranslations } from "next-intl/server";
import { productByIdMap } from "@/utils/api/products/index";
import { locales } from "@/i18n/config";

const useCdn = process.env.NEXT_PUBLIC_USE_CLOUDINARY_CDN === "true";

export const revalidate = 3600;

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

export const dynamicParams = true;

async function getProductData(productId: string) {
  try {
    const productData = await fetchProductById(productId);
    if (!productData || !productData.product) {
      notFound();
    }
    return productData.product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    notFound();
  }
}

type Params = Promise<{ productId: string; locale: string }>;

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { productId, locale } = await params;

  if (!locales.includes(locale as SupportedLocale)) {
    notFound();
  }

  const product = await getProductData(productId);
  const t = await getTranslations("ProductDetail");
  const safeLocale = locale as SupportedLocale;
  const imageSrc = useCdn ? product.imageUrlCdn : product.imageUrlLocal;

  const relatedProducts = await fetchRelatedProducts({
    limit: 4,
    productId: product.id,
    locale: safeLocale,
  });

  const dateAdded = new Date(product.dateAdded);
  const formattedDate = dateAdded.toLocaleDateString(
    locale === "fa" ? "fa-IR" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const price =
    safeLocale === "fa"
      ? product.price[safeLocale].toLocaleString("fa-IR")
      : product.price[safeLocale];
  const currency = product.currency[safeLocale];

  return (
    <div className={detailStyles.container}>
      <div className={detailStyles.productGrid}>
        <div className={detailStyles.imageContainer}>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={product.name[safeLocale]}
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
        <div className={detailStyles.info}>
          <h1 className={detailStyles.title}>{product.name[safeLocale]}</h1>
          <div className={detailStyles.tags}>
            {product.tags[safeLocale].map((tag) => (
              <span key={tag} className={detailStyles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <p className={detailStyles.description}>
            {product.description[safeLocale]}
          </p>
          <div className={detailStyles.price}>
            {price} {currency}
          </div>
          <div className={detailStyles.date}>
            <span>{t("dateAdded")}</span>
            <span>{formattedDate}</span>
          </div>

          <ProductQuantityActions productId={product.id} product={product} />
        </div>
      </div>

      <div className={detailStyles.relatedSection}>
        <hr className={detailStyles.relatedSeparator} />
        <h2 className={detailStyles.relatedTitle}>{t("relatedProducts")}</h2>

        {relatedProducts.length === 0 ? (
          <p className={detailStyles.noRelatedProducts}>
            {t("noRelatedProducts")}
          </p>
        ) : (
          <div className={sharedStyles.grid}>
            {relatedProducts.map((related: Product) => (
              <div key={related.id} className={sharedStyles.gridItem}>
                <ProductCard product={related} locale={safeLocale} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
