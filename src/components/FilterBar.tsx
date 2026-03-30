"use client";

import { Search, X } from "lucide-react";
import type { FilterState } from "@/lib/types";
import { days, buildings, ageRatings, tags } from "@/lib/events";
import { BUILDING_THEME, DAY_LABELS, AGE_RATING_THEME } from "@/lib/constants";

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  hidden?: boolean;
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
      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide transition-all active:scale-95 ${
        active
          ? `${color || "bg-pink-500"} text-white shadow-sm`
          : "bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700"
      }`}
    >
      {label}
    </button>
  );
}

const labelClass = "w-10 shrink-0 text-[9px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500";

export default function FilterBar({ filters, onChange, hidden }: FilterBarProps) {
  const setDay = (day: "Fri" | "Sat" | "Sun") =>
    onChange({ ...filters, day: filters.day === day ? null : day });

  const setBuilding = (b: string) =>
    onChange({ ...filters, building: filters.building === b ? null : b });

  const setAgeRating = (r: string) =>
    onChange({ ...filters, ageRating: filters.ageRating === r ? null : r });

  const setTag = (t: string) =>
    onChange({ ...filters, tag: filters.tag === t ? null : t });

  const setSearch = (q: string) =>
    onChange({ ...filters, searchQuery: q });

  return (
    <div className={`sticky top-[54px] z-40 space-y-1.5 bg-white/90 px-3 pb-2 pt-1.5 backdrop-blur-lg dark:bg-stone-950/90 transition-transform duration-300 ease-out ${hidden ? "-translate-y-full pointer-events-none" : "translate-y-0"}`}>
      {/* Search */}
      <div className="relative">
        <Search
          size={14}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500"
        />
        <input
          type="text"
          placeholder="Search events..."
          value={filters.searchQuery}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl bg-stone-100 py-2 pl-8 pr-8 text-xs text-stone-800 placeholder-stone-400 outline-none ring-pink-300 transition-shadow focus:ring-2 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 dark:ring-pink-500/50"
        />
        {filters.searchQuery && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Day pills */}
      <div className="flex items-center gap-1.5">
        <span className={labelClass}>Day</span>
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
      <div className="flex items-center gap-1.5">
        <span className={labelClass}>Venue</span>
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

      {/* Age rating pills */}
      <div className="flex items-center gap-1.5">
        <span className={labelClass}>Ages</span>
        {ageRatings.map((r) => (
          <Pill
            key={r}
            label={r}
            active={filters.ageRating === r}
            onClick={() => setAgeRating(r)}
            color={AGE_RATING_THEME[r]?.pill}
          />
        ))}
      </div>

      {/* Tag pills */}
      <div className="flex items-start gap-1.5">
        <span className={`${labelClass} pt-1.5`}>Tags</span>
        <div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <Pill
                key={t}
                label={t}
                active={filters.tag === t}
                onClick={() => setTag(t)}
              />
            ))}
          </div>
          <p className="mt-1 text-[9px] text-stone-400 dark:text-stone-500">
            Not all events have tags (use with caution)
          </p>
        </div>
      </div>
    </div>
  );
}
