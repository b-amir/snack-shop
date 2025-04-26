import createMiddleware from "next-intl/middleware";
import { locales } from "@/i18n/config";

export default createMiddleware({
  locales,
  defaultLocale: "en",
});

export const config = {
  matcher: ["/", "/(fa|en)/:path*"],
};
