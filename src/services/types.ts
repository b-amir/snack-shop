import { Product } from "@/types/product";

export type ProductsResponse = {
  products: Product[];
  pagination: {
    totalProducts: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
};

export type FetchProductsParams = {
  page?: number;
  limit?: number;
  pageSize?: number;
  sort?: string;
};
