"use client";

import { useState, useEffect, useRef } from "react";

type ScrollDirection = "up" | "down" | null;

export function useScrollDirection({
  downThreshold = 10,
  upThreshold = 10,
}: { downThreshold?: number; upThreshold?: number } = {}): ScrollDirection {
  const [direction, setDirection] = useState<ScrollDirection>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const updateDirection = () => {
      const scrollY = window.scrollY;
      const diff = scrollY - lastScrollY.current;
      const activeThreshold = diff > 0 ? downThreshold : upThreshold;

      if (Math.abs(diff) < activeThreshold) {
        ticking.current = false;
        return;
      }

      const next = diff > 0 ? "down" : "up";
      setDirection(prev => prev === next ? prev : next);
      lastScrollY.current = scrollY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateDirection);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [downThreshold, upThreshold]);

  return direction;
}
