import Image from "next/image";
import { Activity } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F3EFFF]">
      <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm border border-gray-100 min-h-[560px]">
        {/* Panel izquierdo */}
        <div className="hidden md:flex md:w-1/2 relative flex-col justify-between p-10">
          <Image
            src="/background.png"
            alt="Consultorio médico"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-brand opacity-50" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Activity size={18} color="white" />
            </div>
            <span className="text-white font-medium text-sm">MediSys</span>
          </div>

          <div className="relative z-10">
            <h2 className="text-white text-3xl font-semibold leading-snug mb-4">
              Siempre atentos
              <br />
              por la salud
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Acceso seguro para el personal médico y administrativo. Solo para
              empleados.
            </p>
          </div>
        </div>

        {/* Panel derecho */}
        <LoginForm />
      </div>

      <p className="mt-6 text-xs text-gray-400">
        © 2026 MediSys — Sistema de gestión médica
      </p>
    </main>
  );
}
