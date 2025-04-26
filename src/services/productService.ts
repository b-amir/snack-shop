import { Product } from "@/types/product";

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

  const response = await fetch(`/api/products?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json();
}

export async function fetchProductById(
  id: string
): Promise<{ product: Product }> {
  const response = await fetch(`/api/products/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status}`);
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
  const response = await fetch(
    `/api/products/${productId}/related?${params.toString()}`
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch related products: ${response.status}`);
  }
  return response.json();
}
