import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="product-card">
      <h2>{product.name.en}</h2>
      <p>{product.description.en}</p>
      <p>${product.price}</p>
      <button>Add to Cart</button>
    </div>
  );
}
