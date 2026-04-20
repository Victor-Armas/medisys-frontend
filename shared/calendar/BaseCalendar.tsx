"use client";

import React from "react";
import { useCalendarContext } from "./CalendarContext";
import { MonthView } from "./views/MonthView";
import { WeekView } from "./views/WeekView";


export function BaseCalendar() {
  const { currentView } = useCalendarContext();

  return (
    <div className="flex-1 w-full relative min-h-0">
      {currentView === "month" && <MonthView />}
      {currentView === "week" && <WeekView />}
    </div>
  );
}
