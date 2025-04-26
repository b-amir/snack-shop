import { ProductList } from "@/components/products/ProductList";
import styles from "./page.module.css";

export default async function Home(props: { params: { locale: string } }) {
  const params = await props.params;
  const { locale } = params;
  return (
    <div className={styles.container}>
      <ProductList locale={locale} />
    </div>
  );
}
