import { useMemo } from "react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { DoctorClinicItem } from "../types";

dayjs.locale("es");

export interface ScheduleDayUI {
  dayName: string;
  time: string;
  hours: string;
  isActive: boolean;
  isLate: boolean;
  isCentered: boolean;
  type: "regular" | "unavailable" | "custom" | "extra";
}

export interface ScheduleMonthDayUI {
  dateStr: string;
  dayNumber: number;
  isActive: boolean;
  isUnavailable: boolean;
  isExtraTime: boolean;
}

export function useClinicSchedule(dc: DoctorClinicItem, baseDate: Date = new Date()) {
  const currentWeek = useMemo(() => {
    const startOfWeek = dayjs(baseDate).startOf("week").add(1, "day"); // Lunes

    return Array.from({ length: 7 }).map((_, i) => {
      const currentDate = startOfWeek.add(i, "day");
      const currentDateStr = currentDate.format("YYYY-MM-DD");
      const dayOfWeek = currentDate.day(); // 0 is Domingo, 1 is Lunes

      const overrides = dc.scheduleOverrides || [];
      const override = overrides.find((o) => o.date === currentDateStr);

      let isActive = false;
      let startTime = "";
      let endTime = "";
      let totalMinutes = 0;
      let type: ScheduleDayUI["type"] = "regular";

      if (override) {
        if (override.type === "UNAVAILABLE") {
          type = "unavailable";
          isActive = true; 
          startTime = "00:00"; 
          endTime = "00:00";
        } else if (override.type === "AVAILABLE" || override.type === "CUSTOM") {
          type = override.type === "AVAILABLE" ? "extra" : "custom";
          startTime = override.startTime || "";
          endTime = override.endTime || "";
          if (startTime && endTime) {
            isActive = true;
            const [sh, sm] = startTime.split(":").map(Number);
            const [eh, em] = endTime.split(":").map(Number);
            totalMinutes = eh * 60 + em - (sh * 60 + sm);
          }
        }
      } else {
        const ranges = (dc.scheduleRanges || []).filter(
          (r) =>
            r.isActive &&
            r.weekDay === dayOfWeek &&
            r.dateFrom <= currentDateStr && r.dateTo >= currentDateStr
        );

        if (ranges.length > 0) {
          let minStart = 24 * 60;
          let maxEnd = 0;
          ranges.forEach((r) => {
            const [sh, sm] = r.startTime.split(":").map(Number);
            const startMins = sh * 60 + sm;
            const [eh, em] = r.endTime.split(":").map(Number);
            const endMins = eh * 60 + em;

            if (startMins < minStart) {
              minStart = startMins;
              startTime = r.startTime;
            }
            if (endMins > maxEnd) {
              maxEnd = endMins;
              endTime = r.endTime;
            }
          });

          if (maxEnd > minStart) {
            isActive = true;
            totalMinutes = maxEnd - minStart;
          }
        }
      }

      const startHour = startTime ? parseInt(startTime.split(":")[0]) : 0;

      return {
        dayName: currentDate.format("ddd").toUpperCase() + ".",
        time: type === "unavailable" ? "Inhábil" : (startTime ? `${startTime} - ${endTime}` : ""),
        hours: totalMinutes > 0 ? `${Math.ceil(totalMinutes / 60)}h` : "-", 
        isActive,
        isLate: startHour >= 14,
        isCentered: i === 6 || type === "unavailable", // Centrado si es domingo/sábado o inhábil
        type,
      } as ScheduleDayUI;
    });
  }, [baseDate, dc]);

  const currentMonth = useMemo(() => {
    const startOfMonth = dayjs(baseDate).startOf("month");
    const daysInMonth = startOfMonth.daysInMonth();

    let offset = startOfMonth.day() - 1;
    if (offset === -1) offset = 6;

    const days = Array.from({ length: daysInMonth }).map((_, i) => {
      const date = startOfMonth.add(i, "day");
      const dateStr = date.format("YYYY-MM-DD");
      const dayOfWeek = date.day();

      const overrides = dc.scheduleOverrides || [];
      const override = overrides.find((o) => o.date === dateStr);

      let isActive = false;
      let isUnavailable = false;
      let isExtraTime = false;

      if (override) {
        if (override.type === "UNAVAILABLE") {
          isUnavailable = true;
        } else {
          isActive = true;
          if (override.type === "AVAILABLE" || override.type === "CUSTOM") {
            isExtraTime = true;
          }
        }
      } else {
        const ranges = (dc.scheduleRanges || []).filter(
          (r) =>
            r.isActive &&
            r.weekDay === dayOfWeek &&
            r.dateFrom <= dateStr && r.dateTo >= dateStr
        );
        isActive = ranges.length > 0;
      }

      return {
        dateStr,
        dayNumber: date.date(),
        isActive,
        isUnavailable,
        isExtraTime,
      } as ScheduleMonthDayUI;
    });

    return { offset, days };
  }, [baseDate, dc]);

  return { currentWeek, currentMonth };
}
