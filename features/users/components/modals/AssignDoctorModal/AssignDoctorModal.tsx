"use client";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { notify } from "@/shared/ui/toaster";
import { cn } from "@/shared/lib/utils";
import { Dialog, DialogContent } from "@/shared/ui/dialog";
import {
  useAssignDoctorProfile,
  useUsers,
} from "@/features/users/hooks/useUsers";
import {
  assignDoctorSchema,
  type AssignDoctorFormData,
} from "@/validations/user.schema";
import { ModalHeader } from "./components/ModalHeader";
import { ModalFooter } from "./components/ModalFooter";
import { SectionUserSearch } from "./sections/SectionUserSearch";
import { SectionProfessionalData } from "./sections/SectionProfessionalData";
import { SectionAddress } from "./sections/SectionAddress";
import { User } from "@/features/users/types/users.types";

interface Props {
  onClose: () => void;
}

export function AssignDoctorModal({ onClose }: Props) {
  const [serverError, setServerError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userTouched, setUserTouched] = useState(false);

  const { mutateAsync, isPending } = useAssignDoctorProfile();
  const { data: allUsers = [] } = useUsers();

  // Solo usuarios sin perfil médico
  const eligibleUsers = useMemo(
    () => allUsers.filter((u) => !u.doctorProfile),
    [allUsers]
  );

  // Filtrado por búsqueda en memoria
  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim();
    if (!q) return eligibleUsers;
    return eligibleUsers.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastNamePaternal.toLowerCase().includes(q) ||
        u.lastNameMaternal.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [eligibleUsers, userSearch]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AssignDoctorFormData>({
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

  function handleSelectUser(user: User) {
    setSelectedUser(user);
    setValue("userId", user.id, { shouldValidate: true });
    setUserSearch("");
    setDropdownOpen(false);
  }

  function handleClearUser() {
    setSelectedUser(null);
    setValue("userId", "", { shouldValidate: true });
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

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "p-0 max-w-2xl gap-0 overflow-hidden rounded-3xl",
          "bg-white dark:bg-[#0a0a0c]",
          "border border-border-default dark:border-white/5 shadow-2xl"
        )}
      >
        <ModalHeader />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col max-h-[70vh]"
        >
          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-8 hide-scrollbar">
            <SectionUserSearch
              selectedUser={selectedUser}
              filteredUsers={filteredUsers}
              userSearch={userSearch}
              dropdownOpen={dropdownOpen}
              userTouched={userTouched}
              onSearchChange={(val) => {
                setUserSearch(val);
                setDropdownOpen(true);
              }}
              onFocus={() => {
                setUserTouched(true);
                setDropdownOpen(true);
              }}
              onSelect={handleSelectUser}
              onClear={handleClearUser}
              onDropdownClose={() => setDropdownOpen(false)}
            />

            <SectionProfessionalData register={register} errors={errors} />

            <SectionAddress register={register} errors={errors} />

            {serverError && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20">
                <p className="text-[13px] text-red-700 dark:text-red-400 font-medium">
                  {serverError}
                </p>
              </div>
            )}
          </div>

          <ModalFooter
            isPending={isPending}
            hasSelectedUser={!!selectedUser}
            onClose={onClose}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
