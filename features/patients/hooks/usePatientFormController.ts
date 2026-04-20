"use client";

import { useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { useAutoSave } from "@/shared/hooks/useAutoSave";
import { notify } from "@/shared/ui/toaster";
import type { PatientFormData } from "../schemas/patient.schema";

interface Params {
  form: UseFormReturn<PatientFormData>;
  storageKey: string;
  isEdit: boolean;
}

export function usePatientFormController({ form, storageKey, isEdit }: Params) {
  const { getValues, reset, formState } = form;
  const { isDirty } = formState;

  const draftOffered = useRef(false);

  // ── AUTO SAVE ─────────────────────────────
  const autoSave = useAutoSave({
    storageKey,
    data: getValues(),
    enabled: isDirty && !isEdit,
  });

  // ── RESTORE DRAFT ─────────────────────────
  useEffect(() => {
    if (isEdit || draftOffered.current) return;

    const draft = autoSave.getDraft();
    if (!draft) return;

    draftOffered.current = true;

    setTimeout(() => {
      notify.success(
        "Borrador recuperado",
        "Se restauró el formulario donde lo dejaste",
      );
      reset(draft as PatientFormData);
    }, 300);
  }, [isEdit, reset, autoSave]);

  // ── CLEAN RESET (BOTÓN LIMPIAR) ───────────
  const clearForm = () => {
    autoSave.clearDraft();
    reset({});
  };

  return {
    autoSaveStatus: autoSave.status,
    lastSavedAt: autoSave.lastSavedAt,
    clearForm,
    isDirty,
  };
}
