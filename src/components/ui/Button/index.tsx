import React from "react";
import styles from "./styles.module.css";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "link";
  fullWidth?: boolean;
  size?: "small" | "default" | "large";
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      variant = "primary",
      fullWidth = false,
      size = "default",
      ...props
    },
    ref
  ) => {
    const variantClass =
      variant === "secondary"
        ? styles["button--secondary"]
        : variant === "link"
        ? styles["button--link"]
        : styles["button--primary"];
    const fullWidthClass = fullWidth ? styles["button--fullWidth"] : "";
    const sizeClass =
      size === "small"
        ? styles["button--small"]
        : size === "large"
        ? styles["button--large"]
        : styles["button--default"];
    return (
      <button
        ref={ref}
        className={`${styles.button} ${variantClass} ${sizeClass} ${fullWidthClass} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
