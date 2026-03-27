import { Loader2, Stethoscope } from "lucide-react";
import { GREEN } from "../constants";

interface Props {
  isPending: boolean;
  hasSelectedUser: boolean;
  onClose: () => void;
}

export function ModalFooter({ isPending, hasSelectedUser, onClose }: Props) {
  return (
    <div className="px-7 py-5 border-t border-border-default dark:border-white/5 bg-bg-base/50 dark:bg-[#08080a]">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-medium rounded-xl transition-colors
                     text-text-secondary border border-border-default hover:bg-bg-subtle
                     dark:border-white/10 dark:hover:bg-white/5"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={isPending || !hasSelectedUser}
          className="flex items-center gap-2.5 px-7 py-2.5 text-sm font-semibold text-white
                     rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: GREEN.btn,
            boxShadow: `0 4px 14px 0 ${GREEN.btn}40`,
          }}
          onMouseEnter={(e) => {
            if (!isPending && hasSelectedUser)
              (e.currentTarget as HTMLButtonElement).style.background =
                GREEN.btnHover;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = GREEN.btn;
          }}
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Stethoscope size={16} />
          )}
          Asignar Perfil Médico
        </button>
      </div>
    </div>
  );
}
