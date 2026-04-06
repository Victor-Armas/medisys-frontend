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

interface Props {
  initialClinics: Clinic[];
}

export function ClinicsPanelClient({ initialClinics }: Props) {
  const { data: clinics = initialClinics, isLoading } = useClinics();
  const toggleClinic = useToggleClinic();

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

  return (
    <div className="flex h-full gap-0 overflow-hidden">
      {/* ── Panel izquierdo ── */}
      <ClinicSidebar
        clinics={clinics}
        activeClinicId={selectedClinic?.id}
        onSelect={setSelected}
        onAddClinic={() => setModal("create-clinic")}
        onToggleClinic={(id) => toggleClinic.mutate(id)}
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
              onEdit={handleEditClinic}
              onToggleActive={(id) => toggleClinic.mutate(id)}
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
      {modal === "create-clinic" && <ClinicFormModal onClose={closeModal} />}
      {modal === "edit-clinic" && editingClinic && (
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
    </div>
  );
}
