"use client";

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import { CalendarProps, ViewType } from "./types";
import { CalendarProvider } from "./CalendarContext";

import { DefaultCalendarHeader } from "./components/DefaultCalendarHeader";
import { BaseCalendar } from "./BaseCalendar";

export function Calendar({
  events,
  views = ["month", "week"],
  onCellClick,
  onEventClick,
  onVisibleRangeChange,
  onViewChange,
}: CalendarProps) {
  const initialView = views.includes("month") ? "month" : views[0] || "month";
  const [internalView, setInternalView] = useState<ViewType>(initialView);
  const [internalDate, setInternalDate] = useState<dayjs.Dayjs>(dayjs());

  // Effect: Emit visible range changes immediately on mount and navigation/view change
  useEffect(() => {
    if (!onVisibleRangeChange) return;

    let start: dayjs.Dayjs;
    let end: dayjs.Dayjs;

    if (internalView === "month") {
      start = internalDate.startOf("month").subtract(1, "week");
      end = internalDate.endOf("month").add(1, "week");
    } else {
      start = internalDate.startOf("week").subtract(1, "day");
      end = internalDate.endOf("week").add(1, "day");
    }

    onVisibleRangeChange({
      start: start.toISOString(),
      end: end.toISOString()
    });
  }, [internalDate, internalView]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSetView = (newView: ViewType) => {
    setInternalView(newView);
    if (onViewChange) onViewChange(newView);
  };

  const handleSetDate = (newDate: dayjs.Dayjs) => {
    setInternalDate(newDate);
  };

  const nextPeriod = () => {
    if (internalView === "month") handleSetDate(internalDate.add(1, "month"));
    else handleSetDate(internalDate.add(1, "week"));
  };

  const prevPeriod = () => {
    if (internalView === "month") handleSetDate(internalDate.subtract(1, "month"));
    else handleSetDate(internalDate.subtract(1, "week"));
  };

  const today = () => {
    handleSetDate(dayjs());
  };

  return (
    <CalendarProvider
      value={{
        currentDate: internalDate,
        currentView: internalView,
        views,
        events,
        nextPeriod,
        prevPeriod,
        today,
        setView: handleSetView,
        onCellClick,
        onEventClick,
      }}
    >
      <div className="flex flex-col h-full w-full rounded-md overflow-hidden">
        <DefaultCalendarHeader />
        <BaseCalendar />
      </div>
    </CalendarProvider>
  );
}
