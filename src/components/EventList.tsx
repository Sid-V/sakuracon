"use client";

import { useMemo } from "react";
import type { ConEvent, FilterState } from "@/lib/types";
import { timeToMinutes } from "@/lib/events";
import EventCard from "./EventCard";

interface EventListProps {
  events: ConEvent[];
  filters: FilterState;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export default function EventList({
  events,
  filters,
  isFavorite,
  onToggleFavorite,
}: EventListProps) {
  const filtered = useMemo(() => {
    let result = events;

    if (filters.day) {
      result = result.filter((e) => e.day === filters.day);
    }
    if (filters.building) {
      result = result.filter((e) => e.building === filters.building);
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

    // Sort by start time
    result = [...result].sort(
      (a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    return result;
  }, [events, filters]);

  // Group by time slot
  const groups = useMemo(() => {
    const map = new Map<string, ConEvent[]>();
    for (const e of filtered) {
      const key = e.startTime;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return [...map.entries()];
  }, [filtered]);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-lg font-medium text-stone-400">No events found</p>
        <p className="mt-1 text-sm text-stone-300">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-28 pt-2">
      {groups.map(([time, groupEvents]) => (
        <div key={time}>
          {/* Sticky time header */}
          <div className="sticky top-[190px] z-30 -mx-4 mb-2 bg-white/70 px-4 py-1.5 backdrop-blur-md">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500">
              {time}
            </span>
          </div>

          {/* Event cards */}
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
      ))}
    </div>
  );
}
