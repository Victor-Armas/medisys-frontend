import { Search, X, UserRound } from "lucide-react";
import { Input } from "@/shared/ui/input";

import { SectionDivider } from "../components/SectionDivider";
import { SelectedUserCard } from "../components/SelectedUserCard";
import { UserDropdownItem } from "../components/UserDropdownItem";
import { GREEN } from "../constants";
import type { User } from "@/features/users/types";

// Eliminamos dropdownOpen, userTouched, onFocus y onDropdownClose. ¡El tipado respira!
interface Props {
  selectedUser: User | null;
  filteredUsers: User[];
  userSearch: string;
  onSearchChange: (value: string) => void;
  onSelect: (user: User) => void;
  onClear: () => void;
}

export function SectionUserSearch({ selectedUser, filteredUsers, userSearch, onSearchChange, onSelect, onClear }: Props) {
  return (
    <section className="space-y-4">
      <SectionDivider label="Selección de usuario" icon={<UserRound size={13} />} color={GREEN.icon} />

      {selectedUser ? (
        /* Estado 1: Usuario ya seleccionado */
        <SelectedUserCard user={selectedUser} onClear={onClear} />
      ) : (
        /* Estado 2: Buscador y Lista en línea */
        <div className="flex flex-col gap-3">
          <Input
            autoFocus={false}
            label="Buscar por nombre o correo"
            icon={Search}
            value={userSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            autoComplete="off"
            rightElement={
              userSearch && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="text-subtitulo hover:text-encabezado transition-colors"
                >
                  <X size={14} />
                </button>
              )
            }
          />

          {/* Contenedor Inline con Scroll: Adiós z-index, hola UX */}
          <div className="max-h-52 overflow-y-auto rounded-sm bg-fondo-inputs p-1 space-y-1 shadow-sm">
            {filteredUsers.length === 0 ? (
              <div className="px-4 py-8 text-center flex flex-col items-center justify-center">
                <p className="text-sm font-medium text-encabezado">
                  {userSearch ? "No se encontraron resultados" : "No hay usuarios disponibles"}
                </p>
                <p className="text-xs text-subtitulo mt-1">Solo se muestran usuarios sin perfil médico</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {filteredUsers.map((user) => (
                  /* Reutilizamos tu item, asegúrate de que UserDropdownItem no tenga anclajes raros de CSS */
                  <UserDropdownItem key={user.id} user={user} onSelect={onSelect} />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
