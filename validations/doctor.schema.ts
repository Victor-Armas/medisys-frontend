import { z } from "zod";
import { baseUserFields } from "./user.schema";

// ─── ESQUEMA PARA DOCTORES (DESDE CERO) ──────────────────────────
export const doctorFormSchema = z.object({
  ...baseUserFields,
  // Perfil Médico (Obligatorios según tu Prisma)
  address: z.string().min(1, "Requerido"),
  numHome: z.string().min(1, "Requerido"),
  colony: z.string().min(1, "Requerido"),
  city: z.string().min(1, "Requerido"),
  state: z.string().min(1, "Requerido"),
  zipCode: z.string().min(1, "Requerido"),
  professionalLicense: z.string().min(1, "Requerido"),
  // Opcionales médicos
  specialty: z.string().nullable().optional(),
  university: z.string().nullable().optional(),
  fullTitle: z.string().nullable().optional(),
  photoUrl: z.string().nullable().optional(),
  signatureUrl: z.string().nullable().optional(),
});

export const assignDoctorSchema = doctorFormSchema
  .pick({
    address: true,
    numHome: true,
    colony: true,
    city: true,
    state: true,
    zipCode: true,
    professionalLicense: true,
    specialty: true,
    university: true,
    fullTitle: true,
  })
  .extend({
    userId: z.string().uuid("Debe ser un UUID válido"),
  });

export const DOCTOR_STEP_FIELDS: (keyof DoctorFormData)[][] = [
  ["email", "password", "firstName", "lastNamePaternal", "lastNameMaternal"],
  ["professionalLicense"],
  ["address", "numHome", "colony", "city", "state", "zipCode"],
];

export type DoctorFormData = z.infer<typeof doctorFormSchema>;
export type AssignDoctorFormData = z.infer<typeof assignDoctorSchema>;
