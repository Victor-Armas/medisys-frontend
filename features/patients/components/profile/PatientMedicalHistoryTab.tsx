// features/patients/components/profile/PatientMedicalHistoryTab.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ClipboardList, Cigarette, Wine, Pill, Heart, Users, Baby, CheckSquare, Loader2 } from "lucide-react";
import { isAxiosError } from "axios";

import { useMedicalHistory, useCreateMedicalHistory, useUpdateMedicalHistory } from "../../hooks/usePatients";
import { useAutoSave } from "@/shared/hooks/useAutoSave";
import { AutoSaveIndicator } from "@/shared/ui/AutoSaveIndicator";
import { notify } from "@/shared/ui/toaster";
import { cn } from "@/shared/lib/utils";
import type { Gender, HabitStatus } from "../../types/patient.types";
import { HABIT_LABELS } from "../../types/patient.types";

// ── Schema simplificado para el form ─────────────────────────────────────────

const historySchema = z.object({
  diseases: z.string().optional(),
  surgeries: z.string().optional(),
  hospitalizations: z.string().optional(),
  bloodTransfusions: z.boolean().optional(),
  traumaHistory: z.string().optional(),
  currentMedications: z.string().optional(),
  allergies: z.string().optional(),

  smoking: z.enum(["NEVER", "FORMER", "CURRENT", "UNKNOWN"]).optional(),
  smokingDetail: z.string().optional(),
  alcoholUse: z.enum(["NEVER", "FORMER", "CURRENT", "UNKNOWN"]).optional(),
  alcoholDetail: z.string().optional(),
  drugUse: z.enum(["NEVER", "FORMER", "CURRENT", "UNKNOWN"]).optional(),
  drugDetail: z.string().optional(),

  immunizations: z.string().optional(),
  physicalActivity: z.string().optional(),
  pets: z.boolean().optional(),
  tattoos: z.boolean().optional(),
  woodSmokeExposure: z.boolean().optional(),

  fatherHistory: z.string().optional(),
  motherHistory: z.string().optional(),
  childrenHistory: z.string().optional(),
  siblingsHistory: z.string().optional(),
  otherFamilyHistory: z.string().optional(),

  // Gineco
  menarche: z.coerce.number().optional(),
  menstrualCycle: z.string().optional(),
  lastMenstrualPeriod: z.string().optional(),
  sexualActivityStart: z.coerce.number().optional(),
  gestations: z.coerce.number().optional(),
  deliveries: z.coerce.number().optional(),
  abortions: z.coerce.number().optional(),
  caesareans: z.coerce.number().optional(),
  contraceptiveMethod: z.string().optional(),
  menopause: z.boolean().optional(),
  mammography: z.string().optional(),
  cervicalCytology: z.string().optional(),
});

type HistoryFormData = z.infer<typeof historySchema>;

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  patientId: string;
  gender: Gender;
  canEdit: boolean;
}

