import { notFound } from "next/navigation";
import { SupportedLocale, Product } from "@/types/product";
import Image from "next/image";
import detailStyles from "./page.module.css";
import sharedStyles from "@/features/products/ProductList/styles.module.css";
import { ProductCard } from "@/features/products/ProductCard";
import {
  fetchRelatedProducts,
  fetchProductById,
} from "@/services/productService";
import { ProductQuantityActions } from "./components/ProductQuantityActions";
import { getTranslations } from "next-intl/server";
import { productByIdMap } from "@/utils/api/products/index";

const supportedLocales: SupportedLocale[] = ["en", "fa"];

// Enable ISR: Revalidate pages every hour
export const revalidate = 3600;

// Generate static paths for a subset of products and all locales
export async function generateStaticParams() {
  // In a real app, get popular product IDs from analytics/DB
  // For demo: take first 10 product IDs
  const productIds = Array.from(productByIdMap.keys()).slice(0, 10);

  const params = productIds.flatMap((productId) =>
    supportedLocales.map((locale) => ({ locale, productId }))
  );

  console.log(
    `Generating static params for ${params.length} product detail pages`
  );
  return params;
}

export default async function ProductDetailPage(props: {
  params: Promise<{ locale: string; productId: string }>;
}) {
  const { locale, productId } = await props.params;
  const t = await getTranslations("ProductDetail");

  if (!supportedLocales.includes(locale as SupportedLocale)) {
    notFound();
  }

  const { product } = await fetchProductById(productId);
  if (!product) {
    notFound();
  }

  const safeLocale = locale as SupportedLocale;

  const relatedProducts = await fetchRelatedProducts({
    productId,
    locale: safeLocale,
    limit: 3,
  });

  const dateAdded = new Date(product.dateAdded);
  const formattedDate = dateAdded.toLocaleDateString(
    locale === "fa" ? "fa-IR" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const price =
    safeLocale === "fa"
      ? product.price[safeLocale].toLocaleString("fa-IR")
      : product.price[safeLocale];
  const currency = product.currency[safeLocale];

  return (
    <div className={detailStyles.container}>
      <div className={detailStyles.topSection}>
        {product.imageUrl && (
          <div className={detailStyles.imageWrapper}>
            <Image
              src={product.imageUrl}
              alt={product.name[safeLocale]}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        )}
        <div className={detailStyles.info}>
          <h1 className={detailStyles.title}>{product.name[safeLocale]}</h1>
          <div className={detailStyles.tags}>
            {product.tags[safeLocale].map((tag) => (
              <span key={tag} className={detailStyles.tag}>
                {tag}
              </span>
            ))}
          </div>
          <p className={detailStyles.description}>
            {product.description[safeLocale]}
          </p>
          <div className={detailStyles.price}>
            {safeLocale === "fa"
              ? `${price} ${currency}`
              : `$${price} ${currency}`}
          </div>
          <div className={detailStyles.date}>
            <span>{t("dateAdded")}</span>
            <span>{formattedDate}</span>
          </div>

          <ProductQuantityActions productId={product.id} product={product} />
        </div>
      </div>
      <div className={detailStyles.relatedSection}>
        <hr className={detailStyles.relatedSeparator} />
        <h2 className={detailStyles.relatedTitle}>{t("relatedProducts")}</h2>

        {relatedProducts.length === 0 ? (
          <p className={detailStyles.noRelatedProducts}>
            {t("noRelatedProducts")}
          </p>
        ) : (
          <div className={sharedStyles.relatedProductsGrid}>
            {relatedProducts.map((related: Product) => (
              <ProductCard
                key={related.id}
                product={related}
                locale={safeLocale}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
