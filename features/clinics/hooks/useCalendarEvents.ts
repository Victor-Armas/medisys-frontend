import { CalendarEvent } from "@ilamy/calendar";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ScheduleOverride, ScheduleRange } from "../types/clinic.types";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

import { CALENDAR_COLORS } from "../constants/calendar.constants";

interface Params {
  scheduleRanges: ScheduleRange[];
  scheduleOverrides: ScheduleOverride[];
}

export interface CustomCalendarEvent extends CalendarEvent {
  type?: keyof typeof CALENDAR_COLORS;
  editable?: boolean;
}

/** Encode IDs so we can distinguish kind + recordId when handling events */
export function encodeBaseEventId(rangeId: string, dateStr: string): string {
  return `BASE:${rangeId}:${dateStr}`;
}
export function encodeOverrideEventId(overrideId: string, date: string): string {
  return `OVERRIDE:${overrideId}:${date}`;
}

export type ParsedEventId =
  | { kind: "BASE"; rangeId: string; dateStr: string }
  | { kind: "OVERRIDE"; overrideId: string; dateStr: string };

export function parseEventId(id: string): ParsedEventId | null {
  const parts = id.split(":");
  if (parts[0] === "BASE" && parts.length === 3) {
    return { kind: "BASE", rangeId: parts[1], dateStr: parts[2] };
  }
  if (parts[0] === "OVERRIDE" && parts.length === 3) {
    return { kind: "OVERRIDE", overrideId: parts[1], dateStr: parts[2] };
  }
  return null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCalendarEvents({ scheduleRanges, scheduleOverrides }: Params) {
  return useMemo(() => {
    const events: CustomCalendarEvent[] = [];

    /**
     * Only UNAVAILABLE overrides suppress the BASE event for that date.
     * CUSTOM and AVAILABLE overrides coexist with BASE on the same day.
     */
    const unavailableDates = new Set(scheduleOverrides.filter((o) => o.type === "UNAVAILABLE").map((o) => o.date));

    // ── 1. BASE events (expanded from ScheduleRange recurrence) ──────────────
    scheduleRanges.forEach((range) => {
      if (!range.isActive) return;

      let cursor = dayjs(range.dateFrom);
      const rangeEnd = dayjs(range.dateTo);

      while (cursor.isSameOrBefore(rangeEnd, "day")) {
        const dateStr = cursor.format("YYYY-MM-DD");

        if (cursor.day() === range.weekDay && !unavailableDates.has(dateStr)) {
          events.push({
            id: encodeBaseEventId(range.id, dateStr),
            start: dayjs(`${dateStr}T${range.startTime}`),
            end: dayjs(`${dateStr}T${range.endTime}`),
            backgroundColor: CALENDAR_COLORS.BASE.bg,
            color: CALENDAR_COLORS.BASE.text,
            title: "",
            type: CALENDAR_COLORS.BASE.name,
            editable: false,
          });
        }

        cursor = cursor.add(1, "day");
      }
    });

    // ── 2. OVERRIDE events ────────────────────────────────────────────────────
    scheduleOverrides.forEach((override) => {
      const dateStr = override.date.slice(0, 10);
      const c = CALENDAR_COLORS[override.type];

      if (override.type === "UNAVAILABLE") {
        // Full-day block — allDay so it floats at the top of the cell
        events.push({
          id: encodeOverrideEventId(override.id, dateStr),
          start: dayjs(dateStr).startOf("day"),
          end: dayjs(dateStr).endOf("day"),
          allDay: true,
          backgroundColor: c.bg,
          color: c.text,
          title: override.note ?? "Inhábil",
          type: c.name,
          editable: true,
        });
        return;
      }

      if (override.startTime && override.endTime) {
        events.push({
          id: encodeOverrideEventId(override.id, dateStr),
          start: dayjs(`${dateStr}T${override.startTime}`),
          end: dayjs(`${dateStr}T${override.endTime}`),
          backgroundColor: c.bg,
          color: c.text,
          title: override.note ?? "",
          type: c.name,
          editable: true,
        });
      }
    });

    return events;
  }, [scheduleRanges, scheduleOverrides]);
}
