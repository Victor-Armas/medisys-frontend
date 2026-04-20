import dayjs from "dayjs";
import React from "react";

export type ViewType = "month" | "week";

export interface CalendarEvent {
  id: string | number;
  start: string;
  end: string;
  title?: string;
  type?: "range" | "override" | "appointment" | "blocked";
  color?: string;
  backgroundColor?: string;
}

export interface VisibleRange {
  start: string;
  end: string;
}

export interface CalendarProps {
  events: CalendarEvent[];
  views?: ViewType[];
  onCellClick?: (info: { start: dayjs.Dayjs }, e?: React.MouseEvent) => void;
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
  onCellClick?: (info: { start: dayjs.Dayjs }, e?: React.MouseEvent) => void;
  onEventClick?: (event: CalendarEvent, e?: React.MouseEvent) => void;
}
