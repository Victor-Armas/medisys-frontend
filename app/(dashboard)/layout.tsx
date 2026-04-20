import { Sidebar } from "@/features/layout/Sidebar";
import { Topbar } from "@/features/layout/topbar/Topbar";
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();

  const userCookie = cookieStore.get("user")?.value;
  let user = null;
  try {
    user = userCookie ? JSON.parse(userCookie) : null;
  } catch {
    // ignorar parse error
  }

  const sidebarCollapsed = cookieStore.get("sidebarCollapsed")?.value === "true";

  return (
    <div className="flex h-screen overflow-hidden bg-external relative">
      <Sidebar initialCollapsed={sidebarCollapsed} role={user?.role ?? ""} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar initialUser={user} />
        <main className="flex-1 overflow-y-auto bg-external">{children}</main>
      </div>
    </div>
  );
}
