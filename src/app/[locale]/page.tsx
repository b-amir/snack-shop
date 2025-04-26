import { ProductList } from "@/components/products/ProductList";
import styles from "./page.module.css";

export default function Home({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className={styles.container}>
      <ProductList locale={locale} />
    </div>
  );
}
