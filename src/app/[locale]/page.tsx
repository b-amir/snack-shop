import { ProductList } from "@/features/products/ProductList";
import { notFound } from "next/navigation";
import { SupportedLocale } from "@/types/product";
import { locales } from "@/i18n/config";
import styles from "./page.module.css";

type Locale = (typeof locales)[number];
type Params = Promise<{ locale: Locale }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export const revalidate = 60;

export default async function Home(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const locale = (await props.params).locale;
  const searchParams = await props.searchParams;

  if (!locales.includes(locale as SupportedLocale)) {
    notFound();
  }

  return (
    <div className={styles.pageContainer}>
      <ProductList
        locale={locale as SupportedLocale}
        searchParams={searchParams}
      />
    </div>
  );
}
