"use client";

import { useState } from "react";
import { useClinics, useToggleClinic } from "@features/clinics/hooks";
import type {
  Clinic,
  ClinicModalState,
} from "@features/clinics/types/clinic.types";
import { ClinicListItem } from "./ClinicListItem";

import { ClinicFormModal } from "./modals/ClinicFormModal";
import { AddScheduleModal } from "./modals/AddScheduleModal";
import { getCapacityColor } from "@features/clinics/utils/clinic.utils";
import { cn } from "@shared/lib/utils";
import { DoctorScheduleCard } from "./DoctorScheduleCard";
import { Pencil, Plus, Users } from "lucide-react";

interface Props {
  initialClinics: Clinic[];
}

export function ClinicsPanelClient({ initialClinics }: Props) {
  const { data: clinics = initialClinics, isLoading } = useClinics();
  const toggleClinic = useToggleClinic();

  const [selected, setSelected] = useState<Clinic | null>(null);
  const [modal, setModal] = useState<ClinicModalState>("none");
  const [editingClinic, setEditingClinic] = useState<Clinic | null>(null);
  const [addScheduleDoctorClinicId, setAddScheduleDoctorClinicId] =
    useState<string>("");
  const [addScheduleDoctorName, setAddScheduleDoctorName] =
    useState<string>("");

  const activeClinic =
    clinics.find((c) => c.id === selected?.id) ?? clinics[0] ?? null;

  function handleAddSchedule(doctorClinicId: string, doctorName: string) {
    setAddScheduleDoctorClinicId(doctorClinicId);
    setAddScheduleDoctorName(doctorName);
    setModal("add-schedule");
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
            <h2 className="text-sm font-semibold text-text-primary">
              Consultorios
            </h2>
            <p className="text-[11px] text-text-secondary mt-0.5">
              {clinics.length} registrados
            </p>
          </div>
          <button
            onClick={() => setModal("create-clinic")}
            className="w-8 h-8 rounded-xl bg-brand flex items-center justify-center text-white hover:bg-brand-hover transition-colors"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-1 px-2">
          {clinics.map((clinic) => (
            <ClinicListItem
              key={clinic.id}
              clinic={clinic}
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
            <p className="text-sm text-text-secondary">
              Selecciona un consultorio
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bg-bg-surface border-b border-border-default px-8 py-5 sticky top-0 z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">
                    Gestión de consultorio
                  </p>
                  <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                    {activeClinic.name}
                  </h1>
                  <p className="text-sm text-text-secondary mt-1">
                    {[activeClinic.address, activeClinic.city]
                      .filter(Boolean)
                      .join(", ")}
                    {activeClinic.rfc && ` · RFC: ${activeClinic.rfc}`}
                    {activeClinic.professionalLicense &&
                      ` · Cédula: ${activeClinic.professionalLicense}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleClinic.mutate(activeClinic.id)}
                    disabled={toggleClinic.isPending}
                    className={cn(
                      "px-3 py-2 rounded-xl border text-sm font-medium transition-colors",
                      activeClinic.isActive
                        ? "border-border-default text-text-secondary hover:bg-bg-subtle"
                        : "border-emerald-500/30 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10"
                    )}
                  >
                    {activeClinic.isActive ? "Desactivar" : "Activar"}
                  </button>
                  <button
                    onClick={() => handleEditClinic(activeClinic)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-default bg-bg-surface text-sm text-text-primary hover:bg-bg-subtle transition-colors"
                  >
                    <Pencil size={14} strokeWidth={2} />
                    Editar
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand text-white text-sm font-medium hover:bg-brand-hover transition-colors shadow-sm">
                    <Plus size={14} strokeWidth={2.5} />
                    Agregar médico
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
                      getCapacityColor(
                        activeClinic.doctorClinics.filter((dc) => dc.isActive)
                          .length,
                        activeClinic.maxDoctors
                      )
                    )}
                    style={{
                      width: `${Math.min(
                        (activeClinic.doctorClinics.filter((dc) => dc.isActive)
                          .length /
                          activeClinic.maxDoctors) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-text-primary">
                  {
                    activeClinic.doctorClinics.filter((dc) => dc.isActive)
                      .length
                  }{" "}
                  / {activeClinic.maxDoctors} médicos
                </span>
                {activeClinic.brandColor && (
                  <>
                    <div className="w-px h-4 bg-border-default" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-text-secondary">
                        Color marca
                      </span>
                      <div
                        className="w-4 h-4 rounded border border-border-default"
                        style={{ backgroundColor: activeClinic.brandColor }}
                      />
                      <span className="text-xs font-mono text-text-secondary">
                        {activeClinic.brandColor}
                      </span>
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
                    <Users
                      size={22}
                      strokeWidth={1.5}
                      className="text-text-disabled"
                    />
                  </div>
                  <p className="text-sm font-medium text-text-secondary">
                    Sin médicos asignados
                  </p>
                  <p className="text-xs text-text-disabled mt-1">
                    Agrega un médico para comenzar a gestionar horarios
                  </p>
                </div>
              ) : (
                activeClinic.doctorClinics.map((dc) => {
                  const { firstName, lastNamePaternal } = dc.doctorProfile.user;
                  return (
                    <DoctorScheduleCard
                      key={dc.id}
                      doctorClinic={dc}
                      canManage={true}
                      onAddSchedule={(dcId) =>
                        handleAddSchedule(
                          dcId,
                          `${firstName} ${lastNamePaternal}`
                        )
                      }
                    />
                  );
                })
              )}
            </div>
          </>
        )}
      </main>

      {/* ── Modales ── */}
      {modal === "create-clinic" && (
        <ClinicFormModal onClose={() => setModal("none")} />
      )}
      {modal === "edit-clinic" && editingClinic && (
        <ClinicFormModal
          clinic={editingClinic}
          onClose={() => {
            setModal("none");
            setEditingClinic(null);
          }}
        />
      )}
      {modal === "add-schedule" && (
        <AddScheduleModal
          doctorClinicId={addScheduleDoctorClinicId}
          doctorName={addScheduleDoctorName}
          onClose={() => setModal("none")}
        />
      )}
    </div>
  );
}
