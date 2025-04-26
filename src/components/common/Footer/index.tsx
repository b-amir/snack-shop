import { LanguageSwitcher } from "./LanguageSwitcher";
import styles from "./styles.module.css";

export function Footer({ locale }: { locale: string }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <LanguageSwitcher locale={locale} />
      </div>
    </footer>
  );
}
