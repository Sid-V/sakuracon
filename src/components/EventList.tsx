"use client";

import { useMemo } from "react";
import type { ConEvent, FilterState } from "@/lib/types";
import { timeToMinutes, days } from "@/lib/events";
import { DAY_LABELS } from "@/lib/constants";
import EventCard from "./EventCard";

interface EventListProps {
  events: ConEvent[];
  filters: FilterState;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  filterBarVisible?: boolean;
}

export default function EventList({
  events,
  filters,
  isFavorite,
  onToggleFavorite,
  filterBarVisible = true,
}: EventListProps) {
  const filtered = useMemo(() => {
    let result = events;

    if (filters.day) {
      result = result.filter((e) => e.day === filters.day);
    }
    if (filters.building) {
      result = result.filter((e) => e.building === filters.building);
    }
    if (filters.ageRating) {
      result = result.filter((e) => e.ageRating === filters.ageRating);
    }
    if (filters.tag) {
      result = result.filter((e) => e.tags.includes(filters.tag!));
    }
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort by day first, then by start time
    result = [...result].sort((a, b) => {
      const dayDiff = days.indexOf(a.day) - days.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
    });

    return result;
  }, [events, filters]);

  // Group by day+time when no day filter, or just time when day is filtered
  const showDayHeaders = !filters.day;

  const groups = useMemo(() => {
    const map = new Map<string, ConEvent[]>();
    for (const e of filtered) {
      const key = showDayHeaders ? `${e.day}|${e.startTime}` : e.startTime;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return [...map.entries()];
  }, [filtered, showDayHeaders]);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-lg font-medium text-stone-400 dark:text-stone-500">No events found</p>
        <p className="mt-1 text-sm text-stone-300 dark:text-stone-600">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-28 pt-2">
      {groups.map(([key, groupEvents]) => {
        const day = showDayHeaders ? key.split("|")[0] : "";
        const time = showDayHeaders ? key.split("|")[1] : key;

        return (
          <div key={key}>
            <div className={`sticky z-30 -mx-4 mb-2 bg-white/70 px-4 py-1.5 backdrop-blur-md dark:bg-stone-950/70 transition-[top] duration-300 ease-out ${filterBarVisible ? "top-[222px]" : "top-[54px]"}`}>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-500 dark:text-pink-400">
                {showDayHeaders ? `${DAY_LABELS[day] || day} · ${time}` : time}
              </span>
            </div>

            <div className="space-y-2">
              {groupEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isFavorite={isFavorite(event.id)}
                  onToggleFavorite={() => onToggleFavorite(event.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
