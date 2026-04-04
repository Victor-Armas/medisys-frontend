"use client";

import "dayjs/locale/es";
import { IlamyCalendar } from "@ilamy/calendar";
import { DoctorCalendarHeader } from "../calendar/DoctorCalendarHeader";
import { useCalendar } from "../../hooks/useCalendar";
import { ScheduleOverride, ScheduleRange } from "../../types/clinic.types";
import { DoctorCalendarEventRenderer } from "../calendar/DoctorCalendarEventRenderer";
import { useState } from "react";
import { ConfirmDialog } from "@/shared/providers/ConfirmDialog";
import dayjs from "dayjs";
import { parseEventId, useCalendarEvents } from "../../hooks/useCalendarEvents";
import { DeleteScheduleMessage } from "../calendar/DeleteScheduleMessage";

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
  const today = dayjs().startOf("day");

  const events = useCalendarEvents({ scheduleRanges, scheduleOverrides });
  const {
    confirmOpen,
    selectedEvent,
    setConfirmOpen,
    setSelectedEvent,
    handleConfirmDelete,
    handleEventUpdate,
    handleCellClick,
    handleEventClick,
  } = useCalendar({
    doctorClinicId,
    canManage,
    isPaused,
    onAddSchedule,
  });

  const parsed = selectedEvent ? parseEventId(selectedEvent.id as string) : null;
  const deleteTitle = parsed?.kind === "OVERRIDE" ? "Eliminar excepción" : "Eliminar horario";

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
        disableDragAndDrop={!canManage || isPaused}
        disableCellClick={!canManage || isPaused}
        headerComponent={<DoctorCalendarHeader />}
        onCellClick={handleCellClick}
        onEventClick={handleEventClick}
        onEventUpdate={handleEventUpdate}
        renderEvent={(event) => <DoctorCalendarEventRenderer event={event} view={view} today={today} />}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setSelectedEvent(null);
        }}
        title={deleteTitle}
        message={selectedEvent ? <DeleteScheduleMessage event={selectedEvent} /> : null}
        variant="danger"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
