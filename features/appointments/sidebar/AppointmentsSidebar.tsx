"use client";

import { Button } from "@/shared/ui/button";
import { DoctorToggleFilter } from "./filtros/DoctorToggleFilter";
import { StatusFilter } from "./filtros/StatusFilter";
import { useAppointmentsFilterStore } from "../store/appointmentsFilter.store";
import type { DoctorResource } from "../types/appointment.types";
import ClinicToggleFilter from "./filtros/ClinicToggleFilter";

interface Props {
  resources: DoctorResource[];
  onNewAppointment: () => void;
}

export function AppointmentsSidebar({ resources, onNewAppointment }: Props) {
  const resetFilters = useAppointmentsFilterStore((s) => s.resetFilters);

  return (
    <aside className="w-56 shrink-0 bg-interior flex flex-col gap-4 p-3 border-r border-disable/40 overflow-y-auto">
      <Button variant="primary2" icon="agregar" className="w-full px-3 py-2 text-sm" onClick={onNewAppointment}>
        Nueva cita
      </Button>

      <ClinicToggleFilter resources={resources} />

      <DoctorToggleFilter resources={resources} />

      <div className="border-t border-disable/40 pt-3">
        <StatusFilter />
      </div>

      <div className="border-t border-disable/40 pt-3 mt-auto">
        <button
          onClick={resetFilters}
          className="text-xs text-subtitulo hover:text-encabezado transition-colors w-full text-left px-1"
        >
          Limpiar filtros
        </button>
      </div>
    </aside>
  );
}
