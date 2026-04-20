"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Stethoscope } from "lucide-react";
import { ModalFooter } from "./components/ModalFooter";
import { SectionUserSearch } from "./sections/SectionUserSearch";
import { SectionProfessionalData } from "./sections/SectionProfessionalData";
import { SectionAddress } from "./sections/SectionAddress";
import { useAssignDoctorModal } from "../../hooks/useAssignDoctorModal";

interface Props {
  onClose: () => void;
}

export function AssignDoctorModal({ onClose }: Props) {
  // Conectamos el Cerebro (Hook)
  const { form, state, actions } = useAssignDoctorModal({ onClose });
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      {/* Añadí p-0 y gap-0 para tener control total del diseño interior */}
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden rounded-2xl">
        <DialogHeader className="px-6 py-5 bg-emerald-50/50 dark:bg-emerald-500/10 border-b border-emerald-100 dark:border-emerald-500/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg shadow-sm">
              <Stethoscope size={20} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Asignar Perfil Médico</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={actions.submitHandler} className="flex flex-col max-h-[75vh]">
          {/* Contenedor escrolleable interno */}
          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-8 hide-scrollbar bg-bg-surface">
            {/* El buscador ahora es limpio y sin estados fantasma */}
            <SectionUserSearch
              selectedUser={state.selectedUser}
              filteredUsers={state.filteredUsers}
              userSearch={state.userSearch}
              onSearchChange={actions.setUserSearch}
              onSelect={actions.handleSelectUser}
              onClear={actions.handleClearUser}
            />

            <SectionProfessionalData register={register} errors={errors} />

            <SectionAddress register={register} errors={errors} />

            {/* Manejo de errores */}
            {state.serverError && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                <p className="text-[13px] text-red-700 dark:text-red-400 font-medium">{state.serverError}</p>
              </div>
            )}
          </div>

          <ModalFooter isPending={state.isPending} hasSelectedUser={!!state.selectedUser} onClose={onClose} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
