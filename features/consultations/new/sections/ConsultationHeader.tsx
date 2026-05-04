"use client";
import { useState, useCallback } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { PatientSearchCard } from "./PatientSearchCard";
import { PatientNewCard } from "./PatientNewCard";
import { PatientInfoCard } from "./PatientInfoCard";
import type { PatientSearchResult } from "../../types/consultation.types";
import type { ConsultationFormValues } from "../../schemas/consultation.schema";
import { AutoSaveStatus } from "@/shared/hooks/useAutoSave";

interface Props {
  folioNumber?: string;
  autoSaveStatus: AutoSaveStatus;
  lastSavedAt: Date | null;
  initialPatient?: PatientSearchResult | null;
}

export function ConsultationHeader({ folioNumber, autoSaveStatus, lastSavedAt, initialPatient }: Props) {
  const { setValue, control } = useFormContext<ConsultationFormValues>();
  const patientId = useWatch({ control, name: "patientId" });
  const patientMode = useWatch({ control, name: "patientMode" });

  // Datos completos del paciente (obtenidos de la búsqueda o del initialPatient)
  const [selectedPatientData, setSelectedPatientData] = useState<PatientSearchResult | null>(initialPatient ?? null);

  // Inicializar con initialPatient
  // (Se ejecuta solo si initialPatient cambia y no hay paciente seleccionado manualmente)
  const handlePatientSelect = useCallback(
    (patient: PatientSearchResult) => {
      setValue("patientId", patient.id);
      setValue("patientMode", "EXISTING");
      setValue("newPatient", undefined);
      setSelectedPatientData(patient);
    },
    [setValue],
  );

  function handleCreateNew() {
    setValue("patientId", undefined);
    setValue("patientMode", "NEW");
    setValue("newPatient", undefined);
    setSelectedPatientData(null);
  }

  function handleCancelNew() {
    setValue("patientMode", "EXISTING");
  }

  function handleChangePatient() {
    setValue("patientId", undefined);
    setValue("patientMode", "EXISTING"); // o undefined si quieres reset total
    setValue("newPatient", undefined);
    setSelectedPatientData(null);
    setValue("newPatient", undefined);
  }

  if (patientMode === "NEW") {
    return <PatientNewCard onCancel={handleCancelNew} />;
  }

  if (patientMode === "EXISTING" && patientId && selectedPatientData) {
    return (
      <PatientInfoCard
        patient={selectedPatientData}
        folioNumber={folioNumber}
        autoSaveStatus={autoSaveStatus}
        lastSavedAt={lastSavedAt}
        onChangePatient={handleChangePatient}
      />
    );
  }

  return (
    <PatientSearchCard onSelect={handlePatientSelect} selectedPatientData={selectedPatientData} onCreateNew={handleCreateNew} />
  );
}
