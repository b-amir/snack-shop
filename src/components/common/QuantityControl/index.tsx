import React from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import styles from "./styles.module.css";
import MinusIcon from "./MinusIcon";
import PlusIcon from "./PlusIcon";

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
  inputId?: string;
  iconClassName?: string;
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
  inputId,
  iconClassName = "",
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
        <MinusIcon className={iconClassName} />
      </Button>
      <Input
        id={inputId}
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
        <PlusIcon className={iconClassName} />
      </Button>
    </div>
  );
};

export default QuantityControl;
