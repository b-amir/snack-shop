export type SupportedLocale = "en" | "fa";

export interface Product {
  id: string;
  name: Record<SupportedLocale, string>;
  price: Record<SupportedLocale, number>;
  currency: Record<SupportedLocale, string>;
  imageUrl: string;
  description: Record<SupportedLocale, string>;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
