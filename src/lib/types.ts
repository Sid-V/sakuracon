export interface ConEvent {
  id: string;
  title: string;
  day: "Fri" | "Sat" | "Sun";
  date: string;
  startTime: string;
  endTime: string;
  building: string;
  location: string;
  ageRating: string | null;
  tags: string[];
  description: string | null;
}

export interface FilterState {
  day: "Fri" | "Sat" | "Sun" | null;
  building: string | null;
  ageRating: string | null;
  tag: string | null;
  searchQuery: string;
}
