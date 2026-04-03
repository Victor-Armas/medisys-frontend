// features/users/components/profile/clinic-detail/availability/useClinicAvailability.ts

import { useMemo, useState } from "react";
import type { ClinicAvailabilityInput, AvailabilityData, ViewMode } from "../types/availability.types";
import { resolveAvailability, getMonthRange, getWeekRange, formatMonthYear } from "../utils/ availability.utils";

interface UseClinicAvailabilityReturn {
  data: AvailabilityData;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  periodLabel: string;
  goNext: () => void;
  goPrev: () => void;
  goToday: () => void;
}

export function useClinicAvailability(input: ClinicAvailabilityInput): UseClinicAvailabilityReturn {
  const today = new Date();

  const [viewMode, setViewMode] = useState<ViewMode>("week");
  // Para mes: año+mes. Para semana: fecha de referencia (lunes de esa semana)
  const [year, setYear] = useState(today.getUTCFullYear());
  const [month, setMonth] = useState(today.getUTCMonth());
  const [weekRef, setWeekRef] = useState<Date>(today);

  const { dateFrom, dateTo } = useMemo(() => {
    if (viewMode === "month") {
      const r = getMonthRange(year, month);
      return { dateFrom: r.from, dateTo: r.to };
    }
    const r = getWeekRange(weekRef);
    return { dateFrom: r.from, dateTo: r.to };
  }, [viewMode, year, month, weekRef]);

  const data = useMemo(
    () => resolveAvailability(dateFrom, dateTo, input.scheduleRanges, input.scheduleOverrides, input.slotDurationMinutes),
    [dateFrom, dateTo, input.scheduleRanges, input.scheduleOverrides, input.slotDurationMinutes],
  );

  const periodLabel = useMemo(() => {
    if (viewMode === "month") return formatMonthYear(year, month);
    const from = new Date(dateFrom + "T00:00:00Z");
    const to = new Date(dateTo + "T00:00:00Z");
    return `${from.toLocaleDateString("es-MX", { day: "numeric", month: "short", timeZone: "UTC" })} – ${to.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`;
  }, [viewMode, year, month, dateFrom, dateTo]);

  function goNext() {
    if (viewMode === "month") {
      if (month === 11) {
        setYear((y) => y + 1);
        setMonth(0);
      } else setMonth((m) => m + 1);
    } else {
      setWeekRef((prev) => {
        const next = new Date(prev);
        next.setUTCDate(prev.getUTCDate() + 7);
        return next;
      });
    }
  }

  function goPrev() {
    if (viewMode === "month") {
      if (month === 0) {
        setYear((y) => y - 1);
        setMonth(11);
      } else setMonth((m) => m - 1);
    } else {
      setWeekRef((prev) => {
        const prev7 = new Date(prev);
        prev7.setUTCDate(prev.getUTCDate() - 7);
        return prev7;
      });
    }
  }

  function goToday() {
    const now = new Date();
    setYear(now.getUTCFullYear());
    setMonth(now.getUTCMonth());
    setWeekRef(now);
  }

  return { data, viewMode, setViewMode, periodLabel, goNext, goPrev, goToday };
}
