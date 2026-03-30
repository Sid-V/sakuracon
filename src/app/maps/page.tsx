import type { Metadata } from "next";
import MapsPage from "@/components/MapsPage";

export const metadata: Metadata = {
  title: "Maps",
  description:
    "Venue maps for Sakura-Con 2026 — find your way around the Arch, Arch Tower, and Summit buildings at the Seattle Convention Center.",
};

export default function Page() {
  return <MapsPage />;
}
