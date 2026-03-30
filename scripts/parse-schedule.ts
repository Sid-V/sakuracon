import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";
import type { ConEvent } from "../src/lib/types";

const DAY_ABBREV_MAP: Record<string, { day: "Fri" | "Sat" | "Sun"; date: string }> = {
  Fri: { day: "Fri", date: "2026-04-03" },
  Sat: { day: "Sat", date: "2026-04-04" },
  Sun: { day: "Sun", date: "2026-04-05" },
};

// Same-day event: "Fri 10:00 AM – 11:00 AM Event Title"
const EVENT_HEADER_RE =
  /^(Fri|Sat|Sun)\s+(\d{1,2}:\d{2}\s+[AP]M)\s+[–—-]\s+(\d{1,2}:\d{2}\s+[AP]M)\s+(.+)$/;

// Cross-day time (no title): "Fri 10:00 PM – Sat 2:00 AM"
const CROSS_DAY_TIME_RE =
  /^(Fri|Sat|Sun)\s+(\d{1,2}:\d{2}\s+[AP]M)\s+[–—-]\s+(Fri|Sat|Sun)\s+(\d{1,2}:\d{2}\s+[AP]M)\s*$/;

// Same-day orphaned time (no title): "Sun 11:30 AM – 12:30 PM"
const SAME_DAY_TIME_RE =
  /^(Fri|Sat|Sun)\s+(\d{1,2}:\d{2}\s+[AP]M)\s+[–—-]\s+(\d{1,2}:\d{2}\s+[AP]M)\s*$/;

// Match section heading: "#### Arch Tower — Friday, April 3"
const SECTION_RE = /^####\s+(.+?)\s+[—–-]+\s+(.+)$/;

function looksLikeLocation(line: string): boolean {
  if (/\[(All Ages|\d+\+)\]/.test(line)) return true;
  if (/•/.test(line)) return true;
  if (/\b(Panels|Gaming|Stage|Theater|Workshop|Ballroom|Room|Skagit|Tahoma|Cafe|Flex|Mainstage|SakuraDome|Hall|Exhibit|Prog|Arts|Crafts|Dance|Lessons|Autographs|Dreamland|Maid|Mahjong|Tournament|Social|Deception|Board|RPG|Modeling|AMV)\b/i.test(line)) return true;
  return false;
}

function generateId(day: string, startTime: string, title: string, location: string): string {
  const hash = createHash("sha256")
    .update(`${day}|${startTime}|${title}|${location}`)
    .digest("hex");
  return hash.substring(0, 8);
}

function parseLocationLine(line: string): { location: string; tags: string[]; ageRating: string | null } {
  const tags: string[] = [];
  let ageRating: string | null = null;
  let locationPart = line;

  const ageMatch = locationPart.match(/\s*\[(All Ages|\d+\+)\]\s*$/);
  if (ageMatch) {
    ageRating = ageMatch[1];
    locationPart = locationPart.substring(0, ageMatch.index!);
  }

  const bulletIdx = locationPart.indexOf("•");
  if (bulletIdx !== -1) {
    const tagStr = locationPart.substring(bulletIdx + 1).trim();
    if (tagStr) {
      tags.push(tagStr);
    }
    locationPart = locationPart.substring(0, bulletIdx).trim();
  }

  if (!locationPart && tags.length > 0) {
    locationPart = tags[0];
  }

  return { location: locationPart, tags, ageRating };
}

function preprocess(raw: string): string[] {
  const rawLines = raw.split("\n");
  const lines: string[] = [];
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const nextLine = rawLines[i + 1]?.trim();

    if (nextLine === "AM" || nextLine === "PM") {
      // Join "12:30\nPM" → "12:30 PM" and "12:\nAM" → "12:00 AM"
      const fixed = line.replace(/(\d+):\s*$/, "$1:00");
      lines.push(fixed + " " + nextLine);
      i++;
    } else if (nextLine && /^\d{1,2}:\d{2}\s+[AP]M$/.test(nextLine) && /[–—-]\s+(Fri|Sat|Sun)\s*$/.test(line)) {
      // Join "Sat 10:30 PM – Sun\n12:00 AM" → "Sat 10:30 PM – Sun 12:00 AM"
      lines.push(line + " " + nextLine);
      i++;
    } else {
      lines.push(line);
    }
  }
  return lines;
}

interface CrossDayTime {
  startDay: "Fri" | "Sat" | "Sun";
  startDate: string;
  startTime: string;
  endDay: "Fri" | "Sat" | "Sun";
  endDate: string;
  endTime: string;
  building: string;
}

