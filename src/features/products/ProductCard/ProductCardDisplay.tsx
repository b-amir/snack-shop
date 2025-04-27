import { Product, SupportedLocale } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import styles from "./styles.module.css";
import Card from "@/components/ui/Card";

interface ProductCardDisplayProps {
  product: Product;
  locale: SupportedLocale;
  children?: React.ReactNode;
}

export function ProductCardDisplay({
  product,
  locale,
  children,
}: ProductCardDisplayProps) {
  const price =
    locale === "fa"
      ? product.price[locale].toLocaleString("fa-IR")
      : product.price[locale];
  const currency = product.currency[locale];

  return (
    <Card className={styles.productCard}>
      <Link
        href={`/${locale}/products/${product.id}`}
        className={styles.productCardLink}
      >
        <div className={styles.productImagePlaceholder}>
          <Image
            src={product.imageUrl || "/placeholder.jpg"}
            alt={product.name[locale]}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="(max-width: 600px) 100vw, 200px"
          />
        </div>
        <div className={styles.productInfo}>
          <div className={styles.productTitle}>{product.name[locale]}</div>
          <div className={styles.productPrice}>
            {locale === "fa" ? `${price} ${currency}` : `$${price} ${currency}`}
          </div>
          <div className={styles.productDescription}>
            {product.description[locale]}
          </div>
        </div>
      </Link>
      <div className={styles.cardActions}>{children}</div>
    </Card>
  );
}
