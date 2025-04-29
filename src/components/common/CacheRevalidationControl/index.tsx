"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Toast } from "@/components/ui/Toast";
import { ToastType } from "@/components/ui/Toast/types";
import { ToastState } from "./types";
import { fetchProductDetails } from "./utils";
import RefreshIcon from "@/components/common/CacheRevalidationControl/icon";
import Button from "@/components/ui/Button";
import styles from "./styles.module.css";
import { REVALIDATION_EVENT_MANUAL } from "@/constants";

const REVALIDATE_SECRET =
  process.env.NEXT_PUBLIC_REVALIDATE_SECRET_TOKEN || "your-secret-token";

export function RevalidationButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const locale = useLocale();
  const t = useTranslations("Admin.revalidation");

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleRevalidate = async () => {
    const productIdToRevalidate = prompt(t("promptTitle"), "p20");
    if (!productIdToRevalidate) return;

    setIsLoading(true);
    setToast(null);

    try {
      const product = await fetchProductDetails(productIdToRevalidate);
      const productName = product ? product.name[locale] : t("productNotFound");

      console.log(
        "[Cache] Sending revalidation request for:",
        productIdToRevalidate
      );

      const res = await fetch("/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-revalidate-secret": REVALIDATE_SECRET,
        },
        body: JSON.stringify({
          event: REVALIDATION_EVENT_MANUAL,
          productId: productIdToRevalidate,
          changedLocales: [locale],
        }),
      });

      const data = await res.json().catch(() => ({ message: res.statusText }));
      console.log("[Cache] Response status:", res.status);
      console.log("[Cache] Response data:", data);

      if (res.ok) {
        showToast(
          t("revalidationSuccess", {
            productName,
            productId: productIdToRevalidate,
          }),
          "success"
        );
      } else if (res.status === 404) {
        showToast(t("productNotFound"), "error");
      } else {
        showToast(
          t("revalidationFailed", {
            productName,
            productId: productIdToRevalidate,
            errorMessage: data.message || t("unknownError"),
            status: res.status,
          }),
          "error"
        );
      }
    } catch (error) {
      console.error("Revalidation request error:", error);
      showToast(
        t("requestError", {
          errorMessage: error instanceof Error ? error.message : String(error),
        }),
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleRevalidate}
        variant="secondary"
        disabled={isLoading}
        className={styles.revalidateButton}
      >
        {isLoading ? (
          <>
            <RefreshIcon
              className={`${styles.refreshIcon} ${styles.spinningIcon}`}
            />
            {t("buttonLoadingText")}
          </>
        ) : (
          <>
            <RefreshIcon className={styles.refreshIcon} />
            {t("buttonText")}
          </>
        )}
      </Button>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
