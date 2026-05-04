"use client";
import { X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { ConsultationFormValues } from "../../schemas/consultation.schema";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/Select";

interface Props {
  onCancel: () => void;
}

export function PatientNewCard({ onCancel }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext<ConsultationFormValues>();
  return (
    <div className="bg-interior rounded-xl border border-disable/20 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-bold text-principal uppercase">Registrar Nuevo Paciente</h2>
        <button type="button" onClick={onCancel} className="text-subtitulo hover:text-negative-text">
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex flex-col gap-1">
          <Input label="Nombre *" error={errors.newPatient?.firstName?.message} {...register("newPatient.firstName")} />
        </div>
        <div className="flex flex-col gap-1">
          <Input label="Segundo Nombre" error={errors.newPatient?.middleName?.message} {...register("newPatient.middleName")} />
        </div>

        <Input
          label="A. Paterno *"
          error={errors.newPatient?.lastNamePaternal?.message}
          {...register("newPatient.lastNamePaternal")}
        />
        <Input
          label="A. Materno"
          error={errors.newPatient?.lastNameMaternal?.message}
          {...register("newPatient.lastNameMaternal")}
        />
        <Input type="date" className="p-3" error={errors.newPatient?.birthDate?.message} {...register("newPatient.birthDate")} />
        <Select error={errors.newPatient?.gender?.message} {...register("newPatient.gender")}>
          <option value="">Sexo...</option>
          <option value="MALE">Masculino</option>
          <option value="FEMALE">Femenino</option>
          <option value="OTHER">Otro</option>
        </Select>
        <Input type="tel" label="Telefono" error={errors.newPatient?.phone?.message} {...register("newPatient.phone")} />
      </div>
    </div>
  );
}
