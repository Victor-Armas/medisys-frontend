import { useFormContext } from "react-hook-form";
import type { MedicalHistoryFormData } from "../schema";

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  variant?: "default" | "warning" | "critical";
}

export function HistoryDataDisplay({ label, name, variant = "default" }: Props) {
  const { watch } = useFormContext<MedicalHistoryFormData>();
  const value = watch(name);

  const variantStyles = {
    default: "border-l-slate-300 bg-white",
    warning: "border-l-amber-400 bg-amber-50/40",
    critical: "border-l-red-400 bg-red-50/40",
  };

  const hasValue = value && String(value).trim().length > 0;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</label>

      <div
        className={`
        relative min-h-[52px]
        px-4 py-3
        rounded-xl
        border border-slate-200
        border-l-[4px]
        transition-all duration-200
        ${variantStyles[variant]}
        ${!hasValue ? "border-dashed opacity-70" : "shadow-sm hover:shadow-md"}
      `}
      >
        {hasValue ? (
          <p className="text-[14px] leading-relaxed text-slate-800 whitespace-pre-wrap">{String(value)}</p>
        ) : (
          <span className="text-xs italic text-slate-400">Sin registros reportados</span>
        )}
      </div>
    </div>
  );
}
