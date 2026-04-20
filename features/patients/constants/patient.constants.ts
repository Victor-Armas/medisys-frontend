import type {
  BloodType,
  Gender,
  MaritalStatus,
  EducationLevel,
  HabitStatus,
  ConditionCategory,
  FamilyMember,
  AllergySeverity,
  MedicalFileCategory,
} from "../types/patient.types";

export const BLOOD_TYPE_LABELS: Record<BloodType, string> = {
  O_POSITIVE: "O+",
  O_NEGATIVE: "O−",
  A_POSITIVE: "A+",
  A_NEGATIVE: "A−",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B−",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB−",
  UNKNOWN: "?",
};

export const GENDER_LABELS: Record<Gender, string> = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  OTHER: "Otro",
};

export const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  SINGLE: "Soltero/a",
  MARRIED: "Casado/a",
  DIVORCED: "Divorciado/a",
  WIDOWED: "Viudo/a",
  FREE_UNION: "Unión libre",
  OTHER: "Otro",
};

export const EDUCATION_LABELS: Record<EducationLevel, string> = {
  NONE: "Sin estudios",
  PRIMARY: "Primaria",
  SECONDARY: "Secundaria",
  HIGH_SCHOOL: "Preparatoria",
  TECHNICAL: "Técnico",
  BACHELOR: "Licenciatura",
  POSTGRADUATE: "Posgrado",
};

export const HABIT_LABELS: Record<HabitStatus, string> = {
  NEVER: "Nunca",
  FORMER: "Anteriomente",
  CURRENT: "Activo",
  UNKNOWN: "Desconocido",
};

export const CONDITION_CATEGORY_LABELS: Record<ConditionCategory, string> = {
  DISEASE: "Enfermedad",
  SURGERY: "Cirugía",
  HOSPITALIZATION: "Hospitalización",
  TRAUMA: "Traumatismo",
};

export const FAMILY_MEMBER_LABELS: Record<FamilyMember, string> = {
  FATHER: "Padre",
  MOTHER: "Madre",
  SIBLINGS: "Hermanos",
  CHILDREN: "Hijos",
  OTHER: "Otro familiar",
};

export const ALLERGY_SEVERITY_LABELS: Record<AllergySeverity, string> = {
  MILD: "Leve",
  MODERATE: "Moderada",
  SEVERE: "Severa",
  UNKNOWN: "Desconocida",
};

export const ALLERGY_SEVERITY_COLORS: Record<AllergySeverity, { bg: string; text: string }> = {
  MILD: { bg: "bg-wairning-soft", text: "text-wairning-soft-text" },
  MODERATE: { bg: "bg-wairning", text: "text-wairning-text" },
  SEVERE: { bg: "bg-negative", text: "text-negative-text" },
  UNKNOWN: { bg: "bg-inner-principal", text: "text-principal" },
};

export const MEDICAL_FILE_CATEGORY_LABELS: Record<MedicalFileCategory, string> = {
  LAB_RESULTS: "Laboratorio",
  IMAGING: "Imagen / Radiología",
  PRESCRIPTION: "Receta previa",
  REFERRAL: "Interconsulta",
  SURGERY_REPORT: "Informe quirúrgico",
  PATHOLOGY: "Patología",
  OTHER: "Otro",
};

export const MEDICAL_FILE_CATEGORY_COLORS: Record<MedicalFileCategory, { bg: string; text: string; border: string }> = {
  LAB_RESULTS: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/20" },
  IMAGING: { bg: "bg-purple-500/10", text: "text-purple-600", border: "border-purple-500/20" },
  PRESCRIPTION: { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-500/20" },
  REFERRAL: { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20" },
  SURGERY_REPORT: { bg: "bg-red-500/10", text: "text-red-600", border: "border-red-500/20" },
  PATHOLOGY: { bg: "bg-pink-500/10", text: "text-pink-600", border: "border-pink-500/20" },
  OTHER: { bg: "bg-subtitulo", text: "text-text-secondary", border: "border-border-default" },
};
