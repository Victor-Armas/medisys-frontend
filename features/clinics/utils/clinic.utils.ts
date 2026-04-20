import {
  getFullName as sharedGetFullName,
  getName as sharedGetName,
  getInitials as sharedGetInitials,
} from "@/shared/utils/user.utils";
import type { DoctorInClinic } from "../types/clinic.types";

export const WEEK_DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function getFullName(dc: DoctorInClinic): string {
  return sharedGetFullName(dc.doctorProfile.user);
}

export function getName(dc: DoctorInClinic): string {
  return sharedGetName(dc.doctorProfile.user);
}

export function getInitials(dc: DoctorInClinic): string {
  return sharedGetInitials(dc.doctorProfile.user);
}
