import React, { SelectHTMLAttributes } from "react";
import styles from "./Select.module.css";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
}

export function Select({
  id,
  options,
  label,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={styles.selectContainer}>
      {label && (
        <label htmlFor={id} className={styles.selectLabel}>
          {label}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <select
          id={id}
          className={`${styles.selectElement} ${className || ""}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.selectArrow} aria-hidden="true"></span>
      </div>
    </div>
  );
}
