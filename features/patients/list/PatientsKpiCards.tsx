"use client";

import { Activity, AlertCircle, Users } from "lucide-react";
import { KpiCard } from "@/features/users/components/shared/KpiCard";
import type { PatientListItem } from "../types/patient.types";

interface Props {
  total: number;
  patients: PatientListItem[];
}

export function PatientsKpiCards({ total, patients }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard icon={<Users size={22} />} label="Total pacientes" value={total} color="blue" />
      <KpiCard icon={<Activity size={22} />} label="Activos" value={patients.filter((p) => p.isActive).length} color="emerald" />
      <KpiCard
        icon={<AlertCircle size={22} />}
        label="Sin tipo sanguíneo"
        value={patients.filter((p) => !p.bloodType).length}
        color="amber"
      />
    </div>
  );
}
