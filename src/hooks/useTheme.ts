"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "sakuracon-theme";

export function useTheme() {
  // Default to dark mode
  const [dark, setDark] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  // Load preference on mount — default is dark unless explicitly "light"
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light") {
        setDark(false);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // Sync class and localStorage whenever dark changes
  useEffect(() => {
    if (!hydrated) return;
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch {
      // ignore
    }
  }, [dark, hydrated]);

  const toggle = useCallback(() => {
    setDark((prev) => !prev);
  }, []);

  return { dark, toggle, hydrated };
}
