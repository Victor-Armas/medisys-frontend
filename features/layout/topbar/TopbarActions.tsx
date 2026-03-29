import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { Bell } from "lucide-react";

export function TopbarActions() {
  return (
    <div className="flex items-center gap-2">
      <button className="relative w-8 h-8 rounded-lg bg-bg-base border border-border-default flex items-center justify-center text-text-secondary hover:bg-bg-subtle hover:text-brand transition-colors cursor-pointer">
        <Bell size={14} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand rounded-full" />
      </button>
      <ThemeToggle />
    </div>
  );
}
