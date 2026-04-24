"use client";

import { useAppointmentsFilterStore } from "../../store/appointmentsFilter.store";
import { STATUS_CONFIG } from "../../utils/appointment.colors";
import type { AppointmentStatus } from "../../types/appointment.types";

const STATUS_OPTIONS: AppointmentStatus[] = ["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"];

export function StatusFilter() {
  const statusFilter = useAppointmentsFilterStore((s) => s.statusFilter);
  const setStatusFilter = useAppointmentsFilterStore((s) => s.setStatusFilter);

  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-semibold text-subtitulo uppercase tracking-wider px-1 mb-1">Estado</p>
      <button
        onClick={() => setStatusFilter(null)}
        className={`text-left px-2 py-1.5 rounded-sm text-xs transition-colors ${
          statusFilter === null ? "bg-inner-principal text-principal font-semibold" : "text-subtitulo hover:bg-fondo-inputs"
        }`}
      >
        Todos
      </button>
      {STATUS_OPTIONS.map((status) => {
        const config = STATUS_CONFIG[status];
        const isActive = statusFilter === status;

        return (
          <button
            key={status}
            onClick={() => setStatusFilter(isActive ? null : status)}
            className={`flex items-center gap-2 text-left px-2 py-1.5 rounded-sm text-xs transition-colors ${
              isActive ? "bg-fondo-inputs font-semibold" : "hover:bg-fondo-inputs text-subtitulo"
            }`}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
            <span style={{ color: isActive ? config.color : undefined }}>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
