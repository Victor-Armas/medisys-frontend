import { useState, useMemo } from "react";
import { isAxiosError } from "axios";
import { notify } from "@/shared/ui/toaster";
import { useAssignDoctorToClinic } from "@/features/clinics/hooks";
import { getFullName } from "@/features/users/types/users.types";
import type { User } from "@/features/users/types/users.types";
import { useEligibleDoctors } from "./useClinics";

interface UseAssignDoctorArgs {
  clinicId: string;
  clinicName: string;
  onClose: () => void;
}

export function useAssignDoctorModal({ clinicId, clinicName, onClose }: UseAssignDoctorArgs) {
  // 1. Estado Local
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [serverError, setServerError] = useState("");

  // 2. Infraestructura (Consultas y Mutaciones)
  //   const { data: allUsers = [] } = useUsers();
  const { data: doctors = [], isLoading } = useEligibleDoctors(clinicId);
  const assignDoctorMutation = useAssignDoctorToClinic();

  const filteredDoctors = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return doctors;

    return doctors.filter(
      (u) =>
        u.firstName.toLowerCase().includes(query) ||
        u.lastNamePaternal.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query),
    );
  }, [doctors, search]);

  // 4. Acciones (Handlers)
  const toggleDoctorSelection = (doctor: User) => {
    // Si da clic en el mismo que ya está seleccionado, lo deselecciona
    setSelectedDoctor((prev) => (prev?.id === doctor.id ? null : doctor));
    setServerError("");
  };

  const submitAssignment = async () => {
    if (!selectedDoctor?.doctorProfile) return;

    setServerError("");
    const toastId = notify.loading("Asignando médico...");

    try {
      await assignDoctorMutation.mutateAsync({
        clinicId,
        payload: { doctorProfileId: selectedDoctor.doctorProfile.id, isPrimary },
      });

      notify.success(`${getFullName(selectedDoctor)} asignado a ${clinicName}`, undefined, { id: toastId });
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        const errorMsg = Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al asignar");
        setServerError(errorMsg);
        notify.error(errorMsg, undefined, { id: toastId });
      } else {
        const fallback = "Ocurrió un error inesperado";
        setServerError(fallback);
        notify.error(fallback, undefined, { id: toastId });
      }
    }
  };

  // 5. Exponemos la API del Hook
  return {
    state: {
      search,
      selectedDoctor,
      isPrimary,
      serverError,
      filteredDoctors,
      isLoading,
      isPending: assignDoctorMutation.isPending,
    },
    actions: {
      setSearch,
      setIsPrimary,
      toggleDoctorSelection,
      submitAssignment,
    },
  };
}
