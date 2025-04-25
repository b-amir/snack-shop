import { Product, SupportedLocale } from "@/types/product";
import { useTranslations } from "next-intl";
import styles from "./ProductList.module.css";

interface ProductCardProps {
  product: Product;
  locale: SupportedLocale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations("ProductList");
  const price =
    locale === "fa"
      ? product.price[locale].toLocaleString("fa-IR")
      : product.price[locale];
  const currency = product.currency[locale];
  return (
    <div className={styles.productCard}>
      <div className={styles.productImagePlaceholder}>
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="64" height="64" rx="12" fill="#e5e5e5" />
          <g opacity="0.5">
            <polygon points="16,48 28,32 40,48 48,40 56,48" fill="#cccccc" />
            <circle cx="24" cy="24" r="4" fill="#bdbdbd" />
          </g>
        </svg>
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
      <button className={styles.addToCartButton}>{t("addToCart")}</button>
    </div>
  );
}
