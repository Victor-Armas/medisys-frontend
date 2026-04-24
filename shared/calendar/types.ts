import dayjs from "dayjs";
import React from "react";

export type ViewType = "month" | "week" | "day";

export interface CalendarEvent {
  id: string | number;
  start: string;
  end: string;
  title?: string;
  type?: "range" | "override" | "appointment" | "blocked";
  color?: string;
  backgroundColor?: string;
  resourceId?: string; // columna de doctor en day view
}

// Columna de recurso (médico) para la vista día
export interface CalendarResource {
  id: string;
  title: string;
  color?: string;
  subtitle?: string;
}

export interface VisibleRange {
  start: string;
  end: string;
}

export interface CalendarProps {
  events: CalendarEvent[];
  views?: ViewType[];
  onCellClick?: (info: { start: dayjs.Dayjs; resourceId?: string }, e?: React.MouseEvent) => void;
  onEventClick?: (event: CalendarEvent, e?: React.MouseEvent) => void;
  onVisibleRangeChange?: (range: VisibleRange) => void;
  onViewChange?: (view: ViewType) => void;
}

export interface CalendarContextValue {
  currentDate: dayjs.Dayjs;
  currentView: ViewType;
  views: ViewType[];
  events: CalendarEvent[];
  nextPeriod: () => void;
  prevPeriod: () => void;
  today: () => void;
  setView: (view: ViewType) => void;
  onCellClick?: (info: { start: dayjs.Dayjs; resourceId?: string }, e?: React.MouseEvent) => void;
  onEventClick?: (event: CalendarEvent, e?: React.MouseEvent) => void;
}
