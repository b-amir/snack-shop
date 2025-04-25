import { create } from "zustand";
import { CartItem, Product } from "@/types/product";

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (product, quantity = 1) =>
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
  clearCart: () => set({ items: [] }),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })),
}));
