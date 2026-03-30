"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { dark, toggle, hydrated } = useTheme();

  if (!hydrated) return <div className="h-8 w-8" />;

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:text-pink-500 active:scale-90 dark:text-stone-500 dark:hover:text-pink-400"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
