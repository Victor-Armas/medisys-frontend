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
    <div className="relative pl-2" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-2 transition-colors text-left rounded-lg hover:bg-inner/60"
      >
        <div className="w-8 h-8 rounded-full bg-principal-gradient flex items-center justify-center text-white text-xs font-semibold">
          {initials}
        </div>

        <div className="hidden md:block min-w-[100px] leading-tight">
          <p className="text-xs font-medium text-encabezado">{`${user?.firstName} ${user?.lastNamePaternal}` || "Usuario"}</p>
          <p className="text-[11px] text-subtitulo">{getRoleConfig(user?.role as Role).label}</p>
        </div>

        <ChevronDown
          size={14}
          className={`text-subtitulo ml-1 hidden md:block transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-interior shadow-xl rounded-xl border border-black/5 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-subtitulo/10 transition-colors text-left font-medium"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
