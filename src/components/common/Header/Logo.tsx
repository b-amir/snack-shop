import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./styles.module.css";

interface LogoProps {
  locale: string;
}

export const Logo: React.FC<LogoProps> = ({ locale }) => {
  const t = useTranslations("metadata");

  return (
    <div className={styles.logoContainer}>
      <Link href={`/${locale}`} className={styles.logoLink}>
        <h1 className={styles.title}>
          {t("title")}
          <span className={styles.titleExclamation}>!</span>
        </h1>
      </Link>
      <p className={styles.subtitle}>{t("tagline")}</p>
    </div>
  );
};
