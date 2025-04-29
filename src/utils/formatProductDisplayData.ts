import { SupportedLocale } from "@/types/product";
import { Product } from "@/types/product";
const useCdn = process.env.NEXT_PUBLIC_USE_CLOUDINARY_CDN === "true";

export function formatProductDisplayData(
  product: Product,
  locale: SupportedLocale
) {
  const dateAdded = new Date(product.dateAdded);
  const formattedDate = dateAdded.toLocaleDateString(
    locale === "fa" ? "fa-IR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" }
  );
  const price =
    locale === "fa"
      ? product.price[locale].toLocaleString("fa-IR")
      : product.price[locale];
  const currency = product.currency[locale];
  const formattedPrice = `${price} ${currency}`;
  return {
    formattedDate,
    formattedPrice,
    imageSrc: useCdn ? product.imageUrlCdn : product.imageUrlLocal,
  };
}
