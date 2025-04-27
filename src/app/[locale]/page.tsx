import { ProductList } from "@/features/products/ProductList";
import { notFound } from "next/navigation";
import styles from "./layout.module.css";
import { SupportedLocale } from "@/types/product";

export default async function Home({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supportedLocales: SupportedLocale[] = ["en", "fa"];
  if (!supportedLocales.includes(locale as SupportedLocale)) {
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
