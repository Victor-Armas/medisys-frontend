import api from "@/shared/lib/api";
import type { PatientCondition, CreateConditionPayload } from "../types/patient.types";

export const conditionsService = {
  getAll: async (patientId: string): Promise<PatientCondition[]> => {
    const res = await api.get<PatientCondition[]>(`/patients/${patientId}/conditions`);
    return res.data;
  },

  create: async (patientId: string, payload: CreateConditionPayload): Promise<PatientCondition> => {
    const res = await api.post<PatientCondition>(`/patients/${patientId}/conditions`, payload);
    return res.data;
  },

  updateNotes: async (patientId: string, conditionId: string, notes: string | null): Promise<PatientCondition> => {
    const res = await api.patch<PatientCondition>(`/patients/${patientId}/conditions/${conditionId}/notes`, { notes });
    return res.data;
  },

  remove: async (patientId: string, conditionId: string): Promise<void> => {
    await api.delete(`/patients/${patientId}/conditions/${conditionId}`);
  },
};
