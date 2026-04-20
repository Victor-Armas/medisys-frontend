"use client";

import React from "react";
import { Plus, Pencil, Trash2, Save, Eye, X, UserPlus } from "lucide-react";

type Variant = "primary" | "danger" | "primary2" | "wairning" | "positive" | "secundario" | "cancelar";
type IconName = "agregar" | "editar" | "eliminar" | "guardar" | "ver" | "cancelar" | "userPlus";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  icon?: IconName;
}
// className = "";
export function Button({ children, className, type = "button", variant = "primary", icon, ...props }: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-sm transition duration-300 gap-2 shadow-md";

  const iconMap = {
    agregar: <Plus size={20} />,
    editar: <Pencil size={16} />,
    eliminar: <Trash2 size={16} />,
    guardar: <Save size={16} />,
    ver: <Eye size={16} />,
    cancelar: <X size={16} />,
    userPlus: <UserPlus size={16} />,
  };

  const variants = {
    primary: "bg-inner-principal text-principal hover:bg-principal-hover2",
    primary2: "bg-principal text-principal-text hover:bg-principal-hover",
    danger: "bg-negative text-negative-text hover:bg-negative-hover",
    wairning: "bg-wairning text-wairning-text hover:bg-wairning-hover",
    positive: "bg-positive text-positive-text hover:bg-positive-hover",
    secundario: "bg-inner-secundario text-secundario hover:bg-secundario-hover",
    cancelar: "bg-disable text-subtitulo hover:bg-gray-300 dark:hover:bg-gray-600",
  };

  return (
    <button type={type} className={`${baseStyles} ${variants[variant]} ${className ?? ""}`} {...props}>
      {icon && iconMap[icon]}
      {children}
    </button>
  );
}