function parse(): ConEvent[] {
  const rootDir = join(__dirname, "..");
  const raw = readFileSync(join(rootDir, "schedule.md"), "utf-8");
  const lines = preprocess(raw);

  const events: ConEvent[] = [];
  let currentBuilding = "";
  let inCodeBlock = false;
  let pendingEvent: Partial<ConEvent> | null = null;
  let descriptionLines: string[] = [];
  // Cross-day time detected at end of a code block, waiting for next block's title
  let pendingCrossDay: CrossDayTime | null = null;
  // Same-day orphaned time, waiting for next block's title
  let pendingSameDay: { day: "Fri" | "Sat" | "Sun"; date: string; startTime: string; endTime: string } | null = null;

  function flushEvent() {
    if (pendingEvent && pendingEvent.title && pendingEvent.startTime) {
      pendingEvent.description =
        descriptionLines.length > 0
          ? descriptionLines.join(" ").trim()
          : null;
      pendingEvent.id = generateId(
        pendingEvent.day!,
        pendingEvent.startTime!,
        pendingEvent.title!,
        pendingEvent.location!
      );
      events.push(pendingEvent as ConEvent);
    }
    pendingEvent = null;
    descriptionLines = [];
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();

    // Check for section headings
    const sectionMatch = line.match(SECTION_RE);
    if (sectionMatch) {
      flushEvent();
      currentBuilding = sectionMatch[1].trim();
      continue;
    }

    // Track code blocks
    if (line.trim() === "```") {
      if (inCodeBlock) {
        flushEvent();
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (!inCodeBlock) continue;

    // Try cross-day time line (no title): "Fri 10:00 PM – Sat 2:00 AM"
    const crossDayMatch = line.match(CROSS_DAY_TIME_RE);
    if (crossDayMatch) {
      // If there's a pending event without times (title-first block), apply as cross-day times
      if (pendingEvent && pendingEvent.location && !pendingEvent.startTime) {
        const [, startDayAbbrev, startTime, endDayAbbrev, endTime] = crossDayMatch;
        const startDayInfo = DAY_ABBREV_MAP[startDayAbbrev];
        const endDayInfo = DAY_ABBREV_MAP[endDayAbbrev];
        pendingEvent.day = startDayInfo.day;
        pendingEvent.date = startDayInfo.date;
        pendingEvent.startTime = startTime.trim();
        pendingEvent.endTime = "11:59 PM";
        // Create second-half event
        (pendingEvent as any)._crossDay = {
          startDay: startDayInfo.day, startDate: startDayInfo.date, startTime: startTime.trim(),
          endDay: endDayInfo.day, endDate: endDayInfo.date, endTime: endTime.trim(),
          building: currentBuilding,
        };
      } else {
        flushEvent();
        const [, startDayAbbrev, startTime, endDayAbbrev, endTime] = crossDayMatch;
        const startDayInfo = DAY_ABBREV_MAP[startDayAbbrev];
        const endDayInfo = DAY_ABBREV_MAP[endDayAbbrev];
        pendingCrossDay = {
          startDay: startDayInfo.day,
          startDate: startDayInfo.date,
          startTime: startTime.trim(),
          endDay: endDayInfo.day,
          endDate: endDayInfo.date,
          endTime: endTime.trim(),
          building: currentBuilding,
        };
      }
      continue;
    }

    // Try same-day orphaned time (no title): "Sun 11:30 AM – 12:30 PM"
    const sameDayTimeMatch = line.match(SAME_DAY_TIME_RE);
    if (sameDayTimeMatch) {
      const [, dayAbbrev, startTime, endTime] = sameDayTimeMatch;
      const dayInfo = DAY_ABBREV_MAP[dayAbbrev];
      // If there's a pending event without times (title-first block), apply times to it
      if (pendingEvent && pendingEvent.location && !pendingEvent.startTime) {
        pendingEvent.day = dayInfo.day;
        pendingEvent.date = dayInfo.date;
        pendingEvent.startTime = startTime.trim();
        pendingEvent.endTime = endTime.trim();
      } else {
        // Store for the next code block's title-first event
        pendingSameDay = { day: dayInfo.day, date: dayInfo.date, startTime: startTime.trim(), endTime: endTime.trim() };
      }
      continue;
    }

    // Try same-day header: "Fri 10:00 AM – 11:00 AM Title"
    const headerMatch = line.match(EVENT_HEADER_RE);
    if (headerMatch) {
      flushEvent();
      pendingCrossDay = null;
      pendingSameDay = null;

      const [, dayAbbrev, startTime, endTime, title] = headerMatch;
      const dayInfo = DAY_ABBREV_MAP[dayAbbrev];

      pendingEvent = {
        title: title.trim(),
        day: dayInfo?.day || "Fri",
        date: dayInfo?.date || "2026-04-03",
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        building: currentBuilding,
        location: "",
        ageRating: null,
        tags: [],
      };
      continue;
    }

    // If we have no pending event, this line starts a new event
    if (!pendingEvent) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (pendingCrossDay) {
        // Title for a cross-day event whose time was in the previous block
        pendingEvent = {
          title: trimmed,
          day: pendingCrossDay.startDay,
          date: pendingCrossDay.startDate,
          startTime: pendingCrossDay.startTime,
          endTime: "11:59 PM",
          building: pendingCrossDay.building,
          location: "",
          ageRating: null,
          tags: [],
        };
        (pendingEvent as any)._crossDay = pendingCrossDay;
        pendingCrossDay = null;
      } else if (pendingSameDay) {
        // Title for a same-day event whose time was in the previous block
        pendingEvent = {
          title: trimmed,
          day: pendingSameDay.day,
          date: pendingSameDay.date,
          startTime: pendingSameDay.startTime,
          endTime: pendingSameDay.endTime,
          building: currentBuilding,
          location: "",
          ageRating: null,
          tags: [],
        };
        pendingSameDay = null;
      } else {
        // Title-first event (time will appear later in the block)
        pendingEvent = {
          title: trimmed,
          day: "" as any,
          date: "",
          startTime: "",
          endTime: "",
          building: currentBuilding,
          location: "",
          ageRating: null,
          tags: [],
        };
      }
      continue;
    }

    // If we have a pending event with no location yet
    if (pendingEvent && !pendingEvent.location) {
      const trimmed = line.trim();

      if (looksLikeLocation(trimmed)) {
        const { location, tags, ageRating } = parseLocationLine(trimmed);
        pendingEvent.location = location;
        pendingEvent.tags = tags;
        pendingEvent.ageRating = ageRating;

        // If cross-day, create the second-half event (skip if end time is midnight — no second half needed)
        const crossDay = (pendingEvent as any)._crossDay as CrossDayTime | undefined;
        if (crossDay) {
          delete (pendingEvent as any)._crossDay;
          // If the event ends at midnight, just set the first event's end to 12:00 AM and skip second half
          if (crossDay.endTime === "12:00 AM") {
            pendingEvent.endTime = "12:00 AM";
          } else {
          const secondEvent: ConEvent = {
            title: pendingEvent.title!,
            day: crossDay.endDay,
            date: crossDay.endDate,
            startTime: "12:00 AM",
            endTime: crossDay.endTime,
            building: pendingEvent.building!,
            location: pendingEvent.location,
            ageRating: pendingEvent.ageRating ?? null,
            tags: [...(pendingEvent.tags || [])],
            description: null, // will be set at flush
            id: "",
          };
          secondEvent.id = generateId(
            secondEvent.day,
            secondEvent.startTime,
            secondEvent.title,
            secondEvent.location
          );
          (pendingEvent as any)._secondEvent = secondEvent;
          }
        }
      } else {
        // Wrapped title continuation
        pendingEvent.title = pendingEvent.title + " " + trimmed;
      }
      continue;
    }

    // Description line
    if (pendingEvent) {
      const trimmed = line.trim();
      if (trimmed) {
        descriptionLines.push(trimmed);
      }
    }
  }

  flushEvent();

  // Post-process: extract second-half cross-day events
  const allEvents: ConEvent[] = [];
  for (const event of events) {
    const secondEvent = (event as any)._secondEvent;
    if (secondEvent) {
      delete (event as any)._secondEvent;
      secondEvent.description = event.description;
      allEvents.push(event);
      allEvents.push(secondEvent as ConEvent);
    } else {
      allEvents.push(event);
    }
  }

  return allEvents;
}

const events = parse();

const outDir = join(__dirname, "..", "src", "data");
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "events.json"), JSON.stringify(events, null, 2));

console.log(`Parsed ${events.length} events`);

// Print summary by day and building
const summary: Record<string, number> = {};
for (const e of events) {
  const key = `${e.day} - ${e.building}`;
  summary[key] = (summary[key] || 0) + 1;
}
for (const [key, count] of Object.entries(summary).sort()) {
  console.log(`  ${key}: ${count}`);
}
