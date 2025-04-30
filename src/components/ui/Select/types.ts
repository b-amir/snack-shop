import { SelectHTMLAttributes, ReactNode } from "react";

export type SelectOption = {
  value: string | number;
  label: string;
};

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  options: SelectOption[];
  label?: ReactNode;
};
