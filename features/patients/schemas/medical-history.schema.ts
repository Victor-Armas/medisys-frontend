// features/patients/components/profile/medical-history/schema.ts
import { z } from "zod";

/**
 * MedicalHistory form schema.
 *
 * Scope: non-pathological habits + gynecological antecedents + bloodTransfusions.
 *
 * Removed (migrated to structured models with ICD-10):
 *   - diseases, surgeries, hospitalizations, traumaHistory
 *   - currentMedications, allergies
 *   - fatherHistory, motherHistory, childrenHistory, siblingsHistory, otherFamilyHistory
 *
 * Those fields are now managed by:
 *   - PatientCondition  (useCreateCondition / useRemoveCondition)
 *   - PatientMedication (useCreateMedication / useRemoveMedication)
 *   - PatientAllergy    (useCreateAllergy / useRemoveAllergy)
 */

export const optionalNumber = z.number().nullable();

export const medicalHistorySchema = z.object({
  // ── Remaining pathological fact ───────────────────────────────────────────
  bloodTransfusions: z.boolean(),

  // ── Non-pathological habits ───────────────────────────────────────────────
  smoking: z.enum(["NEVER", "FORMER", "CURRENT", "UNKNOWN"]),
  smokingDetail: z.string(),
  alcoholUse: z.enum(["NEVER", "FORMER", "CURRENT", "UNKNOWN"]),
  alcoholDetail: z.string(),
  drugUse: z.enum(["NEVER", "FORMER", "CURRENT", "UNKNOWN"]),
  drugDetail: z.string(),
  immunizations: z.string(),
  physicalActivity: z.string(),
  pets: z.boolean(),
  tattoos: z.boolean(),
  woodSmokeExposure: z.boolean(),

  // ── Gynecological / obstetric ─────────────────────────────────────────────
  menarche: optionalNumber,
  menstrualCycle: z.string(),
  lastMenstrualPeriod: z.preprocess((val) => (val === "" ? undefined : val), z.string().datetime().optional()).nullish(),
  sexualActivityStart: optionalNumber,
  gestations: optionalNumber,
  deliveries: optionalNumber,
  abortions: optionalNumber,
  caesareans: optionalNumber,
  contraceptiveMethod: z.string(),
  menopause: z.boolean(),
  mammography: z.string(),
  cervicalCytology: z.string(),
});

export type MedicalHistoryFormData = z.input<typeof medicalHistorySchema>;

export const medicalHistoryDefaultValues: MedicalHistoryFormData = {
  bloodTransfusions: false,

  smoking: "UNKNOWN",
  smokingDetail: "",
  alcoholUse: "UNKNOWN",
  alcoholDetail: "",
  drugUse: "UNKNOWN",
  drugDetail: "",
  immunizations: "",
  physicalActivity: "",
  pets: false,
  tattoos: false,
  woodSmokeExposure: false,

  menarche: null,
  menstrualCycle: "",
  lastMenstrualPeriod: undefined,
  sexualActivityStart: null,
  gestations: null,
  deliveries: null,
  abortions: null,
  caesareans: null,
  contraceptiveMethod: "",
  menopause: false,
  mammography: "",
  cervicalCytology: "",
};
