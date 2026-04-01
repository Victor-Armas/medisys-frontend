// validations/user.schema.ts
//
// Fuente de verdad de validaciones para creación y asignación de usuarios.
// Refleja exactamente el modelo Prisma: User + DoctorProfile.
//
// Flujos cubiertos:
//   1. Crear Admin / Recepcionista  → createStaffSchema
//   2. Crear Doctor / MédicoPrincipal → createDoctorSchema (usuario + perfil médico)
//   3. Asignar perfil médico a usuario existente → assignDoctorSchema
//   4. Modal unificado (paso 1 elige rol, luego valida según rol) → unifiedUserSchema

import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// BLOQUES BASE — espejo exacto de los campos Prisma
// ─────────────────────────────────────────────────────────────

/** Campos de User que aplican a CUALQUIER rol (obligatorios en Prisma) */
const userBaseFields = {
  firstName: z.string().min(1, "El nombre es requerido").max(100, "Máximo 100 caracteres"),
  middleName: z.string().max(100, "Máximo 100 caracteres").nullable().optional(),
  lastNamePaternal: z.string().min(1, "El apellido paterno es requerido").max(100, "Máximo 100 caracteres"),
  lastNameMaternal: z.string().min(1, "El apellido materno es requerido").max(100, "Máximo 100 caracteres"),
  email: z.string().min(1, "El email es requerido").email("El email no tiene un formato válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  phone: z.string().nullable().optional(),
};

/** Roles permitidos al crear staff (no PATIENT — ese es solo auto-registro público) */
const staffRoleEnum = z.enum(["ADMIN_SYSTEM", "MAIN_DOCTOR", "DOCTOR", "RECEPTIONIST"], { message: "Selecciona un rol válido" });

/** Campos de DoctorProfile — obligatorios en Prisma (NOT NULL) */
const doctorProfileRequiredFields = {
  professionalLicense: z.string().min(1, "La cédula profesional es requerida"),
  address: z.string().min(1, "La calle es requerida"),
  numHome: z.string().min(1, "El número es requerido"),
  colony: z.string().min(1, "La colonia es requerida"),
  city: z.string().min(1, "La ciudad es requerida"),
  state: z.string().min(1, "El estado es requerido"),
  zipCode: z.string().min(1, "El código postal es requerido"),
};

/** Campos de DoctorProfile — opcionales en Prisma (String?) */
const doctorProfileOptionalFields = {
  specialty: z.string().nullable(),
  university: z.string().nullable(),
  fullTitle: z.string().nullable(),
  // signatureUrl y photoUrl se suben por Cloudinary en flujo separado
};

// ─────────────────────────────────────────────────────────────
// 1. SCHEMA: Crear Admin o Recepcionista
//    → POST /api/users
//    → Solo campos de User, sin perfil médico
// ─────────────────────────────────────────────────────────────
export const createStaffSchema = z.object({
  ...userBaseFields,
  role: staffRoleEnum,
});

export type CreateStaffFormData = z.infer<typeof createStaffSchema>;

// ─────────────────────────────────────────────────────────────
// 2. SCHEMA: Crear Doctor o Médico Principal desde cero
//    → POST /api/doctors
//    → Campos de User + DoctorProfile completo
// ─────────────────────────────────────────────────────────────
export const createDoctorSchema = z.object({
  ...userBaseFields,
  role: z.enum(["MAIN_DOCTOR", "DOCTOR"], {
    message: "El rol debe ser Doctor o Médico Principal",
  }),
  ...doctorProfileRequiredFields,
  ...doctorProfileOptionalFields,
});

export type CreateDoctorFormData = z.infer<typeof createDoctorSchema>;

// ─────────────────────────────────────────────────────────────
// 3. SCHEMA: Asignar perfil médico a usuario existente
//    → POST /api/doctors/assign
//    → Solo perfil médico + userId (el usuario ya existe)
// ─────────────────────────────────────────────────────────────
export const assignDoctorSchema = z.object({
  userId: z.string().uuid("ID de usuario inválido"),
  ...doctorProfileRequiredFields,
  ...doctorProfileOptionalFields,
});

export type AssignDoctorFormData = z.infer<typeof assignDoctorSchema>;

// ─────────────────────────────────────────────────────────────
// 4. SCHEMA UNIFICADO: Para el modal de paso a paso (UserFormModal)
//
//    El paso 1 elige el rol. Según el rol, superRefine exige
//    o no los campos del DoctorProfile.
//
//    Los campos médicos son opcionales en el objeto base para
//    que zod no rechace el form en pasos anteriores al médico.
//    superRefine los hace obligatorios solo cuando el rol lo requiere.
// ─────────────────────────────────────────────────────────────
export const unifiedUserSchema = z
  .object({
    ...userBaseFields,
    role: staffRoleEnum,
    // DoctorProfile — opcionales en el schema base,
    // obligatorios via superRefine cuando role = DOCTOR | MAIN_DOCTOR
    professionalLicense: z.string().optional(),
    address: z.string().optional(),
    numHome: z.string().optional(),
    colony: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    ...doctorProfileOptionalFields,
  })
  .superRefine((data, ctx) => {
    const isMedic = data.role === "DOCTOR" || data.role === "MAIN_DOCTOR";

    if (!isMedic) return; // Admin y Recepcionista no necesitan perfil médico

    const required: Array<{ key: string; label: string }> = [
      {
        key: "professionalLicense",
        label: "La cédula profesional es requerida",
      },
      { key: "address", label: "La calle es requerida" },
      { key: "numHome", label: "El número es requerido" },
      { key: "colony", label: "La colonia es requerida" },
      { key: "city", label: "La ciudad es requerida" },
      { key: "state", label: "El estado es requerido" },
      { key: "zipCode", label: "El código postal es requerido" },
    ];

    required.forEach(({ key, label }) => {
      const value = data[key as keyof typeof data];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: label,
          path: [key],
        });
      }
    });
  });

export type UnifiedUserFormData = z.infer<typeof unifiedUserSchema>;

// ─────────────────────────────────────────────────────────────
// CAMPOS POR PASO
// Usados por trigger() en UserFormModal para validar solo
// los campos del paso actual antes de permitir avanzar.
// ─────────────────────────────────────────────────────────────
export const FORM_STEPS_FIELDS = {
  // Admin y Recepcionista: 2 pasos
  staff: [["role"], ["firstName", "lastNamePaternal", "lastNameMaternal", "email", "password"]] as (keyof UnifiedUserFormData)[][],

  // Doctor y Médico Principal: 3 pasos
  doctor: [
    ["role"],
    ["firstName", "lastNamePaternal", "lastNameMaternal", "email", "password"],
    ["professionalLicense", "address", "numHome", "colony", "city", "state", "zipCode"],
  ] as (keyof UnifiedUserFormData)[][],
};
