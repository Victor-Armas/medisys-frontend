// features/patients/hooks/usePatients.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { patientsService } from "../services/patients.service";
import type { CreatePatientPayload, UpdatePatientPayload } from "../types/patient.types";

export const patientKeys = {
  all: ["patients"] as const,
  lists: () => [...patientKeys.all, "list"] as const,
  list: (params: object) => [...patientKeys.lists(), params] as const,
  detail: (id: string) => [...patientKeys.all, "detail", id] as const,
  history: (id: string) => [...patientKeys.all, "history", id] as const,
};

// ── Queries ───────────────────────────────────────────────────────────────────

export function usePatients(params: { clinicId?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientsService.getAll(params),
    placeholderData: (prev) => prev, // mantiene datos anteriores mientras carga la nueva página
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientsService.getOne(id),
    enabled: !!id,
  });
}

export function useMedicalHistory(patientId: string) {
  return useQuery({
    queryKey: patientKeys.history(patientId),
    queryFn: () => patientsService.getMedicalHistory(patientId),
    enabled: !!patientId,
    retry: false, // 404 significa que no hay historia aún, no reintentar
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export function useCreatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: CreatePatientPayload) => patientsService.create(p),
    onSuccess: () => qc.invalidateQueries({ queryKey: patientKeys.lists() }),
  });
}

export function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePatientPayload }) => patientsService.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: patientKeys.detail(id) });
      qc.invalidateQueries({ queryKey: patientKeys.lists() });
    },
  });
}

export function useCreateMedicalHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: object }) =>
      patientsService.createMedicalHistory(patientId, payload),
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
      patientsService.updateMedicalHistory(patientId, payload),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.history(patientId) });
    },
  });
}

export function useAddPatientAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, payload }: { patientId: string; payload: object }) =>
      patientsService.addAddress(patientId, payload),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: patientKeys.detail(patientId) });
    },
  });
}
