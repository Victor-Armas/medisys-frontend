"use client";

import { useState } from "react";
import { cn } from "@shared/lib/utils";
import type { ScheduleOverride } from "@features/clinics/types/clinic.types";
import { useRemoveScheduleOverride } from "@features/clinics/hooks";
import { Clock, Plus, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/shared/providers/ConfirmDialog";
import dayjs from "@/shared/utils/date.utils";
import { formatDate } from "@/shared/utils/date.utils";

// ─── Constants ────────────────────────────────────────────────────────────────

import { OVERRIDE_CONFIG } from "../../constants/calendar.constants";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  doctorClinicId: string;
  scheduleOverrides: ScheduleOverride[];
  canManage: boolean;
  isPaused: boolean;
  onAddOverride: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DoctorOverrides({ doctorClinicId, scheduleOverrides = [], canManage, isPaused, onAddOverride }: Props) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const removeOverride = useRemoveScheduleOverride();

  if (scheduleOverrides.length === 0 && !canManage) return null;

  const todayMX = dayjs().tz("America/Mexico_City").startOf("day");

  const formattedOverrides = scheduleOverrides
    .filter((override) => {
      const overrideDate = dayjs.tz(override.date, "America/Mexico_City").startOf("day");
      return !overrideDate.isBefore(todayMX); // solo fechas >= hoy
    })
    .map((override) => ({
      ...override,
      formattedDate: formatDate(override.date),
    }))
    .sort((a, b) => dayjs(a.date).unix() - dayjs(b.date).unix());
  const pendingOverride = formattedOverrides.find((o) => o.id === pendingId);
  const confirmMessage = pendingOverride ? `¿Deseas eliminar la excepción del ${pendingOverride.date}?` : "";

  function handleRequestDelete(id: string) {
    setPendingId(id);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!pendingId) return;
    await removeOverride.mutateAsync(pendingId);
    setConfirmOpen(false);
    setPendingId(null);
  }

  return (
    <>
      <div className="pt-2 border-t border-border-default">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
            Excepciones y ajustes
            {formattedOverrides.length > 0 && (
              <span className="ml-1 px-1 py-0.5 rounded bg-bg-subtle text-text-secondary font-semibold text-[10px]">
                {formattedOverrides.length}
              </span>
            )}
          </p>

          {canManage && (
            <button
              onClick={() => !isPaused && onAddOverride(doctorClinicId)}
              disabled={isPaused}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg border text-[11px] font-semibold transition-all cursor-pointer",
                isPaused
                  ? "border-border-default text-text-disabled cursor-not-allowed opacity-40"
                  : "border-brand/30 text-brand bg-brand/5 hover:bg-brand hover:text-white hover:border-brand",
              )}
            >
              <Plus size={12} strokeWidth={3} />
              Añadir
            </button>
          )}
        </div>

        {/* Overrides grid */}
        {formattedOverrides.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formattedOverrides.map((override) => {
              const config = OVERRIDE_CONFIG[override.type];
              const hasTime =
                (override.type === "CUSTOM" || override.type === "AVAILABLE") && override.startTime && override.endTime;

              return (
                <div
                  key={override.id}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-medium group",
                    isPaused ? "opacity-50 grayscale pointer-events-none" : "",
                    config.badge,
                  )}
                >
                  <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)} />

                  <span className="whitespace-nowrap font-bold">{override.formattedDate}</span>

                  <span className="uppercase px-1 rounded-full text-[9px] font-semibold">{config.label}</span>

                  {hasTime && (
                    <span className="flex items-center gap-1 text-[9px] opacity-80">
                      <Clock size={10} />
                      {override.startTime}-{override.endTime}
                    </span>
                  )}

                  {override.note && <span className="italic opacity-70 max-w-[80px] truncate">{override.note}</span>}

                  {canManage && (
                    <button
                      onClick={() => handleRequestDelete(override.id)}
                      disabled={removeOverride.isPending && pendingId === override.id}
                      className="opacity-0 group-hover:opacity-100 p-1 cursor-pointer rounded-full hover:bg-red-500/10 text-red-500 transition-all"
                    >
                      <Trash2 size={12} strokeWidth={2} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          setConfirmOpen(open);
          if (!open) setPendingId(null);
        }}
        title="Eliminar excepción"
        message={confirmMessage}
        variant="danger"
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
