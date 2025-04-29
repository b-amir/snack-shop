import React from "react";

export type InputVariant = "default" | "count";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  variant?: InputVariant;
};
