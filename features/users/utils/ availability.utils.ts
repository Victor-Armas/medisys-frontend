// features/users/components/profile/clinic-detail/availability/availability.utils.ts

import type { ScheduleRange, ScheduleOverride } from "@features/clinics/types/clinic.types";
import type { AvailabilityData, DayKind, ResolvedDay, TimeBlock } from "../types/availability.types";

// ─── Helpers de fecha (UTC-safe, sin librerías) ───────────────

export function toDateStr(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function weekDayOf(dateStr: string): number {
  return fromDateStr(dateStr).getUTCDay();
}

export function nextDateStr(dateStr: string): string {
  const date = fromDateStr(dateStr);
  date.setUTCDate(date.getUTCDate() + 1);
  return toDateStr(date);
}

export function getMonthRange(year: number, month: number): { from: string; to: string } {
  const from = toDateStr(new Date(Date.UTC(year, month, 1)));
  const to = toDateStr(new Date(Date.UTC(year, month + 1, 0)));
  return { from, to };
}

export function getWeekRange(referenceDate: Date): { from: string; to: string } {
  const day = referenceDate.getUTCDay();
  const monday = new Date(referenceDate);
  monday.setUTCDate(referenceDate.getUTCDate() - ((day + 6) % 7));
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  return { from: toDateStr(monday), to: toDateStr(sunday) };
}

export function formatDisplayDate(dateStr: string, locale = "es-MX"): string {
  const date = fromDateStr(dateStr);
  return date.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export function formatMonthYear(year: number, month: number, locale = "es-MX"): string {
  return new Date(Date.UTC(year, month, 1)).toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ─── Helpers de tiempo ────────────────────────────────────────

function timeToMins(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minsToTime(mins: number): string {
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

// Convierte lista de slots ("09:00", "09:30"...) en bloques contiguos
export function slotsToBlocks(slots: string[], durationMins: number): TimeBlock[] {
  if (slots.length === 0) return [];

  const sorted = [...slots].sort();
  const blocks: TimeBlock[] = [];
  let blockStart = sorted[0];
  let prev = timeToMins(sorted[0]);

  for (let i = 1; i < sorted.length; i++) {
    const curr = timeToMins(sorted[i]);
    if (curr !== prev + durationMins) {
      blocks.push({ startTime: blockStart, endTime: minsToTime(prev + durationMins) });
      blockStart = sorted[i];
    }
    prev = curr;
  }
  blocks.push({ startTime: blockStart, endTime: minsToTime(prev + durationMins) });
  return blocks;
}

// Genera slots para un rango horario
function generateSlots(startHhmm: string, endHhmm: string, durationMins: number): string[] {
  const slots: string[] = [];
  let current = timeToMins(startHhmm);
  const end = timeToMins(endHhmm);
  while (current + durationMins <= end) {
    slots.push(minsToTime(current));
    current += durationMins;
  }
  return slots;
}

function calcTotalMinutes(blocks: TimeBlock[]): number {
  return blocks.reduce((acc, b) => acc + timeToMins(b.endTime) - timeToMins(b.startTime), 0);
}

// ─── Resolución de disponibilidad (Opción A: sin fetch extra) ─

export function resolveAvailability(
  dateFrom: string,
  dateTo: string,
  ranges: ScheduleRange[],
  overrides: ScheduleOverride[],
  slotDurationMins: number,
): AvailabilityData {
  const days: Record<string, ResolvedDay> = {};
  const overrideMap = new Map(overrides.map((o) => [o.date, o]));

  let current = dateFrom;
  while (current <= dateTo) {
    const override = overrideMap.get(current);

    let kind: DayKind;
    let blocks: TimeBlock[];
    let overrideNote: string | null = null;
    let overrideType = null as ResolvedDay["overrideType"];

    if (override) {
      overrideNote = override.note;
      overrideType = override.type;

      if (override.type === "UNAVAILABLE") {
        kind = "unavailable";
        blocks = [];
      } else if (override.startTime && override.endTime) {
        // CUSTOM o AVAILABLE
        kind = override.type === "AVAILABLE" ? "available" : "custom";
        const slots = generateSlots(override.startTime, override.endTime, slotDurationMins);
        blocks = slotsToBlocks(slots, slotDurationMins);
      } else {
        kind = "rest";
        blocks = [];
      }
    } else {
      const weekDay = weekDayOf(current);
      const matchedRanges = ranges.filter((r) => r.isActive && r.weekDay === weekDay && r.dateFrom <= current && r.dateTo >= current);

      if (matchedRanges.length === 0) {
        kind = "rest";
        blocks = [];
      } else {
        kind = "base";
        const allSlots = matchedRanges.flatMap((r) => generateSlots(r.startTime, r.endTime, slotDurationMins));
        const unique = [...new Set(allSlots)].sort();
        blocks = slotsToBlocks(unique, slotDurationMins);
      }
    }

    days[current] = {
      dateStr: current,
      kind,
      blocks,
      overrideNote,
      overrideType,
      totalMinutes: calcTotalMinutes(blocks),
    };

    current = nextDateStr(current);
  }

  return { rangeFrom: dateFrom, rangeTo: dateTo, days };
}
