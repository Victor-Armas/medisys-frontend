"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider, SubmitHandler, useWatch, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { consultationFormSchema, ConsultationFormValues } from "../schemas/consultation.schema";
import { useAutoSave } from "@/shared/hooks/useAutoSave";
import { useCreateConsultationWithPrescription } from "../hooks/useConsultation";
import { RecentVisitsSidebar } from "./sidebar/RecentVisitsSidebar";
import { FilesSidebar } from "./sidebar/FilesSidebar";
import { Button } from "@/shared/ui/button";
import type { PatientSearchResult } from "../types/consultation.types";
import type { DoctorClinic } from "../types/consultation.types";
import { buildConsultationStorageKey } from "../utils/consultation.utils";
import { StaffRole } from "@/features/users/types";
import { usePermissions } from "@/shared/hooks/usePermissions";
import AccessDenied from "@/shared/ui/AccessDenied";
import { ConsultationFormStep } from "./steps/ConsultationFormStep";
import ClinicSelect from "../ui/ClinicSelect";
import { notify } from "@/shared/ui/toaster";
import { useRouter } from "next/navigation";
import { AppointmentConsultation } from "@/features/appointments/types/appointment.types";

interface Props {
  serverRole: StaffRole;
  initialPatient: PatientSearchResult | null;
  doctorClinic: DoctorClinic[];
  appointment: AppointmentConsultation | null;
}

