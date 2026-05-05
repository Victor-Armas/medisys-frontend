// features/patients/profile/tabs/ago-ciclos/AgoyCiclosTab.tsx
"use client";

import { FormProvider } from "react-hook-form";
import { GynecologicalSection } from "../expediente-base/sections/GynecologicalSection";
import { HistoryToolbar } from "../../../shared/HistoryToolbar";
import { useMedicalHistoryForm } from "@/features/patients/hooks/useMedicalHistoryForm";
import type { MedicalHistory } from "@/features/patients/types/patient.types";
import { ECGLoader } from "@/shared/ui/ECGLoader";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  hasEditPermission: boolean;
  existHistoryPatient: MedicalHistory | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Gynecological and obstetric history tab.
 * Only rendered for patients with gender FEMALE or OTHER.
 *
 * Uses a separate storageKey / edit state from ExpedienteBaseTab
 * but shares the same MedicalHistory record via PATCH.
 */
export function AgoyCiclosTab({ patientId, hasEditPermission, existHistoryPatient }: Props) {
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
    initialData: existHistoryPatient,
  });

  if (isLoading) return <ECGLoader />;


  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(submitForm)} className="space-y-4 pb-10">
        <GynecologicalSection
          canEdit={isEditActive}
          headerRight={
            <HistoryToolbar
              variant="inline"
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
          }
        />
      </form>
    </FormProvider>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────


