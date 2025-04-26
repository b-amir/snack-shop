"use client";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LocaleNumber from "@/components/ui/LocaleNumber";
import styles from "./styles.module.css";
import Button from "@/components/ui/Button";
import QuantityControl from "@/components/common/QuantityControl";

export function CartIconButton({ dir }: { dir: "ltr" | "rtl" }) {
  const [open, setOpen] = useState(false);
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const t = useTranslations("ProductList");
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const itemCount = items.length;

  return (
    <div ref={ref} className={styles.cartIconButtonWrapper} dir={dir}>
      <Button
        variant="link"
        size="small"
        className={styles.cartIconButton}
        aria-label={t("cart")}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.41442 6H3.75V4.5H6.58558L7.33558 7.5H18.935L17.2321 15.1627L16.5 15.75H8.25L7.51786 15.1627L6.02 8.42233L5.41442 6ZM7.68496 9L8.85163 14.25H15.8984L17.065 9H7.68496ZM10.5 18C10.5 18.8284 9.82843 19.5 9 19.5C8.17157 19.5 7.5 18.8284 7.5 18C7.5 17.1716 8.17157 16.5 9 16.5C9.82843 16.5 10.5 17.1716 10.5 18ZM15 19.5C15.8284 19.5 16.5 18.8284 16.5 18C16.5 17.1716 15.8284 16.5 15 16.5C14.1716 16.5 13.5 17.1716 13.5 18C13.5 18.8284 14.1716 19.5 15 19.5Z"
            fill="#b400ae"
          />
        </svg>
        {itemCount > 0 && (
          <span className={styles.cartBadge}>
            <LocaleNumber>{itemCount}</LocaleNumber>
          </span>
        )}
      </Button>
      {open && (
        <div className={styles.cartDropdown + " " + styles[dir]}>
          <h3 className={styles.cartDropdownTitle}>{t("cart")}</h3>
          {items.length === 0 ? (
            <div className={styles.cartDropdownEmpty}>{t("cartEmpty")}</div>
          ) : (
            <ul className={styles.cartDropdownList}>
              {items.map(({ product, quantity }) => (
                <li key={product.id} className={styles.cartDropdownListItem}>
                  <span className={styles.cartDropdownProductName}>
                    {
                      product.name[
                        typeof window !== "undefined" &&
                        document?.documentElement?.lang === "fa"
                          ? "fa"
                          : "en"
                      ]
                    }
                  </span>
                  <div className={styles.quantityControl}>
                    <QuantityControl
                      value={quantity}
                      min={1}
                      size="small"
                      onIncrease={() =>
                        updateQuantity(product.id, quantity + 1)
                      }
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
                      inputClassName={styles.quantityValue}
                      decreaseAriaLabel={
                        quantity === 1 ? t("remove") : t("decrease")
                      }
                      increaseAriaLabel={t("increase")}
                    />
                  </div>
                </li>
              ))}
            </ul>
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
                setOpen(false);
                router.push("/cart");
              }}
              className={styles.goToCartButton}
              disabled={items.length === 0}
            >
              {t("goToCart")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
