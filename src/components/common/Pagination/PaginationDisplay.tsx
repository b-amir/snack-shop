import React from "react";
import { useTranslations } from "next-intl";
import LocaleNumber from "@/components/ui/LocaleNumber";
import Button from "@/components/ui/Button";
import styles from "./styles.module.css";
import { PaginationDisplayProps } from "./types";
import { getDirection } from "@/utils/direction";

export const PaginationDisplay: React.FC<PaginationDisplayProps> = ({
  pageNumbers,
  currentPage,
  totalPages,
  onPageChange,
  isPending = false,
  locale,
}) => {
  const t = useTranslations("common");
  const dir = getDirection(locale);

  return (
    <div
      className={`${styles.pagination} ${isPending ? styles.pending : ""}`}
      dir={dir}
    >
      <Button
        variant="secondary"
        className={styles.paginationItem}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        aria-label={t("previous")}
      >
        {t("previous")}
      </Button>

      {pageNumbers.map((num, index) =>
        num === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className={styles.paginationEllipsis}>
            ...
          </span>
        ) : (
          <Button
            key={num}
            variant={num === currentPage ? "secondary" : "link"}
            className={
              num === currentPage
                ? `${styles.paginationItem} ${styles.paginationActive}`
                : styles.paginationItem
            }
            onClick={() => onPageChange(num)}
            aria-current={num === currentPage ? "page" : undefined}
            disabled={isPending}
          >
            <LocaleNumber>{num}</LocaleNumber>
          </Button>
        )
      )}

      <Button
        variant="secondary"
        className={styles.paginationItem}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        aria-label={t("next")}
      >
        {t("next")}
      </Button>
    </div>
  );
};
