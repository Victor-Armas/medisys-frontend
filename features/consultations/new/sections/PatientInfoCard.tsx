"use client";
import { User, Calendar, AlertTriangle } from "lucide-react";
import type { PatientSearchResult } from "../../types/consultation.types";
import { calculateAge, GENDER_LABELS } from "../../utils/consultation.utils";
import { AutoSaveIndicator } from "@/shared/ui/AutoSaveIndicator"; // componente propio
import { AutoSaveStatus } from "@/shared/hooks/useAutoSave";
import { AllergyPanel } from "./AllergyPanel";

interface Props {
  patient: PatientSearchResult;
  folioNumber?: string;
  autoSaveStatus: AutoSaveStatus;
  lastSavedAt: Date | null;
  onChangePatient: () => void;
}

export function PatientInfoCard({ patient, folioNumber, autoSaveStatus, lastSavedAt, onChangePatient }: Props) {
  return (
    <div className="bg-interior rounded-xl border border-disable/20 p-5 flex flex-col gap-3">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-principal/10 flex items-center justify-center">
            <User size={20} className="text-principal" />
          </div>
          <div>
            <h3 className="font-bold text-encabezado">
              {patient.firstName} {patient.middleName} {patient.lastNamePaternal} {patient.lastNameMaternal}
            </h3>
            <p className="text-xs text-subtitulo flex items-center gap-2">
              <Calendar size={12} />
              {calculateAge(patient.birthDate)} años · {GENDER_LABELS[patient.gender]}
              {patient.phone && ` · ${patient.phone}`}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 items-end">
          <button type="button" onClick={onChangePatient} className="text-xs text-principal hover:underline">
            Cambiar paciente
          </button>
          <AutoSaveIndicator status={autoSaveStatus} lastSavedAt={lastSavedAt} />
        </div>
      </div>

      {/* Alergias */}
      <AllergyPanel allergies={patient.allergies} />

      {/* Condiciones crónicas */}
      {patient.conditions?.length > 0 && (
        <div className="flex gap-2 items-start text-xs bg-blue-50 border border-blue-200 rounded-md p-2">
          <AlertTriangle size={14} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-encabezado">Condiciones: </span>
            {patient.conditions.map((c, i) => (
              <span key={i} className="text-subtitulo">
                {c.description}
                {i < patient.conditions.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Indicador de auto-guardado y folio */}
      <div className="flex justify-end items-center gap-4 mt-2">
        {folioNumber && (
          <p className="text-xs text-subtitulo">
            Folio: <span className="font-mono text-encabezado">{folioNumber}</span>
          </p>
        )}
      </div>
    </div>
  );
}
