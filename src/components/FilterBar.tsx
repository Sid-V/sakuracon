"use client";

import { Search, X } from "lucide-react";
import type { FilterState } from "@/lib/types";
import { days, buildings } from "@/lib/events";
import { BUILDING_THEME, DAY_LABELS } from "@/lib/constants";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

function Pill({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all active:scale-95 ${
        active
          ? `${color || "bg-pink-500"} text-white shadow-sm`
          : "bg-stone-100 text-stone-500 hover:bg-stone-200"
      }`}
    >
      {label}
    </button>
  );
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const setDay = (day: "Fri" | "Sat" | "Sun") =>
    onChange({ ...filters, day: filters.day === day ? null : day });

  const setBuilding = (b: string) =>
    onChange({ ...filters, building: filters.building === b ? null : b });

  const setSearch = (q: string) =>
    onChange({ ...filters, searchQuery: q });

  return (
    <div className="sticky top-[54px] z-40 space-y-2.5 bg-white/90 px-4 pb-3 pt-2 backdrop-blur-lg">
      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
        />
        <input
          type="text"
          placeholder="Search events..."
          value={filters.searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-stone-100 py-2.5 pl-9 pr-9 text-sm text-stone-800 placeholder-stone-400 outline-none ring-pink-300 transition-shadow focus:ring-2"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Day pills */}
      <div className="flex gap-2">
        {days.map((d) => (
          <Pill
            key={d}
            label={DAY_LABELS[d]}
            active={filters.day === d}
            onClick={() => setDay(d)}
          />
        ))}
      </div>

      {/* Building pills */}
      <div className="flex gap-2">
        {buildings.map((b) => (
          <Pill
            key={b}
            label={b}
            active={filters.building === b}
            onClick={() => setBuilding(b)}
            color={BUILDING_THEME[b]?.pill}
          />
        ))}
      </div>
    </div>
  );
}
