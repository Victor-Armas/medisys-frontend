import { cookies } from "next/headers";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const userCookie = cookieStore.get("user")?.value;
  let user = null;
  try {
    user = userCookie ? JSON.parse(userCookie) : null;
  } catch {
    // ignorar parse error
  }

  const sidebarCollapsed =
    cookieStore.get("sidebarCollapsed")?.value === "true";

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden relative">
      <Sidebar initialCollapsed={sidebarCollapsed} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar initialUser={user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
