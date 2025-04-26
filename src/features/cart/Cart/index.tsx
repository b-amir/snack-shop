"use client";
import { useCartStore } from "@/store/store";
import cartStyles from "./styles.module.css";
import sharedStyles from "@/features/products/ProductList/styles.module.css";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import QuantityControl from "@/components/common/QuantityControl";

export function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const t = useTranslations("ProductList");

  if (items.length === 0) {
    return <div className={cartStyles.warning}>{t("cartEmpty")}</div>;
  }

  return (
    <div className={cartStyles.container}>
      <h2 className={cartStyles.cartTitle}>{t("cart")}</h2>
      <ul className={cartStyles.cartList}>
        {items.map(({ product, quantity }) => (
          <li
            key={product.id}
            className={sharedStyles.productCard + " " + cartStyles.cartListItem}
          >
            <div className={sharedStyles.productInfo}>
              <div className={sharedStyles.productTitle}>{product.name.en}</div>
              <div className={sharedStyles.productPrice}>
                ${product.price.en} {product.currency.en}
              </div>
              <div className={cartStyles.quantityRow}>
                <label htmlFor={`qty-${product.id}`}>{t("quantity")}:</label>
                <QuantityControl
                  value={quantity}
                  size="small"
                  min={1}
                  onIncrease={() => updateQuantity(product.id, quantity + 1)}
                  onDecrease={() =>
                    quantity > 1
                      ? updateQuantity(product.id, quantity - 1)
                      : removeFromCart(product.id)
                  }
                  onChange={(val) =>
                    val > 0
                      ? updateQuantity(product.id, val)
                      : removeFromCart(product.id)
                  }
                  inputClassName={cartStyles.quantityInput}
                  decreaseAriaLabel={
                    quantity === 1 ? t("remove") : t("decrease")
                  }
                  increaseAriaLabel={t("increase")}
                />
                <Button
                  variant="link"
                  onClick={() => removeFromCart(product.id)}
                  className={cartStyles.removeButton}
                >
                  {t("remove")}
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Button
        variant="secondary"
        size="large"
        fullWidth
        onClick={clearCart}
        className={cartStyles.clearCartButton}
      >
        {t("clearCart")}
      </Button>
    </div>
  );
}
