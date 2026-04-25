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

// ── Structured antecedents ────────────────────────────────────────────────────

export type ConditionType = "PATHOLOGICAL" | "FAMILY";

export type ConditionCategory = "DISEASE" | "SURGERY" | "HOSPITALIZATION" | "TRAUMA";

export type FamilyMember = "FATHER" | "MOTHER" | "SIBLINGS" | "CHILDREN" | "OTHER";

export type AllergySeverity = "MILD" | "MODERATE" | "SEVERE" | "UNKNOWN";

export interface PatientCondition {
  id: string;
  icd10Code: string | null;
  description: string;
  category: ConditionCategory;
  type: ConditionType;
  familyMember: FamilyMember | null;
  notes: string | null;
  isNonCoded: boolean;
  createdAt: string;
}

export interface PatientMedication {
  id: string;
  name: string;
  dose: string | null;
  frequency: string | null;
  isNonCoded: boolean;
  catalogId: string | null;
  createdAt: string;
}

export interface PatientAllergy {
  id: string;
  substance: string;
  reaction: string | null;
  severity: AllergySeverity;
  createdAt: string;
}

// ── Catalog search results ────────────────────────────────────────────────────

export interface Icd10SearchResult {
  id: string;
  code: string;
  description: string;
  category: string | null;
}

export type Icd10SearchTraumaResult = Icd10SearchResult;

export interface MedicationSearchResult {
  id: string;
  name: string;
  description: string;
  rxnormCode: string | null;
  form: string | null;
  concentration: string | null;
}

// ── Payloads ──────────────────────────────────────────────────────────────────

export interface CreateConditionPayload {
  icd10Code?: string;
  description: string;
  category: ConditionCategory;
  type?: ConditionType;
  familyMember?: FamilyMember;
  notes?: string;
}

export interface CreateMedicationPayload {
  catalogId?: string;
  name: string;
  dose?: string;
  frequency?: string;
  isNonCoded?: boolean;
}

export interface UpdateMedicationPayload {
  dose?: string;
  frequency?: string;
}

export interface CreateAllergyPayload {
  substance: string;
  reaction?: string;
  severity?: AllergySeverity;
}

// ── Medical files ─────────────────────────────────────────────────────────────

export type MedicalFileCategory =
  | "LAB_RESULTS"
  | "IMAGING"
  | "PRESCRIPTION"
  | "REFERRAL"
  | "SURGERY_REPORT"
  | "PATHOLOGY"
  | "OTHER";

export interface PatientMedicalFile {
  id: string;
  category: MedicalFileCategory;
  description: string | null;
  fileName: string;
  fileUrl: string;
  publicId: string;
  mimeType: string;
  fileSize: number;
  uploadedById: string | null;
  createdAt: string;
}

// ── SEPOMEX ───────────────────────────────────────────────────────────────────

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

// ── Medical history (habits + gynecological) ──────────────────────────────────

export interface MedicalHistory {
  id: string;
  // Remaining pathological fact
  bloodTransfusions: boolean;
  // Habits
  smoking: HabitStatus;
  smokingDetail: string | null;
  alcoholUse: HabitStatus;
  alcoholDetail: string | null;
  drugUse: HabitStatus;
  drugDetail: string | null;
  immunizations: string | null;
  physicalActivity: string | null;
  pets: boolean;
  tattoos: boolean;
  woodSmokeExposure: boolean;
  // Gynecological
  menarche: number | null;
  menstrualCycle: string | null;
  lastMenstrualPeriod: string | null;
  sexualActivityStart: number | null;
  gestations: number | null;
  deliveries: number | null;
  abortions: number | null;
  caesareans: number | null;
  contraceptiveMethod: string | null;
  menopause: boolean | null;
  mammography: string | null;
  cervicalCytology: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Address ───────────────────────────────────────────────────────────────────

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
  foreignState?: string | null;
  foreignCity?: string | null;
  foreignPostalCode?: string | null;
  foreignAddressLine?: string | null;
}

// ── Patient list item (lightweight) ──────────────────────────────────────────

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

// ── Patient detail (full clinical record) ─────────────────────────────────────

export interface Patient extends PatientListItem {
  maritalStatus: MaritalStatus | null;
  occupation: string | null;
  educationLevel: EducationLevel | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelation: string | null;
  addresses: PatientAddress[];
  medicalHistory: MedicalHistory | null;
  conditions: PatientCondition[];
  medications: PatientMedication[];
  allergies: PatientAllergy[];
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface PatientsPage {
  patients: PatientListItem[];
  total: number;
  page: number;
  limit: number;
}

// ── Patient CRUD payloads ─────────────────────────────────────────────────────

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
