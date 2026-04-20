"use client";

import React, { createContext, useContext } from "react";
import { CalendarContextValue } from "./types";

const CalendarContext = createContext<CalendarContextValue | null>(null);

export function useCalendarContext() {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendarContext must be used within a CalendarProvider");
  }
  return context;
}

export function CalendarProvider({ children, value }: { children: React.ReactNode; value: CalendarContextValue }) {
  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}
