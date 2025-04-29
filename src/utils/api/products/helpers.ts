import productsData from "@/data/products.json";

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

// Map of product IDs to product objects for O(1) lookup by ID.
// Used for efficient access in related product and detail queries.
export const productByIdMap = new Map(
  productsData.products.map((product) => [product.id, product])
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
//       dateAdded: "...",
//       tags: { en: ["...", "..."], fa: ["...", "..."] },
//     },
//   ],
// ]);
