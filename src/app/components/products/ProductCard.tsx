import { Product, SupportedLocale } from "@/types/product";
import { useTranslations } from "next-intl";

interface ProductCardProps {
  product: Product;
  locale: SupportedLocale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const t = useTranslations("ProductList");
  const price =
    locale === "fa"
      ? product.price[locale].toLocaleString("fa-IR")
      : product.price[locale];
  const currency = product.currency[locale];
  return (
    <div className="product-card">
      <h2>{product.name[locale]}</h2>
      <p>{product.description[locale]}</p>
      <p>
        {locale === "fa" ? `${price} ${currency}` : `$${price} ${currency}`}
      </p>
      <button>{t("addToCart")}</button>
    </div>
  );
}
