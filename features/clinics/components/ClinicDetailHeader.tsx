"use client";

import { Pencil, UserPlus } from "lucide-react";
import type { Clinic } from "../types/clinic.types";
import { getCapacityColor } from "../utils/clinic.utils";
import { cn } from "@/shared/lib/utils";

interface Props {
  clinic: Clinic;
  canManage: boolean;
  canAssignDoctor: boolean;
  onEdit: (clinic: Clinic) => void;
  onToggleActive: (id: string) => void;
  onAssignDoctor: () => void;
}

export function ClinicDetailHeader({ clinic, canManage, canAssignDoctor, onEdit, onToggleActive, onAssignDoctor }: Props) {
  const activeDoctorsCount = clinic.doctorClinics.filter((dc) => dc.isActive).length;

  return (
    <div className="bg-bg-surface border-b border-border-default px-8 py-5 sticky top-0 z-40">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Gestión de consultorio</p>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">{clinic.name}</h1>
          <p className="text-sm text-text-secondary mt-1">
            {[clinic.address, clinic.city].filter(Boolean).join(", ")}
            {clinic.rfc && ` · RFC: ${clinic.rfc}`}
            {clinic.professionalLicense && ` · Cédula: ${clinic.professionalLicense}`}
          </p>
        </div>

        {canManage && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleActive(clinic.id)}
              className={cn(
                "px-3 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer",
                clinic.isActive
                  ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10"
                  : "border-red-500 text-red-600 hover:bg-red-500/20 bg-red-500/10",
              )}
            >
              {clinic.isActive ? "Activado" : "Desactivado"}
            </button>

            <button
              onClick={() => onEdit(clinic)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-default bg-brand text-sm text-white hover:bg-bg-subtle transition-colors cursor-pointer"
            >
              <Pencil size={14} strokeWidth={2} />
              Editar
            </button>
            {canAssignDoctor && (
              <button
                onClick={onAssignDoctor}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-brand/30 bg-brand/5 text-brand text-sm font-semibold hover:bg-brand hover:text-white transition-colors cursor-pointer"
              >
                <UserPlus size={15} strokeWidth={2} />
                Asignar médico
              </button>
            )}
          </div>
        )}

        {!canManage && (
          <div className="flex items-center gap-2 shrink-0">
            <div className={cn("w-2 h-2 rounded-full", clinic.isActive ? "bg-emerald-500" : "bg-zinc-400")} />
            <span
              className={cn(
                "text-sm font-medium",
                clinic.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-text-secondary",
              )}
            >
              {clinic.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-xs text-text-secondary">Capacidad</span>
        <div className="flex-1 max-w-xs h-1.5 bg-bg-subtle rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", getCapacityColor(activeDoctorsCount, clinic.maxDoctors))}
            style={{
              width: `${Math.min((activeDoctorsCount / clinic.maxDoctors) * 100, 100)}%`,
            }}
          />
        </div>
        <span className="text-xs font-semibold text-text-primary">
          {activeDoctorsCount} / {clinic.maxDoctors} médicos
        </span>
        {clinic.brandColor && (
          <>
            <div className="w-px h-4 bg-border-default" />
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-text-secondary">Color marca</span>
              <div className="w-4 h-4 rounded border border-border-default" style={{ backgroundColor: clinic.brandColor }} />
              <span className="text-xs font-mono text-text-secondary">{clinic.brandColor}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
