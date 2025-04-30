"use client";
import { useState } from "react";
import { useCartStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { SupportedLocale } from "@/types/product";
import { CartItems } from "@/features/cart/CartItems";
import { CartDropdownProps } from "./types";
import { safeAdd, safeMultiply } from "@/utils/math";
import Button from "@/components/ui/Button";
import styles from "./styles.module.css";

export function CartDropdown({ dir, locale, onClose }: CartDropdownProps) {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const t = useTranslations("productList");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);

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
    currentLocale === "fa"
      ? totalPrice.toLocaleString("fa-IR")
      : totalPrice.toLocaleString();

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    setIsProcessing(true);
    try {
      await updateQuantity(productId, quantity);
    } catch (error) {
      console.error("CartDropdown: Failed to update quantity", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setIsProcessing(true);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("CartDropdown: Failed to remove item", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCart = async () => {
    setIsProcessing(true);
    try {
      await clearCart();
    } catch (error) {
      console.error("CartDropdown: Failed to clear cart", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const isDisabled = isProcessing;

  return (
    <div className={styles.cartDropdown + " " + styles[dir]}>
      <h3 className={styles.cartDropdownTitle}>{t("cart")}</h3>
      {items.length === 0 ? (
        <div className={styles.cartDropdownEmpty}>{t("cartEmpty")}</div>
      ) : (
        <CartItems
          items={items}
          locale={currentLocale}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          showRemoveButton={false}
          disabled={isDisabled}
        />
      )}
      {items.length > 0 && (
        <div className={styles.cartDropdownTotal}>
          <span>{t("total")}:</span>
          <span>
            {formattedTotalPrice} {tCommon("currency")}
          </span>
        </div>
      )}
      <div className={styles.cartDropdownActions}>
        {items.length > 0 && (
          <Button
            variant="secondary"
            fullWidth
            onClick={handleClearCart}
            className={styles.clearCartButton}
            disabled={isDisabled || items.length === 0}
          >
            {isProcessing ? tCommon("loading") : t("clearCart")}
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
          disabled={items.length === 0 || isDisabled}
        >
          {t("goToCart")}
        </Button>
      </div>
    </div>
  );
}
