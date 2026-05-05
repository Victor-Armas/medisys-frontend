"use client";

import { motion } from "motion/react";
import { Users, FileText, Heart, CalendarPlus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";

export default function PatientEmpty() {
  const router = useRouter();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 🔥 Background sutil (Movido a la derecha y con otra cadencia) */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.06, 0.12, 0.06],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[500px] h-[500px] bg-principal/20 rounded-full blur-[130px] -top-24 -right-20"
      />

      {/* 🎯 Núcleo visual centrado */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center justify-center w-48 h-48 mt-4"
      >
        {/* Icono principal (Ahora es circular para representar personas) */}
        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-interior p-8 rounded-full border border-disable/30 shadow-xl relative z-10"
        >
          <Users size={64} className="text-principal" strokeWidth={1.5} />
        </motion.div>

        {/* 🪐 Iconos orbitando (Expediente, Salud, Citas) */}
        {/* Expediente (Arriba izquierda) */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [-5, 5, -5],
            opacity: [0.4, 0.9, 0.4],
          }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="absolute top-2 -left-2 text-secundario z-0"
        >
          <FileText size={28} strokeWidth={1.5} />
        </motion.div>

        {/* Salud/Latido (Abajo derecha) */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="absolute bottom-6 -right-4 text-principal z-20"
        >
          <Heart size={26} fill="currentColor" className="fill-principal/20" strokeWidth={1.5} />
        </motion.div>

        {/* Calendario de citas (Abajo centro-izquierda) */}
        <motion.div
          animate={{
            y: [0, 6, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -bottom-2 left-6 text-subtitulo z-0"
        >
          <CalendarPlus size={24} strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      {/* 🧠 Texto */}
      <motion.div
        className="mt-6 text-center max-w-md z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-encabezado tracking-tight">Registra tu primer paciente</h2>

        <p className="mt-3 text-sm text-subtitulo leading-relaxed">
          Crea su expediente y comienza a llevar el historial clínico, notas de evolución y recetas de manera organizada.
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
          onClick={() => router.push("/admin/patients/new")}
          className="px-8 h-12 rounded-xl shadow-lg hover:scale-[1.02] transition disabled:opacity-50 disabled:pointer-events-none"
        >
          Nuevo paciente
        </Button>
      </motion.div>

      {/* Línea decorativa (Onda fluida en lugar de ECG rígido) */}
      <div className="absolute bottom-0 left-0 w-full opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 1000 100" className="w-full h-24" preserveAspectRatio="none">
          <path
            d="M0 50 C 250 120, 750 -20, 1000 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-principal"
          />
        </svg>
      </div>
    </div>
  );
}
