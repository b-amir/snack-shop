import productsData from "@/data/products.json";
import { Product } from "@/types/product";

// Helper: Normalize strings for search
// Consistent case and whitespace removal for reliable searching.
export function normalizeString(str: string) {
  return str.toLowerCase().trim();
}

// Preprocess products once at import time for efficient search
// Avoids repeated string normalization on every search request.
// Computes searchable fields upfront when the server starts.
export const preprocessedProducts = (productsData.products as Product[]).map(
  (product) => ({
    ...product,
    _search: {
      name_en: normalizeString(product.name.en),
      name_fa: normalizeString(product.name.fa),
      desc_en: normalizeString(product.description.en),
      desc_fa: normalizeString(product.description.fa),
    },
  })
);

export function filterProductsByQuery(
  products: typeof preprocessedProducts,
  query: string
) {
  if (!query) return products;

  const normalizedQuery = normalizeString(query);
  return products.filter(
    (product) =>
      product._search.name_en.includes(normalizedQuery) ||
      product._search.name_fa.includes(normalizedQuery) ||
      product._search.desc_en.includes(normalizedQuery) ||
      product._search.desc_fa.includes(normalizedQuery)
  );
}

export function sortProducts(
  products: typeof preprocessedProducts,
  sortOption: string
) {
  if (!sortOption) return products;

  const sortedProducts = [...products];

  switch (sortOption) {
    case "price_asc":
      return sortedProducts.sort((a, b) => a.price.en - b.price.en);
    case "price_desc":
      return sortedProducts.sort((a, b) => b.price.en - a.price.en);
    case "date_asc":
      return sortedProducts.sort(
        (a, b) =>
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
      );
    case "date_desc":
      return sortedProducts.sort(
        (a, b) =>
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      );
    default:
      return sortedProducts;
  }
}

export function paginateProducts(
  products: typeof preprocessedProducts,
  page: number,
  limit: number
) {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  return products.slice(startIndex, endIndex);
}

export function getPaginationMetadata(
  totalProducts: number,
  page: number,
  limit: number
) {
  return {
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    currentPage: page,
    limit,
  };
}
