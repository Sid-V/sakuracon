"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { events, timeToMinutes } from "@/lib/events";
import type { ConEvent } from "@/lib/types";

const ENABLED_KEY = "sakuracon-reminders";
const NOTIFIED_KEY = "sakuracon-notified";
const REMINDER_LEAD_MS = 10 * 60 * 1000; // 10 minutes
const POLL_INTERVAL_MS = 30_000; // 30 seconds

function getEventStartDate(event: ConEvent): Date {
  const minutes = timeToMinutes(event.startTime);
  const date = new Date(event.date + "T00:00:00");
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return date;
}

function loadNotified(): Set<string> {
  try {
    const stored = localStorage.getItem(NOTIFIED_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function saveNotified(ids: Set<string>) {
  try {
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...ids]));
  } catch {
    // ignore
  }
}

async function showNotification(title: string, options: NotificationOptions) {
  // Prefer service worker notifications (required for iOS PWA)
  if ("serviceWorker" in navigator) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      await reg.showNotification(title, options);
      return;
    }
  }
  // Fallback to direct Notification API
  new Notification(title, options);
}

export function useReminders(favoriteIds: Set<string>) {
  const [enabled, setEnabled] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission | "unsupported">("default");
  const [hydrated, setHydrated] = useState(false);
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof Notification === "undefined") {
      setPermissionState("unsupported");
    } else {
      setPermissionState(Notification.permission);
    }

    try {
      const stored = localStorage.getItem(ENABLED_KEY);
      if (stored === "true" && typeof Notification !== "undefined" && Notification.permission === "granted") {
        setEnabled(true);
      }
    } catch {
      // ignore
    }

    notifiedRef.current = loadNotified();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!enabled || !hydrated) return;

    const check = () => {
      const now = new Date();
      const favoriteEvents = events.filter((e) => favoriteIds.has(e.id));

      for (const event of favoriteEvents) {
        if (notifiedRef.current.has(event.id)) continue;

        const startDate = getEventStartDate(event);
        const diff = startDate.getTime() - now.getTime();

        if (diff > 0 && diff <= REMINDER_LEAD_MS) {
          showNotification("Sakura-Con 2026", {
            body: `${event.title} starts in 10 minutes!\n${event.location}`,
            icon: "/icon-192.png",
          });
          notifiedRef.current.add(event.id);
          saveNotified(notifiedRef.current);
        }
      }
    };

    check();
    const id = setInterval(check, POLL_INTERVAL_MS);

    // Re-check immediately when the app returns to foreground (catches missed reminders on iOS)
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [enabled, hydrated, favoriteIds]);

  const enableReminders = useCallback(async () => {
    if (typeof Notification === "undefined") return;

    const permission = await Notification.requestPermission();
    setPermissionState(permission);

    if (permission === "granted") {
      setEnabled(true);
      try {
        localStorage.setItem(ENABLED_KEY, "true");
      } catch {
        // ignore
      }
    }
  }, []);

  const disableReminders = useCallback(() => {
    setEnabled(false);
    try {
      localStorage.setItem(ENABLED_KEY, "false");
    } catch {
      // ignore
    }
  }, []);

  const sendTestNotification = useCallback(() => {
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    showNotification("Sakura-Con 2026", {
      body: "Reminders are working! You'll be notified 10 minutes before your events.",
      icon: "/icon-192.png",
    });
  }, []);

  return {
    remindersEnabled: enabled,
    enableReminders,
    disableReminders,
    sendTestNotification,
    permissionState,
    hydrated,
  };
}
