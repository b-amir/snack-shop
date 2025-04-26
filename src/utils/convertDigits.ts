const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toFarsiDigits(strOrNumber: string | number): string {
  const str = String(strOrNumber);
  return str.replace(/\d/g, (d) => farsiDigits[Number(d)]);
}

export function toEnglishDigits(strOrNumber: string | number): string {
  const str = String(strOrNumber);
  return str.replace(/[۰-۹]/g, (d) => String(farsiDigits.indexOf(d)));
}
