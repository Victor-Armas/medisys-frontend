// features/patients/services/patients.service.ts
import api from "@/shared/lib/api";
import type {
  PatientsPage,
  Patient,
  CreatePatientPayload,
  UpdatePatientPayload,
  CreatePatientAddressPayload,
  MedicalHistory,
  SepomexPostalCodeResult,
} from "../types/patient.types";

// ── Patients CRUD ─────────────────────────────────────────────────────────────

export const patientsService = {
  getAll: async (params: { clinicId?: string; search?: string; page?: number; limit?: number }): Promise<PatientsPage> => {
    const res = await api.get<PatientsPage>("/patients", { params });
    return res.data;
  },

  getOne: async (id: string): Promise<Patient> => {
    const res = await api.get<Patient>(`/patients/${id}`);
    return res.data;
  },

  create: async (payload: CreatePatientPayload): Promise<Patient> => {
    const res = await api.post<Patient>("/patients", payload);
    return res.data;
  },

  update: async (id: string, payload: UpdatePatientPayload): Promise<Patient> => {
    const res = await api.patch<Patient>(`/patients/${id}`, payload);
    return res.data;
  },

  // ── Addresses ─────────────────────────────────────────────────────────────

  addAddress: async (patientId: string, payload: CreatePatientAddressPayload) => {
    const res = await api.post(`/patients/${patientId}/addresses`, payload);
    return res.data;
  },

  updateAddress: async (patientId: string, addressId: string, payload: Partial<CreatePatientAddressPayload>) => {
    const res = await api.patch(`/patients/${patientId}/addresses/${addressId}`, payload);
    return res.data;
  },

  // ── Medical History ───────────────────────────────────────────────────────

  getMedicalHistory: async (patientId: string): Promise<MedicalHistory> => {
    const res = await api.get<MedicalHistory>(`/patients/${patientId}/medical-history`);
    return res.data;
  },

  createMedicalHistory: async (patientId: string, payload: Partial<MedicalHistory>) => {
    const res = await api.post(`/patients/${patientId}/medical-history`, payload);
    return res.data;
  },

  updateMedicalHistory: async (patientId: string, payload: Partial<MedicalHistory>) => {
    const res = await api.patch(`/patients/${patientId}/medical-history`, payload);
    return res.data;
  },

  // ── Clinic assignment ─────────────────────────────────────────────────────

  assignToClinic: async (patientId: string, clinicId: string) => {
    const res = await api.post(`/patients/${patientId}/clinics`, { clinicId });
    return res.data;
  },
};

// ── SEPOMEX ───────────────────────────────────────────────────────────────────

export const sepomexService = {
  getByPostalCode: async (code: string): Promise<SepomexPostalCodeResult> => {
    const res = await api.get<SepomexPostalCodeResult>(`/sepomex/postal-code/${code}`);
    return res.data;
  },
};
