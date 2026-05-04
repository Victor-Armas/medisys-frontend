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
    contactMode: z.enum(["patient", "guest"]),
    patientId: z.string().uuid("ID de paciente inválido").nullable().optional(),
    guestName: z.string().max(200).optional(),
    guestPhone: z.string().max(20).optional(),
    guestEmail: z.union([z.string().email("Email inválido"), z.literal("")]).optional(),
    reason: z.string().max(500).optional(),
    internalNotes: z.string().max(1000).optional(),
    homeAddress: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.contactMode === "patient") {
      if (!data.patientId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes buscar y seleccionar un paciente",
          path: ["patientId"],
        });
      }
    } else {
      if (!data.guestName || data.guestName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El nombre es obligatorio para invitados",
          path: ["guestName"],
        });
      }
      if (!data.guestPhone || data.guestPhone.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El teléfono es obligatorio para invitados",
          path: ["guestPhone"],
        });
      }
    }
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

// Usamos z.infer en lugar de z.input para que TypeScript lea el tipo final validado
export type CreateAppointmentFormValues = z.infer<typeof createAppointmentSchema>;
