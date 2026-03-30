"use client";

import { useState } from "react";
import { events } from "@/lib/events";
import type { FilterState } from "@/lib/types";
import { useFavorites } from "@/hooks/useFavorites";
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

  return (
    <>
      <FilterBar filters={filters} onChange={setFilters} />
      <EventList
        events={events}
        filters={filters}
        isFavorite={isFavorite}
        onToggleFavorite={toggle}
      />
    </>
  );
}
