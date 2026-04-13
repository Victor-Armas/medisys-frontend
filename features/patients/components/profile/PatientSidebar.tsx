"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Mail, MapPin, Star, Globe, MoreVertical, Plus, Pencil, Printer, Loader2, CheckCircle2, X } from "lucide-react";
import { isAxiosError } from "axios";
import { cn } from "@/shared/lib/utils";
import {
  BLOOD_TYPE_LABELS,
  GENDER_LABELS,
  getPatientAge,
  type Patient,
  type PatientAddress,
  MARITAL_STATUS_LABELS,
  EDUCATION_LABELS,
  formatPhone,
} from "../../types/patient.types";
import type { AddressFormData } from "../../validations/patient.schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { SectionAddress } from "../sections/SectionAddress";
import { useAddPatientAddress, useUpdatePatientAddress } from "../../hooks/usePatients";
import { notify } from "@/shared/ui/toaster";
import Link from "next/link";
import { formatDate } from "@/shared/utils/date.utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
  patient: Patient;
  fullName: string;
  hasEditPermission: boolean;
}

interface FormWrapper {
  address: AddressFormData;
}

type DialogState = {
  open: boolean;
  mode: "add" | "edit";
  address?: PatientAddress;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildEmpty(isPrimary = false): AddressFormData {
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

function addressToForm(addr: PatientAddress): AddressFormData {
  return {
    country: addr.country ?? "MX",
    isPrimary: addr.isPrimary,
    postalCodeId: undefined,
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

function buildPayload(data: AddressFormData) {
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
  return {
    country: data.country,
    isPrimary: data.isPrimary ?? false,
    foreignState: data.state || data.foreignState || undefined,
    foreignCity: data.municipality || data.foreignCity || undefined,
    foreignPostalCode: data.postalCodeInput || data.foreignPostalCode || undefined,
    foreignAddressLine: data.street || data.foreignAddressLine || undefined,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PatientSidebar({ patient, fullName, hasEditPermission }: Props) {
  const [dialog, setDialog] = useState<DialogState>({ open: false, mode: "add" });

  const addAddress = useAddPatientAddress();
  const updateAddress = useUpdatePatientAddress();
  const isSaving = addAddress.isPending || updateAddress.isPending;

  const methods = useForm<FormWrapper>({
    defaultValues: { address: buildEmpty(patient.addresses.length === 0) },
  });

  const age = getPatientAge(patient.birthDate);

  formatDate(patient.birthDate);

  // Primary address first
  const sortedAddresses = [...patient.addresses].sort((a, b) => (a.isPrimary ? -1 : b.isPrimary ? 1 : 0));

  function openAdd() {
    methods.reset({ address: buildEmpty(patient.addresses.length === 0) });
    setDialog({ open: true, mode: "add" });
  }

  function openEdit(addr: PatientAddress) {
    methods.reset({ address: addressToForm(addr) });
    setDialog({ open: true, mode: "edit", address: addr });
  }

  async function handleMarkPrimary(addr: PatientAddress) {
    const loadId = notify.loading("Actualizando…");
    try {
      await updateAddress.mutateAsync({
        patientId: patient.id,
        addressId: addr.id,
        payload: { isPrimary: true },
      });
      notify.success("Dirección marcada como principal", undefined, { id: loadId });
    } catch {
      notify.error("Error al actualizar", undefined, { id: loadId });
    }
  }

  async function onSubmit(data: FormWrapper) {
    const loadId = notify.loading(dialog.mode === "add" ? "Guardando dirección…" : "Actualizando dirección…");
    try {
      const payload = buildPayload(data.address);
      if (dialog.mode === "add") {
        await addAddress.mutateAsync({ patientId: patient.id, payload });
      } else if (dialog.address) {
        await updateAddress.mutateAsync({
          patientId: patient.id,
          addressId: dialog.address.id,
          payload,
        });
      }
      notify.success(dialog.mode === "add" ? "Dirección guardada" : "Dirección actualizada", undefined, { id: loadId });
      setDialog({ open: false, mode: "add" });
    } catch (err) {
      const msg = isAxiosError(err) ? (err.response?.data?.message as string | string[] | undefined) : null;
      notify.error(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al guardar"), undefined, { id: loadId });
    }
  }

  return (
    <>
      {/* ASIDE */}
      <aside className="w-[320px] h-[calc(100vh-80px)] sticky top-0 bg-white border-r border-slate-100 flex flex-col overflow-hidden rounded-l-md">
        {" "}
        {/* Nombre y Títulos */}
        <div className=" space-y-4 bg-linear-to-br from-brand-gradient-from to-brand-gradient-to px-3 py-6 rounded-tl-md">
          <h1 className="text-2xl font-bold text-white leading-tight pb-3">{fullName}</h1>
          <div className="flex flex-wrap gap-4">
            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {age} años · {GENDER_LABELS[patient.gender]}
            </span>
            {patient.bloodType && (
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                Tipo de Sangre: {BLOOD_TYPE_LABELS[patient.bloodType]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-white">
            <Mail size={14} />
            <span className="text-sm">{patient.email ? patient.email : "Sin correo proporcionado"}</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* General Information */}
          <section className="mb-8">
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Fecha de nacimiento</p>
                <p className="text-xs font-semibold text-slate-800">{formatDate(patient.birthDate)}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Ocupación</p>
                <p className="text-xs font-semibold text-slate-800">
                  {patient.occupation ? patient.occupation : "No porcionado"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Estado Civil</p>
                <p className="text-xs font-semibold text-slate-800">
                  {patient.maritalStatus ? MARITAL_STATUS_LABELS[patient.maritalStatus] : "No proporcionado"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Educación</p>
                <p className="text-xs font-semibold text-slate-800">
                  {patient.educationLevel ? EDUCATION_LABELS[patient.educationLevel] : "No proporcionado"}
                </p>
              </div>
            </div>
          </section>

          {/* Contact Details */}
          <section className="mb-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Detalle de contacto</h3>
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3">
              <p className="text-sm font-bold text-blue-900">{patient.phone ? formatPhone(patient.phone) : "No proporcionado"}</p>
              <p className="text-[10px] text-blue-500 font-medium">Primary Mobile</p>
            </div>
          </section>

          {/* Addresses */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">detalle de Domicilios</h3>
              {hasEditPermission && (
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1 text-[10px] font-semibold text-brand hover:text-brand-hover transition-colors"
                >
                  <Plus size={10} />
                  Agregar
                </button>
              )}
            </div>

            {sortedAddresses.length === 0 ? (
              <p className="text-xs text-text-disabled italic text-center py-4">Sin domicilio registrado</p>
            ) : (
              <div className="space-y-2 pb-2">
                {sortedAddresses.map((addr) => (
                  <AddressCard
                    key={addr.id}
                    address={addr}
                    hasEditPermission={hasEditPermission}
                    onEdit={() => openEdit(addr)}
                    onMarkPrimary={() => handleMarkPrimary(addr)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Identification */}
          <section className="mb-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">CURP / Identificación</h3>
            <div className="bg-blue-50/30 border border-blue-100 rounded-lg p-3 text-center">
              <p className="text-xs font-mono font-bold text-blue-800 tracking-[0.2em]">
                {patient.curp ? patient.curp : "Sin curp proporcionada"}
              </p>
            </div>
          </section>

          {/* Bottom Actions */}
          <div className="mt-auto space-y-2">
            <button className="flex items-center justify-center gap-2 w-full py-2 rounded-sm border border-border-default text-xs font-medium text-text-secondary hover:bg-bg-subtle transition-colors">
              <Printer size={12} />
              Imprimir expediente
            </button>
            {hasEditPermission && (
              <Link
                href={`/admin/patients/${patient.id}/edit`}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-sm bg-brand text-white text-xs font-semibold hover:bg-brand-hover transition-colors"
              >
                <Pencil size={12} />
                Editar datos del paciente
              </Link>
            )}
          </div>
        </div>
      </aside>

      {/* ── Address add/edit dialog ── */}
      <Dialog open={dialog.open} onOpenChange={(open) => setDialog((p) => ({ ...p, open }))}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{dialog.mode === "add" ? "Agregar dirección" : "Editar dirección"}</DialogTitle>
          </DialogHeader>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <SectionAddress />
              <div className="flex gap-3 pt-5">
                <button
                  type="button"
                  onClick={() => setDialog((p) => ({ ...p, open: false }))}
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
                  {dialog.mode === "add" ? "Guardar" : "Actualizar"}
                </button>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ── AddressCard ───────────────────────────────────────────────────────────────

function AddressCard({
  address,
  hasEditPermission,
  onEdit,
  onMarkPrimary,
}: {
  address: PatientAddress;
  hasEditPermission: boolean;
  onEdit: () => void;
  onMarkPrimary: () => void;
}) {
  const isMx = !address.country || address.country === "MX";

  const line1 = address.street ? `${address.street}${address.extNumber ? ` #${address.extNumber}` : ""}` : null;
  const cityLine = address.postalCode
    ? `${address.postalCode.municipality.name}, ${address.postalCode.municipality.state.name}`
    : address.foreignCity
      ? `${address.foreignCity}${address.foreignState ? `, ${address.foreignState}` : ""}`
      : null;

  return (
    <div
      className={cn(
        "rounded-md border p-2.5 relative",
        address.isPrimary ? "border-brand/30 bg-brand/5" : "border-border-default bg-bg-base/50",
      )}
    >
      <div className="flex items-start gap-2">
        {/* Icon */}
        <div className={cn("mt-0.5 shrink-0", address.isPrimary ? "text-brand" : "text-text-disabled")}>
          {isMx ? <MapPin size={12} /> : <Globe size={12} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            {address.isPrimary && <Star size={8} className="fill-brand text-brand shrink-0" />}
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider truncate">
              {address.isPrimary ? "Principal" : isMx ? "México" : address.country}
            </span>
          </div>
          {line1 && <p className="text-[11px] text-text-primary truncate">{line1}</p>}
          {address.neighborhood?.name && <p className="text-[11px] text-text-secondary truncate">{address.neighborhood.name}</p>}
          {cityLine && <p className="text-[11px] text-text-secondary truncate">{cityLine}</p>}
          {address.postalCode?.code && <p className="text-[10px] text-text-disabled">C.P. {address.postalCode.code}</p>}
        </div>

        {/* 3-dot menu */}
        {hasEditPermission && (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="p-0.5 rounded text-text-disabled hover:text-text-primary hover:bg-bg-subtle transition-colors shrink-0 mt-0.5" />
              }
            >
              <MoreVertical size={12} />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil size={11} className="mr-1.5" />
                Editar
              </DropdownMenuItem>
              {!address.isPrimary && (
                <DropdownMenuItem onClick={onMarkPrimary}>
                  <Star size={11} className="mr-1.5" />
                  Marcar como principal
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <X size={11} className="mr-1.5" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
