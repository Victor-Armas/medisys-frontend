"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { es } from "date-fns/locale";

import { useAddScheduleOverride } from "@features/clinics/hooks";
import { createScheduleOverrideSchema, type CreateScheduleOverrideFormData } from "@features/clinics/validations/clinic.schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { Info, Check, Ban, Clock } from "lucide-react";

// Utils format to YYYY-MM-DD
function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

interface Props {
  doctorClinicId: string;
  doctorName: string;
  prefillDate?: string;
  onClose: () => void;
}

const OVERRIDE_TYPES = [
  {
    value: "UNAVAILABLE",
    label: "Día Inhábil",
    description: "No trabajará este día (vacaciones, descanso)",
    icon: Ban,
    color: "text-red-500 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20",
  },
  {
    value: "CUSTOM",
    label: "Horario Especial",
    description: "Trabajará pero en un horario distinto",
    icon: Clock,
    color: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20",
  },
  {
    value: "AVAILABLE",
    label: "Día Extra",
    description: "Trabajará un día que normalmente es de descanso",
    icon: Check,
    color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
  },
] as const;

export function AddOverrideModal({ doctorClinicId, doctorName, prefillDate, onClose }: Props) {
  const [serverError, setServerError] = useState("");
  const addOverride = useAddScheduleOverride();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CreateScheduleOverrideFormData>({
    resolver: zodResolver(createScheduleOverrideSchema),
    defaultValues: {
      type: "UNAVAILABLE",
      date: prefillDate ? new Date(prefillDate + "T00:00:00Z") : undefined,
    },
  });

  const selectedType = watch("type");

  async function onSubmit(data: CreateScheduleOverrideFormData) {
    setServerError("");
    try {
      if (!data.date) {
        setServerError("Debes seleccionar una fecha en el calendario");
        return;
      }

      const payload = {
        doctorClinicId,
        date: formatDateToISO(data.date),
        type: data.type,
        startTime: data.startTime,
        endTime: data.endTime,
        note: data.note || undefined,
      };

      await addOverride.mutateAsync(payload);
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setServerError(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al agregar la excepción"));
      }
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[850px] w-[95vw] p-0 gap-0 rounded-2xl overflow-hidden md:max-h-[85vh]">
        <DialogHeader className="px-6 py-5 border-b border-border-default shrink-0">
          <DialogTitle className="text-base font-semibold text-text-primary">Agregar Excepción de Horario (Día Festivo / Especial)</DialogTitle>
          <DialogDescription className="text-xs text-text-secondary mt-1">{doctorName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(85vh-81px)]">
          {/* Lado Izquierdo: Configuración */}
          <div className="flex-1 px-6 py-5 space-y-6 md:border-r border-border-default overflow-y-auto">
            {/* Instrucciones rápidas */}
            <div className="flex gap-3 p-3.5 bg-brand/5 border border-brand/20 rounded-xl items-start">
              <Info className="text-brand shrink-0 mt-0.5" size={16} strokeWidth={2.5} />
              <div className="text-xs text-text-secondary leading-relaxed space-y-1">
                <p className="font-semibold text-text-primary">¿Cómo funcionan las excepciones?</p>
                <p>
                  Las excepciones tienen prioridad sobre los horarios semanales normales. Úsalas para: marcar días festivos, vacaciones, o días donde el horario
                  cambia por una única vez.
                </p>
              </div>
            </div>

            {/* Tipo de excepción */}
            <div>
              <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-3">1. ¿Qué tipo de excepción es?</p>
              <div className="flex flex-col gap-2">
                {OVERRIDE_TYPES.map((typeOption) => {
                  const isSelected = selectedType === typeOption.value;
                  const Icon = typeOption.icon;
                  return (
                    <button
                      key={typeOption.value}
                      type="button"
                      onClick={() => setValue("type", typeOption.value)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer",
                        isSelected
                          ? cn("border-transparent shadow-sm ring-1 ring-inset ring-brand", typeOption.color)
                          : "border-border-default bg-bg-subtle hover:bg-bg-base",
                      )}
                    >
                      <div className={cn("p-1.5 rounded-lg shrink-0", isSelected ? "bg-white/50" : "bg-bg-surface")}>
                        <Icon size={16} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className={cn("text-xs font-semibold", isSelected ? "text-text-primary" : "text-text-primary")}>{typeOption.label}</p>
                        <p className={cn("text-[11px]", isSelected ? "text-text-primary/70" : "text-text-secondary")}>{typeOption.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Horas (CUSTOM y AVAILABLE) */}
            {(selectedType === "CUSTOM" || selectedType === "AVAILABLE") && (
              <div className="p-4 bg-bg-subtle border border-border-default rounded-xl">
                <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-3">Rango de horas</p>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Hora inicio" type="time" error={errors.startTime?.message} {...register("startTime")} />
                  <Input label="Hora fin" type="time" error={errors.endTime?.message} {...register("endTime")} />
                </div>
              </div>
            )}

            {/* Nota opcional */}
            <div>
              <Input
                label="Nota o Motivo (Opcional)"
                placeholder="Ej. Vacaciones de verano, Congreso médico..."
                error={errors.note?.message}
                {...register("note")}
              />
            </div>

            {serverError && <p className="text-xs text-red-500 font-medium p-3 bg-red-50 dark:bg-red-500/10 rounded-xl">{serverError}</p>}

            <div className="flex gap-3 pt-4 border-t border-border-default shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:bg-bg-subtle transition-colors cursor-pointer font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={addOverride.isPending}
                className="flex-[1.5] py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-60 cursor-pointer"
              >
                {addOverride.isPending ? "Guardando..." : "Guardar Excepción"}
              </button>
            </div>
          </div>

          {/* Lado Derecho: Calendario Día Único */}
          <div className="shrink-0 md:w-[380px] px-6 py-5 bg-bg-surface flex flex-col items-center">
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-4 w-full text-center">2. Selecciona la Fecha</p>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <div className="rdp-root-brand">
                  <DayPicker
                    mode="single"
                    locale={es}
                    disabled={{ before: new Date() }}
                    selected={field.value}
                    onSelect={field.onChange}
                    className="p-3 bg-bg-base/50 rounded-2xl border border-border-default"
                  />
                  {errors.date && (
                    <p className="text-xs text-red-500 font-medium text-center mt-3">{errors.date.message || "Se requiere seleccionar un día"}</p>
                  )}
                </div>
              )}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
