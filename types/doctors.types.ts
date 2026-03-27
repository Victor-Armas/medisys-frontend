import { User } from "./users.types";

// ─── Consultorio resumido ─────────────────────────────────────
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

// ─── Perfil médico completo ───────────────────────────────────
// Refleja exactamente el modelo DoctorProfile de Prisma
export interface DoctorProfile {
  id: string;
  // Dirección (NOT NULL en Prisma)
  address: string;
  numHome: string;
  colony: string;
  city: string;
  state: string;
  zipCode: string;
  // Datos profesionales
  professionalLicense: string; // NOT NULL en Prisma
  specialty?: string | null; // opcional
  university?: string | null; // opcional
  fullTitle?: string | null; // opcional
  signatureUrl?: string | null; // sube por Cloudinary
  createdAt: string;
  doctorClinics: DoctorClinicItem[];
}

// ─── Payload POST /api/doctors ────────────────────────────────
// Crear usuario + perfil médico desde cero en una sola operación
export interface CreateDoctorPayload {
  // Datos de cuenta (User)
  email: string;
  password: string;
  firstName: string;
  middleName?: string | null;
  lastNamePaternal: string;
  lastNameMaternal: string;
  phone?: string | null;
  // Perfil médico obligatorio (DoctorProfile NOT NULL)
  professionalLicense: string;
  address: string;
  numHome: string;
  colony: string;
  city: string;
  state: string;
  zipCode: string;
  // Perfil médico opcional
  specialty?: string | null;
  university?: string | null;
  fullTitle?: string | null;
  // Consultorios opcionales al crear
  clinicIds?: string[];
}

// ─── Payload POST /api/doctors/assign ────────────────────────
// Asignar perfil médico a usuario que ya existe
export interface AssignDoctorPayload {
  userId: string;
  // Perfil médico obligatorio
  professionalLicense: string;
  address: string;
  numHome: string;
  colony: string;
  city: string;
  state: string;
  zipCode: string;
  // Opcionales
  specialty?: string | null;
  university?: string | null;
  fullTitle?: string | null;
  clinicIds?: string[];
}

// ─── Type guard ───────────────────────────────────────────────
export function isDoctor(u: Pick<User, "role">) {
  return u.role === "DOCTOR" || u.role === "MAIN_DOCTOR";
}
