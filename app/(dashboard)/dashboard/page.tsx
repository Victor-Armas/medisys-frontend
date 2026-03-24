"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-sm text-gray-500 mb-1">{user?.email}</p>
        <p className="text-sm text-gray-500 mb-6">Rol: {user?.role}</p>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
