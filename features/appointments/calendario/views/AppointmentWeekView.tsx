"use client";

import React, { useMemo, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { useCalendarContext } from "@/shared/calendar/CalendarContext";
import { AppointmentEventChip } from "../components/AppointmentEventChip";
import type { AppointmentCalendarEvent, DoctorResource } from "../../types/appointment.types";

const HOUR_HEIGHT = 64; // px por hora
const START_HOUR = 7; // hora de inicio visible por defecto

interface Props {
  events: AppointmentCalendarEvent[];
  resources: DoctorResource[];
}

export function AppointmentWeekView({ events }: Props) {
  const { currentDate, onCellClick, onEventClick } = useCalendarContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll automático a hora de inicio al montar
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = START_HOUR * HOUR_HEIGHT;
    }
  }, []);

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => currentDate.day(1).add(i, "day")), [currentDate]);

  const hours = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const todayStr = dayjs().format("YYYY-MM-DD");
  const now = dayjs();

  return (
    <div ref={scrollRef} className="flex-1 overflow-auto bg-fondo-inputs custom-scrollbar">
      {/* Header: días de la semana */}
      <div className="flex sticky top-0 z-10 bg-fondo-inputs pb-1">
        <div className="w-12 shrink-0" />
        <div className="flex flex-1">
          {days.map((day) => {
            const isToday = day.format("YYYY-MM-DD") === todayStr;
            return (
              <div
                key={day.format("YYYY-MM-DD")}
                className={`flex-1 text-center py-1.5 text-xs font-semibold capitalize rounded-sm ${
                  isToday ? "text-principal bg-principal/10" : "text-subtitulo bg-interior"
                }`}
              >
                <div>{day.format("ddd")}</div>
                <div className={`text-sm ${isToday ? "font-bold" : "font-medium text-encabezado"}`}>{day.date()}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid de horas + días */}
      <div className="flex relative">
        {/* Columna de horas */}
        <div className="w-12 shrink-0">
          {hours.map((h) => (
            <div key={h} className="text-right pr-2 text-[10px] text-subtitulo" style={{ height: HOUR_HEIGHT }}>
              {h.toString().padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Columnas de días */}
        <div className="flex flex-1">
          {days.map((day) => {
            const dateStr = day.format("YYYY-MM-DD");
            const isPast = day.isBefore(now.startOf("day"), "day");
            const isToday = dateStr === todayStr;
            const dayEvents = events.filter((e) => dayjs(e.start).format("YYYY-MM-DD") === dateStr);

            return (
              <div key={dateStr} className="flex-1 relative border-l border-disable/30">
                {/* Celdas de hora (fondo + click) */}
                {hours.map((h) => (
                  <div
                    key={h}
                    style={{ height: HOUR_HEIGHT }}
                    onClick={(e) => {
                      if (!isPast && onCellClick) {
                        onCellClick({ start: day.hour(h).minute(0) }, e);
                      }
                    }}
                    className={`border-b border-disable/20 ${
                      isPast ? "bg-interior/50" : "bg-interior hover:bg-principal/5 cursor-pointer"
                    }`}
                  />
                ))}

                {/* Eventos posicionados absolutamente */}
                {dayEvents.map((event) => {
                  const start = dayjs(event.start);
                  const end = dayjs(event.end);
                  const startFraction = start.hour() + start.minute() / 60;
                  const endFraction = end.hour() + end.minute() / 60;
                  const duration = Math.max(0.5, endFraction - startFraction);
                  const top = startFraction * HOUR_HEIGHT;
                  const height = duration * HOUR_HEIGHT - 2;

                  return (
                    <div key={event.id} style={{ top, height, left: 2, right: 2, position: "absolute", zIndex: 5 }}>
                      <AppointmentEventChip
                        event={event}
                        variant="block"
                        onClick={onEventClick ? (e) => onEventClick(e) : undefined}
                      />
                    </div>
                  );
                })}

                {/* Línea de hora actual */}
                {isToday && (
                  <div
                    className="absolute left-0 right-0 h-[2px] bg-red-500 z-10 pointer-events-none"
                    style={{ top: (now.hour() + now.minute() / 60) * HOUR_HEIGHT }}
                  >
                    <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
