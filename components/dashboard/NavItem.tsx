"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { useUIStore } from "@/store/ui.store";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

export function NavItem({ href, icon: Icon, label, badge }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium transition-all duration-200 overflow-hidden ${
        collapsed ? "justify-center px-2" : ""
      } ${
        isActive
          ? "bg-[#F3EFFF] dark:bg-[#5542F6]/10 text-brand dark:text-[#7A69FF]"
          : "text-[#6A7185] hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
      }`}
    >
      <Icon size={18} className="shrink-0" />
      {!collapsed && <span className="flex-1 truncate">{label}</span>}
      {!collapsed && badge !== undefined && badge > 0 && (
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#5542F6]/10 text-brand">
          {badge}
        </span>
      )}

      {/* Active Indicator */}
      {isActive && (
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-brand " />
      )}
    </Link>
  );
}
