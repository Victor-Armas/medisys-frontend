/**
 * Constants for the medical calendar and scheduling system.
 */

export const CALENDAR_COLORS = {
  BASE: { 
    bg: "#7c6ab5", 
    text: "#ffffff", 
    name: "BASE" as const 
  },
  CUSTOM: { 
    bg: "#f59e0b", 
    text: "#ffffff", 
    name: "CUSTOM" as const 
  },
  AVAILABLE: { 
    bg: "#10b981", 
    text: "#ffffff", 
    name: "AVAILABLE" as const 
  },
  UNAVAILABLE: { 
    bg: "#ef4444", 
    text: "#ffffff", 
    name: "UNAVAILABLE" as const 
  },
} as const;

export const OVERRIDE_CONFIG = {
  AVAILABLE: {
    label: "Día Extra",
    badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  UNAVAILABLE: {
    label: "Inhábil",
    badge: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400 dark:border-red-500/20",
    dot: "bg-red-500",
  },
  CUSTOM: {
    label: "Especial",
    badge: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400 dark:border-amber-500/20",
    dot: "bg-amber-500",
  },
} as const;
