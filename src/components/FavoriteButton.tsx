"use client";

import { Heart } from "lucide-react";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export default function FavoriteButton({
  isFavorite,
  onToggle,
}: FavoriteButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all active:scale-90"
    >
      <Heart
        size={20}
        className={`transition-all ${
          isFavorite
            ? "fill-pink-500 text-pink-500 scale-110"
            : "text-stone-300 hover:text-pink-300"
        }`}
      />
    </button>
  );
}
