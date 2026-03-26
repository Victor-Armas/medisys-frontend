import { z } from "zod";

// ─── BASE: CAMPOS COMUNES A TODO USUARIO ────────────────────────
export const baseUserFields = {
  email: z.string().email("Email inválido").min(1, "Requerido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  firstName: z.string().min(1, "Requerido"),
  middleName: z.string().nullable().optional(),
  lastNamePaternal: z.string().min(1, "Requerido"),
  lastNameMaternal: z.string().min(1, "Requerido"),
  phone: z.string().nullable().optional(),
  role: z.enum(["ADMIN_SYSTEM", "MAIN_DOCTOR", "DOCTOR", "RECEPTIONIST"]),
};

// ─── ESQUEMA PARA USUARIOS (ADMIN / RECEPCIONISTA) ───────────────
// Solo pedimos los campos base.
export const createUserSchema = z.object({
  ...baseUserFields,
  role: z.enum(["MAIN_DOCTOR", "DOCTOR", "RECEPTIONIST"]), // Restringimos los roles para este modal
});

// ─── ESQUEMA PARA ASIGNAR DOCTOR (A USUARIO EXISTENTE) ────────────

// Tipos inferidos
export type CreateUserData = z.infer<typeof createUserSchema>;
