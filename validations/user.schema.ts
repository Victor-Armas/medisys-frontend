import { z } from "zod";

// ─── 1. CAMPOS BASE ────────────────────
export const baseUserFields = {
  firstName: z.string().min(1, "El nombre es requerido"),
  middleName: z.string().nullable().optional(),
  lastNamePaternal: z.string().min(1, "El apellido paterno es requerido"),
  lastNameMaternal: z.string().min(1, "El apellido materno es requerido"),
  email: z.string().email("Email inválido").min(1, "Requerido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  phone: z.string().nullable().optional(),
  role: z.enum(["ADMIN_SYSTEM", "MAIN_DOCTOR", "DOCTOR", "RECEPTIONIST"]),
};

// ─── 2. CAMPOS ESPECÍFICOS DE MÉDICO (Opcionales por defecto) ────────────────
export const doctorSpecificFields = {
  professionalLicense: z.string().min(1, "La cédula es requerida"),
  specialty: z.string().nullable().optional(),
  university: z.string().nullable().optional(),
  fullTitle: z.string().nullable().optional(),
  address: z.string().min(1, "Requerido"),
  numHome: z.string().min(1, "Requerido"),
  colony: z.string().min(1, "Requerido"),
  city: z.string().min(1, "Requerido"),
  state: z.string().min(1, "Requerido"),
  zipCode: z.string().min(1, "Requerido"),
};

// ─── 3. SCHEMA UNIFICADO FINAL ─────────────────────────────────────
export const unifiedUserSchema = z
  .object({
    ...baseUserFields,
    ...doctorSpecificFields,
  })
  .superRefine((data, ctx) => {
    // Validación condicional: Si es médico, los campos de doctorSpecificFields NO pueden ser undefined
    if (data.role === "DOCTOR" || data.role === "MAIN_DOCTOR") {
      const requiredDoctorFields: (keyof typeof doctorSpecificFields)[] = [
        "professionalLicense",
        "address",
        "numHome",
        "colony",
        "city",
        "state",
        "zipCode",
      ];

      requiredDoctorFields.forEach((key) => {
        if (!data[key]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Este campo es requerido para perfiles médicos",
            path: [key],
          });
        }
      });
    }
  });

export type UnifiedUserFormData = z.infer<typeof unifiedUserSchema>;

// ─── 4. DEFINICIÓN DE CAMPOS POR PASO (SIN ERRORES) ──────────────
export const FORM_STEPS_FIELDS = {
  receptionist: [
    ["role"],
    ["firstName", "lastNamePaternal", "lastNameMaternal", "email", "password"],
  ] as (keyof UnifiedUserFormData)[][],

  doctor: [
    ["role"],
    ["firstName", "lastNamePaternal", "lastNameMaternal", "email", "password"],
    [
      "professionalLicense",
      "address",
      "numHome",
      "colony",
      "city",
      "state",
      "zipCode",
    ],
  ] as (keyof UnifiedUserFormData)[][],
};
