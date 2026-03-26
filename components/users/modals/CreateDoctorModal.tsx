"use client";
// Crear doctor desde cero con un stepper de 3 pasos para no saturar el formulario.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { ModalOverlay } from "@/components/ui/ModalOverlay";
import { FormField } from "@/components/ui/FormField";
import {
  ModalHeader,
  Divider,
  ErrorMessage,
  ModalFooter,
} from "./CreateUserModal";
import { isAxiosError } from "axios";
import { useCreateDoctor } from "@/hooks/useUsers";
import { DoctorFormData, doctorFormSchema } from "@/validations/doctor.schema";

const STEPS = ["Cuenta", "Perfil médico", "Dirección"];

// Campos que se validan en cada paso antes de avanzar
const STEP_FIELDS: (keyof DoctorFormData)[][] = [
  ["email", "password", "firstName", "lastNamePaternal", "lastNameMaternal"],
  ["professionalLicense"],
  ["address", "city", "state", "zipCode"],
];

export function CreateDoctorModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState("");
  const { mutateAsync, isPending } = useCreateDoctor();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorFormSchema),
  });

  async function nextStep() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  }

  async function onSubmit(data: DoctorFormData) {
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
      <div className="bg-bg-surface rounded-2xl border border-border-default shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <ModalHeader
          title="Nuevo médico"
          subtitle="Crea la cuenta y el perfil profesional"
          onClose={onClose}
        />

        {/* Stepper */}
        <div className="flex items-center px-6 py-4 border-b border-border-default gap-0">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                  ${
                                    i < step
                                      ? "bg-brand text-white"
                                      : i === step
                                      ? "bg-brand text-white ring-4 ring-brand/20"
                                      : "bg-bg-subtle text-text-muted border border-border-default"
                                  }`}
                >
                  {i < step ? <Check size={13} /> : i + 1}
                </div>
                <span
                  className={`text-[10px] font-semibold whitespace-nowrap ${
                    i === step ? "text-brand" : "text-text-muted"
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 mb-4 transition-colors ${
                    i < step ? "bg-brand" : "bg-border-default"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">
          {/* Paso 1: Cuenta */}
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Nombre(s) *"
                  error={errors.firstName?.message}
                >
                  <input {...register("firstName")} placeholder="Carolina" />
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
                  <input
                    {...register("lastNamePaternal")}
                    placeholder="Cervantes"
                  />
                </FormField>
                <FormField
                  label="Apellido materno *"
                  error={errors.lastNameMaternal?.message}
                >
                  <input
                    {...register("lastNameMaternal")}
                    placeholder="Arellano"
                  />
                </FormField>
              </div>
              <Divider label="Acceso" />
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormField label="Email *" error={errors.email?.message}>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="dra@clinica.mx"
                    />
                  </FormField>
                </div>
                <FormField
                  label="Contraseña *"
                  error={errors.password?.message}
                >
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
            </>
          )}

          {/* Paso 2: Perfil médico */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField
                  label="Cédula profesional *"
                  error={errors.professionalLicense?.message}
                >
                  <input
                    {...register("professionalLicense")}
                    placeholder="14483297"
                    className="font-mono"
                  />
                </FormField>
              </div>
              <FormField label="Especialidad" error={errors.specialty?.message}>
                <input
                  {...register("specialty")}
                  placeholder="Medicina General"
                />
              </FormField>
              <FormField label="Universidad" error={errors.university?.message}>
                <input {...register("university")} placeholder="UANL" />
              </FormField>
              <div className="col-span-2">
                <FormField
                  label="Título completo para recetas"
                  error={errors.fullTitle?.message}
                >
                  <input
                    {...register("fullTitle")}
                    placeholder="Dra. Carolina Cervantes Arellano"
                  />
                </FormField>
              </div>
            </div>
          )}

          {/* Paso 3: Dirección */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField label="Domicilio *" error={errors.address?.message}>
                  <input
                    {...register("address")}
                    placeholder="Lerdo de Tejada #101-A Col. San Martín"
                  />
                </FormField>
                <FormField
                  label="Numero de Casa *"
                  error={errors.numHome?.message}
                >
                  <input
                    {...register("numHome")}
                    placeholder="Numero de casa EJ: 12"
                  />
                </FormField>
                <FormField label="Colonia *" error={errors.colony?.message}>
                  <input
                    {...register("colony")}
                    placeholder="Nombre de la colonia"
                  />
                </FormField>
              </div>
              <FormField label="Ciudad *" error={errors.city?.message}>
                <input {...register("city")} placeholder="García" />
              </FormField>
              <FormField label="Estado *" error={errors.state?.message}>
                <input {...register("state")} placeholder="Nuevo León" />
              </FormField>
              <FormField
                label="Código postal *"
                error={errors.zipCode?.message}
              >
                <input {...register("zipCode")} placeholder="66005" />
              </FormField>
            </div>
          )}

          {serverError && <ErrorMessage message={serverError} />}

          {/* Navegación del stepper */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => (step > 0 ? setStep((s) => s - 1) : onClose())}
              className="px-4 py-2.5 text-sm font-medium text-text-primary border border-border-default rounded-xl hover:bg-bg-subtle transition-colors"
            >
              {step === 0 ? "Cancelar" : "Anterior"}
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-5 py-2.5 text-sm font-medium bg-brand text-white rounded-xl hover:bg-brand-hover transition-colors"
              >
                Continuar
              </button>
            ) : (
              <ModalFooter
                onCancel={() => setStep((s) => s - 1)}
                isPending={isPending}
                label="Crear médico"
              />
            )}
          </div>
        </form>
      </div>
    </ModalOverlay>
  );
}
