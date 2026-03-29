import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("El email no tiene un formato válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(8, "Mínimo 8 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