export default function ConsultationNewPage({ serverRole, initialPatient, doctorClinic, appointment }: Props) {
  const router = useRouter();
  const { canCreateConsultationDoctor, canManagerDoctor } = usePermissions(serverRole);
  const [activeTab, setActiveTab] = useState<"resumen" | "historial" | "archivos" | "recetas">("resumen");
  const [isDraftLoading, setIsDraftLoading] = useState(false);
  const lastLoadedPatientId = useRef<string | null>(null);

  const methods = useForm<ConsultationFormValues>({
    resolver: zodResolver(consultationFormSchema),
    mode: "onChange",
    defaultValues: {
      appointmentId: appointment?.id,
      patientId: initialPatient?.id || appointment?.patientId,
      patientMode: initialPatient || appointment?.patientId ? "EXISTING" : undefined,
      consultationType: "FOLLOW_UP",
      reasonForVisit: appointment?.reason || "",
      currentCondition: "",
      vitalSigns: {},
      diagnoses: [],
      prescriptionItems: [],
      requiresFollowUp: false,
      doctorClinicId: appointment?.doctorClinicId,
    },
  });

  const {
    control,
    formState: { isDirty },
  } = methods; // ✅ isDirty extraído correctamente
  const patientIdWatch = useWatch({ control, name: "patientId" });
  const doctorClinicId = useWatch({ control, name: "doctorClinicId" });
  const formValues = useWatch({ control });

  const {
    status: saveStatus,
    lastSavedAt,
    clearDraft,
    getDraft,
  } = useAutoSave({
    storageKey: buildConsultationStorageKey(appointment?.id ?? null, patientIdWatch ?? null),
    data: formValues,
    enabled: isDirty && !!patientIdWatch && !isDraftLoading,
  });

  useEffect(() => {
    // Si no hay paciente o ya cargamos el borrador para este paciente, no hacemos nada
    if (!patientIdWatch || lastLoadedPatientId.current === patientIdWatch) return;
    setIsDraftLoading(true);
    const draft = getDraft();

    if (draft) {
      methods.reset(draft);
    }

    lastLoadedPatientId.current = patientIdWatch;
    setTimeout(() => setIsDraftLoading(false), 100);
  }, [patientIdWatch, getDraft, methods]);

  useEffect(() => {
    // Si tenemos una cita, forzamos la clínica de esa cita
    if (appointment?.doctorClinicId) {
      methods.setValue("doctorClinicId", appointment.doctorClinicId);
    }
    // Si no hay cita pero solo hay una clínica disponible, la seleccionamos
    else if (doctorClinic.length === 1 && !doctorClinicId) {
      methods.setValue("doctorClinicId", doctorClinic[0].id);
    }
  }, [appointment, doctorClinic, doctorClinicId, methods]);

  const { mutate: submit, isPending } = useCreateConsultationWithPrescription((id) => {
    clearDraft();
    router.push(`/admin/consultations/${id}`);
  });

  const onSubmit: SubmitHandler<ConsultationFormValues> = (values) => {
    submit({
      consultation: {
        appointmentId: values.appointmentId,
        patientId: values.patientId,
        patient: values.newPatient
          ? {
              ...values.newPatient,
              middleName: values.newPatient.middleName ?? undefined,
              lastNameMaternal: values.newPatient.lastNameMaternal ?? undefined,
              phone: values.newPatient.phone ?? undefined,
            }
          : undefined,
        doctorClinicId: values.doctorClinicId,
        consultationType: values.consultationType,
        reasonForVisit: values.reasonForVisit,
        currentCondition: values.currentCondition,
        physicalExamFindings: values.physicalExamFindings || undefined,
        labResultsSummary: values.labResultsSummary || undefined,
        clinicalImpressions: values.clinicalImpressions || undefined,
        treatmentPlan: values.treatmentPlan || undefined,
        patientInstructions: values.patientInstructions || undefined,
        prognosis: values.prognosis || undefined,
        requiresFollowUp: values.requiresFollowUp,
        followUpDays: values.followUpDays,
        followUpNotes: values.followUpNotes || undefined,
        vitalSigns: Object.values(values.vitalSigns ?? {}).some(Boolean) ? values.vitalSigns : undefined,
        diagnoses: values.diagnoses.length > 0 ? values.diagnoses : undefined,
      },
      prescriptionItems: values.prescriptionItems,
    });
  };

  const onError = (errors: FieldErrors<ConsultationFormValues>) => {
    if (errors.doctorClinicId) {
      notify.error("Selecciona una clínica");
    }
    if (errors.patientMode) {
      notify.error("Selecciona o crea un paciente");
    }
    if (errors.diagnoses) {
      notify.error("Selecciona al menos 1 diagnostico");
    }
  };

  const TABS = [
    { key: "resumen", label: "Resumen" },
    { key: "historial", label: "Historial" },
    { key: "archivos", label: "Archivos" },
    { key: "recetas", label: "Recetas" },
  ] as const;

  if (!canManagerDoctor && (!canCreateConsultationDoctor || doctorClinic.length === 0)) {
    return <AccessDenied />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, onError)} className="h-full flex flex-col mx-6 py-4 overflow-hidden">
        {/* Top nav tabs */}
        <div className="bg-interior shadow-sm px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-encabezado mr-4">Módulo de Consulta</span>
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors ${activeTab === t.key ? "border-principal text-principal" : "border-transparent text-subtitulo hover:text-encabezado"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 py-2">
            <ClinicSelect doctorClinic={doctorClinic} />
            <Button type="submit" variant="primary2" className="px-5 py-2 text-sm" disabled={isPending}>
              {isPending ? "Guardando…" : "Guardar Consulta"}
            </Button>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex-1 min-h-0 flex gap-4 pt-4 overflow-hidden">
          {/* Left: main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto pr-1 custom-scrollbar">
            {activeTab === "resumen" && (
              <ConsultationFormStep
                autoSaveStatus={saveStatus}
                lastSavedAt={lastSavedAt}
                folioNumber={undefined}
                initialPatient={initialPatient}
              />
            )}
            {activeTab !== "resumen" && (
              <div className="flex-1 flex items-center justify-center text-subtitulo text-sm bg-interior rounded-xl border border-disable/20">
                <p>Esta sección estará disponible próximamente.</p>
              </div>
            )}
          </div>

          {/* Right: sidebar */}
          <div className="w-64 shrink-0 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            <RecentVisitsSidebar patientId={patientIdWatch ?? null} />
            <FilesSidebar patientId={patientIdWatch ?? null} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
