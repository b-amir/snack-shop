import { ProductList } from "@/components/products/ProductList";
import styles from "./page.module.css";
import { notFound } from "next/navigation";

export default async function Home(props: { params: { locale: string } }) {
  const params = await props.params;
  const { locale } = params;
  const supportedLocales = ["en", "fa"];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }
  return (
    <div className={styles.container}>
      <ProductList locale={locale} />
    </div>
  );
}
