"use client";

import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/shared/lib/utils";
import { type LucideIcon } from "lucide-react";

// ─────────────────────────────────────────────────────────────
// FloatingInput — Input con label flotante estilo Material Design
// Soporta: ícono izquierdo, elemento derecho, estado de error,
// placeholder, disabled, readonly, y todas las props nativas.
// ─────────────────────────────────────────────────────────────

export interface InputProps extends React.ComponentProps<"input"> {
  /** Label que flota al hacer focus o cuando hay valor */
  label?: string;
  /** Mensaje de error — activa estilos de error */
  error?: string;
  /** Ícono a la izquierda (componente Lucide o cualquier ReactNode) */
  icon?: LucideIcon;
  /** Elemento a la derecha (ej. botón de toggle password) */
  rightElement?: React.ReactNode;
  /** Clases adicionales para el wrapper externo */
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      rightElement,
      className,
      wrapperClassName,
      placeholder,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const hasIcon = !!icon;

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        {/* Wrapper del input */}
        <div className="relative group">
          {/* Ícono izquierdo */}
          {hasIcon && (
            <span
              className={cn(
                "absolute left-3.5 top-1/2 -translate-y-1/2 z-10 pointer-events-none transition-colors duration-200",
                error
                  ? "text-red-500"
                  : "text-text-disabled group-focus-within:text-brand"
              )}
            >
              {React.createElement(icon, { size: 15 })}
            </span>
          )}

          {/* Input base */}
          <InputPrimitive
            id={inputId}
            ref={ref}
            placeholder={label ? " " : placeholder} // espacio para activar :placeholder-shown
            className={cn(
              // Base
              "peer w-full rounded-xl border bg-bg-surface text-sm text-text-primary",
              "transition-all duration-200 outline-none",
              // Padding: top aumentado para label flotante, left si hay ícono
              label ? "pt-5 pb-2" : "py-3",
              hasIcon ? "pl-10" : "pl-4",
              rightElement ? "pr-10" : "pr-4",
              // Border normal
              "border-border-default",
              // Focus
              "focus:border-brand focus:ring-2 focus:ring-brand/15",
              // Error
              error &&
                "border-destructive  focus:border-destructive focus:ring-destructive/15",
              // Disabled
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-bg-subtle",
              // Readonly
              "read-only:bg-bg-base read-only:cursor-default",
              // Autofill — evita el fondo azul del browser
              "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--color-bg-surface)]",
              "[&:-webkit-autofill]:[-webkit-text-fill-color:var(--color-text-primary)]",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {/* Label flotante */}
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                // Posición base: centrada verticalmente (cuando NO hay valor/focus)
                "absolute pointer-events-none select-none transition-all duration-200",
                "text-text-secondary",
                // Posición y tamaño "flotando" (cuando hay focus o valor)
                // peer-focus o cuando el placeholder NO se muestra (hay valor)
                "peer-focus:top-2 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-wider peer-focus:uppercase",
                "peer-not-placeholder-shown:top-2",
                "peer-not-placeholder-shown:text-[10px]",
                "peer-not-placeholder-shown:font-semibold",
                "peer-not-placeholder-shown:tracking-wider",
                "peer-not-placeholder-shown:uppercase",
                // Posición "descansando" (sin focus, sin valor)
                "top-1/2 -translate-y-1/2 text-sm",
                "peer-focus:translate-y-0 peer-not-placeholder-shown:translate-y-0",
                // Offset si hay ícono
                hasIcon ? "left-10" : "left-4",
                // Color según estado
                error
                  ? "text-destructive peer-focus:text-destructive"
                  : "peer-focus:text-brand"
              )}
            >
              {label}
            </label>
          )}

          {/* Elemento derecho */}
          {rightElement && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 flex items-center">
              {rightElement}
            </span>
          )}
        </div>

        {/* Mensaje de error */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[11px] font-medium ml-1 flex items-center gap-1"
            role="alert"
          >
            <span className="inline-block w-1 h-1 rounded-full bg-red-400  shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
