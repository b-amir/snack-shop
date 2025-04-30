import { Product, SupportedLocale } from "@/types/product";

export type ProductImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export type TranslationFunction = (key: string) => string;

export type ProductInfoProps = {
  product: Product;
  locale: SupportedLocale;
  formattedPrice: string;
  formattedDate: string;
  t: TranslationFunction;
  className?: string;
};

export type RelatedProductsSectionProps = {
  productId: string;
  locale: SupportedLocale;
  t: TranslationFunction;
};
