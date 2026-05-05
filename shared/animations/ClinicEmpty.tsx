"use client";

import { motion } from "motion/react";
import { Building2, Stethoscope, UserPlus, Activity } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface Props {
  onAddClinic?: () => void;
}

export default function ClinicEmpty({ onAddClinic }: Props) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 🔥 Background sutil tipo tu 404 */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.15, 0.08],
          x: [0, 40, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute w-[400px] h-[400px] bg-principal/20 rounded-full blur-[120px] -top-20 -left-20"
      />

      {/* 🎯 Núcleo visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Icono principal */}
        <motion.div
          animate={{
            y: [0, -6, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="bg-interior p-8 rounded-3xl border border-disable/30 shadow-xl"
        >
          <Building2 size={64} className="text-principal" strokeWidth={1.5} />
        </motion.div>

        {/* Iconos orbitando (esto le da el nivel pro) */}
        <div className="relative w-[180px] h-[120px] mt-6">
          <motion.div
            animate={{
              y: [0, -10, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute left-0 top-0 text-secundario"
          >
            <Stethoscope size={28} />
          </motion.div>

          <motion.div
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute right-0 top-2 text-principal"
          >
            <UserPlus size={26} />
          </motion.div>

          <motion.div
            animate={{
              y: [0, -6, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{ duration: 2.8, repeat: Infinity }}
            className="absolute left-1/2 bottom-0 -translate-x-1/2 text-subtitulo"
          >
            <Activity size={24} />
          </motion.div>
        </div>
      </motion.div>

      {/* 🧠 Texto */}
      <motion.div
        className="mt-10 text-center max-w-md z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-encabezado tracking-tight">Crea tu primera clínica</h2>

        <p className="mt-3 text-sm text-subtitulo leading-relaxed">
          Configura tu espacio médico y comienza a gestionar pacientes, citas y consultas en un solo lugar.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="mt-6 z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          onClick={onAddClinic}
          disabled={!onAddClinic}
          className="px-8 h-12 rounded-xl shadow-lg hover:scale-[1.02] transition disabled:opacity-50 disabled:pointer-events-none"
        >
          Crear clínica
        </Button>
      </motion.div>

      {/* Línea decorativa médica (muy sutil) */}
      <div className="absolute bottom-0 left-0 w-full opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 1000 100" className="w-full h-32">
          <path
            d="M0 50 L200 50 L220 30 L240 70 L260 50 L500 50 L520 20 L540 80 L560 50 L800 50 L820 40 L840 60 L860 50 L1000 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-principal"
          />
        </svg>
      </div>
    </div>
  );
}
