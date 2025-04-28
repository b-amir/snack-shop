"use client";

import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export type ToastType = "success" | "error";

interface ToastProps {
  message: string | null;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, duration, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div
      className={`${styles.toast} ${isVisible ? styles.show : ""} ${
        type === "success" ? styles.success : styles.error
      }`}
    >
      {message}
    </div>
  );
}
