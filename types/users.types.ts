import { DoctorProfile } from "./doctors.types";

export type Role =
  | "ADMIN_SYSTEM"
  | "MAIN_DOCTOR"
  | "DOCTOR"
  | "RECEPTIONIST"
  | "PATIENT";

export interface SystemUser {
  id: string;
  email: string;
  firstName: string;
  middleName?: string | null;
  lastNamePaternal: string;
  lastNameMaternal: string;
  role: Role;
  phone?: string | null;
  photoUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  // Solo presente en DOCTOR / MAIN_DOCTOR
  doctorProfile?: DoctorProfile | null;
}

export function getFullName(
  u: Pick<
    SystemUser,
    "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal"
  >
) {
  return [u.firstName, u.middleName, u.lastNamePaternal, u.lastNameMaternal]
    .filter(Boolean)
    .join(" ");
}

export function getInitials(
  u: Pick<SystemUser, "firstName" | "lastNamePaternal">
) {
  return `${u.firstName[0] ?? ""}${u.lastNamePaternal[0] ?? ""}`.toUpperCase();
}

// ─── Payloads ────────────────────────────────────────────────

export interface CreateUserPayload
  extends Omit<SystemUser, "id" | "isActive" | "createdAt" | "doctorProfile"> {
  password: string; // 👈 Obligatorio para crear la cuenta
  role: Role; // 👈 Opcional si el backend asigna uno por defecto
}
