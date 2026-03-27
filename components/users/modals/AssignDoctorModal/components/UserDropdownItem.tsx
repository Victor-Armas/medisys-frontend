import { cn } from "@/lib/utils";
import { getFullName, getInitials, type User } from "@/types/users.types";
import { getRoleConfig } from "@/constants/roles";

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
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                   hover:bg-bg-subtle transition-colors group"
      >
        <div
          className={cn(
            "w-9 h-9 rounded-full bg-linear-to-br shrink-0",
            "flex items-center justify-center text-white text-xs font-bold",
            config.gradient
          )}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate group-hover:text-brand transition-colors">
            {fullName}
          </p>
          <p className="text-xs text-text-secondary truncate">
            {config.label} · {user.email}
          </p>
        </div>

        <span
          className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0",
            user.isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-zinc-500/10 text-zinc-500"
          )}
        >
          {user.isActive ? "Activo" : "Inactivo"}
        </span>
      </button>
    </li>
  );
}
