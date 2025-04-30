import React from "react";
import { ProductQuantityActions } from "@/features/quantity-control/ProductQuantityActions";
import detailStyles from "@/app/[locale]/products/[productId]/page.module.css"; // Adjust path if needed
import { ProductInfoProps } from "./types";

export function ProductInfo({
  product,
  locale,
  formattedPrice,
  formattedDate,
  t,
  className,
}: ProductInfoProps) {
  return (
    <div className={`${detailStyles.info} ${className || ""}`}>
      <h1 className={detailStyles.title}>{product.name[locale]}</h1>
      <div className={detailStyles.tags}>
        {product.tags[locale].map((tag) => (
          <span key={tag} className={detailStyles.tag}>
            {tag}
          </span>
        ))}
      </div>
      <p className={detailStyles.description}>{product.description[locale]}</p>
      <div className={detailStyles.price}>{formattedPrice}</div>
      <div className={detailStyles.date}>
        <span>{t("dateAdded")}</span>
        <span>{formattedDate}</span>
      </div>
      <ProductQuantityActions productId={product.id} product={product} />
    </div>
  );
}
