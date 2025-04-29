import React from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import styles from "./styles.module.css";
import { MinusIcon, PlusIcon } from "./icon";
import { QuantityControlProps } from "./types";

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
  disabled = false,
}) => {
  const containerClasses = [
    styles.quantityControl,
    variant === "button" && styles["quantityControl--button-replacement"],
    fullWidth && styles["quantityControl--fullWidth"],
    size === "large" && styles["quantityControl--large"],
    size === "small" && styles["quantityControl--small"],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      <Button
        variant="link"
        className={styles.quantityButton}
        aria-label={decreaseAriaLabel}
        onClick={onDecrease}
        type="button"
        disabled={disabled}
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
        disabled={disabled}
      />
      <Button
        variant="link"
        className={styles.quantityButton}
        aria-label={increaseAriaLabel}
        onClick={onIncrease}
        type="button"
        disabled={disabled}
      >
        <PlusIcon className={iconClassName} />
      </Button>
    </div>
  );
};

export default QuantityControl;
