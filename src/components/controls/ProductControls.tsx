import { useTranslations } from "next-intl";
import styles from "./ProductControls.module.css";
import { ChangeEvent } from "react";
import { Select } from "../ui/Select";

const getSortOptions = (t: (key: string) => string) => [
  { value: "date_desc", label: t("sortNewest") },
  { value: "date_asc", label: t("sortOldest") },
  { value: "price_asc", label: t("sortPriceAsc") },
  { value: "price_desc", label: t("sortPriceDesc") },
];

const getPageSizeOptions = () =>
  [8, 12].map((size) => ({ value: size, label: String(size) }));

interface ProductControlsProps {
  sort: string;
  pageSize: number;
  onSortChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onPageSizeChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function ProductControls({
  sort,
  pageSize,
  onSortChange,
  onPageSizeChange,
}: ProductControlsProps) {
  const t = useTranslations("ProductList");

  const sortOptions = getSortOptions(t);
  const pageSizeOptions = getPageSizeOptions();

  return (
    <div className={styles.controlRow}>
      <Select
        id="sort-select"
        label={`${t("sortBy")}:`}
        options={sortOptions}
        value={sort}
        onChange={onSortChange}
        className={styles.controlSelect}
      />
      <Select
        id="page-size-select"
        label={`${t("productsPerPage")}:`}
        options={pageSizeOptions}
        value={pageSize}
        onChange={onPageSizeChange}
        className={styles.controlSelect}
      />
    </div>
  );
}
