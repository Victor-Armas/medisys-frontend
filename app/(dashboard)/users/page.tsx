// app/(dashboard)/users/page.tsx
import { cookies } from "next/headers";

import type { SystemUser } from "@/types/users.types";
import { UsersPanelClient } from "@/components/users/UsersPanelClient";

async function fetchAllUsersServer(): Promise<SystemUser[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return [];

  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const [usersRes, doctorsRes] = await Promise.all([
      fetch(`${base}/users`, { headers, cache: "no-store" }),
      fetch(`${base}/doctors`, { headers, cache: "no-store" }),
    ]);
    const users: SystemUser[] = usersRes.ok ? await usersRes.json() : [];
    const doctors: SystemUser[] = doctorsRes.ok ? await doctorsRes.json() : [];
    const map = new Map<string, SystemUser>();
    [...users, ...doctors].forEach((u) => map.set(u.id, u));
    return Array.from(map.values());
  } catch {
    return [];
  }
}

export default async function UsersPage() {
  const initialUsers = await fetchAllUsersServer();
  return <UsersPanelClient initialUsers={initialUsers} />;
}
