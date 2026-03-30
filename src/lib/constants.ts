// Building theme colors (Tailwind classes)
export const BUILDING_THEME: Record<
  string,
  { accent: string; bg: string; tag: string; pill: string }
> = {
  Arch: {
    accent: "border-l-rose-400",
    bg: "bg-rose-50 dark:bg-rose-950/30",
    tag: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    pill: "bg-rose-500",
  },
  "Arch Tower": {
    accent: "border-l-violet-400",
    bg: "bg-violet-50 dark:bg-violet-950/30",
    tag: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
    pill: "bg-violet-500",
  },
  Summit: {
    accent: "border-l-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    tag: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
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

// Age rating theme colors
export const AGE_RATING_THEME: Record<string, { pill: string; badge: string }> = {
  "All Ages": {
    pill: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  "10+": {
    pill: "bg-sky-500",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
  },
  "13+": {
    pill: "bg-orange-500",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  },
  "18+": {
    pill: "bg-red-500",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
};
