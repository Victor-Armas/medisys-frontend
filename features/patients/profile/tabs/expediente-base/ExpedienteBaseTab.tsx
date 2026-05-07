// features/patients/profile/tabs/expediente-base/ExpedienteBaseTab.tsx
"use client";

import { useMemo, useState } from "react";
import { FormProvider } from "react-hook-form";
import { Check, FileEdit, Loader2, X } from "lucide-react";
import { useConditions } from "@/features/patients/hooks/useConditions";
import { useMedications } from "@/features/patients/hooks/useMedications";
import { useAllergies } from "@/features/patients/hooks/useAllergies";
import { useMedicalHistoryForm } from "@/features/patients/hooks/useMedicalHistoryForm";
import type { MedicalHistory } from "@/features/patients/types/patient.types";
import { cn } from "@/shared/lib/utils";
import { AutoSaveIndicator } from "@/shared/ui/AutoSaveIndicator";

// Sections
import { FamilySection } from "./sections/FamilySection";
import { NonPathologicalSection } from "./sections/NonPathologicalSection";
import { AllergiesSection } from "../../antecedents/AllergiesSection";
import { PathologicalCenterColumn } from "./sections/PathologicalCenterColumn";
import { ECGLoader } from "@/shared/ui/ECGLoader";
import { HistorySection } from "@/features/patients/shared/HistorySection";

interface Props {
  patientId: string;
  hasEditPermission: boolean;
  existHistoryPatient: MedicalHistory | null;
}

type SectionKey = "allergies" | "family" | "pathological" | "nonPathological";

export function ExpedienteBaseTab({ patientId, hasEditPermission, existHistoryPatient }: Props) {
  const {
    formMethods,
    isLoading: historyLoading,
    hasHistory,
    isEditActive,
    isPending,
    isDirty,
    saveStatus,
    lastSavedAt,
    enableEditing,
    cancelEditing,
    submitForm,
  } = useMedicalHistoryForm({
    patientId,
    storageKey: `patient-history-base-${patientId}`,
    hasEditPermission,
    initialData: existHistoryPatient,
    disableAutoSave: true,
  });

  const { data: conditions = [], isLoading: condLoading } = useConditions(patientId);
  const { data: medications = [], isLoading: medLoading } = useMedications(patientId);
  const { data: allergies = [], isLoading: allergyLoading } = useAllergies(patientId);

  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);

  function requestEdit(section: SectionKey) {
    setActiveSection(section);
    if (!isEditActive) enableEditing();
  }

  function cancel() {
    cancelEditing();
    setActiveSection(null);
  }

  const sectionMeta = useMemo(
    () => ({
      hasHistory,
      hasEditPermission,
      isPending,
      isDirty,
      saveStatus,
      lastSavedAt,
    }),
    [hasHistory, hasEditPermission, isPending, isDirty, saveStatus, lastSavedAt],
  );

  if (historyLoading || condLoading || medLoading || allergyLoading) {
    return <ECGLoader />;
  }

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(submitForm)} className="space-y-4 pb-10">
        {/* 3-column layout matching mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* COL 1 — Alergias + Heredofamiliares (narrow) */}
          <div className="lg:col-span-3 space-y-4">
            <HistorySection
              title="Alergias"
              icon="warning"
              headerAction={
                <SectionHeaderActions
                  section="allergies"
                  activeSection={activeSection}
                  isEditActive={isEditActive}
                  onRequestEdit={requestEdit}
                  onCancel={cancel}
                  {...sectionMeta}
                />
              }
            >
              <AllergiesSection
                patientId={patientId}
                allergies={allergies}
                canEdit={isEditActive && activeSection === "allergies"}
              />
            </HistorySection>

            <HistorySection
              title="Familiares"
              icon="dna"
              headerAction={
                <SectionHeaderActions
                  section="family"
                  activeSection={activeSection}
                  isEditActive={isEditActive}
                  onRequestEdit={requestEdit}
                  onCancel={cancel}
                  {...sectionMeta}
                />
              }
            >
              <FamilySection patientId={patientId} conditions={conditions} canEdit={isEditActive && activeSection === "family"} />
            </HistorySection>
          </div>

          {/* COL 2 — Antecedentes Patológicos (center, wider) */}
          <div className="lg:col-span-5">
            <HistorySection
              title="Patológicos"
              icon="clipuser"
              headerAction={
                <SectionHeaderActions
                  section="pathological"
                  activeSection={activeSection}
                  isEditActive={isEditActive}
                  onRequestEdit={requestEdit}
                  onCancel={cancel}
                  {...sectionMeta}
                />
              }
            >
              <PathologicalCenterColumn
                patientId={patientId}
                conditions={conditions}
                medications={medications}
                canEdit={isEditActive && activeSection === "pathological"}
              />
            </HistorySection>
          </div>

          {/* COL 3 — Antecedentes No Patológicos */}
          <div className="lg:col-span-4">
            <HistorySection
              title="No Patológicos"
              icon="microscope"
              headerAction={
                <SectionHeaderActions
                  section="nonPathological"
                  activeSection={activeSection}
                  isEditActive={isEditActive}
                  onRequestEdit={requestEdit}
                  onCancel={cancel}
                  {...sectionMeta}
                />
              }
            >
              <NonPathologicalSection canEdit={isEditActive && activeSection === "nonPathological"} />
            </HistorySection>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

function SectionHeaderActions({
  section,
  activeSection,
  isEditActive,
  hasHistory,
  hasEditPermission,
  isPending,
  isDirty,
  onRequestEdit,
  onCancel,
}: {
  section: SectionKey;
  activeSection: SectionKey | null;
  isEditActive: boolean;
  hasHistory: boolean;
  hasEditPermission: boolean;
  isPending: boolean;
  isDirty: boolean;
  saveStatus: Parameters<typeof AutoSaveIndicator>[0]["status"];
  lastSavedAt: Parameters<typeof AutoSaveIndicator>[0]["lastSavedAt"];
  onRequestEdit: (section: SectionKey) => void;
  onCancel: () => void;
}) {
  if (!hasEditPermission) return null;

  const isActive = isEditActive && activeSection === section;

  return (
    <div className="flex items-center gap-2">
      {isActive && (
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[10px] bg-negative hover:bg-negative-hover text-negative-text font-semibold transition-colors"
        >
          <X size={12} />
          Cancelar
        </button>
      )}

      {isActive && isDirty ? (
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1.5 rounded-sm text-[10px] font-semibold text-white transition-colors",
            isPending ? "bg-disable cursor-not-allowed opacity-60" : "bg-positive hover:bg-positive-hover",
          )}
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
          Guardar
        </button>
      ) : null}

      {!isActive && (
        <button
          type="button"
          onClick={() => onRequestEdit(section)}
          disabled={!hasHistory && isActive}
          className={cn(
            "inline-flex items-center gap-1 px-3 py-1.5 rounded-sm text-[10px] font-semibold transition-colors",
            "bg-wairning hover:bg-wairning-hover text-wairning-text",
            !hasHistory && isEditActive && "opacity-60 cursor-not-allowed",
          )}
        >
          <FileEdit size={12} />
          Editar
        </button>
      )}
    </div>
  );
}
