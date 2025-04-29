import { AVAILABLE_PAGE_SIZES } from "@/constants";
import { ReadonlyURLSearchParams } from "next/navigation";

export type Translator = (key: string) => string;

export const getSortOptions = (t: Translator) => [
  { value: "date_desc", label: t("sortNewest") },
  { value: "date_asc", label: t("sortOldest") },
  { value: "price_asc", label: t("sortPriceAsc") },
  { value: "price_desc", label: t("sortPriceDesc") },
];

export const getPageSizeOptions = () =>
  AVAILABLE_PAGE_SIZES.map((size) => ({
    value: String(size),
    label: String(size),
  }));

export const createQueryString = (
  currentSearchParams: ReadonlyURLSearchParams,
  name: string,
  value: string
) => {
  const params = new URLSearchParams(currentSearchParams.toString());
  params.set(name, value);
  if (name !== "page") {
    params.set("page", "1");
  }
  return params.toString();
};
