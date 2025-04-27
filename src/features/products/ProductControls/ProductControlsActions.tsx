"use client";

import { useTranslations } from "next-intl";
import { ChangeEvent, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/Select";
import styles from "./styles.module.css";

const getSortOptions = (t: (key: string) => string) => [
  { value: "date_desc", label: t("sortNewest") },
  { value: "date_asc", label: t("sortOldest") },
  { value: "price_asc", label: t("sortPriceAsc") },
  { value: "price_desc", label: t("sortPriceDesc") },
];

const getPageSizeOptions = () =>
  [8, 12].map((size) => ({ value: String(size), label: String(size) }));

interface ProductControlsActionsProps {
  initialSort: string;
  initialPageSize: number;
}

export function ProductControlsActions({
  initialSort,
  initialPageSize,
}: ProductControlsActionsProps) {
  const t = useTranslations("ProductList");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const sortOptions = getSortOptions(t);
  const pageSizeOptions = getPageSizeOptions();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    if (name !== "page") {
      params.set("page", "1");
    }
    return params.toString();
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      router.push(pathname + "?" + createQueryString("sort", e.target.value));
    });
  };

  const handlePageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      router.push(
        pathname + "?" + createQueryString("pageSize", e.target.value)
      );
    });
  };

  return (
    <div className={`${styles.controlRow} ${isPending ? styles.pending : ""}`}>
      <Select
        id="sort-select"
        label={`${t("sortBy")}:`}
        options={sortOptions}
        value={initialSort}
        onChange={handleSortChange}
        disabled={isPending}
      />
      <Select
        id="page-size-select"
        label={`${t("productsPerPage")}:`}
        options={pageSizeOptions}
        value={String(initialPageSize)}
        onChange={handlePageSizeChange}
        disabled={isPending}
      />
    </div>
  );
}
