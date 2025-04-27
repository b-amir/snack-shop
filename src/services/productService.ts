import { Product } from "@/types/product";

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

  return response.json();
}

export async function fetchProductById(
  id: string
): Promise<{ product: Product }> {
  const url = `${API_BASE_URL}/products/${id}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch product from ${url}: ${response.status}`);
  }

  return response.json();
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
  return response.json();
}
