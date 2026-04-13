"use client";

import { AlertCircle, FileEdit } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useMedicalHistoryForm } from "../../../hooks/useMedicalHistoryForm";
import { PathologicalSection } from "../medical-history/sections/PathologicalSection";
import { NonPathologicalSection } from "../medical-history/sections/NonPathologicalSection";
import { FamilySection } from "../medical-history/sections/FamilySection";
import { HistoryToolbar } from "./HistoryToolbar";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  hasEditPermission: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ExpedienteBaseTab({ patientId, hasEditPermission }: Props) {
  const {
    formMethods,
    isLoading,
    isError,
    hasHistory,
    isEditActive,
    isPending,
    isDirty,
    saveStatus,
    lastSavedAt,
    enableEditing,
    startCreatingDraft,
    cancelEditing,
    submitForm,
  } = useMedicalHistoryForm({
    patientId,
    storageKey: `patient-history-base-${patientId}`,
    hasEditPermission,
  });

  if (isLoading) return <Skeleton />;

  if ((isError || !hasHistory) && !isEditActive) {
    return <EmptyState canCreate={hasEditPermission} onStart={startCreatingDraft} />;
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(submitForm)} className="space-y-5 pb-10">
        <PathologicalSection canEdit={isEditActive} />
        <NonPathologicalSection canEdit={isEditActive} />
        <FamilySection canEdit={isEditActive} />
        <HistoryToolbar
          hasHistory={hasHistory}
          isEditActive={isEditActive}
          hasEditPermission={hasEditPermission}
          isPending={isPending}
          isDirty={isDirty}
          saveStatus={saveStatus}
          lastSavedAt={lastSavedAt}
          sectionTitle="Antecedentes personales"
          onEnableEditing={enableEditing}
          onCancel={cancelEditing}
        />
      </form>
    </FormProvider>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function EmptyState({ canCreate, onStart }: { canCreate: boolean; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4 bg-bg-surface/50 rounded-3xl border border-dashed border-border-default">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center text-brand">
        <AlertCircle size={30} />
      </div>
      <div>
        <h3 className="text-base font-bold text-text-primary mb-1">Historia clínica pendiente</h3>
        <p className="text-sm text-text-secondary max-w-sm">
          Este paciente aún no tiene antecedentes registrados. Es necesario completarlos antes de emitir recetas o notas de
          evolución.
        </p>
      </div>
      {canCreate && (
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-xl hover:bg-brand-hover transition-colors shadow-sm"
        >
          <FileEdit size={15} />
          Iniciar historia clínica
        </button>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-16 rounded-2xl bg-bg-surface border border-border-default" />
      <div className="h-52 rounded-2xl bg-bg-surface border border-border-default" />
      <div className="h-64 rounded-2xl bg-bg-surface border border-border-default" />
      <div className="h-44 rounded-2xl bg-bg-surface border border-border-default" />
    </div>
  );
}
