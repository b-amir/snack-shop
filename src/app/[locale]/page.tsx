import { ProductList } from "@/features/products/ProductList";
import { notFound } from "next/navigation";
import styles from "./layout.module.css";

export default async function Home(props: { params: { locale: string } }) {
  const params = await props.params;
  const { locale } = params;
  const supportedLocales = ["en", "fa"];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }
  return (
    <div className={styles.pageContainer}>
      <ProductList locale={locale} />
    </div>
  );
}
