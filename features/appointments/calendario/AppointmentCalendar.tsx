"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { CalendarProvider } from "@/shared/calendar/CalendarContext";
import { DefaultCalendarHeader } from "@/shared/calendar/components/DefaultCalendarHeader";
import { AppointmentMonthView } from "./views/AppointmentMonthView";
import { AppointmentWeekView } from "./views/AppointmentWeekView";
import { AppointmentDayView } from "./views/AppointmentDayView";
import type { ViewType, VisibleRange } from "@/shared/calendar/types";
import type { AppointmentCalendarEvent, DoctorResource } from "../types/appointment.types";

interface Props {
  events: AppointmentCalendarEvent[];
  resources: DoctorResource[];
  onCellClick: (info: { start: dayjs.Dayjs; resourceId?: string }) => void;
  onEventClick: (event: AppointmentCalendarEvent) => void;
  onVisibleRangeChange: (range: VisibleRange) => void;
}

export function AppointmentCalendar({ events, resources, onCellClick, onEventClick, onVisibleRangeChange }: Props) {
  const [currentView, setCurrentView] = useState<ViewType>("day");
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Emitir el rango visible cuando cambia la fecha o la vista
  useEffect(() => {
    let start: dayjs.Dayjs;
    let end: dayjs.Dayjs;

    if (currentView === "month") {
      start = currentDate.startOf("month").subtract(1, "week");
      end = currentDate.endOf("month").add(1, "week");
    } else if (currentView === "week") {
      start = currentDate.day(1).subtract(1, "day");
      end = currentDate.day(1).add(7, "day");
    } else {
      start = currentDate.startOf("day");
      end = currentDate.endOf("day");
    }

    onVisibleRangeChange({ start: start.toISOString(), end: end.toISOString() });
  }, [currentDate, currentView]); // eslint-disable-line

  const nextPeriod = () => {
    if (currentView === "month") setCurrentDate((d) => d.add(1, "month"));
    else if (currentView === "week") setCurrentDate((d) => d.add(1, "week"));
    else setCurrentDate((d) => d.add(1, "day"));
  };

  const prevPeriod = () => {
    if (currentView === "month") setCurrentDate((d) => d.subtract(1, "month"));
    else if (currentView === "week") setCurrentDate((d) => d.subtract(1, "week"));
    else setCurrentDate((d) => d.subtract(1, "day"));
  };

  const today = () => setCurrentDate(dayjs());

  return (
    <CalendarProvider
      value={{
        currentDate,
        currentView,
        views: ["month", "week", "day"],
        events: [], // los eventos se pasan directamente a las vistas — no por contexto
        nextPeriod,
        prevPeriod,
        today,
        setView: setCurrentView,
        onCellClick: (info) => onCellClick({ ...info }),
        onEventClick: (event) => onEventClick(event as AppointmentCalendarEvent),
      }}
    >
      <div className="flex flex-col h-full w-full rounded-md overflow-hidden">
        <DefaultCalendarHeader />
        <div className="flex-1 min-h-0 flex flex-col">
          {currentView === "month" && <AppointmentMonthView events={events} resources={resources} />}
          {currentView === "week" && <AppointmentWeekView events={events} resources={resources} />}
          {currentView === "day" && <AppointmentDayView events={events} resources={resources} />}
        </div>
      </div>
    </CalendarProvider>
  );
}
