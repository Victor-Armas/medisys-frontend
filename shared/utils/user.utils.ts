/**
 * Shared utility functions for user-related formatting.
 */

interface UserWithNames {
  firstName: string;
  middleName?: string | null;
  lastNamePaternal: string;
  lastNameMaternal?: string | null;
}

interface UserWithInitials {
  firstName: string;
  lastNamePaternal: string;
}

/**
 * Returns the full name of a user.
 */
export function getFullName(u: UserWithNames): string {
  return [u.firstName, u.middleName, u.lastNamePaternal, u.lastNameMaternal]
    .filter(Boolean)
    .join(" ");
}

/**
 * Returns the initials of a user.
 */
export function getInitials(u: UserWithInitials): string {
  return `${u.firstName[0] ?? ""}${u.lastNamePaternal[0] ?? ""}`.toUpperCase();
}
