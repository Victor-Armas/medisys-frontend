"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Info } from "lucide-react";
import { isAxiosError } from "axios";
import { cn } from "@/lib/utils";

// shadcn UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FormField } from "@/components/ui/FormField";

// Lógica
import { useAssignDoctorProfile } from "@/hooks/useUsers";
import {
  type AssignDoctorFormData,
  assignDoctorSchema,
} from "@/validations/doctor.schema";

interface Props {
  onClose: () => void;
  // Podrías pasar el userId por props si ya lo tienes desde la tabla
  defaultUserId?: string;
}

export function AssignDoctorModal({ onClose, defaultUserId }: Props) {
  const [serverError, setServerError] = useState("");
  const { mutateAsync, isPending } = useAssignDoctorProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignDoctorFormData>({
    resolver: zodResolver(assignDoctorSchema),
    defaultValues: {
      userId: defaultUserId || "",
    },
  });

  async function onSubmit(data: AssignDoctorFormData) {
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
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "p-0 max-w-2xl gap-0 overflow-hidden rounded-3xl transition-all duration-200",
          "bg-white border-border-default shadow-xl",
          "dark:bg-[#0a0a0c] dark:border-white/5 dark:shadow-2xl"
        )}
      >
        <DialogHeader className="px-7 py-5 border-b border-border-default dark:border-white/5 bg-white dark:bg-[#0a0a0c]">
          <DialogTitle className="text-xl font-bold tracking-tight text-text-primary dark:text-white">
            Asignar Perfil Médico
          </DialogTitle>
          <DialogDescription className="text-[13px] text-text-secondary dark:text-text-disabled mt-1">
            Convierte a un usuario existente en Médico completando sus datos
            profesionales.
          </DialogDescription>
        </DialogHeader>

        {/* Info Banner Premium */}
        <div className="mx-7 mt-5 p-4 rounded-2xl bg-brand/5 border border-brand/10 flex gap-3 items-center">
          <div className="p-2 rounded-lg bg-brand/10 text-brand">
            <Info size={18} />
          </div>
          <p className="text-[12px] text-brand-hover font-medium leading-tight">
            El rol del usuario cambiará automáticamente a{" "}
            <strong>Médico</strong> al finalizar este proceso.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col max-h-[70vh]"
        >
          <div className="flex-1 overflow-y-auto p-7 space-y-6 hide-scrollbar">
            <section className="space-y-5">
              <Divider label="Identificación" />
              <FormField
                label="ID del usuario (UUID) *"
                error={errors.userId?.message}
                colSpan={2}
              >
                <input
                  {...register("userId")}
                  placeholder="00000000-0000-0000-0000-000000000000"
                  className="font-mono text-xs tracking-wider"
                  readOnly={!!defaultUserId}
                />
              </FormField>
            </section>

            <section className="space-y-5">
              <Divider label="Datos Profesionales" />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Cédula profesional *"
                  error={errors.professionalLicense?.message}
                  colSpan={2}
                >
                  <input
                    {...register("professionalLicense")}
                    placeholder="12345678"
                    className="font-mono tracking-widest"
                  />
                </FormField>

                <FormField
                  label="Especialidad"
                  error={errors.specialty?.message}
                  colSpan={1}
                >
                  <input
                    {...register("specialty")}
                    placeholder="Ej. Cardiología"
                  />
                </FormField>

                <FormField
                  label="Universidad"
                  error={errors.university?.message}
                  colSpan={1}
                >
                  <input {...register("university")} placeholder="Ej. UANL" />
                </FormField>

                <FormField
                  label="Título para recetas"
                  error={errors.fullTitle?.message}
                  colSpan={2}
                >
                  <input
                    {...register("fullTitle")}
                    placeholder="Dr. Nombre Apellido - Especialista"
                  />
                </FormField>
              </div>
            </section>

            <section className="space-y-5">
              <Divider label="Ubicación de Consultorio" />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Calle y Número *"
                  error={errors.address?.message}
                  colSpan={2}
                >
                  <input
                    {...register("address")}
                    placeholder="Av. Venustiano Carranza"
                  />
                </FormField>

                <FormField
                  label="Interior/Oficina *"
                  error={errors.numHome?.message}
                  colSpan={1}
                >
                  <input {...register("numHome")} placeholder="Cons. 201" />
                </FormField>

                <FormField
                  label="Colonia *"
                  error={errors.colony?.message}
                  colSpan={1}
                >
                  <input {...register("colony")} placeholder="Centro" />
                </FormField>

                <FormField
                  label="Ciudad *"
                  error={errors.city?.message}
                  colSpan={1}
                >
                  <input {...register("city")} placeholder="Monterrey" />
                </FormField>

                <FormField
                  label="Estado *"
                  error={errors.state?.message}
                  colSpan={1}
                >
                  <input {...register("state")} placeholder="Nuevo León" />
                </FormField>

                <FormField
                  label="Código Postal *"
                  error={errors.zipCode?.message}
                  colSpan={2}
                >
                  <input {...register("zipCode")} placeholder="64000" />
                </FormField>
              </div>
            </section>

            {serverError && <ErrorMessage message={serverError} />}
          </div>

          <div className="px-7 py-5 border-t border-border-default dark:border-white/5 bg-bg-surface dark:bg-[#08080a] mt-auto">
            <div className="flex justify-end gap-3 items-center">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors
                           text-text-secondary border border-border-default hover:bg-bg-subtle
                           dark:border-white/10 dark:hover:bg-white/5"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2.5 px-7 py-2.5 text-sm font-semibold text-white rounded-xl transition-all
                           bg-brand hover:bg-brand-hover shadow-lg shadow-brand/20
                           disabled:opacity-60"
              >
                {isPending && <Loader2 size={16} className="animate-spin" />}
                Asignar Perfil Médico
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Sub-componentes locales para no depender de CreateUserModal
function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-bold text-text-muted dark:text-text-secondary uppercase tracking-[0.2em] whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border-default dark:bg-white/5" />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20">
      <p className="text-[13px] text-red-700 dark:text-red-400 font-medium">
        {message}
      </p>
    </div>
  );
}
