import { useFormContext } from "react-hook-form";
import { cn } from "@/shared/lib/utils";
import { Droplet } from "lucide-react";
import { MedicalHistoryFormData } from "@/features/patients/schemas/medical-history.schema";

interface Props {
  disabled?: boolean;
}

export function TransfusionsField({ disabled }: Props) {
  const { watch, setValue } = useFormContext<MedicalHistoryFormData>();

  const current = watch("bloodTransfusions");

  function toggle() {
    if (disabled) return;
    setValue("bloodTransfusions", !current, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  return (
    <div className="flex items-center justify-between p-4 bg-[#FFFBFF] dark:bg-[#140C1F] border border-[#F3E8FF] dark:border-[#3A205E] rounded-[24px] shadow-sm">
      {/* Left section: Icon + Text */}
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="flex items-center justify-center w-[46px] h-[46px] bg-[#F5E4FA] dark:bg-[#2A1642] rounded-full shrink-0">
          <Droplet className="text-[#8B2FA1]" size={20} strokeWidth={2.5} />
        </div>

        {/* Texts */}
        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-encabezado leading-tight">Transfusiones</span>
          <span className="text-[10px] font-extrabold text-[#8B2FA1] dark:text-[#C084FC] uppercase tracking-wide mt-0.5">
            Historial sanguíneo
          </span>
        </div>
      </div>

      {/* Right section: Toggle Switch */}
      <button
        type="button"
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative inline-flex items-center h-[28px] w-[50px] shrink-0  rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
          current ? "bg-positive-text" : "bg-fondo-inputs",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <span className="sr-only">Toggle Transfusiones</span>
        <span
          className={cn(
            "pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
            current ? "translate-x-[22px]" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}
