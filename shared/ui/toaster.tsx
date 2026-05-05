"use client";

import React from "react";
import { Toaster as Sonner, toast, type ExternalToast } from "sonner";
import { CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { motion } from "motion/react";

type Variant = "success" | "error" | "loading";

interface CustomToastProps {
  title: string;
  description?: string;
  variant: Variant;
  id: string | number;
  duration?: number;
}

const styles = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-500 dark:text-emerald-400",
    bgIcon: "bg-emerald-500/10 dark:bg-emerald-400/10",
    border: "border-emerald-500/20",
    glow: "shadow-[0_4px_24px_rgba(16,185,129,0.12)]",
    progress: "bg-emerald-500/70",
  },
  error: {
    icon: AlertCircle,
    iconColor: "text-rose-500 dark:text-rose-400",
    bgIcon: "bg-rose-500/10 dark:bg-rose-400/10",
    border: "border-rose-500/20",
    glow: "shadow-[0_4px_24px_rgba(244,63,94,0.12)]",
    progress: "bg-rose-500/70",
  },
  loading: {
    icon: Loader2,
    iconColor: "text-principal",
    bgIcon: "bg-principal/10",
    border: "border-principal/20",
    glow: "shadow-[0_4px_24px_rgba(var(--principal),0.15)]",
    progress: "bg-principal/70",
  },
};

function CustomToast({ title, description, variant, id, duration }: CustomToastProps) {
  const config = styles[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "relative overflow-hidden w-full pointer-events-auto shadow-md",
        "flex items-start gap-3 p-4",
        "rounded-md border backdrop-blur-2xl",
        "bg-white/80 dark:bg-zinc-950/80", // Glassmorphism base
        config.border,
        config.glow,
      )}
    >
      {/* 🎯 Contenedor del Icono con animación Spring */}
      <div className={cn("p-2 rounded-xl shrink-0", config.bgIcon)}>
        <motion.div
          initial={{ scale: 0.4, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
        >
          <Icon className={cn("w-5 h-5", config.iconColor, variant === "loading" && "animate-spin")} strokeWidth={2} />
        </motion.div>
      </div>

      {/* 🧠 Contenido del Texto */}
      <div className="flex flex-col flex-1 pt-1 gap-1">
        <span className="font-semibold text-[14px] leading-none text-zinc-900 dark:text-zinc-100 tracking-tight">{title}</span>
        {description && <span className="text-[13px] leading-snug text-zinc-500 dark:text-zinc-400">{description}</span>}
      </div>

      {/* ❌ Botón Cerrar (Sutil hasta hacer hover) */}
      <button
        onClick={() => toast.dismiss(id)}
        className="p-1.5 shrink-0 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
      >
        <X size={16} strokeWidth={2} />
      </button>

      {/* ⏳ Barra de Progreso de Tiempo (Framer Motion) */}
      {variant !== "loading" && duration && duration !== Infinity && (
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          transition={{ duration: duration / 1000, ease: "linear" }}
          className={cn("absolute bottom-0 left-0 h-[3px]", config.progress)}
        />
      )}
    </div>
  );
}

// ==========================================
// CONTROLADOR DE NOTIFICACIONES
// ==========================================
export const notify = {
  success: (title: string, description?: string, options?: ExternalToast) => {
    const duration = options?.duration || 4000;
    return toast.custom(
      (id) => <CustomToast id={id} variant="success" title={title} description={description} duration={duration} />,
      { duration, ...options },
    );
  },

  error: (title: string, description?: string, options?: ExternalToast) => {
    const duration = options?.duration || 5000; // Le damos 1 seg más al error para que lo lean
    return toast.custom(
      (id) => <CustomToast id={id} variant="error" title={title} description={description} duration={duration} />,
      { duration, ...options },
    );
  },

  loading: (title: string, description?: string, options?: ExternalToast) =>
    toast.custom((id) => <CustomToast id={id} variant="loading" title={title} description={description} />, {
      duration: Infinity,
      ...options,
    }),

  dismiss: toast.dismiss,
};

// ==========================================
// COMPONENTE CONTENEDOR (ORQUESTADOR)
// ==========================================
type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-right" // 👈 Posición recomendada para SaaS
      toastOptions={{
        classNames: {
          toast: "!bg-transparent !shadow-none !border-none !p-0 !w-full",
          content: "!p-0 !w-full",
        },
      }}
      {...props}
    />
  );
}
