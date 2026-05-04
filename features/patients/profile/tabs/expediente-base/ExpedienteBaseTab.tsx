// features/patients/components/profile/tabs/ExpedienteBaseTab.tsx
"use client";

import { FormProvider } from "react-hook-form";
import { PathologicalSection } from "./sections/PathologicalSection";
import { NonPathologicalSection } from "./sections/NonPathologicalSection";
import { FamilySection } from "./sections/FamilySection";
import { HistoryToolbar } from "../../../shared/HistoryToolbar";
import { useConditions } from "@/features/patients/hooks/useConditions";
import { useMedications } from "@/features/patients/hooks/useMedications";
import { useAllergies } from "@/features/patients/hooks/useAllergies";
import { useMedicalHistoryForm } from "@/features/patients/hooks/useMedicalHistoryForm";
import EmptyState from "./EmptyState";
import { MedicalHistory } from "@/features/patients/types/patient.types";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  hasEditPermission: boolean;
  existHistoryPatient: MedicalHistory | null;
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
export function ExpedienteBaseTab({ patientId, hasEditPermission, existHistoryPatient }: Props) {
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

  if ((isError || !existHistoryPatient) && !isEditActive) {
    return <EmptyState canCreate={hasEditPermission} onStart={startCreatingDraft} />;
  }
  const isLoading = historyLoading || condLoading || medLoading || allergyLoading;

  if (isLoading) return <Skeleton />;

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
