// features/patients/components/profile/PatientAddressTab.tsx
"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { MapPin, Plus, CheckCircle2, Loader2 } from "lucide-react";
import { isAxiosError } from "axios";

import { useAddPatientAddress } from "../../hooks/usePatients";
import { SectionAddress } from "../sections/SectionAddress";
import { notify } from "@/shared/ui/toaster";
import { cn } from "@/shared/lib/utils";
import type { PatientAddress } from "../../types/patient.types";
import { AddressFormData } from "../../validations/patient.schema";

interface Props {
  patientId: string;
  addresses: PatientAddress[];
  canEdit: boolean;
}

interface TabAddressFormState {
  address: AddressFormData;
}

export function PatientAddressTab({ patientId, addresses, canEdit }: Props) {
  const [showForm, setShowForm] = useState(false);
  const addAddress = useAddPatientAddress();

  const methods = useForm<TabAddressFormState>({
    defaultValues: {
      address: {
        country: "MX",
        isPrimary: addresses.length === 0,
      },
    },
  });

  async function onSubmit(data: TabAddressFormState) {
    const loadId = notify.loading("Guardando dirección…");
    try {
      await addAddress.mutateAsync({
        patientId,
        payload: {
          country: data.address.country ?? "MX",
          isPrimary: data.address.isPrimary ?? false,
          street: data.address.street,
          extNumber: data.address.extNumber,
          intNumber: data.address.intNumber || undefined, // Evita enviar ""

          // MÉXICO:
          postalCodeId: data.address.postalCodeId,
          // Aquí está el truco:
          // Si el usuario escribió el nombre, necesitamos el ID.
          // Si no tienes el ID a mano, el backend debe permitir el string o tú debes buscarlo.
          neighborhoodId: data.address.neighborhoodId,

          // EXTRANJERO:
          // Si es extranjero, mapeamos lo que el usuario escribió en los campos foreign
          ...(data.address.country !== "MX" && {
            foreignState: data.address.state,
            foreignCity: data.address.municipality,
            foreignPostalCode: data.address.postalCodeInput,
          }),
        },
      });
      notify.success("Dirección guardada", undefined, { id: loadId });
      methods.reset();
      setShowForm(false);
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        notify.error(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al guardar"), undefined, { id: loadId });
      }
    }
  }

  return (
    <div className="space-y-5">
      {/* Lista de direcciones existentes */}
      {addresses.length === 0 && !showForm && (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center">
            <MapPin size={20} className="text-text-disabled" />
          </div>
          <p className="text-sm font-medium text-text-secondary">Sin domicilio registrado</p>
        </div>
      )}

      {addresses.map((addr) => (
        <AddressCard key={addr.id} address={addr} />
      ))}

      {/* Formulario nueva dirección */}
      {showForm && (
        <div className="bg-bg-base border border-border-default rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border-default bg-bg-surface">
            <MapPin size={14} className="text-brand" />
            <h4 className="text-sm font-semibold text-text-primary">Nueva dirección</h4>
          </div>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="p-5 space-y-4">
              <SectionAddress />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:bg-bg-subtle transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={methods.formState.isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-60"
                >
                  {methods.formState.isSubmitting ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Guardar dirección"}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      )}

      {/* Botón agregar */}
      {canEdit && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-border-strong rounded-xl text-sm font-medium text-text-secondary hover:text-brand hover:border-brand/40 transition-colors w-full justify-center"
        >
          <Plus size={15} />
          Agregar dirección
        </button>
      )}
    </div>
  );
}

function AddressCard({ address }: { address: PatientAddress }) {
  const lines = [
    address.street &&
      `${address.street}${address.extNumber ? ` #${address.extNumber}` : ""}${address.intNumber ? ` Int. ${address.intNumber}` : ""}`,
    address.neighborhood?.name,
    address.postalCode &&
      `C.P. ${address.postalCode.code}, ${address.postalCode.municipality.name}, ${address.postalCode.municipality.state.name}`,
    // Extranjero
    address.foreignAddressLine,
    [address.foreignCity, address.foreignState].filter(Boolean).join(", "),
    address.foreignPostalCode,
  ].filter(Boolean);

  return (
    <div
      className={cn(
        "p-4 rounded-2xl border",
        address.isPrimary ? "border-brand/30 bg-brand/5" : "border-border-default bg-bg-base/50",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "p-2 rounded-xl shrink-0",
            address.isPrimary ? "bg-brand/10 text-brand" : "bg-bg-subtle text-text-secondary",
          )}
        >
          <MapPin size={14} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              {address.country === "MX" ? "México" : address.country}
            </span>
            {address.isPrimary && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-md">
                <CheckCircle2 size={9} />
                Principal
              </span>
            )}
          </div>
          {lines.map((line, i) => (
            <p key={i} className="text-sm text-text-primary leading-relaxed">
              {line}
            </p>
          ))}
          {lines.length === 0 && <p className="text-sm text-text-disabled italic">Sin detalles de dirección</p>}
        </div>
      </div>
    </div>
  );
}
