import { Search } from "lucide-react";

export function TopbarSearch() {
  return (
    <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-xl bg-bg-base border border-border-default w-72">
      <Search size={13} className="text-text-secondary shrink-0" />
      <input
        type="text"
        placeholder="Buscar pacientes, citas..."
        className="flex-1 bg-transparent text-sm outline-none text-text-primary placeholder:text-text-secondary"
      />
    </div>
  );
}
