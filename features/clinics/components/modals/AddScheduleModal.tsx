"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";

import { useAddSchedule } from "@features/clinics/hooks";
import {
  createScheduleSchema,
  type CreateScheduleFormData,
} from "@features/clinics/validations/clinic.schema";
import { WEEK_DAYS } from "@features/clinics/utils/clinic.utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";

interface Props {
  doctorClinicId: string;
  doctorName: string;
  onClose: () => void;
}

export function AddScheduleModal({
  doctorClinicId,
  doctorName,
  onClose,
}: Props) {
  const [serverError, setServerError] = useState("");
  const addSchedule = useAddSchedule();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateScheduleFormData>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: { weekDay: 1 },
  });

  const selectedDay = watch("weekDay");

  async function onSubmit(data: CreateScheduleFormData) {
    setServerError("");
    try {
      await addSchedule.mutateAsync({ ...data, doctorClinicId });
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setServerError(
          Array.isArray(msg)
            ? msg.join(", ")
            : msg ?? "Error al agregar el bloque"
        );
      }
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md p-0 gap-0 rounded-2xl">
        <DialogHeader className="px-6 py-5 border-b border-border-default">
          <DialogTitle className="text-base font-semibold text-text-primary">
            Agregar bloque horario
          </DialogTitle>
          <DialogDescription className="text-xs text-text-secondary mt-1">
            {doctorName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-5">
          {/* Día de la semana */}
          <div>
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
              Día de la semana
            </p>
            <div className="grid grid-cols-7 gap-1">
              {WEEK_DAYS.map((day, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setValue("weekDay", i)}
                  className={`py-2 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedDay === i
                      ? "bg-brand text-white"
                      : "bg-bg-subtle text-text-secondary hover:bg-bg-base"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Horas */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hora inicio *"
              type="time"
              error={errors.startTime?.message}
              {...register("startTime")}
            />
            <Input
              label="Hora fin *"
              type="time"
              error={errors.endTime?.message}
              {...register("endTime")}
            />
          </div>

          {serverError && (
            <p className="text-xs text-red-500 font-medium">{serverError}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:bg-bg-subtle transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={addSchedule.isPending}
              className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {addSchedule.isPending ? "Guardando..." : "Agregar bloque"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
