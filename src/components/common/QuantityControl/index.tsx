import React from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import styles from "./styles.module.css";

interface QuantityControlProps {
  value: number;
  min?: number;
  max?: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onChange?: (value: number) => void;
  className?: string;
  inputClassName?: string;
  decreaseAriaLabel?: string;
  increaseAriaLabel?: string;
  variant?: "default" | "button";
  fullWidth?: boolean;
  size?: "small" | "default" | "large";
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  value,
  min = 0,
  max,
  onIncrease,
  onDecrease,
  onChange,
  className = "",
  inputClassName = "",
  decreaseAriaLabel = "Decrease",
  increaseAriaLabel = "Increase",
  variant = "default",
  fullWidth = false,
  size = "default",
}) => {
  return (
    <div
      className={[
        styles.quantityControl,
        variant === "button"
          ? styles["quantityControl--button-replacement"]
          : "",
        fullWidth ? styles["quantityControl--fullWidth"] : "",
        size === "default"
          ? styles["quantityControl--default"]
          : size === "large"
          ? styles["quantityControl--large"]
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Button
        variant="link"
        className={styles.quantityButton}
        aria-label={decreaseAriaLabel}
        onClick={onDecrease}
        type="button"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="4"
            y1="12"
            x2="20"
            y2="12"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </Button>
      <Input
        variant="count"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className={inputClassName}
      />
      <Button
        variant="link"
        className={styles.quantityButton}
        aria-label={increaseAriaLabel}
        onClick={onIncrease}
        type="button"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="12"
            y1="19"
            x2="12"
            y2="5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="5"
            y1="12"
            x2="19"
            y2="12"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </Button>
    </div>
  );
};

export default QuantityControl;
