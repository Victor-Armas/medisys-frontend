"use client";
import { useConsultationDetail } from "../hooks/useConsultation";
import { ECGLoader } from "@/shared/ui/ECGLoader";
import { ConsultationResponse } from "../types/consultation.types";
import { StaffRole } from "@/features/users/types";
import { usePermissions } from "@/shared/hooks/usePermissions";
import HeaderConsultationDetail from "./components/HeaderConsultationDetail";
import PatientConsultationDetail from "./components/PatientConsultationDetail";
import VitalConsultationDetail from "./components/VitalConsultationDetail";
import NotesConsultationDetail from "./components/NotesConsultationDetail";
import DiagnosesConsultationDetail from "./components/DiagnosesConsultationDetail";
import PrescriptionConsultationDetail from "./components/PrescriptionConsultationDetail";

interface Props {
  consultation: ConsultationResponse;
  role: StaffRole;
}

export function ConsultationDetailPage({ consultation, role }: Props) {
  const { canPrintConsultation } = usePermissions(role);
  const { data: c, isLoading } = useConsultationDetail(consultation.id, consultation);

  if (isLoading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <ECGLoader />
      </div>
    );

  if (!c) return <div className="flex-1 flex items-center justify-center text-subtitulo text-sm">Consulta no encontrada</div>;

  const hasVitals = !!c.vitalSigns;

  return (
    <div className="flex flex-col gap-5 p-6 h-full overflow-y-auto custom-scrollbar  mx-auto w-full">
      {/* Back + actions */}
      <HeaderConsultationDetail c={c} canPrint={canPrintConsultation} />

      {/* Patient card */}
      <PatientConsultationDetail c={c} />

      {/* Vital signs */}
      {hasVitals && <VitalConsultationDetail c={c} />}

      {/* Clinical notes */}
      <NotesConsultationDetail c={c} />

      {/* Diagnoses */}
      {c.diagnoses.length > 0 && <DiagnosesConsultationDetail c={c} />}

      {/* Prescription */}
      {c.prescription?.items && c.prescription.items.length > 0 && <PrescriptionConsultationDetail c={c} />}
    </div>
  );
}
