"use client";

import React, { useMemo } from "react";
import dayjs from "dayjs";
import { useCalendarContext } from "../CalendarContext";

export function MonthView() {
  const { currentDate, events, onCellClick, onEventClick } = useCalendarContext();

  const daysData = useMemo(() => {
    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");

    const firstDayOfWeek = startOfMonth.day();
    const emptyDaysBefore = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    const daysInMonth = endOfMonth.date();

    const calendarDays = [];

    for (let i = 0; i < emptyDaysBefore; i++) {
      calendarDays.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = startOfMonth.date(i);
      const dateStr = date.format("YYYY-MM-DD");
      // Filtramos eventos ordenados por hora
      const dayEvents = events
        .filter((e) => dayjs(e.start).format("YYYY-MM-DD") === dateStr)
        .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)));
      calendarDays.push({ date, dayEvents });
    }

    return calendarDays;
  }, [currentDate, events]);

  const weekDaysHeader = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  return (
    <div className="flex flex-col h-full bg-fondo-inputs pb-2 px-2">
      <div className="grid grid-cols-7 bg-interior rounded-t-lg shadow-xs my-2">
        {weekDaysHeader.map((d) => (
          <div key={d} className="text-center py-2 text-xs font-semibold text-subtitulo">
            {d}
          </div>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-7 auto-rows-fr gap-px pb-1 shadow-md rounded-sm p-1">
        {daysData.map((dayData, idx) => {
          if (!dayData) {
            return <div key={`empty-${idx}`} className="bg-inner-secundario/40 rounded-md m-0.5 pointer-events-none" />;
          }

          const { date, dayEvents } = dayData;
          const isPast = date.isBefore(dayjs().startOf("day"), "day");
          const isToday = date.isSame(dayjs().startOf("day"), "day");

          const handleCellClick = (e: React.MouseEvent) => {
            if (onCellClick) onCellClick({ start: date }, e);
          };

          return (
            <div
              key={date.format("YYYY-MM-DD")}
              onClick={handleCellClick}
              className={`
                flex flex-col p-1 bg-interior rounded-md m-0.5 transition-colors overflow-hidden
                ${isPast ? "opacity-60" : "hover:bg-principal-hover2/20 cursor-pointer"}
                ${isToday ? "ring-1 ring-principal/30 bg-principal/5" : ""}
              `}
            >
              <span className={`text-[11px] font-medium mb-1 pl-1 ${isToday ? "text-principal font-bold" : "text-subtitulo"}`}>
                {date.date()}
              </span>

              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-[2px]">
                {dayEvents.map((event) => {
                  const c = event.color || "var(--color-principal)";
                  const bg = event.backgroundColor || "transparent";
                  const startStr = dayjs(event.start).format("HH:mm");
                  const endStr = dayjs(event.end).format("HH:mm");

                  const handleClickEvent = (e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (!isPast && onEventClick) onEventClick(event, e);
                  };

                  return (
                    <div
                      key={event.id}
                      onClick={handleClickEvent}
                      className={!isPast ? "cursor-pointer" : "cursor-default"}
                    >
                      <div
                        className="group relative flex items-center gap-1 rounded-sm px-1.5 py-px mb-[2px] transition-all cursor-pointer overflow-hidden h-5"
                        style={{
                          backgroundColor: bg,
                          color: c,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: isPast ? "var(--color-subtitulo)" : c }}
                        />
                        <div className="relative flex-1">
                          <span className="block text-[9px] font-bold truncate group-hover:hidden">
                            {event.title || "Evento"}
                          </span>
                          <span className="hidden group-hover:block text-[9px] font-black tabular-nums whitespace-nowrap">
                            {startStr} - {endStr}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
