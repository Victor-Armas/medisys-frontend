// app/(dashboard)/users/page.tsx
import { UsersPanelClient } from "@/features/users/components/UsersPanelClient";
import type { User } from "@/features/users/types/users.types";
import { cookies } from "next/headers";

async function fetchAllUsersServer(): Promise<User[]> {
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
    const users: User[] = usersRes.ok ? await usersRes.json() : [];
    const doctors: User[] = doctorsRes.ok ? await doctorsRes.json() : [];
    const map = new Map<string, User>();
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
