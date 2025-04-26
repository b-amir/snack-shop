import { memoize, normalizeString, preprocessedProducts } from "./helpers";

// Memoized search over products using preprocessed, normalized fields.
// faster, case-insensitive, and locale-aware search for both English and Farsi.
export const searchProducts = memoize(
  (products: typeof preprocessedProducts, query: string) => {
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
);
