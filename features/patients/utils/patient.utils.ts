import type { Patient } from "../types/patient.types";

export function getPatientFullName(
  p: Pick<Patient, "firstName" | "middleName" | "lastNamePaternal" | "lastNameMaternal">,
): string {
  return [p.firstName, p.middleName, p.lastNamePaternal, p.lastNameMaternal].filter(Boolean).join(" ");
}

export function getPatientInitials(p: Pick<Patient, "firstName" | "lastNamePaternal">): string {
  return `${p.firstName[0] ?? ""}${p.lastNamePaternal[0] ?? ""}`.toUpperCase();
}

export function getPatientAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function formatPhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, "$1 $2 $3");
  }
  return digits;
}
