import { Stethoscope } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/shared/ui/dialog";
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
      <DialogHeader className="flex flex-row">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center  shadow-sm" style={{ background: GREEN.iconBg }}>
          <Stethoscope size={22} style={{ color: GREEN.icon }} strokeWidth={2} />
        </div>

        <div className="pl-5">
          <DialogTitle className="text-xl font-bold tracking-tight text-gray-700 ">Asignar Perfil Médico</DialogTitle>
          <DialogDescription className="text-[13px] text-gray-500">
            Convierte a un usuario existente en Médico completando sus datos profesionales.
          </DialogDescription>
        </div>
      </DialogHeader>
    </div>
  );
}
