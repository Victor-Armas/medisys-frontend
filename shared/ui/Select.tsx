"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface SelectProps extends React.ComponentProps<"select"> {
  error?: string;
  wrapperClassName?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className, wrapperClassName, id, children, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;

    return (
      <div className={cn("flex flex-col gap-1", wrapperClassName)}>
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "w-full rounded-sm bg-fondo-inputs text-sm text-encabezado cursor-pointer shadow-xs",
            "py-3 px-4",
            "transition-all duration-200 outline-none",
            "focus:ring-2 focus:ring-principal/40",
            error && "focus:ring-red-400",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          {...props}
        >
          {children}
        </select>

        {error && (
          <p id={`${selectId}-error`} className="text-[11px] font-medium ml-1 flex items-center gap-2 text-red-500">
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

Select.displayName = "Select";
