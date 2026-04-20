import { useDoctorOverrides } from "../../hooks/useDoctorOverrides";
import { ConfirmDialog } from "@/shared/providers/ConfirmDialog";
import dayjs from "dayjs";
import { ScheduleOverride } from "../../types/clinic.types";
import { Plus } from "lucide-react";
import { OverrideCard } from "./OverrideCard";

interface Props {
  doctorClinicId: string;
  scheduleOverrides: ScheduleOverride[]; // Usa tu interfaz ScheduleOverride
  canManage: boolean;
  isPaused: boolean;
  onAddOverride: (id: string) => void;
}

export function DoctorOverrides({ doctorClinicId, scheduleOverrides, canManage, isPaused, onAddOverride }: Props) {
  const { activeOverrides, confirmOpen, setConfirmOpen, pendingOverride, requestDelete, confirmDelete } =
    useDoctorOverrides(scheduleOverrides);

  if (activeOverrides.length === 0 && !canManage) return null;

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-disable/20 ">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-encabezado">Excepciones</h3>
        </div>

        {canManage && (
          <button
            onClick={() => !isPaused && onAddOverride(doctorClinicId)}
            disabled={isPaused}
            className="flex items-center shadow-sm gap-2 px-4 py-2 rounded-sm bg-inner-principal dark:text-white text-principal text-xs font-bold hover:bg-principal/50  transition-all active:scale-95 disabled:opacity-30 "
          >
            <Plus size={14} strokeWidth={3} />
            Agregar
          </button>
        )}
      </div>

      {/* GRID DE CARDS */}
      <div className="grid grid-cols-1 gap-3">
        {activeOverrides.map((override) => (
          <OverrideCard
            key={override.id}
            override={override}
            isPaused={isPaused}
            canManage={canManage}
            onDelete={() => requestDelete(override.id)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Eliminar excepción"
        message={`¿Eliminar la excepción del ${dayjs(pendingOverride?.date).format("DD [de] MMMM")}?`}
        variant="danger"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
