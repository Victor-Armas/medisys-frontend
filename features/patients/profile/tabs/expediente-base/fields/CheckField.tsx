import { useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { Flame, Martini, PawPrintIcon } from "lucide-react";
import { MedicalHistoryFormData } from "@/features/patients/schemas/medical-history.schema";

const ICON_MAP = {
  mascota: PawPrintIcon,
  tatuaje: Martini,
  humo: Flame,
};

interface Props {
  label: string;
  name: keyof MedicalHistoryFormData;
  disabled?: boolean;
  icon?: keyof typeof ICON_MAP;
}

export function CheckField({ label, name, disabled, icon }: Props) {
  const { watch, setValue } = useFormContext<MedicalHistoryFormData>();

  const Icon = icon ? ICON_MAP[icon] : null;

  const OPTIONS = [
    { label: "NO", value: false },
    { label: "SÍ", value: true },
  ] as const;

  const current = watch(name);
  const activeIndex = current === false ? 0 : current === true ? 1 : -1;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-sm  bg-fondo-inputs px-4 py-3 shadow-xs",
        disabled && "opacity-60",
      )}
    >
      {/* left side */}
      <div className="flex items-center gap-2">
        {Icon && <Icon className=" text-principal" size={18} strokeWidth={2.5} />}
        <span className="text-xs font-semibold text-encabezado tracking-wide uppercase">{label}</span>
      </div>

      {/* toggle pill */}
      <div className="relative flex w-[88px] bg-interior rounded-full p-1">
        {/* slider highlight */}
        {activeIndex !== -1 && (
          <div
            className="absolute top-1 bottom-1 w-[40px] rounded-full bg-principal shadow-sm transition-all duration-300 ease-out"
            style={{
              transform: `translateX(${activeIndex * 40}px)`,
            }}
          />
        )}

        {OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            disabled={disabled}
            onClick={() =>
              !disabled &&
              setValue(name, option.value, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            className={cn(
              "relative z-10 flex-1 text-[11px] font-bold transition-colors",
              current === option.value ? "text-white" : "text-subtitulo",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
