"use client";

import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "./icon";
import styles from "./styles.module.css";

export function ThemeToggleButton() {
  const [effectiveTheme, setEffectiveTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const initialTheme = storedTheme || "light";
    setEffectiveTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    setEffectiveTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      return newTheme;
    });
  };

  return (
    <Button
      variant="secondary"
      onClick={toggleTheme}
      className={styles.themeToggle}
      aria-label={
        effectiveTheme === "light"
          ? "Switch to dark theme"
          : "Switch to light theme"
      }
    >
      {effectiveTheme === "light" ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}
