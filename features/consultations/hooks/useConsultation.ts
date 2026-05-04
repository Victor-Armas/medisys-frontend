// features/consultations/hooks/useConsultation.ts
"use client";
import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/shared/ui/toaster";
import * as svc from "../services/consultations.service";
import type {
  ConsultationResponse,
  ConsultationsListResponse,
  CreateConsultationPayload,
  CreatePrescriptionPayload,
  ListConsultationsQuery,
} from "../types/consultation.types";

export const consultationKeys = {
  all: ["consultations"] as const,
  lists: () => [...consultationKeys.all, "list"] as const,
  list: (filters: ListConsultationsQuery) => [...consultationKeys.lists(), filters] as const,
  details: () => [...consultationKeys.all, "detail"] as const,
  detail: (id: string) => [...consultationKeys.details(), id] as const,
  byPatient: (id: string) => ["consultations", "patient", id] as const,
  filesByPatient: (id: string) => ["medical-files", id] as const,
  suggestions: (codes: string[]) => ["med-suggestions", ...codes] as const,
  icd10: (q: string) => ["icd10", q] as const,
  patientSearch: (q: string) => ["patient-search", q] as const,
};

export function usePatientSearch(query: string) {
  return useQuery({
    queryKey: consultationKeys.patientSearch(query),
    queryFn: () => svc.searchPatients(query),
    enabled: query.trim().length >= 2,
    staleTime: 30_000,
  });
}

export function useIcd10Search(query: string) {
  return useQuery({
    queryKey: consultationKeys.icd10(query),
    queryFn: () => svc.searchIcd10(query),
    enabled: query.trim().length >= 2,
    staleTime: 60_000,
  });
}

export function useMedicationSuggestions(icd10Codes: string[]) {
  return useQuery({
    queryKey: consultationKeys.suggestions(icd10Codes),
    queryFn: () => svc.getMedicationSuggestions(icd10Codes),
    enabled: icd10Codes.length > 0,
    staleTime: 5 * 60_000,
  });
}

export function usePatientConsultations(patientId: string | null) {
  return useQuery({
    queryKey: consultationKeys.byPatient(patientId!),
    queryFn: () => svc.getConsultationsByPatient(patientId!),
    enabled: !!patientId,
    staleTime: 60_000,
  });
}

export function usePatientFiles(patientId: string | null) {
  return useQuery({
    queryKey: consultationKeys.filesByPatient(patientId!),
    queryFn: () => svc.getPatientMedicalFiles(patientId!),
    enabled: !!patientId,
    staleTime: 30_000,
  });
}

export function useCreateConsultationWithPrescription(onSuccess: (consultationId: string) => void) {
  const qc = useQueryClient();
  // Guard persistente para evitar doble envío por React Strict Mode o doble clic
  const isSubmittingRef = useRef(false);

  return useMutation({
    mutationFn: async ({
      consultation,
      prescriptionItems,
    }: {
      consultation: CreateConsultationPayload;
      prescriptionItems: CreatePrescriptionPayload["items"];
    }) => {
      // Si ya hay una petición en vuelo, ignorar la duplicada
      if (isSubmittingRef.current) return null as never;
      isSubmittingRef.current = true;

      try {
        const created = await svc.createConsultation(consultation);
        if (prescriptionItems.length > 0) {
          await svc.createPrescription({ consultationId: created.id, items: prescriptionItems });
        }
        return created;
      } finally {
        isSubmittingRef.current = false;
      }
    },
    onSuccess: (data) => {
      if (!data) return; // petición duplicada ignorada
      qc.invalidateQueries({ queryKey: consultationKeys.byPatient(data.patient.id) });
      notify.success("Consulta guardada", `Folio ${data.folioNumber} registrado correctamente.`);
      onSuccess(data.id);
    },
    onError: () => notify.error("Error al guardar la consulta", "Revisa los datos e intenta de nuevo."),
  });
}

export function useUploadPatientFile(patientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, category, description }: { file: File; category: string; description?: string }) =>
      svc.uploadPatientMedicalFile(patientId, file, category, description),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: consultationKeys.filesByPatient(patientId) });
      notify.success("Archivo subido correctamente");
    },
    onError: () => notify.error("Error al subir el archivo"),
  });
}

export function useConsultationsList(query: ListConsultationsQuery, initialData?: ConsultationsListResponse) {
  return useQuery({
    queryKey: consultationKeys.list(query),
    queryFn: () => svc.getConsultations(query),
    enabled: true,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
    initialData,
  });
}

export function useConsultationDetail(id: ConsultationResponse["id"], initialData: ConsultationResponse) {
  return useQuery({
    queryKey: consultationKeys.detail(id!),
    queryFn: () => svc.getConsultationById(id!),
    enabled: !!id,
    staleTime: 60_000,
    initialData,
  });
}

export function useIssuePrescription(consultationId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ prescriptionId, includeSignature }: { prescriptionId: string; includeSignature: boolean }) =>
      svc.handleIssuePrescription(prescriptionId, includeSignature),
    onSuccess: () => {
      // Invalidamos la consulta específica para que la UI se actualice
      qc.invalidateQueries({ queryKey: consultationKeys.detail(consultationId) });
      notify.success("Receta emitida", "La receta se ha generado correctamente.");
    },
    onError: () => {
      notify.error("Error al emitir", "Hubo un problema al generar la receta.");
    },
  });
}
