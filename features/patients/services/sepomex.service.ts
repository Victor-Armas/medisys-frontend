import api from "@/shared/lib/api";
import type { SepomexPostalCodeResult } from "../types/patient.types";

export const sepomexService = {
  getByPostalCode: async (code: string): Promise<SepomexPostalCodeResult> => {
    const res = await api.get<SepomexPostalCodeResult>(`/sepomex/postal-code/${code}`);
    return res.data;
  },
};
