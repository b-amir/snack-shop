import { toFarsiDigits } from "../utils/convertToFarsiDigits";
import { useLocale } from "next-intl";

export default function LocaleNumber({ children }) {
  const locale = useLocale?.() || "en";
  const str = String(children);
  return locale === "fa" ? toFarsiDigits(str) : str;
}
