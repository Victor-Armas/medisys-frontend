import { notify } from "@/shared/ui/toaster";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useCreateClinic, useUpdateClinic } from "@features/clinics/hooks";
import { createClinicSchema, type CreateClinicFormData } from "@features/clinics/validations/clinic.schema";
import type { Clinic } from "@features/clinics/types/clinic.types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";

interface Props {
  clinic?: Clinic;
  onClose: () => void;
}

export function ClinicFormModal({ clinic, onClose }: Props) {
  const [serverError, setServerError] = useState("");
  const createClinic = useCreateClinic();
  const updateClinic = useUpdateClinic();
  const isPending = createClinic.isPending || updateClinic.isPending;
  const isEdit = !!clinic;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateClinicFormData>({
    resolver: zodResolver(createClinicSchema),
    defaultValues: clinic
      ? {
          name: clinic.name,
          phone: clinic.phone ?? "",
          email: clinic.email ?? "",
          address: clinic.address ?? "",
          city: clinic.city ?? "",
          state: clinic.state ?? "",
          zipCode: clinic.zipCode ?? "",
          rfc: clinic.rfc ?? "",
          professionalLicense: clinic.professionalLicense ?? "",
          // brandColor: clinic.brandColor ?? "",
          maxDoctors: clinic.maxDoctors,
        }
      : {
          maxDoctors: 1 as number,
        },
  });

  async function onSubmit(data: CreateClinicFormData) {
    setServerError("");

    try {
      if (isEdit) {
        if (clinic.doctorClinics.length > data.maxDoctors) {
          notify.error(`No puedes establecer un máximo menor a ${clinic.doctorClinics.length} médicos asignados actualmente.`);
          return;
        }
      }
      const loadId = notify.loading(isEdit ? "Actualizando consultorio..." : "Creando consultorio...");
      if (isEdit) {
        await updateClinic.mutateAsync({
          id: clinic.id,
          payload: data,
        });
      } else {
        await createClinic.mutateAsync(data);
      }
      notify.success(isEdit ? "Consultorio actualizado correctamente" : "Consultorio creado correctamente", undefined, {
        id: loadId,
      });
      onClose();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        const errorMsg = Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al guardar el consultorio");
        setServerError(errorMsg);
        notify.error(errorMsg);
      } else {
        notify.error("Error inesperado al guardar el consultorio");
      }
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0 rounded-2xl">
        <DialogHeader className="px-8 py-6 border-b border-border-default">
          <DialogTitle className="text-lg font-bold text-text-primary">
            {isEdit ? "Editar consultorio" : "Nuevo consultorio"}
          </DialogTitle>
          <DialogDescription className="text-xs text-text-secondary mt-1">
            {isEdit ? "Modifica los datos del consultorio" : "Registra un nuevo consultorio o sede"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6 space-y-5 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Nombre del consultorio *" error={errors.name?.message} {...register("name")} />
            </div>
            <Input label="Teléfono" error={errors.phone?.message} {...register("phone")} />
            <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
            <div className="col-span-2">
              <Input label="Dirección" error={errors.address?.message} {...register("address")} />
            </div>
            <Input label="Ciudad" error={errors.city?.message} {...register("city")} />
            <Input label="Estado" error={errors.state?.message} {...register("state")} />
            <Input label="Código postal" error={errors.zipCode?.message} {...register("zipCode")} />
            <Input label="RFC" error={errors.rfc?.message} {...register("rfc")} />
            <div className="col-span-2">
              <Input
                label="Cédula profesional del consultorio"
                error={errors.professionalLicense?.message}
                {...register("professionalLicense")}
              />
            </div>
            {/* <Input
              label="Color de marca (ej: #534AB7)"
              error={errors.brandColor?.message}
              {...register("brandColor")}
            /> */}
            <Input
              label="Máx. médicos simultáneos"
              type="number"
              error={errors.maxDoctors?.message}
              {...register("maxDoctors", { valueAsNumber: true })}
            />
          </div>

          {serverError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20">
              <p className="text-xs text-red-700 dark:text-red-400 font-medium">{serverError}</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:bg-bg-subtle transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-60"
            >
              {isPending ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear consultorio"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
