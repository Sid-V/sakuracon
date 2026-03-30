import type { Metadata } from "next";
import SchedulePage from "@/components/SchedulePage";

export const metadata: Metadata = {
  title: "Schedule",
  description:
    "Full event schedule for Sakura-Con 2026 — browse panels, workshops, screenings, and more. Filter by day, venue, age rating, and tags.",
};

export default function Page() {
  return <SchedulePage />;
}
