"use client";

import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { getDirection } from "@/utils/direction";
import LocaleNumber from "@/components/ui/LocaleNumber";
import styles from "./styles.module.css";
import Button from "@/components/ui/Button";

interface PaginationActionsProps {
  currentPage: number;
  totalPages: number;
  locale: string;
}

export function PaginationActions({
  currentPage,
  totalPages,
  locale,
}: PaginationActionsProps) {
  const t = useTranslations("ProductList");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  if (totalPages <= 1) return null;

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };

  const handlePageChange = (page: number) => {
    startTransition(() => {
      router.push(pathname + "?" + createQueryString("page", String(page)));
    });
  };

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
    <div
      className={`${styles.pagination} ${isPending ? styles.pending : ""}`}
      dir={dir}
    >
      <Button
        variant="secondary"
        className={styles.paginationItem}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        aria-label={t("Previous")}
      >
        {t("Previous")}
      </Button>
      {start > 1 && (
        <>
          <Button
            variant="link"
            className={styles.paginationItem}
            onClick={() => handlePageChange(1)}
            disabled={isPending}
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
          onClick={() => handlePageChange(num)}
          aria-current={num === currentPage ? "page" : undefined}
          disabled={isPending}
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
            onClick={() => handlePageChange(totalPages)}
            disabled={isPending}
          >
            <LocaleNumber>{totalPages}</LocaleNumber>
          </Button>
        </>
      )}
      <Button
        variant="secondary"
        className={styles.paginationItem}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        aria-label={t("Next")}
      >
        {t("Next")}
      </Button>
    </div>
  );
}
