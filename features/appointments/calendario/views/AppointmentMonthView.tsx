// features/appointments/calendario/views/AppointmentMonthView.tsx
"use client";

import { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import { CustomPopover } from "@/shared/ui/CustomPopover";
import { useCalendarContext } from "@/shared/calendar/CalendarContext";
import { AppointmentEventChip } from "../components/AppointmentEventChip";
import type { AppointmentCalendarEvent, DoctorResource } from "../../types/appointment.types";

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface Props {
  events: AppointmentCalendarEvent[];
  resources: DoctorResource[];
}

export function AppointmentMonthView({ events }: Props) {
  const { currentDate, onCellClick, onEventClick } = useCalendarContext();

  // 1. ESTADO DINÁMICO: Empezamos con 2 por defecto (seguro para laptops)
  const [maxVisibleEvents, setMaxVisibleEvents] = useState(2);

  // 2. EL MOTOR RESPONSIVO
  useEffect(() => {
    const calculateVisibleEvents = () => {
      const screenHeight = window.innerHeight;

      // Monitores grandes (ej. 1080p, 1440p, iMacs)
      if (screenHeight >= 950) {
        setMaxVisibleEvents(5);
      }
      // Laptops de 15 pulgadas o monitores medianos
      else if (screenHeight >= 800) {
        setMaxVisibleEvents(3);
      }
      // MacBooks de 13 pulgadas o pantallas pequeñas
      else {
        setMaxVisibleEvents(2);
      }
    };

    // Calculamos al cargar la página
    calculateVisibleEvents();

    // Recalculamos si el usuario redimensiona la ventana
    window.addEventListener("resize", calculateVisibleEvents);
    return () => window.removeEventListener("resize", calculateVisibleEvents);
  }, []);

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
      <div className="grid grid-cols-7 bg-interior rounded-t-lg shadow-xs my-1 md:my-2">
        {WEEK_DAYS.map((d) => (
          <div key={d} className="text-center py-1 md:py-2 text-[10px] md:text-xs font-semibold text-subtitulo">
            {d}
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-7 auto-rows-fr gap-px pb-1 shadow-md rounded-sm p-0.5 md:p-1">
        {daysData.map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="bg-inner-secundario/40 rounded-sm md:rounded-md m-0 md:m-0.5 pointer-events-none" />;
          }

          const { date, dayEvents } = cell;
          const isPast = date.isBefore(dayjs().startOf("day"), "day");
          const isToday = date.isSame(dayjs().startOf("day"), "day");

          // 1. Lógica de partición de citas
          const visibleEvents = dayEvents.slice(0, maxVisibleEvents);
          const hiddenCount = dayEvents.length - maxVisibleEvents;

          return (
            <div
              key={date.format("YYYY-MM-DD")}
              onClick={(e) => {
                if (onCellClick) onCellClick({ start: date }, e);
              }}
              // 2. Quitamos overflow-hidden para que el popover pueda verse, pero lo hacemos relative
              className={`flex flex-col p-0.5 md:p-1 bg-interior rounded-sm md:rounded-md m-0 md:m-0.5 transition-colors relative ${
                isPast ? "opacity-60" : "hover:bg-principal-hover2/20 cursor-pointer"
              } ${isToday ? "ring-1 ring-principal/30 bg-principal/5" : ""}`}
            >
              <span className={`text-[10px] md:text-[11px] font-medium mb-0.5 md:mb-1 pl-0.5 md:pl-1 ${isToday ? "text-principal font-bold" : "text-subtitulo"}`}>
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
                    <span className="text-[9px] md:text-[10px] font-bold text-principal hover:text-principal/80 text-left px-0.5 md:px-1 mt-0.5 hover:underline transition-all block">
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
