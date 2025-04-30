"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import styles from "./styles.module.css";

interface ErrorBoundaryFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundaryFallback({
  error,
  reset,
}: ErrorBoundaryFallbackProps) {
  const t = useTranslations("errorBoundary");

  useEffect(() => {
    console.error("Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorHeading}>{t("title")}</h2>
      <p className={styles.errorMessage}>
        {t("message")}

        {/* process.env.NODE_ENV === 'development' && <><br /> <small>{error.message}</small></> */}
      </p>
      <Button onClick={() => reset()} variant="secondary">
        {t("retry")}
      </Button>
    </div>
  );
}
