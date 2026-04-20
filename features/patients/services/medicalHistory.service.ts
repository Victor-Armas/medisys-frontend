import api from "@/shared/lib/api";
import type { MedicalHistory } from "../types/patient.types";

export const medicalHistoryService = {
  getMedicalHistory: async (patientId: string): Promise<MedicalHistory> => {
    const res = await api.get<MedicalHistory>(`/patients/${patientId}/medical-history`);
    return res.data;
  },

  createMedicalHistory: async (patientId: string, payload: Partial<MedicalHistory>): Promise<MedicalHistory> => {
    const res = await api.post<MedicalHistory>(`/patients/${patientId}/medical-history`, payload);
    return res.data;
  },

  updateMedicalHistory: async (patientId: string, payload: Partial<MedicalHistory>): Promise<MedicalHistory> => {
    const res = await api.patch<MedicalHistory>(`/patients/${patientId}/medical-history`, payload);
    return res.data;
  },
};
