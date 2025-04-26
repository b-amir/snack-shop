export function toFarsiDigits(strOrNumber) {
  const str = String(strOrNumber);
  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/\d/g, (d) => farsiDigits[d]);
}
