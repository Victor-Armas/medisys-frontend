"use client";

import { notify } from "@/shared/ui/toaster";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { es } from "date-fns/locale";

import { useAddSchedule } from "@features/clinics/hooks";
import { createScheduleSchema, type CreateScheduleRangeFormData } from "@features/clinics/schemas/clinic.schema";
import { WEEK_DAYS } from "@features/clinics/utils/clinic.utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

import { toISODate } from "@/shared/utils/date.utils";
import { Button } from "@/shared/ui/button";

interface Props {
  doctorClinicId: string;
  doctorName: string;
  prefillDate?: string;
  onClose: () => void;
}

export function AddScheduleModal({ doctorClinicId, doctorName, prefillDate, onClose }: Props) {
  const [serverError, setServerError] = useState("");
  const addSchedule = useAddSchedule();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateScheduleRangeFormData>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: {
      weekDays: prefillDate ? [new Date(prefillDate + "T00:00:00").getUTCDay()] : [],
      dateRange: prefillDate ? { from: new Date(prefillDate + "T00:00:00"), to: new Date(prefillDate + "T00:00:00") } : undefined,
    },
  });

  const selectedDays = useWatch({ control, name: "weekDays" }) ?? [];

  function toggleDay(day: number) {
    const current = selectedDays;
    if (current.includes(day)) {
      setValue(
        "weekDays",
        current.filter((d) => d !== day),
      );
    } else {
      setValue("weekDays", [...current, day]);
    }
  }

  async function onSubmit(data: CreateScheduleRangeFormData) {
    setServerError("");
    const loadId = notify.loading("Guardando horarios...");
    try {
      const dateFrom = toISODate(data.dateRange.from);
      const dateTo = toISODate(data.dateRange.to);

      await Promise.all(
        data.weekDays.map((weekDay) =>
          addSchedule.mutateAsync({
            doctorClinicId,
            weekDay,
            startTime: data.startTime,
            endTime: data.endTime,
            dateFrom,
            dateTo,
          }),
        ),
      );
      notify.success("Horarios guardados correctamente", undefined, { id: loadId });
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        const errorMsg = Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al agregar el bloque");
        setServerError(errorMsg);
        notify.error(errorMsg, undefined, { id: loadId });
      } else {
        notify.error("Error inesperado", undefined, { id: loadId });
      }
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[820px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 py-5">
          <DialogTitle className="text-base font-semibold text-encabezado">Establecer horario</DialogTitle>
          <DialogDescription className="text-xs text-subtitulo mt-1">{doctorName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row">
          {/* ── Lado izquierdo: configuración ── */}
          <div className="flex-1 px-6 py-5 space-y-6 ">
            {/* Paso 1 — Días */}
            <div>
              <p className="text-[11px] font-bold text-subtitulo uppercase tracking-wider mb-3">1. Selecciona los días</p>
              <div className="grid grid-cols-7 gap-1.5">
                {WEEK_DAYS.map((day, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className={cn(
                      "py-2 rounded-sm text-[11px] shadow-sm font-semibold transition-all ",
                      selectedDays.includes(i)
                        ? "bg-principal text-white "
                        : "bg-inner-principal text-principal-select-text hover:bg-bg-base border border-transparent hover:",
                    )}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {errors.weekDays && <p className="text-xs text-red-500 mt-2 font-medium">{errors.weekDays.message}</p>}
            </div>

            {/* Paso 2 — Horas */}
            <div>
              <p className="text-[11px] font-bold text-subtitulo uppercase tracking-wider mb-3">2. Rango de horas</p>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Hora inicio"
                  className="shadow-sm"
                  type="time"
                  error={errors.startTime?.message}
                  {...register("startTime")}
                />
                <Input
                  label="Hora fin"
                  className="shadow-sm"
                  type="time"
                  error={errors.endTime?.message}
                  {...register("endTime")}
                />
              </div>
            </div>

            {/* Resumen */}
            {selectedDays.length > 0 && (
              <div className="p-3 bg-inner-secundario rounded-sm shadow-sm">
                <p className="text-[11px] font-bold text-secundario uppercase tracking-wider mb-1">
                  Se crearán {selectedDays.length} bloque{selectedDays.length > 1 ? "s" : ""}
                </p>
                <p className="text-xs text-subtitulo">
                  {selectedDays
                    .sort((a, b) => a - b)
                    .map((d) => WEEK_DAYS[d])
                    .join(", ")}
                </p>
              </div>
            )}

            {serverError && (
              <p className="text-xs text-negative-text font-medium p-3 bg-red-50 dark:bg-red-500/10 rounded-xl">{serverError}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Button type="button" variant="cancelar" onClick={onClose} className="py-1.5">
                Cancelar
              </Button>
              <Button type="submit" variant="primary2" className="py-1.5" disabled={addSchedule.isPending}>
                {addSchedule.isPending
                  ? "Guardando..."
                  : `Guardar ${selectedDays.length > 1 ? `${selectedDays.length} bloques` : "bloque"}`}
              </Button>
            </div>
          </div>

          {/* ── Lado derecho: calendario vigencia ── */}
          <div className="px-6 py-5  flex flex-col items-center shrink-0">
            <p className="text-[11px] font-bold text-subtitulo uppercase tracking-wider mb-2 w-full text-center">
              3. Vigencia (rango de fechas)
            </p>
            <Controller
              control={control}
              name="dateRange"
              render={({ field }) => (
                <div>
                  <DayPicker
                    animate
                    mode="range"
                    locale={es}
                    selected={field.value as DateRange}
                    onSelect={field.onChange}
                    disabled={{ before: new Date() }}
                    classNames={{ selected: `text-principal ` }}
                    className="p-3 bg-fondo-inputs rounded-sm border-l-4 border-principal shadow-md "
                  />
                  {errors.dateRange && (
                    <p className="text-xs text-negative-text font-medium text-center mt-2">
                      Selecciona un rango de fechas válido
                    </p>
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
