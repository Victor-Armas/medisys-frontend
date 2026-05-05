"use client";

import { motion, type Variants } from "motion/react";
import { Heart } from "lucide-react";

/**
 * Puntos suspensivos animados
 */
function AnimatedDots() {
  return (
    <span className="ml-1 inline-flex w-6">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.25,
            ease: "easeInOut",
          }}
        >
          .
        </motion.span>
      ))}
    </span>
  );
}

export function RouteSystemLoader() {
  // Ciclo total ágil (2.4s)
  const cycle = 2.4;

  /* =========================
     1. LÍNEA IZQUIERDA (0% -> 35%)
  ========================= */
  const leftLineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: [0, 1, 1, 1],
      opacity: [0, 1, 1, 0, 0],
      transition: {
        pathLength: { duration: cycle, repeat: Infinity, times: [0, 0.35, 0.99, 1], ease: "easeIn" },
        opacity: { duration: cycle, repeat: Infinity, times: [0, 0.1, 0.34, 0.35, 1], ease: "linear" },
      },
    },
  };

  /* =========================
     2. CORAZÓN (35% -> 65%)
  ========================= */
  const heartVariants: Variants = {
    idle: { scale: 1, opacity: 0.2 },
    beat: {
      scale: [1, 1, 1.4, 1, 1],
      opacity: [0.2, 0.2, 1, 0.2, 0.2],
      filter: [
        "drop-shadow(0 0 0px rgba(var(--principal), 0))",
        "drop-shadow(0 0 0px rgba(var(--principal), 0))",
        "drop-shadow(0 0 20px rgba(var(--principal), 0.8))",
        "drop-shadow(0 0 0px rgba(var(--principal), 0))",
        "drop-shadow(0 0 0px rgba(var(--principal), 0))",
      ],
      transition: {
        duration: cycle,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.35, 0.5, 0.65, 1],
      },
    },
  };

  /* =========================
     3. LÍNEA DERECHA (65% -> 100%)
  ========================= */
  const rightLineVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: [0, 0, 1, 1],
      opacity: [0, 0, 1, 1, 0],
      transition: {
        pathLength: { duration: cycle, repeat: Infinity, times: [0, 0.65, 0.99, 1], ease: "easeOut" },
        opacity: { duration: cycle, repeat: Infinity, times: [0, 0.64, 0.65, 0.9, 1], ease: "linear" },
      },
    },
  };

  /* =========================
     Trazados EKG Clínicos (PUNTIAGUDOS)
     Se eliminaron las curvas (Q) y se cambiaron a líneas puras (L)
  ========================= */
  const leftPath = "M 0 25 H 40 L 48 0 L 56 25 H 65 L 75 38"; // Punta hacia arriba, luego punta hacia abajo
  const rightPath = "M 125 38 L 135 25 H 145 L 155 0 L 165 25 H 200"; // Regreso puntiagudo, punta alta, y salida

  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center bg-background selection:bg-transparent">
      {/* Glow médico de fondo */}
      <div className="absolute h-44 w-72 rounded-full bg-principal/10 blur-3xl opacity-50" />

      {/* =========================
          CONTENEDOR DEL SISTEMA
      ========================= */}
      <div className="relative flex h-28 w-72 items-center justify-center">
        <svg
          viewBox="0 0 200 50"
          className="absolute inset-0 z-10 h-full w-full text-principal drop-shadow-[0_0_4px_currentColor]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* TRACK FANTASMA */}
          <motion.path
            d={`${leftPath} ${rightPath}`}
            opacity={0.15}
            animate={{ x: [0, -1, 0, 1, 0] }}
            transition={{ duration: cycle, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* LÁSER IZQUIERDO ANIMADO */}
          <motion.path d={leftPath} variants={leftLineVariants} initial="hidden" animate="visible" />

          {/* LÁSER DERECHO ANIMADO */}
          <motion.path d={rightPath} variants={rightLineVariants} initial="hidden" animate="visible" />
        </svg>

        {/* =========================
            CORAZÓN ANIMADO
        ========================= */}
        <motion.div
          variants={heartVariants}
          initial="idle"
          animate="beat"
          className="absolute z-20 flex items-center justify-center text-principal"
        >
          <Heart size={72} className="fill-principal/10 stroke-[1.5]" />
        </motion.div>
      </div>

      {/* =========================
          TEXTO INFERIOR
      ========================= */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <motion.span
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-principal/90"
        >
          Cargando sistema médico
        </motion.span>

        <div className="flex items-center text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
          <span>Iniciando</span>
          <AnimatedDots />
        </div>
      </div>
    </div>
  );
}
