import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { notify } from "@/shared/ui/toaster";
import { useAssignDoctorProfile, useUsers } from "@/features/users/hooks/useUsers";
import { assignDoctorSchema, type AssignDoctorFormData } from "@/validations/user.schema";
import type { User } from "@/features/users/types/users.types";

interface UseAssignDoctorArgs {
  onClose: () => void;
}

export function useAssignDoctorModal({ onClose }: UseAssignDoctorArgs) {
  // 1. Estados puros (Adiós dropdownOpen y userTouched)
  const [serverError, setServerError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSearch, setUserSearch] = useState("");

  // 2. Mutaciones y Consultas
  const { mutateAsync, isPending } = useAssignDoctorProfile();
  const { data: allUsers = [] } = useUsers();

  // 3. Lógica de Filtrado
  const eligibleUsers = useMemo(() => allUsers.filter((u) => !u.doctorProfile), [allUsers]);

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return eligibleUsers;
    return eligibleUsers.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastNamePaternal.toLowerCase().includes(q) ||
        u.lastNameMaternal.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [eligibleUsers, userSearch]);

  // 4. Formulario
  const form = useForm<AssignDoctorFormData>({
    resolver: zodResolver(assignDoctorSchema),
    defaultValues: {
      professionalLicense: "",
      specialty: "",
      university: "",
      fullTitle: "",
      address: "",
      numHome: "",
      colony: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  // 5. Handlers
  function handleSelectUser(user: User) {
    setSelectedUser(user);
    form.setValue("userId", user.id, { shouldValidate: true });
    setUserSearch("");
  }

  function handleClearUser() {
    setSelectedUser(null);
    form.setValue("userId", "", { shouldValidate: true });
    setUserSearch("");
  }

  async function onSubmit(data: AssignDoctorFormData) {
    if (!selectedUser) return;
    setServerError("");
    const loadId = notify.loading("Asignando perfil médico...");
    try {
      await mutateAsync({ ...data, userId: selectedUser.id });
      notify.success("Perfil médico asignado correctamente", undefined, { id: loadId });
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        const errorMsg = Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al asignar");
        setServerError(errorMsg);
        notify.error(errorMsg, undefined, { id: loadId });
      } else {
        notify.error("Error inesperado", undefined, { id: loadId });
      }
    }
  }

  return {
    form,
    state: {
      selectedUser,
      userSearch,
      filteredUsers,
      serverError,
      isPending,
    },
    actions: {
      setUserSearch,
      handleSelectUser,
      handleClearUser,
      submitHandler: form.handleSubmit(onSubmit),
    },
  };
}
