"use client";
import { productByIdMap } from "@/utils/api/products/index";
import { notFound } from "next/navigation";
import { SupportedLocale, Product } from "@/types/product";
import { useCartStore } from "@/store/store";
import { useState, use as usePromise } from "react";
import { ProductCard } from "@/features/products/ProductCard";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { fetchRelatedProducts } from "@/services/productService";
import Image from "next/image";
import detailStyles from "./page.module.css";
import sharedStyles from "@/features/products/ProductList/styles.module.css";
import Button from "@/components/ui/Button";
import QuantityControl from "@/components/common/QuantityControl";
import Skeleton from "@/components/common/Skeleton";

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

  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const cartQuantity = useCartStore(
    (state) =>
      state.items.find((item) => item.product.id === product.id)?.quantity || 0
  );

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
          {cartQuantity > 0 ? (
            <QuantityControl
              value={cartQuantity}
              min={1}
              onIncrease={() => updateQuantity(product.id, cartQuantity + 1)}
              onDecrease={() =>
                cartQuantity > 1
                  ? updateQuantity(product.id, cartQuantity - 1)
                  : removeFromCart(product.id)
              }
              onChange={(val) =>
                val > 0
                  ? updateQuantity(product.id, val)
                  : removeFromCart(product.id)
              }
              variant="button"
              size="large"
            />
          ) : (
            <Button
              variant="primary"
              size="large"
              onClick={() => addToCart(product)}
            >
              {t("addToCart")}
            </Button>
          )}
        </div>
      </div>
      <div className={detailStyles.relatedSection}>
        <h2 className={detailStyles.relatedTitle}>{t("relatedProducts")}</h2>
        {isLoadingRelated && (
          <div className={detailStyles.loading}>
            <Skeleton count={3} layout="related" />
          </div>
        )}
        {isErrorRelated && (
          <p className={detailStyles.relatedError}>{t("relatedError")}</p>
        )}
        {!isLoadingRelated &&
          !isErrorRelated &&
          relatedProducts.length === 0 && (
            <p className={detailStyles.noRelatedProducts}>
              {t("noRelatedProducts")}
            </p>
          )}
        {!isLoadingRelated && !isErrorRelated && relatedProducts.length > 0 && (
          <div className={sharedStyles.relatedProductsGrid}>
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
