"use client";

import React from "react";
import { Toaster as Sonner, toast, type ExternalToast } from "sonner";
import { Check, XCircle, Loader2, X } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type Variant = "success" | "error" | "loading";

interface CustomToastProps {
  title: string;
  description?: string;
  variant: Variant;
  id: string | number;
}

const styles = {
  success: {
    icon: Check,
    iconColor: "text-emerald-500",
    border: "border-emerald-500/40",
  },

  error: {
    icon: XCircle,
    iconColor: "text-rose-500",
    border: "border-rose-500/40",
  },

  loading: {
    icon: Loader2,
    iconColor: "text-zinc-400",
    border: "border-zinc-400/30",
  },
};

function CustomToast({ title, description, variant, id }: CustomToastProps) {
  const config = styles[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-4",
        "rounded-2xl",
        "border backdrop-blur-xl",
        "bg-white/90 dark:bg-zinc-900/90",
        "shadow-xl dark:shadow-black/40",
        "px-5 py-4",
        "min-w-[320px] max-w-md",
        "animate-in slide-in-from-right-8 fade-in",
        config.border,
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0 ", config.iconColor, variant === "loading" && "animate-spin")} />

      <div className="flex flex-col flex-1">
        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{title}</span>

        {description && <span className="text-xs text-zinc-500 dark:text-zinc-400">{description}</span>}
      </div>

      <button onClick={() => toast.dismiss(id)} className="opacity-40 hover:opacity-100 transition">
        <X size={16} />
      </button>
    </div>
  );
}

export const notify = {
  success: (title: string, description?: string, options?: ExternalToast) =>
    toast.custom((id) => <CustomToast id={id} variant="success" title={title} description={description} />, {
      duration: 4000,
      ...options,
    }),

  error: (title: string, description?: string, options?: ExternalToast) =>
    toast.custom((id) => <CustomToast id={id} variant="error" title={title} description={description} />, {
      duration: 4000,
      ...options,
    }),

  loading: (title: string, description?: string, options?: ExternalToast) =>
    toast.custom((id) => <CustomToast id={id} variant="loading" title={title} description={description} />, {
      duration: Infinity,
      ...options,
    }),

  dismiss: toast.dismiss,
};

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      className="toaster"
      toastOptions={{
        classNames: {
          toast: "!bg-transparent !shadow-none !border-none !p-0",
          content: "!p-0",
        },
      }}
      {...props}
    />
  );
}
