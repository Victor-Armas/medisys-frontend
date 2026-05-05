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
  consultationId?: string;
}

export function useUploadMedicalFile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      patientId,
      file,
      category,
      description,
      consultationId,
    }: UploadPayload) =>
      medicalFilesService.upload(
        patientId,
        file,
        category,
        description,
        consultationId,
      ),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: medicalFileKeys.list(patientId) });
      qc.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) &&
          query.queryKey[0] === "consultations" &&
          query.queryKey[1] === "patient" &&
          query.queryKey[2] === patientId &&
          query.queryKey[3] === "timeline",
      });
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
    mutationFn: ({ patientId, fileId }: DeletePayload) =>
      medicalFilesService.delete(patientId, fileId),
    onSuccess: (_data, { patientId }) => {
      qc.invalidateQueries({ queryKey: medicalFileKeys.list(patientId) });
    },
  });
}
