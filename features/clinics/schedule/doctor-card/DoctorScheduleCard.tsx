"use client";

import type { DoctorInClinicContext } from "@features/clinics/types/clinic.types";
import { getFullName, getInitials } from "@features/clinics/utils/clinic.utils";
import { Info } from "lucide-react";
import { DoctorCardHeader } from "./DoctorCardHeader";
import { DoctorCalendarBase } from "./DoctorCalendarBase";
import { DoctorOverrides } from "./DoctorOverrides";

interface Props {
  doctorClinic: DoctorInClinicContext;
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
    <div className="bg-fondo-inputs rounded-md shadow-lg overflow-hidden pt-4">
      <DoctorCardHeader doctorClinic={doctorClinic} fullName={fullName} initials={initials} isPaused={isPaused} />

      <div className=" py-4 ">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-4">
          {/* Calendario interactivo */}
          <div className="lg:col-span-2">
            <DoctorCalendarBase
              canManage={canManage}
              isPaused={isPaused}
              doctorClinicId={doctorClinic.id}
              onAddSchedule={onAddSchedule}
              scheduleRanges={doctorClinic.scheduleRanges}
              scheduleOverrides={doctorClinic.scheduleOverrides}
            />
          </div>

          {/* Excepciones listadas */}
          <div className="lg:col-span-1">
            <DoctorOverrides
              doctorClinicId={doctorClinic.id}
              scheduleOverrides={doctorClinic.scheduleOverrides}
              canManage={canManage}
              isPaused={isPaused}
              onAddOverride={onAddOverride}
            />
          </div>
        </div>

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
