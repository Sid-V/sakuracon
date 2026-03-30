import eventsData from "@/data/events.json";
import type { ConEvent } from "./types";

export const events: ConEvent[] = eventsData as ConEvent[];

// Parse "10:00 AM" -> minutes since midnight for sorting
export function timeToMinutes(time: string): number {
  const match = time.match(/^(\d{1,2}):(\d{2})\s+(AM|PM)$/);
  if (!match) return 0;
  const [, h, m, period] = match;
  let hours = parseInt(h, 10);
  const minutes = parseInt(m, 10);
  if (period === "AM" && hours === 12) hours = 0;
  if (period === "PM" && hours !== 12) hours += 12;
  return hours * 60 + minutes;
}

// Check if an event is complete given the current time
export function isEventComplete(event: ConEvent, now: Date): boolean {
  const endMinutes = timeToMinutes(event.endTime);
  const endDate = new Date(event.date + "T00:00:00");
  endDate.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);
  return now > endDate;
}

// Get unique buildings
export const buildings = [...new Set(events.map((e) => e.building))].sort();

// Get unique days in order
export const days: ("Fri" | "Sat" | "Sun")[] = ["Fri", "Sat", "Sun"];

// Get unique age ratings in display order
export const ageRatings = ["All Ages", "10+", "13+", "18+"];

// Get unique tags
export const tags = [...new Set(events.flatMap((e) => e.tags))].sort();

// Format time range for display
export function formatTimeRange(start: string, end: string): string {
  return `${start} – ${end}`;
}
