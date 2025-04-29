import React from "react";

export type ButtonVariant = "primary" | "secondary" | "link";
export type ButtonSize = "small" | "default" | "large";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: ButtonSize;
};
