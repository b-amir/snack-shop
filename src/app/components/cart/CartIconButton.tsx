"use client";
import { useState, useRef, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import styles from "../../[locale]/layout.module.css";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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
    <div ref={ref} style={{ position: "relative", direction: dir }}>
      <button
        className={styles.cartIconButton}
        aria-label={t("cart")}
        onClick={() => setOpen((v) => !v)}
        type="button"
        style={{ fontSize: 28, padding: 4 }}
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
        {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            [dir === "rtl" ? "left" : "right"]: 0,
            minWidth: 320,
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 12,
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            zIndex: 100,
            padding: 16,
          }}
        >
          <h3 style={{ margin: 0, marginBottom: 12 }}>{t("cart")}</h3>
          {items.length === 0 ? (
            <div style={{ padding: 16, textAlign: "center" }}>
              {t("cartEmpty")}
            </div>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                maxHeight: 260,
                overflowY: "auto",
              }}
            >
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 12,
                  }}
                >
                  <span style={{ flex: 1 }}>
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
                    <button
                      className={styles.quantityButton}
                      aria-label={quantity === 1 ? t("remove") : t("decrease")}
                      onClick={() => {
                        if (quantity === 1) removeFromCart(product.id);
                        else updateQuantity(product.id, quantity - 1);
                      }}
                    >
                      {quantity === 1 ? (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="#b00020"
                            strokeWidth="2"
                            fill="none"
                          />
                          <line
                            x1="14.5"
                            y1="9.5"
                            x2="9.5"
                            y2="14.5"
                            stroke="#b00020"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <line
                            x1="14.5"
                            y1="14.5"
                            x2="9.5"
                            y2="9.5"
                            stroke="#b00020"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <line
                            x1="4"
                            y1="12"
                            x2="20"
                            y2="12"
                            stroke="#888"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                    </button>
                    <input
                      className={styles.quantityValue}
                      type="number"
                      min={0}
                      value={quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val <= 0) removeFromCart(product.id);
                        else updateQuantity(product.id, val);
                      }}
                      style={{
                        width: 32,
                        textAlign: "center",
                        border: "none",
                        background: "transparent",
                      }}
                      aria-label={t("quantity")}
                    />
                    <button
                      className={styles.quantityButton}
                      aria-label={t("increase")}
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line
                          x1="12"
                          y1="19"
                          x2="12"
                          y2="5"
                          stroke="#888"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <line
                          x1="5"
                          y1="12"
                          x2="19"
                          y2="12"
                          stroke="#888"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 16,
            }}
          >
            {items.length > 0 && (
              <button
                onClick={clearCart}
                style={{
                  width: "100%",
                  background: "#f3f3f3",
                  color: "#888",
                  border: "none",
                  borderRadius: 6,
                  padding: "10px 0",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: 0,
                }}
              >
                {t("clearCart")}
              </button>
            )}
            <button
              onClick={() => {
                setOpen(false);
                router.push("/cart");
              }}
              style={{
                width: "100%",
                background: "var(--color-primary)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "10px 0",
                fontWeight: 600,
                cursor: "pointer",
              }}
              disabled={items.length === 0}
            >
              {t("goToCart")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
