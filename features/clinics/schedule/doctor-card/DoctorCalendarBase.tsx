"use client";

import "dayjs/locale/es";
import { Calendar } from "../../../../shared/calendar/Calendar";
import { useCalendar } from "../../hooks/useCalendar";
import { ScheduleOverride, ScheduleRange } from "../../types/clinic.types";
import { useState } from "react";
import { ConfirmDialog } from "@/shared/providers/ConfirmDialog";
import { DeleteScheduleMessage } from "../calendar/DeleteScheduleMessage";
import { VisibleRange } from "@/shared/calendar/types";
import { parseEventId } from "../../hooks/useCalendar";

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
  const [visibleRange, setVisibleRange] = useState<VisibleRange | null>(null);

  const {
    events,
    confirmOpen,
    selectedEvent,
    setConfirmOpen,
    setSelectedEvent,
    handleConfirmDelete,
    handleCellClick,
    handleEventClick,
  } = useCalendar({
    doctorClinicId,
    canManage,
    isPaused,
    scheduleRanges,
    scheduleOverrides,
    visibleRange,
    onAddSchedule,
  });

  const parsed = selectedEvent ? parseEventId(selectedEvent.id as string) : null;
  const deleteTitle = parsed?.kind === "OVERRIDE" ? "Eliminar excepción" : "Eliminar horario";

  return (
    <div className="clean-calendar-container">
      <div className="h-full flex flex-col">
        <Calendar
          events={events}
          views={["month", "week"]}
          onCellClick={handleCellClick}
          onEventClick={handleEventClick}
          onVisibleRangeChange={setVisibleRange}
        />
      </div>
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
