// ─────────────────────────────────────────────────────────────
// Tipos del módulo Doctors
// Reflejan exactamente el DOCTOR_SELECT del backend.
// Si el backend cambia un campo, este archivo es el primer lugar
// donde se actualiza — el compilador marcará todo lo demás.
// ─────────────────────────────────────────────────────────────

import { SystemUser } from "./users.types";

// Consultorio resumido — solo lo que se necesita en la lista de doctores
export interface DoctorClinicItem {
  id: string;
  isPrimary: boolean;
  isActive: boolean;
  assignedAt: string;
  clinic: {
    id: string;
    name: string;
    slug: string;
    city: string | null;
    isActive: boolean;
  };
}

// Perfil médico completo
export interface DoctorProfile {
  id: string;
  address: string;
  numHome: string;
  colony: string;
  city: string;
  state: string;
  zipCode: string;
  specialty?: string | null;
  professionalLicense: string;
  university?: string | null;
  fullTitle?: string | null;
  signatureUrl?: string | null;
  createdAt: string;
  doctorClinics: DoctorClinicItem[];
}

// ─── Payloads para los endpoints POST ────────────────────────

// POST /doctors — crear usuario + perfil desde cero
export interface CreateDoctorPayload
  extends Omit<SystemUser, "id" | "role" | "isActive" | "createdAt">,
    Omit<DoctorProfile, "id" | "createdAt" | "doctorClinics"> {
  password: string;
  clinicIds?: string[];
}

export function isDoctor(u: Pick<SystemUser, "role">) {
  return u.role === "DOCTOR" || u.role === "MAIN_DOCTOR";
}
//POST /doctors/assign — Asignar perfil a usuario existente

export interface AssignDoctorPayload
  extends Omit<DoctorProfile, "id" | "createdAt" | "doctorClinics"> {
  userId: string; // El usuario que ya existe
  clinicIds?: string[]; // Para asignarle sus clínicas de una vez
}
