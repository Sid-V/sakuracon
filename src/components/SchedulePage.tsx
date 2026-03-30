"use client";

import { useState, useMemo } from "react";
import { events, isEventComplete } from "@/lib/events";
import type { FilterState } from "@/lib/types";
import { useFavorites } from "@/hooks/useFavorites";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import FilterBar from "@/components/FilterBar";
import EventList from "@/components/EventList";

export default function SchedulePage() {
  const [filters, setFilters] = useState<FilterState>({
    day: "Fri",
    building: null,
    ageRating: null,
    tag: null,
    searchQuery: "",
  });

  const { isFavorite, toggle } = useFavorites();
  const now = useCurrentTime();
  const scrollDirection = useScrollDirection({ downThreshold: 10, upThreshold: 80 });
  const filterBarHidden = scrollDirection === "down";

  const activeEvents = useMemo(
    () => events.filter((e) => !isEventComplete(e, now)),
    [now]
  );

  return (
    <>
      <FilterBar filters={filters} onChange={setFilters} hidden={filterBarHidden} />
      <EventList
        events={activeEvents}
        filters={filters}
        isFavorite={isFavorite}
        onToggleFavorite={toggle}
        filterBarVisible={!filterBarHidden}
      />
    </>
  );
}
