import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { allergiesService } from "../services/allergies.service";
import type { CreateAllergyPayload } from "../types/patient.types";
import { patientKeys } from "./usePatients";

export function useAllergies(patientId: string) {
  return useQuery({
    queryKey: patientKeys.allergies(patientId),
    queryFn: () => allergiesService.getAll(patientId),
    enabled: !!patientId,
  });
}

export function useCreateAllergy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: CreateAllergyPayload }) =>
      allergiesService.create(patientId, payload),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.allergies(patientId) });
      qc.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}

export function useRemoveAllergy() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, allergyId }: { patientId: string; allergyId: string }) =>
      allergiesService.remove(patientId, allergyId),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.allergies(patientId) });
      qc.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}
