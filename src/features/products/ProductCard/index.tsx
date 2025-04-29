import { ProductCardDisplay } from "./ProductCardDisplay";
import { ProductCardActions } from "./ProductCardActions";
import { ProductCardProps } from "./types";

export function ProductCard({ product, locale }: ProductCardProps) {
  return (
    <ProductCardDisplay product={product} locale={locale}>
      <ProductCardActions product={product} />
    </ProductCardDisplay>
  );
}
