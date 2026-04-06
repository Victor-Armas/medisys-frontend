import { useState } from "react";
import type { Clinic, ClinicModalState, ActiveModalContext, DoctorInClinic } from "../types/clinic.types";

/**
 * Hook to manage clinic selection and modal orchestration.
 */
export function useClinicManagement(clinics: Clinic[]) {
  const [selected, setSelected] = useState<Clinic | null>(null);
  const [modal, setModal] = useState<ClinicModalState>("none");
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [modalContext, setModalContext] = useState<ActiveModalContext>({
    doctorClinicId: "",
    doctorName: "",
    doctorProfileId: "",
  });

  const activeClinic = clinics.find((c) => c.id === selected?.id) ?? clinics[0] ?? null;

  const openScheduleModal = (dc: DoctorInClinic, prefillDate?: string) => {
    setModalContext({
      doctorClinicId: dc.id,
      doctorName: `${dc.doctorProfile.user.firstName} ${dc.doctorProfile.user.lastNamePaternal}`,
      doctorProfileId: dc.doctorProfile.id,
      prefillDate,
    });
    setModal("add-schedule");
  };

  const openOverrideModal = (dc: DoctorInClinic, prefillDate?: string) => {
    setModalContext({
      doctorClinicId: dc.id,
      doctorName: `${dc.doctorProfile.user.firstName} ${dc.doctorProfile.user.lastNamePaternal}`,
      doctorProfileId: dc.doctorProfile.id,
      prefillDate,
    });
    setModal("add-override");
  };

  const closeModal = () => {
    setModal("none");
    setEditingClinic(null);
  };

  const handleEditClinic = (clinic: Clinic) => {
    setEditingClinic(clinic);
    setModal("edit-clinic");
  };

  return {
    selectedClinic: activeClinic,
    setSelected,
    modal,
    setModal,
    editingClinic,
    modalContext,
    openScheduleModal,
    openOverrideModal,
    closeModal,
    handleEditClinic,
  };
}
