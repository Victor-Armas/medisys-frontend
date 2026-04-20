"use client";

import { FormProvider } from "react-hook-form";
import { GynecologicalSection } from "../expediente-base/sections/GynecologicalSection";
import { HistoryToolbar } from "../../../shared/HistoryToolbar";
import { useMedicalHistoryForm } from "@/features/patients/hooks/useMedicalHistoryForm";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  hasEditPermission: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Gynecological and obstetric history tab.
 * Only rendered for patients with gender FEMALE or OTHER.
 * Uses a separate storage key and edit state from ExpedienteBaseTab,
 * but shares the same MedicalHistory record via PATCH.
 */
export function AgoyCiclosTab({ patientId, hasEditPermission }: Props) {
  const {
    formMethods,
    isLoading,
    isEditActive,
    isPending,
    isDirty,
    saveStatus,
    lastSavedAt,
    hasHistory,
    enableEditing,
    startCreatingDraft,
    cancelEditing,
    submitForm,
  } = useMedicalHistoryForm({
    patientId,
    storageKey: `patient-history-ago-${patientId}`,
    hasEditPermission,
  });

  if (isLoading) return <Skeleton />;

  // If no history exists yet, enable creation from this tab too
  if (!hasHistory && !isEditActive) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4 /50 rounded-3xl border border-dashed ">
        <p className="text-sm text-subtitulo max-w-sm">
          Completa primero la pestaña <strong className="text-encabezado">Expediente Base</strong> para habilitar los antecedentes
          gineco-obstétricos.
        </p>
        {hasEditPermission && (
          <button
            onClick={startCreatingDraft}
            className="px-4 py-2 bg-principal text-white text-sm font-semibold rounded-xl hover:bg-principal-hover transition-colors"
          >
            Iniciar desde aquí
          </button>
        )}
      </div>
    );
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(submitForm)} className="space-y-5 pb-10">
        <GynecologicalSection canEdit={isEditActive} />
        <HistoryToolbar
          hasHistory={hasHistory}
          isEditActive={isEditActive}
          hasEditPermission={hasEditPermission}
          isPending={isPending}
          isDirty={isDirty}
          saveStatus={saveStatus}
          lastSavedAt={lastSavedAt}
          sectionTitle="AGO & Ciclos menstruales"
          onEnableEditing={enableEditing}
          onCancel={cancelEditing}
        />
      </form>
    </FormProvider>
  );
}

function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-16 rounded-2xl  border " />
      <div className="h-72 rounded-2xl  border " />
    </div>
  );
}
