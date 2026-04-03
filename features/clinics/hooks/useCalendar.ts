import dayjs from "dayjs";
import type { CellClickInfo } from "@ilamy/calendar";
import { ScheduleOverride, ScheduleRange } from "../types/clinic.types";
import { useMemo } from "react";

interface Params {
  doctorClinicId: string;
  canManage: boolean;
  isPaused: boolean;
  scheduleRanges: ScheduleRange[];
  scheduleOverrides: ScheduleOverride[];
  onAddSchedule: (doctorClinicId: string, prefillDate?: string) => void;
}

export function useCalendar({ doctorClinicId, canManage, isPaused, onAddSchedule, scheduleRanges, scheduleOverrides }: Params) {
  function getTodayStr(): string {
    return dayjs().format("YYYY-MM-DD");
  }

  function handleCellClick(info: CellClickInfo) {
    if (!canManage || isPaused) return;
    const dateStr = info.start.format("YYYY-MM-DD");
    if (dateStr < getTodayStr()) return;
    onAddSchedule(doctorClinicId, dateStr);
  }

  const events = useMemo(() => {
    const rangeEvents = scheduleRanges.map((range) => ({
      id: range.id,
      start: range.dateFrom,
      end: range.dateTo,
      title: "Disponibilidad",
    }));

    const overrideEvents = scheduleOverrides.map((override) => ({
      id: override.id,
      start: override.startTime,
      end: override.endTime,
      title: "Override",
    }));

    return [...rangeEvents, ...overrideEvents];
  }, [scheduleRanges, scheduleOverrides]);

  return {
    handleCellClick,
    events,
  };
}
