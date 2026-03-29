import { AuthUser } from "@/features/auth/types/auth.types";

export function useUserInitials(user: AuthUser | null): string {
  return (
    `${user?.firstName ?? ""} ${user?.lastNamePaternal ?? ""}`
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??"
  );
}
