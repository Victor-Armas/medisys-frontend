"use client";

import { useState, useMemo } from "react";
import { isAxiosError } from "axios";
import { Search, ChevronDown, X, CheckCircle2, Stethoscope } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { notify } from "@/shared/ui/toaster";
import { useUsers } from "@/features/users/hooks/useUsers";
import { getRoleConfig } from "@/shared/constants/roles";
import { getFullName, getInitials } from "@/features/users/types/users.types";
import type { User } from "@/features/users/types/users.types";
import { useAssignDoctorToClinic } from "@/features/clinics/hooks";

interface Props {
  clinicId: string;
  clinicName: string;
  onClose: () => void;
}

export function AssignDoctorToClinicModal({ clinicId, clinicName, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdown] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [serverError, setServerError] = useState("");

  const { data: allUsers = [] } = useUsers();
  const assignDoctor = useAssignDoctorToClinic();

  // Only doctors with a doctorProfile are eligible
  const eligibleDoctors = useMemo(
    () => allUsers.filter((u) => (u.role === "DOCTOR" || u.role === "MAIN_DOCTOR") && u.doctorProfile !== null && u.isActive),
    [allUsers],
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return eligibleDoctors;
    return eligibleDoctors.filter(
      (u) =>
        u.firstName.toLowerCase().includes(q) ||
        u.lastNamePaternal.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [eligibleDoctors, search]);

  async function handleSubmit() {
    if (!selected?.doctorProfile) return;
    setServerError("");
    const loadId = notify.loading("Asignando médico...");
    try {
      await assignDoctor.mutateAsync({
        clinicId,
        payload: { doctorProfileId: selected.doctorProfile.id, isPrimary },
      });
      notify.success(`${getFullName(selected)} asignado a ${clinicName}`, undefined, { id: loadId });
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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg p-0 gap-0 rounded-2xl overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-border-default">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
              <Stethoscope size={20} className="text-brand" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-text-primary">Asignar médico</DialogTitle>
              <DialogDescription className="text-xs text-text-secondary mt-0.5">{clinicName}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5">
          {/* Doctor selector */}
          <div>
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">Selecciona un médico</p>

            {selected ? (
              /* Selected card */
              <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-brand/30 bg-brand/5">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
                    getRoleConfig(selected.role).gradient,
                    "bg-linear-to-br",
                  )}
                >
                  {getInitials(selected)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{getFullName(selected)}</p>
                  <p className="text-xs text-text-secondary truncate">
                    {selected.doctorProfile?.specialty ?? "Sin especialidad"} · {selected.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-brand" />
                  <button
                    type="button"
                    onClick={() => setSelected(null)}
                    className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              /* Search dropdown */
              <div className="relative">
                <Input
                  label="Buscar por nombre o email"
                  icon={Search}
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setDropdown(true);
                  }}
                  onFocus={() => setDropdown(true)}
                  autoComplete="off"
                  rightElement={
                    search ? (
                      <button type="button" onClick={() => setSearch("")}>
                        <X size={13} className="text-text-disabled" />
                      </button>
                    ) : (
                      <ChevronDown size={13} className="text-text-disabled" />
                    )
                  }
                />

                {dropdownOpen && (
                  <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-bg-surface border border-border-default rounded-2xl shadow-xl overflow-hidden">
                    {filtered.length === 0 ? (
                      <p className="text-sm text-text-secondary text-center py-6">
                        {search ? "Sin resultados" : "No hay médicos disponibles"}
                      </p>
                    ) : (
                      <ul className="max-h-52 overflow-y-auto p-1 divide-y divide-border-default/50">
                        {filtered.map((doctor) => {
                          const config = getRoleConfig(doctor.role);
                          return (
                            <li key={doctor.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelected(doctor);
                                  setDropdown(false);
                                  setSearch("");
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-bg-subtle transition-colors group"
                              >
                                <div
                                  className={cn(
                                    "w-9 h-9 rounded-full bg-linear-to-br flex items-center justify-center text-white text-xs font-bold shrink-0",
                                    config.gradient,
                                  )}
                                >
                                  {getInitials(doctor)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-text-primary truncate group-hover:text-brand">
                                    {getFullName(doctor)}
                                  </p>
                                  <p className="text-xs text-text-secondary truncate">
                                    {doctor.doctorProfile?.specialty ?? "Sin especialidad"} · {doctor.email}
                                  </p>
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* isPrimary toggle */}
          {selected && (
            <div
              className="flex items-center justify-between p-3 rounded-xl border border-border-default bg-bg-subtle cursor-pointer"
              onClick={() => setIsPrimary((p) => !p)}
            >
              <div>
                <p className="text-sm font-medium text-text-primary">Consultorio principal</p>
                <p className="text-xs text-text-secondary mt-0.5">Marca este consultorio como sede base del médico</p>
              </div>
              <div
                className={cn(
                  "w-9 h-5 rounded-full flex items-center px-0.5 transition-colors",
                  isPrimary ? "bg-brand" : "bg-border-strong",
                )}
              >
                <div className={cn("w-4 h-4 bg-white rounded-full transition-all", isPrimary && "ml-auto")} />
              </div>
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <p className="text-xs text-red-500 font-medium p-3 bg-red-50 dark:bg-red-500/10 rounded-xl">{serverError}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:bg-bg-subtle transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selected || assignDoctor.isPending}
              className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {assignDoctor.isPending ? "Asignando..." : "Asignar médico"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
