"use client";

import { useIlamyCalendarContext } from "@ilamy/calendar";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function DoctorCalendarHeader() {
  const { currentDate, nextPeriod, prevPeriod, today, setView, view } = useIlamyCalendarContext();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border-default bg-bg-surface">
      {/* navegación */}
      <div className="flex items-center gap-2">
        <button
          onClick={prevPeriod}
          className="px-2 py-1 rounded-md border bg-brand/80 hover:bg-brand cursor-pointer transition text-white"
        >
          <ArrowLeft size={17} />
        </button>

        <button
          onClick={today}
          className="px-2 py-1 rounded-md border bg-brand/80 hover:bg-brand cursor-pointer transition text-white text-xs"
        >
          Hoy
        </button>

        <button
          onClick={nextPeriod}
          className="px-2 py-1 rounded-md border bg-brand/80 hover:bg-brand cursor-pointer transition text-white"
        >
          <ArrowRight size={17} />
        </button>
      </div>

      {/* mes */}
      <span className="text-sm font-semibold text-text-primary capitalize">{currentDate.format("MMMM YYYY")}</span>

      {/* selector vista */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("month")}
          className={`px-3 py-1 rounded-md text-xs border transition ${
            view === "month" ? "bg-brand text-white border-brand" : "border-border-default hover:bg-muted"
          }`}
        >
          Mes
        </button>
        <button
          onClick={() => setView("week")}
          className={`px-3 py-1 rounded-md text-xs border transition ${
            view === "week" ? "bg-brand text-white border-brand" : "border-border-default hover:bg-muted"
          }`}
        >
          Semana
        </button>
      </div>
    </div>
  );
}
