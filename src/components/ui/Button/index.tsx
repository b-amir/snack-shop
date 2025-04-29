import React from "react";
import styles from "./styles.module.css";
import { ButtonProps } from "./types";

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
    const buttonClasses = [
      styles.button,
      styles[`button--${variant}`],
      styles[`button--${size}`],
      fullWidth ? styles["button--fullWidth"] : null,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={buttonClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
