"use client";

import { useState } from "react";
import { useClinics, useToggleClinic } from "@features/clinics/hooks";
import type { ActiveModalContext, Clinic, ClinicModalState, DoctorInClinic } from "@features/clinics/types/clinic.types";
import { ClinicListItem } from "./ClinicListItem";
import { ClinicFormModal } from "./modals/ClinicFormModal";
import { AddScheduleModal } from "./modals/AddScheduleModal";
import { getCapacityColor } from "@features/clinics/utils/clinic.utils";
import { cn } from "@shared/lib/utils";
import { DoctorScheduleCard } from "./DoctorScheduleCard";
import { Pencil, Plus, Users } from "lucide-react";
import { AddOverrideModal } from "./modals/AddOverrideModal";

interface Props {
  initialClinics: Clinic[];
}

export function ClinicsPanelClient({ initialClinics }: Props) {
  const { data: clinics = initialClinics, isLoading } = useClinics();
  const toggleClinic = useToggleClinic();
  const [selected, setSelected] = useState<Clinic | null>(null);
  const [modal, setModal] = useState<ClinicModalState>("none");
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [modalContext, setModalContext] = useState<ActiveModalContext>({
    doctorClinicId: "",
    doctorName: "",
    doctorProfileId: "",
  });

  const activeClinic = clinics.find((c) => c.id === selected?.id) ?? clinics[0] ?? null;

  function openScheduleModal(dc: DoctorInClinic, prefillDate?: string) {
    setModalContext({
      doctorClinicId: dc.id,
      doctorName: `${dc.doctorProfile.user.firstName} ${dc.doctorProfile.user.lastNamePaternal}`,
      doctorProfileId: dc.doctorProfile.id,
      prefillDate,
    });
    setModal("add-schedule");
  }

  function openOverrideModal(dc: DoctorInClinic, prefillDate?: string) {
    setModalContext({
      doctorClinicId: dc.id,
      doctorName: `${dc.doctorProfile.user.firstName} ${dc.doctorProfile.user.lastNamePaternal}`,
      doctorProfileId: dc.doctorProfile.id,
      prefillDate,
    });
    setModal("add-override");
  }

  function closeModal() {
    setModal("none");
    setEditingClinic(null);
  }

  function handleEditClinic(clinic: Clinic) {
    setEditingClinic(clinic);
    setModal("edit-clinic");
  }

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
      <aside className="w-72 shrink-0 border-r border-border-default bg-bg-surface flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border-default">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Consultorios</h2>
            <p className="text-[11px] text-text-secondary mt-0.5">{clinics.length} registrados</p>
          </div>
          <button
            onClick={() => setModal("create-clinic")}
            className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white hover:bg-brand-hover transition-colors cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
          {clinics.map((clinic) => (
            <ClinicListItem
              key={clinic.id}
              clinic={clinic}
              toggleClinic={toggleClinic.mutate}
              isSelected={activeClinic?.id === clinic.id}
              onSelect={setSelected}
            />
          ))}
        </div>
      </aside>

      {/* ── Panel derecho ── */}
      <main className="flex-1 overflow-y-auto bg-bg-base">
        {!activeClinic ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-text-secondary">Selecciona un consultorio</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-bg-surface border-b border-border-default px-8 py-5 sticky top-0 z-40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">
                    Gestión de consultorio
                  </p>
                  <h1 className="text-2xl font-bold text-text-primary tracking-tight">{activeClinic.name}</h1>
                  <p className="text-sm text-text-secondary mt-1">
                    {[activeClinic.address, activeClinic.city].filter(Boolean).join(", ")}
                    {activeClinic.rfc && ` · RFC: ${activeClinic.rfc}`}
                    {activeClinic.professionalLicense && ` · Cédula: ${activeClinic.professionalLicense}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleClinic.mutate(activeClinic.id)}
                    className={cn(
                      "px-3 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer",
                      activeClinic.isActive
                        ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10"
                        : "border-red-500 text-red-600 hover:bg-red-500/20 bg-red-500/10",
                    )}
                  >
                    {activeClinic.isActive ? "Activado" : "Desactivado"}
                  </button>

                  <button
                    onClick={() => handleEditClinic(activeClinic)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-default bg-brand text-sm text-white hover:bg-bg-subtle transition-colors cursor-pointer"
                  >
                    <Pencil size={14} strokeWidth={2} />
                    Editar
                  </button>
                </div>
              </div>

              {/* Barra capacidad + color */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs text-text-secondary">Capacidad</span>
                <div className="flex-1 max-w-xs h-1.5 bg-bg-subtle rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      getCapacityColor(activeClinic.doctorClinics.filter((dc) => dc.isActive).length, activeClinic.maxDoctors),
                    )}
                    style={{
                      width: `${Math.min((activeClinic.doctorClinics.filter((dc) => dc.isActive).length / activeClinic.maxDoctors) * 100, 100)}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-text-primary">
                  {activeClinic.doctorClinics.filter((dc) => dc.isActive).length} / {activeClinic.maxDoctors} médicos
                </span>
                {activeClinic.brandColor && (
                  <>
                    <div className="w-px h-4 bg-border-default" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-text-secondary">Color marca</span>
                      <div
                        className="w-4 h-4 rounded border border-border-default"
                        style={{ backgroundColor: activeClinic.brandColor }}
                      />
                      <span className="text-xs font-mono text-text-secondary">{activeClinic.brandColor}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Lista de médicos */}
            <div className="px-8 py-6 space-y-4">
              {activeClinic.doctorClinics.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center mb-3">
                    <Users size={22} strokeWidth={1.5} className="text-text-disabled" />
                  </div>
                  <p className="text-sm font-medium text-text-secondary">Sin médicos asignados</p>
                  <p className="text-xs text-text-disabled mt-1">Agrega un médico para comenzar a gestionar horarios</p>
                </div>
              ) : (
                activeClinic.doctorClinics.map((dc) => (
                  <DoctorScheduleCard
                    key={dc.id}
                    doctorClinic={dc}
                    canManage={true}
                    onAddSchedule={(_, prefillDate) => openScheduleModal(dc, prefillDate)}
                    onAddOverride={(_, prefillDate) => openOverrideModal(dc, prefillDate)}
                  />
                ))
              )}
            </div>
          </>
        )}
      </main>

      {/* ── Modales ── */}
      {modal === "create-clinic" && <ClinicFormModal onClose={() => setModal("none")} />}
      {modal === "edit-clinic" && editingClinic && (
        <ClinicFormModal
          clinic={editingClinic}
          onClose={() => {
            setModal("none");
            setEditingClinic(null);
          }}
        />
      )}

      {modal === "create-clinic" && <ClinicFormModal onClose={closeModal} />}
      {modal === "edit-clinic" && editingClinic && <ClinicFormModal clinic={editingClinic} onClose={closeModal} />}
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
