import type { Clinic, DoctorInClinic } from "@features/clinics/types/clinic.types";
import { ClinicDetailHeader } from "./header/ClinicDetailHeader";
import { ClinicDoctorsList } from "./doctors-list/ClinicDoctorsList";
import { AuthUser } from "@/features/auth";
import { ArrowLeft } from "lucide-react";

interface ClinicDetailProps {
  clinic: Clinic;
  canManage: boolean;
  canAssignDoctor: boolean;
  loggedUserId?: AuthUser["id"];
  onBack?: () => void;
  onEdit: (clinic: Clinic) => void;
  onToggleActive: (id: string) => void;
  onAssignDoctor: () => void;
  onAddSchedule: (dc: DoctorInClinic, prefillDate?: string) => void;
  onAddOverride: (dc: DoctorInClinic, prefillDate?: string) => void;
}

export function ClinicDetail({
  clinic,
  canManage,
  canAssignDoctor,
  loggedUserId,
  onEdit,
  onToggleActive,
  onAssignDoctor,
  onAddSchedule,
  onAddOverride,
  onBack,
}: ClinicDetailProps) {
  return (
    <>
      {/* Botón Volver solo visible en móvil */}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden flex items-center gap-2 text-sm font-semibold text-principal hover:opacity-80 transition-all mb-4 px-2"
        >
          <ArrowLeft size={16} />
          Volver a clínicas
        </button>
      )}

      <ClinicDetailHeader clinic={clinic} canManage={canManage} onEdit={onEdit} onToggleActive={onToggleActive} />

      <ClinicDoctorsList
        clinic={clinic}
        doctors={clinic.doctorClinics}
        canAssignDoctor={canAssignDoctor}
        loggedUserId={loggedUserId}
        onAddSchedule={onAddSchedule}
        onAddOverride={onAddOverride}
        onAssignDoctor={onAssignDoctor}
      />
    </>
  );
}
