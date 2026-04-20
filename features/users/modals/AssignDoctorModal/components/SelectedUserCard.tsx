import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { getRoleConfig } from "@/shared/constants/roles";
import { GREEN } from "../constants";
import { getFullName, getInitials, type User } from "@/features/users/types/users.types";

interface Props {
  user: User;
  onClear: () => void;
}

export function SelectedUserCard({ user, onClear }: Props) {
  const fullName = getFullName(user);
  const initials = getInitials(user);
  const config = getRoleConfig(user.role);

  return (
    <div
      className="flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all"
      style={{ borderColor: GREEN.icon, background: GREEN.infoBg }}
    >
      <div
        className={cn(
          "w-11 h-11 rounded-full bg-linear-to-br shrink-0",
          "flex items-center justify-center text-white text-sm font-bold",
          config.gradient,
        )}
      >
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-encabezado truncate">{fullName}</p>
        <p className="text-xs text-subtitulo truncate">
          {config.label} · {user.email}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1"
          style={{ background: GREEN.iconBg, color: GREEN.icon }}
        >
          <CheckCircle2 size={10} />
          Seleccionado
        </span>
        <button
          type="button"
          onClick={onClear}
          className="w-7 h-7 rounded-lg flex items-center justify-center
                     text-subtitulo hover:bg-subtitulo hover:text-encabezado transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
