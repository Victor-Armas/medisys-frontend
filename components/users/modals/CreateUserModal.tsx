"use client";
// Para crear recepcionistas y administradores (sin perfil médico).

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, ShieldCheck, UserRound } from "lucide-react";
import { useCreateUser } from "@/hooks/useUsers";
import { ModalOverlay } from "@/components/ui/ModalOverlay";
import { FormField } from "@/components/ui/FormField";
import type { Role } from "@/types/users.types";
import { ROLE_LABELS } from "@/constants/roles";
import { isAxiosError } from "axios";

const schema = z.object({
  email: z.string().min(1, "Requerido").email("Email inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  firstName: z.string().min(1, "Requerido"),
  middleName: z.string().optional(),
  lastNamePaternal: z.string().min(1, "Requerido"),
  lastNameMaternal: z.string().min(1, "Requerido"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN_SYSTEM", "RECEPTIONIST"] as const),
});

type FormData = z.infer<typeof schema>;

const ROLES_AVAILABLE: {
  value: Role;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "RECEPTIONIST",
    label: ROLE_LABELS.RECEPTIONIST,
    desc: "Gestión de citas y pacientes",
    icon: <UserRound size={16} />,
  },
  {
    value: "ADMIN_SYSTEM",
    label: ROLE_LABELS.ADMIN_SYSTEM,
    desc: "Acceso total al sistema",
    icon: <ShieldCheck size={16} />,
  },
];

export function CreateUserModal({ onClose }: { onClose: () => void }) {
  const [serverError, setServerError] = useState("");
  const { mutateAsync, isPending } = useCreateUser();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: "RECEPTIONIST" },
  });

  const selectedRole = useWatch({
    control,
    name: "role",
  });

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      await mutateAsync(data);
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setServerError(
          Array.isArray(msg) ? msg.join(", ") : msg ?? "Error al asignar"
        );
      }
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-bg-surface rounded-2xl border border-border-default shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <ModalHeader
          title="Nuevo usuario"
          subtitle="Recepcionista o administrador del sistema"
          onClose={onClose}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">
          {/* Selector de rol */}
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
              Rol del usuario
            </p>
            <div className="grid grid-cols-2 gap-3">
              {ROLES_AVAILABLE.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setValue("role", r.value)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all
                               ${
                                 selectedRole === r.value
                                   ? "border-brand bg-brand/5 shadow-sm"
                                   : "border-border-default hover:border-border-strong"
                               }`}
                >
                  <span
                    className={`mt-0.5 ${
                      selectedRole === r.value
                        ? "text-brand"
                        : "text-text-secondary"
                    }`}
                  >
                    {r.icon}
                  </span>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        selectedRole === r.value
                          ? "text-brand"
                          : "text-text-primary"
                      }`}
                    >
                      {r.label}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {r.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Divider label="Datos personales" />

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nombre(s) *" error={errors.firstName?.message}>
              <input {...register("firstName")} placeholder="Ana" />
            </FormField>
            <FormField
              label="Segundo nombre"
              error={errors.middleName?.message}
            >
              <input {...register("middleName")} placeholder="(opcional)" />
            </FormField>
            <FormField
              label="Apellido paterno *"
              error={errors.lastNamePaternal?.message}
            >
              <input {...register("lastNamePaternal")} placeholder="García" />
            </FormField>
            <FormField
              label="Apellido materno *"
              error={errors.lastNameMaternal?.message}
            >
              <input {...register("lastNameMaternal")} placeholder="López" />
            </FormField>
          </div>

          <Divider label="Acceso al sistema" />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormField label="Email *" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="ana@clinica.mx"
                />
              </FormField>
            </div>
            <FormField label="Contraseña *" error={errors.password?.message}>
              <input
                {...register("password")}
                type="password"
                placeholder="Mínimo 8 caracteres"
              />
            </FormField>
            <FormField label="Teléfono" error={errors.phone?.message}>
              <input {...register("phone")} placeholder="818 000 0000" />
            </FormField>
          </div>

          {serverError && <ErrorMessage message={serverError} />}

          <ModalFooter
            onCancel={onClose}
            isPending={isPending}
            label="Crear usuario"
          />
        </form>
      </div>
    </ModalOverlay>
  );
}

// ─── Shared modal sub-components ─────────────────────────────
export function ModalHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-5 border-b border-border-default sticky top-0 bg-bg-surface z-10">
      <div>
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:bg-bg-subtle transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px bg-border-default" />
      <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border-default" />
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="text-sm text-red-500 bg-red-500/5 border border-red-500/20 rounded-xl px-4 py-3">
      {message}
    </p>
  );
}

export function ModalFooter({
  onCancel,
  isPending,
  label,
}: {
  onCancel: () => void;
  isPending: boolean;
  label: string;
}) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2.5 text-sm font-medium text-text-primary border border-border-default rounded-xl hover:bg-bg-subtle transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-brand text-white rounded-xl hover:bg-brand-hover disabled:opacity-60 transition-colors"
      >
        {isPending && <Loader2 size={14} className="animate-spin" />}
        {label}
      </button>
    </div>
  );
}
