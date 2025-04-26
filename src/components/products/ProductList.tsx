"use client";

import { useQuery } from "@tanstack/react-query";
import styles from "./ProductList.module.css";
import { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { fetchProducts } from "@/services/productService";
import { useLocale, useTranslations } from "next-intl";
import { SupportedLocale } from "@/types/product";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ProductControls } from "@/components/controls/ProductControls";
import { Pagination } from "@/components/pagination/Pagination";
import type { ProductsResponse } from "@/services/productService";

export function ProductList() {
  const locale = useLocale();
  const t = useTranslations("ProductList");
  const {
    sort,
    pageSize,
    page,
    handleSortChange,
    handlePageSizeChange,
    handlePageChange,
  } = useProductFilters();

  const { data, isLoading, isError, isSuccess, error } = useQuery<
    ProductsResponse,
    Error
  >({
    queryKey: ["products", { sort, pageSize, page }],
    queryFn: async () => {
      return fetchProducts({ sort, pageSize, page });
    },
    refetchOnWindowFocus: false,
  });

  const products = data?.products;
  const paginationInfo = data?.pagination;

  const handlePageChangeWithTotal = (newPage: number) => {
    if (newPage >= 1 && newPage <= (paginationInfo?.totalPages || 1)) {
      handlePageChange(newPage);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>{t("loading")}</div>;
  }

  if (isError) {
    return (
      <div className={styles.error}>
        {t("error")}: {error.message}
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
      <ProductControls
        sort={sort}
        pageSize={pageSize}
        onSortChange={handleSortChange}
        onPageSizeChange={handlePageSizeChange}
      />
      <div className={styles.grid}>
        {products?.map((product: Product) => (
          <div key={product.id} className={styles.gridItem}>
            <ProductCard product={product} locale={locale as SupportedLocale} />
          </div>
        ))}
      </div>
      {paginationInfo && (
        <Pagination
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={handlePageChangeWithTotal}
          locale={locale}
        />
      )}
    </div>
  );
}
