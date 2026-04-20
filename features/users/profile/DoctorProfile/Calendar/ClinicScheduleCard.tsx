"use client";

import CalendarWeekView from "./CalendarWeekView";
import CalendarMonthView from "./CalendarMonthView";
import { DoctorClinicItem } from "@/features/users/types";

interface Props {
  dc: DoctorClinicItem;
  viewMode: "week" | "month";
  baseDate: Date; // <--- NUEVO: Recibe la fecha del orquestador
}

export default function ClinicScheduleCard({ dc, viewMode, baseDate }: Props) {
  const isActive = dc.clinic?.isActive ?? true;

  return (
    <div className="bg-fondo-interior rounded-3xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-gray-100 p-6 lg:p-8 flex flex-col h-full w-full">
      {/* Header de la Tarjeta */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h3 className="text-[20px] font-bold text-principal leading-tight mb-1">{dc.clinic?.name || "Consultorio Central"}</h3>
          <p className="text-xs font-medium text-subtitulo">{dc.clinic?.city || "Sede Principal"}</p>
        </div>

        <span
          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${isActive ? "bg-indigo-50 text-principal" : "bg-gray-100 text-gray-400"}`}
        >
          {isActive ? "Activo" : "Inactivo"}
        </span>
      </div>

      {/* Contenido (Vistas) */}
      <div className="grow flex flex-col justify-center">
        {viewMode === "week" ? (
          <CalendarWeekView dc={dc} baseDate={baseDate} />
        ) : (
          <CalendarMonthView dc={dc} baseDate={baseDate} />
        )}
      </div>
    </div>
  );
}
