"use client";

import { cn } from "@/lib/utils";

// Definimos Props extendidas para incluir colSpan opcional
interface Props {
  label: string;
  error?: string;
  children: React.ReactNode;
  colSpan?: 1 | 2; // Permitimos 1 o 2 columnas (típico en tus formularios)
}

export function FormField({ label, error, children, colSpan = 2 }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        // Mapeamos el prop colSpan a clases de Tailwind
        colSpan === 1 ? "col-span-1" : "col-span-2"
      )}
    >
      <label className="text-[11px] font-bold text-text-muted dark:text-text-secondary uppercase tracking-wider ml-1">
        {label}
      </label>

      <div
        className={cn(
          "flex items-center px-3 h-10 rounded-xl border transition-all duration-200",
          "bg-bg-base dark:bg-white/5",
          "[&>input]:flex-1 [&>input]:bg-transparent [&>input]:text-sm",
          "[&>input]:text-text-primary dark:[&>input]:text-white [&>input]:outline-none",
          "[&>input]:placeholder:text-text-disabled",
          error
            ? "border-red-400 dark:border-red-500/50 bg-red-50/30 dark:bg-red-500/5"
            : "border-border-input dark:border-white/10 focus-within:border-brand/50 focus-within:ring-4 focus-within:ring-brand/10"
        )}
      >
        {children}
      </div>

      {error && (
        <p className="text-[11px] text-red-500 dark:text-red-400 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}
