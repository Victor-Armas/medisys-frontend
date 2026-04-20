import { Award, Stethoscope, GraduationCap, BookOpen } from "lucide-react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { type AssignDoctorFormData } from "@/validations/user.schema";
import { SectionDivider } from "../components/SectionDivider";
import { GREEN } from "../constants";

interface Props {
  register: UseFormRegister<AssignDoctorFormData>;
  errors: FieldErrors<AssignDoctorFormData>;
}

export function SectionProfessionalData({ register, errors }: Props) {
  return (
    <section className="space-y-4">
      <SectionDivider
        label="Datos profesionales"
        icon={<Award size={13} />}
        color={GREEN.icon}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Cédula profesional *"
            icon={Award}
            error={errors.professionalLicense?.message}
            {...register("professionalLicense")}
          />
        </div>

        <Input
          label="Especialidad"
          icon={Stethoscope}
          error={errors.specialty?.message}
          {...register("specialty")}
        />

        <Input
          label="Universidad"
          icon={GraduationCap}
          error={errors.university?.message}
          {...register("university")}
        />

        <div className="sm:col-span-2">
          <Input
            label="Título para recetas (ej. Dr. Nombre — Especialista)"
            icon={BookOpen}
            error={errors.fullTitle?.message}
            {...register("fullTitle")}
          />
        </div>
      </div>
    </section>
  );
}
