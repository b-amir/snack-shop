import { SupportedLocale } from "@/types/product";

export type ProductListProps = {
  locale: SupportedLocale;
  searchParams: { [key: string]: string | string[] | undefined };
};
