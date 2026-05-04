"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Stethoscope, Home, ArrowLeft, SearchX } from "lucide-react";
import { Button } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-external p-4 relative overflow-hidden font-sans">
      {/* Background blobs for premium feel */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-principal/20 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.15, 0.1],
          x: [0, -40, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secundario/20 rounded-full blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-2xl w-full text-center"
      >
        <div className="flex justify-center mb-10">
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="bg-interior p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-disable/30"
            >
              <div className="relative">
                <SearchX size={80} className="text-principal" strokeWidth={1.2} />
                <motion.div
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -right-2 text-secundario"
                >
                  <Stethoscope size={32} strokeWidth={1.5} />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-4 -left-6 bg-secundario text-white text-[0.65rem] uppercase tracking-[0.2em] font-black px-4 py-2 rounded-full shadow-xl"
            >
              Error Code: 404
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-6xl md:text-8xl font-black text-encabezado mb-4 tracking-tighter leading-none">Oops!</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-subtitulo mb-8 tracking-tight">
            Sección no encontrada en el sistema
          </h2>

          <div className="bg-interior/50 backdrop-blur-md p-6 rounded-2xl border border-disable/20 mb-10 inline-block">
            <p className="text-subtitulo text-sm leading-relaxed max-w-sm">
              Lo sentimos, el expediente o la sección que buscas no parece estar en nuestro sistema médico. Es posible que la
              dirección sea incorrecta o la página haya sido movida.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-5 justify-center items-center"
        >
          <Link href="/dashboard">
            <Button
              variant="primary2"
              className="px-10 h-14 text-sm font-bold rounded-2xl flex items-center gap-3 group shadow-2xl shadow-principal/20 hover:shadow-principal/40 transition-all duration-500 hover:-translate-y-1"
            >
              <Home size={18} />
              Volver al Dashboard
            </Button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-subtitulo hover:text-principal transition-all font-bold text-sm px-6 py-3 rounded-2xl hover:bg-interior/80 border border-transparent hover:border-disable/50 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Página anterior
          </button>
        </motion.div>
      </motion.div>

      {/* Decorative pulse line at the bottom */}
      <div className="absolute bottom-0 left-0 w-full opacity-[0.03] pointer-events-none">
        <svg viewBox="0 0 1000 100" className="w-full h-40">
          <path
            d="M0 50 L150 50 L170 30 L190 70 L210 50 L350 50 L360 10 L380 90 L400 50 L600 50 L610 20 L630 80 L650 50 L800 50 L810 40 L820 60 L830 50 L1000 50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-principal"
          />
        </svg>
      </div>

      {/* Small floating text */}
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-8 text-[10px] uppercase tracking-[0.4em] text-subtitulo font-bold"
      >
        Medisys Digital Healthcare System
      </motion.div>
    </div>
  );
}
