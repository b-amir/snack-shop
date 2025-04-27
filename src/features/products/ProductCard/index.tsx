import { Product, SupportedLocale } from "@/types/product";
import { ProductCardDisplay } from "./ProductCardDisplay";
import { ProductCardActions } from "./ProductCardActions";

interface ProductCardProps {
  product: Product;
  locale: SupportedLocale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  return (
    <ProductCardDisplay product={product} locale={locale}>
      <ProductCardActions product={product} />
    </ProductCardDisplay>
  );
}
