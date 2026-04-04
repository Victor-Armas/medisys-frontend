"use client";

import { cn } from "@shared/lib/utils";
import type { DoctorInClinic } from "@features/clinics/types/clinic.types";
import { Check, MoreVertical } from "lucide-react";
import { useToggleDoctorAvailability } from "@/features/users/hooks/useUsers";

interface Props {
  doctorClinic: DoctorInClinic;
  fullName: string;
  initials: string;
  isPaused: boolean;
}

export function DoctorCardHeader({ doctorClinic, fullName, initials, isPaused }: Props) {
  const { doctorProfile } = doctorClinic;
  const toggleAvailability = useToggleDoctorAvailability();

  return (
    <div className="flex items-center gap-4 px-6 py-4 border-b border-border-default">
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-brand-gradient-from to-brand-gradient-to flex items-center justify-center text-white font-bold text-sm">
          {initials}
        </div>
        <div
          className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-surface",
            isPaused ? "bg-amber-500" : "bg-emerald-500",
          )}
        />
      </div>

      {/* Nombre y especialidad */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-text-primary truncate">{fullName}</h3>
          {isPaused && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wide shrink-0">
              Pausado
            </span>
          )}
        </div>
        <p className="text-xs text-text-secondary mt-0.5 truncate">
          {doctorProfile.specialty ?? "Sin especialidad"} · Cédula {doctorProfile.professionalLicense}
        </p>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-5 shrink-0">
        {/* Estado global */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Estado global</p>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs font-medium",
                isPaused ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400",
              )}
            >
              {isPaused ? "Pausado" : "Disponible"}
            </span>
            <button
              onClick={() => toggleAvailability.mutate(doctorProfile.id)}
              disabled={toggleAvailability.isPending}
              className={cn(
                "w-9 h-5 rounded-full flex items-center px-0.5 transition-colors cursor-pointer",
                isPaused ? "bg-border-strong" : "bg-emerald-500",
              )}
            >
              <div className={cn("w-4 h-4 bg-white rounded-full transition-all", !isPaused && "ml-auto")} />
            </button>
          </div>
        </div>

        <div className="w-px h-8 bg-border-default" />

        {/* Duración */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Duración cita</p>
          <span className="text-xs font-semibold text-text-primary">{doctorProfile.defaultAppointmentDuration} min</span>
        </div>

        <div className="w-px h-8 bg-border-default" />

        {/* Permiso auto-gestión */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1.5">Permisos</p>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-text-primary">Auto-gestión</span>
            <div
              className={cn(
                "w-4 h-4 rounded flex items-center justify-center",
                doctorProfile.canManageOwnSchedule ? "bg-brand" : "border border-border-strong bg-bg-subtle",
              )}
            >
              {doctorProfile.canManageOwnSchedule && <Check size={10} strokeWidth={3} color="white" />}
            </div>
          </div>
        </div>

        {/* Menú acciones (placeholder) */}
        <div className="w-px h-8 bg-border-default" />
        <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors cursor-pointer">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
}
