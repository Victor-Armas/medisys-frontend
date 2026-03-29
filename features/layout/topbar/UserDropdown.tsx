"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ChevronDown } from "lucide-react";
import { useUserInitials } from "./hooks/useUserInitials";
import { AuthUser } from "@/features/auth/types/auth.types";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { getRoleConfig } from "@/shared/constants/roles";
import { Role } from "@/features/users/types/users.types";
import { useTheme } from "next-themes";

interface Props {
  user: AuthUser | null;
}

export function UserDropdown({ user }: Props) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const initials = useUserInitials(user);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { setTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setTheme("light");
    logout();
    router.push("/login");
  }

  return (
    <div className="relative pl-2 border-l border-border-default" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-bg-subtle p-1 pr-2 rounded-xl transition-colors cursor-pointer text-left"
      >
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-brand-gradient-from to-brand-gradient-to flex items-center justify-center text-white text-xs font-semibold">
          {initials}
        </div>
        <div className="hidden md:block min-w-[100px]">
          <p className="text-xs font-medium text-text-primary leading-tight">
            {`${user?.firstName} ${user?.lastNamePaternal}` || "Usuario"}
          </p>
          <p className="text-[11px] text-text-secondary leading-tight">
            {getRoleConfig(user?.role as Role).label}
          </p>
        </div>
        <ChevronDown
          size={14}
          className="text-text-secondary ml-1 hidden md:block"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-bg-elevated border border-border-default rounded-xl shadow-lg py-1 overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-bg-subtle transition-colors text-left cursor-pointer font-medium"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
