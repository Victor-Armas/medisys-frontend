import { notify } from "@/shared/ui/toaster";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useCreateClinic, useUpdateClinic } from "@features/clinics/hooks";
import { createClinicSchema, type CreateClinicFormData } from "@features/clinics/schemas/clinic.schema";
import type { Clinic } from "@features/clinics/types/clinic.types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

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
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-encabezado">
            {isEdit ? "Editar consultorio" : "Nuevo consultorio"}
          </DialogTitle>
          <DialogDescription className="text-xs text-subtitulo mt-1">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            <Button type="button" variant="secundario" onClick={onClose} className="py-2">
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending} variant="primary" icon="guardar" className="py-2">
              {isPending ? "Guardando..." : isEdit ? "Guardar cambios" : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
