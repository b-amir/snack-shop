import { Product, SupportedLocale } from "@/types/product";
import { useTranslations } from "next-intl";
import styles from "./ProductList.module.css";
import { useCartStore } from "@/store/store";
import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  locale: SupportedLocale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations("ProductList");
  const addToCart = useCartStore((state) => state.addToCart);
  const [imgError, setImgError] = useState(false);
  const price =
    locale === "fa"
      ? product.price[locale].toLocaleString("fa-IR")
      : product.price[locale];
  const currency = product.currency[locale];
  const showImage = product.imageUrl && !imgError;
  return (
    <div className={styles.productCard}>
      {showImage ? (
        <div className={styles.productImagePlaceholder}>
          <Image
            src={product.imageUrl}
            alt={product.name[locale]}
            fill
            style={{ objectFit: "cover" }}
            priority
            sizes="(max-width: 600px) 100vw, 200px"
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        <div className={styles.productImagePlaceholder}>
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 3C4.23858 3 2 5.23858 2 8V16C2 18.7614 4.23858 21 7 21H17C19.7614 21 22 18.7614 22 16V8C22 5.23858 19.7614 3 17 3H7Z"
              fill="#e5e5e5"
            />
            <path
              d="M19.8918 16.8014L17.8945 14.2809C16.9457 13.0835 15.2487 12.7904 13.9532 13.6001L13.1168 14.1228C12.6581 14.4095 12.0547 14.2795 11.7547 13.8295L10.3177 11.6741C9.20539 10.0056 6.80071 9.8771 5.51693 11.4176L4 13.238V16C4 17.6569 5.34315 19 7 19H17C18.3793 19 19.5412 18.0691 19.8918 16.8014Z"
              fill="#bdbdbd"
            />
            <path
              d="M16 11C17.1046 11 18 10.1046 18 9C18 7.89543 17.1046 7 16 7C14.8954 7 14 7.89543 14 9C14 10.1046 14.8954 11 16 11Z"
              fill="#929292"
            />
          </svg>
        </div>
      )}
      <div className={styles.productInfo}>
        <div className={styles.productTitle}>{product.name[locale]}</div>
        <div className={styles.productPrice}>
          {locale === "fa" ? `${price} ${currency}` : `$${price} ${currency}`}
        </div>
        <div className={styles.productDescription}>
          {product.description[locale]}
        </div>
      </div>
      <button
        className={styles.addToCartButton}
        onClick={() => addToCart(product)}
      >
        {t("addToCart")}
      </button>
    </div>
  );
}
