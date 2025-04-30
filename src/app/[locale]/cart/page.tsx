"use client";

import { useState } from "react";
import { useCartStore } from "@/store/store";
import { CartItems } from "@/features/cart/CartItems";
import { useTranslations, useLocale } from "next-intl";
import { SupportedLocale } from "@/types/product";
import { safeAdd, safeMultiply } from "@/utils/math";
import Button from "@/components/ui/Button";
import styles from "./page.module.css";
import Skeleton from "@/components/common/Skeleton";

export default function CartPage() {
  const t = useTranslations("productList");
  const tCommon = useTranslations("common");
  const { items, clearCart, updateQuantity, removeFromCart, isLoading } =
    useCartStore();
  const locale = useLocale() as SupportedLocale;
  const [isProcessing, setIsProcessing] = useState(false);

  const totalPrice = items.reduce(
    (acc, item) =>
      safeAdd(acc, safeMultiply(item.product.price[locale], item.quantity)),
    0
  );

  const formattedTotalPrice =
    locale === "fa"
      ? totalPrice.toLocaleString("fa-IR")
      : totalPrice.toLocaleString();

  const currencyString =
    items.length > 0 ? items[0].product.currency[locale] : "";

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    setIsProcessing(true);
    try {
      await updateQuantity(productId, quantity);
    } catch (error) {
      console.error("CartPage: Failed to update quantity", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    setIsProcessing(true);
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error("CartPage: Failed to remove item", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearCart = async () => {
    setIsProcessing(true);
    try {
      await clearCart();
    } catch (error) {
      console.error("CartPage: Failed to clear cart", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading && items.length === 0) {
    return <Skeleton layout="cartPage" />;
  }

  const isDisabled = isLoading || isProcessing;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.cartItemsSection}>
          <h1 className={styles.pageTitle}>{t("cart")}</h1>
          <CartItems
            items={items}
            locale={locale}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            showRemoveButton={true}
            disabled={isDisabled}
          />
        </div>
        {items.length > 0 ? (
          <div className={styles.cartSummary}>
            <h2 className={styles.summaryTitle}>{t("summary")}</h2>
            <hr />
            <div className={styles.totalRow}>
              <span className={styles.totalPrice}>
                {formattedTotalPrice} {currencyString}
              </span>
              <span>{t("total")}</span>
            </div>
            <Button
              variant="primary"
              size="large"
              fullWidth
              disabled={isDisabled || true}
            >
              {t("checkout")}
            </Button>
            <Button
              variant="secondary"
              size="large"
              fullWidth
              onClick={handleClearCart}
              className={styles.clearCartButton}
              disabled={isDisabled}
            >
              {isProcessing ? tCommon("loading") : t("clearCart")}
            </Button>
          </div>
        ) : (
          <div className={styles.emptyCartPlaceholder}></div>
        )}
      </div>
    </div>
  );
}
