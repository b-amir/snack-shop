import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuantityControl from "./index";
import "@testing-library/jest-dom";

const mockOnIncrease = jest.fn();
const mockOnDecrease = jest.fn();
const mockOnChange = jest.fn();

describe("<QuantityControl />", () => {
  beforeEach(() => {
    mockOnIncrease.mockClear();
    mockOnDecrease.mockClear();
    mockOnChange.mockClear();
  });

  it("should render with initial value", () => {
    render(
      <QuantityControl
        value={5}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
      />
    );
    expect(screen.getByRole("textbox")).toHaveValue("5");
  });

  it("should call onIncrease when plus button is clicked", () => {
    render(
      <QuantityControl
        value={5}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
      />
    );
    const increaseButton = screen.getByRole("button", { name: /increase/i });
    fireEvent.click(increaseButton);
    expect(mockOnIncrease).toHaveBeenCalledTimes(1);
    expect(mockOnDecrease).not.toHaveBeenCalled();
  });

  it("should call onDecrease when minus button is clicked", () => {
    render(
      <QuantityControl
        value={5}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
      />
    );
    const decreaseButton = screen.getByRole("button", { name: /decrease/i });
    fireEvent.click(decreaseButton);
    expect(mockOnDecrease).toHaveBeenCalledTimes(1);
    expect(mockOnIncrease).not.toHaveBeenCalled();
  });

  it("should call onChange when input value changes", () => {
    render(
      <QuantityControl
        value={5}
        onChange={mockOnChange}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
      />
    );
    const inputElement = screen.getByRole("textbox");
    fireEvent.change(inputElement, { target: { value: "10" } });
    expect(mockOnChange).toHaveBeenCalledWith(10);
  });

  it("should disable increase button when value is at specified max", () => {
    render(
      <QuantityControl
        value={10}
        max={10}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
      />
    );
    const increaseButton = screen.getByRole("button", { name: /increase/i });
    expect(increaseButton).toBeDisabled();
  });

  it("should enable buttons when value is between min and max", () => {
    render(
      <QuantityControl
        value={5}
        min={1}
        max={10}
        onIncrease={mockOnIncrease}
        onDecrease={mockOnDecrease}
      />
    );
    expect(
      screen.getByRole("button", { name: /decrease/i })
    ).not.toBeDisabled();
    expect(
      screen.getByRole("button", { name: /increase/i })
    ).not.toBeDisabled();
  });
});
