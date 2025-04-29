"use client";
import cartStyles from "./styles.module.css";
import React from "react";
import Button from "@/components/ui/Button";
import QuantityControl from "@/features/quantity-control/QuantityControl";
import { CartItem } from "@/types/cart";
import { useTranslations } from "next-intl";
import { CartItemsProps } from "./types";

export function CartItems({
  items,
  locale,
  onUpdateQuantity,
  onRemoveItem,
  showRemoveButton = true,
}: CartItemsProps) {
  const t = useTranslations("productList");

  if (items.length === 0) {
    return <div className={cartStyles.warning}>{t("cartEmpty")}</div>;
  }

  return (
    <ul className={cartStyles.cartList}>
      {items.map((item: CartItem) => {
        const { product, quantity } = item;
        const currencyString = product.currency[locale];
        const formattedPrice =
          locale === "fa"
            ? product.price[locale].toLocaleString("fa-IR")
            : product.price[locale];

        return (
          <React.Fragment key={product.id}>
            <li className={cartStyles.cartListItem}>
              <div className={cartStyles.itemContent}>
                <div className={cartStyles.itemInfo}>
                  <div className={cartStyles.itemTitle}>
                    {product.name[locale]}
                  </div>
                  <div className={cartStyles.itemPrice}>
                    {formattedPrice} {currencyString}
                  </div>
                </div>

                <div className={cartStyles.itemQuantityControl}>
                  <QuantityControl
                    value={quantity}
                    size="small"
                    min={1}
                    onIncrease={() =>
                      onUpdateQuantity(product.id, quantity + 1)
                    }
                    onDecrease={() =>
                      quantity > 1
                        ? onUpdateQuantity(product.id, quantity - 1)
                        : onRemoveItem(product.id)
                    }
                    onChange={(val) =>
                      val > 0
                        ? onUpdateQuantity(product.id, val)
                        : onRemoveItem(product.id)
                    }
                    inputId={`qty-${product.id}`}
                    inputClassName={cartStyles.quantityInput}
                    decreaseAriaLabel={`${t("decrease")} ${
                      product.name[locale]
                    }`}
                    increaseAriaLabel={`${t("increase")} ${
                      product.name[locale]
                    }`}
                    iconClassName="icon-accent"
                  />
                </div>

                {showRemoveButton && (
                  <Button
                    variant="link"
                    onClick={() => onRemoveItem(product.id)}
                    className={cartStyles.removeButton}
                    aria-label={`${t("remove")} ${product.name[locale]}`}
                  >
                    {t("remove")}
                  </Button>
                )}
              </div>
            </li>
          </React.Fragment>
        );
      })}
    </ul>
  );
}
