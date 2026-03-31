// app/(dashboard)/users/page.tsx
import { UsersPanelClient } from "@/features/users/components/UsersPanelClient";
import type { User } from "@/features/users/types/users.types";
import { cookies } from "next/headers";

interface FetchDataResponse {
  users: User[];
}

async function fetchAllUsersServer(): Promise<FetchDataResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return { users: [] };

  const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const [usersRes, doctorsRes] = await Promise.all([
      fetch(`${base}/users`, { headers, cache: "no-store" }),
      fetch(`${base}/doctors`, { headers, cache: "no-store" }),
    ]);

    const [usersData, doctorsData]: [User[], User[]] = await Promise.all([
      usersRes.ok ? usersRes.json() : Promise.resolve([]),
      doctorsRes.ok ? doctorsRes.json() : Promise.resolve([]),
    ]);

    const mergedUsersMap = new Map<string, User>();
    [...usersData, ...doctorsData].forEach((u) => mergedUsersMap.set(u.id, u));

    return {
      users: Array.from(mergedUsersMap.values()),
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return { users: [] };
  }
}

export default async function UsersPage() {
  const { users } = await fetchAllUsersServer();
  return <UsersPanelClient initialUsers={users} />;
}
