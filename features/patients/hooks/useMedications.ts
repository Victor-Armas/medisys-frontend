import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { medicationsService } from "../services/medications.service";
import type { CreateMedicationPayload, UpdateMedicationPayload } from "../types/patient.types";
import { patientKeys } from "./usePatients";

export function useMedications(patientId: string) {
  return useQuery({
    queryKey: patientKeys.medications(patientId),
    queryFn: () => medicationsService.getAll(patientId),
    enabled: !!patientId,
  });
}

export function useCreateMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: CreateMedicationPayload }) =>
      medicationsService.create(patientId, payload),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.medications(patientId) });
      qc.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}

export function useUpdateMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      medicationId,
      payload,
    }: {
      patientId: string;
      medicationId: string;
      payload: UpdateMedicationPayload;
    }) => medicationsService.update(patientId, medicationId, payload),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.medications(patientId) });
    },
  });
}

export function useRemoveMedication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, medicationId }: { patientId: string; medicationId: string }) =>
      medicationsService.remove(patientId, medicationId),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.medications(patientId) });
      qc.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}
