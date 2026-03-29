import {
  Stethoscope,
  Award,
  GraduationCap,
  BookOpen,
  MapPin,
} from "lucide-react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { type UnifiedUserFormData } from "@/validations/user.schema";
import { SectionDivider } from "../components/SectionDivider";

interface Props {
  register: UseFormRegister<UnifiedUserFormData>;
  errors: FieldErrors<UnifiedUserFormData>;
}

export function StepDoctorProfile({ register, errors }: Props) {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-5">
      <SectionDivider label="Información Profesional" />

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Cédula profesional *"
            icon={<Award size={15} />}
            error={errors.professionalLicense?.message}
            className="font-mono tracking-wider"
            {...register("professionalLicense")}
          />
        </div>
        <Input
          label="Especialidad"
          icon={<Stethoscope size={15} />}
          error={errors.specialty?.message}
          {...register("specialty")}
        />
        <Input
          label="Universidad de egreso"
          icon={<GraduationCap size={15} />}
          error={errors.university?.message}
          {...register("university")}
        />
        <div className="col-span-2">
          <Input
            label="Título completo para recetas"
            icon={<BookOpen size={15} />}
            error={errors.fullTitle?.message}
            {...register("fullTitle")}
          />
        </div>
      </div>

      <SectionDivider label="Dirección Personal " />

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Calle *"
            icon={<MapPin size={15} />}
            error={errors.address?.message}
            {...register("address")}
          />
        </div>
        <Input
          label="Número de casa *"
          error={errors.numHome?.message}
          {...register("numHome")}
        />
        <Input
          label="Colonia *"
          error={errors.colony?.message}
          {...register("colony")}
        />
        <Input
          label="Ciudad *"
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="Estado *"
          error={errors.state?.message}
          {...register("state")}
        />
        <div className="col-span-2">
          <Input
            label="Código postal *"
            error={errors.zipCode?.message}
            {...register("zipCode")}
          />
        </div>
      </div>
    </div>
  );
}
