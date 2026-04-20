import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsService } from "../services/patients.service";
import type { CreatePatientAddressPayload } from "../types/patient.types";
import { patientKeys } from "./usePatients";

export function useAddPatientAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: CreatePatientAddressPayload }) =>
      patientsService.addAddress(patientId, payload),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}

export function useUpdatePatientAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      addressId,
      payload,
    }: {
      patientId: string;
      addressId: string;
      payload: Partial<CreatePatientAddressPayload>;
    }) => patientsService.updateAddress(patientId, addressId, payload),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}
