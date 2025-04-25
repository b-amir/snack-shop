"use client";
import { useCartStore } from "@/lib/store";
import styles from "./ProductList.module.css";
import { useTranslations } from "next-intl";

export function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const t = useTranslations("ProductList");

  if (items.length === 0) {
    return <div className={styles.warning}>{t("cartEmpty")}</div>;
  }

  return (
    <div className={styles.container} style={{ marginTop: 32 }}>
      <h2 style={{ marginBottom: 16 }}>{t("cart")}</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map(({ product, quantity }) => (
          <li
            key={product.id}
            className={styles.productCard}
            style={{ marginBottom: 16 }}
          >
            <div className={styles.productInfo}>
              <div className={styles.productTitle}>{product.name.en}</div>
              <div className={styles.productPrice}>
                ${product.price.en} {product.currency.en}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <label htmlFor={`qty-${product.id}`}>{t("quantity")}:</label>
                <input
                  id={`qty-${product.id}`}
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) =>
                    updateQuantity(product.id, Number(e.target.value))
                  }
                  style={{ width: 48 }}
                />
                <button
                  onClick={() => removeFromCart(product.id)}
                  style={{ marginLeft: 8 }}
                >
                  {t("remove")}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={clearCart}
        className={styles.addToCartButton}
        style={{ marginTop: 16 }}
      >
        {t("clearCart")}
      </button>
    </div>
  );
}
