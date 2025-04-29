import { SupportedLocale, CartItem } from "@/types/product";

export type CartItemsProps = {
  items: CartItem[];
  locale: SupportedLocale;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  showRemoveButton?: boolean;
};
