// features/patients/components/profile/tabs/ExpedienteBaseTab.tsx
"use client";

import { AlertCircle, FileEdit } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { PathologicalSection } from "./sections/PathologicalSection";
import { NonPathologicalSection } from "./sections/NonPathologicalSection";
import { FamilySection } from "./sections/FamilySection";
import { HistoryToolbar } from "../../../shared/HistoryToolbar";
import { useConditions } from "@/features/patients/hooks/useConditions";
import { useMedications } from "@/features/patients/hooks/useMedications";
import { useAllergies } from "@/features/patients/hooks/useAllergies";
import { useMedicalHistoryForm } from "@/features/patients/hooks/useMedicalHistoryForm";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  hasEditPermission: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Expediente Base tab.
 *
 * Composes:
 *  - PathologicalSection  → conditions (ICD-10 chips) + medications + allergies
 *  - NonPathologicalSection → habit fields (still in MedicalHistory)
 *  - FamilySection          → heredofamilial conditions (ICD-10 chips, type=FAMILY)
 *
 * Structured antecedents (conditions/medications/allergies) use their own
 * mutation hooks; they do NOT go through the MedicalHistory form submit.
 * The form only manages: bloodTransfusions + habits + gynecological.
 */
export function ExpedienteBaseTab({ patientId, hasEditPermission }: Props) {
  const {
    formMethods,
    isLoading: historyLoading,
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

  // Structured antecedents — independent queries
  const { data: conditions = [], isLoading: condLoading } = useConditions(patientId);
  const { data: medications = [], isLoading: medLoading } = useMedications(patientId);
  const { data: allergies = [], isLoading: allergyLoading } = useAllergies(patientId);

  const isLoading = historyLoading || condLoading || medLoading || allergyLoading;

  if (isLoading) return <Skeleton />;

  if ((isError || !hasHistory) && !isEditActive) {
    return <EmptyState canCreate={hasEditPermission} onStart={startCreatingDraft} />;
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(submitForm)} className="space-y-5">
        {/* Structured antecedents — mutations work independently of form submit */}
        <PathologicalSection
          patientId={patientId}
          conditions={conditions}
          medications={medications}
          allergies={allergies}
          canEdit={isEditActive}
        />

        {/* Habits — still part of MedicalHistory form */}
        <NonPathologicalSection canEdit={isEditActive} />

        {/* Family history — structured conditions with type=FAMILY */}
        <FamilySection patientId={patientId} conditions={conditions} canEdit={isEditActive} />
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
    <div className="flex flex-col items-center justify-center py-16 text-center gap-4 /50 rounded-3xl border border-dashed ">
      <div className="w-16 h-16 rounded-2xl bg-principal flex items-center justify-center text-principal">
        <AlertCircle size={30} />
      </div>
      <div>
        <h3 className="text-base font-bold text-encabezado mb-1">Historia clínica pendiente</h3>
        <p className="text-sm text-subtitulo max-w-sm">
          Este paciente aún no tiene antecedentes registrados. Es necesario completarlos antes de emitir recetas o notas de
          evolución.
        </p>
      </div>
      {canCreate && (
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-5 py-2.5 bg-principal text-white text-sm font-semibold rounded-xl hover:bg-principal-hover transition-colors shadow-sm"
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
      <div className="h-52 rounded-2xl bg-interior " />
      <div className="h-64 rounded-2xl bg-interior " />
      <div className="h-44 rounded-2xl bg-interior " />
      <div className="h-16 rounded-2xl bg-interior " />
    </div>
  );
}
