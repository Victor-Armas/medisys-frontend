// features/consultations/types/consultation.types.ts
// Derived from Prisma schema — no duplicated interfaces, use Pick/extends pattern

// ── Enums (mirror Prisma enums) ───────────────────────────────────────────────

export type ConsultationType = "FIRST_VISIT" | "FOLLOW_UP" | "URGENT" | "ROUTINE" | "PROCEDURE";
export type DiagnosisType = "DEFINITIVE" | "PRESUMPTIVE" | "ASSOCIATED" | "COMPLICATION";
export type PrescriptionStatus = "DRAFT" | "ISSUED" | "CANCELLED";
export type GeneralCondition = "GOOD" | "FAIR" | "POOR" | "CRITICAL";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type AllergySeverity = "MILD" | "MODERATE" | "SEVERE" | "UNKNOWN";

// ── Core patient shapes (lightweight — for search/display) ────────────────────

export interface PatientSearchResult {
  id: string;
  firstName: string;
  middleName: string | null;
  lastNamePaternal: string;
  lastNameMaternal: string | null;
  birthDate: string;
  gender: Gender;
  curp: string | null;
  phone: string | null;
  email: string | null;
  bloodType: string | null;
  allergies: PatientAllergyBrief[];
  conditions: PatientConditionBrief[];
}

export interface PatientAllergyBrief {
  id: string;
  substance: string;
  severity: AllergySeverity;
}

export interface PatientConditionBrief {
  description: string;
  icd10Code: string | null;
}

// ── Inline patient creation (minimal — for new patient during consultation) ───

export interface CreatePatientInlinePayload {
  firstName: string;
  lastNamePaternal: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender;
  middleName?: string;
  lastNameMaternal?: string;
  phone?: string;
}

// ── Vital signs ───────────────────────────────────────────────────────────────

export interface VitalSignsPayload {
  weightKg?: number;
  heightCm?: number;
  bmi?: number;
  bloodPressure?: string; // "120/80"
  heartRateBpm?: number;
  respiratoryRate?: number;
  temperatureC?: number;
  oxygenSaturation?: number;
  glucoseMgdl?: string;
  notes?: string;
}

export interface VitalSignsResult extends VitalSignsPayload {
  id: string;
  generalCondition: GeneralCondition;
  createdAt: string;
}

// ── Diagnosis ─────────────────────────────────────────────────────────────────

export interface DiagnosisPayload {
  icd10Code?: string;
  description: string;
  diagnosisType?: DiagnosisType;
  isMain?: boolean;
  notes?: string;
  sortOrder?: number;
}

export interface DiagnosisResult extends Required<Omit<DiagnosisPayload, "icd10Code" | "notes">> {
  id: string;
  icd10Code: string | null;
  notes: string | null;
  createdAt: string;
}

// ── Prescription item ─────────────────────────────────────────────────────────

export interface PrescriptionItemPayload {
  catalogId?: string;
  consultationDiagnosisId?: string;
  medicationName: string;
  brandName?: string;
  dose: string;
  frequency: string;
  duration: string;
  route?: string;
  quantity?: number;
  instructions?: string;
  sortOrder?: number;
}

export interface PrescriptionItemResult extends PrescriptionItemPayload {
  id: string;
  createdAt: string;
}

// ── ICD-10 medication suggestion (from backend CDS table) ─────────────────────

export interface MedicationSuggestion {
  id: string;
  icd10Code: string;
  defaultDose: string | null;
  defaultFrequency: string | null;
  defaultDuration: string | null;
  defaultRoute: string | null;
  defaultQuantity: number | null;
  priority: number;
  usageCount: number;
  medicationCatalog: {
    id: string;
    name: string;
    form: string | null;
    concentration: string | null;
    description: string | null;
  };
}

// ── ICD-10 search result ──────────────────────────────────────────────────────

export interface Icd10SearchResult {
  id: string;
  code: string;
  description: string;
  category: string | null;
}

// ── Main consultation payload (what we POST to /consultations) ────────────────

export interface CreateConsultationPayload {
  appointmentId?: string;
  patientId?: string;
  patient?: CreatePatientInlinePayload; // if patientId is null
  doctorClinicId: string;
  consultationType?: ConsultationType;
  reasonForVisit: string;
  currentCondition: string;
  physicalExamFindings?: string;
  labResultsSummary?: string;
  clinicalImpressions?: string;
  treatmentPlan?: string;
  patientInstructions?: string;
  prognosis?: string;
  requiresFollowUp?: boolean;
  followUpDays?: number;
  followUpNotes?: string;
  vitalSigns?: VitalSignsPayload;
  diagnoses?: DiagnosisPayload[];
}

