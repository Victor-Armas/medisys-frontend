"use client";

import { cn } from "@shared/lib/utils";
import type { DoctorInClinic } from "@features/clinics/types/clinic.types";
import { WEEK_DAYS, getFullName, getInitials } from "@features/clinics/utils/clinic.utils";
import { useRemoveSchedule } from "@features/clinics/hooks";
import { X, MoreVertical, Check, Info, Plus } from "lucide-react";
import { useToggleDoctorAvailability } from "@/features/users/hooks/useUsers";

interface Props {
  doctorClinic: DoctorInClinic;
  canManage: boolean;
  onAddSchedule: (doctorClinicId: string) => void;
}

export function DoctorScheduleCard({ doctorClinic, canManage, onAddSchedule }: Props) {
  const { doctorProfile } = doctorClinic;
  const toggleAvailability = useToggleDoctorAvailability();
  const removeSchedule = useRemoveSchedule();
  const fullName = getFullName(doctorClinic);
  const initials = getInitials(doctorClinic);
  const isPaused = !doctorProfile.isAvailable;

  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden">
      {/* Cabecera médico */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-border-default">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-brand-gradient-from to-brand-gradient-to flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          <div
            className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-surface",
              !doctorProfile.isAvailable ? "bg-amber-500" : "bg-emerald-500",
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
              <span className={cn("text-xs font-medium", isPaused ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400")}>
                {isPaused ? "Pausado" : "Disponible"}
              </span>
              <button
                onClick={() => toggleAvailability.mutate(doctorProfile.id)}
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

      {/* Bloques horarios */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Bloques semanales</p>
          {doctorClinic.schedules.length > 0 && canManage && (
            <button className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors">Limpiar todo</button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {doctorClinic.schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border group",
                isPaused ? "bg-bg-subtle border-border-default opacity-60" : "bg-brand/10 border-brand/20",
              )}
            >
              <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-md", isPaused ? "text-text-secondary bg-bg-base" : "text-brand bg-brand/15")}>
                {WEEK_DAYS[schedule.weekDay]}
              </span>
              <span className={cn("text-[12px] font-medium", isPaused ? "text-text-secondary" : "text-text-primary")}>
                {schedule.startTime} — {schedule.endTime}
              </span>
              {canManage && !isPaused && (
                <button
                  onClick={() => removeSchedule.mutate(schedule.id)}
                  disabled={removeSchedule.isPending}
                  className="opacity-0 group-hover:opacity-100 ml-1 text-text-secondary hover:text-red-500 transition-all"
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              )}
            </div>
          ))}

          {/* Botón agregar bloque */}
          {canManage && (
            <button
              onClick={() => !isPaused && onAddSchedule(doctorClinic.id)}
              disabled={isPaused}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed transition-all text-[12px] font-medium cursor-pointer",
                isPaused
                  ? "border-border-default text-text-disabled cursor-not-allowed opacity-40"
                  : "border-border-strong text-text-secondary hover:border-brand hover:text-brand hover:bg-brand/5",
              )}
            >
              <Plus size={13} strokeWidth={4} />
              Agregar bloque
            </button>
          )}
        </div>

        {isPaused && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-3 flex items-center gap-1.5">
            <Info size={12} strokeWidth={2} />
            Médico pausado — las citas quedarán en espera hasta que reanude
          </p>
        )}
      </div>
    </div>
  );
}
