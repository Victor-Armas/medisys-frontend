"use client";

import { formatPhone } from "@/features/patients/utils/patient.utils";
import { User } from "../../types";
import { formatFullDate } from "@/shared/utils/date.utils";
import { getRoleConfig } from "@/shared/constants/roles";

interface Props {
  user: User;
}

export default function AccountProfileCard({ user }: Props) {
  const phone = formatPhone(user.phone);
  const createDate = formatFullDate(user.createdAt);
  const role = getRoleConfig(user.role);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 space-y-3">
      <div>
        <h3 className="text-subtitulo text-xs font-medium uppercase">Nombre (s)</h3>
        <p className="text-encabezado text-md mt-1">
          {user.firstName} {user.middleName}
        </p>
      </div>
      <div>
        <h3 className="text-subtitulo text-xs font-medium uppercase">Apellidos</h3>
        <p className="text-encabezado text-md mt-1">
          {user.lastNamePaternal} {user.lastNameMaternal}
        </p>
      </div>
      <div>
        <h3 className="text-subtitulo text-xs font-medium uppercase">Telefono</h3>
        <p className="text-encabezado text-md mt-1">{phone ? phone : "***************"}</p>
      </div>
      <div>
        <h3 className="text-subtitulo text-xs font-medium uppercase">Correo</h3>
        <p className="text-encabezado text-md mt-1">{user.email}</p>
      </div>
      <div>
        <h3 className="text-subtitulo text-xs font-medium uppercase">Cuenta creada</h3>
        <p className="text-encabezado text-md mt-1">{createDate}</p>
      </div>
      <div>
        <h3 className="text-subtitulo text-xs font-medium uppercase">Tipo de Rol</h3>
        <div className="flex">
          <p className={`text-encabezado text-md mt-1 rounded px-2 ${role.badge}`}>{role.label}</p>
        </div>
      </div>
    </div>
  );
}