export function PatientMedicalHistoryTab({ patientId, gender, canEdit }: Props) {
  const { data: history, isLoading, isError } = useMedicalHistory(patientId);
  const createHistory = useCreateMedicalHistory();
  const updateHistory = useUpdateMedicalHistory();
  const isPending = createHistory.isPending || updateHistory.isPending;
  const isGineco = gender === "FEMALE";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<HistoryFormData>({
    resolver: zodResolver(historySchema),
    defaultValues: history ?? {},
  });

  // Sincronizar cuando llegan los datos del servidor
  useEffect(() => {
    if (history) reset(history as HistoryFormData);
  }, [history, reset]);

  const formValues = watch();

  // AutoSave para notas de texto extensas (el doctor puede estar escribiendo párrafos)
  const { status: saveStatus, lastSavedAt } = useAutoSave({
    storageKey: `patient-history-${patientId}`,
    data: formValues,
    enabled: isDirty && canEdit,
    debounceMs: 1200, // más lento — texto clínico extenso
  });

  async function onSubmit(data: HistoryFormData) {
    const loadId = notify.loading(history ? "Actualizando historia clínica…" : "Guardando historia clínica…");
    try {
      const payload = { ...data, patientId };
      if (history) {
        await updateHistory.mutateAsync({ patientId, payload });
      } else {
        await createHistory.mutateAsync({ patientId, payload });
      }
      notify.success("Historia clínica guardada", undefined, { id: loadId });
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message;
        notify.error(Array.isArray(msg) ? msg.join(", ") : (msg ?? "Error al guardar"), undefined, { id: loadId });
      } else {
        notify.error("Error inesperado", undefined, { id: loadId });
      }
    }
  }

  if (isLoading) return <HistorySkeleton />;

  if (isError && !history) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center">
          <ClipboardList size={22} className="text-brand" />
        </div>
        <div>
          <p className="text-base font-semibold text-text-primary">Historia clínica pendiente</p>
          <p className="text-sm text-text-secondary mt-1 max-w-xs">
            La historia clínica se llena durante la primera consulta del paciente.
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => {}}
            className="px-5 py-2.5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors"
          >
            Iniciar historia clínica
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Toolbar */}
      {canEdit && (
        <div className="flex items-center justify-between">
          <AutoSaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} />
          <button
            type="submit"
            disabled={isPending || !isDirty}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckSquare size={14} />}
            Guardar historia clínica
          </button>
        </div>
      )}

      {/* ── Antecedentes patológicos ── */}
      <HistorySection title="Antecedentes patológicos" icon={<Pill size={15} />} color="#e53e3e">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextareaField label="Enfermedades previas" name="diseases" register={register} disabled={!canEdit} />
          <TextareaField label="Cirugías" name="surgeries" register={register} disabled={!canEdit} />
          <TextareaField label="Hospitalizaciones" name="hospitalizations" register={register} disabled={!canEdit} />
          <TextareaField label="Traumatismos" name="traumaHistory" register={register} disabled={!canEdit} />
          <TextareaField
            label="Medicamentos actuales"
            name="currentMedications"
            register={register}
            disabled={!canEdit}
            rows={3}
          />
          <TextareaField label="Alergias conocidas" name="allergies" register={register} disabled={!canEdit} rows={3} />
        </div>
        <div className="mt-3">
          <CheckField label="Transfusiones sanguíneas" name="bloodTransfusions" register={register} disabled={!canEdit} />
        </div>
      </HistorySection>

      {/* ── Antecedentes no patológicos ── */}
      <HistorySection title="Antecedentes no patológicos" icon={<Cigarette size={15} />} color="#d97706">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <HabitField
            label="Tabaquismo"
            name="smoking"
            detailName="smokingDetail"
            register={register}
            setValue={setValue}
            watch={watch}
            disabled={!canEdit}
          />
          <HabitField
            label="Alcoholismo"
            name="alcoholUse"
            detailName="alcoholDetail"
            register={register}
            setValue={setValue}
            watch={watch}
            disabled={!canEdit}
          />
          <HabitField
            label="Toxicomanías"
            name="drugUse"
            detailName="drugDetail"
            register={register}
            setValue={setValue}
            watch={watch}
            disabled={!canEdit}
          />
        </div>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          <CheckField label="Mascotas" name="pets" register={register} disabled={!canEdit} />
          <CheckField label="Tatuajes/piercings" name="tattoos" register={register} disabled={!canEdit} />
          <CheckField label="Exposición humo leña" name="woodSmokeExposure" register={register} disabled={!canEdit} />
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextareaField label="Inmunizaciones" name="immunizations" register={register} disabled={!canEdit} />
          <TextareaField label="Actividad física" name="physicalActivity" register={register} disabled={!canEdit} />
        </div>
      </HistorySection>

      {/* ── Heredofamiliares ── */}
      <HistorySection title="Antecedentes heredofamiliares" icon={<Users size={15} />} color="#3182ce">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextareaField label="Padre" name="fatherHistory" register={register} disabled={!canEdit} />
          <TextareaField label="Madre" name="motherHistory" register={register} disabled={!canEdit} />
          <TextareaField label="Hijos" name="childrenHistory" register={register} disabled={!canEdit} />
          <TextareaField label="Hermanos" name="siblingsHistory" register={register} disabled={!canEdit} />
          <div className="md:col-span-2">
            <TextareaField label="Otros familiares" name="otherFamilyHistory" register={register} disabled={!canEdit} />
          </div>
        </div>
      </HistorySection>

      {/* ── Gineco-obstétricos (solo mujer) ── */}
      {isGineco && (
        <HistorySection title="Antecedentes gineco-obstétricos" icon={<Baby size={15} />} color="#9f7aea">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <NumberField label="Menarca (edad)" name="menarche" register={register} disabled={!canEdit} />
            <NumberField label="Inicio vida sexual" name="sexualActivityStart" register={register} disabled={!canEdit} />
            <NumberField label="Gestas" name="gestations" register={register} disabled={!canEdit} />
            <NumberField label="Partos" name="deliveries" register={register} disabled={!canEdit} />
            <NumberField label="Abortos" name="abortions" register={register} disabled={!canEdit} />
            <NumberField label="Cesáreas" name="caesareans" register={register} disabled={!canEdit} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <TextareaField label="Ciclo menstrual" name="menstrualCycle" register={register} disabled={!canEdit} />
            <TextareaField label="Método anticonceptivo" name="contraceptiveMethod" register={register} disabled={!canEdit} />
            <TextareaField label="Última mamografía" name="mammography" register={register} disabled={!canEdit} />
            <TextareaField label="Último Papanicolau" name="cervicalCytology" register={register} disabled={!canEdit} />
          </div>
          <div className="mt-3">
            <CheckField label="Menopausia" name="menopause" register={register} disabled={!canEdit} />
          </div>
        </HistorySection>
      )}
    </form>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function HistorySection({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border-default overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border-default bg-bg-base/50 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ background: color }} />
        <span className="pl-2" style={{ color }}>
          {icon}
        </span>
        <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function TextareaField({
  label,
  name,
  register,
  disabled,
  rows = 2,
}: {
  label: string;
  name: string;
  register: any;
  disabled: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">{label}</label>
      <textarea
        rows={rows}
        disabled={disabled}
        placeholder={disabled ? "—" : "Escribir aquí…"}
        className="w-full px-3 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-disabled"
        {...register(name)}
      />
    </div>
  );
}

