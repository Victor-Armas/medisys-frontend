"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "../../ui/input";

type TabFilter =
  | "all"
  | "DOCTOR"
  | "MAIN_DOCTOR"
  | "RECEPTIONIST"
  | "ADMIN_SYSTEM";

interface Props {
  tab: TabFilter;
  setTab: (value: TabFilter) => void;
  search: string;
  setSearch: (value: string) => void;
}

const TABS: { key: TabFilter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "MAIN_DOCTOR", label: "Médico principal" },
  { key: "DOCTOR", label: "Médicos" },
  { key: "RECEPTIONIST", label: "Recepcionistas" },
  { key: "ADMIN_SYSTEM", label: "Admins" },
];

export function UsersToolbar({ tab, setTab, search, setSearch }: Props) {
  return (
    <Card className="border-border-default bg-bg-surface shadow-none p-1.5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-1.5">
        {/* Tabs de filtro */}
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as TabFilter)}
          className="w-full md:w-auto"
        >
          <TabsList className="h-9 gap-0.5 bg-bg-base/70 border border-border-default p-1">
            {TABS.map((t) => (
              <TabsTrigger
                key={t.key}
                value={t.key}
                className="rounded-xl px-4 py-2 text-[12.5px] font-medium text-text-seconxy
                           data-[state=active]:bg-bg-surface data-[state=active]:text-brand
                           data-[state=active]:font-semibold data-[state=active]:shadow-sm
                           whitespace-nowrap transition-all"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Búsqueda + Filtro */}
        <div className="flex items-center gap-2 w-full md:w-auto px-1">
          <div className="relative flex-1 md:w-72">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email..."
              className="pl-9 h-8 bg-bg-base border-border-default text-sm
                         placeholder:text-text-muted focus:border-border-strong
                         focus-visible:ring-0 focus-visible:ring-offset-0 transition-colors"
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 shrink-0 border-border-default text-text-secondary
                       hover:border-border-strong hover:text-text-primary"
          >
            <SlidersHorizontal size={14} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
