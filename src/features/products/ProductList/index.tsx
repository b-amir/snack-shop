"use client";

import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { ProductCard } from "../ProductCard";
import { fetchProducts } from "@/services/productService";
import { useTranslations } from "next-intl";
import { SupportedLocale } from "@/types/product";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ProductControls } from "@/features/products/ProductControls";
import { Pagination } from "@/features/pagination/Pagination";
import type { ProductsResponse } from "@/services/productService";
import styles from "./styles.module.css";
import Skeleton from "@/components/common/Skeleton";

export function ProductList({ locale }: { locale: string }) {
  const t = useTranslations("ProductList");
  const {
    sort,
    pageSize,
    page,
    handleSortChange,
    handlePageSizeChange,
    handlePageChange,
  } = useProductFilters();

  const { data, isLoading, isError, isSuccess } = useQuery<
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
    return <Skeleton count={8} layout="grid" />;
  }

  if (isError) {
    return <div className={styles.error}>{t("errorFetchingProducts")}</div>;
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
