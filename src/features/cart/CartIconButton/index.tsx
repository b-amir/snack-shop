"use client";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/store/store";
import { useTranslations } from "next-intl";
import LocaleNumber from "@/components/ui/LocaleNumber";
import styles from "./styles.module.css";
import Button from "@/components/ui/Button";
import { CartDropdown } from "@/features/cart/CartDropdown";
import Skeleton from "@/components/common/Skeleton";
import CartIcon from "@/features/cart/CartIconButton/CartIcon";

export function CartIconButton({
  dir,
  locale,
}: {
  dir: "ltr" | "rtl";
  locale: string;
}) {
  const [open, setOpen] = useState(false);
  const { items, isLoading } = useCartStore();
  const t = useTranslations("ProductList");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const itemCount = items.length;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div ref={ref} className={styles.cartIconButtonWrapper} dir={dir}>
      {isLoading ? (
        <Skeleton layout="cartIcon" />
      ) : (
        <Button
          variant="link"
          size="small"
          className={styles.cartIconButton}
          aria-label={t("cart")}
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <CartIcon />
          {itemCount > 0 && (
            <span className={styles.cartBadge}>
              <LocaleNumber>{itemCount}</LocaleNumber>
            </span>
          )}
        </Button>
      )}
      {open && !isLoading && (
        <CartDropdown dir={dir} locale={locale} onClose={handleClose} />
      )}
    </div>
  );
}
