import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { patientsService } from "../services/patients.service";
import type { CreatePatientPayload, UpdatePatientPayload } from "../types/patient.types";

// ── Query key factory ─────────────────────────────────────────────────────────

export const patientKeys = {
  all: ["patients"] as const,
  lists: () => [...patientKeys.all, "list"] as const,
  list: (params: object) => [...patientKeys.lists(), params] as const,
  detail: (id: string) => [...patientKeys.all, "detail", id] as const,
  history: (id: string) => [...patientKeys.all, "history", id] as const,
  conditions: (id: string) => [...patientKeys.all, "conditions", id] as const,
  medications: (id: string) => [...patientKeys.all, "medications", id] as const,
  allergies: (id: string) => [...patientKeys.all, "allergies", id] as const,
};

// ── Patient queries ───────────────────────────────────────────────────────────

export function usePatients(params: { clinicId?: string; search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: patientKeys.list(params),
    queryFn: () => patientsService.getAll(params),
    placeholderData: (prev) => prev,
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => patientsService.getOne(id),
    enabled: !!id,
  });
}

// ── Patient mutations ─────────────────────────────────────────────────────────

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
