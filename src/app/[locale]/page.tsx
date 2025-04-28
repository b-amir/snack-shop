import { ProductList } from "@/features/products/ProductList";
import { notFound } from "next/navigation";
import styles from "./layout.module.css";
import { SupportedLocale } from "@/types/product";

const supportedLocales: SupportedLocale[] = ["en", "fa"];

export const dynamic = "force-dynamic";

export default async function Home(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const locale = (await props.params).locale;
  const searchParams = await props.searchParams;

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
