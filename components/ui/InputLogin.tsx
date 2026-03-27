// InputLogin.tsx
// Wrapper delgado sobre el Input unificado.
// Mantiene la misma API que antes para no romper LoginForm.tsx.

import { type LucideIcon } from "lucide-react";

import React from "react";
import { Input } from "./input";

interface InputLoginProps extends React.ComponentProps<"input"> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  rightElement?: React.ReactNode;
}

export const InputLogin = React.forwardRef<HTMLInputElement, InputLoginProps>(
  ({ label, error, icon: Icon, rightElement, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        label={label}
        error={error}
        icon={Icon ? <Icon size={15} /> : undefined}
        rightElement={rightElement}
        {...props}
      />
    );
  }
);

InputLogin.displayName = "InputLogin";
