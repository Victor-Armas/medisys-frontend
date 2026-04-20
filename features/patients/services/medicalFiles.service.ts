import api from "@/shared/lib/api";
import type { PatientMedicalFile, MedicalFileCategory } from "../types/patient.types";

export const medicalFilesService = {
  getAll: async (patientId: string): Promise<PatientMedicalFile[]> => {
    const res = await api.get<PatientMedicalFile[]>(`/patients/${patientId}/medical-files`);
    return res.data;
  },

  upload: async (
    patientId: string,
    file: File,
    category: MedicalFileCategory,
    description?: string,
  ): Promise<PatientMedicalFile> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    if (description?.trim()) formData.append("description", description.trim());

    const res = await api.post<PatientMedicalFile>(`/patients/${patientId}/medical-files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  delete: async (patientId: string, fileId: string): Promise<void> => {
    await api.delete(`/patients/${patientId}/medical-files/${fileId}`);
  },
};
