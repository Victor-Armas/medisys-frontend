import { z } from "zod";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;
const HEX_REGEX = /^#([0-9A-Fa-f]{6})$/;

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
  brandColor: z
    .string()
    .regex(HEX_REGEX, "Debe ser un color hex válido (#RRGGBB)")
    .optional()
    .or(z.literal("")),
  maxDoctors: z.number().min(1, "Mínimo 1 médico").max(20),
});

export const createScheduleSchema = z
  .object({
    weekDay: z.number().min(0).max(6),
    startTime: z.string().regex(TIME_REGEX, "Formato HH:MM"),
    endTime: z.string().regex(TIME_REGEX, "Formato HH:MM"),
  })
  .refine((d) => d.endTime > d.startTime, {
    message: "La hora de fin debe ser mayor a la de inicio",
    path: ["endTime"],
  });

export type CreateClinicFormData = z.input<typeof createClinicSchema>;
export type CreateScheduleFormData = z.infer<typeof createScheduleSchema>;
