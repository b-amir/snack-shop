"use client";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/store/store";
import { useTranslations } from "next-intl";
import LocaleNumber from "@/components/ui/LocaleNumber";
import styles from "./styles.module.css";
import Button from "@/components/ui/Button";
import { CartDropdown } from "@/features/cart/CartDropdown";
import Skeleton from "@/components/common/Skeleton";

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
      )}
      {open && !isLoading && (
        <CartDropdown dir={dir} locale={locale} onClose={handleClose} />
      )}
    </div>
  );
}
