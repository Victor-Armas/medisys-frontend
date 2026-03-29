"use client";

import { usePageTitle } from "./hooks/usePageTitle";
import { TopbarSearch } from "./TopbarSearch";
import { TopbarActions } from "./TopbarActions";
import { UserDropdown } from "./UserDropdown";
import { AuthUser } from "@/features/auth/types/auth.types";

interface Props {
  initialUser: AuthUser | null;
}

export function Topbar({ initialUser }: Props) {
  const page = usePageTitle();

  const fecha = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="h-14 bg-bg-surface border-b border-border-default flex items-center justify-between px-6 shrink-0 relative z-10">
      <div>
        <h1 className="text-sm font-semibold text-text-primary capitalize">
          {`Sección: ${page.title}`}
        </h1>
        <p className="text-[11px] text-text-secondary capitalize">{fecha}</p>
      </div>

      <TopbarSearch />

      <div className="flex items-center gap-2">
        <TopbarActions />
        <UserDropdown user={initialUser} />
      </div>
    </header>
  );
}
