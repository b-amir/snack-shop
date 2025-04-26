import { useTranslations } from "next-intl";
import Link from "next/link";
import { CartIconButton } from "@/features/cart/CartIconButton";
import { getDirection } from "@/utils/direction";
import styles from "./styles.module.css";

export function Header({ locale }: { locale: string }) {
  const t = useTranslations();
  const dir = getDirection(locale);
  const headerClass = `${styles.header} ${
    dir === "rtl" ? styles.headerRtl : styles.headerLtr
  }`;
  const headerContentClass = `${styles.headerContent} ${
    dir === "rtl" ? styles.headerContentRtl : styles.headerContentLtr
  }`;
  const headerTextClass = `${styles.headerText} ${
    dir === "rtl" ? styles.headerTextRtl : styles.headerTextLtr
  }`;

  return (
    <header className={headerClass}>
      <div className={headerContentClass}>
        <div className={headerTextClass} style={{ flex: 1 }}>
          <Link href="/">
            <h1 className={styles.title}>
              {t("header")}
              <span className={styles.titleExclamation}>!</span>
            </h1>
          </Link>
          <p className={styles.subtitle}>{t("subheader")}</p>
        </div>
        <CartIconButton dir={dir} locale={locale} />
      </div>
    </header>
  );
}
