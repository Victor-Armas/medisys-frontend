import { useRef, useEffect } from "react";
import { Search, X, ChevronDown, UserRound } from "lucide-react";
import { Input } from "@/shared/ui/input";

import { SectionDivider } from "../components/SectionDivider";
import { SelectedUserCard } from "../components/SelectedUserCard";
import { UserDropdownItem } from "../components/UserDropdownItem";
import { GREEN } from "../constants";
import { User } from "@/features/users/types";

interface Props {
  selectedUser: User | null;
  filteredUsers: User[];
  userSearch: string;
  dropdownOpen: boolean;
  userTouched: boolean;
  onSearchChange: (value: string) => void;
  onFocus: () => void;
  onSelect: (user: User) => void;
  onClear: () => void;
  onDropdownClose: () => void;
}

export function SectionUserSearch({
  selectedUser,
  filteredUsers,
  userSearch,
  dropdownOpen,
  userTouched,
  onSearchChange,
  onFocus,
  onSelect,
  onClear,
  onDropdownClose,
}: Props) {
  const searchRef = useRef<HTMLDivElement>(null);

  // Cierra el dropdown al hacer click fuera
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        onDropdownClose();
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [onDropdownClose]);

  return (
    <section className="space-y-4">
      <SectionDivider
        label="Selección de usuario"
        icon={<UserRound size={13} />}
        color={GREEN.icon}
      />

      {selectedUser ? (
        <SelectedUserCard user={selectedUser} onClear={onClear} />
      ) : (
        <div ref={searchRef} className="relative">
          <Input
            autoFocus={false}
            label="Buscar por nombre o correo"
            icon={Search}
            value={userSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={onFocus}
            autoComplete="off"
            rightElement={
              userSearch ? (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="text-text-disabled hover:text-text-secondary transition-colors"
                >
                  <X size={14} />
                </button>
              ) : (
                <ChevronDown size={14} className="text-text-disabled" />
              )
            }
          />

          {dropdownOpen && userTouched && (
            <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-bg-surface border border-border-default rounded-2xl shadow-xl overflow-hidden">
              {filteredUsers.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-text-secondary">
                    {userSearch
                      ? "No se encontraron usuarios con ese nombre"
                      : "No hay usuarios disponibles para asignar"}
                  </p>
                  <p className="text-xs text-text-disabled mt-1">
                    Solo se muestran usuarios sin perfil médico
                  </p>
                </div>
              ) : (
                <ul className="max-h-52 overflow-y-auto divide-y divide-border-default/50 p-1">
                  {filteredUsers.map((user) => (
                    <UserDropdownItem
                      key={user.id}
                      user={user}
                      onSelect={onSelect}
                    />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
