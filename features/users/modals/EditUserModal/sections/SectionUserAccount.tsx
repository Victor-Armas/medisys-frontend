"use client";

import { User, Phone } from "lucide-react";
import { type UseFormRegister, type FieldErrors, type Control, Controller } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { getRoleConfig, STAFF_ROLES } from "@/shared/constants/roles";
import { cn } from "@/shared/lib/utils";
import { EditUserFormData } from "@/validations/user.schema";
import { usePermissions } from "@/shared/hooks/usePermissions";

interface Props {
  register: UseFormRegister<EditUserFormData>;
  errors: FieldErrors<EditUserFormData>;
  control: Control<EditUserFormData>;
}

export function SectionUserAccount({ register, errors, control }: Props) {
  const { canEditOtherProfiles } = usePermissions();
  return (
    <div className="space-y-5">
      {/* Datos personales */}
      <div>
        <p className="text-[11px] font-bold text-subtitulo uppercase tracking-wider mb-3">Datos personales</p>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Nombre *" icon={User} error={errors.firstName?.message} {...register("firstName")} />
          <Input label="Segundo nombre" error={errors.middleName?.message} {...register("middleName")} />
          <Input label="Apellido paterno *" error={errors.lastNamePaternal?.message} {...register("lastNamePaternal")} />
          <Input label="Apellido materno *" error={errors.lastNameMaternal?.message} {...register("lastNameMaternal")} />
          <div className="col-span-2">
            <Input label="Teléfono" icon={Phone} error={errors.phone?.message} {...register("phone")} />
          </div>
        </div>
      </div>

      {/* Rol */}
      {canEditOtherProfiles && (
        <>
          <div>
            <p className="text-[11px] font-bold text-subtitulo uppercase tracking-wider mb-3">Rol y estado</p>
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {STAFF_ROLES.map((roleValue) => {
                    const config = getRoleConfig(roleValue);
                    const Icon = config.icon;
                    const isActive = field.value === roleValue;
                    return (
                      <button
                        key={roleValue}
                        type="button"
                        onClick={() => field.onChange(roleValue)}
                        className={cn(
                          "flex items-center gap-2.5 p-3 rounded-xl shadow-sm text-left transition-all",
                          isActive ? cn(config.badge, "ring-current shadow-sm ") : " bg-fondo-inputs hover:bg-inner-principal",
                        )}
                      >
                        <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                        <span className="text-xs font-semibold">{config.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>

          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <div className="flex items-center justify-between p-3 rounded-sm shadow-sm  bg-fondo-inputs">
                <div>
                  <p className="text-sm font-medium text-encabezado">Estado de la cuenta</p>
                  <p className="text-xs text-subtitulo mt-0.5">
                    {field.value ? "Cuenta activa — puede iniciar sesión" : "Cuenta inactiva — sin acceso al sistema"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={cn(
                    "w-11 h-6 rounded-full flex items-center px-0.5 transition-colors",
                    field.value ? "bg-emerald-500" : "bg-border-strong",
                  )}
                >
                  <div className={cn("w-5 h-5 bg-white rounded-full shadow transition-all", field.value && "ml-auto")} />
                </button>
              </div>
            )}
          />
        </>
      )}
    </div>
  );
}
