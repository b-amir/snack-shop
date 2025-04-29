"use client";

import { ChangeEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Select } from "@/components/ui/Select";
import styles from "./styles.module.css";
import LanguageIcon from "@/components/common/Footer/LanguageSwitcher/LanguageIcon";

interface LanguageSwitcherProps {
  locale: string;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "fa", label: "فارسی" },
  ];

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    const currentPathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";
    router.push(`/${newLocale}${currentPathWithoutLocale}`);
  };

  return (
    <div className={styles.languageSwitcherContainer}>
      <LanguageIcon className={styles.languageSwitcherIcon} />
      {locale === "en" ? "Language:" : "انتخاب زبان:"}
      <Select
        id="language-select"
        options={languageOptions}
        value={locale}
        onChange={handleLanguageChange}
        className={styles.languageSwitcherSelect}
        aria-label="Change language"
      />
    </div>
  );
}
