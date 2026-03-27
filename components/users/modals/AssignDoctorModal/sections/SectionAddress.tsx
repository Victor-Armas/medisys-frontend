import { MapPin } from "lucide-react";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { type AssignDoctorFormData } from "@/validations/user.schema";
import { SectionDivider } from "../components/SectionDivider";
import { GREEN } from "../constants";

interface Props {
  register: UseFormRegister<AssignDoctorFormData>;
  errors: FieldErrors<AssignDoctorFormData>;
}

export function SectionAddress({ register, errors }: Props) {
  return (
    <section className="space-y-4">
      <SectionDivider
        label="Dirección de consultorio"
        icon={<MapPin size={13} />}
        color={GREEN.icon}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Calle *"
            icon={<MapPin size={15} />}
            error={errors.address?.message}
            {...register("address")}
          />
        </div>

        <Input
          label="Número / Interior *"
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

        <div className="sm:col-span-2">
          <Input
            label="Código postal *"
            error={errors.zipCode?.message}
            {...register("zipCode")}
          />
        </div>
      </div>
    </section>
  );
}