// ── Prescription payload (POST to /prescriptions after consultation) ──────────

export interface CreatePrescriptionPayload {
  consultationId: string;
  items: PrescriptionItemPayload[];
}

// ── Response shapes ───────────────────────────────────────────────────────────

export interface ConsultationResponse {
  id: string;
  folioNumber: string;
  consultationType: ConsultationType;
  reasonForVisit: string;
  currentCondition: string;
  physicalExamFindings: string | null;
  labResultsSummary: string | null;
  clinicalImpressions: string | null;
  treatmentPlan: string | null;
  patientInstructions: string | null;
  prognosis: string | null;
  requiresFollowUp: boolean;
  followUpDays: number | null;
  followUpNotes: string | null;
  consultedAt: string;
  createdAt: string;
  updatedAt: string;
  vitalSigns: VitalSignsResult | null;
  diagnoses: DiagnosisResult[];
  prescription: PrescriptionWithItems | null;
  patient: ConsultationPatientContext;
  doctorClinic: ConsultationDoctorClinicContext;
}

export interface ConsultationListItem {
  id: string;
  folioNumber: string;
  consultationType: ConsultationType;
  reasonForVisit: string;
  requiresFollowUp: boolean;
  followUpDays: number | null;
  consultedAt: string;
  createdAt: string;
  patient: Pick<ConsultationPatientContext, "id" | "firstName" | "lastNamePaternal" | "birthDate" | "gender">;
  doctorClinic: ConsultationDoctorClinicContext;
  diagnoses: DiagnosisResult[];
  prescription: PrescriptionBrief | null;
}

export interface ConsultationPatientContext {
  id: string;
  firstName: string;
  middleName: string | null;
  lastNamePaternal: string;
  lastNameMaternal: string | null;
  birthDate: string;
  gender: Gender;
  curp: string | null;
  phone: string | null;
  email: string | null;
  bloodType: string | null;
  allergies: PatientAllergyBrief[];
}

export interface ConsultationDoctorClinicContext {
  id: string;
  clinic: { id: string; name: string };
  doctorProfile: {
    user: { id: string; firstName: string; lastNamePaternal: string };
  };
}

export interface PrescriptionBrief {
  id: string;
  folioNumber: string;
  status: PrescriptionStatus;
  pdfUrl: string | null;
  issuedAt: string;
}

export interface PrescriptionWithItems extends PrescriptionBrief {
  items: PrescriptionItemResult[];
}

// ── Local draft (autosave shape) ──────────────────────────────────────────────

export interface ConsultationDraft {
  patientId: string | null;
  inlinePatient: CreatePatientInlinePayload | null;
  appointmentId: string | null;
  doctorClinicId: string | null;
  consultationType: ConsultationType;
  vitalSigns: VitalSignsPayload;
  reasonForVisit: string;
  currentCondition: string;
  physicalExamFindings: string;
  labResultsSummary: string;
  clinicalImpressions: string;
  treatmentPlan: string;
  patientInstructions: string;
  prognosis: string;
  requiresFollowUp: boolean;
  followUpDays: number | null;
  followUpNotes: string;
  diagnoses: DiagnosisPayload[];
  prescriptionItems: PrescriptionItemPayload[];
}

// ── Patient medical file (for sidebar) ───────────────────────────────────────

export interface PatientMedicalFileBrief {
  id: string;
  category: string;
  description: string | null;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}

// ── Doctor-clinic selector option (flattened from /clinics response) ──────────────────
// id = DoctorClinic.id (what the backend expects as doctorClinicId)
export interface DoctorClinic {
  id: string; // DoctorClinic.id
  clinicName: string;
  doctorName: string;
  isPrimary: boolean;
  isActive: boolean;
}

// ── LIST CONSULTATION ───────────────────────────────────────

export interface ListConsultationsQuery {
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  clinicId?: string;
  patientId?: string;
  search?: string;
}

export interface ConsultationsListResponse {
  consultations: ConsultationListItem[];
  total: number;
  page: number;
  limit: number;
}
