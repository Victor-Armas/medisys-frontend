// features/patients/services/patients.service.ts
import api from "@/shared/lib/api";
import type {
  PatientsPage,
  Patient,
  CreatePatientPayload,
  UpdatePatientPayload,
  CreatePatientAddressPayload,
} from "../types/patient.types";

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

  addAddress: async (patientId: string, payload: CreatePatientAddressPayload): Promise<unknown> => {
    const res = await api.post(`/patients/${patientId}/addresses`, payload);
    return res.data;
  },

  updateAddress: async (
    patientId: string,
    addressId: string,
    payload: Partial<CreatePatientAddressPayload>,
  ): Promise<unknown> => {
    const res = await api.patch(`/patients/${patientId}/addresses/${addressId}`, payload);
    return res.data;
  },

  // ── Clinic assignment ─────────────────────────────────────────────────────

  assignToClinic: async (patientId: string, clinicId: string): Promise<unknown> => {
    const res = await api.post(`/patients/${patientId}/clinics`, { clinicId });
    return res.data;
  },
};
