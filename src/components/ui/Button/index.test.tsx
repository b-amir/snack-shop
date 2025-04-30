import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from "./index";

it("should render button with text", () => {
  render(<Button>Click Me</Button>);
  const buttonElement = screen.getByRole("button", { name: /click me/i });
  expect(buttonElement).toBeInTheDocument();
});

it("should apply correct variant class", () => {
  render(<Button variant="secondary">Secondary Action</Button>);
  const buttonElement = screen.getByRole("button", {
    name: /secondary action/i,
  });
  expect(buttonElement).toHaveClass("button--secondary");
});
