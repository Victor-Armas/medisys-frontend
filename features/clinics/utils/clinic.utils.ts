import { getFullName as sharedGetFullName, getInitials as sharedGetInitials } from "@/shared/utils/user.utils";
import type { DoctorInClinic } from "../types/clinic.types";

export const WEEK_DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function getFullName(dc: DoctorInClinic): string {
  return sharedGetFullName(dc.doctorProfile.user);
}

export function getInitials(dc: DoctorInClinic): string {
  return sharedGetInitials(dc.doctorProfile.user);
}

export function getCapacityColor(used: number, max: number): string {
  const ratio = used / max;
  if (ratio >= 1) return "bg-red-500";
  if (ratio >= 0.7) return "bg-amber-500";
  return "bg-brand";
}
