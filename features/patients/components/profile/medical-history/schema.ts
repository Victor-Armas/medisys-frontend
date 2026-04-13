import { z } from "zod";

// Previene TS errors y asegura que inputs vacíos se transformen en `null`.
// Al no incluir `undefined` en la unión, forzamos que el campo esté presente en el estado del form,
// resolviendo el conflicto de tipos con el Resolver de React Hook Form.
export const optionalNumber = z.number().nullable();

export const medicalHistorySchema = z.object({
  diseases: z.string(),
  surgeries: z.string(),
  hospitalizations: z.string(),
  bloodTransfusions: z.boolean(),
  traumaHistory: z.string(),
  currentMedications: z.string(),
  allergies: z.string(),

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

  fatherHistory: z.string(),
  motherHistory: z.string(),
  childrenHistory: z.string(),
  siblingsHistory: z.string(),
  otherFamilyHistory: z.string(),

  // Gineco
  menarche: optionalNumber,
  menstrualCycle: z.string(),
  sexualActivityStart: optionalNumber,
  gestations: optionalNumber,
  deliveries: optionalNumber,
  abortions: optionalNumber,
  caesareans: optionalNumber,
  contraceptiveMethod: z.string(),
  menopause: z.boolean(),
  mammography: z.string(),
  cervicalCytology: z.string(),
  lastMenstrualPeriod: z.preprocess((val) => (val === "" ? undefined : val), z.string().datetime().optional()).nullish(),
});
export type MedicalHistoryFormData = z.input<typeof medicalHistorySchema>;

// Valores por defecto explícitos para inicializar el formulario sin depender de .default() en el schema,
// lo cual mantiene los tipos de entrada y salida alineados para el Resolver.
export const medicalHistoryDefaultValues: MedicalHistoryFormData = {
  diseases: "",
  surgeries: "",
  hospitalizations: "",
  bloodTransfusions: false,
  traumaHistory: "",
  currentMedications: "",
  allergies: "",
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
  fatherHistory: "",
  motherHistory: "",
  childrenHistory: "",
  siblingsHistory: "",
  otherFamilyHistory: "",
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
