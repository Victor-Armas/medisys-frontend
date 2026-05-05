"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Loader2,
  RotateCcw,
  Briefcase,
  ShieldAlert,
  Phone,
  Droplet,
  User,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { AutoSaveIndicator } from "@/shared/ui/AutoSaveIndicator";
import { notify } from "@/shared/ui/toaster";

import { Patient } from "../types/patient.types";
import { useCreatePatient, useUpdatePatient } from "../hooks/usePatients";
import { PatientFormData, patientSchema } from "../schemas/patient.schema";
import { adaptFormToPayload, adaptPatientToForm } from "../adapters/patient.adapters";
import { usePatientFormController } from "../hooks/usePatientFormController";

import { FormCard } from "./FormCard";
import { SectionPersonalInfo } from "./sections/SectionPersonalInfo";
import { SectionDemographics } from "./sections/SectionDemographics";
import { SectionClinicalBasics } from "./sections/SectionClinicalBasics";
import { SectionAddress } from "./sections/SectionAddress";
import { SectionEmergencyContact } from "./sections/SectionEmergencyContact";
import { SectionContactProfile } from "./sections/SectionContactProfile";

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  patient?: Patient;
  clinicId?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PatientFormPage({ patient, clinicId }: Props) {
  const router = useRouter();
  const isEdit = !!patient;
  const backUrl = isEdit ? `/admin/patients/${patient.id}` : "/admin/patients";
  const storageKey = `patient-form-${patient?.id ?? "new"}`;

  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const isPending = createPatient.isPending || updatePatient.isPending;

  const methods = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: isEdit ? adaptPatientToForm(patient) : { clinicId },
    mode: "onTouched",
  });

  const { autoSaveStatus, lastSavedAt, clearForm, isDirty } = usePatientFormController({
    form: methods,
    storageKey,
    isEdit,
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "addresses",
  });

  const handleAddAddress = () => {
    append({
      country: "MX",
      postalCodeInput: "",
      municipality: "",
      state: "",
      neighborhoodInput: "",
      street: "",
      extNumber: "",
      intNumber: "",
    });
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  async function onSubmit(data: PatientFormData) {
    const loadId = notify.loading(isEdit ? "Actualizando paciente…" : "Registrando paciente…");
    try {
      const payload = adaptFormToPayload(data);
      if (isEdit) {
        await updatePatient.mutateAsync({ id: patient.id, payload });
        notify.success("Paciente actualizado", undefined, { id: loadId });
        router.push(`/admin/patients/${patient.id}`);
      } else {
        const created = await createPatient.mutateAsync(payload);
        notify.success("Paciente registrado", "El expediente fue creado correctamente", { id: loadId });
        router.push(`/admin/patients/${created.id}`);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        notify.error(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al guardar"), undefined, { id: loadId });
      } else {
        notify.error("Error inesperado", undefined, { id: loadId });
      }
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className=" mx-auto p-4 sm:p-6 pb-28 lg:pb-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
        <div className="flex items-center gap-3">
          <Link
            href={backUrl}
            className="p-2 rounded-full bg-inner-principal text-principal hover:text-text-primary hover:bg-principal-hover2 transition-colors"
          >
            <ArrowLeft size={17} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-principal tracking-tight">{isEdit ? "Editar paciente" : "Nuevo paciente"}</h1>
            <p className="text-sm text-subtitulo mt-0.5">
              {isEdit ? `Editando expediente de ${patient.firstName} ${patient.lastNamePaternal}` : "Registro rápido de paciente"}
            </p>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          <AutoSaveIndicator status={autoSaveStatus} lastSavedAt={lastSavedAt} />
          {isDirty && !isEdit && (
            <button
              type="button"
              onClick={clearForm}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-inner-secundario text-secundario dark:text-white rounded-xl hover:bg-secundario-hover transition-colors"
            >
              <RotateCcw size={13} />
              Limpiar
            </button>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium rounded-md bg-negative text-negative-text hover:bg-negative-hover transition-colors"
          >
            Cancelar
          </button>
          <button
            form="patient-form"
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-principal text-white text-sm font-semibold rounded-md hover:bg-principal-hover transition-colors shadow-sm shadow-brand/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            {isEdit ? "Guardar cambios" : "Registrar paciente"}
          </button>
        </div>
      </div>

      {/* ── Form ── */}
      <FormProvider {...methods}>
        <form id="patient-form" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col space-y-6">
            {/* ── Row 1: Identificación (full-width) ── */}
            <FormCard title="Identificación" icon={<ClipboardList size={18} />}>
              <SectionPersonalInfo />
            </FormCard>

            {/* ── Row 2: Demográficos + Datos Clínicos ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormCard title="Demográficos" icon={<User size={18} />}>
                <SectionDemographics />
              </FormCard>
              <FormCard title="Datos Clínicos" icon={<Droplet size={18} />}>
                <SectionClinicalBasics />
              </FormCard>
            </div>

            {/* ── Row 3: Contacto y Perfil + Emergencia ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FormCard title="Contacto y Perfil" icon={<Briefcase size={18} />}>
                <SectionContactProfile />
              </FormCard>
              <FormCard title="Emergencia" icon={<ShieldAlert size={18} />}>
                <SectionEmergencyContact />
              </FormCard>
            </div>

            {/* ── Row 4: Ubicación y Domicilios (full-width) ── */}
            <FormCard
              title="Ubicación y Domicilios"
              icon={<Phone size={18} />}
              action={
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-inner-principal text-principal text-xs font-bold rounded-lg hover:bg-principal-hover2 transition-all"
                >
                  <Plus size={14} />
                  Agregar dirección
                </button>
              }
            >
              <SectionAddress fields={fields} remove={remove} append={append} />
            </FormCard>
          </div>
        </form>
      </FormProvider>

      {/* ── Mobile sticky bottom bar ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-disable bg-interior/95 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 px-4 py-3 max-w-5xl mx-auto">
          <AutoSaveIndicator status={autoSaveStatus} lastSavedAt={lastSavedAt} />
          <div className="flex items-center gap-2">
            {isDirty && !isEdit && (
              <button
                type="button"
                onClick={clearForm}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-inner-secundario text-secundario dark:text-white hover:bg-secundario-hover transition-colors"
                title="Limpiar"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={() => router.back()}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-negative text-negative-text hover:bg-negative-hover transition-colors"
            >
              Cancelar
            </button>
            <button
              form="patient-form"
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 bg-principal text-white text-sm font-semibold rounded-lg hover:bg-principal-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isPending ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              {isEdit ? "Guardar" : "Registrar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
