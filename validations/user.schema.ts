import { z } from "zod";

/* ============================================================
   ROLE ENUM (mirror Prisma)
============================================================ */

export const roleSchema = z.enum(["ADMIN_SYSTEM", "MAIN_DOCTOR", "DOCTOR", "RECEPTIONIST"]);

export type Role = z.infer<typeof roleSchema>;

/* ============================================================
   USER BASE FIELDS (Single Source of Truth)
============================================================ */

export const userBaseFields = {
  firstName: z
    .string({
      message: "El nombre es requerido",
    })
    .min(1, "El nombre es requerido")
    .max(100, "Máximo 100 caracteres"),

  middleName: z.string().max(100, "Máximo 100 caracteres").optional(),

  lastNamePaternal: z
    .string({
      message: "El apellido paterno es requerido",
    })
    .min(1, "El apellido paterno es requerido")
    .max(100, "Máximo 100 caracteres"),

  lastNameMaternal: z
    .string({
      message: "El apellido materno es requerido",
    })
    .min(1, "El apellido materno es requerido")
    .max(100, "Máximo 100 caracteres"),

  email: z
    .string({
      message: "El email es requerido",
    })
    .email("Formato inválido"),

  password: z
    .string({
      message: "La contraseña es requerida",
    })
    .min(8, "Debe tener mínimo 8 caracteres"),

  phone: z.string().optional(),
};

/* ============================================================
   DOCTOR PROFILE BASE FIELDS
============================================================ */

export const doctorRequiredFields = {
  professionalLicense: z
    .string({
      message: "La cédula profesional es requerida",
    })
    .min(1, "La cédula profesional es requerida"),

  address: z
    .string({
      message: "La calle es requerida",
    })
    .min(1, "La calle es requerida"),

  numHome: z
    .string({
      message: "El número es requerido",
    })
    .min(1, "El número es requerido"),

  colony: z
    .string({
      message: "La colonia es requerida",
    })
    .min(1, "La colonia es requerida"),

  city: z
    .string({
      message: "La ciudad es requerida",
    })
    .min(1, "La ciudad es requerida"),

  state: z
    .string({
      message: "El estado es requerido",
    })
    .min(1, "El estado es requerido"),

  zipCode: z
    .string({
      message: "El código postal es requerido",
    })
    .min(1, "El código postal es requerido"),
};

export const doctorOptionalFields = {
  specialty: z.string().optional(),
  university: z.string().optional(),
  fullTitle: z.string().optional(),
  defaultAppointmentDuration: z.number().min(10).max(120).default(30).optional(),
};

/* ============================================================
   CREATE STAFF
============================================================ */

export const createStaffSchema = z.object({
  ...userBaseFields,

  role: roleSchema.exclude(["DOCTOR", "MAIN_DOCTOR"]),
});

export type CreateStaffFormData = z.infer<typeof createStaffSchema>;

/* ============================================================
   CREATE DOCTOR
============================================================ */

export const createDoctorSchema = z.object({
  ...userBaseFields,

  role: roleSchema.extract(["DOCTOR", "MAIN_DOCTOR"]),

  ...doctorRequiredFields,

  ...doctorOptionalFields,
});

export type CreateDoctorFormData = z.infer<typeof createDoctorSchema>;

/* ============================================================
   ASSIGN DOCTOR PROFILE TO EXISTING USER
============================================================ */

export const assignDoctorSchema = z.object({
  userId: z.string().uuid(),

  ...doctorRequiredFields,

  ...doctorOptionalFields,
});

export type AssignDoctorFormData = z.infer<typeof assignDoctorSchema>;

/* ============================================================
   EDIT USER
============================================================ */

export const editUserSchema = z.object({
  ...userBaseFields, // Trae nombre, apellidos, email, phone
  role: roleSchema,
  isActive: z.boolean(),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

/* ============================================================
   EDIT DOCTOR PROFILE
============================================================ */

export const editDoctorProfileSchema = z.object({
  ...doctorRequiredFields, // Trae cédula, dirección, etc.
  ...doctorOptionalFields, // Trae especialidad, duración, etc.
});

export type EditDoctorProfileFormData = z.infer<typeof editDoctorProfileSchema>;

/* ============================================================
   UNIFIED MODAL SCHEMA (Wizard)
============================================================ */

export const unifiedUserSchema = z
  .object({
    ...userBaseFields,

    role: roleSchema,

    ...z.object({
      ...doctorRequiredFields,
      ...doctorOptionalFields,
    }).partial().shape,
  })
  .superRefine((data, ctx) => {
    if (!["DOCTOR", "MAIN_DOCTOR"].includes(data.role)) return;

    for (const field of Object.keys(doctorRequiredFields)) {
      const value = data[field as keyof typeof data];

      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Campo requerido",
          path: [field],
        });
      }
    }
  });

export type UnifiedUserFormData = z.infer<typeof unifiedUserSchema>;

export const FORM_STEPS_FIELDS = {
  staff: [
    ["role"],
    ["firstName", "lastNamePaternal", "lastNameMaternal", "email", "password", "middleName", "phone"],
  ] as const,
  doctor: [
    ["role"],
    ["firstName", "lastNamePaternal", "lastNameMaternal", "email", "password", "middleName", "phone"],
    [
      "professionalLicense",
      "address",
      "numHome",
      "colony",
      "city",
      "state",
      "zipCode",
      "specialty",
      "university",
      "fullTitle",
    ],
  ] as const,
};
