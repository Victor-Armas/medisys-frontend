"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { MapPin, Plus, CheckCircle2, Loader2, Star, Pencil, X, Globe } from "lucide-react";
import { isAxiosError } from "axios";

import { useAddPatientAddress, useUpdatePatientAddress } from "../../hooks/usePatients";
import { SectionAddress } from "../sections/SectionAddress";
import { notify } from "@/shared/ui/toaster";
import { cn } from "@/shared/lib/utils";
import type { PatientAddress, CreatePatientAddressPayload } from "../../types/patient.types";
import type { AddressFormData } from "../../validations/patient.schema";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FormWrapper {
  address: AddressFormData;
}

type PanelMode = "add" | "edit";

interface EditingState {
  mode: PanelMode;
  addressId?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  addresses: PatientAddress[];
  canEdit: boolean;
}

export function PatientAddressTab({ patientId, addresses, canEdit }: Props) {
  const [editing, setEditing] = useState<EditingState | null>(null);

  const addAddress = useAddPatientAddress();
  const updateAddress = useUpdatePatientAddress();
  const isSaving = addAddress.isPending || updateAddress.isPending;

  const methods = useForm<FormWrapper>({
    defaultValues: { address: buildDefaultValues(addresses.length === 0) },
  });

  // ── Panel control ──────────────────────────────────────────────────────────

  function openAdd() {
    methods.reset({ address: buildDefaultValues(addresses.length === 0) });
    setEditing({ mode: "add" });
  }

  function openEdit(addr: PatientAddress) {
    methods.reset({ address: addressToFormData(addr) });
    setEditing({ mode: "edit", addressId: addr.id });
  }

  function closePanel() {
    setEditing(null);
    methods.reset({ address: buildDefaultValues() });
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function onSubmit(data: FormWrapper) {
    if (!editing) return;

    const loadId = notify.loading(editing.mode === "add" ? "Guardando dirección…" : "Actualizando dirección…");

    try {
      const payload = buildAddressPayload(data.address);

      if (editing.mode === "add") {
        await addAddress.mutateAsync({ patientId, payload });
      } else if (editing.addressId) {
        await updateAddress.mutateAsync({
          patientId,
          addressId: editing.addressId,
          payload,
        });
      }

      notify.success(editing.mode === "add" ? "Dirección guardada" : "Dirección actualizada", undefined, { id: loadId });
      closePanel();
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message as string | string[] | undefined;
        notify.error(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al guardar"), undefined, { id: loadId });
      } else {
        notify.error("Error inesperado", undefined, { id: loadId });
      }
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Empty state */}
      {addresses.length === 0 && !editing && (
        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-bg-subtle flex items-center justify-center">
            <MapPin size={20} className="text-text-disabled" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-secondary">Sin domicilio registrado</p>
            <p className="text-xs text-text-disabled mt-0.5">Registra el domicilio principal del paciente.</p>
          </div>
          {canEdit && (
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors"
            >
              <Plus size={14} />
              Agregar dirección
            </button>
          )}
        </div>
      )}

      {/* Address cards */}
      {addresses.map((addr) => (
        <AddressCard
          key={addr.id}
          address={addr}
          canEdit={canEdit}
          isBeingEdited={editing?.mode === "edit" && editing.addressId === addr.id}
          onEdit={() => openEdit(addr)}
        />
      ))}

      {/* Edit/Add panel — uno solo abierto a la vez */}
      {editing && (
        <div className="bg-bg-base border border-brand/30 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-default bg-bg-surface">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-brand" />
              <h4 className="text-sm font-semibold text-text-primary">
                {editing.mode === "add" ? "Nueva dirección" : "Editar dirección"}
              </h4>
            </div>
            <button
              onClick={closePanel}
              className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="p-5 space-y-4">
              <SectionAddress />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePanel}
                  className="flex-1 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:bg-bg-subtle transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-60"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                  {editing.mode === "add" ? "Guardar dirección" : "Actualizar dirección"}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      )}

      {/* Add button */}
      {canEdit && !editing && addresses.length > 0 && (
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-border-strong rounded-xl text-sm font-medium text-text-secondary hover:text-brand hover:border-brand/40 transition-colors w-full justify-center"
        >
          <Plus size={15} />
          Agregar otra dirección
        </button>
      )}
    </div>
  );
}

// ── Address Card ──────────────────────────────────────────────────────────────

