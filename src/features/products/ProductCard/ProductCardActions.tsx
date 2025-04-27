"use client";

import { Product } from "@/types/product";
import { useCartStore } from "@/store/store";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import QuantityControl from "@/components/common/QuantityControl";

interface ProductCardActionsProps {
  product: Product;
}

export function ProductCardActions({ product }: ProductCardActionsProps) {
  const t = useTranslations("ProductList");
  const addToCart = useCartStore((state) => state.addToCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const cartQuantity = useCartStore(
    (state) =>
      state.items.find((item) => item.product.id === product.id)?.quantity || 0
  );

  const handleDecrease = () => {
    if (cartQuantity > 1) {
      updateQuantity(product.id, cartQuantity - 1);
    } else {
      removeFromCart(product.id);
    }
  };

  const handleChange = (val: number) => {
    if (val > 0) {
      updateQuantity(product.id, val);
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <>
      {cartQuantity > 0 ? (
        <QuantityControl
          value={cartQuantity}
          fullWidth
          min={1}
          onIncrease={() => updateQuantity(product.id, cartQuantity + 1)}
          onDecrease={handleDecrease}
          onChange={handleChange}
          variant="button"
        />
      ) : (
        <Button
          variant="primary"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          {t("addToCart")}
        </Button>
      )}
    </>
  );
}
