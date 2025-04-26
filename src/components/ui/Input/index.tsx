import React from "react";
import styles from "./styles.module.css";
import { toFarsiDigits, toEnglishDigits } from "@/utils/convertDigits";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  variant?: "default" | "count";
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      id,
      wrapperClassName = "",
      inputClassName = "",
      className = "",
      variant = "default",
      type = "text",
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const inputProps = { ...props };
    let inputType = type;
    let displayValue = value;
    let handleChange = onChange;

    if (variant === "count") {
      inputType = "text";
      inputProps.inputMode = "numeric";
      inputProps.pattern = "[0-9۰-۹]*";
      const isFa =
        typeof document !== "undefined" &&
        document.documentElement.lang === "fa";
      let safeValue: string | number = "";
      if (typeof value === "string" || typeof value === "number") {
        safeValue = value;
      }
      displayValue = isFa ? toFarsiDigits(safeValue) : value;
      handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
          const englishValue = toEnglishDigits(e.target.value);
          const syntheticEvent = {
            ...e,
            target: {
              ...e.target,
              value: englishValue,
            },
          };
          onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
        }
      };
    }

    return (
      <div className={`${styles.inputContainer} ${wrapperClassName}`.trim()}>
        {label && (
          <label htmlFor={id} className={styles.inputLabel}>
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          type={inputType}
          className={[
            styles.inputElement,
            styles[variant],
            inputClassName,
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          value={displayValue}
          onChange={handleChange}
          {...inputProps}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export default Input;
