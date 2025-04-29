import styles from "./styles.module.css";
import { RevalidationButton } from "@/components/common/CacheRevalidationControl";
import { getDirection } from "@/utils/direction";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export function Footer({ locale }: { locale: string }) {
  const dir = getDirection(locale);
  const contentStyle =
    dir === "rtl" ? styles.footerContentRtl : styles.footerContentLtr;

  return (
    <footer className={styles.footer} dir={dir}>
      <div className={contentStyle}>
        <RevalidationButton />
        <LanguageSwitcher locale={locale} />
      </div>
    </footer>
  );
}
