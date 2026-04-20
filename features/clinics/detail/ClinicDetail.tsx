import type { Clinic, DoctorInClinic } from "@features/clinics/types/clinic.types";
import { ClinicDetailHeader } from "./header/ClinicDetailHeader";
import { ClinicDoctorsList } from "./doctors-list/ClinicDoctorsList";
import { AuthUser } from "@/features/auth";

interface ClinicDetailProps {
  clinic: Clinic;
  canManage: boolean;
  canAssignDoctor: boolean;
  loggedUserId?: AuthUser["id"];
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
}: ClinicDetailProps) {
  return (
    <>
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
