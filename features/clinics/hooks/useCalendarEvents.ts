import { CalendarEvent } from "@ilamy/calendar";
import dayjs from "dayjs";
import { useMemo } from "react";
import { ScheduleOverride, ScheduleRange } from "../types/clinic.types";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

interface Params {
  scheduleRanges: ScheduleRange[];
  scheduleOverrides: ScheduleOverride[];
}

export interface CustomCalendarEvent extends CalendarEvent {
  type?: keyof typeof COLORS; // Aquí permites 'BASE', 'CUSTOM', etc.
  labelTexto?: string;
  badgeColors?: string;
}

const COLORS = {
  BASE: { bg: "#7c6ab5", text: "#ffffff", name: "BASE" as const },
  CUSTOM: { bg: "#f59e0b", text: "#ffffff", name: "CUSTOM" as const },
  AVAILABLE: { bg: "#10b981", text: "#ffffff", name: "AVAILABLE" as const },
  UNAVAILABLE: { bg: "#ef4444", text: "#ffffff", name: "UNAVAILABLE" as const },
};

export function useCalendarEvents({ scheduleRanges, scheduleOverrides }: Params) {
  return useMemo(() => {
    const events: CustomCalendarEvent[] = [];

    const overrideDates = new Set(scheduleOverrides.map((o) => o.date));

    /**
     * 1️⃣ BASE EVENTS
     */
    scheduleRanges.forEach((range) => {
      if (!range.isActive) return;

      let cursor = dayjs(range.dateFrom);
      const end = dayjs(range.dateTo);

      while (cursor.isBefore(end) || cursor.isSame(end)) {
        const dateStr = cursor.format("YYYY-MM-DD");

        if (cursor.day() === range.weekDay && !overrideDates.has(dateStr)) {
          events.push({
            id: `${range.id}-${dateStr}`,
            start: dayjs(`${dateStr}T${range.startTime}`),
            end: dayjs(`${dateStr}T${range.endTime}`),
            backgroundColor: COLORS.BASE.bg,
            color: COLORS.BASE.text,
            title: "",
            type: COLORS.BASE.name,
          });
        }

        cursor = cursor.add(1, "day");
      }
    });

    /**
     * 2️⃣ OVERRIDE EVENTS (priority)
     */
    scheduleOverrides.forEach((override) => {
      const start = override.startTime ? dayjs(`${override.date}T${override.startTime}`) : dayjs(override.date).startOf("day");
      const end = override.endTime ? dayjs(`${override.date}T${override.endTime}`) : dayjs(override.date).endOf("day");

      const overrideEvent: CustomCalendarEvent = {
        id: override.id,
        start,
        end,
        backgroundColor: COLORS[override.type].bg,
        color: COLORS[override.type].text,
        title: "",
        type: COLORS[override.type].name,
      };

      if (override.type === "UNAVAILABLE") {
        // 🔴 Reemplaza cualquier BASE que coincida en fecha y hora
        for (let i = events.length - 1; i >= 0; i--) {
          const e = events[i];
          if (e.type === "BASE" && e.start.isSameOrBefore(end) && e.end.isSameOrAfter(start)) {
            events.splice(i, 1); // elimina el evento BASE superpuesto
          }
        }
        events.push(overrideEvent);
      } else {
        // 🟢 CUSTOM o AVAILABLE se muestran junto al BASE
        events.push(overrideEvent);
      }
    });

    return events;
  }, [scheduleRanges, scheduleOverrides]);
}
