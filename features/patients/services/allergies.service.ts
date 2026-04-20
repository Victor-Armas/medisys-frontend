import api from "@/shared/lib/api";
import type { PatientAllergy, CreateAllergyPayload } from "../types/patient.types";

export const allergiesService = {
  getAll: async (patientId: string): Promise<PatientAllergy[]> => {
    const res = await api.get<PatientAllergy[]>(`/patients/${patientId}/allergies`);
    return res.data;
  },

  create: async (patientId: string, payload: CreateAllergyPayload): Promise<PatientAllergy> => {
    const res = await api.post<PatientAllergy>(`/patients/${patientId}/allergies`, payload);
    return res.data;
  },

  remove: async (patientId: string, allergyId: string): Promise<void> => {
    await api.delete(`/patients/${patientId}/allergies/${allergyId}`);
  },
};
