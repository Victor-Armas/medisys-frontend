import { useState, useMemo } from "react";
import type { User } from "../types/users.types";

export type ActivityStatusTab = "ALL" | "ACTIVE" | "INACTIVE";

export function useUserFilters(users: User[]) {
  const [tab, setTab] = useState<ActivityStatusTab>("ALL");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = users;

    // 1. Filtro por Estado (Tabs)
    if (tab === "ACTIVE") list = list.filter((u) => u.isActive);
    if (tab === "INACTIVE") list = list.filter((u) => !u.isActive);

    // 2. Filtro por Búsqueda de Texto
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastNamePaternal?.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.doctorProfile?.specialty?.toLowerCase().includes(q), // Añadido: buscar por especialidad
      );
    }
    return list;
  }, [users, tab, search]);

  return { tab, setTab, search, setSearch, filtered };
}
