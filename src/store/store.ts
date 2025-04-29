import { create } from "zustand";
import { CartState, CartItem } from "@/types/cart";

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  isLoading: true,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/cart");
      if (!response.ok) {
        console.warn("Failed to fetch cart, using empty cart");
        set({ items: [], isLoading: false });
        return;
      }
      const data = (await response.json()) as { items: CartItem[] };
      set({ items: data.items, isLoading: false });
    } catch (error) {
      console.error("Fetch cart error:", error);
      set({ items: [], isLoading: false, error: (error as Error).message });
    }
  },

  addToCart: async (product, quantity = 1) => {
    const currentItems = get().items;
    const optimisticItems = (() => {
      const existingIndex = currentItems.findIndex(
        (item) => item.product.id === product.id
      );
      if (existingIndex > -1) {
        return currentItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...currentItems, { product, quantity }];
      }
    })();
    set({ items: optimisticItems, error: null });

    try {
      const response = await fetch("/api/cart/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, quantity }),
      });
      if (!response.ok) {
        throw new Error("Failed to add item");
      }
      const data = (await response.json()) as { items: CartItem[] };
      set({ items: data.items });
    } catch (error) {
      console.error("Add to cart error:", error);
      set({ items: currentItems, error: (error as Error).message });
    }
  },

  removeFromCart: async (productId) => {
    const currentItems = get().items;
    const optimisticItems = currentItems.filter(
      (item) => item.product.id !== productId
    );
    set({ items: optimisticItems, error: null });

    try {
      const response = await fetch(`/api/cart/items/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to remove item");
      }
      const data = (await response.json()) as { items: CartItem[] };
      set({ items: data.items });
    } catch (error) {
      console.error("Remove from cart error:", error);
      set({ items: currentItems, error: (error as Error).message });
    }
  },

  clearCart: async () => {
    const currentItems = get().items;
    set({ items: [], error: null });
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to clear cart");
      }
    } catch (error) {
      console.error("Clear cart error:", error);
      set({ items: currentItems, error: (error as Error).message });
    }
  },

  updateQuantity: async (productId, quantity) => {
    const currentItems = get().items;
    const optimisticItems = currentItems
      .map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
      .filter((item) => item.quantity > 0);
    set({ items: optimisticItems, error: null });

    try {
      const method = quantity > 0 ? "PUT" : "DELETE";
      const url = `/api/cart/items/${productId}`;
      const body = quantity > 0 ? JSON.stringify({ quantity }) : undefined;
      const headers =
        quantity > 0 ? { "Content-Type": "application/json" } : undefined;

      const response = await fetch(url, { method, headers, body });
      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
      const data = (await response.json()) as { items: CartItem[] };
      set({ items: data.items });
    } catch (error) {
      console.error("Update quantity error:", error);
      set({ items: currentItems, error: (error as Error).message });
    }
  },
}));

if (typeof window !== "undefined") {
  useCartStore.getState().fetchCart();
}
