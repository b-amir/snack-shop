import { useTranslations } from "next-intl";
import styles from "./Pagination.module.css";
import LocaleNumber from "../LocaleNumber";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  locale: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  locale,
}: PaginationProps) {
  const t = useTranslations("ProductList");
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxPagesToShow = 5;
  const halfPagesToShow = Math.floor(maxPagesToShow / 2);

  let start = Math.max(1, currentPage - halfPagesToShow);
  let end = Math.min(totalPages, currentPage + halfPagesToShow);

  if (currentPage - halfPagesToShow < 1) {
    end = Math.min(totalPages, maxPagesToShow);
  }
  if (currentPage + halfPagesToShow > totalPages) {
    start = Math.max(1, totalPages - maxPagesToShow + 1);
  }

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  const isRTL = locale === "fa";

  return (
    <div className={styles.pagination} dir={isRTL ? "rtl" : "ltr"}>
      <button
        className={styles.paginationItem}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t("Previous")}
        style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
      >
        {t("Previous")}
      </button>
      {start > 1 && (
        <>
          <button
            className={styles.paginationItem}
            onClick={() => onPageChange(1)}
          >
            <LocaleNumber>{1}</LocaleNumber>
          </button>
          {start > 2 && <span className={styles.paginationEllipsis}>...</span>}
        </>
      )}
      {pageNumbers.map((num) => (
        <button
          key={num}
          className={
            num === currentPage
              ? `${styles.paginationItem} ${styles.paginationActive}`
              : styles.paginationItem
          }
          onClick={() => onPageChange(num)}
          aria-current={num === currentPage ? "page" : undefined}
        >
          <LocaleNumber>{num}</LocaleNumber>
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className={styles.paginationEllipsis}>...</span>
          )}
          <button
            className={styles.paginationItem}
            onClick={() => onPageChange(totalPages)}
          >
            <LocaleNumber>{totalPages}</LocaleNumber>
          </button>
        </>
      )}
      <button
        className={styles.paginationItem}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t("Next")}
        style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
      >
        {t("Next")}
      </button>
    </div>
  );
}
