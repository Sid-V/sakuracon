// Building theme colors (Tailwind classes)
export const BUILDING_THEME: Record<
  string,
  { accent: string; bg: string; tag: string; pill: string }
> = {
  Arch: {
    accent: "border-l-rose-400",
    bg: "bg-rose-50",
    tag: "bg-rose-100 text-rose-600",
    pill: "bg-rose-500",
  },
  "Arch Tower": {
    accent: "border-l-violet-400",
    bg: "bg-violet-50",
    tag: "bg-violet-100 text-violet-600",
    pill: "bg-violet-500",
  },
  Summit: {
    accent: "border-l-amber-400",
    bg: "bg-amber-50",
    tag: "bg-amber-100 text-amber-600",
    pill: "bg-amber-500",
  },
};

// Day display labels
export const DAY_LABELS: Record<string, string> = {
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export const DAY_LABELS_WITH_DATE: Record<string, string> = {
  Fri: "Friday, April 3",
  Sat: "Saturday, April 4",
  Sun: "Sunday, April 5",
};
