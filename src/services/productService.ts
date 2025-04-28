import { Product } from "@/types/product";
import { getCache, setCache } from "@/utils/cache";

// Time-to-live (TTL) constants for Redis cache
const PRODUCT_LIST_TTL = 5 * 60; // 5 minutes
const PRODUCT_DETAIL_TTL = 30 * 60; // 30 minutes
const RELATED_PRODUCTS_TTL = 15 * 60; // 15 minutes

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
  sort,
}: FetchProductsParams = {}): Promise<ProductsResponse> {
  const cacheKey = `products:${search}:${page}:${limit || pageSize || 10}:${
    sort || ""
  }`;

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
  if (limit) {
    searchParams.append("limit", limit.toString());
  } else if (pageSize) {
    searchParams.append("pageSize", pageSize.toString());
  }
  if (sort) {
    searchParams.append("sort", sort);
  }

  const url = `${API_BASE_URL}/products?${searchParams.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch products from ${url}: ${response.status}`);
  }

  const data = (await response.json()) as ProductsResponse;
  await setCache(cacheKey, data, PRODUCT_LIST_TTL);

  return data;
}

export async function fetchProductById(
  id: string
): Promise<{ product: Product } | null> {
  const cacheKey = `product:${id}`;

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
    await setCache(cacheKey, data, PRODUCT_DETAIL_TTL);
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
  limit = 3,
}: {
  productId: string;
  locale: string;
  limit?: number;
}): Promise<Product[]> {
  const cacheKey = `related:${productId}:${locale}:${limit}`;

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
  await setCache(cacheKey, data, RELATED_PRODUCTS_TTL);

  return data;
}
