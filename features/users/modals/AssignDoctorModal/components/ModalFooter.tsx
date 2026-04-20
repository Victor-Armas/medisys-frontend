import { Loader2, Stethoscope } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface Props {
  isPending: boolean;
  hasSelectedUser: boolean;
  onClose: () => void;
}

export function ModalFooter({ isPending, hasSelectedUser, onClose }: Props) {
  return (
    <div className="px-7 py-5">
      <div className="flex items-center justify-between gap-3">
        <Button variant="cancelar" className="p-2" onClick={onClose}>
          Cancelar
        </Button>

        <Button type="submit" variant="positive" className="p-2" disabled={isPending || !hasSelectedUser}>
          {isPending ? <Loader2 size={16} className="animate-spin" /> : <Stethoscope size={16} />}
          Asignar Perfil Médico
        </Button>
      </div>
    </div>
  );
}
