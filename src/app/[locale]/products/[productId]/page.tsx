"use client";
import { productByIdMap } from "@/lib/api/products/index";
import { notFound } from "next/navigation";
import { SupportedLocale, Product } from "@/types/product";
import { useCartStore } from "@/store/store";
import { useState, use as usePromise } from "react";
import { ProductCard } from "@/components/products/ProductCard";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { fetchRelatedProducts } from "@/services/productService";
import Image from "next/image";
import detailStyles from "@/components/products/ProductDetail.module.css";
import styles from "@/components/products/ProductList.module.css";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; productId: string }>;
}) {
  const { locale, productId } = usePromise(params);
  const supportedLocales: SupportedLocale[] = ["en", "fa"];
  if (!supportedLocales.includes(locale as SupportedLocale)) {
    notFound();
  }
  const product = productByIdMap.get(productId);
  const safeLocale = locale as SupportedLocale;
  const addToCart = useCartStore((state) => state.addToCart);
  const [imgError, setImgError] = useState(false);

  const t = useTranslations("ProductDetail");

  const {
    data: relatedProducts = [],
    isLoading: isLoadingRelated,
    isError: isErrorRelated,
  } = useQuery<Product[], Error>({
    queryKey: ["relatedProducts", productId, safeLocale],
    queryFn: () =>
      fetchRelatedProducts({ productId, locale: safeLocale, limit: 3 }),
    enabled: !!productId && !!safeLocale,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (!product) {
    notFound();
  }

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
  const showImage = product.imageUrl && !imgError;

  return (
    <div className={detailStyles.container}>
      <div className={detailStyles.topSection}>
        {showImage && (
          <div className={detailStyles.imageWrapper}>
            <Image
              src={product.imageUrl}
              alt={product.name[safeLocale]}
              fill
              style={{ objectFit: "cover" }}
              onError={() => setImgError(true)}
            />
          </div>
        )}
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
            {safeLocale === "fa"
              ? `${price} ${currency}`
              : `$${price} ${currency}`}
          </div>
          <div className={detailStyles.date}>
            <span>{t("dateAdded")}</span>
            <span>{formattedDate}</span>
          </div>
          <button
            className={styles.addToCartButton}
            onClick={() => addToCart(product)}
          >
            {t("addToCart")}
          </button>
        </div>
      </div>
      <div className={detailStyles.relatedSection}>
        <h2 className={detailStyles.relatedTitle}>{t("relatedProducts")}</h2>
        {isLoadingRelated && <p>{t("loading")}</p>}
        {isErrorRelated && <p style={{ color: "red" }}>{t("relatedError")}</p>}
        {!isLoadingRelated &&
          !isErrorRelated &&
          relatedProducts.length === 0 && <p>{t("noRelatedProducts")}</p>}
        {!isLoadingRelated && !isErrorRelated && relatedProducts.length > 0 && (
          <div className={styles.relatedProductsGrid}>
            {relatedProducts.map((related: Product) => (
              <ProductCard
                key={related.id}
                product={related}
                locale={safeLocale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
