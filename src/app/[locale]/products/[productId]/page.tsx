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

const useCdn = process.env.NEXT_PUBLIC_USE_CLOUDINARY_CDN === "true";

export async function generateStaticParams() {
  const allProducts = Array.from(productByIdMap.values());

  allProducts.sort(
    (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
  );

  const newestProductIds = allProducts.slice(0, 8).map((p) => p.id);

  if (newestProductIds.length === 0) {
    console.warn("generateStaticParams: No products found to pre-render.");
    return [];
  }

  const params = newestProductIds.flatMap((productId) =>
    supportedLocales.map((locale) => ({ locale, productId }))
  );

  return params;
}

export const dynamicParams = false;

export default async function ProductDetailPage(props: {
  params: Promise<{ locale: string; productId: string }>;
}) {
  const { locale, productId } = await props.params;

  if (!supportedLocales.includes(locale as SupportedLocale)) {
    notFound();
  }

  const t = await getTranslations("ProductDetail");

  const productData = await fetchProductById(productId);

  if (!productData || !productData.product) {
    notFound();
  }

  const { product } = productData;

  const safeLocale = locale as SupportedLocale;

  const imageSrc = useCdn ? product.imageUrlCdn : product.imageUrlLocal;

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
        {imageSrc && (
          <div className={detailStyles.imageWrapper}>
            <Image
              src={imageSrc}
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
