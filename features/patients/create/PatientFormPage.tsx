"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { ArrowLeft, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { AutoSaveIndicator } from "@/shared/ui/AutoSaveIndicator";
import { notify } from "@/shared/ui/toaster";

import { HistorySection } from "../shared/HistorySection";
import { Patient } from "../types/patient.types";
import { useCreatePatient, useUpdatePatient } from "../hooks/usePatients";
import { PatientFormData, patientSchema } from "../schemas/patient.schema";
import { adaptFormToPayload, adaptPatientToForm } from "../adapters/patient.adapters";
import { usePatientFormController } from "../hooks/usePatientFormController";
import { SectionPersonalInfo } from "./sections/SectionPersonalInfo";
import { SectionEmergencyContact } from "./sections/SectionEmergencyContact";
import { SectionAddress } from "./sections/SectionAddress";
import { SectionContactInfo } from "./sections/SectionContactInfo";
import { SectionClinicalBasics } from "./sections/SectionClinicalBasics";
import { FormSection } from "../shared/FormSection";
import SectionSocioeconomic from "./sections/SectionSocioeconomic";

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  patient?: Patient; // si se pasa, es modo edición
  clinicId?: string; // pre-selecciona la clínica
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PatientFormPage({ patient, clinicId }: Props) {
  const router = useRouter();
  const isEdit = !!patient;
  const storageKey = `patient-form-${patient?.id ?? "new"}`;

  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const isPending = createPatient.isPending || updatePatient.isPending;

  //Agrupar todo en un objeto 'methods'
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

  // ── Submit ────────────────────────────────────────────────────────────────
  async function onSubmit(data: PatientFormData) {
    const loadId = notify.loading(isEdit ? "Actualizando paciente…" : "Registrando paciente…");
    try {
      const payload = adaptFormToPayload(data);
      if (isEdit) {
        await updatePatient.mutateAsync({
          id: patient.id,
          payload,
        });
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
    <div className="max-w-[1400px] mx-auto p-6 space-y-6">
      {/* Topbar de la página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
        <div className="flex items-center gap-3">
          <Link
            href={isEdit ? `/admin/patients/${patient.id}` : "/admin/patients"}
            className="p-2  rounded-full bg-inner-principal text-principal hover:text-text-primary hover:bg-principal-hover2 transition-colors"
          >
            <ArrowLeft size={17} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-principal tracking-tight">{isEdit ? "Editar paciente" : "Nuevo paciente"}</h1>
            <p className="text-sm text-subtitulo mt-0.5">
              {isEdit
                ? `Editando expediente de ${patient.firstName} ${patient.lastNamePaternal}`
                : "Registro rápido de paciente "}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AutoSaveIndicator status={autoSaveStatus} lastSavedAt={lastSavedAt} />

          {/* Resetear borrador */}
          {isDirty && !isEdit && (
            <button
              type="button"
              onClick={clearForm}
              className="flex  items-center gap-1.5 px-3 py-2 text-xs font-medium bg-inner-secundario text-secundario dark:text-white rounded-xl hover:bg-secundario-hover transition-colors "
            >
              <RotateCcw size={13} />
              Limpiar
            </button>
          )}

          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2  text-sm font-medium rounded-md bg-negative text-negative-text hover:bg-negative-hover transition-colors"
          >
            Cancelar
          </button>

          <button
            form="patient-form"
            type="submit"
            disabled={isPending}
            className="flex items-center  gap-2 px-5 py-2.5 bg-principal text-white text-sm font-semibold rounded-md hover:bg-principal-hover transition-colors shadow-sm shadow-brand/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            {isEdit ? "Guardar cambios" : "Registrar paciente"}
          </button>
        </div>
      </div>

      {/* Formulario */}
      <FormProvider {...methods}>
        <form id="patient-form" onSubmit={methods.handleSubmit(onSubmit)}>
          <div className="flex flex-col xl:grid xl:grid-cols-12 gap-4 items-start">
            {/* ── SECCIÓN INFERIOR ── */}

            {/* COLUMNA IZQUIERDA (Personal + Emergencia) */}
            <div className="xl:col-span-5 space-y-4 w-full">
              <HistorySection title="Información personal" icon="clipuser">
                <SectionPersonalInfo />
              </HistorySection>

              <HistorySection title="Contacto de emergencia" icon="emergency">
                <SectionEmergencyContact />
              </HistorySection>
            </div>

            {/* COLUMNA CENTRAL (Dirección + Contacto) */}
            <div className="xl:col-span-4 space-y-4 w-full">
              <HistorySection title="Dirección" icon="home">
                <SectionAddress />
              </HistorySection>

              <HistorySection title="Contacto" icon="contact">
                <SectionContactInfo />
              </HistorySection>
            </div>

            {/* COLUMNA DERECHA (Grupo Sanguíneo + Emergencia) */}
            <div className="xl:col-span-3 space-y-4">
              <FormSection title="Grupo sanguíneo" icon="droplet">
                <SectionClinicalBasics />
              </FormSection>

              <HistorySection title="Socioeconómicos" icon="social">
                <SectionSocioeconomic />
              </HistorySection>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
