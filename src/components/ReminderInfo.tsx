"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

export default function ReminderInfo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="How reminders work"
        className="shrink-0 text-stone-400 transition-colors active:scale-90 dark:text-stone-500"
      >
        <Info size={15} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="mx-auto w-full max-w-lg rounded-t-2xl bg-white px-5 pb-8 pt-4 dark:bg-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-800 dark:text-stone-100">
                How Reminders Work
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-100 text-stone-500 active:scale-90 dark:bg-stone-800 dark:text-stone-400"
              >
                <X size={14} />
              </button>
            </div>

            <p className="mb-3 text-xs text-stone-500 dark:text-stone-400">
              You&apos;ll get a notification 10 minutes before each favorited event starts.
              The app needs to be open in your browser (it can be in the background).
            </p>

            <div className="mb-3 rounded-lg bg-stone-50 p-3 dark:bg-stone-800/60">
              <p className="mb-1.5 text-xs font-bold text-stone-700 dark:text-stone-200">
                Android (Chrome)
              </p>
              <p className="text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                Just enable the toggle and allow notifications when prompted. That&apos;s it!
              </p>
            </div>

            <div className="rounded-lg bg-stone-50 p-3 dark:bg-stone-800/60">
              <p className="mb-1.5 text-xs font-bold text-stone-700 dark:text-stone-200">
                iPhone (Safari)
              </p>
              <ol className="list-inside list-decimal space-y-1 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
                <li>
                  Tap the <span className="font-semibold text-stone-600 dark:text-stone-300">Share</span> button in Safari (square with arrow)
                </li>
                <li>
                  Tap <span className="font-semibold text-stone-600 dark:text-stone-300">Add to Home Screen</span>
                </li>
                <li>Open the app from your home screen</li>
                <li>Come back here and enable reminders</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
