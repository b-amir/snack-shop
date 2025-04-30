import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Input from "./index";
import "@testing-library/jest-dom";

describe("<Input />", () => {
  const originalLang = document.documentElement.lang;

  afterAll(() => {
    document.documentElement.lang = originalLang;
  });

  beforeEach(() => {
    document.documentElement.lang = "en";
  });

  it("should render default input correctly", () => {
    render(<Input id="test-input" label="Test Label" />);
    expect(screen.getByLabelText("Test Label")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
  });

  it("should render with provided value", () => {
    render(
      <Input
        id="test-input"
        label="Test Label"
        value="Initial Value"
        readOnly
      />
    );
    expect(screen.getByLabelText("Test Label")).toHaveValue("Initial Value");
  });

  it("should call onChange handler for default input", () => {
    const handleChange = jest.fn();
    render(
      <Input id="test-input" label="Test Label" onChange={handleChange} />
    );
    const inputElement = screen.getByLabelText("Test Label");
    fireEvent.change(inputElement, { target: { value: "new value" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  describe('variant="count"', () => {
    it("should set correct attributes for count variant", () => {
      render(<Input id="count-input" label="Count" variant="count" />);
      const inputElement = screen.getByLabelText("Count");
      expect(inputElement).toHaveAttribute("inputMode", "numeric");
      expect(inputElement).toHaveAttribute("pattern", "[0-9۰-۹]*");
    });

    it('should display English number as Farsi digits when lang is "fa"', () => {
      document.documentElement.lang = "fa";
      render(
        <Input
          id="count-fa"
          label="Count FA"
          variant="count"
          value={123}
          readOnly
        />
      );
      expect(screen.getByLabelText("Count FA")).toHaveValue("۱۲۳");
    });

    it('should display English number as English digits when lang is "en"', () => {
      document.documentElement.lang = "en";
      render(
        <Input
          id="count-en"
          label="Count EN"
          variant="count"
          value={123}
          readOnly
        />
      );
      expect(screen.getByLabelText("Count EN")).toHaveValue("123");
    });

    it("should call onChange with English digits when Farsi digits are entered (lang=fa)", () => {
      document.documentElement.lang = "fa";
      const handleChange = jest.fn();
      render(
        <Input
          id="count-fa-change"
          label="Count FA Change"
          variant="count"
          onChange={handleChange}
        />
      );
      const inputElement = screen.getByLabelText("Count FA Change");

      fireEvent.change(inputElement, { target: { value: "۴۵۶" } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: "456" }),
        })
      );
    });

    it("should call onChange with English digits when English digits are entered (lang=fa)", () => {
      document.documentElement.lang = "fa";
      const handleChange = jest.fn();
      render(
        <Input
          id="count-fa-change-en"
          label="Count FA Change EN"
          variant="count"
          onChange={handleChange}
        />
      );
      const inputElement = screen.getByLabelText("Count FA Change EN");

      fireEvent.change(inputElement, { target: { value: "789" } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ value: "789" }),
        })
      );
    });
  });
});
