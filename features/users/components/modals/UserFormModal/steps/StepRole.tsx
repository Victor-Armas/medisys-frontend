import { cn } from "@/shared/lib/utils";
import { getRoleConfig, STAFF_ROLES } from "@/shared/constants/roles";
import { type UnifiedUserFormData } from "@/validations/user.schema";
import { UseFormSetValue } from "react-hook-form";

interface Props {
  selectedRole: UnifiedUserFormData["role"];
  setValue: UseFormSetValue<UnifiedUserFormData>;
}

export function StepRole({ selectedRole, setValue }: Props) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-top-3">
      <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
        Selecciona el tipo de perfil
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {STAFF_ROLES.map((roleValue) => {
          const config = getRoleConfig(roleValue);
          const Icon = config.icon;
          const isActive = selectedRole === roleValue;

          return (
            <button
              key={roleValue}
              type="button"
              onClick={() => setValue("role", roleValue)}
              className={cn(
                "flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border",
                "text-center transition-all duration-200 h-36 group",
                "hover:scale-[1.02] active:scale-[0.98]",
                isActive
                  ? cn(
                      config.badge,
                      "ring-2 ring-offset-2 ring-current shadow-md border-transparent"
                    )
                  : "border-border-default dark:border-white/5 bg-bg-surface dark:bg-white/5 hover:border-border-strong"
              )}
            >
              <div
                className={cn(
                  "p-2.5 rounded-xl border transition-all duration-300",
                  "bg-linear-to-br from-white/50 to-transparent",
                  config.badge,
                  isActive ? "shadow-md scale-105" : "group-hover:shadow-md"
                )}
              >
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              </div>

              <div>
                <p
                  className={cn(
                    "text-sm font-semibold tracking-tight",
                    isActive
                      ? "text-current"
                      : "text-text-primary dark:text-white"
                  )}
                >
                  {config.label}
                </p>
                <p className="text-[11.5px] text-text-secondary mt-1 leading-snug">
                  {config.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
