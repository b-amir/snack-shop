import { ProductList } from "./components/products/ProductList";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>title</h1>
        <p className={styles.subtitle}>subtitle</p>
      </div>

      <ProductList />
    </div>
  );
}
