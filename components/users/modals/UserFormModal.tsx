"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  UserRound,
  ShieldCheck,
  Stethoscope,
  Loader2,
} from "lucide-react";
import { isAxiosError } from "axios";
import { cn } from "@/lib/utils";

// Componentes de shadcn UI nativos
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Asegúrate de tener esta ruta correcta
import { FormField } from "@/components/ui/FormField";

// Lógica y Tipos
import { useCreateUser, useCreateDoctor } from "@/hooks/useUsers";
import { ROLE_LABELS } from "@/constants/roles";
import { isDoctor } from "@/types/doctors.types";
import {
  unifiedUserSchema,
  FORM_STEPS_FIELDS,
  type UnifiedUserFormData,
} from "@/validations/user.schema";

interface Props {
  onClose: () => void;
}

const ROLES_OPTIONS = [
  {
    value: "RECEPTIONIST",
    label: ROLE_LABELS.RECEPTIONIST,
    desc: "Citas y recepción de pacientes",
    icon: UserRound,
    bg: "text-sky-600 bg-linear-to-br from-sky-500/20 to-sky-500/5 border-sky-500/30 shadow-sm shadow-sky-500/10",
  },
  {
    value: "DOCTOR",
    label: ROLE_LABELS.DOCTOR,
    desc: "Perfil médico completo y recetas",
    icon: Stethoscope,
    bg: "text-green-600 bg-linear-to-br from-green-500/20 to-green-500/5 border-green-500/30 shadow-sm shadow-green-500/10",
  },
  {
    value: "ADMIN_SYSTEM",
    label: ROLE_LABELS.ADMIN_SYSTEM,
    desc: "Acceso total a la configuración",
    icon: ShieldCheck,
    bg: "text-purple-600 bg-linear-to-br from-purple-500/20 to-purple-500/5 border-purple-500/30 shadow-sm shadow-purple-500/10",
  },
] as const;

