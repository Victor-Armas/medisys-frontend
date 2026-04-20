import api from "@/shared/lib/api";
import type { Icd10SearchResult, Icd10SearchTraumaResult, MedicationSearchResult } from "../types/patient.types";

export const catalogService = {
  searchIcd10: async (q: string, limit = 8): Promise<Icd10SearchResult[]> => {
    const res = await api.get<Icd10SearchResult[]>("/medical-catalog/icd10/search", { params: { q, limit } });
    return res.data;
  },

  searchIcd10Trauma: async (q: string, limit = 8): Promise<Icd10SearchTraumaResult[]> => {
    const res = await api.get<Icd10SearchTraumaResult[]>("/medical-catalog/icd10/search/trauma", { params: { q, limit } });
    return res.data;
  },

  searchMedications: async (q: string, limit = 8): Promise<MedicationSearchResult[]> => {
    const res = await api.get<MedicationSearchResult[]>("/medical-catalog/medications/search", { params: { q, limit } });
    return res.data;
  },
};
