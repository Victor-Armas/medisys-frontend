"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileEdit, Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { notify } from "@/shared/ui/toaster";
import { useAutoSave } from "@/shared/hooks/useAutoSave";

import { medicalHistorySchema, type MedicalHistoryFormData, medicalHistoryDefaultValues } from "./medical-history/schema";

// Secciones
import { PathologicalSection } from "./medical-history/sections/PathologicalSection";
import { NonPathologicalSection } from "./medical-history/sections/NonPathologicalSection";
import { FamilySection } from "./medical-history/sections/FamilySection";
import { GynecologicalSection } from "./medical-history/sections/GynecologicalSection";
import { useMedicalHistory, useCreateMedicalHistory, useUpdateMedicalHistory } from "../../hooks/usePatients";

interface Props {
  patientId: string;
  patientGender?: "MALE" | "FEMALE" | "OTHER";
}

export function PatientMedicalHistoryTab({ patientId, patientGender }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const { data: history, isLoading, isError } = useMedicalHistory(patientId);
  const createHistory = useCreateMedicalHistory();
  const updateHistory = useUpdateMedicalHistory();

  const formMethods = useForm<MedicalHistoryFormData>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: medicalHistoryDefaultValues,
  });

  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = formMethods;

  const formValues = watch();

  // Auto-Save al localStorage
  const {
    status: saveStatus,
    lastSavedAt,
    getDraft,
    clearDraft,
  } = useAutoSave({
    storageKey: `patient-history-${patientId}`,
    data: formValues,
    enabled: isDirty && (isEditing || isCreatingDraft),
    debounceMs: 1200,
  });

  // Efecto principal para restaurar borradores y sincronizar la BD
  useEffect(() => {
    const sourceData = history || getDraft();

    if (sourceData) {
      if (!history && getDraft()) {
        setIsCreatingDraft(true); // Abre el form si hay borrador y no hay historia oficial
      }

      // Convertimos el obj recibido al formato exacto del form (transformando nulls indeseados en strings para evitar uncontrolled inputs)
      const cleanData = Object.fromEntries(
        Object.entries(sourceData).map(([k, v]) => [k, v ?? (typeof v === "boolean" ? false : "")]),
      );

      reset(cleanData as MedicalHistoryFormData, { keepDirty: true });
    }
  }, [history, reset]); // eslint-disable-line react-hooks/exhaustive-deps

  const canEdit = isEditing || isCreatingDraft;

  async function onSubmit(data: MedicalHistoryFormData) {
    const loadId = notify.loading("Guardando historia clínica...");
    try {
      const payload = { ...data, patientId };
      if (history) {
        await updateHistory.mutateAsync({ patientId, payload });
      } else {
        await createHistory.mutateAsync({ patientId, payload });
      }

      clearDraft();
      reset(data, { keepValues: true, keepDirty: false });
      setIsCreatingDraft(false);
      setIsEditing(false);

      notify.success("Historia clínica guardada con éxito", "El expediente ha sido actualizado.", { id: loadId });
    } catch (err) {
      console.error(err);
      notify.error("Error al guardar", "Ocurrió un problema de comunicación.", { id: loadId });
    }
  }

  if (isLoading) {
    return <HistorySkeleton />;
  }

  // Si no hay historia ni borrador activo, muestra mensaje central
  if ((isError || !history) && !isCreatingDraft) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-bg-surface/50 rounded-3xl border border-dashed border-border-default">
        <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mb-4 text-brand">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-2">Historia Clínica Pendiente</h3>
        <p className="text-sm text-text-tertiary max-w-sm mb-6">
          Este paciente aún no tiene un expediente clínico registrado. La historia clínica debe crearse para realizar
          prescripciones y consultas formales.
        </p>
        <button
          onClick={() => setIsCreatingDraft(true)}
          className="px-6 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand/90 transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <FileEdit size={16} />
          Iniciar historia clínica
        </button>
      </div>
    );
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-24">
        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 lg:p-5 bg-white border border-border-default rounded-2xl shadow-sm sticky top-0 z-10">
          <div>
            <h3 className="font-bold text-text-primary">Expediente Clínico</h3>
            {saveStatus === "saving" && (
              <span className="text-xs text-brand font-medium flex items-center gap-1.5 mt-0.5">
                <Loader2 size={12} className="animate-spin" /> Guardando borrador…
              </span>
            )}
            {saveStatus === "saved" && lastSavedAt && (
              <span className="text-xs text-text-tertiary">
                Borrador guardado {lastSavedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {history && !canEdit && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-bg-surface text-text-secondary hover:text-brand hover:bg-brand/5 font-semibold text-sm rounded-xl transition flex items-center gap-2"
              >
                <FileEdit size={16} />
                Habilitar edición
              </button>
            )}

            {canEdit && (
              <>
                {history && (
                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 text-text-secondary hover:text-text-primary font-semibold text-sm rounded-xl transition"
                  >
                    Cancelar
                  </button>
                )}
                <button
                  type="submit"
                  disabled={updateHistory.isPending || createHistory.isPending}
                  className={cn(
                    "px-5 py-2 text-white font-semibold text-sm rounded-xl transition flex items-center gap-2 shadow-sm",
                    isDirty ? "bg-brand hover:bg-brand/90 hover:shadow-md" : "bg-border-strong cursor-not-allowed",
                  )}
                >
                  {updateHistory.isPending || createHistory.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  Guardar cambios
                </button>
              </>
            )}
          </div>
        </div>

        {/* Formularios */}
        <div className="space-y-6">
          <PathologicalSection canEdit={canEdit} />
          <NonPathologicalSection canEdit={canEdit} />
          <FamilySection canEdit={canEdit} />
          {(patientGender === "FEMALE" || !patientGender) && <GynecologicalSection canEdit={canEdit} />}
        </div>
      </form>
    </FormProvider>
  );
}

// Skeleton component
function HistorySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-20 bg-bg-surface rounded-2xl border border-border-default"></div>
      <div className="space-y-4">
        <div className="h-48 bg-bg-surface rounded-2xl border border-border-default"></div>
        <div className="h-64 bg-bg-surface rounded-2xl border border-border-default"></div>
        <div className="h-40 bg-bg-surface rounded-2xl border border-border-default"></div>
      </div>
    </div>
  );
}
