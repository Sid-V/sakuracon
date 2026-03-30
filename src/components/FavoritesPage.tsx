"use client";

import { useState, useMemo } from "react";
import { Heart } from "lucide-react";
import { events, days, timeToMinutes, isEventComplete } from "@/lib/events";
import type { FilterState } from "@/lib/types";
import { useFavorites } from "@/hooks/useFavorites";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useReminders } from "@/hooks/useReminders";
import FilterBar from "@/components/FilterBar";
import EventList from "@/components/EventList";
import ReminderToggle from "@/components/ReminderToggle";

export default function FavoritesPage() {
  const { favoriteIds, isFavorite, toggle, hydrated } = useFavorites();
  const now = useCurrentTime();

  const [filters, setFilters] = useState<FilterState>({
    day: null,
    building: null,
    ageRating: null,
    tag: null,
    searchQuery: "",
  });
  const scrollDirection = useScrollDirection({ downThreshold: 10, upThreshold: 80 });
  const filterBarHidden = scrollDirection === "down";
  const reminders = useReminders(favoriteIds);

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
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 dark:bg-pink-950/30">
          <Heart size={28} className="text-pink-300 dark:text-pink-600" />
        </div>
        <p className="text-lg font-semibold text-stone-600 dark:text-stone-300">
          No upcoming events
        </p>
        <p className="mt-2 text-sm leading-relaxed text-stone-400 dark:text-stone-500">
          Tap the heart icon on any event in the Schedule tab to save it here.
          Completed events are automatically hidden.
        </p>
      </div>
    );
  }

  return (
    <>
      <ReminderToggle
        enabled={reminders.remindersEnabled}
        permissionState={reminders.permissionState}
        onEnable={reminders.enableReminders}
        onDisable={reminders.disableReminders}
        onTest={reminders.sendTestNotification}
      />
      <FilterBar filters={filters} onChange={setFilters} hidden={filterBarHidden} />
      <EventList
        events={favoriteEvents}
        filters={filters}
        isFavorite={isFavorite}
        onToggleFavorite={toggle}
        filterBarVisible={!filterBarHidden}
      />
    </>
  );
}
