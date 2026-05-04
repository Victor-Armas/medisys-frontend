import { z } from "zod";

/* ============================================================
   PATIENT MODE (CLAVE)
============================================================ */

export const patientModeSchema = z.enum(["EXISTING", "NEW"]);

/* ============================================================
   INLINE PATIENT (NEW PATIENT)
============================================================ */

export const inlinePatientSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio").max(100, "Máximo 100 caracteres"),
  middleName: z.string().max(100, "Máximo 100 caracteres").optional(),
  lastNamePaternal: z.string().min(1, "El apellido paterno es obligatorio").max(100, "Máximo 100 caracteres"),
  lastNameMaternal: z.string().max(100, "Máximo 100 caracteres").optional(),
  birthDate: z.string().min(1, "La fecha de nacimiento es obligatoria"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    message: "Selecciona el género",
  }),
  phone: z.string().max(20, "Máximo 20 caracteres").optional(),
});

/* ============================================================
   VITAL SIGNS
============================================================ */

export const vitalSignsSchema = z.object({
  weightKg: z.number().min(0).optional(),
  heightCm: z.number().optional(),
  bmi: z.number().optional(),

  bloodPressure: z
    .string()
    .regex(/^\d{2,3}\/\d{2,3}$/, "Formato: 120/80")
    .optional(), //T.A

  heartRateBpm: z.number().int().optional(),
  respiratoryRate: z.number().int().optional(),
  temperatureC: z.number().optional(),
  oxygenSaturation: z.number().int().optional(),

  glucoseMgdl: z.string().optional(),
  notes: z.string().optional(),
});

/* ============================================================
   DIAGNOSIS
============================================================ */

export const diagnosisSchema = z.object({
  icd10Code: z.string().optional(),
  description: z.string().min(1, "La descripción es obligatoria"),
  diagnosisType: z.enum(["DEFINITIVE", "PRESUMPTIVE", "ASSOCIATED", "COMPLICATION"]),
  isMain: z.boolean().default(false),
  notes: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

/* ============================================================
   PRESCRIPTION
============================================================ */

export const prescriptionItemSchema = z.object({
  catalogId: z.string().uuid().optional(),
  consultationDiagnosisId: z.string().uuid().optional(),

  medicationName: z.string().min(1, "El medicamento es obligatorio"),
  brandName: z.string().optional(),

  dose: z.string().min(1, "La dosis es obligatoria"),
  frequency: z.string().min(1, "La frecuencia es obligatoria"),
  duration: z.string().min(1, "La duración es obligatoria"),

  route: z.string().optional(),
  quantity: z.number().int().min(1).optional(),

  instructions: z.string().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

/* ============================================================
   MAIN CONSULTATION
============================================================ */

export const consultationFormSchema = z
  .object({
    /* ── Patient ───────────────────── */
    patientMode: patientModeSchema,
    patientId: z.string().uuid().optional(),
    newPatient: inlinePatientSchema.optional(),

    /* ── Context ───────────────────── */
    appointmentId: z.string().uuid().optional(),
    doctorClinicId: z.string().uuid("El consultorio es obligatorio"),
    consultationType: z.enum(["FIRST_VISIT", "FOLLOW_UP", "URGENT", "ROUTINE", "PROCEDURE"]),

    /* ── Clinical ───────────────────── */
    reasonForVisit: z.string().min(1, "El motivo es obligatorio"),
    currentCondition: z.string().min(1, "El padecimiento es obligatorio"),

    physicalExamFindings: z.string().optional(),
    labResultsSummary: z.string().optional(),
    clinicalImpressions: z.string().optional(),
    treatmentPlan: z.string().optional(),
    patientInstructions: z.string().optional(),
    prognosis: z.string().optional(),

    /* ── Follow-up ─────────────────── */
    requiresFollowUp: z.boolean(),
    followUpDays: z.number().int().optional(),
    followUpNotes: z.string().optional(),

    /* ── Vital Signs ───────────────── */
    vitalSigns: vitalSignsSchema.optional(),

    /* ── Diagnosis & Prescription ─── */
    diagnoses: z.array(diagnosisSchema).min(1, "Agrega al menos un diagnóstico"),
    prescriptionItems: z.array(prescriptionItemSchema),
  })
  .superRefine((data, ctx) => {
    /* ── Patient logic ───────────────── */
    if (data.patientMode === "EXISTING") {
      if (!data.patientId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes seleccionar un paciente",
          path: ["patientId"],
        });
      }
    }

    if (data.patientMode === "NEW") {
      if (!data.newPatient) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Debes registrar un paciente",
          path: ["newPatient"],
        });
      }
    }

    /* ── Follow-up logic ───────────── */
    if (data.requiresFollowUp && !data.followUpDays) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Indica en cuántos días es el seguimiento",
        path: ["followUpDays"],
      });
    }
  });

/* ============================================================
   TYPES
============================================================ */

export type ConsultationFormValues = z.input<typeof consultationFormSchema>;
export type VitalSignsValues = z.infer<typeof vitalSignsSchema>;
export type DiagnosisFormValues = z.infer<typeof diagnosisSchema>;
export type PrescriptionItemFormValues = z.infer<typeof prescriptionItemSchema>;
export type InlinePatientValues = z.infer<typeof inlinePatientSchema>;
