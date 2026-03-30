import type { Metadata } from "next";
import FavoritesPage from "@/components/FavoritesPage";

export const metadata: Metadata = {
  title: "My Events",
  description:
    "Your saved Sakura-Con 2026 events — view your personalized schedule of favorited panels, workshops, and activities.",
};

export default function Page() {
  return <FavoritesPage />;
}
