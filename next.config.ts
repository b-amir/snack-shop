import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const useCdn = process.env.NEXT_PUBLIC_USE_CLOUDINARY_CDN === "true";

console.log(
  `Image Loader: ${useCdn ? "Cloudinary (Custom)" : "Default (Local)"}`
);

const nextConfig: NextConfig = {
  images: useCdn
    ? {
        loader: "custom",
        loaderFile: "./src/utils/cloudinaryLoader.ts",
      }
    : {
        loader: "default", // Config for local images (default loader)
      },
  /* config options here */
};

export default withNextIntl(nextConfig);
