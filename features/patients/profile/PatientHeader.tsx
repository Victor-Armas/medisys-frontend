"use client";

import { useState } from "react";
import { Mail, Phone, Calendar, MapPin, Plus, Pencil, Printer } from "lucide-react";
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
import { AddressCard } from "./sidebar/AddressCard";
import { Button } from "@/shared/ui/button";
import api from "@/shared/lib/api";

interface Props {
  patient: Patient;
  fullName: string;
  hasEditPermission: boolean;
  showAddressSection: boolean;
}

type DialogState = { open: boolean; mode: "add" | "edit"; address?: PatientAddress };

export function PatientHeader({ patient, fullName, hasEditPermission, showAddressSection }: Props) {
  const [dialog, setDialog] = useState<DialogState>({ open: false, mode: "add" });
  const [isPrinting, setIsPrinting] = useState(false);
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

  const handlePrintRecord = async () => {
    try {
      setIsPrinting(true);
      const res = await api.get(`/patients/${patient.id}/record-pdf`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      window.open(url, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      notify.error("Error", "No se pudo generar el expediente.");
    } finally {
      setIsPrinting(false);
    }
  };

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
          <h1 className="text-xl font-bold text-encabezado uppercase">{fullName}</h1>
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-wairning hover:bg-wairning-hover text-wairning-soft-text text-xs font-semibold rounded-sm transition-colors shrink-0"
          >
            <Pencil size={12} /> Editar
          </Link>
        )}
        <Button className="text-sm p-1 rounded-sm px-2" onClick={handlePrintRecord} disabled={isPrinting}>
          <Printer size={12} />
          {isPrinting ? "Generando PDF…" : "Imprimir"}
        </Button>
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
              <div className="flex items-center justify-between gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {sortedAddresses.map((addr) => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      hasEditPermission={hasEditPermission}
                      onEdit={() => setDialog({ open: true, mode: "edit", address: addr })}
                      onMarkPrimary={() => handleMarkPrimary(addr)}
                    />
                  ))}
                </div>
                {hasEditPermission && (
                  <div className="pl-5 ml-2 border-l-2 border-gray-300 dark:border-gray-600">
                    <Button icon="agregar" className="p-1" onClick={() => setDialog({ open: true, mode: "add" })} />
                  </div>
                )}
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
