export interface ConEvent {
  id: string;
  title: string;
  day: "Fri" | "Sat" | "Sun";
  date: string; // "2026-04-03"
  startTime: string; // "10:00 AM"
  endTime: string; // "11:00 AM"
  building: string; // "Arch", "Arch Tower", "Summit"
  location: string; // Full location string e.g. "Arch Prog Panels - 303"
  tags: string[]; // ["Cultural Panel"], ["Autographs"], etc.
  description: string | null;
}

export interface FilterState {
  day: "Fri" | "Sat" | "Sun" | null;
  building: string | null;
  searchQuery: string;
}
