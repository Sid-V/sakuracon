"use client";

import { ExternalLink } from "lucide-react";
import { BUILDING_THEME } from "@/lib/constants";

const MAPS = [
  {
    building: "Arch",
    floors: [
      { name: "Level 2", id: 16568 },
      { name: "Level 3", id: 16561 },
      { name: "Level 4", id: 16562 },
      { name: "Level 6", id: 16563 },
      { name: "Artist Alley - 4EF", id: 16575 },
    ],
  },
  {
    building: "Arch Tower",
    floors: [
      { name: "Yakima - Level 1", id: 16564 },
      { name: "Skagit - Lower Level", id: 16565 },
      { name: "Chelan - Level 2", id: 16567 },
      { name: "Tahoma - Level 3", id: 16566 },
    ],
  },
  {
    building: "Summit",
    floors: [
      { name: "Level 1", id: 16569 },
      { name: "Level 2", id: 16570 },
      { name: "Level 3", id: 16571 },
      { name: "Level 4", id: 16572 },
      { name: "Level 5", id: 16576 },
      { name: "Exhibit Hall", id: 16577 },
    ],
  },
];

function mapUrl(mapId: number) {
  return `https://www.eventeny.com/events/map/?id=19902&mid=${mapId}`;
}

export default function MapsPage() {
  return (
    <div className="space-y-6 px-4 pb-28 pt-4">
      {MAPS.map(({ building, floors }) => {
        const theme = BUILDING_THEME[building];
        return (
          <div key={building}>
            <div className="mb-3 px-1">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold text-white ${theme?.pill || "bg-pink-500"}`}>
                {building}
              </span>
            </div>
            <div className="space-y-2">
              {floors.map((floor) => (
                <a
                  key={floor.id}
                  href={mapUrl(floor.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between rounded-xl border-l-[3px] ${theme?.accent || "border-l-stone-300"} ${theme?.bg || "bg-stone-50 dark:bg-stone-800"} px-4 py-3.5 transition-all active:scale-[0.98]`}
                >
                  <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
                    {floor.name}
                  </span>
                  <ExternalLink size={16} className="shrink-0 text-stone-400 dark:text-stone-500" />
                </a>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
