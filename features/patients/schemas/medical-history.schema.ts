// features/patients/schemas/medical-history.schema.ts
import { z } from "zod";

export const optionalNumber = z.number().nullable();

// Preprocessor que convierte YYYY-MM-DD → ISO datetime string para el backend
// y acepta ISO datetime strings directamente (de la BD)
const flexibleDate = z
  .preprocess((val) => {
    if (!val || val === "") return undefined;
    if (typeof val === "string") {
      // Si ya viene como ISO completo (de BD), devolverlo tal cual
      if (val.includes("T")) return val;
      // Si viene como YYYY-MM-DD (del input type="date"), convertir
      if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
        return `${val}T00:00:00.000Z`;
      }
    }
    return val;
  }, z.string().optional())
  .nullish();

export const medicalHistorySchema = z.object({
  // ── Pathological fact ──────────────────────────────────────────────────────
  bloodTransfusions: z.boolean(),

  // ── Non-pathological habits ────────────────────────────────────────────────
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

  // ── Gynecological / obstetric ──────────────────────────────────────────────
  menarche: optionalNumber,
  menstrualCycle: z.string(),
  lastMenstrualPeriod: flexibleDate,
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
