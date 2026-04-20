"use client";

import { TopbarActions } from "./TopbarActions";
import { UserDropdown } from "./UserDropdown";
import { AuthUser } from "@/features/auth/types/auth.types";

interface Props {
  initialUser: AuthUser | null;
}

export function Topbar({ initialUser }: Props) {
  return (
    <header className="h-14 bg-external flex items-center justify-end relative z-50">
      <div className="flex items-center gap-2 pr-4">
        <TopbarActions />
        <UserDropdown user={initialUser} />
      </div>
    </header>
  );
}
