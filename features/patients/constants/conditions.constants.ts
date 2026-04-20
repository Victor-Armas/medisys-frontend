import { Bug, Asterisk, Activity, ArrowRight } from "lucide-react";
import { ConditionCategory } from "../types/patient.types";

export const ICONS_MAP: Record<ConditionCategory, React.ElementType> = {
  DISEASE: Bug,
  SURGERY: Asterisk,
  TRAUMA: Activity,
  HOSPITALIZATION: ArrowRight,
};

export const CONDITION_CATEGORY_COLORS: Record<string, string> = {
  SURGERY: "bg-[#a12f6b]",
  TRAUMA: "bg-principal",
  HOSPITALIZATION: "bg-[#993399]",
};
