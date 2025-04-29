import React from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/features/product/ProductCard";
import detailStyles from "@/app/[locale]/products/[productId]/page.module.css";
import sharedStyles from "@/features/products/ProductList/styles.module.css";
import { fetchRelatedProducts } from "@/services/productService";
import { RelatedProductsSectionProps } from "./types";

export async function RelatedProductsSection({
  productId,
  locale,
  t,
}: RelatedProductsSectionProps) {
  let relatedProducts: Product[] = [];
  try {
    relatedProducts = await fetchRelatedProducts({
      limit: 4,
      productId,
      locale,
    });
  } catch (error) {
    console.error(`Error fetching related products for ${productId}:`, error);
  }

  return (
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
              <ProductCard product={related} locale={locale} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
