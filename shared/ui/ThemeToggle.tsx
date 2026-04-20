"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function useIsMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useIsMounted();

  if (!isMounted) return <div className="w-8 h-8" />;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={`w-8 h-8 ${resolvedTheme === "light" ? "bg-inner-secundario hover:bg-secundario-hover text-secundario" : "bg-yellow-200 hover:bg-amber-300 text-yellow-800"}  rounded-full flex items-center justify-center transition-colors`}
      title={resolvedTheme === "dark" ? "Modo claro" : "Modo oscuro"}
    >
      {resolvedTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
