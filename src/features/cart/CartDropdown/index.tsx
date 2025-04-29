"use client";
import { useCartStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { SupportedLocale } from "@/types/product";
import { CartItems } from "@/features/cart/CartItems";
import { CartDropdownProps } from "./types";
import Button from "@/components/ui/Button";
import styles from "./styles.module.css";
import { safeAdd, safeMultiply } from "@/utils/math";

export function CartDropdown({ dir, locale, onClose }: CartDropdownProps) {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const t = useTranslations("productList");
  const router = useRouter();

  const currentLocale = locale as SupportedLocale;

  const totalPrice = items.reduce(
    (acc, item) =>
      safeAdd(
        acc,
        safeMultiply(item.product.price[currentLocale], item.quantity)
      ),
    0
  );

  const formattedTotalPrice =
    currentLocale === "fa" ? totalPrice.toLocaleString("fa-IR") : totalPrice;

  return (
    <div className={styles.cartDropdown + " " + styles[dir]}>
      <h3 className={styles.cartDropdownTitle}>{t("cart")}</h3>
      {items.length === 0 ? (
        <div className={styles.cartDropdownEmpty}>{t("cartEmpty")}</div>
      ) : (
        <CartItems
          items={items}
          locale={currentLocale}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          showRemoveButton={false}
        />
      )}
      {items.length > 0 && (
        <div className={styles.cartDropdownTotal}>
          <span>{t("total")}:</span>
          <span>
            {formattedTotalPrice} {t("currency")}
          </span>
        </div>
      )}
      <div className={styles.cartDropdownActions}>
        {items.length > 0 && (
          <Button
            variant="secondary"
            fullWidth
            onClick={clearCart}
            className={styles.clearCartButton}
            disabled={items.length === 0}
          >
            {t("clearCart")}
          </Button>
        )}
        <Button
          variant="primary"
          fullWidth
          onClick={() => {
            onClose();
            router.push(`/${locale}/cart`);
          }}
          className={styles.goToCartButton}
          disabled={items.length === 0}
        >
          {t("goToCart")}
        </Button>
      </div>
    </div>
  );
}
