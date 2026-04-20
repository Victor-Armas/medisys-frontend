import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import { Bell } from "lucide-react";

export function TopbarActions() {
  return (
    <div className="flex items-center gap-2">
      <button className="relative w-8 h-8 rounded-full bg-inner-principal hover:bg-principal-hover2 text-principal flex items-center justify-center transition-colors ">
        <Bell size={14} />
      </button>
      <ThemeToggle />
    </div>
  );
}
