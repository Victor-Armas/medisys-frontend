import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { medicalHistoryService } from "../services/medicalHistory.service";
import { patientKeys } from "./usePatients";

export function useMedicalHistory(patientId: string) {
  return useQuery({
    queryKey: patientKeys.history(patientId),
    queryFn: () => medicalHistoryService.getMedicalHistory(patientId),
    enabled: !!patientId,
    retry: false,
  });
}

export function useCreateMedicalHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: object }) =>
      medicalHistoryService.createMedicalHistory(patientId, payload as never),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.history(patientId) });
      qc.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}

export function useUpdateMedicalHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: object }) =>
      medicalHistoryService.updateMedicalHistory(patientId, payload as never),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.history(patientId) });
    },
  });
}
