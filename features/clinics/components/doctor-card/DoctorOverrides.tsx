"use client";

import { cn } from "@shared/lib/utils";
import type { ScheduleOverride } from "@features/clinics/types/clinic.types";
import { useRemoveScheduleOverride } from "@features/clinics/hooks";
import { Clock, Plus, X } from "lucide-react";

interface Props {
  doctorClinicId: string;
  scheduleOverrides: ScheduleOverride[];
  canManage: boolean;
  isPaused: boolean;
  onAddOverride: (id: string) => void;
}

export function DoctorOverrides({ doctorClinicId, scheduleOverrides = [], canManage, isPaused, onAddOverride }: Props) {
  const removeOverride = useRemoveScheduleOverride();

  if (scheduleOverrides.length === 0 && !canManage) {
    return null;
  }

  return (
    <>
      <div className="pt-4 border-t border-border-default mt-4">
        {scheduleOverrides.length > 0 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Excepciones y Ajustes</p>
            </div>
            <div className="flex flex-col gap-2">
              {scheduleOverrides.map((override) => {
                let badgeColors = "bg-bg-subtle text-text-secondary border-border-default";
                let labelTexto = "";

                if (override.type === "AVAILABLE") {
                  badgeColors =
                    "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
                  labelTexto = "Día Extra";
                } else if (override.type === "UNAVAILABLE") {
                  badgeColors =
                    "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
                  labelTexto = "Inhábil";
                } else if (override.type === "CUSTOM") {
                  badgeColors =
                    "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
                  labelTexto = "Especial";
                }

                return (
                  <div
                    key={override.id}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl border group",
                      isPaused ? "opacity-60 grayscale" : "",
                      badgeColors,
                    )}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold">{override.date}</span>
                        <span className="text-[10px] uppercase font-semibold tracking-wide border px-1.5 rounded-md shadow-sm border-current/30">
                          {labelTexto}
                        </span>
                      </div>
                      {(override.type === "CUSTOM" || override.type === "AVAILABLE") &&
                        override.startTime &&
                        override.endTime && (
                          <span className="text-[11px] font-medium opacity-90 mt-0.5 flex flex-row items-center gap-1">
                            <Clock size={10} className="opacity-70" />
                            {override.startTime} — {override.endTime}
                          </span>
                        )}
                      {override.note && (
                        <span className="text-[10px] opacity-80 italic mt-0.5 max-w-[200px] truncate">
                          &quot;{override.note}&quot;
                        </span>
                      )}
                    </div>

                    {canManage && !isPaused && (
                      <button
                        onClick={() => removeOverride.mutate(override.id)}
                        disabled={removeOverride.isPending}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <X size={14} strokeWidth={2.5} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Botón para añadir Excepción en la base */}
        {canManage && (
          <div className={cn("w-full", scheduleOverrides.length > 0 && "mt-4")}>
            <button
              onClick={() => !isPaused && onAddOverride(doctorClinicId)}
              disabled={isPaused}
              className={cn(
                "flex items-center justify-center w-full gap-2 px-3 py-2 rounded-xl border border-dashed transition-all text-[12px] font-semibold cursor-pointer",
                isPaused
                  ? "border-border-default text-text-disabled cursor-not-allowed opacity-40"
                  : "border-brand/40 text-brand bg-brand/5 hover:border-brand hover:bg-brand hover:text-white",
              )}
            >
              <Plus size={14} strokeWidth={3} />
              Añadir Excepción
            </button>
          </div>
        )}
      </div>
    </>
  );
}
