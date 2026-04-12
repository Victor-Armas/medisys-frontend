// features/patients/types/patient.types.ts

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type BloodType =
  | "O_POSITIVE"
  | "O_NEGATIVE"
  | "A_POSITIVE"
  | "A_NEGATIVE"
  | "B_POSITIVE"
  | "B_NEGATIVE"
  | "AB_POSITIVE"
  | "AB_NEGATIVE"
  | "UNKNOWN";
export type MaritalStatus = "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | "FREE_UNION" | "OTHER";
export type EducationLevel = "NONE" | "PRIMARY" | "SECONDARY" | "HIGH_SCHOOL" | "TECHNICAL" | "BACHELOR" | "POSTGRADUATE";
export type HabitStatus = "NEVER" | "FORMER" | "CURRENT" | "UNKNOWN";

// ── Catálogo SEPOMEX ─────────────────────────────────────────────────────────

export interface SepomexNeighborhood {
  id: string;
  name: string;
  type: string;
  zone: string | null;
}

export interface SepomexPostalCodeResult {
  id: string;
  code: string;
  municipality: {
    id: string;
    name: string;
    state: { id: string; name: string };
  };
  neighborhoods: SepomexNeighborhood[];
}

// ── Historia clínica ─────────────────────────────────────────────────────────

export interface MedicalHistory {
  id: string;
  diseases?: string | null;
  surgeries?: string | null;
  hospitalizations?: string | null;
  bloodTransfusions: boolean;
  traumaHistory?: string | null;
  currentMedications?: string | null;
  allergies?: string | null;
  smoking: HabitStatus;
  smokingDetail?: string | null;
  alcoholUse: HabitStatus;
  alcoholDetail?: string | null;
  drugUse: HabitStatus;
  drugDetail?: string | null;
  immunizations?: string | null;
  physicalActivity?: string | null;
  pets: boolean;
  tattoos: boolean;
  woodSmokeExposure: boolean;
  fatherHistory?: string | null;
  motherHistory?: string | null;
  childrenHistory?: string | null;
  siblingsHistory?: string | null;
  otherFamilyHistory?: string | null;
  // Gineco
  menarche?: number | null;
  menstrualCycle?: string | null;
  lastMenstrualPeriod?: string | null;
  sexualActivityStart?: number | null;
  gestations?: number | null;
  deliveries?: number | null;
  abortions?: number | null;
  caesareans?: number | null;
  contraceptiveMethod?: string | null;
  menopause?: boolean | null;
  mammography?: string | null;
  cervicalCytology?: string | null;
  createdAt: string;
  updatedAt: string;
}
// ── Dirección ────────────────────────────────────────────────────────────────

export interface PatientAddress {
  id: string;
  country: string;
  isPrimary: boolean;
  street: string | null;
  extNumber: string | null;
  intNumber: string | null;
  postalCode?: {
    code: string;
    municipality: { name: string; state: { name: string } };
  } | null;
  neighborhood?: { name: string; type: string } | null;
  // Extranjero
  foreignState?: string | null;
  foreignCity?: string | null;
  foreignPostalCode?: string | null;
  foreignAddressLine?: string | null;
}

// ── Paciente (lista) ──────────────────────────────────────────────────────────

export interface PatientListItem {
  id: string;
  firstName: string;
  middleName: string | null;
  lastNamePaternal: string;
  lastNameMaternal: string | null;
  birthDate: string;
  gender: Gender;
  curp: string | null;
  phone: string;
  email: string | null;
  bloodType: BloodType | null;
  isActive: boolean;
  createdAt: string;
  clinics: { clinic: { id: string; name: string } }[];
}

// ── Paciente (detalle completo) ───────────────────────────────────────────────

export interface Patient extends PatientListItem {
  maritalStatus: MaritalStatus | null;
  occupation: string | null;
  educationLevel: EducationLevel | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelation: string | null;
  addresses: PatientAddress[];
  medicalHistory: MedicalHistory | null;
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PatientsPage {
  patients: PatientListItem[];
  total: number;
  page: number;
  limit: number;
}

// ── Payloads ──────────────────────────────────────────────────────────────────

export type CreatePatientPayload = {
  firstName: string;
  middleName?: string;
  lastNamePaternal: string;
  lastNameMaternal?: string;
  birthDate: string;
  gender: Gender;
  curp?: string;
  phone: string;
  email?: string;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  educationLevel?: EducationLevel;
  bloodType?: BloodType;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  clinicId?: string;
};

export type UpdatePatientPayload = Partial<Omit<CreatePatientPayload, "clinicId">> & {
  isActive?: boolean;
};

export type CreatePatientAddressPayload = {
  country?: string;
  isPrimary?: boolean;
  postalCodeId?: string;
  neighborhoodId?: string;
  street?: string;
  extNumber?: string;
  intNumber?: string;
  foreignState?: string;
  foreignCity?: string;
  foreignPostalCode?: string;
  foreignAddressLine?: string;
};

// ── UI Helpers ────────────────────────────────────────────────────────────────

export const BLOOD_TYPE_LABELS: Record<BloodType, string> = {
  O_POSITIVE: "O+",
  O_NEGATIVE: "O−",
  A_POSITIVE: "A+",
  A_NEGATIVE: "A−",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B−",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB−",
  UNKNOWN: "?",
};

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  OTHER: "Otro",
};

export const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  SINGLE: "Soltero/a",
  MARRIED: "Casado/a",
  DIVORCED: "Divorciado/a",
  WIDOWED: "Viudo/a",
  FREE_UNION: "Unión libre",
  OTHER: "Otro",
};

export const EDUCATION_LABELS: Record<EducationLevel, string> = {
  NONE: "Sin estudios",
  PRIMARY: "Primaria",
  SECONDARY: "Secundaria",
  HIGH_SCHOOL: "Preparatoria",
  TECHNICAL: "Técnico",
  BACHELOR: "Licenciatura",
  POSTGRADUATE: "Posgrado",
};

export const HABIT_LABELS: Record<HabitStatus, string> = {
  NEVER: "Nunca",
  FORMER: "Exfumador/a",
  CURRENT: "Activo",
  UNKNOWN: "Desconocido",
};

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
