"use client";

import { useState } from "react";
import { Mail, Plus, Pencil, Printer, Phone, IdCard } from "lucide-react";
import { BLOOD_TYPE_LABELS, GENDER_LABELS, MARITAL_STATUS_LABELS, EDUCATION_LABELS } from "../../constants/patient.constants";
import { getPatientAge, formatPhone } from "../../utils/patient.utils";
import type { Patient, PatientAddress } from "../../types/patient.types";
import { AddressCard } from "./AddressCard";
import { AddressDialog } from "./AddressDialog";
import { useUpdatePatientAddress } from "../../hooks/usePatientAddresses";
import { notify } from "@/shared/ui/toaster";
import Link from "next/link";
import { formatDate } from "@/shared/utils/date.utils";

interface Props {
  patient: Patient;
  fullName: string;
  hasEditPermission: boolean;
}

type DialogState = {
  open: boolean;
  mode: "add" | "edit";
  address?: PatientAddress;
};

export function PatientSidebar({ patient, fullName, hasEditPermission }: Props) {
  const [dialog, setDialog] = useState<DialogState>({ open: false, mode: "add" });
  const updateAddress = useUpdatePatientAddress();

  const age = getPatientAge(patient.birthDate);
  const sortedAddresses = [...patient.addresses].sort((a, b) => (a.isPrimary ? -1 : b.isPrimary ? 1 : 0));

  function openAdd() {
    setDialog({ open: true, mode: "add" });
  }

  function openEdit(addr: PatientAddress) {
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

  function handleDialogOpenChange(open: boolean) {
    setDialog((current) => ({ ...current, open }));
  }

  return (
    <>
      <aside className="w-[320px] h-[calc(100vh-80px)] sticky top-0 bg-interior flex flex-col overflow-hidden rounded-l-md">
        <div className="space-y-3 bg-principal-gradient px-3 py-6 rounded-tl-md shadow-lg">
          <h1 className="text-2xl font-bold text-white leading-tight pb-3">{fullName}</h1>
          <div className="flex flex-wrap gap-4">
            <span className="bg-inner-secundario text-secundario text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
              {age} años · {GENDER_LABELS[patient.gender]}
            </span>
            {patient.bloodType && (
              <span className="bg-negative text-negative-text text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                Tipo de Sangre: {BLOOD_TYPE_LABELS[patient.bloodType]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-white">
            <Mail size={14} />
            <span className="text-sm">{patient.email ?? "Sin correo proporcionado"}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <section className="mb-6">
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-[10px] text-subtitulo font-bold uppercase">Fecha de nacimiento</p>
                <p className="text-xs font-semibold text-encabezado">{formatDate(patient.birthDate)}</p>
              </div>
              <div>
                <p className="text-[10px] text-subtitulo font-bold uppercase">Ocupación</p>
                <p className="text-xs font-semibold text-encabezado">{patient.occupation ?? "No proporcionado"}</p>
              </div>
              <div>
                <p className="text-[10px] text-subtitulo font-bold uppercase">Estado Civil</p>
                <p className="text-xs font-semibold text-encabezado">
                  {patient.maritalStatus ? MARITAL_STATUS_LABELS[patient.maritalStatus] : "No proporcionado"}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-subtitulo font-bold uppercase">Educación</p>
                <p className="text-xs font-semibold text-encabezado">
                  {patient.educationLevel ? EDUCATION_LABELS[patient.educationLevel] : "No proporcionado"}
                </p>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <div className="bg-inner-secundario rounded-sm p-3">
              <p className="text-sm font-bold text-secundario dark:text-white flex items-center gap-3 pl-2">
                <span>
                  <Phone size={16} />
                </span>
                {patient.phone ? formatPhone(patient.phone) : "No proporcionado"}
              </p>
            </div>
          </section>

          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-subtitulo uppercase tracking-widest">Domicilios</h3>
              {hasEditPermission && (
                <button
                  onClick={openAdd}
                  className="flex items-center gap-1 text-[10px] font-semibold text-principal hover:text-principal-hover transition-colors"
                >
                  <Plus size={10} />
                  Agregar
                </button>
              )}
            </div>

            {sortedAddresses.length === 0 ? (
              <p className="text-xs text-subtitulo text-center py-4">Sin domicilio registrado</p>
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

          <section className="mb-5">
            <div className="bg-inner-secundario rounded-sm p-3 text-center">
              <p className="text-xs font-bold text-subtitulo dark:text-white tracking-[0.2em] flex items-center gap-3 pl-2">
                <span>
                  <IdCard size={16} />
                </span>
                {patient.curp ?? "Sin curp proporcionada"}
              </p>
            </div>
          </section>

          <div className="mt-auto space-y-2">
            <button className="flex items-center justify-center gap-2 w-full py-2 rounded-sm text-xs font-medium bg-disable hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
              <Printer size={12} />
              Imprimir expediente
            </button>
            {hasEditPermission && (
              <Link
                href={`/admin/patients/${patient.id}/edit`}
                className="flex items-center justify-center gap-2 w-full py-2 rounded-sm bg-principal text-white text-xs font-semibold hover:bg-principal-hover transition-colors"
              >
                <Pencil size={12} />
                Editar datos del paciente
              </Link>
            )}
          </div>
        </div>
      </aside>

      <AddressDialog
        open={dialog.open}
        mode={dialog.mode}
        patientId={patient.id}
        address={dialog.address}
        isFirstAddress={patient.addresses.length === 0}
        onOpenChange={handleDialogOpenChange}
      />
    </>
  );
}
