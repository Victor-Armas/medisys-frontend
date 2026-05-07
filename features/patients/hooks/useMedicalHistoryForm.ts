"use client";

import { useEffect, useState } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notify } from "@/shared/ui/toaster";
import { useAutoSave, type AutoSaveStatus } from "@/shared/hooks/useAutoSave";
import {
  medicalHistorySchema,
  medicalHistoryDefaultValues,
  type MedicalHistoryFormData,
} from "../schemas/medical-history.schema";
import { useMedicalHistory, useCreateMedicalHistory, useUpdateMedicalHistory } from "./useMedicalHistory";
import { MedicalHistory } from "../types/patient.types";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Params {
  patientId: string;
  storageKey: string;
  hasEditPermission: boolean;
  initialData?: MedicalHistory | null;
  disableAutoSave?: boolean;
}

export interface UseMedicalHistoryFormReturn {
  formMethods: UseFormReturn<MedicalHistoryFormData>;
  isLoading: boolean;
  isError: boolean;
  hasHistory: boolean;
  isEditActive: boolean;
  hasEditPermission: boolean;
  isPending: boolean;
  isDirty: boolean;
  saveStatus: AutoSaveStatus;
  lastSavedAt: Date | null;
  enableEditing: () => void;
  startCreatingDraft: () => void;
  cancelEditing: () => void;
  submitForm: (data: MedicalHistoryFormData) => Promise<void>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function normalizeFieldValue(key: string, value: unknown): unknown {
  if (value !== null && value !== undefined) return value;
  const defaultValue = medicalHistoryDefaultValues[key as keyof MedicalHistoryFormData];
  if (typeof defaultValue === "boolean") return false;
  if (defaultValue === null) return null;
  return "";
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useMedicalHistoryForm({
  patientId,
  storageKey,
  hasEditPermission,
  initialData,
  disableAutoSave,
}: Params): UseMedicalHistoryFormReturn {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  // FIXED: always enable the query so it refreshes after create/update
  // retry: false in useMedicalHistory handles 404 gracefully for new patients
  const {
    data: history,
    isLoading,
    isError,
  } = useMedicalHistory(patientId, {
    enabled: !!patientId,
  });

  const createHistory = useCreateMedicalHistory();
  const updateHistory = useUpdateMedicalHistory();

  const formMethods = useForm<MedicalHistoryFormData>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: medicalHistoryDefaultValues,
    mode: "onTouched",
  });

  const {
    reset,
    watch,
    formState: { isDirty },
  } = formMethods;

  const formValues = watch();
  const isEditActive = isEditing || isCreatingDraft;

  const {
    status: saveStatus,
    lastSavedAt,
    getDraft,
    clearDraft,
  } = useAutoSave({
    storageKey,
    data: formValues,
    enabled: isDirty && isEditActive && !disableAutoSave,
    debounceMs: 800,
  });

  // Sync form with DB data or draft on mount / when history loads
  useEffect(() => {
    const draft = getDraft();
    // Prefer live DB data over draft; use initialData as fallback on first render
    const sourceData = history ?? draft ?? initialData ?? null;
    if (!sourceData) return;

    if (!history && draft) {
      setIsCreatingDraft(true);
    }

    const cleanData = Object.fromEntries(
      Object.entries(sourceData).map(([k, v]) => [k, normalizeFieldValue(k, v)]),
    ) as MedicalHistoryFormData;

    reset(cleanData, { keepDirty: !!draft });
  }, [history]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Submit ────────────────────────────────────────────────────────────────

  const submitForm = async (data: MedicalHistoryFormData): Promise<void> => {
    const loadId = notify.loading("Guardando historia clínica…");
    try {
      if (history) {
        await updateHistory.mutateAsync({ patientId, payload: data });
      } else {
        await createHistory.mutateAsync({ patientId, payload: data });
      }
      clearDraft();
      reset(data, { keepValues: true, keepDirty: false });
      setIsCreatingDraft(false);
      setIsEditing(false);
      notify.success("Historia clínica guardada", undefined, { id: loadId });
    } catch {
      notify.error("Error al guardar", "Intenta de nuevo.", { id: loadId });
    }
  };

  return {
    formMethods,
    isLoading,
    isError,
    hasHistory: !!history,
    isEditActive,
    hasEditPermission,
    isPending: createHistory.isPending || updateHistory.isPending,
    isDirty,
    saveStatus,
    lastSavedAt,
    enableEditing: () => setIsEditing(true),
    startCreatingDraft: () => setIsCreatingDraft(true),
    cancelEditing: () => {
      reset();
      setIsEditing(false);
    },
    submitForm,
  };
}
