import React from "react";
import { SectionCard } from "./shared/SectionCard";
import { FieldRow } from "../shared/FieldRow";
import { User } from "../../types";
import { Mail, Phone } from "lucide-react";

interface Prop {
  user: User;
}

export default function UserAccountCard({ user }: Prop) {
  return (
    <SectionCard title="Datos de cuenta">
      <div className="divide-y divide-border-default/50">
        <FieldRow label="Nombre(s)" value={user.firstName} />
        <FieldRow label="Segundo nombre" value={user.middleName} />
        <FieldRow label="Apellido paterno" value={user.lastNamePaternal} />
        <FieldRow label="Apellido materno" value={user.lastNameMaternal} />
        <FieldRow label="Correo electrónico" value={user.email} icon={<Mail size={12} />} />
        <FieldRow label="Teléfono" value={user.phone} icon={user.phone ? <Phone size={12} /> : undefined} />
      </div>
    </SectionCard>
  );
}
