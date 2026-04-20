"use client";
import { notify } from "@/shared/ui/toaster";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { es } from "date-fns/locale";
import { useAddScheduleOverride } from "@features/clinics/hooks";
import { createScheduleOverrideSchema, type CreateScheduleOverrideFormData } from "@features/clinics/schemas/clinic.schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Info } from "lucide-react";
import { toISODate } from "@/shared/utils/date.utils";
import { ScheduleOverrideType } from "@/features/clinics/types/schedule.types";
import { OverrideTypeSelector } from "./OverrideTypeSelector";
import { Button } from "@/shared/ui/button";

interface Props {
  doctorClinicId: string;
  doctorName: string;
  prefillDate?: string;
  onClose: () => void;
}

export function AddOverrideModal({ doctorClinicId, doctorName, prefillDate, onClose }: Props) {
  const [serverError, setServerError] = useState("");
  const addOverride = useAddScheduleOverride();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateScheduleOverrideFormData>({
    resolver: zodResolver(createScheduleOverrideSchema),
    defaultValues: {
      type: "UNAVAILABLE",
      date: prefillDate ? new Date(prefillDate + "T00:00:00Z") : undefined,
    },
  });

  const selectedType = useWatch({ control, name: "type" }) as ScheduleOverrideType;

  async function onSubmit(data: CreateScheduleOverrideFormData) {
    setServerError("");
    const loadId = notify.loading("Guardando excepción...");
    try {
      if (!data.date) {
        setServerError("Debes seleccionar una fecha en el calendario");
        return;
      }

      const payload = {
        doctorClinicId,
        date: toISODate(data.date),
        type: data.type,
        startTime: data.startTime ?? null,
        endTime: data.endTime ?? null,
        note: data.note ?? null,
      };

      await addOverride.mutateAsync(payload);
      notify.success("Excepción guardada correctamente", undefined, { id: loadId });
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        const errorMsg = Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al agregar la excepción");
        setServerError(errorMsg);
        notify.error(errorMsg, undefined, { id: loadId });
      } else {
        notify.error("Error inesperado", undefined, { id: loadId });
      }
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-[850px] w-[95vw] overflow-hidden md:max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Agregar Excepción de Horario</DialogTitle>
          <DialogDescription>{doctorName}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(85vh-81px)]">
          {/* Lado Izquierdo: Configuración */}
          <div className="flex-1 px-6 py-5 space-y-6 overflow-y-auto">
            <div className="flex gap-3 p-3.5 bg-inner-principal rounded-sm items-start shadow-sm">
              <Info className="text-secundario shrink-0 mt-0.5" size={16} strokeWidth={2.5} />
              <div className="text-xs text-subtitulo leading-relaxed space-y-1">
                <p className="font-semibold text-encabezado">¿Cómo funcionan las excepciones?</p>
                <p>Las excepciones tienen prioridad sobre los horarios semanales normales.</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] font-bold text-subtitulo uppercase mb-3">1. Tipo de excepción</p>
              <OverrideTypeSelector selectedType={selectedType} onSelect={(type) => setValue("type", type)} />
            </div>

            {(selectedType === "CUSTOM" || selectedType === "AVAILABLE") && (
              <div className="p-4 bg-inner-secundario rounded-sm shadow-sm">
                <p className="text-[11px] font-bold text-subtitulo uppercase mb-3">Rango de horas</p>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Hora inicio" type="time" error={errors.startTime?.message} {...register("startTime")} />
                  <Input label="Hora fin" type="time" error={errors.endTime?.message} {...register("endTime")} />
                </div>
              </div>
            )}

            <Input
              label="Nota o Motivo (Opcional)"
              placeholder="Ej. Vacaciones de verano..."
              error={errors.note?.message}
              {...register("note")}
            />

            {serverError && (
              <p className="text-xs text-red-500 font-medium p-3 bg-red-50 dark:bg-red-500/10 rounded-xl">{serverError}</p>
            )}

            <div className="grid grid-cols-2 gap-5">
              <Button variant="cancelar" type="button" className="py-2" onClick={onClose}>
                Cancelar
              </Button>
              <Button variant="primary2" type="submit" className="py-2" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : "Guardar Excepción"}
              </Button>
            </div>
          </div>

          {/* Lado Derecho: Calendario */}
          <div className="shrink-0 md:w-[380px] px-6 py-5  flex flex-col items-center">
            <p className="text-[11px] font-bold text-subtitulo uppercase tracking-wider mb-4 w-full text-center">
              2. Selecciona la Fecha
            </p>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <div>
                  <DayPicker
                    animate
                    mode="single"
                    locale={es}
                    disabled={{ before: new Date() }}
                    selected={field.value}
                    onSelect={field.onChange}
                    className="p-3 bg-fondo-inputs rounded-sm border-l-4 border-principal shadow-md "
                  />
                  {errors.date && (
                    <p className="text-xs text-red-500 font-medium text-center mt-3">
                      {errors.date.message || "Se requiere seleccionar un día"}
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
