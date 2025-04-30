import { act } from "@testing-library/react";

import { useCartStore } from "./store";
import { Product } from "@/types/product";
import "@testing-library/jest-dom";

const resetStoreState = () => {
  act(() => {
    useCartStore.setState({ items: [], isLoading: false, error: null });
  });
};

const mockProduct1: Product = {
  id: "p1",
  name: { en: "Product 1", fa: "محصول ۱" },
  description: { en: "Desc 1", fa: "توضیح ۱" },
  price: { en: 10, fa: 1000 },
  currency: { en: "USD", fa: "تومان" },
  tags: { en: ["tag1"], fa: ["تگ۱"] },
  dateAdded: "2023-01-01T00:00:00.000Z",
  imageUrlLocal: "/img1.jpg",
  imageUrlCdn: "/cdn1.jpg",
};

describe("useCartStore", () => {
  beforeEach(() => {
    resetStoreState();

    (fetch as jest.Mock).mockClear();
  });

  it("should add an item to the cart", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [{ product: mockProduct1, quantity: 1 }] }),
    });

    await act(async () => {
      await useCartStore.getState().addToCart(mockProduct1, 1);
    });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].product.id).toBe("p1");
    expect(useCartStore.getState().items[0].quantity).toBe(1);
    expect(fetch).toHaveBeenCalledWith("/api/cart/items", expect.anything());
  });

  it("should remove an item from the cart", async () => {
    act(() => {
      useCartStore.setState({
        items: [{ product: mockProduct1, quantity: 1 }],
      });
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [] }),
    });

    await act(async () => {
      await useCartStore.getState().removeFromCart("p1");
    });

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(fetch).toHaveBeenCalledWith("/api/cart/items/p1", expect.anything());
  });

  it("should update item quantity", async () => {
    act(() => {
      useCartStore.setState({
        items: [{ product: mockProduct1, quantity: 1 }],
      });
    });

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: [{ product: mockProduct1, quantity: 3 }] }),
    });

    await act(async () => {
      await useCartStore.getState().updateQuantity("p1", 3);
    });

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].quantity).toBe(3);
    expect(fetch).toHaveBeenCalledWith(
      "/api/cart/items/p1",
      expect.objectContaining({ method: "PUT" })
    );
  });

  it("should handle adding item API failure", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await act(async () => {
      await useCartStore.getState().addToCart(mockProduct1, 1);
    });

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().error).not.toBeNull();
  });
});
