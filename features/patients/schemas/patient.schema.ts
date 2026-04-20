// features/patients/validations/patient.schema.ts
import { z } from "zod";

// CURP: 18 caracteres, formato oficial RENAPO
const CURP_REGEX =
  /^[A-Z]{1}[AEIOU]{1}[A-Z]{2}\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}\d{1}$/;

const PHONE_REGEX = /^[\d\s\-\+\(\)]{7,20}$/;

// ── Address schema ────────────────────────────────────────────────────────────

export const addressSchema = z.object({
  country: z.string().default("MX"),
  isPrimary: z.boolean().default(false),
  // México
  postalCodeId: z.string().uuid().optional(),
  neighborhoodId: z.string().uuid().optional(),
  street: z.string().optional().or(z.literal("")),
  extNumber: z.string().optional().or(z.literal("")),
  intNumber: z.string().optional().or(z.literal("")),
  municipality: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  // Extra para el formulario (no van al backend directamente)
  postalCodeInput: z.string().optional(), // el CP que escribe el usuario
  neighborhoodInput: z.string().optional(),
  // Extranjero
  foreignState: z.string().optional().or(z.literal("")),
  foreignCity: z.string().optional().or(z.literal("")),
  foreignPostalCode: z.string().optional().or(z.literal("")),
  foreignAddressLine: z.string().optional().or(z.literal("")),
});

export const patientSchema = z.object({
  // ── Nombre ──────────────────────────────────────────────────────────────
  firstName: z
    .string({ message: "El nombre es obligatorio" })
    .min(1, "El nombre es obligatorio")
    .max(100, "Máximo 100 caracteres"),

  middleName: z.string().max(100).optional().or(z.literal("")),

  lastNamePaternal: z
    .string({ message: "El apellido paterno es obligatorio" })
    .min(1, "El apellido paterno es obligatorio")
    .max(100),

  lastNameMaternal: z.string().max(100).optional().or(z.literal("")),

  // ── Datos demográficos ─────────────────────────────────────────────────
  birthDate: z.string({ message: "La fecha de nacimiento es obligatoria" }).min(1, "La fecha de nacimiento es obligatoria"),

  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Selecciona el género",
  }),

  curp: z.string().regex(CURP_REGEX, "El CURP no tiene un formato válido").optional().or(z.literal("")),

  phone: z
    .string({ message: "El teléfono es obligatorio" })
    .min(1, "El teléfono es obligatorio")
    .regex(PHONE_REGEX, "Formato de teléfono inválido"),

  email: z.string().email("El email no tiene un formato válido").optional().or(z.literal("")),

  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "FREE_UNION", "OTHER"]).optional(),

  occupation: z.string().max(100).optional().or(z.literal("")),
  educationLevel: z.enum(["NONE", "PRIMARY", "SECONDARY", "HIGH_SCHOOL", "TECHNICAL", "BACHELOR", "POSTGRADUATE"]).optional(),

  // ── Clínico ─────────────────────────────────────────────────────────────
  bloodType: z
    .enum([
      "O_POSITIVE",
      "O_NEGATIVE",
      "A_POSITIVE",
      "A_NEGATIVE",
      "B_POSITIVE",
      "B_NEGATIVE",
      "AB_POSITIVE",
      "AB_NEGATIVE",
      "UNKNOWN",
    ])
    .optional(),

  // ── Contacto de emergencia ────────────────────────────────────────────
  emergencyContactName: z.string().max(200).optional().or(z.literal("")),
  emergencyContactPhone: z.string().max(20).regex(PHONE_REGEX, "Formato de teléfono inválido").optional().or(z.literal("")),
  emergencyContactRelation: z.string().optional().or(z.literal("")),

  // ── Clínica de registro ──────────────────────────────────────────────
  clinicId: z.string().uuid().optional(),

  address: addressSchema.optional(),
});

export type PatientFormData = z.input<typeof patientSchema>;
export type AddressFormData = z.input<typeof addressSchema>;
