"use client";

import { useClinics, useToggleClinic } from "@features/clinics/hooks";
import type { Clinic } from "@features/clinics/types/clinic.types";
import { ClinicSidebar } from "./ClinicSidebar";
import { ClinicDetailHeader } from "./ClinicDetailHeader";
import { ClinicDoctorsList } from "./ClinicDoctorsList";
import { ClinicFormModal } from "./modals/ClinicFormModal";
import { AddScheduleModal } from "./modals/AddScheduleModal";
import { AddOverrideModal } from "./modals/AddOverrideModal";
import { useClinicManagement } from "../hooks/useClinicManagement";
import { usePermissions } from "@/shared/hooks/usePermissions";
import { AssignDoctorToClinicModal } from "./modals/AssignDoctorToClinicModal";
import { ClinicsEmptyState } from "./ClinicsEmptyState";

interface Props {
  initialClinics: Clinic[];
}

export function ClinicsPanelClient({ initialClinics }: Props) {
  const { data: clinics = initialClinics, isLoading } = useClinics();
  const toggleClinic = useToggleClinic();
  const { canManageClinics, canAssignDoctorToClinic } = usePermissions();

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

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-text-secondary">Cargando consultorios...</p>
      </div>
    );
  }

  if (!isLoading && clinics.length === 0) {
    return <ClinicsEmptyState />;
  }

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* ── Panel izquierdo ── */}
      <ClinicSidebar
        clinics={clinics}
        activeClinicId={selectedClinic?.id}
        onSelect={setSelected}
        onAddClinic={handleAddClinic}
        onToggleClinic={handleToggleClinic}
      />

      {/* ── Panel derecho ── */}
      <main className="flex-1 overflow-y-auto bg-bg-base">
        {!selectedClinic ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-text-secondary">Selecciona un consultorio</p>
          </div>
        ) : (
          <>
            <ClinicDetailHeader
              clinic={selectedClinic}
              canManage={canManageClinics}
              onEdit={handleEditClinic}
              onToggleActive={(id) => toggleClinic.mutate(id)}
              onAssignDoctor={() => setModal("assign-doctor")}
              canAssignDoctor={canAssignDoctorToClinic}
            />

            <ClinicDoctorsList
              doctors={selectedClinic.doctorClinics}
              onAddSchedule={openScheduleModal}
              onAddOverride={openOverrideModal}
            />
          </>
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
