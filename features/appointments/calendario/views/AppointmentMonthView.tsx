// features/appointments/calendario/views/AppointmentMonthView.tsx
"use client";

import { useMemo } from "react";
import dayjs from "dayjs";
import { CustomPopover } from "@/shared/ui/CustomPopover";
import { useCalendarContext } from "@/shared/calendar/CalendarContext";
import { AppointmentEventChip } from "../components/AppointmentEventChip";
import type { AppointmentCalendarEvent, DoctorResource } from "../../types/appointment.types";

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MAX_VISIBLE_EVENTS = 3; // <-- Puedes subirlo a 4 si tus celdas son muy altas

interface Props {
  events: AppointmentCalendarEvent[];
  resources: DoctorResource[];
}

export function AppointmentMonthView({ events }: Props) {
  const { currentDate, onCellClick, onEventClick } = useCalendarContext();

  const daysData = useMemo(() => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const firstDayOfWeek = startOfMonth.day();
    const emptyDaysBefore = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const cells: Array<null | { date: dayjs.Dayjs; dayEvents: AppointmentCalendarEvent[] }> = [];

    for (let i = 0; i < emptyDaysBefore; i++) {
      cells.push(null);
    }

    for (let i = 1; i <= endOfMonth.date(); i++) {
      const date = startOfMonth.date(i);
      const dateStr = date.format("YYYY-MM-DD");
      const dayEvents = events
        .filter((e) => dayjs(e.start).format("YYYY-MM-DD") === dateStr)
        .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)));
      cells.push({ date, dayEvents });
    }

    return cells;
  }, [currentDate, events]);

  return (
    <div className="flex flex-col flex-1 bg-fondo-inputs pb-2 px-2">
      <div className="grid grid-cols-7 bg-interior rounded-t-lg shadow-xs my-2">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center py-2 text-xs font-semibold text-subtitulo">
            {d}
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-7 auto-rows-fr gap-px pb-1 shadow-md rounded-sm p-1">
        {daysData.map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="bg-inner-secundario/40 rounded-md m-0.5 pointer-events-none" />;
          }

          const { date, dayEvents } = cell;
          const isPast = date.isBefore(dayjs().startOf("day"), "day");
          const isToday = date.isSame(dayjs().startOf("day"), "day");

          // 1. Lógica de partición de citas
          const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
          const hiddenCount = dayEvents.length - MAX_VISIBLE_EVENTS;

          return (
            <div
              key={date.format("YYYY-MM-DD")}
              onClick={(e) => {
                if (onCellClick) onCellClick({ start: date }, e);
              }}
              // 2. Quitamos overflow-hidden para que el popover pueda verse, pero lo hacemos relative
              className={`flex flex-col p-1 bg-interior rounded-md m-0.5 transition-colors relative ${
                isPast ? "opacity-60" : "hover:bg-principal-hover2/20 cursor-pointer"
              } ${isToday ? "ring-1 ring-principal/30 bg-principal/5" : ""}`}
            >
              <span className={`text-[11px] font-medium mb-1 pl-1 ${isToday ? "text-principal font-bold" : "text-subtitulo"}`}>
                {date.date()}
              </span>

              {/* 3. Contenedor de citas visible que no hace scroll interno */}
              <div className="flex flex-col gap-[2px] flex-1 overflow-hidden min-h-0">
                {visibleEvents.map((event) => (
                  <AppointmentEventChip
                    key={event.id}
                    event={event}
                    variant="chip"
                    onClick={onEventClick ? (e) => onEventClick(e) : undefined}
                  />
                ))}
              </div>

              {/* 4. Nuestro Custom Popover si hay citas ocultas */}
              {hiddenCount > 0 && (
                <CustomPopover
                  trigger={
                    <span className="text-[10px] font-bold text-principal hover:text-principal/80 text-left px-1 mt-0.5 hover:underline transition-all block">
                      + {hiddenCount} más
                    </span>
                  }
                  contentClassName="w-64 p-3 shadow-xl"
                >
                  <div className="flex flex-col max-h-[300px]">
                    <div className="pb-2 mb-2 border-b border-disable/10">
                      <p className="text-xs font-bold text-encabezado capitalize">{date.format("dddd, D [de] MMMM")}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar pr-1">
                      {/* Iteramos sobre TODAS las citas del día dentro del popover */}
                      {dayEvents.map((event) => (
                        <AppointmentEventChip
                          key={event.id}
                          event={event}
                          variant="block" // Usamos block para más detalle
                          onClick={onEventClick ? (e) => onEventClick(e) : undefined}
                        />
                      ))}
                    </div>
                  </div>
                </CustomPopover>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
