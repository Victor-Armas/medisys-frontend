"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import dayjs from "dayjs";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { createAppointmentSchema, type CreateAppointmentFormValues } from "../../schemas/appointment.schema";
import { useCreateAppointment, useAvailableSlots, usePatientSearch } from "../../hooks/useAppointments";
import type { DoctorResource, AppointmentType } from "../../types/appointment.types";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const TYPE_OPTIONS: { value: AppointmentType; label: string }[] = [
  { value: "IN_PERSON", label: "Presencial" },
  { value: "HOME_VISIT", label: "Domicilio" },
  { value: "VIRTUAL", label: "Virtual" },
];

interface Props {
  resources: DoctorResource[];
  defaultDoctorClinicId?: string;
  defaultDate?: string;
  defaultStartTime?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CreateAppointmentForm({
  resources,
  defaultDoctorClinicId,
  defaultDate,
  defaultStartTime,
  onSuccess,
  onCancel,
}: Props) {
  const [contactMode, setContactMode] = useState<"patient" | "guest">("guest");
  const [patientQuery, setPatientQuery] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateAppointmentFormValues>({
    resolver: zodResolver(createAppointmentSchema),
    defaultValues: {
      doctorClinicId: defaultDoctorClinicId ?? "",
      date: defaultDate ?? "",
      startTime: defaultStartTime ?? "",
      type: "IN_PERSON",
      guestName: "",
      guestPhone: "",
      guestEmail: "",
      patientId: "",
      homeAddress: "",
      reason: "",
      internalNotes: "",
    },
  });

  const watchedDoctorClinicId = watch("doctorClinicId");
  const watchedDate = watch("date");
  const watchedType = watch("type");

  const { availabilityMap, availableDates, isLoading: loadingAvailability } = useAvailableSlots(watchedDoctorClinicId || null);

  const slotsForDate = watchedDate && availabilityMap[watchedDate] ? availabilityMap[watchedDate] : [];

  const isDateDisabled = (date: Date) => {
    if (!watchedDoctorClinicId || loadingAvailability) return true;
    const dateStr = dayjs(date).format("YYYY-MM-DD");
    return !availableDates.includes(dateStr);
  };

  const { patients } = usePatientSearch(patientQuery);

  const { mutate, isPending } = useCreateAppointment(onSuccess);
  const onSubmit = (values: CreateAppointmentFormValues) => {
    mutate({
      doctorClinicId: values.doctorClinicId,
      date: values.date,
      startTime: values.startTime,
      type: values.type,
      ...(contactMode === "patient" && values.patientId
        ? { patientId: values.patientId }
        : {
            guestName: values.guestName,
            guestPhone: values.guestPhone,
            guestEmail: values.guestEmail || undefined,
          }),
      reason: values.reason || undefined,
      internalNotes: values.internalNotes || undefined,
      homeAddress: values.homeAddress || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Contenedor Principal a 2 Columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ==========================================
            COLUMNA IZQUIERDA: Logística y Fecha
        ========================================== */}
        <div className="flex flex-col gap-4">
          {/* Médico */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-subtitulo uppercase tracking-wider">Médico / Consultorio</label>
            <select
              {...register("doctorClinicId")}
              className="w-full rounded-md bg-fondo-inputs text-encabezado text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-principal/40"
            >
              <option value="">Selecciona un médico</option>
              {resources.map((r) => (
                <option key={r.doctorClinicId} value={r.doctorClinicId}>
                  {r.firstName} {r.lastNamePaternal} — {r.clinicName}
                </option>
              ))}
            </select>
            {errors.doctorClinicId && <p className="text-[11px] text-negative-text">{errors.doctorClinicId.message}</p>}
          </div>

          {/* Calendario React Day Picker (Ancho completo de su columna) */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-subtitulo uppercase tracking-wider">Fecha de consulta</label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <div className="bg-fondo-inputs rounded-md border border-disable/20 p-2 flex justify-center shadow-sm">
                  <DayPicker
                    mode="single"
                    selected={field.value ? dayjs(field.value).toDate() : undefined}
                    onSelect={(date) => field.onChange(date ? dayjs(date).format("YYYY-MM-DD") : "")}
                    disabled={isDateDisabled}
                    // Pequeño ajuste para que no se vea gigantesco
                    className="m-0"
                  />
                </div>
              )}
            />
            {errors.date && <p className="text-[11px] text-negative-text">{errors.date.message}</p>}
          </div>

          {/* Horario y Tipo en la misma fila para ahorrar espacio */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-subtitulo uppercase tracking-wider">Horario</label>
              <select
                {...register("startTime")}
                disabled={!watchedDate || loadingAvailability}
                className="w-full rounded-md bg-fondo-inputs text-encabezado text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-principal/40 disabled:opacity-50"
              >
                <option value="">
                  {!watchedDate ? "Elige fecha" : slotsForDate.length === 0 ? "Sin horarios" : "Selecciona hora"}
                </option>
                {slotsForDate.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.startTime && <p className="text-[11px] text-negative-text">{errors.startTime.message}</p>}
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-subtitulo uppercase tracking-wider">Modalidad</label>
              <select
                value={watchedType}
                onChange={(e) => setValue("type", e.target.value as AppointmentType)}
                className="w-full rounded-md bg-fondo-inputs text-encabezado text-sm px-3 py-2.5 outline-none focus:ring-2 focus:ring-principal/40"
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Domicilio (solo HOME_VISIT) */}
          {watchedType === "HOME_VISIT" && (
            <div className="animate-in fade-in slide-in-from-top-1">
              <Input label="Dirección del Domicilio" {...register("homeAddress")} error={errors.homeAddress?.message} />
            </div>
          )}
        </div>

        {/* ==========================================
            COLUMNA DERECHA: Paciente y Detalles
        ========================================== */}
        <div className="flex flex-col gap-4">
          {/* Paciente */}
          <div className="flex flex-col gap-3 bg-fondo-inputs/50 p-3 border border-disable/10 rounded-md">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-encabezado">Datos del Paciente</label>
              <div className="flex rounded-sm bg-interior border border-disable/20 overflow-hidden">
                {(["guest", "patient"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setContactMode(mode)}
                    className={`px-3 py-1 text-[11px] font-medium transition-colors ${
                      contactMode === mode ? "bg-principal text-white shadow-sm" : "text-subtitulo hover:bg-fondo-inputs"
                    }`}
                  >
                    {mode === "guest" ? "Invitado" : "Registrado"}
                  </button>
                ))}
              </div>
            </div>

            {contactMode === "guest" ? (
              <div key="guest-view" className="flex flex-col gap-3">
                <Input label="Nombre completo" {...register("guestName")} error={errors.guestName?.message} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Teléfono" type="tel" {...register("guestPhone")} error={errors.guestPhone?.message} />
                  <Input label="Email (opcional)" type="email" {...register("guestEmail")} error={errors.guestEmail?.message} />
                </div>
              </div>
            ) : (
              <div key="patient-view" className="relative flex flex-col gap-1">
                <Input
                  label="Buscar paciente (Nombre o Teléfono)"
                  value={patientQuery}
                  onChange={(e) => setPatientQuery(e.target.value)}
                />
                {patients.length > 0 && (
                  <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-20 bg-interior border border-disable/20 rounded-md shadow-lg overflow-hidden max-h-48 overflow-y-auto">
                    {patients.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setValue("patientId", p.id);
                          setPatientQuery(`${p.firstName} ${p.lastNamePaternal}`);
                        }}
                        className="w-full text-left px-3 py-2.5 hover:bg-fondo-inputs transition-colors border-b border-disable/10 last:border-0"
                      >
                        <p className="font-medium text-xs text-encabezado">
                          {p.firstName} {p.lastNamePaternal}
                        </p>
                        <p className="text-[10px] text-subtitulo">{p.phone ?? p.curp ?? "Sin datos extra"}</p>
                      </button>
                    ))}
                  </div>
                )}
                {errors.patientId && <p className="text-[11px] text-negative-text">{errors.patientId.message}</p>}
              </div>
            )}
          </div>

          {/* Motivo y notas */}
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-subtitulo uppercase tracking-wider">
                Motivo de consulta (opcional)
              </label>
              <textarea
                {...register("reason")}
                rows={2}
                placeholder="Ej. Dolor de cabeza, Revisión de rutina..."
                className="w-full rounded-md bg-fondo-inputs text-encabezado text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-principal/40 resize-none border border-transparent focus:border-principal/30 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-semibold text-subtitulo uppercase tracking-wider">Notas internas (opcional)</label>
              <textarea
                {...register("internalNotes")}
                rows={3}
                placeholder="Solo visible para el staff médico..."
                className="w-full h-full rounded-md bg-fondo-inputs text-encabezado text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-principal/40 resize-none border border-transparent focus:border-principal/30 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          FOOTER: Acciones
      ========================================== */}
      <div className="flex gap-3 pt-4 mt-2 border-t border-disable/20 justify-end">
        <Button variant="cancelar" className="px-6 py-2" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button variant="primary2" className="px-6 py-2" type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Crear Cita"}
        </Button>
      </div>
    </form>
  );
}
