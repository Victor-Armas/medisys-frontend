import type { DoctorInClinic } from "@features/clinics/types/clinic.types";

export const WEEK_DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function getFullName(dc: DoctorInClinic): string {
  const { firstName, middleName, lastNamePaternal, lastNameMaternal } =
    dc.doctorProfile.user;
  return [firstName, middleName, lastNamePaternal, lastNameMaternal]
    .filter(Boolean)
    .join(" ");
}

export function getInitials(dc: DoctorInClinic): string {
  const { firstName, lastNamePaternal } = dc.doctorProfile.user;
  return `${firstName[0] ?? ""}${lastNamePaternal[0] ?? ""}`.toUpperCase();
}

export function getCapacityColor(used: number, max: number): string {
  const ratio = used / max;
  if (ratio >= 1) return "bg-red-500";
  if (ratio >= 0.7) return "bg-amber-500";
  return "bg-brand";
}
