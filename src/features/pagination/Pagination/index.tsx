import { useTranslations } from "next-intl";
import { getDirection } from "@/utils/direction";
import LocaleNumber from "@/components/ui/LocaleNumber";
import styles from "./styles.module.css";
import Button from "@/components/ui/Button";

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

  const dir = getDirection(locale);

  return (
    <div className={styles.pagination} dir={dir}>
      <Button
        variant="secondary"
        className={styles.paginationItem}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label={t("Previous")}
      >
        {t("Previous")}
      </Button>
      {start > 1 && (
        <>
          <Button
            variant="link"
            className={styles.paginationItem}
            onClick={() => onPageChange(1)}
          >
            <LocaleNumber>{1}</LocaleNumber>
          </Button>
          {start > 2 && <span className={styles.paginationEllipsis}>...</span>}
        </>
      )}
      {pageNumbers.map((num) => (
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
        >
          <LocaleNumber>{num}</LocaleNumber>
        </Button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className={styles.paginationEllipsis}>...</span>
          )}
          <Button
            variant="link"
            className={styles.paginationItem}
            onClick={() => onPageChange(totalPages)}
          >
            <LocaleNumber>{totalPages}</LocaleNumber>
          </Button>
        </>
      )}
      <Button
        variant="secondary"
        className={styles.paginationItem}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label={t("Next")}
      >
        {t("Next")}
      </Button>
    </div>
  );
}
