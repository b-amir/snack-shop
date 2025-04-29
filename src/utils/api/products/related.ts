import { memoize, productByIdMap } from "./helpers";
import { SupportedLocale } from "@/types/product";
import productsData from "@/data/products.json";

// Inverted index for tags per locale.
// Fast lookup of products by tag, efficient related product queries.
export const tagIndex: Record<SupportedLocale, Map<string, Set<string>>> = {
  en: new Map(),
  fa: new Map(),
};

// Populate the tag index at load time for O(1) tag-based lookups.
// This avoids repeated iteration over all products for every related query.
for (const product of productsData.products) {
  (Object.keys(tagIndex) as SupportedLocale[]).forEach((locale) => {
    for (const tag of product.tags[locale]) {
      if (!tagIndex[locale].has(tag)) tagIndex[locale].set(tag, new Set());
      tagIndex[locale].get(tag)!.add(product.id);
    }
  });
}

// tagIndex output example:
// {
//   en: Map {
//     "sweet" --> Set { "prod1", "prod3" },
//   },
//   fa: Map {
//     "شیرین" --> Set { "prod1", "prod3" },
//   }
// }

// Returns all related products based on shared tags (excluding the original product).
// Uses the tag index for efficient lookup and memoization for repeated queries.
export const getRelatedProducts = memoize(
  (productId: string, locale: SupportedLocale) => {
    const product = productByIdMap.get(productId);
    if (!product) return [];

    const tags = product.tags[locale];
    const relatedProductIds = new Set<string>();
    const localeTagIndex = tagIndex[locale];

    for (const tag of tags) {
      const ids = localeTagIndex.get(tag);
      if (ids) {
        ids.forEach((id) => relatedProductIds.add(id));
      }
    }

    relatedProductIds.delete(productId);

    const relatedProducts: (typeof productsData.products)[0][] = [];
    relatedProductIds.forEach((id) => {
      const relatedProduct = productByIdMap.get(id);
      if (relatedProduct) {
        relatedProducts.push(relatedProduct);
      }
    });

    return relatedProducts;
  }
);
