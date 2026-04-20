// features/clinics/schemas/clinic.schema.ts
import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
// const HEX_REGEX = /^#([0-9A-Fa-f]{6})$/;

export const createClinicSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  rfc: z.string().optional(),
  professionalLicense: z.string().optional(),
  // brandColor: z.string().regex(HEX_REGEX, "Debe ser un color hex válido (#RRGGBB)").optional().or(z.literal("")),
  maxDoctors: z.number().min(1, "Mínimo 1 médico").max(20),
});

// Multi-días: weekDays es un array, al menos 1 seleccionado
export const createScheduleSchema = z
  .object({
    weekDays: z.array(z.number().min(0).max(6)).min(1, "Selecciona al menos un día"),
    startTime: z.string().regex(TIME_REGEX, "Formato HH:MM"),
    endTime: z.string().regex(TIME_REGEX, "Formato HH:MM"),
    dateRange: z.object({
      from: z.date().refine((d) => !!d, "Selecciona fecha de inicio"),
      to: z.date().refine((d) => !!d, "Selecciona fecha de fin"),
    }),
  })
  .refine((d) => d.endTime > d.startTime, {
    message: "La hora de fin debe ser mayor a la de inicio",
    path: ["endTime"],
  });

const needsTime = (type: string) => type === "CUSTOM" || type === "AVAILABLE";

export const createScheduleOverrideSchema = z
  .object({
    date: z.date().refine((d) => !!d, "Selecciona una fecha"),
    type: z.enum(["AVAILABLE", "UNAVAILABLE", "CUSTOM"]),
    startTime: z.string().regex(TIME_REGEX, "Formato HH:MM").optional(),
    endTime: z.string().regex(TIME_REGEX, "Formato HH:MM").optional(),
    note: z.string().optional(),
  })
  .refine(
    (data) => {
      if (needsTime(data.type)) return !!data.startTime && !!data.endTime;
      return true;
    },
    {
      message: "Hora de inicio y fin requeridas",
      path: ["startTime"],
    },
  )
  .refine(
    (data) => {
      if (needsTime(data.type) && data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    },
    {
      message: "La hora de fin debe ser mayor a la de inicio",
      path: ["endTime"],
    },
  );

export type CreateClinicFormData = z.input<typeof createClinicSchema>;
export type CreateScheduleRangeFormData = z.infer<typeof createScheduleSchema>;
export type CreateScheduleOverrideFormData = z.infer<typeof createScheduleOverrideSchema>;
