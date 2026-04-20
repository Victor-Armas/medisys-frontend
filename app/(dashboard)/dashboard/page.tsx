"use client";

import { ECGLoader } from "@/shared/ui/ECGLoader";
import { notify } from "@/shared/ui/toaster";
import React from "react";
// ajusta si cambia la ruta

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="flex flex-col gap-4 p-8 rounded-2xl border bg-white dark:bg-zinc-900 shadow-xl">
        <h1 className="text-xl font-semibold">Test Custom Toast System</h1>

        <button
          onClick={() => notify.success("Guardado correctamente", "Los cambios fueron aplicados")}
          className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition"
        >
          Success ✅
        </button>

        <button
          onClick={() => notify.error("Error al guardar", "Verifica los datos ingresados")}
          className="px-4 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition"
        >
          Error ❌
        </button>

        <button
          onClick={() => notify.loading("Guardando cambios...", "Esperando respuesta del servidor")}
          className="px-4 py-2 rounded-xl bg-zinc-800 text-white hover:bg-zinc-900 transition"
        >
          Loading ⏳
        </button>

        <button
          onClick={() => {
            const id = notify.loading("Procesando...");
            setTimeout(() => notify.dismiss(id), 2500);
          }}
          className="px-4 py-2 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition"
        >
          Loading → dismiss automático 🚀
        </button>
      </div>
      <ECGLoader />
    </div>
  );
}
