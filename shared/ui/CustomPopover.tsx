"use client";

import React, { useState, useRef, useEffect } from "react";

interface Props {
  trigger: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
}

export function CustomPopover({ trigger, children, contentClassName = "" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [positionClass, setPositionClass] = useState("top-[calc(100%+4px)] left-0");

  // Referencia para saber si el clic ocurrió dentro o fuera del componente
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Función que se ejecuta cada vez que el usuario hace clic en cualquier parte
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false); // Cerramos si el clic fue afuera
      }
    }

    if (isOpen) {
      // Solo escuchamos clics si el popover está abierto (optimización)
      document.addEventListener("mousedown", handleClickOutside);

      // Calculamos la posición óptima
      if (popoverRef.current) {
        const rect = popoverRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const vw = window.innerWidth;

        let vertical = "top-[calc(100%+4px)]";
        let horizontal = "left-0";

        // Si el botón está muy abajo en la pantalla (más del 60%), abre hacia arriba
        if (rect.bottom > vh * 0.6) {
          vertical = "bottom-[calc(100%+4px)]";
        }

        // Si el botón está muy a la derecha (más del 60%), abre hacia la izquierda
        if (rect.right > vw * 0.6) {
          horizontal = "right-0";
        }

        setPositionClass(`${vertical} ${horizontal}`);
      }
    }

    // Limpieza del event listener
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    // relative es crucial: hace que el hijo 'absolute' se posicione respecto a este div
    <div className="relative inline-flex flex-col" ref={popoverRef}>
      {/* El Botón Disparador */}
      <div
        onClick={(e) => {
          e.stopPropagation(); // Evita que el clic se propague al calendario
          setIsOpen(!isOpen);
        }}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* El Contenido Flotante */}
      {isOpen && (
        <div
          // z-50 asegura que pase por encima de las otras celdas del calendario
          className={`absolute ${positionClass} z-50 bg-fondo-inputs rounded-md shadow-2xl border border-disable/20 ${contentClassName}`}
          onClick={(e) => e.stopPropagation()} // Evita que clics adentro del popover cierren o disparen otras cosas
        >
          {children}
        </div>
      )}
    </div>
  );
}
