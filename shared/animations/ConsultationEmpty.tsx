"use client";

import { motion } from "motion/react";
import { Stethoscope, ClipboardPen, Activity, Pill } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";

export default function ConsultationEmpty() {
  const router = useRouter();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 🔥 Background sutil (Anclado abajo a la izquierda, moviéndose hacia arriba) */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.05, 0.12, 0.05],
          x: [0, 40, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[450px] h-[450px] bg-principal/20 rounded-full blur-[140px] -bottom-20 -left-20"
      />

      {/* 🎯 Núcleo visual centrado */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center justify-center w-52 h-52 mt-4"
      >
        {/* Icono principal (Geometría de "Documento/Receta" con rotación sutil) */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [-2, 2, -2], // Balanceo leve simulando escribir o revisar notas
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-interior p-8 rounded-2xl border border-disable/30 shadow-xl relative z-10"
        >
          <Stethoscope size={64} className="text-principal" strokeWidth={1.5} />
        </motion.div>

        {/* 🪐 Iconos orbitando (Fases de la Consulta) */}

        {/* Signos Vitales (Abajo Izquierda) */}
        <motion.div
          animate={{
            y: [0, 8, 0],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute bottom-4 left-0 text-secundario z-0"
        >
          <Activity size={26} strokeWidth={1.5} />
        </motion.div>

        {/* Notas Médicas (Arriba Derecha) */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute top-2 right-0 text-principal z-20"
        >
          <ClipboardPen size={28} strokeWidth={1.5} className="drop-shadow-md" />
        </motion.div>

        {/* Receta/Tratamiento (Arriba Izquierda) */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-6 left-2 text-subtitulo z-0"
        >
          <Pill size={24} strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* 🧠 Texto (Altamente contextual al modelo Medisys) */}
      <motion.div
        className="mt-6 text-center max-w-md z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-encabezado tracking-tight">Inicia una nueva consulta</h2>

        <p className="mt-3 text-sm text-subtitulo leading-relaxed">
          Selecciona un paciente para registrar signos vitales, redactar notas de evolución, asociar diagnósticos CIE-10 y generar
          su receta médica.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="mt-8 z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={() => router.push("/admin/consultations/new")}
          className="px-8 h-12 rounded-xl shadow-lg hover:scale-[1.02] transition disabled:opacity-50 disabled:pointer-events-none"
        >
          Iniciar consulta
        </Button>
      </motion.div>

      {/* Línea decorativa (Línea punteada simulando avance de etapas médicas) */}
      <div className="absolute bottom-0 left-0 w-full opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 1000 100" className="w-full h-20" preserveAspectRatio="none">
          <path
            d="M 0 50 Q 150 20, 250 50 T 500 50 T 750 50 T 1000 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray="8 8" /* Efecto de línea punteada/pasos */
            className="text-principal"
          />
        </svg>
      </div>
    </div>
  );
}
