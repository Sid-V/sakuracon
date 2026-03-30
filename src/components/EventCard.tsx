"use client";

import { useState, memo } from "react";
import { MapPin, Clock, ChevronDown, Tag } from "lucide-react";
import type { ConEvent } from "@/lib/types";
import { formatTimeRange } from "@/lib/events";
import { BUILDING_THEME, AGE_RATING_THEME } from "@/lib/constants";
import FavoriteButton from "./FavoriteButton";

interface EventCardProps {
  event: ConEvent;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function EventCard({
  event,
  isFavorite,
  onToggleFavorite,
}: EventCardProps) {
  const [expanded, setExpanded] = useState(false);

  const theme = BUILDING_THEME[event.building];
  const accent = theme?.accent || "border-l-stone-300";
  const bg = theme?.bg || "bg-stone-50 dark:bg-stone-800";
  const tagColor = theme?.tag || "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300";

  return (
    <div
      className={`border-l-[3px] ${accent} rounded-r-xl ${bg} transition-all`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3 px-4 py-4">
        <div className="min-w-0 flex-1">
          {/* Title */}
          <h3 className="text-lg font-semibold leading-snug text-stone-800 dark:text-stone-100">
            {event.title}
          </h3>

          {/* Time & Location */}
          <div className="mt-2 space-y-1 text-sm text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="shrink-0 text-stone-400 dark:text-stone-500" />
              <span className="font-semibold">{event.day}</span>
              <span>{formatTimeRange(event.startTime, event.endTime)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={14} className="shrink-0 text-stone-400 dark:text-stone-500" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Tags row */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${tagColor}`}>
              {event.building}
            </span>
            {event.ageRating && (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${AGE_RATING_THEME[event.ageRating]?.badge || "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300"}`}>
                {event.ageRating}
              </span>
            )}
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-pink-100 px-2.5 py-0.5 text-xs font-semibold text-pink-600 dark:bg-pink-900/40 dark:text-pink-400"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right side: favorite + expand */}
        <div className="flex flex-col items-center gap-1.5">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
          />
          {event.description && (
            <ChevronDown
              size={16}
              className={`text-stone-300 transition-transform dark:text-stone-600 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {/* Expandable description */}
      {expanded && event.description && (
        <div className="border-t border-stone-200/50 px-4 pb-4 pt-3 dark:border-stone-700/50">
          <p className="text-sm leading-relaxed text-stone-600 dark:text-stone-400">
            {event.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default memo(EventCard);
