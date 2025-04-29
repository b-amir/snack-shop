import React from "react";
import { Product, SupportedLocale } from "@/types/product";

export type ProductCardProps = {
  product: Product;
  locale: SupportedLocale;
};

export type ProductCardDisplayProps = {
  product: Product;
  locale: SupportedLocale;
  children?: React.ReactNode;
};

export type ProductCardActionsProps = {
  product: Product;
};
