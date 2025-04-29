import { Vazirmatn } from "next/font/google";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { getDirection } from "@/utils/direction";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { getTranslations } from "next-intl/server";
import styles from "./page.module.css";
import "@/app/globals.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("tagline"),
  };
}

const vazirmatn = Vazirmatn({
  subsets: ["latin", "arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
});

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: { locale: string };
  }>
) {
  const { children } = props;
  const params = await props.params;
  const { locale } = params;
  const messages = await getMessages();
  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      className={vazirmatn.variable}
    >
      <body className={styles.body}>
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} />
          <div className={`container ${styles.mainContainer}`}>{children}</div>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
