import { ProductList } from "../components/products/ProductList";
import styles from "./page.module.css";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{t("header")}</h1>
        <p className={styles.subtitle}>{t("subheader")}</p>
      </div>
      <ProductList />
    </div>
  );
}
