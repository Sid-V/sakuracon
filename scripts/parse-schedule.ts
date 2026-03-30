import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { createHash } from "crypto";
import { join } from "path";
import type { ConEvent } from "../src/lib/types";

const DAY_ABBREV_MAP: Record<string, { day: "Fri" | "Sat" | "Sun"; date: string }> = {
  Fri: { day: "Fri", date: "2026-04-03" },
  Sat: { day: "Sat", date: "2026-04-04" },
  Sun: { day: "Sun", date: "2026-04-05" },
};

// Match event header: "Fri 10:00 AM – 11:00 AM Event Title"
const EVENT_HEADER_RE =
  /^(Fri|Sat|Sun)\s+(\d{1,2}:\d{2}\s+[AP]M)\s+[–—-]\s+(\d{1,2}:\d{2}\s+[AP]M)\s+(.+)$/;

// Match section heading: "#### Arch Tower — Friday, April 3"
const SECTION_RE = /^####\s+(.+?)\s+[—–-]+\s+(.+)$/;

function generateId(day: string, startTime: string, title: string, location: string): string {
  const hash = createHash("sha256")
    .update(`${day}|${startTime}|${title}|${location}`)
    .digest("hex");
  return hash.substring(0, 8);
}

function parseLocationLine(line: string): { location: string; tags: string[] } {
  const tags: string[] = [];

  // Extract tags marked with bullet "•"
  // e.g. "Dreamland Maid Cafe - Elliot Bay Room • Cultural Panel [All Ages]"
  // e.g. "Charity Auction • Charity Auction"
  // e.g. "Autographs - Flex A and B • Autographs"
  let locationPart = line;

  // Remove age rating bracket at end: [All Ages], [10+], [13+], [18+]
  locationPart = locationPart.replace(/\s*\[(?:All Ages|\d+\+)\]\s*$/, "");

  // Extract tags after bullet
  const bulletIdx = locationPart.indexOf("•");
  if (bulletIdx !== -1) {
    const tagStr = locationPart.substring(bulletIdx + 1).trim();
    if (tagStr) {
      tags.push(tagStr);
    }
    locationPart = locationPart.substring(0, bulletIdx).trim();
  }

  // If location is empty after removing tag (e.g. "Charity Auction • Charity Auction")
  // use the tag as the location
  if (!locationPart && tags.length > 0) {
    locationPart = tags[0];
  }

  return { location: locationPart, tags };
}

function parse(): ConEvent[] {
  const rootDir = join(__dirname, "..");
  const raw = readFileSync(join(rootDir, "schedule.md"), "utf-8");
  const lines = raw.split("\n");

  const events: ConEvent[] = [];
  let currentBuilding = "";
  let inCodeBlock = false;
  let pendingEvent: Partial<ConEvent> | null = null;
  let descriptionLines: string[] = [];

  function flushEvent() {
    if (pendingEvent && pendingEvent.title) {
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
      // sectionMatch[2] contains the day info (e.g. "Friday, April 3")
      continue;
    }

    // Track code blocks
    if (line.trim() === "```") {
      if (inCodeBlock) {
        // Closing code block - flush any pending event
        flushEvent();
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (!inCodeBlock) continue;

    // Try to match event header
    const headerMatch = line.match(EVENT_HEADER_RE);
    if (headerMatch) {
      // Flush previous event
      flushEvent();

      const [, dayAbbrev, startTime, endTime, title] = headerMatch;
      const dayInfo = DAY_ABBREV_MAP[dayAbbrev];

      // For late-night events (e.g., "Sat 12:00 AM" listed under Friday section),
      // use the day from the event line, not the section heading
      const eventDay = dayInfo?.day || "Fri";
      const eventDate = dayInfo?.date || "2026-04-03";

      pendingEvent = {
        title: title.trim(),
        day: eventDay,
        date: eventDate,
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        building: currentBuilding,
        location: "",
        tags: [],
      };
      continue;
    }

    // If we have a pending event with no location yet, this line is the location
    if (pendingEvent && !pendingEvent.location) {
      const { location, tags } = parseLocationLine(line.trim());
      pendingEvent.location = location;
      pendingEvent.tags = tags;
      continue;
    }

    // Otherwise, this is a description line
    if (pendingEvent) {
      const trimmed = line.trim();
      if (trimmed) {
        descriptionLines.push(trimmed);
      }
    }
  }

  // Flush last event
  flushEvent();

  return events;
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
