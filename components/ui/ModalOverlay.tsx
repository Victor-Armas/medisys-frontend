"use client";

// components/ui/ModalOverlay.tsx
// Fondo oscuro + centrado. Cierra al hacer click fuera del modal.
// Usado por CreateDoctorModal y AssignDoctorModal.

import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

export function ModalOverlay({ children, onClose }: Props) {
  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* stopPropagation evita que el click dentro del modal cierre el overlay */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full flex justify-center"
      >
        {children}
      </div>
    </div>
  );
}
