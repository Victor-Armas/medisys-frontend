"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  collapsed?: boolean;
}

export function NavItem({ href, icon: Icon, label, badge, collapsed = false }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] font-medium transition-all duration-200 ${
        collapsed ? "justify-center px-2" : ""
      } ${
        isActive
          ? "bg-bg-subtle text-brand" // Usando variables de globals.css
          : "text-text-secondary hover:bg-bg-subtle/50"
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
