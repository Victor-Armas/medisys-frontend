// utils/user-stats.ts
// Calcula las métricas de KPIs fuera del componente para mantenerlo limpio.
// Retorna un array listo para mapear en KpiCard.

import { User } from "@/features/users/types/users.types";
import { KpiStat } from "@/shared/types/stats.types";
import { Users, Stethoscope, AlertCircle, Building2 } from "lucide-react";

export function calculateUserStats(users: User[]): KpiStat[] {
  const doctors = users.filter((u) => u.role === "DOCTOR" || u.role === "MAIN_DOCTOR");

  const totalUsers = users.length;
  const activeDoctors = doctors.filter((u) => u.isActive).length;
  const inactiveUsers = users.filter((u) => !u.isActive).length;
  const withoutClinic = doctors.filter((u) => (u.doctorProfile?.doctorClinics?.filter((c) => c.id).length ?? 0) === 0).length;

  return [
    {
      label: "Total usuarios",
      value: totalUsers,
      icon: Users,
      color: "blue",
      sub: "En el sistema",
    },
    {
      label: "Médicos activos",
      value: activeDoctors,
      icon: Stethoscope,
      color: "emerald",
      sub: "Con consultorio",
    },
    {
      label: "Inactivos",
      value: inactiveUsers,
      icon: AlertCircle,
      color: "amber",
      sub: "Requieren revisión",
    },
    {
      label: "Sin consultorio",
      value: withoutClinic,
      icon: Building2,
      color: "red",
      sub: "Por asignar",
    },
  ];
}
