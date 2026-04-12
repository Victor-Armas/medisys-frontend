import React from "react";

interface Props {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}

export function HistorySection({ title, icon, color, children }: Props) {
  return (
    <div className="rounded-2xl border border-border-default overflow-hidden bg-white shadow-sm">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border-default bg-bg-base/50 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full" style={{ background: color }} />
        <span className="pl-2" style={{ color }}>
          {icon}
        </span>
        <h4 className="text-sm font-semibold text-text-primary">{title}</h4>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
