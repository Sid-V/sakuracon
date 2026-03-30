"use client";

import { useMemo } from "react";
import { Heart } from "lucide-react";
import { events, days, timeToMinutes, isEventComplete } from "@/lib/events";
import { DAY_LABELS_WITH_DATE } from "@/lib/constants";
import { useFavorites } from "@/hooks/useFavorites";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import EventCard from "@/components/EventCard";

export default function FavoritesPage() {
  const { favoriteIds, isFavorite, toggle, hydrated } = useFavorites();
  const now = useCurrentTime();

  const favoriteEvents = useMemo(() => {
    if (!hydrated) return [];

    return events
      .filter((e) => favoriteIds.has(e.id))
      .filter((e) => !isEventComplete(e, now))
      .sort((a, b) => {
        const dayDiff = days.indexOf(a.day) - days.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;
        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      });
  }, [favoriteIds, hydrated, now]);

  // Group by day
  const grouped = useMemo(() => {
    const map = new Map<string, typeof favoriteEvents>();
    for (const e of favoriteEvents) {
      if (!map.has(e.day)) map.set(e.day, []);
      map.get(e.day)!.push(e);
    }
    return [...map.entries()];
  }, [favoriteEvents]);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-pink-300 border-t-transparent" />
      </div>
    );
  }

  if (favoriteEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-50">
          <Heart size={28} className="text-pink-300" />
        </div>
        <p className="text-lg font-semibold text-stone-600">
          No upcoming events
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone-400">
          Tap the heart icon on any event in the Schedule tab to save it here.
          Completed events are automatically hidden.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4 pb-28 pt-4">
      {grouped.map(([day, dayEvents]) => (
        <div key={day}>
          <div className="mb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500">
              {DAY_LABELS_WITH_DATE[day] || day}
            </span>
          </div>
          <div className="space-y-2">
            {dayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                isFavorite={isFavorite(event.id)}
                onToggleFavorite={() => toggle(event.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
