import { User, Mail, Lock, Phone } from "lucide-react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { type UnifiedUserFormData } from "@/validations/user.schema";
import { SectionDivider } from "../components/SectionDivider";

interface Props {
  register: UseFormRegister<UnifiedUserFormData>;
  errors: FieldErrors<UnifiedUserFormData>;
}

export function StepAccount({ register, errors }: Props) {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-5">
      <SectionDivider label="Datos Personales" />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Nombre *"
          icon={User}
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label="Segundo nombre"
          icon={User}
          error={errors.middleName?.message}
          {...register("middleName")}
        />
        <Input
          label="Apellido paterno *"
          error={errors.lastNamePaternal?.message}
          {...register("lastNamePaternal")}
        />
        <Input
          label="Apellido materno *"
          error={errors.lastNameMaternal?.message}
          {...register("lastNameMaternal")}
        />
      </div>

      <SectionDivider label="Seguridad y Acceso" />

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Email institucional *"
            type="email"
            icon={Mail}
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
        <Input
          label="Contraseña *"
          type="password"
          icon={Lock}
          error={errors.password?.message}
          {...register("password")}
        />
        <Input
          label="Teléfono de contacto"
          icon={Phone}
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>
    </div>
  );
}
