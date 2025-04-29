export type QuantityControlProps = {
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
  disabled?: boolean;
};