function AddressCard({
  address,
  canEdit,
  isBeingEdited,
  onEdit,
}: {
  address: PatientAddress;
  canEdit: boolean;
  isBeingEdited: boolean;
  onEdit: () => void;
}) {
  const isMx = !address.country || address.country === "MX";
  const lines = buildAddressLines(address);

  return (
    <div
      className={cn(
        "p-4 rounded-2xl border transition-all",
        isBeingEdited
          ? "border-brand/40 bg-brand/5 opacity-60"
          : address.isPrimary
            ? "border-brand/30 bg-brand/5"
            : "border-border-default bg-bg-base/50",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "p-2 rounded-xl shrink-0 mt-0.5",
            address.isPrimary ? "bg-brand/10 text-brand" : "bg-bg-subtle text-text-secondary",
          )}
        >
          {isMx ? <MapPin size={14} /> : <Globe size={14} />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                {isMx ? "México" : address.country}
              </span>
              {address.isPrimary && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-md">
                  <Star size={8} className="fill-brand" />
                  Principal
                </span>
              )}
            </div>

            {canEdit && !isBeingEdited && (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-text-secondary border border-border-default hover:text-brand hover:border-brand/40 transition-colors shrink-0"
              >
                <Pencil size={11} />
                Editar
              </button>
            )}
          </div>

          <div className="mt-1.5 space-y-0.5">
            {lines.length > 0 ? (
              lines.map((line, i) => (
                <p key={i} className="text-sm text-text-primary leading-relaxed">
                  {line}
                </p>
              ))
            ) : (
              <p className="text-sm text-text-disabled italic">Sin detalles de dirección</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pure helpers ──────────────────────────────────────────────────────────────

function buildDefaultValues(isPrimary = false): AddressFormData {
  return {
    country: "MX",
    isPrimary,
    postalCodeId: undefined,
    neighborhoodId: undefined,
    street: "",
    extNumber: "",
    intNumber: "",
    municipality: "",
    state: "",
    postalCodeInput: "",
    neighborhoodInput: "",
    foreignState: "",
    foreignCity: "",
    foreignPostalCode: "",
    foreignAddressLine: "",
  };
}

function addressToFormData(addr: PatientAddress): AddressFormData {
  return {
    country: addr.country ?? "MX",
    isPrimary: addr.isPrimary,
    postalCodeId: undefined, // no se expone en el select del backend
    neighborhoodId: undefined,
    street: addr.street ?? "",
    extNumber: addr.extNumber ?? "",
    intNumber: addr.intNumber ?? "",
    municipality: addr.postalCode?.municipality?.name ?? "",
    state: addr.postalCode?.municipality?.state?.name ?? "",
    postalCodeInput: addr.postalCode?.code ?? "",
    neighborhoodInput: addr.neighborhood?.name ?? "",
    foreignState: addr.foreignState ?? "",
    foreignCity: addr.foreignCity ?? "",
    foreignPostalCode: addr.foreignPostalCode ?? "",
    foreignAddressLine: addr.foreignAddressLine ?? "",
  };
}

function buildAddressPayload(data: AddressFormData): Partial<CreatePatientAddressPayload> {
  const isMx = !data.country || data.country === "MX";

  if (isMx) {
    return {
      country: "MX",
      isPrimary: data.isPrimary ?? false,
      postalCodeId: data.postalCodeId,
      neighborhoodId: data.neighborhoodId,
      street: data.street || undefined,
      extNumber: data.extNumber || undefined,
      intNumber: data.intNumber || undefined,
    };
  }

  // Para dirección extranjera reutilizamos los campos del formulario unificado
  return {
    country: data.country,
    isPrimary: data.isPrimary ?? false,
    foreignState: data.state || data.foreignState || undefined,
    foreignCity: data.municipality || data.foreignCity || undefined,
    foreignPostalCode: data.postalCodeInput || data.foreignPostalCode || undefined,
    foreignAddressLine: data.street || data.foreignAddressLine || undefined,
  };
}

function buildAddressLines(address: PatientAddress): string[] {
  const lines: string[] = [];

  if (address.street) {
    const streetLine = [
      address.street,
      address.extNumber ? `#${address.extNumber}` : null,
      address.intNumber ? `Int. ${address.intNumber}` : null,
    ]
      .filter(Boolean)
      .join(" ");
    lines.push(streetLine);
  }

  if (address.neighborhood?.name) lines.push(address.neighborhood.name);

  if (address.postalCode) {
    lines.push(
      `C.P. ${address.postalCode.code}, ${address.postalCode.municipality.name}, ${address.postalCode.municipality.state.name}`,
    );
  }

  if (address.foreignAddressLine) lines.push(address.foreignAddressLine);

  const foreignCity = [address.foreignCity, address.foreignState].filter(Boolean).join(", ");
  if (foreignCity) lines.push(foreignCity);

  if (address.foreignPostalCode) lines.push(`C.P. ${address.foreignPostalCode}`);

  return lines;
}
