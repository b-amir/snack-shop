export type SupportedLocale = "en" | "fa";

export interface Product {
  id: string;
  name: Record<SupportedLocale, string>;
  price: Record<SupportedLocale, number>;
  currency: Record<SupportedLocale, string>;
  imageUrlLocal: string;
  imageUrlCdn: string;
  description: Record<SupportedLocale, string>;
  dateAdded: string;
  tags: Record<SupportedLocale, string[]>;
}

export type ProductSortOption =
  | "price_asc"
  | "price_desc"
  | "date_asc"
  | "date_desc"
  | "";
