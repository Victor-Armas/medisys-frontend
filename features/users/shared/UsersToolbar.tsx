"use client";

import { Search } from "lucide-react";
import { ActivityStatusTab } from "../hooks/useUserFilters";
import { Input } from "@/shared/ui/input";

interface Props {
  tab: ActivityStatusTab;
  setTab: (value: ActivityStatusTab) => void;
  search: string;
  setSearch: (value: string) => void;
}

const TABS: { value: ActivityStatusTab; label: string }[] = [
  { value: "ALL", label: "Todos" },
  { value: "ACTIVE", label: "Activos" },
  { value: "INACTIVE", label: "Inactivos" },
];

export function UsersToolbar({ tab, setTab, search, setSearch }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
      {/* Selector de Tabs */}
      <div className="flex items-center bg-fondo-inputs p-1 rounded-sm">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-6 py-1.5 text-[14px] font-medium transition-all rounded-sm ${
              tab === t.value ? "bg-principal text-white shadow-sm" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Input de Búsqueda */}
      <div className="relative w-full md:w-80">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-subtitulo" />
        <Input type="text" value={search} onChange={(e) => setSearch(e.target.value)} label="Buscar usuarios..." />
      </div>
    </div>
  );
}
