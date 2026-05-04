import { AlertTriangle } from "lucide-react";
import React from "react";

export default function AccessDenied() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-800">Acceso Denegado</h2>
        <p className="text-gray-600 mt-2">No tienes los permisos necesarios para realizar consultas médicas.</p>
      </div>
    </div>
  );
}
