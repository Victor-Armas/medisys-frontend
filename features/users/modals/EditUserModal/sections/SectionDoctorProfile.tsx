"use client";

import { Award, Stethoscope, GraduationCap, BookOpen, MapPin, Clock } from "lucide-react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Input } from "@/shared/ui/input";
import { EditDoctorProfileFormData } from "@/validations/user.schema";

interface Props {
  register: UseFormRegister<EditDoctorProfileFormData>;
  errors: FieldErrors<EditDoctorProfileFormData>;
}

export function SectionDoctorProfile({ register, errors }: Props) {
  return (
    <div className="space-y-5">
      {/* Datos profesionales */}
      <div>
        <p className="text-[11px] font-bold text-subtitulo uppercase tracking-wider mb-3">Datos profesionales</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input
              label="Cédula profesional *"
              icon={Award}
              error={errors.professionalLicense?.message}
              className="font-mono tracking-wider"
              {...register("professionalLicense")}
            />
          </div>
          <Input label="Especialidad" icon={Stethoscope} error={errors.specialty?.message} {...register("specialty")} />
          <Input label="Universidad" icon={GraduationCap} error={errors.university?.message} {...register("university")} />
          <div className="col-span-2">
            <Input label="Título para recetas" icon={BookOpen} error={errors.fullTitle?.message} {...register("fullTitle")} />
          </div>
          <div className="col-span-2">
            <Input
              label="Duración de cita (minutos) *"
              icon={Clock}
              type="number"
              error={errors.defaultAppointmentDuration?.message}
              {...register("defaultAppointmentDuration", { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Dirección */}
      <div>
        <p className="text-[11px] font-bold text-subtitulo uppercase tracking-wider mb-3">Dirección personal</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Input label="Calle *" icon={MapPin} error={errors.address?.message} {...register("address")} />
          </div>
          <Input label="Número *" error={errors.numHome?.message} {...register("numHome")} />
          <Input label="Colonia *" error={errors.colony?.message} {...register("colony")} />
          <Input label="Ciudad *" error={errors.city?.message} {...register("city")} />
          <Input label="Estado *" error={errors.state?.message} {...register("state")} />
          <div className="col-span-2">
            <Input label="Código postal *" error={errors.zipCode?.message} {...register("zipCode")} />
          </div>
        </div>
      </div>
    </div>
  );
}
