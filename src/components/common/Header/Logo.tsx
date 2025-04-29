import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./styles.module.css";

export const Logo: React.FC = () => {
  const t = useTranslations("Metadata");

  return (
    <div className={styles.logoContainer}>
      <Link href="/" className={styles.logoLink}>
        <h1 className={styles.title}>
          {t("title")}
          <span className={styles.titleExclamation}>!</span>
        </h1>
      </Link>
      <p className={styles.subtitle}>{t("tagline")}</p>
    </div>
  );
};
