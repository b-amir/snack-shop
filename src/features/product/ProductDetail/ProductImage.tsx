import React from "react";
import Image from "next/image";
import detailStyles from "@/app/[locale]/products/[productId]/page.module.css";
import { ProductImageProps } from "./types";

export function ProductImage({ src, alt, className }: ProductImageProps) {
  return (
    <div className={`${detailStyles.imageContainer} ${className || ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={detailStyles.coverImage}
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
