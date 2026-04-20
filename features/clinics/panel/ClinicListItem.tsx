"use client";

import { cn } from "@shared/lib/utils";
import type { Clinic } from "@features/clinics/types/clinic.types";

interface Props {
  clinic: Clinic;
  isSelected: boolean;
  onSelect: (clinic: Clinic) => void;
  onToggleClinic?: (id: string) => void;
}

export function ClinicListItem({ clinic, isSelected, onSelect, onToggleClinic }: Props) {
  const activeDoctors = clinic.doctorClinics.filter((dc) => dc.isActive).length;

  return (
    <div
      onClick={() => onSelect(clinic)}
      className={cn(
        "rounded-sm bg-fondo-inputs px-2 py-3 border-l-principal border-l-4 shadow-lg  transition-all cursor-pointer",
        isSelected ? " bg-interior" : " hover:bg-interior/80",
        !clinic.isActive && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <div>
            <p className="text-sm font-semibold text-encabezado leading-tight">{clinic.name}</p>
            <p className="text-[11px] text-subtitulo mt-0.5">
              {clinic.city ? `${clinic.city}, ${clinic.state}` : "Sin dirección"}
            </p>
          </div>
        </div>

        {/* Toggle visual */}
        {onToggleClinic ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleClinic(clinic.id);
            }}
            className={cn(
              "w-9 h-5 rounded-full flex items-center px-0.5 shrink-0 mt-0.5 transition-colors ",
              clinic.isActive ? "bg-principal" : "bg-border-strong",
            )}
          >
            <div className={cn("w-4 h-4 bg-white rounded-full transition-all", clinic.isActive && "ml-auto")} />
          </button>
        ) : (
          <div className="flex items-center gap-1 mt-1 shrink-0">
            <div className={cn("w-2 h-2 rounded-full", clinic.isActive ? "bg-emerald-500" : "bg-zinc-400")} />
            <span
              className={cn(
                "text-[11px] font-medium",
                clinic.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-subtitulo",
              )}
            >
              {clinic.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-subtitulo">
            {activeDoctors}/{clinic.maxDoctors}
          </span>
          <span
            className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
              isSelected ? "bg-inner-principal text-principal" : "bg-inner-secundario text-secundario",
            )}
          >
            Médicos
          </span>
        </div>
      </div>
    </div>
  );
}
