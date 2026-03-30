"use client";

import { useState, memo } from "react";
import { MapPin, Clock, ChevronDown, Tag } from "lucide-react";
import type { ConEvent } from "@/lib/types";
import { formatTimeRange } from "@/lib/events";
import { BUILDING_THEME } from "@/lib/constants";
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
  const bg = theme?.bg || "bg-stone-50";
  const tagColor = theme?.tag || "bg-stone-100 text-stone-600";

  return (
    <div
      className={`border-l-[3px] ${accent} rounded-r-xl ${bg} transition-all`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-2 px-3 py-3">
        <div className="min-w-0 flex-1">
          {/* Title */}
          <h3 className="text-[15px] font-semibold leading-snug text-stone-800">
            {event.title}
          </h3>

          {/* Time & Location */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-stone-400" />
              {formatTimeRange(event.startTime, event.endTime)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-stone-400" />
              <span className="truncate">{event.location}</span>
            </span>
          </div>

          {/* Tags row */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${tagColor}`}>
              {event.building}
            </span>
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded-full bg-pink-100 px-2 py-0.5 text-[10px] font-semibold text-pink-600"
              >
                <Tag size={8} />
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right side: favorite + expand */}
        <div className="flex flex-col items-center gap-1">
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
          />
          {event.description && (
            <ChevronDown
              size={14}
              className={`text-stone-300 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </div>

      {/* Expandable description */}
      {expanded && event.description && (
        <div className="border-t border-stone-200/50 px-3 pb-3 pt-2">
          <p className="text-xs leading-relaxed text-stone-600">
            {event.description}
          </p>
        </div>
      )}
    </div>
  );
}

export default memo(EventCard);
