import { Product } from "@/types/product";
import { ProductCard } from "@/features/products/ProductCard";
import { fetchProducts, ProductsResponse } from "@/services/productService";
import { ProductControls } from "@/features/products/ProductControls";
import { PaginationActions } from "@/components/common/Pagination/PaginationActions";
import styles from "./styles.module.css";
import { getTranslations } from "next-intl/server";
import { DEFAULT_PAGE_SIZE, DEFAULT_SORT_ORDER } from "@/constants";
import { ProductListProps } from "./types";

export async function ProductList({ locale, searchParams }: ProductListProps) {
  const t = await getTranslations("ProductList");

  const sort = String(searchParams?.sort || DEFAULT_SORT_ORDER);
  const page = parseInt(String(searchParams?.page || "1"), 10);
  const pageSize = parseInt(
    String(searchParams?.pageSize || DEFAULT_PAGE_SIZE),
    10
  );

  // fetching translations server-side
  // and passing them to the client-side component
  const controlTranslations = {
    sortBy: t("sortBy"),
    productsPerPage: t("productsPerPage"),
    sortNewest: t("sortNewest"),
    sortOldest: t("sortOldest"),
    sortPriceAsc: t("sortPriceAsc"),
    sortPriceDesc: t("sortPriceDesc"),
  };

  let data: ProductsResponse | null = null;
  let hasError = false;
  try {
    data = await fetchProducts({ sort, page, pageSize });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    hasError = true;
  }

  const products = data?.products;
  const paginationInfo = data?.pagination;

  if (hasError) {
    return <div className={styles.error}>{t("errorFetchingProducts")}</div>;
  }

  const controls = (
    <ProductControls
      initialSort={sort}
      initialPageSize={pageSize}
      translations={controlTranslations}
    />
  );

  if (!products || products.length === 0) {
    return (
      <div className={styles.container}>
        {controls}
        <div className={styles.warning}>
          <h2>{t("noProducts")}</h2>
          <p>{t("checkBackLater")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {controls}
      <div className={styles.grid}>
        {products.map((product: Product) => (
          <div key={product.id} className={styles.gridItem}>
            <ProductCard product={product} locale={locale} />
          </div>
        ))}
      </div>

      {paginationInfo && (
        <PaginationActions
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          locale={locale}
        />
      )}
    </div>
  );
}
