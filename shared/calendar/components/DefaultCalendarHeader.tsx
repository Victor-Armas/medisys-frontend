"use client";

import { useCalendarContext } from "../CalendarContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ViewType } from "../types";

function viewLabel(v: ViewType): string {
  if (v === "month") return "Mes";
  if (v === "week") return "Semana";
  return "Día";
}

export function DefaultCalendarHeader() {
  const { currentDate, nextPeriod, prevPeriod, today, currentView, setView, views } = useCalendarContext();

  const titleText = currentView === "day" ? currentDate.format("dddd D") : currentDate.format("MMMM");

  const subtitleText = currentView === "day" ? currentDate.format("MMMM YYYY") : currentDate.format("YYYY");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between px-4 py-3">
      <h2 className="flex items-baseline gap-2 text-2xl font-semibold text-encabezado capitalize tracking-tight">
        {titleText}
        <span className="text-lg font-medium text-subtitulo/70">{subtitleText}</span>
      </h2>

      <div className="flex flex-wrap items-center gap-3">
        {views.length > 1 && (
          <div className="flex items-center rounded-xs bg-inner-principal shadow-sm text-xs font-medium">
            {views.map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 capitalize transition-all ${
                  currentView === v
                    ? "bg-principal text-white rounded-xs shadow-sm"
                    : "text-subtitulo hover:text-encabezado hover:bg-principal-hover2"
                }`}
              >
                {viewLabel(v)}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center rounded-xs shadow-md bg-inner-principal">
          <button
            onClick={prevPeriod}
            className="p-1.5 text-principal transition-all hover:bg-principal-hover2 hover:rounded-l-xs"
            aria-label="Periodo anterior"
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
          </button>
          <button
            onClick={today}
            className="px-4 py-1.5 text-principal text-xs font-bold transition-all hover:bg-principal-hover2"
          >
            Hoy
          </button>
          <button
            onClick={nextPeriod}
            className="p-1.5 text-principal transition-all hover:bg-principal-hover2 hover:rounded-r-xs"
            aria-label="Periodo siguiente"
          >
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