export function UserFormModal({ onClose }: Props) {
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState("");

  const createUser = useCreateUser();
  const createDoctor = useCreateDoctor();
  const isPending = createUser.isPending || createDoctor.isPending;

  const {
    register,
    handleSubmit,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<UnifiedUserFormData>({
    resolver: zodResolver(unifiedUserSchema),
    defaultValues: { role: "RECEPTIONIST" },
    mode: "onChange",
  });

  const selectedRole = useWatch({ control, name: "role" });
  const isSelectedDoctor = isDoctor({ role: selectedRole });

  const stepsLabels = isSelectedDoctor
    ? ["Rol", "Cuenta", "Perfil médico"]
    : ["Rol", "Cuenta"];

  const fieldsByStep = isSelectedDoctor
    ? FORM_STEPS_FIELDS.doctor
    : FORM_STEPS_FIELDS.receptionist;

  async function handleNext() {
    const fieldsToValidate = fieldsByStep[step];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep((s) => s + 1);
      setServerError("");
    }
  }

  function handleBack() {
    if (step === 0) onClose();
    else setStep((s) => s - 1);
  }

  async function onSubmit(data: UnifiedUserFormData) {
    setServerError("");
    try {
      if (isSelectedDoctor) {
        await createDoctor.mutateAsync(data);
      } else {
        const baseData = { ...data };
        Object.keys(FORM_STEPS_FIELDS.doctor[2]).forEach(
          (key) => delete baseData[key as keyof UnifiedUserFormData]
        );
        await createUser.mutateAsync(baseData);
      }
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        setServerError(
          Array.isArray(msg)
            ? msg.join(", ")
            : msg ?? "Error al crear el usuario"
        );
        if (msg?.includes("email")) setStep(1);
      }
    }
  }

  return (
    // Dialog maneja la apertura y el cierre (presionar ESC, clic fuera, etc.)
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      {/* Sobrescribimos las clases de DialogContent (p-0, bordes, fondos) 
        para lograr el look Premium/Stealth sin romper shadcn.
        Importante: className y no style, max-w-2xl para que esté amplio.

        "p-0 max-w-2xl gap-0 overflow-hidden rounded-3xl transition-all duration-200",
          "bg-bg-surface border-border-default shadow-xl", // <--- Tus globales
          "dark:bg-[#0a0a0c] dark:border-white/5"

          
      */}
      <DialogContent
        className={cn(
          "p-1 max-w-2xl gap-0 overflow-hidden rounded-3xl transition-all duration-200",
          " shadow-xl" // <--- Tus globales
        )}
      >
        {/* Header Nativo de Shadcn */}
        <DialogHeader className="px-10 py-7 border-b border-border-default bg-bg-surface">
          <DialogTitle className="text-xl font-bold tracking-tight text-text-primary">
            Nuevo Usuario
          </DialogTitle>
          <DialogDescription className="text-[13px] text-text-secondary mt-1">
            Registra personal médico o administrativo en MediSys
          </DialogDescription>
        </DialogHeader>

        {/* Stepper Visual */}
        <div className="px-6 pt-5 pb-4 border-b border-border-default dark:border-white/5 bg-bg-surface dark:bg-transparent">
          <div className="flex items-center justify-center max-w-md mx-auto">
            {stepsLabels.map((label, i) => (
              <div
                key={label}
                className="flex items-center flex-1 last:flex-none"
              >
                <div className="flex flex-col items-center gap-2 group">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border-2",
                      i < step && "bg-brand border-brand text-white",
                      i === step &&
                        "border-brand text-brand ring-4 ring-brand/15 dark:ring-brand/10 bg-white dark:bg-brand",
                      i === step &&
                        i === stepsLabels.length - 1 &&
                        "text-white",
                      i > step &&
                        "bg-bg-subtle dark:bg-white/5 text-text-muted border-border-default dark:border-white/10"
                    )}
                  >
                    {i < step ? <Check size={16} strokeWidth={3} /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-semibold tracking-tight transition-colors",
                      i === step ? "text-brand" : "text-text-muted"
                    )}
                  >
                    {label}
                  </span>
                </div>
                {i < stepsLabels.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-3 mb-6 transition-colors duration-500",
                      i < step
                        ? "bg-brand"
                        : "bg-border-default dark:bg-white/10"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cuerpo del Formulario Scrollable */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col max-h-[60vh]"
        >
          <div className="flex-1 overflow-y-auto px-10 py-8 space-y-8 hide-scrollbar">
            {/* PASO 1 */}
            {step === 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-3">
                <p className="text-[11px] font-bold text-text-muted dark:text-text-secondary uppercase tracking-wider">
                  Selecciona el tipo de perfil
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ROLES_OPTIONS.map((r) => {
                    const Icon = r.icon;
                    const isActive = selectedRole === r.value;
                    return (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setValue("role", r.value)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border text-center transition-all duration-200 h-36 group",
                          "hover:scale-[1.02] active:scale-[0.98]",
                          isActive
                            ? cn(
                                r.bg, // mantiene el color del rol
                                "ring-2 ring-offset-2 ring-current shadow-md border-transparent"
                              )
                            : "border-border-default dark:border-white/5 bg-bg-surface dark:bg-white/5 hover:border-border-strong dark:hover:border-white/20"
                        )}
                      >
                        <div
                          className={cn(
                            "p-2.5 rounded-xl border transition-all duration-300",
                            "bg-linear-to-br from-white/50 to-transparent",
                            r.bg,
                            isActive
                              ? "shadow-md scale-105"
                              : "group-hover:shadow-md transition-shadow"
                          )}
                        >
                          <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                        </div>
                        <div>
                          <p
                            className={cn(
                              "text-sm font-semibold tracking-tight",
                              isActive
                                ? "text-current"
                                : "text-text-primary dark:text-white"
                            )}
                          >
                            {r.label}
                          </p>
                          <p className="text-[11.5px] text-text-secondary dark:text-text-disabled mt-1 leading-snug">
                            {r.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PASO 2 */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-5">
                <Divider label="Datos Personales" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <FormField
                    label="Nombre *"
                    error={errors.firstName?.message}
                    colSpan={1}
                  >
                    <input
                      {...register("firstName")}
                      placeholder="Ej. Carlos"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField
                    label="Segundo nombre"
                    error={errors.middleName?.message}
                    colSpan={1}
                  >
                    <input
                      {...register("middleName")}
                      placeholder="(opcional)"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField
                    label="Apellido paterno *"
                    error={errors.lastNamePaternal?.message}
                  >
                    <input
                      {...register("lastNamePaternal")}
                      placeholder="Ej. Rivera"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField
                    label="Apellido materno *"
                    error={errors.lastNameMaternal?.message}
                  >
                    <input
                      {...register("lastNameMaternal")}
                      placeholder="Ej. Díaz"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                </div>

                <Divider label="Seguridad y Acceso" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <FormField
                    label="Email institucional *"
                    error={errors.email?.message}
                    colSpan={2}
                  >
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="carlos.rivera@medisys.mx"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField
                    label="Contraseña temporal *"
                    error={errors.password?.message}
                  >
                    <input
                      {...register("password")}
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField
                    label="Teléfono de contacto"
                    error={errors.phone?.message}
                  >
                    <input
                      {...register("phone")}
                      placeholder="811 000 0000"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                </div>
              </div>
            )}

            {/* PASO 3 */}
            {step === 2 && isSelectedDoctor && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-5">
                <Divider label="Información Profesional" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <FormField
                    label="Cédula profesional *"
                    error={errors.professionalLicense?.message}
                    colSpan={2}
                  >
                    <input
                      {...register("professionalLicense")}
                      placeholder="12345678"
                      className="h-10 rounded-xl w-full font-mono tracking-wider"
                    />
                  </FormField>
                  <FormField
                    label="Especialidad"
                    error={errors.specialty?.message}
                  >
                    <input
                      {...register("specialty")}
                      placeholder="Ej. Pediatría"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField
                    label="Universidad de egreso"
                    error={errors.university?.message}
                  >
                    <input
                      {...register("university")}
                      placeholder="Ej. UNAM"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField
                    label="Título completo para recetas"
                    error={errors.fullTitle?.message}
                    colSpan={2}
                  >
                    <input
                      {...register("fullTitle")}
                      placeholder="Dr. Carlos Rivera Díaz - Pediatra Biólogo"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                </div>

                <Divider label="Dirección de Consultorio" />
                <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                  <FormField
                    label="Calle y cruzamientos *"
                    error={errors.address?.message}
                    colSpan={2}
                  >
                    <input
                      {...register("address")}
                      placeholder="Av. Universidad #123"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField
                    label="Número/piso *"
                    error={errors.numHome?.message}
                  >
                    <input
                      {...register("numHome")}
                      placeholder="Cons. 401"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField
                    label="Colonia/Sector *"
                    error={errors.colony?.message}
                  >
                    <input
                      {...register("colony")}
                      placeholder="Cumbres 3er Sector"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField label="Ciudad *" error={errors.city?.message}>
                    <input
                      {...register("city")}
                      placeholder="Monterrey"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField label="Estado *" error={errors.state?.message}>
                    <input
                      {...register("state")}
                      placeholder="Nuevo León"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                  <FormField
                    label="Código postal *"
                    error={errors.zipCode?.message}
                    colSpan={2}
                  >
                    <input
                      {...register("zipCode")}
                      placeholder="64000"
                      className="text-text-primary placeholder:text-text-disabled"
                    />
                  </FormField>
                </div>
              </div>
            )}

            {serverError && <ErrorMessage message={serverError} />}
          </div>

          {/* Footer del Modal */}
          <div className="px-10 py-6 border-t border-border-default bg-bg-base mt-auto">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2.5 text-sm font-medium rounded-xl border border-border-default text-text-secondary hover:bg-bg-subtle transition-colors"
              >
                {step === 0 ? "Cancelar" : "Anterior"}
              </button>

              {step < stepsLabels.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl transition-all
                             bg-brand hover:bg-brand-hover shadow-lg shadow-brand/15 dark:shadow-brand/10"
                >
                  Continuar
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-8 py-2.5 text-sm font-semibold text-white rounded-xl bg-linear-to-br from-brand-gradient-from to-brand-gradient-to shadow-lg shadow-brand/20 hover:opacity-90 transition-all"
                >
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                  {isSelectedDoctor ? "Crear perfil médico" : "Crear usuario"}
                </button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Sub-componentes visuales
function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 py-1">
      <div className="flex-1 h-px bg-border-default dark:bg-white/5" />
      <span className="text-[11px] font-bold text-text-muted dark:text-text-secondary uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border-default dark:bg-white/5" />
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 animate-in shake">
      <p className="text-[13px] text-red-700 dark:text-red-400 font-medium leading-relaxed font-body">
        {message}
      </p>
    </div>
  );
}
