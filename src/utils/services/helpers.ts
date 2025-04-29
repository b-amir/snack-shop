import { getCache, setCache } from "@/utils/cache";
import { Product } from "@/types/product";

export const getBaseUrl = (): string => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const API_BASE_URL = `${getBaseUrl()}/api`;

export const buildApiUrl = (path: string, params?: URLSearchParams): string => {
  const url = `${API_BASE_URL}${path}`;
  return params ? `${url}?${params.toString()}` : url;
};

export const checkCache = async <T>(cacheKey: string): Promise<T | null> => {
  return getCache<T>(cacheKey);
};

export const fetchProductsAndCache = async <T>(
  url: string,
  cacheKey: string,
  ttl: number,
  context: string
): Promise<T> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `API error ${context}: ${response.status} ${response.statusText}`
      );
    }

    const data = (await response.json()) as T;
    setCache(cacheKey, data, ttl).catch((cacheError) => {
      console.error(
        `[productService:helper] Failed to set cache for ${context} (key: ${cacheKey}):`,
        cacheError
      );
    });
    return data;
  } catch (error) {
    console.error(
      `[productService:helper] Failed during ${context} from ${url}:`,
      error
    );
    throw error;
  }
};

export const fetchSingleProductAndCache = async (
  url: string,
  cacheKey: string,
  ttl: number
): Promise<{ product: Product } | null> => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(
        `API error fetching single product: ${response.status} ${response.statusText}`
      );
    }

    let data: { product: Product };
    try {
      data = (await response.json()) as { product: Product };
    } catch (parseError) {
      console.error(
        `[productService:helper] Failed to parse JSON response for single product from ${url}:`,
        parseError
      );
      throw new Error(
        `Failed to parse product data from ${url}: ${
          (parseError as Error).message
        }`
      );
    }

    if (!data || !data.product) {
      console.warn(
        `[productService:helper] API response for single product from ${url} is OK but missing product data.`
      );
      return null;
    }

    setCache(cacheKey, data, ttl).catch((cacheError) => {
      console.error(
        `[productService:helper] Failed to set cache for single product (key: ${cacheKey}):`,
        cacheError
      );
    });

    return data;
  } catch (error) {
    if (
      !(error instanceof Error && error.message.includes("API error")) &&
      !(error instanceof Error && error.message.includes("Failed to parse"))
    ) {
      console.error(
        `[productService:helper] Unexpected error fetching single product from ${url}:`,
        error
      );
    }
    throw error;
  }
};
