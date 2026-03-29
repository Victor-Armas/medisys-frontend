import { Stethoscope, CheckCircle2 } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { GREEN } from "../constants";

export function ModalHeader() {
  return (
    <div
      className="px-7 pt-7 pb-6"
      style={{
        background: GREEN.bg,
        borderBottom: `1px solid ${GREEN.border}`,
      }}
    >
      <DialogHeader>
        {/* Ícono médico */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm"
          style={{ background: GREEN.iconBg }}
        >
          <Stethoscope
            size={22}
            style={{ color: GREEN.icon }}
            strokeWidth={2}
          />
        </div>

        <DialogTitle className="text-xl font-bold tracking-tight text-text-primary dark:text-white">
          Asignar Perfil Médico
        </DialogTitle>
        <DialogDescription className="text-[13px] text-text-secondary dark:text-text-disabled mt-1">
          Convierte a un usuario existente en Médico completando sus datos
          profesionales.
        </DialogDescription>
      </DialogHeader>

      {/* Banner informativo */}
      <div
        className="flex items-start gap-3 mt-5 p-3.5 rounded-xl"
        style={{
          background: GREEN.infoBg,
          border: `1px solid ${GREEN.infoBorder}`,
        }}
      >
        <CheckCircle2
          size={16}
          style={{ color: GREEN.icon }}
          className="shrink-0 mt-0.5"
        />
        <p
          className="text-[12.5px] font-medium leading-relaxed"
          style={{ color: GREEN.infoText }}
        >
          El rol del usuario cambiará automáticamente a <strong>Médico</strong>{" "}
          al finalizar este proceso.
        </p>
      </div>
    </div>
  );
}
