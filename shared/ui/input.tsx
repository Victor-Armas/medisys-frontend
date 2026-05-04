"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { type LucideIcon } from "lucide-react";

export interface InputProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  rightElement?: React.ReactNode;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className, wrapperClassName, id, placeholder, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const hasIcon = !!icon;

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* wrapper */}
        <div className="relative group">
          {/* icon */}
          {hasIcon && (
            <span
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2",
                "text-subtitulo transition-colors",
                "group-focus-within:text-principal",
                error && "text-red-500",
              )}
            >
              {React.createElement(icon, { size: 16 })}
            </span>
          )}

          {/* input */}
          <input
            id={inputId}
            ref={ref}
            placeholder={label ? " " : placeholder}
            className={cn(
              "peer w-full rounded-sm bg-fondo-inputs text-sm text-encabezado shadow-xs",
              "transition-all duration-200 outline-none",
              "focus:ring-2 focus:ring-principal/40",

              // padding
              hasIcon ? "pl-10" : "pl-4",
              rightElement ? "pr-10" : "pr-4",

              // floating space
              label ? "pt-4 pb-2" : "py-3",

              // error
              error && "focus:ring-red-400",

              // disabled
              "disabled:opacity-50 disabled:cursor-not-allowed",

              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {/* floating label */}
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                "absolute left-4 pointer-events-none transition-all duration-200",

                // base (idle)
                "top-1/2 -translate-y-1/2 text-sm text-subtitulo",

                // active (focus OR has value)
                "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[7px]",
                "peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:translate-y-0",
                "peer-not-placeholder-shown:text-[7px]",

                // 🔥 estilo con más presencia (CONSISTENTE)
                "peer-focus:font-semibold peer-not-placeholder-shown:font-semibold",
                "peer-focus:tracking-wider peer-not-placeholder-shown:tracking-wider",
                "peer-focus:uppercase peer-not-placeholder-shown:uppercase",

                // color consistente
                "peer-focus:text-subtitulo peer-not-placeholder-shown:text-subtitulo",

                // icon offset
                hasIcon && "left-10",

                // error
                error && "text-red-500 peer-focus:text-red-500",
              )}
            >
              {label}
            </label>
          )}

          {/* right element */}
          {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">{rightElement}</div>}
        </div>

        {/* error */}
        {error && (
          <p id={`${inputId}-error`} className="text-[11px] font-medium ml-1 flex items-center gap-2 text-red-500" role="alert">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>

            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
