"use client";

import { useQuery } from "@tanstack/react-query";
import styles from "./ProductList.module.css";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { fetchProducts } from "@/services/productService";
import { useLocale, useTranslations } from "next-intl";
import { SupportedLocale } from "@/types/product";

export function ProductList() {
  const locale = useLocale();
  const t = useTranslations("ProductList");
  const {
    data: products,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async ({ queryKey }) => {
      const response = await fetchProducts({ search: queryKey[1] as string });
      return response.products;
    },
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  if (isError) {
    return (
      <div className={styles.error}>
        {t("error")}: {error.name}: {error.message}
      </div>
    );
  }

  if (isSuccess && (!products || products.length === 0)) {
    return (
      <div className={styles.warning}>
        <h2>{t("noProducts")}</h2>
        <p>{t("checkBackLater")}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {products?.map((product: Product) => (
          <div key={product.id} className={styles.gridItem}>
            <ProductCard product={product} locale={locale as SupportedLocale} />
          </div>
        ))}
      </div>
    </div>
  );
}
