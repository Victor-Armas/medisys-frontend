"use client";

// Asigna perfil médico a usuario ya existente en el sistema.

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAssignDoctorProfile } from "@/hooks/useUsers";
import { ModalOverlay } from "@/components/ui/ModalOverlay";
import { FormField } from "@/components/ui/FormField";
import {
  ModalHeader,
  Divider,
  ErrorMessage,
  ModalFooter,
} from "./CreateUserModal";
import {
  AssignDoctorFormData,
  assignDoctorSchema,
} from "@/validations/doctor.schema";
import { isAxiosError } from "axios";

export function AssignDoctorModal({ onClose }: { onClose: () => void }) {
  const [serverError, setServerError] = useState("");
  const { mutateAsync, isPending } = useAssignDoctorProfile();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssignDoctorFormData>({
    resolver: zodResolver(assignDoctorSchema),
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
    <ModalOverlay onClose={onClose}>
      <div className="bg-bg-surface rounded-2xl border border-border-default shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <ModalHeader
          title="Asignar perfil médico"
          subtitle="El usuario ya existe — agrega sus datos profesionales"
          onClose={onClose}
        />

        {/* Info box */}
        <div className="mx-6 mt-5 px-4 py-3 bg-brand/5 border border-brand/20 rounded-xl">
          <p className="text-xs text-brand font-medium">
            El rol del usuario cambiará automáticamente a{" "}
            <strong>Médico</strong> si no lo es ya.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-6 space-y-5">
          <FormField label="ID del usuario *" error={errors.userId?.message}>
            <input
              {...register("userId")}
              placeholder="UUID del usuario existente"
              className="font-mono text-xs"
            />
          </FormField>

          <Divider label="Datos profesionales" />

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
                  placeholder="Dr. Juan Pérez López"
                />
              </FormField>
            </div>
          </div>

          <Divider label="Dirección personal" />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <FormField label="Calle *" error={errors.address?.message}>
                <input
                  {...register("address")}
                  placeholder="Nombre de la calle"
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
            <FormField label="Código postal *" error={errors.zipCode?.message}>
              <input {...register("zipCode")} placeholder="66005" />
            </FormField>
          </div>

          {serverError && <ErrorMessage message={serverError} />}
          <ModalFooter
            onCancel={onClose}
            isPending={isPending}
            label="Asignar perfil"
          />
        </form>
      </div>
    </ModalOverlay>
  );
}
