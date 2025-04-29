import React from "react";
import styles from "./styles.module.css";
import LocaleNumber from "@/components/ui/LocaleNumber";
import { SelectProps, SelectOption } from "./types";

export function Select({
  id,
  options,
  label,
  className = "",
  ...props
}: SelectProps) {
  const selectClasses = [styles.selectElement, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.selectContainer}>
      {label && (
        <label htmlFor={id} className={styles.selectLabel}>
          {label}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <select id={id} className={selectClasses} {...props}>
          {options.map((option: SelectOption) => (
            <option key={option.value} value={option.value}>
              <LocaleNumber>{option.label}</LocaleNumber>
            </option>
          ))}
        </select>
        <span className={styles.selectArrow} aria-hidden="true"></span>
      </div>
    </div>
  );
}