function NumberField({ label, name, register, disabled }: { label: string; name: string; register: any; disabled: boolean }) {
  return (
    <div className="space-y-1">
      <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">{label}</label>
      <input
        type="number"
        min={0}
        disabled={disabled}
        className="w-full px-3 py-2.5 bg-bg-surface border border-border-default rounded-xl text-sm text-text-primary outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        {...register(name)}
      />
    </div>
  );
}

function CheckField({ label, name, register, disabled }: { label: string; name: string; register: any; disabled: boolean }) {
  return (
    <label className={cn("flex items-center gap-2.5 cursor-pointer group", disabled && "cursor-not-allowed opacity-60")}>
      <input
        type="checkbox"
        disabled={disabled}
        className="w-4 h-4 rounded border-border-strong text-brand focus:ring-brand outline-none"
        {...register(name)}
      />
      <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
    </label>
  );
}

function HabitField({
  label,
  name,
  detailName,
  register,
  setValue,
  watch,
  disabled,
}: {
  label: string;
  name: string;
  detailName: string;
  register: any;
  setValue: any;
  watch: any;
  disabled: boolean;
}) {
  const current = watch(name) as HabitStatus;
  const showDetail = current === "FORMER" || current === "CURRENT";

  return (
    <div className="space-y-3">
      <label className="block text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">{label}</label>
      <div className="grid grid-cols-2 gap-1.5">
        {(["NEVER", "FORMER", "CURRENT", "UNKNOWN"] as HabitStatus[]).map((status) => (
          <button
            key={status}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setValue(name, current === status ? "UNKNOWN" : status)}
            className={cn(
              "px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-all",
              current === status
                ? "bg-brand text-white border-brand shadow-sm"
                : "bg-bg-surface border-border-default text-text-secondary hover:border-brand/40",
              disabled && "cursor-not-allowed opacity-50",
            )}
          >
            {HABIT_LABELS[status]}
          </button>
        ))}
      </div>
      {showDetail && (
        <input
          type="text"
          disabled={disabled}
          placeholder="Cantidad, frecuencia, años…"
          className="w-full px-3 py-2 bg-bg-surface border border-border-default rounded-xl text-xs text-text-primary outline-none focus:border-brand transition-all"
          {...register(detailName)}
        />
      )}
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border-default overflow-hidden">
          <div className="h-12 bg-bg-subtle" />
          <div className="p-5 grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 bg-bg-subtle rounded w-1/3" />
                <div className="h-16 bg-bg-subtle rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
