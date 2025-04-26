export function toFarsiDigits(strOrNumber: string | number): string {
  const str = String(strOrNumber);
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (d) => farsiDigits[Number(d)]);
}
