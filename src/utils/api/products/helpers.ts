import productsData from "@/data/products.json";
import { Product } from "@/types/product";

// Memoization utility to cache function results based on arguments.
// Used to optimize expensive or frequently repeated operations (e.g., search, sort, pagination).
export function memoize<Args extends unknown[], Result>(
  fn: (...args: Args) => Result
): (...args: Args) => Result {
  const cache = new Map<string, Result>();

  return (...args: Args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// String normalization helper for search and comparison.
// Ensures case-insensitive, whitespace-trimmed matching for robust search and indexing.
export function normalizeString(str: string) {
  return str.toLowerCase().trim();
}

// Preprocess all products at load time to add normalized search fields.
// This avoids repeated normalization on every search and enables fast, consistent lookups.
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

// preprocessedProducts output example:
// [
//   {
//     "id": "p1",
//     "name": { "en": "...", "fa": "..." },
//     "price": { "en": 00, "fa": 000 },
//     "currency": { "en": "...", "fa": "..." },
//     "imageUrl": "...",
//     "description": { "en": "...", "fa": "..." },
//     "category": "...",
//     "dateAdded": "...",
//     "tags": { "en": [ "...", "..." ], "fa": [ "...", "..." ] },
//     "_search": {
//         "name_en": "...",
//         "name_fa": "...",
//         "desc_en": "...",
//         "desc_fa": "..."
//     }
//   },
//   ...
// ]

// Map of product IDs to product objects for O(1) lookup by ID.
// Used for efficient access in related product and detail queries.
export const productByIdMap = new Map(
  preprocessedProducts.map((product) => [product.id, product])
);

// productByIdMap output example:
// Map([
//   [
//     "p1",
//     {
//       id: "p1",
//       name: { en: "...", fa: "..." },
//       price: { en: 00, fa: 000 },
//       currency: { en: "...", fa: "..." },
//       imageUrl: "...",
//       description: { en: "...", fa: "..." },
//       category: "...",
//       dateAdded: "...",
//       tags: { en: ["...", "..."], fa: ["...", "..."] },
//       _search: {
//         name_en: "...",
//         name_fa: "...",
//         desc_en: "...",
//         desc_fa: "...",
//       },
//     },
//   ],
// ]);
