"use client";

import { useCartStore } from "@/store/store";
import { CartItems } from "@/features/cart/CartItems";
import Button from "@/components/ui/Button";
import { useTranslations, useLocale } from "next-intl";
import styles from "./page.module.css";
import { SupportedLocale } from "@/types/product";
import Skeleton from "@/components/common/Skeleton";
import { safeAdd, safeMultiply } from "@/utils/math";

export default function CartPage() {
  const t = useTranslations("productList");
  const { items, clearCart, updateQuantity, removeFromCart, isLoading } =
    useCartStore();
  const locale = useLocale() as SupportedLocale;
  const totalPrice = items.reduce(
    (acc, item) =>
      safeAdd(acc, safeMultiply(item.product.price[locale], item.quantity)),
    0
  );

  const formattedTotalPrice =
    locale === "fa" ? totalPrice.toLocaleString("fa-IR") : totalPrice;

  const currencyString =
    items.length > 0 ? items[0].product.currency[locale] : "";

  if (isLoading) {
    return <Skeleton layout="cartPage" />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
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
            <Button variant="primary" size="large" fullWidth disabled>
              {t("checkout")}
            </Button>
            <Button
              variant="secondary"
              size="large"
              fullWidth
              onClick={clearCart}
              className={styles.clearCartButton}
            >
              {t("clearCart")}
            </Button>
          </div>
        ) : (
          <div style={{ flex: 1 }}></div>
        )}

        <div className={styles.cartItemsSection}>
          <h1 className={styles.pageTitle}>{t("cart")}</h1>
          <CartItems
            items={items}
            locale={locale}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            showRemoveButton={true}
          />
        </div>
      </div>
    </div>
  );
}
