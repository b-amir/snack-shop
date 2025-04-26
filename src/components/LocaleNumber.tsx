import { toFarsiDigits } from "@/utils/convertToFarsiDigits";
import { useLocale } from "next-intl";

interface LocaleNumberProps {
  children: React.ReactNode;
}

export default function LocaleNumber({ children }: LocaleNumberProps) {
  const locale = useLocale?.() || "en";
  const str = String(children);
  return locale === "fa" ? toFarsiDigits(str) : str;
}
