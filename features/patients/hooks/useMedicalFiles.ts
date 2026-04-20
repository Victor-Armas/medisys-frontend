"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { medicalFilesService } from "../services/medicalFiles.service";
import type { MedicalFileCategory } from "../types/patient.types";

// ── Query keys ────────────────────────────────────────────────────────────────

export const medicalFileKeys = {
  all: ["medical-files"] as const,
  list: (patientId: string) => [...medicalFileKeys.all, patientId] as const,
};

// ── Queries ───────────────────────────────────────────────────────────────────

export function useMedicalFiles(patientId: string) {
  return useQuery({
    queryKey: medicalFileKeys.list(patientId),
    queryFn: () => medicalFilesService.getAll(patientId),
    enabled: !!patientId,
  });
}

// ── Mutations ─────────────────────────────────────────────────────────────────

interface UploadPayload {
  patientId: string;
  file: File;
  category: MedicalFileCategory;
  description?: string;
}

export function useUploadMedicalFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, file, category, description }: UploadPayload) =>
      medicalFilesService.upload(patientId, file, category, description),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: medicalFileKeys.list(patientId) });
    },
  });
}

interface DeletePayload {
  patientId: string;
  fileId: string;
}

export function useDeleteMedicalFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, fileId }: DeletePayload) => medicalFilesService.delete(patientId, fileId),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: medicalFileKeys.list(patientId) });
    },
  });
}
