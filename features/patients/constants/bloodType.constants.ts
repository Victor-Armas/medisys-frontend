import type { BloodType } from "../types/patient.types";

export const BT_BADGE: Record<BloodType, string> = {
  O_POSITIVE: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  O_NEGATIVE: "bg-red-600/10 text-red-700 border-red-600/20 dark:text-red-500",
  A_POSITIVE: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  A_NEGATIVE: "bg-blue-600/10 text-blue-700 border-blue-600/20 dark:text-blue-500",
  B_POSITIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  B_NEGATIVE: "bg-emerald-600/10 text-emerald-700 border-emerald-600/20 dark:text-emerald-500",
  AB_POSITIVE: "bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400",
  AB_NEGATIVE: "bg-purple-600/10 text-purple-700 border-purple-600/20 dark:text-purple-500",
  UNKNOWN: "bg-subtitulo text-subtitulo ",
};
