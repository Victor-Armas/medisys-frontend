"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Input } from "@/shared/ui/input";
import { ButtonLogin } from "@/shared/ui/ButtonLogin";
import { notify } from "@/shared/ui/toaster";

// Mismas reglas que el backend
const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe incluir al menos una mayúscula")
      .regex(/[a-z]/, "Debe incluir al menos una minúscula")
      .regex(/\d/, "Debe incluir al menos un número")
      .regex(/[@#$!%*?&]/, "Debe incluir al menos un carácter especial (@#$!%*?&)"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const router = useRouter();
  const clearMustChangePassword = useAuthStore((s) => s.clearMustChangePassword);
  const user = useAuthStore((s) => s.user);

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(changePasswordSchema) });

  async function onSubmit(data: FormData) {
    const loadId = notify.loading("Actualizando contraseña...");
    try {
      await authService.changePassword(data.newPassword);
      clearMustChangePassword();
      notify.success("Contraseña actualizada", "Ya puedes usar tu nueva contraseña", {
        id: loadId,
      });
      router.push("/dashboard");
    } catch {
      notify.error("Error al actualizar la contraseña", undefined, { id: loadId });
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-10">
      {/* Header */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-full bg-inner-principal flex items-center justify-center">
          <ShieldCheck size={28} className="text-principal" />
        </div>
        <h1 className="text-2xl font-bold text-encabezado text-center">Actualiza tu contraseña</h1>
        <p className="text-sm text-subtitulo text-center">
          {user?.firstName}, el administrador ha reseteado tu contraseña.
          <br />
          Elige una nueva para continuar.
        </p>
      </div>

      {/* Requisitos visuales */}
      <div className="bg-inner-principal rounded-md p-3 mb-6 text-xs text-subtitulo space-y-1">
        <p className="font-semibold text-principal mb-2">La contraseña debe tener:</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>Mínimo 8 caracteres</li>
          <li>Al menos una letra mayúscula</li>
          <li>Al menos una letra minúscula</li>
          <li>Al menos un número</li>
          <li>Al menos un carácter especial (@#$!%*?&)</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Nueva contraseña"
          type={showNew ? "text" : "password"}
          icon={Lock}
          error={errors.newPassword?.message}
          rightElement={
            <button type="button" onClick={() => setShowNew((v) => !v)}>
              {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          {...register("newPassword")}
        />

        <Input
          label="Confirmar contraseña"
          type={showConfirm ? "text" : "password"}
          icon={Lock}
          error={errors.confirmPassword?.message}
          rightElement={
            <button type="button" onClick={() => setShowConfirm((v) => !v)}>
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          {...register("confirmPassword")}
        />

        <ButtonLogin type="submit" fullWidth loading={isSubmitting}>
          Guardar nueva contraseña
        </ButtonLogin>
      </form>
    </div>
  );
}
