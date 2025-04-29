import { locales } from "@/i18n/config";

export type LanguageSwitcherTranslationKey =
  | "languageSwitcherLabel"
  | `languageName_${(typeof locales)[number]}`;

export type LanguageSwitcherProps = {
  locale: string;
};
