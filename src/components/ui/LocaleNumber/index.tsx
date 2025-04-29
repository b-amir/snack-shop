import { toFarsiDigits } from "@/utils/convertDigits";
import { useLocale } from "next-intl";
import { LocaleNumberProps } from "./types";

export default function LocaleNumber({ children }: LocaleNumberProps) {
  const locale = useLocale?.() || "en";
  const str = String(children);
  return locale === "fa" ? toFarsiDigits(str) : str;
}
