"use client";

import { cn } from "@shared/lib/utils";
import type { Clinic } from "@features/clinics/types/clinic.types";
import { getCapacityColor } from "@features/clinics/utils/clinic.utils";
import { Home } from "lucide-react";

interface Props {
  clinic: Clinic;
  isSelected: boolean;
  onSelect: (clinic: Clinic) => void;
  onToggleClinic?: (id: string) => void;
}

export function ClinicListItem({ clinic, isSelected, onSelect, onToggleClinic }: Props) {
  const activeDoctors = clinic.doctorClinics.filter((dc) => dc.isActive).length;
  const capColor = getCapacityColor(activeDoctors, clinic.maxDoctors);

  return (
    <div
      onClick={() => onSelect(clinic)}
      className={cn(
        "rounded-xl border p-3 cursor-pointer transition-all",
        isSelected ? "border-brand/30 bg-brand/5" : "border-border-default hover:border-brand/20 bg-bg-base hover:bg-brand/5",
        !clinic.isActive && "opacity-60",
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
              isSelected ? "bg-brand/10" : "bg-bg-subtle",
            )}
          >
            <Home size={18} strokeWidth={1.8} className="text-brand" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary leading-tight">{clinic.name}</p>
            <p className="text-[11px] text-text-secondary mt-0.5">
              {clinic.city ? `${clinic.city}, ${clinic.state}` : "Sin dirección física"}
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
              "w-9 h-5 rounded-full flex items-center px-0.5 shrink-0 mt-0.5 transition-colors cursor-pointer",
              clinic.isActive ? "bg-brand" : "bg-border-strong",
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
                clinic.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-text-secondary",
              )}
            >
              {clinic.isActive ? "Activo" : "Inactivo"}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {onToggleClinic && (
            <>
              <div className={cn("w-1.5 h-1.5 rounded-full", clinic.isActive ? "bg-emerald-500" : "bg-zinc-400")} />
              <span
                className={cn(
                  "text-[11px] font-medium",
                  clinic.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-text-secondary",
                )}
              >
                {clinic.isActive ? "Activo" : "Inactivo"}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-text-secondary">Capacidad</span>
          <span className="text-[11px] font-semibold text-text-primary">
            {activeDoctors}/{clinic.maxDoctors}
          </span>
          <span
            className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
              isSelected ? "bg-brand/10 text-brand" : "bg-bg-subtle text-text-secondary",
            )}
          >
            Médicos
          </span>
        </div>
      </div>

      {/* Barra capacidad */}
      <div className="mt-2 h-1 bg-bg-subtle rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", capColor)}
          style={{
            width: `${Math.min((activeDoctors / clinic.maxDoctors) * 100, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
