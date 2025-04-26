import { memoize, preprocessedProducts } from "./helpers";

// Memoized pagination for product lists.
// Slices the product array based on page and limit.
export const paginateProducts = memoize(
  (products: typeof preprocessedProducts, page: number, limit: number) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    return products.slice(startIndex, endIndex);
  }
);

// Memoized metadata for pagination controls (total pages, current page, etc.).
export const getPaginationMetadata = memoize(
  (totalProducts: number, page: number, limit: number) => {
    return {
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
      limit,
    };
  }
);
