"use client";

import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { isAxiosError } from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { notify } from "@/shared/ui/toaster";
import { SectionAddress } from "../../create/sections/SectionAddress";
import { useAddPatientAddress, useUpdatePatientAddress } from "../../hooks/usePatientAddresses";
import { addressToForm, buildAddressPayload, buildEmptyAddress } from "../../adapters/patient.adapters";
import type { PatientAddress } from "../../types/patient.types";
import type { AddressFormData } from "../../schemas/patient.schema";

interface Props {
  open: boolean;
  mode: "add" | "edit";
  patientId: string;
  address?: PatientAddress;
  isFirstAddress: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormWrapper {
  address: AddressFormData;
}

export function AddressDialog({ open, mode, patientId, address, isFirstAddress, onOpenChange }: Props) {
  const addAddress = useAddPatientAddress();
  const updateAddress = useUpdatePatientAddress();

  const methods = useForm<FormWrapper>({
    defaultValues: {
      address: address ? addressToForm(address) : buildEmptyAddress(isFirstAddress),
    },
  });

  useEffect(() => {
    methods.reset({
      address: address ? addressToForm(address) : buildEmptyAddress(isFirstAddress),
    });
  }, [address, isFirstAddress, methods]);

  async function onSubmit(data: FormWrapper) {
    const loadId = notify.loading(mode === "add" ? "Guardando dirección…" : "Actualizando dirección…");

    try {
      const payload = buildAddressPayload(data.address);

      if (mode === "add") {
        await addAddress.mutateAsync({ patientId, payload });
        notify.success("Dirección guardada", undefined, { id: loadId });
      } else if (address) {
        await updateAddress.mutateAsync({ patientId, addressId: address.id, payload });
        notify.success("Dirección actualizada", undefined, { id: loadId });
      }

      onOpenChange(false);
    } catch (err) {
      const msg = isAxiosError(err) ? err.response?.data?.message : null;
      notify.error(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al guardar"), undefined, { id: loadId });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Agregar domicilio" : "Editar domicilio"}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form id="address-dialog-form" className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
            <SectionAddress />
            <DialogFooter className="pt-4">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-xl border px-4 py-2 text-sm font-semibold text-subtitulo hover:border-subtitulo hover:bg-subtitulo/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={addAddress.isPending || updateAddress.isPending}
                className="rounded-xl bg-principal px-4 py-2 text-sm font-semibold text-white hover:bg-principal-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {addAddress.isPending || updateAddress.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={16} />
                )}
                {mode === "add" ? "Guardar" : "Actualizar"}
              </button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
