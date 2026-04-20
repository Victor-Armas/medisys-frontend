import api from "@/shared/lib/api";
import type { PatientMedication, CreateMedicationPayload, UpdateMedicationPayload } from "../types/patient.types";

export const medicationsService = {
  getAll: async (patientId: string): Promise<PatientMedication[]> => {
    const res = await api.get<PatientMedication[]>(`/patients/${patientId}/medications`);
    return res.data;
  },

  create: async (patientId: string, payload: CreateMedicationPayload): Promise<PatientMedication> => {
    const res = await api.post<PatientMedication>(`/patients/${patientId}/medications`, payload);
    return res.data;
  },

  update: async (patientId: string, medicationId: string, payload: UpdateMedicationPayload): Promise<PatientMedication> => {
    const res = await api.patch<PatientMedication>(`/patients/${patientId}/medications/${medicationId}`, payload);
    return res.data;
  },

  remove: async (patientId: string, medicationId: string): Promise<void> => {
    await api.delete(`/patients/${patientId}/medications/${medicationId}`);
  },
};
