"use client";

import { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

export default function InfoPopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Info"
        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:text-pink-500 active:scale-90 dark:text-stone-500 dark:hover:text-pink-400"
      >
        <Info size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-pink-100/60 bg-white/95 p-3 shadow-lg backdrop-blur-xl dark:border-stone-700/60 dark:bg-stone-900/95">
          <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
            Enjoying the app? Fuel my Artist alley spend!
          </p>
          <a
            href="https://linktr.ee/sidv5"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-pink-600 active:scale-95"
          >
            Linktree &rarr;
          </a>
        </div>
      )}
    </div>
  );
}
