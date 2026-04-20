"use client";

import React, { createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { Button } from "./button";
import { cn } from "@/shared/lib/utils"; // <-- Estado del Arte: Siempre usar tailwind-merge

// --- Contexto ---
interface DialogContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used inside <Dialog>");
  }
  return context;
}

// --- Componente Padre ---
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  return <DialogContext.Provider value={{ open, onOpenChange }}>{children}</DialogContext.Provider>;
}

// --- Trigger ---
type DialogTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function DialogTrigger({ children, onClick, ...props }: DialogTriggerProps) {
  const { onOpenChange } = useDialog();
  return (
    <button
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(true);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// --- Content (El Contenedor) ---
type DialogContentProps = React.ComponentProps<"div">;

function DialogContent({ children, className }: DialogContentProps) {
  const { open, onOpenChange } = useDialog();

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => onOpenChange(false)} />

      {/* Modal - Eliminamos el p-4 y añadimos overflow-hidden */}
      <div
        className={cn("relative z-10 w-full max-w-3xl rounded-md bg-interior shadow-xl overflow-hidden flex flex-col", className)}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

// --- Header ---
type DialogHeaderProps = React.ComponentProps<"div"> & {
  showClose?: boolean;
};

function DialogHeader({ className, showClose = true, children, ...props }: DialogHeaderProps) {
  const { onOpenChange } = useDialog();

  return (
    <div
      // Añadimos p-5 (o p-6) aquí. Así el fondo tocará los bordes.
      className={cn("flex items-start justify-between gap-4 p-6", className)}
      {...props}
    >
      <div className="flex flex-col gap-1">{children}</div>

      {showClose && (
        <Button
          variant="danger"
          icon="cancelar"
          aria-label="Cerrar diálogo"
          onClick={() => onOpenChange(false)}
          className="shrink-0 p-2"
        />
      )}
    </div>
  );
}

// --- NUEVO: DialogBody (SRP) ---
// Como quitamos el padding del contenedor, creamos un body para envolver el contenido
function DialogBody({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

// --- Title, Description & Footer ---
function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-xl font-semibold text-encabezado leading-none tracking-tight", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-subtitulo", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex justify-end gap-3 p-6 pt-0", className)} {...props} />;
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogBody, // Exportar el nuevo componente
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
