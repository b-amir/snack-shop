import { CartItem, Product } from "./product";

export type CartState = {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
};
