import { memoize, preprocessedProducts } from "./helpers";

// Memoized sorting for products based on price or date.
// Sorting is isolated for clarity and easy extension (e.g., adding new sort options).
export const sortProducts = memoize(
  (products: typeof preprocessedProducts, sortOption: string) => {
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
);
