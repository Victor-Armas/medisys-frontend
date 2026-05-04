"use client";
import { VitalSignsSection } from "../sections/VitalSignsSection";
import { ClinicalNotesSection } from "../sections/ClinicalNotesSection";
import { DiagnosisSection } from "../sections/DiagnosisSection";
import { PrescriptionSection } from "../sections/PrescriptionSection";
import type { AutoSaveStatus } from "@/shared/hooks/useAutoSave";
import { ConsultationHeader } from "../sections/ConsultationHeader";
import { PatientSearchResult } from "../../types/consultation.types";

interface Props {
  autoSaveStatus: AutoSaveStatus;
  lastSavedAt: Date | null;
  folioNumber?: string;
  initialPatient?: PatientSearchResult | null;
}

export function ConsultationFormStep({ autoSaveStatus, lastSavedAt, folioNumber, initialPatient }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <ConsultationHeader
        folioNumber={folioNumber}
        autoSaveStatus={autoSaveStatus}
        lastSavedAt={lastSavedAt}
        initialPatient={initialPatient ?? null}
      />
      <VitalSignsSection />
      <ClinicalNotesSection />
      <DiagnosisSection />
      <PrescriptionSection />
    </div>
  );
}
