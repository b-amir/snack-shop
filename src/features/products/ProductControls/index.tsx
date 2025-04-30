"use client";

import { ChangeEvent, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getSortOptions, getPageSizeOptions, createQueryString } from "./utils";
import { Select } from "@/components/ui/Select";
import { ProductControlsProps } from "./types";
import { SortIcon, GridViewIcon } from "./icon";
import styles from "./styles.module.css";

export function ProductControls({
  initialSort,
  initialPageSize,
  translations,
}: ProductControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const t = (key: string) =>
    translations[key as keyof typeof translations] || key;

  const sortOptions = getSortOptions(t);
  const pageSizeOptions = getPageSizeOptions();

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      const newQueryString = createQueryString(
        searchParams,
        "sort",
        e.target.value
      );
      router.push(pathname + "?" + newQueryString);
    });
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      const newQueryString = createQueryString(
        searchParams,
        "pageSize",
        e.target.value
      );
      router.push(pathname + "?" + newQueryString);
    });
  };

  return (
    <div className={`${styles.controlRow} ${isPending ? styles.pending : ""}`}>
      <Select
        id="sort-select"
        label={
          <span className={styles.selectLabel}>
            <SortIcon className={styles.selectIcon} />
            <span className={styles.selectText}>{t("sortBy")}:</span>
          </span>
        }
        options={sortOptions}
        value={initialSort}
        onChange={handleSortChange}
        disabled={isPending}
      />
      <Select
        id="page-size-select"
        label={
          <span className={styles.selectLabel}>
            <GridViewIcon className={styles.selectIcon} />
            <span className={styles.selectText}>{t("productsPerPage")}:</span>
          </span>
        }
        options={pageSizeOptions}
        value={String(initialPageSize)}
        onChange={handlePageSizeChange}
        disabled={isPending}
      />
    </div>
  );
}
