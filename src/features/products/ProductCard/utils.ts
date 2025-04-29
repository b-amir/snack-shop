import { Product, SupportedLocale } from "@/types/product";

export function formatProductPrice(
  product: Product,
  locale: SupportedLocale
): string {
  const price = product.price[locale];
  const currency = product.currency[locale];

  if (locale === "fa") {
    return `${price.toLocaleString("fa-IR")} ${currency}`;
  }
  return `$${price.toLocaleString("en-US")} ${currency}`;
}
