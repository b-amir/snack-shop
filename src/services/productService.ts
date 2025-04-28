import { Product } from "@/types/product";
import redis from "@/utils/cache/redis";

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
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`CACHE HIT: ${cacheKey}`);
    return JSON.parse(cached);
  }
  console.log(`CACHE MISS: ${cacheKey}`);
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

  const data = await response.json();
  await redis.set(cacheKey, JSON.stringify(data), "EX", 300);
  return data;
}

export async function fetchProductById(
  id: string
): Promise<{ product: Product }> {
  const cacheKey = `product:${id}`;
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`CACHE HIT: ${cacheKey}`);
    return JSON.parse(cached);
  }
  console.log(`CACHE MISS: ${cacheKey}`);
  const url = `${API_BASE_URL}/products/${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch product from ${url}: ${response.status}`);
  }

  const data = await response.json();
  await redis.set(cacheKey, JSON.stringify(data), "EX", 1800);
  return data;
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
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`CACHE HIT: ${cacheKey}`);
    return JSON.parse(cached);
  }
  console.log(`CACHE MISS: ${cacheKey}`);
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
  const data = await response.json();
  await redis.set(cacheKey, JSON.stringify(data), "EX", 900);
  return data;
}

export async function invalidateProductCache(productId: string) {
  await redis.del(`product:${productId}`);
}
