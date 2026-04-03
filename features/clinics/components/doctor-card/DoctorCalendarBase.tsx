"use client";

import "dayjs/locale/es";
import { IlamyCalendar } from "@ilamy/calendar";
import { DoctorCalendarHeader } from "../calendar/DoctorCalendarHeader";
import { useCalendar } from "../../hooks/useCalendar";
import { ScheduleOverride, ScheduleRange } from "../../types/clinic.types";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";
import { DoctorCalendarEventRenderer } from "../calendar/DoctorCalendarEventRenderer";
import { useState } from "react";

interface Props {
  doctorClinicId: string;
  canManage: boolean;
  isPaused: boolean;
  scheduleRanges: ScheduleRange[];
  scheduleOverrides: ScheduleOverride[];
  onAddSchedule: (doctorClinicId: string, prefillDate?: string) => void;
}

export function DoctorCalendarBase({
  onAddSchedule,
  doctorClinicId,
  canManage,
  isPaused,
  scheduleRanges,
  scheduleOverrides,
}: Props) {
  const [view, setView] = useState("month");
  const { handleCellClick } = useCalendar({
    doctorClinicId,
    canManage,
    isPaused,
    onAddSchedule,
    scheduleRanges,
    scheduleOverrides,
  });
  const events = useCalendarEvents({
    scheduleRanges,
    scheduleOverrides,
  });

  return (
    <div className="rounded-xl overflow-hidden border border-border-default h-[400px] doctor-month-calendar">
      <IlamyCalendar
        events={events}
        onViewChange={setView}
        initialView="month"
        dayMaxEvents={5}
        firstDayOfWeek="monday"
        locale="es"
        timezone="America/Mexico_City"
        timeFormat="24-hour"
        stickyViewHeader
        headerComponent={<DoctorCalendarHeader />}
        onCellClick={handleCellClick}
        renderEvent={(event) => <DoctorCalendarEventRenderer event={event} view={view} />}
      />
    </div>
  );
}
