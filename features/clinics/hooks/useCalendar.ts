import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useCallback, useState, useMemo } from "react";
import { isAxiosError } from "axios";
import type { CalendarEvent, VisibleRange } from "@/shared/calendar/types";
import { ScheduleOverride, ScheduleRange } from "../types/clinic.types";
import { useRemoveSchedule } from "./useSchedule";
import { useRemoveScheduleOverride } from "./useScheduleOverride";
import { CALENDAR_COLORS } from "../constants/calendar.constants";

dayjs.extend(isSameOrBefore);

interface Params {
  doctorClinicId: string;
  canManage: boolean;
  isPaused: boolean;
  scheduleRanges: ScheduleRange[];
  scheduleOverrides: ScheduleOverride[];
  visibleRange: VisibleRange | null;
  onAddSchedule: (doctorClinicId: string, prefillDate?: string) => void;
}

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

export function useCalendar({
  doctorClinicId,
  canManage,
  isPaused,
  scheduleRanges,
  scheduleOverrides,
  visibleRange,
  onAddSchedule,
}: Params) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const removeSchedule = useRemoveSchedule();
  const removeOverride = useRemoveScheduleOverride();

  const today = dayjs().startOf("day");

  const events = useMemo(() => {
    if (!visibleRange) return [];

    const computedEvents: CalendarEvent[] = [];
    const visibleStart = dayjs(visibleRange.start);
    const visibleEnd = dayjs(visibleRange.end);

    const unavailableDates = new Set(
      scheduleOverrides.filter((o) => o.type === "UNAVAILABLE").map((o) => o.date.slice(0, 10))
    );

    // 1. Expand BASE events, ONLY resolving within visibleRange limits
    scheduleRanges.forEach((range) => {
      if (!range.isActive) return;

      const rangeStart = dayjs(range.dateFrom);
      const rangeEndStr = range.dateTo ? dayjs(range.dateTo) : dayjs().add(5, "year");

      // El cruce de rangos nos da las fronteras estrictas a iterar
      let cursor = rangeStart.isAfter(visibleStart) ? rangeStart.clone() : visibleStart.clone();
      const endLimit = rangeEndStr.isBefore(visibleEnd) ? rangeEndStr : visibleEnd;

      while (cursor.isSameOrBefore(endLimit, "day")) {
        const dateStr = cursor.format("YYYY-MM-DD");

        if (cursor.day() === range.weekDay && !unavailableDates.has(dateStr)) {
          computedEvents.push({
            id: encodeBaseEventId(range.id, dateStr),
            start: `${dateStr}T${range.startTime}`,
            end: `${dateStr}T${range.endTime}`,
            backgroundColor: CALENDAR_COLORS.BASE.bg,
            color: CALENDAR_COLORS.BASE.text,
            type: "range",
          });
        }
        cursor = cursor.add(1, "day");
      }
    });

    // 2. Map OVERRIDE events ensuring they fall in visibleRange too
    scheduleOverrides.forEach((override) => {
      const dateStr = override.date.slice(0, 10);
      const overrideDate = dayjs(dateStr);

      if (overrideDate.isBefore(visibleStart, "day") || overrideDate.isAfter(visibleEnd, "day")) return;

      const c = CALENDAR_COLORS[override.type];
      let typeAssigned: "blocked" | "override" = "override";
      if (override.type === "UNAVAILABLE") typeAssigned = "blocked";

      if (override.type === "UNAVAILABLE") {
        computedEvents.push({
          id: encodeOverrideEventId(override.id, dateStr),
          start: overrideDate.startOf("day").format("YYYY-MM-DDTHH:mm:ss"),
          end: overrideDate.endOf("day").format("YYYY-MM-DDTHH:mm:ss"),
          backgroundColor: c.bg,
          color: c.text,
          title: override.note ?? "Inhábil",
          type: typeAssigned,
        });
        return;
      }

      if (override.startTime && override.endTime) {
        computedEvents.push({
          id: encodeOverrideEventId(override.id, dateStr),
          start: `${dateStr}T${override.startTime}`,
          end: `${dateStr}T${override.endTime}`,
          backgroundColor: c.bg,
          color: c.text,
          title: override.note ?? "",
          type: typeAssigned,
        });
      }
    });

    return computedEvents;
  }, [scheduleRanges, scheduleOverrides, visibleRange]);

  const handleCellClick = useCallback(
    (info: { start: dayjs.Dayjs }) => {
      if (!canManage || isPaused) return;
      const dateStr = info.start.format("YYYY-MM-DD");
      if (dayjs(dateStr).isBefore(today, "day")) return;
      onAddSchedule(doctorClinicId, dateStr);
    },
    [canManage, isPaused, today, onAddSchedule, doctorClinicId],
  );

  const handleEventClick = useCallback(
    (event: CalendarEvent) => {
      if (!canManage || isPaused) return;
      const parsed = parseEventId(event.id as string);
      if (!parsed) return;
      if (dayjs(parsed.dateStr).isBefore(today, "day")) return;
      setSelectedEvent(event);
      setConfirmOpen(true);
    },
    [canManage, isPaused, today],
  );

  const handleConfirmDelete = useCallback(async () => {
    if (!selectedEvent) return;
    const parsed = parseEventId(selectedEvent.id as string);
    if (!parsed) return;

    try {
      if (parsed.kind === "OVERRIDE") {
        await removeOverride.mutateAsync(parsed.overrideId);
      } else {
        await removeSchedule.mutateAsync(parsed.rangeId);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        console.error("Error al eliminar:", err.response?.data?.message);
      }
    } finally {
      setConfirmOpen(false);
      setSelectedEvent(null);
    }
  }, [selectedEvent, removeOverride, removeSchedule]);

  return {
    events,
    confirmOpen,
    selectedEvent,
    handleConfirmDelete,
    setSelectedEvent,
    setConfirmOpen,
    handleCellClick,
    handleEventClick,
  };
}
