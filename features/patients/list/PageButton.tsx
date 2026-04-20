import { cn } from "@/shared/lib/utils";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export function PageButton({ children, active, disabled, onClick }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
        active ? "bg-brand text-white" : "text-text-secondary hover:bg-bg-subtle border border-border-default",
        disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer",
      )}
    >
      {children}
    </button>
  );
}
