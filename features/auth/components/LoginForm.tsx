"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/features/auth/store/auth.store";
import {
  loginSchema,
  LoginFormData,
} from "@/features/auth/validations/auth.validations";
import { Input } from "@/shared/ui/input";
import { ButtonLogin } from "@/shared/ui/ButtonLogin";

export function LoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setServerError("");
    try {
      const res = await authService.login(data);
      setAuth(res.user, res.access_token);
      router.push("/dashboard");
    } catch {
      setServerError("Credenciales inválidas. Verifica tu email y contraseña.");
    }
  }

  return (
    <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-10 py-12">
      {/* Badge */}
      <div className="mb-6">
        <span className="text-xs font-semibold tracking-widest px-3 py-1 rounded-md bg-surface-subtle text-brand">
          STAFF LOGIN
        </span>
      </div>

      <h1 className="text-2xl font-semibold text-text-base mb-1">
        Bienvenido de nuevo
      </h1>
      <p className="text-sm text-text-muted mb-8">
        Ingresa con tus credenciales
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="Email"
          type="email"
          placeholder="dr.smith@clinica.mx"
          icon={Mail}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-text-base">
              Contraseña
            </span>
            <button
              type="button"
              className="text-xs font-medium text-brand cursor-pointer hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            icon={Lock}
            error={errors.password?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-accent cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
            {...register("password")}
          />
        </div>

        {serverError && <p className="text-sm text-red-500">{serverError}</p>}

        <ButtonLogin
          type="submit"
          fullWidth
          loading={isSubmitting}
          icon={ArrowRight}
        >
          Iniciar sesión
        </ButtonLogin>
      </form>
    </div>
  );
}
