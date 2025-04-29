import { Product } from "@/types/product";

export type AddItemBody = {
  product?: Product;
  quantity?: number;
};
