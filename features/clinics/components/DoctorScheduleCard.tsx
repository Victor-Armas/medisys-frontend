// Reemplazar el archivo completo
"use client";

import type { DoctorInClinic } from "@features/clinics/types/clinic.types";
import { getFullName, getInitials } from "@features/clinics/utils/clinic.utils";
import { Info } from "lucide-react";
import { DoctorCardHeader } from "./doctor-card/DoctorCardHeader";

import { DoctorOverrides } from "./doctor-card/DoctorOverrides";
import { DoctorCalendarBase } from "./doctor-card/DoctorCalendarBase";

interface Props {
  doctorClinic: DoctorInClinic;
  canManage: boolean;
  onAddSchedule: (doctorClinicId: string, prefillDate?: string) => void;
  onAddOverride: (doctorClinicId: string, prefillDate?: string) => void;
}

export function DoctorScheduleCard({ doctorClinic, canManage, onAddSchedule, onAddOverride }: Props) {
  const { doctorProfile } = doctorClinic;
  const fullName = getFullName(doctorClinic);
  const initials = getInitials(doctorClinic);
  const isPaused = !doctorProfile.isAvailable;

  return (
    <div className="bg-bg-surface border border-border-default rounded-2xl overflow-hidden">
      <DoctorCardHeader doctorClinic={doctorClinic} fullName={fullName} initials={initials} isPaused={isPaused} />

      <div className="px-6 py-4 space-y-4">
        {/* Instrucciones */}
        <div className="flex gap-3 p-3 bg-bg-base border border-border-default rounded-xl items-start">
          <Info size={14} className="text-brand shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            Haz click en una celda vacía para agregar un bloque de horario. Haz click en un evento existente para agregar una
            excepción. Arrastra los eventos para moverlos o redimensionarlos.
          </p>
        </div>

        {/* Calendario interactivo */}
        <DoctorCalendarBase
          canManage={canManage}
          isPaused={isPaused}
          doctorClinicId={doctorClinic.id}
          onAddSchedule={onAddSchedule}
          scheduleRanges={doctorClinic.scheduleRanges}
          scheduleOverrides={doctorClinic.scheduleOverrides}
        />

        {/* <DoctorScheduleCalendar
          doctorClinicId={doctorClinic.id}
          scheduleRanges={doctorClinic.scheduleRanges}
          scheduleOverrides={doctorClinic.scheduleOverrides}
          canManage={canManage}
          isPaused={isPaused}
          onAddSchedule={onAddSchedule}|
          onAddOverride={onAddOverride}
        /> */}

        {/* Excepciones listadas */}
        <DoctorOverrides
          doctorClinicId={doctorClinic.id}
          scheduleOverrides={doctorClinic.scheduleOverrides}
          canManage={canManage}
          isPaused={isPaused}
          onAddOverride={onAddOverride}
        />

        {isPaused && (
          <p className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <Info size={12} strokeWidth={2} />
            Médico pausado — las citas quedarán en espera hasta que reanude
          </p>
        )}
      </div>
    </div>
  );
}
