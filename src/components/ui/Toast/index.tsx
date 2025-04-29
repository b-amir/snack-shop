"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { ToastProps } from "./types";
import { DEFAULT_TOAST_DURATION, TOAST_ANIMATION_DURATION } from "@/constants";

export function Toast({
  message,
  type,
  duration = DEFAULT_TOAST_DURATION,
  onClose,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, TOAST_ANIMATION_DURATION);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onClose]);

  if (!message) {
    return null;
  }

  const toastClasses = [
    styles.toast,
    styles[type],
    isVisible ? styles.show : null,
  ]
    .filter(Boolean)
    .join(" ");

  return <div className={toastClasses}>{message}</div>;
}
