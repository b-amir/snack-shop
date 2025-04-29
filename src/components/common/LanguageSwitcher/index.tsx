"use client";

import { ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Select } from "@/components/ui/Select";
import { locales } from "@/i18n/config";
import { LanguageSwitcherProps, LanguageSwitcherTranslationKey } from "./types";
import LanguageIcon from "./icon";
import styles from "./styles.module.css";

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("LanguageSwitcher");

  const languageOptions = locales.map((loc) => {
    const labelKey = `languageName_${loc}`;
    return {
      value: loc,
      label: t(labelKey as LanguageSwitcherTranslationKey),
    };
  });

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const currentPathWithoutLocale =
      (pathname || "").replace(`/${locale}`, "") || "/";
    router.push(`/${newLocale}${currentPathWithoutLocale}`);
  };

  return (
    <div className={styles.languageSwitcherContainer}>
      <LanguageIcon className={styles.languageSwitcherIcon} />
      {t("languageSwitcherLabel")}
      <Select
        id="language-select"
        options={languageOptions}
        value={locale}
        onChange={handleLanguageChange}
        className={styles.languageSwitcherSelect}
        aria-label={t("languageSwitcherLabel")}
      />
    </div>
  );
}
