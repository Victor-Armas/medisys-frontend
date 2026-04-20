import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { conditionsService } from "../services/conditions.service";
import type { CreateConditionPayload } from "../types/patient.types";
import { patientKeys } from "./usePatients";

export function useConditions(patientId: string) {
  return useQuery({
    queryKey: patientKeys.conditions(patientId),
    queryFn: () => conditionsService.getAll(patientId),
    enabled: !!patientId,
  });
}

export function useCreateCondition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: CreateConditionPayload }) =>
      conditionsService.create(patientId, payload),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.conditions(patientId) });
      qc.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}

export function useUpdateConditionNotes() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, conditionId, notes }: { patientId: string; conditionId: string; notes: string | null }) =>
      conditionsService.updateNotes(patientId, conditionId, notes),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.conditions(patientId) });
      qc.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}

export function useRemoveCondition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, conditionId }: { patientId: string; conditionId: string }) =>
      conditionsService.remove(patientId, conditionId),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.conditions(patientId) });
      qc.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}
