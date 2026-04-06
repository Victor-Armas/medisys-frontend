"use client";

import { Users } from "lucide-react";
import type { DoctorInClinic } from "../types/clinic.types";
import { DoctorScheduleCard } from "./DoctorScheduleCard";

interface Props {
  doctors: DoctorInClinic[];
  onAddSchedule: (dc: DoctorInClinic, prefillDate?: string) => void;
  onAddOverride: (dc: DoctorInClinic, prefillDate?: string) => void;
}

export function ClinicDoctorsList({ doctors, onAddSchedule, onAddOverride }: Props) {
  if (doctors.length === 0) {
    return (
      <div className="px-8 py-6 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center mb-3">
          <Users size={22} strokeWidth={1.5} className="text-text-disabled" />
        </div>
        <p className="text-sm font-medium text-text-secondary">Sin médicos asignados</p>
        <p className="text-xs text-text-disabled mt-1">Agrega un médico para comenzar a gestionar horarios</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-6 space-y-4">
      {doctors.map((dc) => (
        <DoctorScheduleCard
          key={dc.id}
          doctorClinic={dc}
          canManage={true}
          onAddSchedule={(_, prefillDate) => onAddSchedule(dc, prefillDate)}
          onAddOverride={(_, prefillDate) => onAddOverride(dc, prefillDate)}
        />
      ))}
    </div>
  );
}
