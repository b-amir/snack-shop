import { SupportedLocale } from "@/types/product";
import { CartItem } from "@/types/cart";

export type CartItemsProps = {
  items: CartItem[];
  locale: SupportedLocale;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  showRemoveButton?: boolean;
};
