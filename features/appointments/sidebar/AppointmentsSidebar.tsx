"use client";

import { Button } from "@/shared/ui/button";
import { X } from "lucide-react";
import { DoctorToggleFilter } from "./filtros/DoctorToggleFilter";
import { StatusFilter } from "./filtros/StatusFilter";
import { useAppointmentsFilterStore } from "../store/appointmentsFilter.store";
import type { DoctorResource } from "../types/appointment.types";
import ClinicToggleFilter from "./filtros/ClinicToggleFilter";

interface Props {
  resources: DoctorResource[];
  onNewAppointment: () => void;
  onCloseMobile?: () => void;
}

export function AppointmentsSidebar({ resources, onNewAppointment, onCloseMobile }: Props) {
  const resetFilters = useAppointmentsFilterStore((s) => s.resetFilters);

  return (
    <aside className="w-64 md:w-56 h-full shrink-0 bg-interior flex flex-col gap-4 p-4 border-r border-disable/40 overflow-y-auto shadow-xl md:shadow-none relative">
      {onCloseMobile && (
        <button
          onClick={onCloseMobile}
          className="absolute top-2 right-2 p-1.5 rounded-md text-subtitulo hover:bg-black/5 md:hidden"
        >
          <X size={20} />
        </button>
      )}

      <div className="pt-8 md:pt-0">
        <Button variant="primary2" icon="agregar" className="w-full px-3 py-2 text-sm" onClick={onNewAppointment}>
          Nueva cita
        </Button>
      </div>

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
