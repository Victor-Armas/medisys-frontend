// features/users/components/profile/clinic-detail/availability/availability.utils.ts

import type { ScheduleRange, ScheduleOverride } from "@features/clinics/types/clinic.types";
import type { AvailabilityData, DayKind, ResolvedDay, TimeBlock } from "../types/availability.types";

// ─── Helpers de fecha (UTC-safe, sin librerías) ───────────────

import dayjs from "@/shared/utils/date.utils";

export function toDateStr(date: Date): string {
  return dayjs.utc(date).format("YYYY-MM-DD");
}

export function fromDateStr(dateStr: string): Date {
  return dayjs.utc(dateStr).toDate();
}

export function weekDayOf(dateStr: string): number {
  return dayjs.utc(dateStr).day();
}

export function nextDateStr(dateStr: string): string {
  return dayjs.utc(dateStr).add(1, "day").format("YYYY-MM-DD");
}

export function getMonthRange(year: number, month: number): { from: string; to: string } {
  const start = dayjs.utc().year(year).month(month).startOf("month");
  const end = start.endOf("month");
  return { from: start.format("YYYY-MM-DD"), to: end.format("YYYY-MM-DD") };
}

export function getWeekRange(referenceDate: Date): { from: string; to: string } {
  const start = dayjs.utc(referenceDate).startOf("week").add(1, "day"); // Lunes
  const end = start.add(6, "day"); // Domingo
  return { from: start.format("YYYY-MM-DD"), to: end.format("YYYY-MM-DD") };
}

export function formatDisplayDate(dateStr: string): string {
  return dayjs.utc(dateStr).format("ddd D/MM/YYYY");
}

export function formatMonthYear(year: number, month: number): string {
  return dayjs.utc().year(year).month(month).format("MMMM YYYY");
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
  const safeDuration = durationMins > 0 ? durationMins : 30; // Evitar división por cero o bucle infinito

  while (current + safeDuration <= end) {
    slots.push(minsToTime(current));
    current += safeDuration;
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
  let iterations = 0;
  const MAX_ITERATIONS = 400; // Un año aprox, evita bucles infinitos si la fecha falla

  while (current <= dateTo && iterations < MAX_ITERATIONS) {
    iterations++;
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
