import { Product } from "@/types/product";
import { FetchProductsParams, ProductsResponse } from "./types";
import {
  PRODUCT_LIST_CACHE_TTL,
  PRODUCT_DETAIL_CACHE_TTL,
  RELATED_PRODUCTS_CACHE_TTL,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SORT_ORDER,
  CACHE_KEY_PRODUCT_LIST_PREFIX,
  CACHE_KEY_PRODUCT_DETAIL_PREFIX,
  CACHE_KEY_RELATED_PRODUCTS_PREFIX,
  RELATED_PRODUCTS_DEFAULT_LIMIT,
} from "@/constants";
import {
  buildApiUrl,
  checkCache,
  fetchProductsAndCache,
  fetchSingleProductAndCache,
} from "@/utils/services/helpers";

export async function fetchProducts({
  page = 1,
  limit,
  pageSize,
  sort = DEFAULT_SORT_ORDER,
}: FetchProductsParams = {}): Promise<ProductsResponse> {
  const effectivePageSize = limit || pageSize || DEFAULT_PAGE_SIZE;
  const cacheKey = `${CACHE_KEY_PRODUCT_LIST_PREFIX}${page}:${effectivePageSize}:${sort}`;

  const cachedData = await checkCache<ProductsResponse>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const searchParams = new URLSearchParams();
  searchParams.append("page", page.toString());
  searchParams.append("pageSize", String(effectivePageSize));
  if (sort) {
    searchParams.append("sort", sort);
  }

  const url = buildApiUrl("/products", searchParams);

  return fetchProductsAndCache<ProductsResponse>(
    url,
    cacheKey,
    PRODUCT_LIST_CACHE_TTL,
    "fetching product list"
  );
}

export async function fetchRelatedProducts({
  productId,
  locale,
  limit = RELATED_PRODUCTS_DEFAULT_LIMIT,
}: {
  productId: string;
  locale: string;
  limit?: number;
}): Promise<Product[]> {
  const cacheKey = `${CACHE_KEY_RELATED_PRODUCTS_PREFIX}${productId}:${locale}:${limit}`;

  const cachedData = await checkCache<Product[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const params = new URLSearchParams({
    locale,
    limit: limit.toString(),
  });
  const url = buildApiUrl(`/products/${productId}/related`, params);

  return fetchProductsAndCache<Product[]>(
    url,
    cacheKey,
    RELATED_PRODUCTS_CACHE_TTL,
    `fetching related products for ${productId}`
  );
}

export async function fetchProductById(
  id: string
): Promise<{ product: Product } | null> {
  if (!id) {
    console.warn("[productService] fetchProductById called with empty ID.");
    return null;
  }
  const cacheKey = `${CACHE_KEY_PRODUCT_DETAIL_PREFIX}${id}`;

  // Check cache first
  const cachedData = await checkCache<{ product: Product }>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const url = buildApiUrl(`/products/${id}`);

  // Delegate fetch, 404 handling, parsing, validation, and caching
  return fetchSingleProductAndCache(url, cacheKey, PRODUCT_DETAIL_CACHE_TTL);
}
