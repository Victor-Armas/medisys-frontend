"use client";

import { cn } from "@shared/lib/utils";
import type {
  DoctorInClinic,
  ScheduleRange,
} from "@features/clinics/types/clinic.types";
import { WEEK_DAYS } from "@features/clinics/utils/clinic.utils";
import { useRemoveSchedule } from "@features/clinics/hooks";
import { Plus, X } from "lucide-react";

interface Props {
  doctorClinicId: string;
  scheduleRanges: ScheduleRange[];
  canManage: boolean;
  isPaused: boolean;
  onAddSchedule: (id: string) => void;
}

export function DoctorWeeklyBlocks({
  doctorClinicId,
  scheduleRanges,
  canManage,
  isPaused,
  onAddSchedule,
}: Props) {
  const removeSchedule = useRemoveSchedule();

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Bloques semanales
        </p>
        {scheduleRanges.length > 0 && canManage && (
          <button className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors cursor-pointer">
            Limpiar todo
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {scheduleRanges.map((schedule) => (
          <div
            key={schedule.id}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl border group",
              isPaused
                ? "bg-bg-subtle border-border-default opacity-60"
                : "bg-brand/10 border-brand/20 text-brand",
            )}
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[11px] font-bold px-2 py-0.5 rounded-md",
                    isPaused
                      ? "text-text-secondary bg-bg-base"
                      : "text-brand bg-brand/15",
                  )}
                >
                  {WEEK_DAYS[schedule.weekDay]}
                </span>
                <span
                  className={cn(
                    "text-[12px] font-medium",
                    isPaused ? "text-text-secondary" : "text-text-primary",
                  )}
                >
                  {schedule.startTime} — {schedule.endTime}
                </span>
              </div>
              {schedule.dateFrom && schedule.dateTo && (
                <span
                  className={cn(
                    "text-[10px] mt-1 shrink-0",
                    isPaused ? "text-text-disabled" : "text-text-secondary",
                  )}
                >
                  Vigencia: {schedule.dateFrom} al {schedule.dateTo}
                </span>
              )}
            </div>
            {canManage && !isPaused && (
              <button
                onClick={() => removeSchedule.mutate(schedule.id)}
                disabled={removeSchedule.isPending}
                className="opacity-0 group-hover:opacity-100 ml-auto mt-0.5 self-start text-text-secondary hover:text-red-500 transition-all cursor-pointer"
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        ))}

        {/* Botón agregar bloque */}
        {canManage && (
          <button
            onClick={() => !isPaused && onAddSchedule(doctorClinicId)}
            disabled={isPaused}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed transition-all text-[12px] font-medium cursor-pointer shrink-0",
              isPaused
                ? "border-border-default text-text-disabled cursor-not-allowed opacity-40"
                : "border-border-strong text-text-secondary hover:border-brand hover:text-brand hover:bg-brand/5",
            )}
          >
            <Plus size={13} strokeWidth={4} />
            Agregar bloque
          </button>
        )}
      </div>
    </div>
  );
}
