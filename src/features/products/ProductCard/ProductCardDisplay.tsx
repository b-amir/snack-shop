import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";
import Card from "@/components/ui/Card";
import { ProductCardDisplayProps } from "./types";
import { formatProductPrice } from "./utils";

const useCdn = process.env.NEXT_PUBLIC_USE_CLOUDINARY_CDN === "true";

export function ProductCardDisplay({
  product,
  locale,
  children,
}: ProductCardDisplayProps) {
  const formattedPrice = formatProductPrice(product, locale);

  const imageSrc = useCdn ? product.imageUrlCdn : product.imageUrlLocal;
  const placeholderImage = "/placeholder.jpg";

  return (
    <Card className={styles.productCard}>
      <Link
        href={`/${locale}/products/${product.id}`}
        className={styles.productCardLink}
      >
        <div className={styles.productImagePlaceholder}>
          <Image
            src={imageSrc || placeholderImage}
            alt={product.name[locale]}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 600px) 100vw, 200px"
          />
        </div>
        <div className={styles.productInfo}>
          <div className={styles.productTitle}>{product.name[locale]}</div>
          <div className={styles.productPrice}>{formattedPrice}</div>
          <div className={styles.productDescription}>
            {product.description[locale]}
          </div>
        </div>
      </Link>
      <div className={styles.cardActions}>{children}</div>
    </Card>
  );
}
