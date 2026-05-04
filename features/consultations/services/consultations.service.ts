// features/consultations/services/consultations.service.ts
// Single responsibility: all HTTP calls for the consultations feature
import api from "@/shared/lib/api";
import type {
  ConsultationListItem,
  ConsultationResponse,
  ConsultationsListResponse,
  CreateConsultationPayload,
  CreatePrescriptionPayload,
  Icd10SearchResult,
  ListConsultationsQuery,
  MedicationSuggestion,
  PatientMedicalFileBrief,
  PatientSearchResult,
} from "../types/consultation.types";

// ── Patient search ────────────────────────────────────────────────────────────

export const searchPatients = async (query: string, limit = 8): Promise<PatientSearchResult[]> => {
  const res = await api.get<{ patients: PatientSearchResult[]; total: number }>("/patients/search/clinical", {
    params: { search: query, limit },
  });
  return res.data.patients;
};

// ── ICD-10 search ─────────────────────────────────────────────────────────────

export const searchIcd10 = async (query: string, limit = 10): Promise<Icd10SearchResult[]> => {
  const res = await api.get<Icd10SearchResult[]>("/medical-catalog/icd10/search", { params: { q: query, limit } });
  return res.data;
};

// ── Medication suggestions for given ICD-10 codes ────────────────────────────

export const getMedicationSuggestions = async (icd10Codes: string[]): Promise<MedicationSuggestion[]> => {
  if (icd10Codes.length === 0) return [];
  const params = new URLSearchParams();
  icd10Codes.forEach((code) => params.append("icd10", code));
  const res = await api.get<MedicationSuggestion[]>(`/consultations/suggestions?${params.toString()}`);
  return res.data;
};

// ── Consultations CRUD ────────────────────────────────────────────────────────

export const createConsultation = async (payload: CreateConsultationPayload): Promise<ConsultationResponse> => {
  const res = await api.post<ConsultationResponse>("/consultations", payload);
  return res.data;
};

export const getConsultationsByPatient = async (patientId: string): Promise<ConsultationListItem[]> => {
  const res = await api.get<ConsultationListItem[]>(`/consultations/patient/${patientId}`);
  return res.data;
};

// ── Prescriptions ─────────────────────────────────────────────────────────────

export const createPrescription = async (
  payload: CreatePrescriptionPayload,
): Promise<{ id: string; folioNumber: string; status: string }> => {
  const res = await api.post("/prescriptions", payload);
  return res.data;
};

// ── Patient medical files ─────────────────────────────────────────────────────

export const getPatientMedicalFiles = async (patientId: string, limit = 3): Promise<PatientMedicalFileBrief[]> => {
  const res = await api.get<PatientMedicalFileBrief[]>(`/patients/${patientId}/medical-files`);
  // Return only the last N files sorted by date
  return res.data.slice(0, limit);
};

export const uploadPatientMedicalFile = async (
  patientId: string,
  file: File,
  category: string,
  description?: string,
): Promise<PatientMedicalFileBrief> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);
  if (description?.trim()) formData.append("description", description.trim());

  const res = await api.post<PatientMedicalFileBrief>(`/patients/${patientId}/medical-files`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getConsultations = async (query: ListConsultationsQuery = {}): Promise<ConsultationsListResponse> => {
  const res = await api.get<ConsultationsListResponse>("/consultations", {
    params: query,
  });
  return res.data;
};

export const getConsultationById = async (id: string): Promise<ConsultationResponse> => {
  const res = await api.get<ConsultationResponse>(`/consultations/${id}`);
  return res.data;
};

export const handleIssuePrescription = async (prescriptionId: string, includeSignature: boolean): Promise<void> => {
  const res = await api.post(`/prescriptions/${prescriptionId}/issue`, { includeSignature });
  return res.data;
};
