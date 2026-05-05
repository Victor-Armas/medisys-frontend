"use client";

import { useState } from "react";
import { Mail, Phone, Calendar, MapPin, Globe, Plus, Pencil } from "lucide-react";
import Link from "next/link";
import { BLOOD_TYPE_LABELS, GENDER_LABELS } from "../constants/patient.constants";
import { getPatientAge, formatPhone } from "../utils/patient.utils";
import { formatDate } from "@/shared/utils/date.utils";
import { BT_BADGE } from "../constants/bloodType.constants";
import { cn } from "@/shared/lib/utils";
import { AddressDialog } from "./sidebar/AddressDialog";
import { useUpdatePatientAddress } from "../hooks/usePatientAddresses";
import { notify } from "@/shared/ui/toaster";
import type { Patient, PatientAddress } from "../types/patient.types";

interface Props {
  patient: Patient;
  fullName: string;
  hasEditPermission: boolean;
  showAddressSection: boolean;
}

type DialogState = { open: boolean; mode: "add" | "edit"; address?: PatientAddress };

export function PatientHeader({ patient, fullName, hasEditPermission, showAddressSection }: Props) {
  const [dialog, setDialog] = useState<DialogState>({ open: false, mode: "add" });
  const updateAddress = useUpdatePatientAddress();
  const age = getPatientAge(patient.birthDate);
  const initials = `${patient.firstName[0] ?? ""}${patient.lastNamePaternal[0] ?? ""}`.toUpperCase();
  const sortedAddresses = [...patient.addresses].sort((a, b) => (a.isPrimary ? -1 : b.isPrimary ? 1 : 0));

  async function handleMarkPrimary(addr: PatientAddress) {
    const loadId = notify.loading("Actualizando…");
    try {
      await updateAddress.mutateAsync({ patientId: patient.id, addressId: addr.id, payload: { isPrimary: true } });
      notify.success("Dirección principal actualizada", undefined, { id: loadId });
    } catch {
      notify.error("Error al actualizar", undefined, { id: loadId });
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Top strip: avatar + name + quick info */}
      <div className="flex flex-col sm:flex-row items-start gap-4 px-6 py-5 bg-interior shadow-sm">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-md  bg-principal-gradient backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-md">
          {initials}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-encabezado">{fullName}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="text-subtitulo text-sm">{age} años</span>
            <span className="text-subtitulo">·</span>
            <span className="text-subtitulo text-sm">{GENDER_LABELS[patient.gender]}</span>
            {patient.bloodType && (
              <>
                <span className="text-subtitulo">·</span>
                <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-md border", BT_BADGE[patient.bloodType])}>
                  {BLOOD_TYPE_LABELS[patient.bloodType]}
                </span>
              </>
            )}
            {patient.curp && (
              <>
                <span className="text-subtitulo">·</span>
                <span className="text-subtitulo text-[11px] font-mono">{patient.curp}</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        {hasEditPermission && (
          <Link
            href={`/admin/patients/${patient.id}/edit`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            <Pencil size={12} /> Editar
          </Link>
        )}
      </div>

      {/* Info pills row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 bg-interior shadow-sm">
        <InfoPill icon={Mail} label="Email" value={patient.email ?? "No registrado"} />
        <InfoPill icon={Phone} label="Teléfono (Móvil)" value={patient.phone ? formatPhone(patient.phone) : "No registrado"} />
        <InfoPill icon={Calendar} label="Fecha de Nacimiento" value={formatDate(patient.birthDate)} />
      </div>

      {/* Addresses UI moved to ExpedienteBaseTab */}
      {showAddressSection && (
        <> 
          {/* Addresses row */}
          {sortedAddresses.length > 0 && (
            <div className=" px-6 py-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-subtitulo">
                  <MapPin size={13} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Direcciones</span>
                </div>
                {hasEditPermission && (
                  <button
                    onClick={() => setDialog({ open: true, mode: "add" })}
                    className="flex items-center gap-1 text-[10px] font-semibold text-principal hover:text-principal-hover transition-colors"
                  >
                    <Plus size={10} /> Agregar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sortedAddresses.map((addr) => (
                  <AddressChip
                    key={addr.id}
                    address={addr}
                    hasEditPermission={hasEditPermission}
                    onEdit={() => setDialog({ open: true, mode: "edit", address: addr })}
                    onMarkPrimary={() => handleMarkPrimary(addr)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty addresses */}
          {sortedAddresses.length === 0 && hasEditPermission && (
            <div className=" px-6 py-3 flex items-center gap-3 shadow-sm">
              <MapPin size={13} className="text-subtitulo" />
              <span className="text-xs text-subtitulo flex-1">Sin domicilio registrado</span>
              <button
                onClick={() => setDialog({ open: true, mode: "add" })}
                className="flex items-center gap-1 text-[10px] font-semibold text-principal hover:text-principal-hover transition-colors"
              >
                <Plus size={10} /> Agregar
              </button>
            </div>
          )}

          <AddressDialog
            open={dialog.open}
            mode={dialog.mode}
            patientId={patient.id}
            address={dialog.address}
            isFirstAddress={patient.addresses.length === 0}
            onOpenChange={(open) => setDialog((s) => ({ ...s, open }))}
          />
        </>
      )}

    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function InfoPill({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <div className="w-8 h-8 rounded-lg bg-inner-principal flex items-center justify-center shrink-0">
        <Icon size={14} className="text-principal" />
      </div>
      <div>
        <p className="text-[10px] text-subtitulo font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-encabezado">{value}</p>
      </div>
    </div>
  );
}

function AddressChip({
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
    : (address.foreignCity ?? null);

  return (
    <div
      className={cn(
        "relative rounded-lg px-3 py-2.5 text-xs group",
        address.isPrimary ? "bg-inner-principal border border-principal/20" : "bg-fondo-inputs border border-transparent",
      )}
    >
      <div className="flex items-start gap-2">
        {isMx ? (
          <MapPin size={11} className="text-principal shrink-0 mt-0.5" />
        ) : (
          <Globe size={11} className="text-subtitulo shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-subtitulo uppercase tracking-wider mb-0.5">
            {address.isPrimary ? "Principal (Casa)" : isMx ? "México" : address.country}
          </p>
          {line1 && <p className="text-encabezado font-medium truncate">{line1}</p>}
          {address.neighborhood?.name && <p className="text-subtitulo truncate">Col. {address.neighborhood.name}</p>}
          {cityLine && (
            <p className="text-subtitulo truncate">
              {cityLine}
              {address.postalCode?.code ? `, ${address.postalCode.code}` : ""}
            </p>
          )}
        </div>
      </div>
      {/* Hover actions */}
      {hasEditPermission && (
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="text-[9px] text-principal hover:underline font-semibold">
            Editar
          </button>
          {!address.isPrimary && (
            <button onClick={onMarkPrimary} className="text-[9px] text-subtitulo hover:text-principal font-semibold">
              · Principal
            </button>
          )}
        </div>
      )}
    </div>
  );
}
