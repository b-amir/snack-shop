"use client";

import { useCartStore } from "@/store/store";
import { Product } from "@/types/product";
import Button from "@/components/ui/Button";
import QuantityControl from "@/components/common/QuantityControl";
import { useTranslations } from "next-intl";

interface ProductQuantityActionsProps {
  productId: string;
  product: Product;
}

export function ProductQuantityActions({
  productId,
  product,
}: ProductQuantityActionsProps) {
  const t = useTranslations("ProductDetail");
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const cartQuantity = useCartStore(
    (state) =>
      state.items.find((item) => item.product.id === productId)?.quantity || 0
  );

  const buttonLabel = t("addToCart");

  if (cartQuantity > 0) {
    return (
      <QuantityControl
        value={cartQuantity}
        min={1}
        onIncrease={() => updateQuantity(productId, cartQuantity + 1)}
        onDecrease={() =>
          cartQuantity > 1
            ? updateQuantity(productId, cartQuantity - 1)
            : removeFromCart(productId)
        }
        onChange={(val) =>
          val > 0 ? updateQuantity(productId, val) : removeFromCart(productId)
        }
        variant="button"
        size="large"
        iconClassName="icon-green"
      />
    );
  }

  return (
    <Button variant="primary" size="large" onClick={() => addToCart(product)}>
      {buttonLabel}
    </Button>
  );
}
