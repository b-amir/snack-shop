import { Product } from "@/types/product";
import { getCache, setCache } from "@/utils/cache";
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

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

const API_BASE_URL = `${getBaseUrl()}/api`;

export interface ProductsResponse {
  products: Product[];
  pagination: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

interface FetchProductsParams {
  search?: string;
  page?: number;
  limit?: number;
  pageSize?: number;
  sort?: string;
}

export async function fetchProducts({
  search = "",
  page = 1,
  limit,
  pageSize,
  sort = DEFAULT_SORT_ORDER,
}: FetchProductsParams = {}): Promise<ProductsResponse> {
  const effectivePageSize = limit || pageSize || DEFAULT_PAGE_SIZE;
  const cacheKey = `${CACHE_KEY_PRODUCT_LIST_PREFIX}${search}:${page}:${effectivePageSize}:${sort}`;

  const cachedData = await getCache<ProductsResponse>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const searchParams = new URLSearchParams();

  if (search) {
    searchParams.append("search", search);
  }
  if (page) {
    searchParams.append("page", page.toString());
  }
  searchParams.append("pageSize", String(effectivePageSize));
  if (sort) {
    searchParams.append("sort", sort);
  }

  const url = `${API_BASE_URL}/products?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch products from ${url}: ${response.status}`);
  }

  const data = (await response.json()) as ProductsResponse;
  await setCache(cacheKey, data, PRODUCT_LIST_CACHE_TTL);

  return data;
}

export async function fetchProductById(
  id: string
): Promise<{ product: Product } | null> {
  const cacheKey = `${CACHE_KEY_PRODUCT_DETAIL_PREFIX}${id}`;

  const cachedData = await getCache<{ product: Product }>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const url = `${API_BASE_URL}/products/${id}`;
  let response: Response;
  try {
    response = await fetch(url);
  } catch (networkError) {
    console.error(`Network error fetching product ${id}:`, networkError);
    throw new Error(
      `Network error fetching product from ${url}: ${
        (networkError as Error).message
      }`
    );
  }

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(
      `API error fetching product from ${url}: ${response.status} ${response.statusText}`
    );
  }

  try {
    const data = (await response.json()) as { product: Product };
    if (!data || !data.product) {
      console.warn(`API response for ${url} is OK but missing product data.`);
      return null;
    }
    await setCache(cacheKey, data, PRODUCT_DETAIL_CACHE_TTL);
    return data;
  } catch (parseError) {
    console.error(`Failed to parse JSON response from ${url}:`, parseError);
    throw new Error(
      `Failed to parse product data from ${url}: ${
        (parseError as Error).message
      }`
    );
  }
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

  const cachedData = await getCache<Product[]>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const params = new URLSearchParams({
    locale,
    limit: limit.toString(),
  });
  const url = `${API_BASE_URL}/products/${productId}/related?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch related products from ${url}: ${response.status}`
    );
  }
  const data = (await response.json()) as Product[];
  await setCache(cacheKey, data, RELATED_PRODUCTS_CACHE_TTL);

  return data;
}
