import { z } from "zod";
import dayjs from "@/shared/utils/date.utils";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createAppointmentSchema = z
  .object({
    doctorClinicId: z.string().uuid("Selecciona un médico"),
    date: z.string().min(1, "La fecha es obligatoria"),
    startTime: z.string().regex(TIME_REGEX, "Formato HH:MM requerido"),
    type: z.enum(["IN_PERSON", "HOME_VISIT", "VIRTUAL"], {
      message: "Selecciona el tipo de consulta",
    }),
    // Contacto: paciente registrado o invitado
    patientId: z.string().uuid().optional(),
    guestName: z.string().max(200).optional(),
    guestPhone: z.string().max(20).optional(),
    guestEmail: z.union([z.string().email(), z.literal("")]).optional(),
    reason: z.string().max(500).optional(),
    internalNotes: z.string().max(1000).optional(),
    homeAddress: z.string().max(500).optional(),
  })
  .refine((data) => data.patientId || (data.guestName && data.guestPhone), {
    message: "Se requiere paciente registrado o nombre + teléfono de invitado",
    path: ["guestName"],
  })
  .refine(
    (data) => {
      const today = dayjs().startOf("day");
      return dayjs(data.date).isSame(today) || dayjs(data.date).isAfter(today);
    },
    { message: "No se puede agendar en fechas pasadas", path: ["date"] },
  )
  .refine(
    (data) => {
      if (data.type !== "HOME_VISIT") return true;
      return Boolean(data.homeAddress?.trim());
    },
    { message: "El domicilio es obligatorio para consulta a domicilio", path: ["homeAddress"] },
  );

export type CreateAppointmentFormValues = z.infer<typeof createAppointmentSchema>;
