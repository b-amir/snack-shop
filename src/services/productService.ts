import { Product } from "@/types/product";

interface ProductsResponse {
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
}

export async function fetchProducts({
  search = "",
  page = 1,
  limit = 10,
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
