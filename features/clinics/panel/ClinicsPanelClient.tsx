"use client";

import { useClinics, useToggleClinic } from "@features/clinics/hooks";
import type { Clinic } from "@features/clinics/types/clinic.types";
import { ClinicSidebar } from "./ClinicSidebar";
import { ClinicDetail } from "../detail/ClinicDetail";
import { ClinicFormModal } from "../schedule/modals/clinic-form/ClinicFormModal";
import { AddScheduleModal } from "../schedule/modals/add-schedule/AddScheduleModal";
import { AddOverrideModal } from "../schedule/modals/add-override/AddOverrideModal";
import { useClinicManagement } from "../hooks/useClinicManagement";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { AssignDoctorToClinicModal } from "../schedule/modals/assign-doctor/AssignDoctorToClinicModal";
import { ECGLoader } from "@/shared/ui/ECGLoader";
import { StaffRole } from "@/features/users/types";

interface Props {
  initialClinics: Clinic[];
  initialRole: StaffRole;
}

export function ClinicsPanelClient({ initialClinics, initialRole }: Props) {
  const { data: clinics = initialClinics, isLoading } = useClinics();
  const toggleClinic = useToggleClinic();
  const { canManageClinics, canAssignDoctorToClinic, userId } = usePermissions(initialRole);

  const handleAddClinic = canManageClinics ? () => setModal("create-clinic") : undefined;
  const handleToggleClinic = canManageClinics ? (id: string) => toggleClinic.mutate(id) : undefined;

  const {
    selectedClinic,
    setSelected,
    modal,
    setModal,
    editingClinic,
    modalContext,
    openScheduleModal,
    openOverrideModal,
    closeModal,
    handleEditClinic,
  } = useClinicManagement(clinics);

  // 3. Early return protegido para el loader
  if (!isLoading && clinics.length === 0) {
    return <ECGLoader />;
  }

  return (
    <div className="flex h-full gap-0 overflow-hidden px-6 pt-4">
      {/* ── Panel izquierdo ── */}
      <ClinicSidebar
        clinics={clinics}
        activeClinicId={selectedClinic?.id}
        onSelect={setSelected}
        onAddClinic={handleAddClinic}
        onToggleClinic={handleToggleClinic}
      />

      {/* ── Panel derecho ── */}
      <main className="flex-1 overflow-y-auto pl-4">
        {!selectedClinic ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-subtitulo">Selecciona un consultorio</p>
          </div>
        ) : (
          <ClinicDetail
            clinic={selectedClinic}
            canManage={canManageClinics}
            loggedUserId={userId}
            onEdit={handleEditClinic}
            onToggleActive={(id) => toggleClinic.mutate(id)}
            onAssignDoctor={() => setModal("assign-doctor")}
            canAssignDoctor={canAssignDoctorToClinic}
            onAddSchedule={openScheduleModal}
            onAddOverride={openOverrideModal}
          />
        )}
      </main>

      {/* ── Modales ── */}
      {modal === "create-clinic" && canManageClinics && <ClinicFormModal onClose={closeModal} />}
      {modal === "edit-clinic" && editingClinic && canManageClinics && (
        <ClinicFormModal clinic={editingClinic} onClose={closeModal} />
      )}
      {modal === "add-schedule" && (
        <AddScheduleModal
          doctorClinicId={modalContext.doctorClinicId}
          doctorName={modalContext.doctorName}
          prefillDate={modalContext.prefillDate}
          onClose={closeModal}
        />
      )}
      {modal === "add-override" && (
        <AddOverrideModal
          doctorClinicId={modalContext.doctorClinicId}
          doctorName={modalContext.doctorName}
          prefillDate={modalContext.prefillDate}
          onClose={closeModal}
        />
      )}
      {modal === "assign-doctor" && selectedClinic && canAssignDoctorToClinic && (
        <AssignDoctorToClinicModal clinicId={selectedClinic.id} clinicName={selectedClinic.name} onClose={closeModal} />
      )}
    </div>
  );
}
