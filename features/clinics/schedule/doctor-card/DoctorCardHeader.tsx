"use client";

import { cn } from "@shared/lib/utils";
import type { DoctorInClinic } from "@features/clinics/types/clinic.types";
import { MoreVertical, UserMinus } from "lucide-react";
import { useToggleDoctorAvailability, useToggleSchedulePermission } from "@/features/users/hooks/useUsers";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { useState } from "react";
import { ConfirmDialog } from "@/shared/providers/ConfirmDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/ui/dropdown-menu";
import { useDeactivateDoctorFromClinic } from "@features/clinics/hooks/useClinics";
import { notify } from "@/shared/ui/toaster";

interface Props {
  doctorClinic: DoctorInClinic;
  fullName: string;
  initials: string;
  isPaused: boolean;
}

export function DoctorCardHeader({ doctorClinic, fullName, initials, isPaused }: Props) {
  const { doctorProfile } = doctorClinic;
  const toggleAvailability = useToggleDoctorAvailability();
  const toggleSchedulePerm = useToggleSchedulePermission();
  const { canGrantSchedulePermission } = usePermissions();
  const isAvailabilityPending = toggleAvailability.isPending;
  const isSchedulePermPending = toggleSchedulePerm.isPending;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const deactivateDoctor = useDeactivateDoctorFromClinic();

  const handleDeactivate = () => {
    const loadId = notify.loading("Desvinculando al médico...");
    deactivateDoctor.mutate(
      { clinicId: doctorClinic.clinicId, doctorProfileId: doctorProfile.id },
      {
        onSuccess: () => {
          notify.success("Médico desvinculado exitosamente.", undefined, { id: loadId });
        },
        onError: () => {
          notify.error("Ocurrió un error al intentar desvincular.", undefined, { id: loadId });
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-4 px-6 py-2  ">
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full ${isPaused ? "bg-wairning-text" : "bg-principal-gradient"}  flex items-center justify-center text-white font-bold text-sm`}
      >
        {initials}
      </div>

      {/* Nombre y especialidad */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-encabezado truncate">{fullName}</h3>
          {isPaused && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-wairning text-wairning-text  border border-amber-500/20 uppercase tracking-wide shrink-0">
              Pausado
            </span>
          )}
        </div>
        <p className="text-xs text-subtitulo mt-0.5 truncate">
          {doctorProfile.specialty ?? "Sin especialidad"} · Cédula {doctorProfile.professionalLicense}
        </p>
      </div>

      {/* Controles */}
      <div className="flex items-center gap-5 shrink-0">
        {/* ── Estado global (isAvailable) ──────────────────────────── */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-subtitulo uppercase tracking-wider mb-1.5">Estado global</p>
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-medium", isPaused ? "text-wairning-text " : "text-positive-text")}>
              {isPaused ? "Pausado" : "Disponible"}
            </span>
            <button
              onClick={() => toggleAvailability.mutate(doctorProfile.id)}
              disabled={isAvailabilityPending}
              className={cn(
                "w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                isPaused ? "bg-wairning-text" : "bg-positive-text",
              )}
              aria-label={isPaused ? "Reanudar doctor" : "Pausar doctor"}
            >
              <div className={cn("w-4 h-4 bg-white rounded-full transition-all", !isPaused && "ml-auto")} />
            </button>
          </div>
        </div>

        <div className="w-px h-8 bg-border-default" />

        {/* ── Duración cita ─────────────────────────────────────────── */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-subtitulo uppercase tracking-wider mb-1.5">Duración cita</p>
          <span className="text-xs font-semibold text-encabezado">{doctorProfile.defaultAppointmentDuration} min</span>
        </div>

        <div className="w-px h-8 bg-border-default" />

        {/* ── Auto-gestión de horario (canManageOwnSchedule) ─────────── */}
        <div className="text-center">
          <p className="text-[10px] font-bold text-subtitulo uppercase tracking-wider mb-1.5">Auto-gestión</p>
          <div className="flex items-center gap-2">
            {/* Contenedor flex para alinear texto y switch */}
            {canGrantSchedulePermission && (
              <span
                className={cn("text-xs font-medium", doctorProfile.canManageOwnSchedule ? "text-principal" : "text-subtitulo")}
              >
                {doctorProfile.canManageOwnSchedule ? "Habilitado" : "Deshabilitado"}
              </span>
            )}
            {canGrantSchedulePermission ? (
              <button
                onClick={() => toggleSchedulePerm.mutate(doctorProfile.id)}
                disabled={isSchedulePermPending}
                className={cn(
                  "w-9 h-5 rounded-full flex items-center px-0.5 transition-colors ",
                  "disabled:opacity-60 disabled:cursor-not-allowed",
                  doctorProfile.canManageOwnSchedule ? "bg-principal" : "bg-secundario",
                )}
                aria-label={doctorProfile.canManageOwnSchedule ? "Revocar permiso" : "Conceder permiso"}
              >
                <div
                  className={cn("w-4 h-4 bg-white rounded-full transition-all", doctorProfile.canManageOwnSchedule && "ml-auto")}
                />
              </button>
            ) : (
              <span
                className={cn(
                  "text-[11px] font-semibold px-2 py-0.5 rounded-md",
                  doctorProfile.canManageOwnSchedule ? "bg-positive  text-positive-text" : "bg-negative text-negative-text",
                )}
              >
                {doctorProfile.canManageOwnSchedule ? "Habilitada" : "Deshabilitada"}
              </span>
            )}
          </div>
        </div>

        <div className="w-px h-8 bg-border-default" />

        {/* ── Menú acciones ─────────────────── */}
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 rounded-lg text-subtitulo hover:text-encabezado hover:bg-subtitulo transition-colors outline-none">
            <MoreVertical size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-fondo-inputs border border-border-default shadow-lg text-subtitulo rounded-lg"
          >
            <DropdownMenuItem
              onClick={() => setIsConfirmOpen(true)}
              className="text-wairning-text hover:bg-wairning-bg transition-colors font-medium flex items-center cursor-pointer p-2 m-1 rounded-md"
            >
              <UserMinus size={14} className="mr-2" /> Desvincular médico
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ConfirmDialog
          open={isConfirmOpen}
          onOpenChange={setIsConfirmOpen}
          title="Desvincular médico"
          message={`¿Estás seguro que deseas desvincular a ${fullName} de esta clínica? Sus citas pasadas y expedientes permanecerán intactos.`}
          confirmText="Sí, desvincular"
          cancelText="Cancelar"
          variant="warning"
          onConfirm={handleDeactivate}
        />
      </div>
    </div>
  );
}
