"use client";

import { Search, CheckCircle2, Stethoscope } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { cn } from "@/shared/lib/utils";
import { getRoleConfig } from "@/shared/constants/roles";
import { getFullName, getInitials } from "@/features/users/types/users.types";
import { useAssignDoctorModal } from "@/features/clinics/hooks/useAssignDoctorModal";
import { Input } from "@/shared/ui/input";
import { ECGLoader } from "@/shared/ui/ECGLoader";
import { Button } from "@/shared/ui/button";

interface Props {
  clinicId: string;
  clinicName: string;
  onClose: () => void;
}

export function AssignDoctorToClinicModal({ clinicId, clinicName, onClose }: Props) {
  const { state, actions } = useAssignDoctorModal({ clinicId, clinicName, onClose });

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 gap-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-5 bg-interior ">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-inner-principal flex items-center justify-center shrink-0">
              <Stethoscope size={20} className="text-principal" />
            </div>
            <div>
              <DialogTitle className="font-semibold text-encabezado">Asignar médico</DialogTitle>
              <DialogDescription className="text-xs text-subtitulo mt-0.5">{clinicName}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 flex flex-col gap-5 ">
          {/* Buscador y Lista Integrada */}
          <div className="flex flex-col gap-3">
            <Input
              label="Buscar médico por nombre o email"
              icon={Search}
              value={state.search}
              onChange={(e) => actions.setSearch(e.target.value)}
              autoComplete="off"
            />

            {state.isLoading && <ECGLoader />}
            {/* Contenedor con Scroll: Adiós problemas de z-index y overflow */}
            <div className="max-h-48 overflow-y-auto rounded-sm bg-fondo-inputs p-1 space-y-1 shadow-sm">
              {state.filteredDoctors.length === 0 ? (
                <p className="text-sm text-subtitulo text-center py-6">
                  {state.search ? "No se encontraron resultados" : "No hay médicos disponibles"}
                </p>
              ) : (
                state.filteredDoctors.map((doctor) => {
                  const isSelected = state.selectedDoctor?.id === doctor.id;
                  const config = getRoleConfig(doctor.role);

                  return (
                    <button
                      key={doctor.id}
                      type="button"
                      onClick={() => actions.toggleDoctorSelection(doctor)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border-2",
                        isSelected ? "border-principal bg-principal/5" : "border-transparent hover:bg-subtitulo/10",
                      )}
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
                          config.badge,
                        )}
                      >
                        {getInitials(doctor)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-semibold truncate", isSelected ? "text-principal" : "text-encabezado")}>
                          {getFullName(doctor)}
                        </p>
                        <p className="text-xs text-subtitulo truncate">
                          {doctor.doctorProfile?.specialty ?? "Sin especialidad"} · {doctor.email}
                        </p>
                      </div>
                      {isSelected && <CheckCircle2 size={18} className="text-principal shrink-0" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Toggle Sede Principal */}
          {state.selectedDoctor && (
            <div
              className="flex items-center justify-between p-3.5 rounded-xl border bg-white dark:bg-zinc-900 cursor-pointer hover:border-principal/50 transition-colors"
              onClick={() => actions.setIsPrimary(!state.isPrimary)}
            >
              <div>
                <p className="text-sm font-medium text-encabezado">Consultorio principal</p>
                <p className="text-xs text-subtitulo mt-0.5">Asignar como sede base del médico</p>
              </div>
              <div
                className={cn(
                  "w-10 h-6 rounded-full flex items-center px-0.5 transition-colors",
                  state.isPrimary ? "bg-principal" : "bg-border-strong",
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 bg-white rounded-full transition-transform shadow-sm",
                    state.isPrimary && "translate-x-4",
                  )}
                />
              </div>
            </div>
          )}

          {/* Manejo de Errores */}
          {state.serverError && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">{state.serverError}</p>
            </div>
          )}

          {/* Acciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Button variant="cancelar" type="button" className="py-2" onClick={onClose} disabled={state.isPending}>
              Cancelar
            </Button>
            <Button
              variant="primary2"
              type="button"
              className="py-2"
              onClick={actions.submitAssignment}
              disabled={!state.selectedDoctor || state.isPending}
            >
              {state.isPending ? "Asignando..." : "Asignar médico"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
