import { cn } from "@/shared/lib/utils";

import { getRoleConfig } from "@/shared/constants/roles";
import { getFullName, getInitials, User } from "@/features/users/types/users.types";

interface Props {
  user: User;
  onSelect: (user: User) => void;
}

export function UserDropdownItem({ user, onSelect }: Props) {
  const fullName = getFullName(user);
  const initials = getInitials(user);
  const config = getRoleConfig(user.role);

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(user)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left
                   hover:bg-inner-principal transition-colors group"
      >
        <div
          className={cn(
            "w-9 h-9 rounded-full bg-linear-to-br shrink-0",
            "flex items-center justify-center text-white text-xs font-bold",
            config.badge,
          )}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-encabezado truncate group-hover:text-principal transition-colors">
            {fullName}
          </p>
          <p className="text-xs text-subtitulo truncate">
            {config.label} · {user.email}
          </p>
        </div>

        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0",
            user.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-zinc-500/10 text-zinc-500",
          )}
        >
          {user.isActive ? "Activo" : "Inactivo"}
        </span>
      </button>
    </li>
  );
}
