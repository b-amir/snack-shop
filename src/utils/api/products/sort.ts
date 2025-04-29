import { Product, ProductSortOption } from "@/types/product";
import { memoize } from "./helpers";

type ProductComparator = (a: Product, b: Product) => number;

const comparators: Record<Exclude<ProductSortOption, "">, ProductComparator> = {
  price_asc: (a, b) => a.price.en - b.price.en,
  price_desc: (a, b) => b.price.en - a.price.en,
  date_asc: (a, b) =>
    new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime(),
  date_desc: (a, b) =>
    new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime(),
};

export const sortProducts = memoize(
  (
    products: readonly Product[],
    sortOption: ProductSortOption
  ): readonly Product[] => {
    const comparator =
      comparators[sortOption as Exclude<ProductSortOption, "">];

    if (!sortOption || !comparator) {
      return products;
    }

    return [...products].sort(comparator);
  }
);
