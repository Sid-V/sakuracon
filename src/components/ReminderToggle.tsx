"use client";

import { Bell, BellOff } from "lucide-react";
import ReminderInfo from "@/components/ReminderInfo";

interface ReminderToggleProps {
  enabled: boolean;
  permissionState: NotificationPermission | "unsupported";
  onEnable: () => void;
  onDisable: () => void;
  onTest: () => void;
}

export default function ReminderToggle({
  enabled,
  permissionState,
  onEnable,
  onDisable,
  onTest,
}: ReminderToggleProps) {
  if (permissionState === "unsupported") return null;

  const denied = permissionState === "denied";

  return (
    <div className="mx-4 mb-2 flex items-center gap-3 rounded-xl bg-stone-100 px-3.5 py-2.5 dark:bg-stone-800/80">
      {enabled ? (
        <Bell size={18} className="shrink-0 text-pink-500" />
      ) : (
        <BellOff size={18} className="shrink-0 text-stone-400 dark:text-stone-500" />
      )}

      <div className="flex-1 min-w-0">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-700 dark:text-stone-200">
          Reminders
          <ReminderInfo />
        </span>
        {denied && (
          <p className="text-[10px] text-stone-400 dark:text-stone-500">
            Notifications blocked in browser settings
          </p>
        )}
      </div>

      {enabled && (
        <button
          onClick={onTest}
          className="shrink-0 rounded-full bg-stone-200 px-2.5 py-1 text-[10px] font-semibold text-stone-600 transition-colors active:scale-95 dark:bg-stone-700 dark:text-stone-300"
        >
          Test
        </button>
      )}

      <button
        onClick={enabled ? onDisable : onEnable}
        disabled={denied}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
          denied
            ? "cursor-not-allowed bg-stone-200 dark:bg-stone-700"
            : enabled
              ? "bg-pink-500"
              : "bg-stone-300 dark:bg-stone-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
