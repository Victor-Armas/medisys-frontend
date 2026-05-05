// features/patients/create/FormCard.tsx
"use client";

import { cn } from "@/shared/lib/utils";

interface Props {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

export function FormCard({ title, icon, children, className, action }: Props) {
  return (
    <div className={cn("rounded-xl border border-disable bg-interior overflow-hidden", className)}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-disable/50">
        <div className="flex items-center gap-2.5">
          <span className="text-principal shrink-0">{icon}</span>
          <h3 className="text-sm font-bold text-principal">{title}</h3>
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
