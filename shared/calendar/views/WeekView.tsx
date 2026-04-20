"use client";

import React, { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import { useCalendarContext } from "../CalendarContext";

export function WeekView() {
  const { currentDate, events, onCellClick, onEventClick } = useCalendarContext();

  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), 900000); // Actualizar cada 15 minuto
    return () => clearInterval(interval);
  }, []);

  const daysData = useMemo(() => {
    // Día 1 es lunes en dayjs (0 es domingo)
    return Array.from({ length: 7 }).map((_, i) => currentDate.day(1).add(i, "day"));
  }, [currentDate]);

  const hours = useMemo(() => Array.from({ length: 24 }).map((_, i) => i), []);

  const todayStr = dayjs().format("YYYY-MM-DD");

  return (
    <div className="flex flex-col h-full overflow-auto custom-scrollbar bg-fondo-inputs p-4 text-xs">
      <div className="flex w-fit">
        <div className="w-24 shrink-0" />
        <div className="flex bg-interior py-2 rounded-xs mb-2">
          {hours.map((h) => (
            <div key={`header-h-${h}`} className="w-16 shrink-0 text-center text-subtitulo font-semibold opacity-70">
              {h.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>
      </div>

      {daysData.map((day) => {
        const isPast = day.isBefore(now.startOf("day"), "day");
        const dateStr = day.format("YYYY-MM-DD");
        const isToday = dateStr === todayStr;

        const dayEvents = events.filter((e) => dayjs(e.start).format("YYYY-MM-DD") === dateStr);

        return (
          <div key={dateStr} className="flex justify-center text-center w-fit mb-1 gap-4 rounded-md">
            <div
              className={`w-20 shrink-0 bg-interior flex flex-col justify-center font-medium pr-2 ${isToday ? "text-principal" : "text-encabezado"} ${isPast ? "opacity-50" : ""}`}
            >
              <span className="capitalize">{day.format("dddd")}</span>
              <span className="text-[10px] text-subtitulo">{day.format("DD MMM")}</span>
            </div>

            <div className="flex relative overflow-hidden">
              {/* Fondo - Celdas de hora para atrapar clicks y dibujar grid */}
              {hours.map((h) => {
                const cellTime = day.hour(h).minute(0);
                return (
                  <div
                    key={`bg-${h}`}
                    onClick={(e) => {
                      if (onCellClick) onCellClick({ start: cellTime }, e);
                    }}
                    className={`w-16 h-11 shrink-0 transition-colors
                      ${isPast ? "opacity-60" : "hover:bg-secundario-hover bg-interior cursor-pointer"}
                    `}
                  />
                );
              })}

              {/* Eventos absolutos superpuestos */}
              {dayEvents.map((event) => {
                const start = dayjs(event.start);
                const end = dayjs(event.end);
                const startHour = start.hour() + start.minute() / 60;
                const endHour = end.hour() + end.minute() / 60;
                const duration = Math.max(0.5, endHour - startHour); // Mínimo 30 min visual

                const c = event.color || "var(--color-principal)";
                const bg = event.backgroundColor || "var(--color-principal)";

                return (
                  <div
                    key={event.id}
                    className="absolute top-1 bottom-1 z-10"
                    style={{
                      left: `${startHour * 4}rem`, // w-16 = 4rem
                      width: `${duration * 4}rem`,
                      padding: "0 2px",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isPast && onEventClick) onEventClick(event, e);
                    }}
                  >
                    <div className={`h-full w-full ${!isPast ? "cursor-pointer" : "cursor-default"}`}>
                      <div
                        className="h-full rounded-xs truncate p-1 overflow-hidden transition-all hover:ring-1 hover:ring-opacity-50"
                        style={{ backgroundColor: bg, color: c, opacity: isPast ? 0.6 : 1, borderColor: c }}
                      >
                        <span className="font-bold text-[10px]">{start.format("HH:mm")} -</span>
                        <span className="font-bold text-[10px]">{end.format("HH:mm")}</span>
                        <span className="text-[9px] opacity-80 block">
                          {event.type === "range" ? "Horario Laboral" : event.type === "blocked" ? "Día Inhábil" : event.type}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Indicador de Hora Actual (Línea Roja) */}
              {isToday && (
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-red-500 z-20 pointer-events-none"
                  style={{
                    left: `${(now.hour() + now.minute() / 60) * 4}rem`,
                  }}
                >
                  <div className="absolute top-0 -left-1 w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
