import { Product } from "@/types/product";
import { ProductCard } from "../ProductCard";
import { fetchProducts, ProductsResponse } from "@/services/productService";
import { SupportedLocale } from "@/types/product";
import { ProductControlsActions } from "@/features/products/ProductControls/ProductControlsActions";
import { PaginationActions } from "@/features/pagination/Pagination/PaginationActions";
import styles from "./styles.module.css";
import { getTranslations } from "next-intl/server";

interface ProductListProps {
  locale: SupportedLocale;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function ProductList({ locale, searchParams }: ProductListProps) {
  const t = await getTranslations("ProductList");

  const sort = String(searchParams?.sort || "date_desc");
  const page = parseInt(String(searchParams?.page || "1"), 10);
  const pageSize = parseInt(String(searchParams?.pageSize || "8"), 10);

  const controlTranslations = {
    sortBy: t("sortBy"),
    productsPerPage: t("productsPerPage"),
    sortNewest: t("sortNewest"),
    sortOldest: t("sortOldest"),
    sortPriceAsc: t("sortPriceAsc"),
    sortPriceDesc: t("sortPriceDesc"),
  };

  let data: ProductsResponse | null = null;
  let isError = false;
  try {
    data = await fetchProducts({ sort, page, pageSize });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    isError = true;
  }

  const products = data?.products;
  const paginationInfo = data?.pagination;

  if (isError) {
    return <div className={styles.error}>{t("errorFetchingProducts")}</div>;
  }

  const controls = (
    <ProductControlsActions
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
