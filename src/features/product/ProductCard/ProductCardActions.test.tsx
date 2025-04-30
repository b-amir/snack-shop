import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCardActions } from "./ProductCardActions";
import { useCartStore } from "@/store/store";
import { CartState } from "@/types/cart";
import { Product } from "@/types/product";
import "@testing-library/jest-dom";

jest.mock("@/store/store");
const mockedUseCartStore = useCartStore as jest.MockedFunction<
  typeof useCartStore
>;

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("@/features/quantity-control/QuantityControl", () => {
  return jest.fn(
    ({
      value,
      onIncrease,
      onDecrease,
      onChange,
      increaseAriaLabel = "Increase",
      decreaseAriaLabel = "Decrease",
    }: {
      value: number;
      onIncrease: () => void;
      onDecrease: () => void;
      onChange: (value: number) => void;
      increaseAriaLabel?: string;
      decreaseAriaLabel?: string;
    }) => (
      <div>
        <button aria-label={decreaseAriaLabel} onClick={onDecrease}>
          Decrease
        </button>
        <input
          type="number"
          aria-label="Quantity"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <button aria-label={increaseAriaLabel} onClick={onIncrease}>
          Increase
        </button>
      </div>
    )
  );
});

const mockProduct: Product = {
  id: "p100",
  name: { en: "Test Product", fa: "محصول آزمایشی" },
  price: { en: 50, fa: 5000 },
  currency: { en: "USD", fa: "تومان" },
  description: { en: "Desc", fa: "توضیح" },
  tags: { en: [], fa: [] },
  dateAdded: "2024-01-01T00:00:00Z",
  imageUrlLocal: "/img.jpg",
  imageUrlCdn: "/cdn.jpg",
};

const mockAddToCart = jest.fn();
const mockUpdateQuantity = jest.fn();
const mockRemoveFromCart = jest.fn();

describe("<ProductCardActions />", () => {
  const setupMockStore = (
    items: { product: Product; quantity: number }[],
    isLoading = false
  ) => {
    const state: CartState = {
      items,
      isLoading,
      addToCart: mockAddToCart,
      updateQuantity: mockUpdateQuantity,
      removeFromCart: mockRemoveFromCart,
      error: null,
      fetchCart: jest.fn(),
      clearCart: jest.fn(),
    };

    mockedUseCartStore.mockImplementation(
      (selector?: (s: CartState) => unknown) => {
        if (typeof selector === "function") {
          const result = selector(state);
          return result;
        }
        return state;
      }
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    setupMockStore([]);
  });

  it('should display "Add to Cart" button when item is not in cart', () => {
    render(<ProductCardActions product={mockProduct} />);
    expect(
      screen.getByRole("button", { name: /addToCart/i })
    ).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it('should call addToCart when "Add to Cart" button is clicked', () => {
    render(<ProductCardActions product={mockProduct} />);
    const addButton = screen.getByRole("button", { name: /addToCart/i });
    fireEvent.click(addButton);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it("should display QuantityControl when item is in cart", () => {
    setupMockStore([{ product: mockProduct, quantity: 2 }]);

    render(<ProductCardActions product={mockProduct} />);
    const spinButton = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(spinButton).toBeInTheDocument();
    expect(spinButton.value).toBe("2");
    expect(
      screen.queryByRole("button", { name: /addToCart/i })
    ).not.toBeInTheDocument();
  });

  it("should call updateQuantity when QuantityControl increases value", () => {
    setupMockStore([{ product: mockProduct, quantity: 1 }]);

    render(<ProductCardActions product={mockProduct} />);
    const increaseButton = screen.getByRole("button", { name: /increase/i });
    fireEvent.click(increaseButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(mockProduct.id, 2);
  });

  it("should call updateQuantity when QuantityControl decreases value > 1", () => {
    setupMockStore([{ product: mockProduct, quantity: 3 }]);

    render(<ProductCardActions product={mockProduct} />);
    const decreaseButton = screen.getByRole("button", { name: /decrease/i });
    fireEvent.click(decreaseButton);
    expect(mockUpdateQuantity).toHaveBeenCalledWith(mockProduct.id, 2);
    expect(mockRemoveFromCart).not.toHaveBeenCalled();
  });

  it("should call removeFromCart when QuantityControl decreases value at 1", () => {
    setupMockStore([{ product: mockProduct, quantity: 1 }]);

    render(<ProductCardActions product={mockProduct} />);
    const decreaseButton = screen.getByRole("button", { name: /decrease/i });
    fireEvent.click(decreaseButton);
    expect(mockRemoveFromCart).toHaveBeenCalledWith(mockProduct.id);
    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });

  it("should call updateQuantity when QuantityControl input changes to valid number > 0", () => {
    setupMockStore([{ product: mockProduct, quantity: 1 }]);

    render(<ProductCardActions product={mockProduct} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "5" } });
    expect(mockUpdateQuantity).toHaveBeenCalledWith(mockProduct.id, 5);
    expect(mockRemoveFromCart).not.toHaveBeenCalled();
  });

  it("should call removeFromCart when QuantityControl input changes to 0 or less", () => {
    setupMockStore([{ product: mockProduct, quantity: 1 }]);

    render(<ProductCardActions product={mockProduct} />);
    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "0" } });
    expect(mockRemoveFromCart).toHaveBeenCalledWith(mockProduct.id);
    expect(mockUpdateQuantity).not.toHaveBeenCalled();
  });
});
